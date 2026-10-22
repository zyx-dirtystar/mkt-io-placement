import * as placements from './placement.js?v=1.0.0';

export const YEAR_BASES={source:'来源名单年',graduation:'博士毕业年',market:'求职季起始年',placement:'首次入职年'};
export const TRACK_NAMES={marketing:'Marketing',qm:'Quant Marketing',cb:'Consumer Behavior',strategy:'Marketing Strategy',io:'Economics / IO',empirical_io:'Empirical IO',theory_io:'Theory IO'};
export const AUDIT_NAMES={not_started:'尚未开始',roster_found:'已找到名单',list_found:'已找到名单',partial:'部分核验',source_reconciled:'来源表已对齐',cohort_verified:'整届名单已确认',cohort_complete:'整届名单已确认',complete:'整届名单已确认',not_published:'官方尚未发布',unpublished:'官方尚未发布',insufficient:'已查但资料不足',eligibility_pending:'项目资格待确认'};
export const TENURE_NAMES={tenure_track:'终身轨',tenured:'已获终身职位',non_tenure_track:'非终身轨',non_tt:'非终身轨',unknown:'Tenure 状态未知',tt:'终身轨',inferred:'规则推定',not_applicable:'不适用'};
export const EVIDENCE_NAMES={confirmed:'明确确认',explicit:'明确确认',title_explicit:'职称明确含轨道表述',inferred:'规则推定',provisional:'暂定',legacy_reference:'历史来源关联',unknown:'尚未确认',conflict:'来源冲突',unclassified:'尚未分类'};
export const REGION_NAMES={US:'美国',CA:'加拿大',HK:'香港',SG:'新加坡',CN:'中国大陆',UK:'英国',AU:'澳大利亚',NZ:'新西兰',EU:'欧洲',FR:'法国',DE:'德国',IT:'意大利',ES:'西班牙',BE:'比利时',UNKNOWN:'地区待核验'};
export const arr=v=>Array.isArray(v)?v:[];
export const unique=xs=>[...new Set(xs.filter(v=>v!==null&&v!==undefined&&v!==''))];
export function labelRegion(v){return REGION_NAMES[v]||v||'地区待核验'}
export function recordYear(r,basis='source'){
 const value=basis==='graduation'?r.graduation_year:basis==='market'?r.market_cycle:basis==='placement'?r.placement_year:r.source_cohort_year;
 const match=String(value??'').match(/^(\d{4})(?:$|[-–])/);
 return match?Number(match[1]):null;
}
export function effectiveRecordTracks(r,includeProvisional=false){return unique([...arr(r.tracks),...arr(r.research?.tracks),...(includeProvisional&&r.research_inference?.status==='provisional'?arr(r.research_inference.tracks):[])]);}
export function canonicalLabel(observatory,kind,id){const item=arr(observatory?.taxonomy?.[kind]).find(t=>t.id===id);return item?.label||TRACK_NAMES[id]||id;}
export function outcomeOf(r,basis='final',observatory={}){
 const p=placements.placementOf(r,basis);
 const type=basis==='final'&&r.final_placement?'final_arrangement':'first_job';
 const event=arr(observatory.events).find(e=>e.person_id===r.id&&e.type===type);
 const classification=placements.appointmentOf?.(p)||placements.tenureOf?.(p)||{};
 const evidenceStatus=event?.tenure_evidence_status||classification.tenure_evidence_status||p.tenure_evidence_status||'unknown';
 const eventTenure=event?.tenure_status==='tt'&&['inferred','unknown'].includes(evidenceStatus)?'unknown':event?.tenure_status;
 return {...p,...classification,job_family:event?.job_family||classification.job_family||p.job_family||p.category||'unknown',tenure_status:eventTenure||classification.tenure_status||p.tenure_status||'unknown',tenure_evidence_status:evidenceStatus,department:event?.department||p.department||null,institution_id:event?.institution_id||null};
}
export function matchesTenure(outcome,evidence='all'){
 if(evidence==='all'||!evidence)return true;
 const status=outcome.tenure_evidence_status||'unknown';
 return evidence==='confirmed'?['confirmed','explicit'].includes(status):evidence==='inferred'?['inferred','provisional'].includes(status):evidence==='title_explicit'?status==='title_explicit':!['confirmed','explicit','inferred','provisional','title_explicit'].includes(status);
}
export function cohortMembership(r,catalog,observatory,f={}){
 const cells=arr(observatory.audit).length?observatory.audit:arr(catalog.coverage);
 return cells.filter(c=>{
  if(c.program_id!==r.program_id||!arr(c.record_ids).includes(r.id))return false;
  // Cohort completeness belongs to its source roster / market season, not a different year's cell.
  if(f.year_basis==='source'&&String(c.period)!==String(r.source_cohort_year))return false;
  if(f.year_basis==='market'&&String(c.period)!==String(r.market_cycle))return false;
  if(f.year_basis==='graduation'&&!['graduation_year','graduation'].includes(c.year_basis))return false;
  if(f.year_basis==='placement'&&!['placement_year','placement','first_job_year'].includes(c.year_basis))return false;
  return !f.year||f.year==='all'||String(c.period).startsWith(String(f.year));
 });
}
export function selectStudyRecords(records,catalog={},observatory={},f={}){
 const programSet=new Set(arr(f.programs));
 return records.filter(r=>{
  if(programSet.size&&!programSet.has(r.program_id))return false;
  if(f.year&&f.year!=='all'&&recordYear(r,f.year_basis)!==Number(f.year))return false;
  if(f.region&&f.region!=='all'&&r.origin!==f.region)return false;
  if(f.track&&f.track!=='all'&&!effectiveRecordTracks(r,f.provisional===true||f.provisional==='include').includes(f.track))return false;
  if(f.complete_only&&f.complete_only!=='all'&&f.complete_only!=='false'&&!cohortMembership(r,catalog,observatory,f).some(c=>c.cohort_complete===true))return false;
  if(f.q&&!([r.name,r.school,r.program,r.destination,...arr(r.aliases),...arr(r.fields)].filter(Boolean).join(' ').toLowerCase().includes(String(f.q).trim().toLowerCase())))return false;
  return matchesTenure(outcomeOf(r,f.basis,observatory),f.tenure||'all');
 });
}
export function summarizeStudy(records,observatory={},basis='final'){
 const outcomes=records.map(r=>outcomeOf(r,basis,observatory));
 const known=outcomes.filter(p=>['tt','non_tt','postdoc','other'].includes(p.category));
 const faculty=known.filter(p=>p.category==='tt');
 const confirmedTT=outcomes.filter(p=>['tenure_track','tenured','tt'].includes(p.tenure_status)&&['confirmed','explicit'].includes(p.tenure_evidence_status));
 return {n:records.length,known:known.length,faculty:faculty.length,all_academic:known.filter(p=>['tt','non_tt'].includes(p.category)).length,facultyShare:known.length?faculty.length/known.length:null,unknown:outcomes.filter(p=>p.category==='unknown').length,on_market:outcomes.filter(p=>p.category==='on_market').length,deferred:outcomes.filter(p=>p.category==='deferred').length,postdoc:outcomes.filter(p=>p.category==='postdoc').length,non_tt:outcomes.filter(p=>p.category==='non_tt').length,other:outcomes.filter(p=>p.category==='other').length,confirmed_tt:confirmedTT.length,tenure_unknown:outcomes.filter(p=>p.tenure_status==='unknown'||!p.tenure_status).length,final_verified:basis==='final'?records.filter(r=>r.final_placement).length:0,final_fallback:basis==='final'?records.filter(r=>!r.final_placement&&r.destination).length:0,final_unobserved:basis==='final'?records.filter(r=>!r.final_placement&&!r.destination).length:0};
}
export function comparisonRows(records,catalog,observatory,f){
 return arr(f.programs).map(id=>{const program=arr(catalog.programs).find(p=>p.id===id)||{id,school:id};const rows=selectStudyRecords(records,catalog,observatory,{...f,programs:[id]});const cells=(arr(observatory.audit).length?observatory.audit:arr(catalog.coverage)).filter(c=>c.program_id===id&&(!f.year||f.year==='all'||String(c.period).startsWith(f.year)));return {program,records:rows,summary:summarizeStudy(rows,observatory,f.basis),cells,complete:cells.filter(c=>c.cohort_complete===true).length};});
}
export function flowRows(records,observatory={},f={}){
 const groups=new Map();
 for(const r of records){const p=outcomeOf(r,f.basis,observatory);const destination=p.destination||'去向尚未核验';const department=p.department||'接收院系待核验';const tracks=effectiveRecordTracks(r,f.provisional===true||f.provisional==='include');const used=f.track&&f.track!=='all'?[f.track]:tracks.filter(t=>t!=='marketing');
  for(const track of used.length?used:tracks.length?tracks:['unclassified']){const key=JSON.stringify([r.program_id,track,p.institution_id||destination,department]);if(!groups.has(key))groups.set(key,{key,program_id:r.program_id,school:r.school,track,destination,department,region:p.destination_region,ids:[],names:[],source_urls:[]});const g=groups.get(key);if(!g.ids.includes(r.id)){g.ids.push(r.id);g.names.push(r.name);g.source_urls=unique([...g.source_urls,...arr(r.sources).map(s=>typeof s==='string'?s:s.url)])}}
 }
 return [...groups.values()].map(g=>({...g,n:g.ids.length})).sort((a,b)=>b.n-a.n||a.school.localeCompare(b.school));
}
function dateRange(value){
 if(!value)return null;const text=String(value);if(/^\d{4}$/.test(text))return {min:Date.parse(text+'-01-01T00:00:00Z'),max:Date.parse(text+'-12-31T23:59:59Z'),precision:'year'};
 if(/^\d{4}-\d{2}$/.test(text)){const [y,m]=text.split('-').map(Number);return {min:Date.UTC(y,m-1,1),max:Date.UTC(y,m,1)-1,precision:'month'}}
 if(/^\d{4}-\d{2}-\d{2}$/.test(text)&&Number.isFinite(Date.parse(text)))return {min:Date.parse(text+'T00:00:00Z'),max:Date.parse(text+'T23:59:59Z'),precision:'day'};return null;
}
export function fixedWindowObservation(person,events=[],years=1,asOf=''){
 const grad=Number(person.graduation_year);if(!Number.isInteger(grad)||grad<1900)return {status:'graduation_unknown',person_id:person.id};
 const observationYear=grad+Number(years),start=Date.UTC(observationYear,0,1),end=Date.UTC(observationYear+1,0,1)-1;
 const asOfRange=dateRange(asOf);if(!asOfRange)return {status:'as_of_unknown',person_id:person.id,year:observationYear};
 if(asOfRange.max<end)return {status:'not_yet_observed',person_id:person.id,year:observationYear};
 const possible=[],certain=[];
 for(const e of events.filter(e=>e.person_id===person.id&&['first_job','final_arrangement','subsequent_job','current_appointment'].includes(e.type)&&!['announced_future','announced','on_market','provisional'].includes(e.status))){
  const s=dateRange(e.start);if(!s)continue;let until=dateRange(e.end);
  // An open end on a historic first job does not establish that the person still held it later.
  if(!until&&!e.source_snapshot_only&&['current','active','ongoing','current_at_check','observed_current'].includes(e.status))until=dateRange(e.checked_at);
  if(!until){if(s.min<=end)possible.push(e);continue;}
  if(s.min<=end&&until.max>=start)possible.push(e);
  if(s.max<start&&until.min>end)certain.push(e);
 }
 const signature=e=>[e.institution_id||e.institution,e.department||'',e.title||''].join('|');
 const signatures=unique(certain.map(signature));
 if(signatures.length===1&&!possible.some(e=>signature(e)!==signatures[0])){const e=certain[0];return {status:'observed',person_id:person.id,year:observationYear,event:e};}
 return {status:signatures.length>1?'multiple_appointments':possible.length?'date_or_continuity_unknown':'path_unknown',person_id:person.id,year:observationYear};
}
export function observationSummary(records,observatory={},years=1){const rows=records.map(r=>fixedWindowObservation(r,arr(observatory.events),years,observatory.as_of));const counts={};for(const r of rows)counts[r.status]=(counts[r.status]||0)+1;return {rows,counts,total:rows.length,known:counts.observed||0};}
export function normalizedJobs(observatory={},catalog={}){const input=observatory.jobs||catalog.jobs||[];return arr(Array.isArray(input)?input:input.jobs||input.postings).map(j=>({...j,institution:j.institution||j.school||j.employer||'机构待核验',tracks:arr(j.tracks),sources:arr(j.sources),positions:Number.isInteger(j.positions)&&j.positions>=0?j.positions:null}));}
export function jobState(job,asOf){const date=String(asOf||'').slice(0,10);if(job.deadline&&date&&String(job.deadline)<date)return 'historical';if(['closed','expired','historical','filled','withdrawn'].includes(job.status))return 'historical';if(['active','open','current','in_progress'].includes(job.status))return 'active';return 'unknown';}
export function filterJobs(jobs,f={},asOf=''){return jobs.filter(j=>(!f.q||[j.institution,j.department,j.title,...j.tracks].filter(Boolean).join(' ').toLowerCase().includes(f.q.toLowerCase()))&&(!f.cycle||f.cycle==='all'||j.cycle===f.cycle)&&(!f.region||f.region==='all'||j.region===f.region)&&(!f.track||f.track==='all'||j.tracks.includes(f.track))&&(!f.status||f.status==='all'||jobState(j,asOf)===f.status)&&(!f.family||f.family==='all'||j.job_family===f.family)&&(!f.institution||f.institution==='all'||j.institution===f.institution)&&(!f.title||f.title==='all'||j.title===f.title));}
export function csvCell(value){let s=typeof value==='object'&&value!==null?JSON.stringify(value):String(value??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function datasetCsv(rows,columns,meta={}){const metaColumns=Object.keys(meta).map(k=>'_'+k);const names=[...metaColumns,...columns];return '\uFEFF'+[names.map(csvCell).join(','),...rows.map(row=>names.map(key=>csvCell(key.startsWith('_')?meta[key.slice(1)]:row[key])).join(','))].join('\r\n');}
