// Public job-title categories, not a verification of an employment contract.
export const OUTCOMES={tt:'Academic faculty · includes inferred cases',non_tt:'Teaching / non-tenure-track faculty',postdoc:'Postdoc / research visit',other:'Industry / other',deferred:'Deferred',unknown:'Unknown',on_market:'On the current job market'};
export const OUTCOME_COLORS={tt:'#165c4f',non_tt:'#8eb9ac',postdoc:'#8a94ce',other:'#d49d56',deferred:'#617c94',unknown:'#dfe4e8',on_market:'#829ea0'};
export const TENURE_LABELS={tenure_track:'Tenure-track',tenured:'Tenured',non_tenure_track:'Non-tenure-track',tt:'Tenure-track',non_tt:'Non-tenure-track',unknown:'Unverified',not_applicable:'Not applicable'};
export const TENURE_EVIDENCE_LABELS={confirmed:'Confirmed by explicit evidence',title_explicit:'Explicit in the source title',inferred:'Inferred from title rules',unknown:'Unverified'};
export function institutionRegion(institution,region){
  const s=String(institution||'');
  if(/(?:HKUST|Hong Kong University of Science and Technology|港科大|香港科技大学).*(?:Guangzhou|广州)|(?:CUHK|Chinese University of Hong Kong|港中文|香港中文大学).*(?:Shenzhen|深圳)|NYU\s*Shanghai|Shanghai\s*(?:NYU|New York University)|上海纽约大学|Duke\s*Kunshan|Kunshan\s*Duke|昆山杜克大学/i.test(s))return 'CN';
  return region||'UNKNOWN';
}
export function classifyPlacement(p={}){
  if(p.status==='deferred'||p.job_kind==='deferred')return 'deferred';
  if(p.status==='on_market'&&!p.destination)return 'on_market';
  if(!p.destination)return 'unknown';
  const role=String(p.role||'').toLowerCase();
  // Specific exceptions precede the generic Assistant Professor match.
  if(/non[- ]?tenure|non[- ]?tenured|instruction|teaching|visiting.*(?:professor|\bap\b)|clinical|adjunct|professor.*practice|in[- ]residence/.test(role))return 'non_tt';
  if(/tenure[- ]?track|tenured/.test(role))return 'tt';
  if(/post[- ]?doc|research fellow|visiting scholar/.test(role))return 'postdoc';
  if(/lecturer/.test(role))return ['UK','AU','NZ'].includes(institutionRegion(p.destination,p.destination_region))?'tt':['US','CA'].includes(p.destination_region)?'non_tt':'unknown';
  if(/assistant professor|associate professor|full professor|^professor\b/.test(role))return 'tt';
  if(['tt','non_tt','postdoc'].includes(p.job_kind))return p.job_kind;
  if(['industry','government','research','other'].includes(p.job_kind))return 'other';
  return 'unknown';
}
export function placementOf(r,basis='final'){
  const final=basis==='final'&&r.final_placement;
  const p=final?{...final,status:final.status||'placed'}:{destination:r.destination,role:r.role,destination_region:r.destination_region,job_kind:r.job_kind,year:r.placement_year,status:r.status};
  return {...p,...appointmentOf(final?p:{...r,...p}),destination_region:institutionRegion(p.destination,p.destination_region),category:classifyPlacement(p),basis:final?'final_verified':'first_observed'};
}
// The legacy chart category is a title rule; tenure is an independent claim.
export function tenureOf(p={}){
  const title=String(p.role||p.title||'');
  const raw=p.tenure_status||p.tenure?.status;
  const explicit=({tt:'tenure_track',non_tt:'non_tenure_track'})[raw]||raw;
  const quote=p.tenure?.quote||p.tenure_quote,links=p.tenure?.source_urls||p.tenure_source_urls||[];
  if(['tenure_track','tenured','non_tenure_track'].includes(explicit)&&(p.tenure_evidence_status||p.tenure?.evidence_status)==='confirmed'&&quote&&links.some(u=>/^https?:\/\//.test(u)))return {tenure_status:explicit,tenure_evidence_status:'confirmed',tenure_quote:quote,tenure_source_urls:links};
  if(/non[- ]?tenure|non[- ]?tenured/i.test(title))return {tenure_status:'non_tenure_track',tenure_evidence_status:'title_explicit'};
  if(/tenure[- ]?track/i.test(title))return {tenure_status:'tenure_track',tenure_evidence_status:'title_explicit'};
  if(/\btenured\b/i.test(title))return {tenure_status:'tenured',tenure_evidence_status:'title_explicit'};
  return {tenure_status:'unknown',tenure_evidence_status:classifyPlacement(p)==='tt'?'inferred':'unknown'};
}
export function appointmentOf(p={}){
  const category=classifyPlacement(p),role=String(p.role||p.title||'');
  const job_family=p.job_family||(/post[- ]?doc/i.test(role)?'postdoc':/visiting scholar/i.test(role)?'visiting':/research fellow/i.test(role)?'research':category==='tt'?'academic':category==='non_tt'?'teaching':p.job_kind==='industry'?'industry':p.job_kind==='government'?'government':p.job_kind==='research'?'research':category==='other'?'other':'unknown');
  return {job_family,...tenureOf(p)};
}
export function placementSummary(records,basis='final'){
  const outcomes=records.map(r=>placementOf(r,basis));
  const known=outcomes.filter(p=>['tt','non_tt','postdoc','other'].includes(p.category));
  const faculty=known.filter(p=>p.category==='tt');
  return {known:known.length,faculty:faculty.length,facultyShare:known.length?faculty.length/known.length:null,confirmedTenure:outcomes.filter(p=>p.tenure_evidence_status==='confirmed').length,inferredFaculty:faculty.filter(p=>p.tenure_evidence_status==='inferred').length,finalVerified:outcomes.filter(p=>p.basis==='final_verified').length,firstFallback:outcomes.filter(p=>p.basis==='first_observed').length,postdoc:known.filter(p=>p.category==='postdoc').length,nonTT:known.filter(p=>p.category==='non_tt').length,other:known.filter(p=>p.category==='other').length,deferred:outcomes.filter(p=>p.category==='deferred').length,unknown:outcomes.filter(p=>p.category==='unknown').length};
}
export function rankMatches(r,band){
  if(!band||band==='all')return true;
  if(band==='unranked')return !r.origin_rank;
  return !!r.origin_rank&&r.origin_rank<=Number(band);
}
export function sortRecords(records,order='year'){
  const recent=(a,b)=>(b.placement_year||b.source_cohort_year||b.graduation_year||0)-(a.placement_year||a.source_cohort_year||a.graduation_year||0)||a.name.localeCompare(b.name);
  return [...records].sort(order==='rank'?(a,b)=>(a.origin_rank||Infinity)-(b.origin_rank||Infinity)||a.school.localeCompare(b.school)||recent(a,b):order==='school'?(a,b)=>a.school.localeCompare(b.school)||recent(a,b):recent);
}
