import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {commitPlan} from './batch-import.mjs';

const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const uniq=xs=>[...new Set(xs.filter(Boolean))];
const fold=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g,'');
const canonical=s=>String(s||'').replace(/^The /,'').replace('Hong Kong Polytechnic University','Hong Kong Polytechnic University');
const sourceUrls=p=>(p.sources||[]).map(s=>s.url);
const individual=u=>u&&!/\/alumni\/|phd-placements|people-partners|\/faculty\/?$|\/faculty-list\//i.test(u);
const unionSources=(a=[],b=[])=>[...new Map([...a,...b].map(s=>[s.url+'|'+(s.quote||'')+'|'+(s.label||''),s])).values()];
const hostAliases={penn:'university-of-pennsylvania-marketing',kellogg:'northwestern-university-marketing'};
const normalizeHost=h=>hostAliases[h]||h;
export function applyFacultyBatch(original,originalRecords,batch,programs=[],identities=[]){
 batch={...batch,id:batch.id||batch.batch_id};
 const archive=structuredClone(original),records=structuredClone(originalRecords),checksum=hash(batch);
 archive.import_batches||=[];
 const prior=archive.import_batches.find(b=>b.id===batch.id);
 if(prior){if(prior.sha256!==checksum)throw Error('Batch ID already imported with different content: '+batch.id);return {archive,records,report:{id:batch.id,replayed:true}};}
 if(!batch.id||!batch.checked_at||!Array.isArray(batch.people)||!Array.isArray(batch.schools))throw Error('Invalid faculty batch');
 if(batch.expected_faculty_sha256&&batch.expected_faculty_sha256!==hash(original))throw Error('Faculty precondition failed');
 for(const s of batch.schools)if(archive.receiving_checks.some(c=>c.host_id===normalizeHost(s.host_id)&&c.checked_at>batch.checked_at))throw Error('Stale batch would replace a newer host check: '+s.host_id);
 const report={id:batch.id,added:0,revised:0,linked:0,degree_years_added:0,schools:batch.schools.length};
 const resolved=new Map();
 for(const raw of batch.people){
  const incoming=structuredClone(raw);incoming.host_id=normalizeHost(incoming.host_id);
  const explicit=identities.find(x=>x.host_id===incoming.host_id&&x.name===incoming.name);
  const identity=explicit||incoming;
  let placement_id=identity.placement_id||null;
  if(placement_id&&!identity.identity_evidence)throw Error('Explicit identity requires evidence: '+incoming.name);
  const exactUrls=[incoming.homepage,incoming.cv_url].filter(individual);
  const exact=records.filter(r=>[r.homepage,r.cv_url].filter(individual).some(u=>exactUrls.includes(u)));
  if(!placement_id&&exact.length===1)placement_id=exact[0].id;
  if(!placement_id&&exact.length>1)throw Error('Ambiguous individual URL '+incoming.name);
  const linked=placement_id?records.find(r=>r.id===placement_id):null;
  if(placement_id&&!linked)throw Error('Unknown placement '+placement_id);
  if(linked&&incoming.phd.school&&canonical(incoming.phd.school)!==canonical(linked.school))throw Error('Identity degree school differs: '+incoming.name+' / '+incoming.phd.school+' / '+linked.school);
  const oldCandidates=archive.people.filter(p=>p.host_id===incoming.host_id&&(placement_id&&p.placement_id===placement_id||[p.homepage,p.cv_url].filter(individual).some(u=>exactUrls.includes(u))));
  if(oldCandidates.length>1)throw Error('Ambiguous archived identity '+incoming.name);
  const old=oldCandidates[0];
  if(old?.checked_at>batch.checked_at)throw Error('Stale batch would replace a newer person: '+incoming.name);
  const id=old?.id||placement_id||'faculty-'+incoming.host_id.replace(/-marketing$/,'')+'-'+(fold(incoming.name)||hash(incoming.name).slice(0,12));
  if(archive.people.some(p=>p.id===id&&p!==old))throw Error('ID collision requires reviewed identity '+id);
  incoming.id=id;incoming.placement_id=placement_id||old?.placement_id||null;
  incoming.checked_at=batch.checked_at;incoming.aliases=uniq([...(old?.aliases||[]),...(incoming.aliases||[])]);
  incoming.tracks||=[];incoming.fields||=[];incoming.faculty_type||=/Research Assistant Professor/i.test(incoming.current.role||'')?'research_appointment':'research';incoming.career_sequence_complete=false;
  if(incoming.department&&!incoming.current.department)incoming.current.department=incoming.department;
  if(!incoming.current.status)incoming.current.status=incoming.current.directory_membership?.includes('unreconciled')?'directory_membership_unreconciled':incoming.verification_status?.includes('indexed')?'indexed_reference':'official_directory';
  incoming.unknowns=(incoming.unknowns||[]).map(x=>typeof x==='string'?{field:'biography',reason:x}:x);
  incoming.carried_forward=[...(incoming.carried_forward||[])];
  const carry=(field)=>incoming.carried_forward.push({field,checked_at:old?.checked_at||null,reason:'本批未提供取代该值的新证据；保留既有公开资料，核验日期不前移。'});
  for(const k of ['cv_url','homepage'])if(!incoming[k]&&old?.[k]){incoming[k]=old[k];carry(k);}
  if(!incoming.fields.length&&old?.fields?.length){incoming.fields=old.fields;carry('fields');}
  if(incoming.tracks.every(t=>t==='marketing')&&old?.tracks?.some(t=>t!=='marketing')){incoming.tracks=uniq([...incoming.tracks,...old.tracks]);carry('tracks');}
  if(!individual(incoming.homepage)&&incoming.homepage){incoming.unknowns.push({field:'homepage',reason:'已查来源为集体目录，尚无经核验个人主页。'});incoming.homepage=null;}
  incoming.phd={school:null,program:null,region:null,year:null,...old?.phd,...incoming.phd};
  for(const k of ['school','program','region','year','program_id'])if(incoming.phd[k]===null&&old?.phd?.[k]!=null&&incoming.phd.verification_status!=='training_only'&&!incoming.unknowns.some(g=>g.field==='phd.'+k&&/冲突|conflict/.test(g.reason||''))){incoming.phd[k]=old.phd[k];carry('phd.'+k);}
  if(incoming.phd.year&&(incoming.phd.verification_status==='training_only'||incoming.phd.degree_status==='award_not_verified'))throw Error('Training-only evidence cannot supply an awarded degree year');
  if(linked){
   if(linked.name!==incoming.name)incoming.aliases=uniq([...incoming.aliases,linked.name]);
   incoming.phd.school=linked.school;
   incoming.identity_evidence=identity.identity_evidence||{basis:'exact_individual_url',urls:exactUrls.filter(u=>[linked.homepage,linked.cv_url].includes(u))};
   if(!incoming.phd.year&&linked.graduation_year)incoming.legacy_degree_year={value:linked.graduation_year,source_urls:sourceUrls(linked),status:'not_reverified_in_faculty_batch'};
   if(incoming.phd.year&&!linked.graduation_year&&incoming.phd.verification_status!=='training_only'){
    linked.graduation_year=incoming.phd.year;linked.sources=unionSources(linked.sources,incoming.sources);
    linked.claims||=[];
    const evidence=incoming.sources.find(s=>s.supports?.some(f=>f==='phd'||f==='phd.year')&&s.quote?.includes(String(incoming.phd.year)));
    linked.claims.push({field:'graduation_year',value:incoming.phd.year,status:evidence?'confirmed':'provisional',source_urls:evidence?[evidence.url]:sourceUrls(incoming),quote:evidence?.quote||null,checked_at:batch.checked_at,annotation:'接收端官方教育资料核验；仅补博士授位年，不改变名单年、首职或最终安排。',batch_id:batch.id});
    report.degree_years_added++;
   }else if(incoming.phd.year&&linked.graduation_year&&incoming.phd.year!==linked.graduation_year){
    incoming.unknowns.push({field:'phd.year',reason:'接收端与既有来源博士年不同，保留双方待复核。',values:[incoming.phd.year,linked.graduation_year],source_urls:uniq([...sourceUrls(incoming),...sourceUrls(linked)])});
   }
   report.linked++;
  }
  if(incoming.phd.verification_status==='training_only'||incoming.phd.degree_status==='award_not_verified')incoming.phd.program_id=null;
  else if(!incoming.phd.program_id&&/marketing/i.test(incoming.phd.program||'')&&!/DBA|doctoral studies/i.test(incoming.phd.program))incoming.phd.program_id=programs.find(p=>p.kind==='marketing'&&canonical(p.school)===canonical(incoming.phd.school))?.id||null;
  incoming.sources=unionSources((old?.sources||[]).map(s=>({...s,checked_at:s.checked_at||old.checked_at})),incoming.sources).map(s=>({...s,checked_at:s.checked_at||batch.checked_at}));
  for(const u of [incoming.homepage,incoming.cv_url].filter(Boolean))if(!incoming.sources.some(s=>s.url===u))incoming.sources.push({url:u,label:'官方个人页所链资料；链接登记不代表内容可读',checked_at:batch.checked_at,access_status:'link_recorded'});
  incoming.notes=[incoming.notes,'仅为接收端教师档案；不自动纳入 placement 分母。职业事件是已核实片段，未宣称穷尽首职至今。'].filter(Boolean).join(' ');
  incoming.import_batch_id=batch.id;
  if(old){incoming.previous_versions=[...(old.previous_versions||[]),{...old,previous_versions:undefined}];archive.people[archive.people.indexOf(old)]={...old,...incoming};report.revised++;}
  else {archive.people.push(incoming);report.added++;}
  resolved.set(incoming.host_id+'|'+fold(incoming.name),id);
 }
 for(const raw of batch.schools){
  const s=structuredClone(raw);s.host_id=normalizeHost(s.host_id);
  const ids=(s.roster_names||[]).map(name=>{
   const resolvedId=resolved.get(s.host_id+'|'+fold(name));if(resolvedId)return resolvedId;
   // Directory-to-existing-member reconciliation is local to an already verified host; it never merges two people.
   const match=archive.people.filter(p=>p.host_id===s.host_id&&[p.name,...(p.aliases||[])].some(a=>fold(a)===fold(name)));
   if(match.length!==1)throw Error('Roster member needs explicit reconciliation: '+s.host_id+' / '+name);
   return match[0].id;
  });
  if(new Set(ids).size!==ids.length)throw Error('Duplicate roster member '+s.host_id);
  const cachedOnly=(s.notes||[]).toString().includes('最近缓存')&&(s.access_limitations||[]).some(a=>/404/.test(a.result||''));
  const complete=!!s.complete_evidence&&s.directory_complete!==false&&!cachedOnly;
  const old=archive.receiving_checks.filter(c=>c.host_id===s.host_id);
  archive.receiving_check_history||=[];archive.receiving_check_history.push(...old);
  archive.receiving_checks=archive.receiving_checks.filter(c=>c.host_id!==s.host_id);
  archive.receiving_checks.push({...s,status:complete?'complete':s.directory_status==='blocked'?'blocked':'partial',checked_at:batch.checked_at,sources:unionSources(s.sources||[],[{url:s.directory_url,label:'官方院系目录；范围与访问状态见核验说明',checked_at:batch.checked_at}]),roster:{status:complete?'confirmed_complete':'unconfirmed',scope:s.scope,checked_at:batch.checked_at,member_ids:ids,evidence:s.complete_evidence?[s.complete_evidence]:[],exclusions:s.exclusions||[],all_directory_names:s.all_directory_names||null,separate_rosters:s.separate_rosters||null},batch_id:batch.id});
 }
 archive.updated_at=batch.checked_at;
 archive.import_batches.push({id:batch.id,sha256:checksum,checked_at:batch.checked_at,report});
 return {archive,records,report};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
 const originals=Object.fromEntries(['data/faculty.json','data/records.json'].map(f=>[f,fs.readFileSync(f,'utf8')]));
 let archive=JSON.parse(originals['data/faculty.json']),records=JSON.parse(originals['data/records.json']);
 const programs=read('data/programs.json'),identities=fs.existsSync('data/faculty-identities.json')?read('data/faculty-identities.json'):[];
 const args=process.argv.slice(2),apply=args.includes('--apply'),files=args.filter(a=>a!=='--apply');
 if(!files.length)throw Error('Usage: node scripts/import-faculty-batch.mjs batch.json [...] [--apply]');
 const reports=[];
 for(const f of files){const result=applyFacultyBatch(archive,records,read(f),programs,identities);archive=result.archive;records=result.records;reports.push(result.report);}
 if(apply)commitPlan(process.cwd(),{id:'faculty-import',sha256:hash(reports),noop:reports.every(r=>r.replayed),originals,values:{'data/faculty.json':archive,'data/records.json':records}});
 console.log(JSON.stringify({apply,reports,faculty:archive.people.length,placements:records.length},null,2));
}
