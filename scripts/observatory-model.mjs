import crypto from 'node:crypto';
import {classifyPlacement} from '../dist/placement.js';

export const digest = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const unique = xs => [...new Set(xs.filter(x => x !== null && x !== undefined && x !== ''))];
const urls = sources => unique((sources || []).map(s => typeof s === 'string' ? s : s.url));
const slug = s => String(s || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
const key = s => String(s || '').normalize('NFKC').trim().toLowerCase();
const date = x => x === null || x === undefined ? null : /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(String(x)) ? String(x) : null;
const precision = x => !x ? 'unknown' : x.length === 4 ? 'year' : x.length === 7 ? 'month' : 'day';
const regionCodes = {'United States':'US','United States of America':'US','Canada':'CA','Hong Kong':'HK','Singapore':'SG','China':'CN','United Kingdom':'UK','France':'FR','Australia':'AU','Germany':'DE','Italy':'IT','Spain':'ES'};
const region = x => regionCodes[x] || x || 'UNKNOWN';
export const AUDIT_STATES = {not_started:'尚未开始',roster_found:'已找到名单',partial:'部分核验',source_reconciled:'来源表已对齐',cohort_complete:'整届名单完整',not_published:'官方尚未发布',insufficient:'资料不足',eligibility_pending:'项目资格待确认'};

export function canonicalize(values, entries, prefix = 'term') {
  const index = new Map(entries.flatMap(t => [t.id, t.label, ...(t.aliases || [])].map(a => [key(a), t.id])));
  return unique((values || []).map(raw => {
    if(index.has(key(raw))) return index.get(key(raw));
    const id = `${prefix}-${slug(raw) || 'term'}-${digest(key(raw)).slice(0,8)}`;
    entries.push({id,label:raw,aliases:[raw],definition:'保留的原始标签；尚待归入受控词表。',status:'unmapped'});
    index.set(key(raw), id);
    return id;
  }));
}

export function appointment(role, jobKind, tenure = null) {
  const s = String(role || '').toLowerCase();
  let family = 'unknown';
  if(/post[- ]?doc/.test(s) || jobKind === 'postdoc') family = 'postdoc';
  else if(/professor|lecturer|instructor/.test(s) || ['faculty','tt','non_tt'].includes(jobKind)) family = 'academic';
  else if(jobKind === 'industry') family = 'industry';
  else if(jobKind === 'government') family = 'government';
  else if(jobKind === 'research') family = 'research';
  else if(/research fellow/.test(s)) family = 'research';
  else if(/visiting scholar/.test(s)) family = 'visiting';
  else if(jobKind === 'other') family = 'other';
  const explicit = tenure?.evidence_status==='confirmed'&&tenure?.quote&&tenure?.source_urls?.some(u=>/^https?:\/\//.test(u)) ? tenure.status : null;
  const excluded = /non[- ]?tenure|teaching|instruction|visiting.*professor|clinical|adjunct|professor.*practice|in[- ]residence/.test(s);
  const titledTT = !excluded && /tenure[- ]?track|tenured/.test(s);
  return {job_family:family,tenure_status:explicit || (excluded ? 'non_tt' : titledTT ? 'tt' : 'unknown'),tenure_evidence_status:explicit ? 'confirmed' : excluded || titledTT ? 'title_explicit' : family === 'academic' ? 'inferred' : 'unknown',...(explicit?{tenure_quote:tenure.quote,tenure_source_urls:tenure.source_urls}:{})};
}

export function buildObservatory({records,programs,coverage,faculty={},scope,config,taxonomy,ioScope=null,jobs=[],researchAudit=null,reviewQueue=[],maintenanceQueue=[],sourceChecks=[],baseline=null,asOf=null}) {
  const as_of = asOf || config.observation_as_of || config.updated_at;
  const today = Date.parse(as_of + 'T00:00:00Z');
  const terms = structuredClone(taxonomy);
  const institutions = [], institutionIndex = new Map();
  const manual = new Map([
    ['stanford graduate school of business','Stanford University'],
    ['chinese university of hong kong','Chinese University of Hong Kong'],
    ['the chinese university of hong kong','Chinese University of Hong Kong'],
    ['hong kong university of science and technology','Hong Kong University of Science and Technology'],
    ['the hong kong university of science and technology','Hong Kong University of Science and Technology'],
    ['hkust','Hong Kong University of Science and Technology'],
    ['cuhk','Chinese University of Hong Kong'],
    ['nus','National University of Singapore']
  ]);
  const schools = new Set(programs.map(p=>p.school));
  function institution(name, r='UNKNOWN', department=null) {
    if(!name) return null;
    const raw=String(name).trim();
    let canonical=manual.get(key(raw)) || raw;
    // Only remove a department suffix if its base is an independently listed school.
    const comma=canonical.indexOf(',');
    if(comma>0 && schools.has(canonical.slice(0,comma)) && /department|school|college|faculty/i.test(canonical.slice(comma+1))) canonical=canonical.slice(0,comma);
    const k=key(canonical);
    let obj=institutionIndex.get(k);
    if(!obj){obj={id:'inst-'+(slug(canonical)||'institution')+'-'+digest(k).slice(0,6),name:canonical,aliases:[],region:region(r),campus:null,departments:[]};institutions.push(obj);institutionIndex.set(k,obj);}
    if(raw!==canonical&&!obj.aliases.includes(raw))obj.aliases.push(raw);
    if(obj.region==='UNKNOWN'&&r)obj.region=region(r);
    if(department&&!obj.departments.includes(department))obj.departments.push(department);
    if(/guangzhou|shenzhen|shanghai|kunshan|广州|深圳|上海|昆山/i.test(raw)&&/hong kong|hkust|cuhk|nyu|duke|港/i.test(raw)){obj.campus=raw;obj.region='CN';}
    return obj.id;
  }
  for(const p of programs)institution(p.school,p.region,p.kind==='marketing'?'Marketing':'Economics');
  const claims=[],events=[],people=[];
  function claim(p,field,value,details={}) {
    const id=`${p.id}:${field}:${digest({value,status:details.status||'legacy_reference',quote:details.quote||null}).slice(0,10)}`;
    const c={id,person_id:p.id,field,value,status:'legacy_reference',source_urls:urls(p.sources),quote:null,source_date:null,fetched_at:null,checked_at:p.checked_at||null,conflict:null,...details};
    if(!['confirmed','provisional','conflict','legacy_reference'].includes(c.status))c.status='legacy_reference';
    if(c.status==='confirmed'&&(!c.quote||!c.source_urls.length))c.status='legacy_reference';
    if(!claims.some(x=>x.id===id))claims.push(c);return id;
  }
  const departmentOf = p => p.department || (String(p.destination||p.institution||'').match(/Department of ([^,]+)/i)?.[1]) || (String(p.role||p.title||'').match(/(?:Professor|Lecturer|Instructor) (?:of|in) (Marketing|Economics|Management|Finance|Business Analytics)/i)?.[1]) || null;
  function event(p,type,value,index=0) {
    const name=value.institution||value.employer||value.destination||null;
    const start=date(value.start_date||value.start||value.start_year||value.year);
    const end=date(value.end_date||value.end||value.end_year);
    const source_urls=value.source_urls?.length?unique(value.source_urls):urls(value.sources?.length?value.sources:p.sources);
    const e={id:`${p.id}:${type}:${index}`,person_id:p.id,type,institution:name,institution_id:institution(name,value.destination_region||value.region,departmentOf(value)),department:departmentOf(value),title:value.title||value.role||null,start,end,date_precision:precision(start),end_precision:precision(end),status:value.status||'legacy_record',source_urls,claim_ids:[],checked_at:value.checked_at||p.checked_at||null,...appointment(value.role||value.title,value.job_kind||value.category,value.tenure)};
    if(type==='market'){e.start=p.market_cycle;e.date_precision='cycle';}
    for(const field of ['institution','title','start','end']) if(e[field]!==null)e.claim_ids.push(claim(p,`events.${type}.${index}.${field}`,e[field],{source_urls,status:'legacy_reference',annotation:value.evidence||null}));
    const sourceFields=type==='graduation'?['graduation_year','school','program']:type==='first_job'?['placement_year','placement_start_date','destination','role','tenure.status']:type==='final_arrangement'?['final_placement']:type==='subsequent_job'?['subsequent']:['current','current.tenure_status'];
    for(const c of claims.filter(c=>c.person_id===p.id&&c.status!=='legacy_reference'&&sourceFields.includes(c.field)))e.claim_ids.push(c.id);
    if(value.tenure?.quote&&value.tenure?.source_urls?.length)e.claim_ids.push(claim(p,`events.${type}.${index}.tenure_status`,e.tenure_status,{status:value.tenure.evidence_status==='confirmed'?'confirmed':'legacy_reference',quote:value.tenure.evidence_status==='confirmed'?value.tenure.quote:null,source_urls:value.tenure.source_urls,checked_at:value.tenure.checked_at||p.checked_at}));
    if(value.claim_ids)e.claim_ids=unique([...e.claim_ids,...value.claim_ids]);
    events.push(e);return e.id;
  }
  for(const raw of records){
    const p=structuredClone(raw);p.institution_id=institution(p.school,p.origin);
    p.target_scope=[...(scope?.ranking?.rows||[]),...(scope?.asia||[])].some(x=>x.program_id===p.program_id)?scope.id:null;
    p.origin_rank=programs.find(x=>x.id===p.program_id)?.kind==='marketing'?scope?.ranking?.rows?.find(x=>x.program_id===p.program_id)?.rank||null:null;
    const exactIOFields=(p.fields||[]).filter(x=>/^(?:Empirical Industrial Organi[sz]ation|Theoretical Industrial Organi[sz]ation|Industrial Organi[sz]ation Theory)$/i.test(x));
    const exactIOTracks=exactIOFields.map(x=>/^empirical/i.test(x)?'empirical_io':'theory_io');
    p.research={tracks:canonicalize([...(p.tracks||[]),...exactIOTracks],terms.tracks,'track'),topics:canonicalize(p.topics||[],terms.topics,'topic'),methods:canonicalize(p.methods||[],terms.methods,'method'),raw:{tracks:p.tracks||[],topics:p.topics||[],methods:p.methods||[]},classification_status:p.research_classification?.status==='explicit'?'explicit':p.research_inference?.status==='provisional'?'provisional':p.tracks?.some(t=>['qm','cb','strategy'].includes(t))||exactIOFields.length?'legacy_reference':'unclassified',provisional_tracks:canonicalize(p.research_inference?.tracks||[],terms.tracks,'track'),normalization_evidence:exactIOFields.map(value=>({raw:value,status:'legacy_reference',rule:'完整原文同义词标准化；不增加核验证据等级。'}))};
    p.claim_ids=[];p.event_ids=[];p.faculty_ids=[];
    for(const field of ['school','program_id','graduation_year','placement_year','source_cohort_year','market_cycle','destination','role','tracks','topics','methods','jmp','homepage','cv_url'])if(p[field]!==null&&p[field]!==undefined&&(!Array.isArray(p[field])||p[field].length))p.claim_ids.push(claim(p,field,p[field],{annotation:['tracks','topics','methods'].includes(field)?p.field_evidence||null:null}));
    for(const c of raw.claims||[]){const id=claim(p,c.field,c.value,{...c,source_urls:c.source_urls||urls(c.sources),status:c.status||'confirmed'});p.claim_ids.push(id);}
    if(p.graduation_year)p.event_ids.push(event(p,'graduation',{institution:p.school,region:p.origin,title:p.program,start_year:p.graduation_year,status:'recorded_degree'}));
    if(p.market_cycle)p.event_ids.push(event(p,'market',{institution:p.school,region:p.origin,title:'公开求职季',status:p.status}));
    if(p.destination)p.event_ids.push(event(p,'first_job',{institution:p.destination,region:p.destination_region,department:p.destination_department,role:p.role,start_date:p.placement_start_date,start_year:p.placement_year,job_kind:p.job_kind,status:p.status,tenure:p.tenure}));
    if(p.final_placement)p.event_ids.push(event(p,'final_arrangement',p.final_placement));
    for(const [i,s] of (p.subsequent||[]).entries())p.event_ids.push(event(p,'subsequent_job',s,i));
    p.appointment=appointment(p.role,p.job_kind,p.tenure);
    people.push(p);
  }
  for(const f of faculty.people||[]){
    let p=f.placement_id&&people.find(p=>p.id===f.placement_id);
    if(!p){p={id:f.id,name:f.name,aliases:f.aliases||[],school:f.phd?.school||null,program_id:f.phd?.program_id||null,origin:f.phd?.region||'UNKNOWN',graduation_year:f.phd?.year||null,status:'faculty_only',tracks:f.tracks||[],topics:[],methods:[],sources:f.sources||[],checked_at:f.checked_at,homepage:f.homepage,cv_url:f.cv_url,institution_id:institution(f.phd?.school,f.phd?.region),event_ids:[],claim_ids:[],faculty_ids:[],research:{tracks:canonicalize(f.tracks||[],terms.tracks,'track'),topics:[],methods:[],raw:{tracks:f.tracks||[],topics:[],methods:[]},classification_status:'legacy_reference',provisional_tracks:[]}};people.push(p);if(f.phd?.year)p.event_ids.push(event(p,'graduation',{institution:f.phd.school,region:f.phd.region,title:f.phd.program,start_year:f.phd.year,status:'recorded_degree'}));}
    p.faculty_ids.push(f.id);
    if(f.current)p.event_ids.push(event(p,'current_appointment',{...f.current,status:f.current.status||'current_at_check',checked_at:f.checked_at,sources:f.sources},p.faculty_ids.length-1));
    // Reverse lookup adds observed career segments; it never rewrites the placement first/final job.
    for(const [i,e] of (f.career_events||[]).entries()){
      if(e.type==='current_appointment'&&e.institution===f.current?.institution&&e.start_year===f.current?.start_year)continue;
      p.event_ids.push(event(p,e.type||'appointment',{...e,status:e.status||'source_reported',checked_at:f.checked_at},100+i));
    }
    for(const [field,value]of [['phd.school',f.phd?.school],['phd.program',f.phd?.program],['phd.year',f.phd?.year],['current.role',f.current?.role],['current.start_year',f.current?.start_year]]){
      if(value===null||value===undefined)continue;
      const sources=(f.sources||[]).filter(s=>s.supports?.some(k=>k===field||k===field.split('.')[0]));
      const exact=sources.find(s=>s.quote?.toLowerCase().includes(String(value).toLowerCase()));
      p.claim_ids.push(claim(p,'faculty.'+field,value,{source_urls:exact?[exact.url]:urls(sources.length?sources:f.sources),quote:exact?.quote||sources.find(s=>s.quote)?.quote||null,status:exact?'confirmed':'provisional',annotation:'字段由接收端资料核验；仅原文摘录明确包含该值时列为明确确认，其余保留来源定位待逐字段补证。',checked_at:exact?.checked_at||f.carried_forward?.find(c=>c.field===field)?.checked_at||f.checked_at}));
    }
    for(const [i,gap]of (f.unknowns||[]).entries())if(gap.values||/冲突|conflict/i.test(gap.reason||''))p.claim_ids.push(claim(p,'faculty.'+(gap.field||'conflict')+'.'+i,gap.values||null,{status:'conflict',source_urls:gap.source_urls||urls(f.sources),conflict:gap.reason,checked_at:f.checked_at}));
  }
  const knownOutcome=r=>r.status==='placed'&&!!r.destination;
  const audit=coverage.map(c=>{
    const members=c.record_ids.map(id=>records.find(r=>r.id===id)).filter(Boolean);
    const program=programs.find(p=>p.id===c.program_id);
    const outcome_known=members.filter(knownOutcome).length;
    const fullEvidence=!!c.cohort_complete&&Array.isArray(c.completeness_evidence)&&c.completeness_evidence.length>0;
    return {...c,id:c.program_id+':'+c.period,eligibility:program?.eligibility||'pending',roster_status:fullEvidence?'cohort_complete':c.status,outcome_known,outcome_unknown:members.length-outcome_known,outcome_complete:fullEvidence&&members.length===outcome_known};
  });
  // Materialize missing current-cycle checks for both universes without asserting a source visit.
  const targetIds=new Set([...(scope?.ranking?.rows||[]),...(scope?.asia||[])].map(x=>x.program_id));
  const ioIds=ioScope?.program_ids||programs.filter(p=>p.kind==='economics').map(p=>p.id);
  for(const id of unique([...targetIds,...ioIds]))if(!audit.some(a=>a.program_id===id&&a.period===config.current_cycle)){
    const p=programs.find(x=>x.id===id);audit.push({id:id+':'+config.current_cycle,program_id:id,period:config.current_cycle,status:'not_started',roster_status:'not_started',eligibility:p?.eligibility||'pending',listed_count:null,record_ids:[],cohort_complete:false,outcome_known:0,outcome_unknown:0,outcome_complete:false,checked_at:null,sources:[],notes:'本季尚未核对；生成空核验单元不代表访问过来源。'});
  }
  const gaps={research_missing:records.filter(r=>r.tracks.includes('marketing')&&!r.tracks.some(t=>['qm','cb','strategy'].includes(t))).map(r=>r.id),outcome_missing:records.filter(r=>r.status==='outcome_unknown').map(r=>r.id),year_missing:records.filter(r=>r.status==='placed'&&!r.placement_year).map(r=>r.id),role_missing:records.filter(r=>r.destination&&classifyPlacement(r)==='unknown').map(r=>r.id),title_missing:records.filter(r=>r.destination&&!r.role).map(r=>r.id),cv_missing:records.filter(r=>!r.cv_url).map(r=>r.id),jmp_missing:records.filter(r=>!r.jmp).map(r=>r.id)};
  const conflictClaims=claims.filter(c=>c.status==='conflict'||c.conflict);
  const notesConflicts=records.filter(r=>/conflict|冲突|差异|顺序.*待|顺序.*未知/i.test(r.notes||'')).map(r=>({id:r.id+':legacy_conflict',person_id:r.id,field:'notes',value:r.notes,status:'review_required',source_urls:urls(r.sources),quote:null,checked_at:r.checked_at,conflict:'历史备注含差异或冲突，尚未统一字段级裁决。'}));
  const freshness=records.map(r=>({person_id:r.id,checked_at:r.checked_at||null,age_days:r.checked_at?Math.floor((today-Date.parse(r.checked_at+'T00:00:00Z'))/86400000):null}));
  const metrics={people:records.length,all_people:people.length,faculty_only:people.filter(p=>p.status==='faculty_only').length,marketing:records.filter(r=>r.tracks.includes('marketing')).length,io:records.filter(r=>r.tracks.includes('io')).length,programs:programs.length,target_programs:targetIds.size,source_reconciled:audit.filter(c=>c.status==='source_reconciled').length,complete_cohorts:audit.filter(c=>c.roster_status==='cohort_complete').length,research_missing:gaps.research_missing.length,outcome_missing:gaps.outcome_missing.length,year_missing:gaps.year_missing.length,role_missing:gaps.role_missing.length,cv:records.filter(r=>r.cv_url).length,jmp:records.filter(r=>r.jmp).length,final_verified:records.filter(r=>r.final_placement).length,final_fallback:records.filter(r=>!r.final_placement&&r.destination).length,stale_180_days:freshness.filter(f=>f.age_days===null||f.age_days>180).length,claims:claims.length,confirmed_claims:claims.filter(c=>c.status==='confirmed').length,legacy_claims:claims.filter(c=>c.status==='legacy_reference').length,conflicts:conflictClaims.length+notesConflicts.length,jobs:jobs.length};
  const by_program=programs.map(p=>{const members=records.filter(r=>r.program_id===p.id);return {program_id:p.id,people:members.length,complete_cohorts:audit.filter(c=>c.program_id===p.id&&c.roster_status==='cohort_complete').length,known_outcomes:members.filter(knownOutcome).length,unknown_outcomes:members.filter(r=>!knownOutcome(r)).length};});
  const normalizedJobs=jobs.map(j=>({...j,institution_id:institution(j.institution,j.region,j.department),tracks:canonicalize(j.tracks||[],terms.tracks,'track'),positions:j.positions??null,source_urls:urls(j.sources),status:j.status||'unknown',published_at:j.published_at||null,deadline:j.deadline||null,tenure_status_raw:j.tenure_status,tenure_status:j.tenure_status==='confirmed_tt'?'tt':j.tenure_status==='confirmed_non_tt'?'non_tt':j.tenure_status||'unknown',tenure_evidence_status:j.tenure_status?.startsWith('confirmed_')?'confirmed':j.tenure_evidence_status||'unknown'}));
  const review=Array.isArray(reviewQueue)?reviewQueue:reviewQueue.items||[];
  const queue=[...review.map((q,i)=>({id:q.id||'legacy-review-'+i,kind:'research_review',status:'pending',...q})),...(Array.isArray(maintenanceQueue)?maintenanceQueue:maintenanceQueue.items||[])];
  for(const c of [...conflictClaims,...notesConflicts])queue.push({id:'conflict-'+c.id,kind:'field_conflict',status:'pending',person_id:c.person_id,field:c.field,source_urls:c.source_urls,checked_at:c.checked_at,reason:c.conflict||'字段来源冲突需要裁决。'});
  const source_entries=Array.isArray(sourceChecks)?sourceChecks:sourceChecks.sources||[];
  for(const s of source_entries.filter(s=>s.changed||s.error))queue.push({id:'source-'+digest(s.url).slice(0,12),kind:s.error?'source_unavailable':'source_changed',status:'pending',source_url:s.url,checked_at:s.fetched_at||null,reason:s.error||'来源内容发生变化；需要人工核验对应字段。',change:s.change||null});
  const baselinePeople=new Map((baseline?.people||[]).map(p=>[p.id,p]));
  const added=records.filter(r=>!baselinePeople.has(r.id)).map(r=>r.id);
  const revised=records.filter(r=>baselinePeople.has(r.id)&&baselinePeople.get(r.id).hash!==digest(r)).map(r=>r.id);
  return {schema_version:'1.0',as_of,config,people,institutions,programs,events,claims,taxonomy:terms,scope,audit_states:AUDIT_STATES,io_scope:ioScope||{id:'io-existing-projects-2026-10-22',label:'Economics IO 独立发现范围',program_ids:ioIds,selection:'现有 Economics 项目起点；项目与 IO 子集名单仍需逐年核验。',frozen_at:as_of},jobs:normalizedJobs,audit,audit_report:researchAudit,quality:{metrics,gaps,freshness,conflicts:[...conflictClaims,...notesConflicts],by_program,source_checks:{last_run:sourceChecks.last_run||null,checked:source_entries.length,changed:source_entries.filter(s=>s.changed).length,unavailable:source_entries.filter(s=>s.error).length}},release:{baseline:{commit:baseline?.commit||null,as_of:baseline?.as_of||null,counts:baseline?.counts||{}},counts:metrics,changes:Object.fromEntries(Object.entries(baseline?.counts||{}).map(([k,v])=>[k,(metrics[k]??0)-v])),added_ids:added,revised_ids:revised},queue:[...new Map(queue.map(x=>[x.id,x])).values()],source_checks:sourceChecks};
}

function bounds(s){
  if(!date(s))return null;
  const y=Number(s.slice(0,4)),m=s.length>=7?Number(s.slice(5,7)):null,d=s.length>=10?Number(s.slice(8,10)):null;
  if((m!==null&&(m<1||m>12))||(d!==null&&(d<1||d>31)))return null;
  if(d&&new Date(Date.UTC(y,m-1,d)).getUTCMonth()!==m-1)return null;
  return {min:Date.UTC(y,(m||1)-1,d||1),max:d?Date.UTC(y,m-1,d):m?Date.UTC(y,m,0):Date.UTC(y,11,31)};
}
export function observeWindow(person,events,years,asOf){
  if(!Number.isInteger(years)||years<0)throw new Error('Observation window must be whole nonnegative years');
  const graduation=events.find(e=>e.person_id===person.id&&e.type==='graduation');
  const gb=bounds(graduation?.start);
  if(!gb)return {status:'graduation_unknown',event:null};
  const shift=n=>{const d=new Date(n);d.setUTCFullYear(d.getUTCFullYear()+years);return d.getTime();};
  const target={min:shift(gb.min),max:shift(gb.max)},as=bounds(asOf);
  if(!as||as.max<target.max)return {status:'not_yet_observable',event:null,target};
  const jobs=events.filter(e=>e.person_id===person.id&&['first_job','subsequent_job','current_appointment'].includes(e.type));
  for(const e of jobs){const a=bounds(e.start),b=bounds(e.end||(e.status==='current_at_check'?e.checked_at:null));if(a&&a.max<=target.min&&b&&b.min>=target.max)return {status:'observed',event:e,target};}
  // An open-ended historical entry is not proof of continuous employment at the horizon.
  return {status:'insufficient_dates_or_followup',event:null,target};
}

export function validateObservatory(data){
  const errors=[];const ids=new Set(data.people.map(p=>p.id));
  if(ids.size!==data.people.length)errors.push('Duplicate people IDs');
  const eventIds=new Set(data.events.map(e=>e.id));if(eventIds.size!==data.events.length)errors.push('Duplicate event IDs');
  const institutions=new Set(data.institutions.map(i=>i.id));if(institutions.size!==data.institutions.length)errors.push('Duplicate institution IDs');
  const claimIds=new Set(data.claims.map(c=>c.id));
  // The same imported field and value may have a legacy and a reviewed claim; IDs must still be distinct.
  if(claimIds.size!==data.claims.length)errors.push('Duplicate claim IDs');
  for(const e of data.events){if(!ids.has(e.person_id))errors.push('Orphan event '+e.id);if(e.institution_id&&!institutions.has(e.institution_id))errors.push('Unknown institution '+e.id);if(e.start&&e.date_precision!=='cycle'&&!bounds(e.start))errors.push('Invalid event date '+e.id);if(e.start&&e.end&&e.start>e.end)errors.push('Inverted interval '+e.id);}
  for(const c of data.claims)if(c.status==='confirmed'&&(!c.quote||!c.source_urls.length))errors.push('Confirmed claim lacks quote/source '+c.id);
  for(const a of data.audit)if(a.roster_status==='cohort_complete'&&(!a.cohort_complete||!a.completeness_evidence?.length||!a.completeness_evidence.every(s=>s.url&&s.quote)))errors.push('Unsupported completeness '+a.id);
  for(const j of data.jobs)if(!j.source_urls?.length)errors.push('Job lacks source '+j.id);
  return errors;
}
