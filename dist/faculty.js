import {csvCell} from './core.js?v=1.2.2';

export const GRAD_GROUPS={recent:'PhD awarded in the archive window',historical:'PhD awarded before the archive window',newer:'PhD awarded after the archive window',unknown:'PhD award year unknown'};
export const ORIGIN_GROUPS={target:'Within the 58-program Marketing scope',extension:'Other programs in the US, Canada, Hong Kong or Singapore',outside:'Outside the doctoral-program scope',unknown:'Doctoral origin unknown'};
export const FACULTY_TYPES={research:'Research faculty',teaching:'Teaching faculty',practice:'Practice faculty',adjunct:'Adjunct',emeritus:'Emeritus',honorary:'Honorary',visiting:'Visiting faculty',postdoc:'Postdoctoral appointment',research_appointment:'Research appointment · separate track',research_membership_pending:'Research membership under review',joint_research:'Joint research appointment',affiliated_research:'Affiliated research faculty'};
export const FACULTY_REGIONS={US:'United States',CA:'Canada',HK:'Hong Kong',SG:'Singapore',CN:'Mainland China',MO:'Macao',UK:'United Kingdom',GB:'United Kingdom',AU:'Australia',TW:'Taiwan',DE:'Germany',FR:'France',NL:'Netherlands',BE:'Belgium',CH:'Switzerland',IT:'Italy',ES:'Spain',IN:'India',IL:'Israel',KR:'South Korea',JP:'Japan'};
export const facultyRegion=value=>FACULTY_REGIONS[value]||value||'Unknown';
export function graduationGroup(person,years){
 const y=person.phd?.year;
 if(!Number.isInteger(y))return 'unknown';
 if(years.includes(y))return 'recent';
 return y<Math.min(...years)?'historical':'newer';
}
export function originGroup(person,catalog){
 const phd=person.phd;
 if(!phd?.school||!phd.region)return 'unknown';
 const ids=[...catalog.scope.ranking.rows,...catalog.scope.asia].map(r=>r.program_id);
 if(ids.includes(phd.program_id))return 'target';
 return ['US','CA','HK','SG'].includes(phd.region)?'extension':'outside';
}
export function receivingSchools(catalog){
 return [...catalog.scope.ranking.rows,...catalog.scope.asia].map(r=>({...r,id:r.program_id,scope_group:'original-58'})).concat((catalog.faculty.receiving_scope.mainland||[]).map(h=>({...h,scope_group:'mainland-9'})),(catalog.faculty.receiving_scope.extensions||[]).map(h=>({...h,scope_group:h.group||'extension'})));
}
export const CHECK_STATES={not_started:'Not started',partial:'Partially checked',complete:'Directory reconciled',blocked:'Source access limited',needs_review:'Completeness under review'};
export const hasDatedCareer=p=>(p.career_events||[]).some(e=>e.institution&&(e.role||e.title)&&(e.start_date||e.end_date||e.start||e.end||Number.isInteger(e.start_year)||Number.isInteger(e.end_year)));
export const appointmentNeedsReview=p=>['indexed_reference','directory_membership_unreconciled','announced_future'].includes(p.current?.status);
export function facultyBasicCoverage(people){return {total:people.length,institution:people.filter(p=>p.current?.institution).length,department:people.filter(p=>p.current?.department).length,title:people.filter(p=>p.current?.role).length,title_unknown:people.filter(p=>!p.current?.role).length,membership_pending:people.filter(appointmentNeedsReview).length};}
export const facultyHasConflict=p=>(p.unknowns||[]).some(g=>/冲突|conflict|不一致|不同/i.test(typeof g==='string'?g:g.reason||''))||(p.phd?.reported_years?.length||0)>1||(p.conflicts||[]).some(c=>c.status!=='resolved'&&!p.resolved_conflicts?.some(r=>r.field===c.field));
// An individual profile never establishes the size or completeness of a department.
export function receivingProgress(catalog){
 const people=[...new Map(catalog.faculty.people.map(p=>[p.id,p])).values()];
 return receivingSchools(catalog).map(host=>{
  const members=people.filter(p=>p.host_id===host.id);
  const checks=catalog.faculty.receiving_checks.filter(c=>c.host_id===host.id).sort((a,b)=>(b.checked_at||'').localeCompare(a.checked_at||''));
  const check=checks[0]||null,roster=check?.roster;
  const ids=roster?.member_ids||[];
  const rosterConfirmed=check?.status==='complete'&&roster?.status==='confirmed_complete'&&!!roster.scope&&!!roster.checked_at&&Array.isArray(roster.evidence)&&roster.evidence.some(s=>/^https?:\/\//.test(s.url)&&typeof s.quote==='string'&&s.quote.trim())&&Array.isArray(ids)&&new Set(ids).size===ids.length&&ids.every(id=>members.some(p=>p.id===id));
  const state=rosterConfirmed?'complete':check?.status==='complete'?'needs_review':['blocked','needs_review'].includes(check?.status)?check.status:check||members.length?'partial':'not_started';
  const dates=[check?.checked_at,...members.map(p=>p.checked_at)].filter(Boolean).sort();
  return {...host,people:members,check,state,started:state!=='not_started',checked_at:dates.at(-1)||null,roster_total:rosterConfirmed?ids.length:null,linked:members.filter(p=>p.placement_id).length,recent:members.filter(p=>graduationGroup(p,catalog.history_years)==='recent').length,missing_year:members.filter(p=>graduationGroup(p,catalog.history_years)==='unknown').length};
 });
}
export function filterReceivingSchools(schools,filters){
 const words=(filters.q||'').toLowerCase().trim().split(/\s+/).filter(Boolean);
 const rows=schools.filter(h=>{
  if(filters.region==='overseas'&&!['US','CA','HK','SG'].includes(h.region))return false;
  if(filters.region==='expanded'&&!['MO','AU'].includes(h.region))return false;
  if(filters.region&&!['all','overseas','expanded'].includes(filters.region)&&h.region!==filters.region)return false;
  if(filters.state==='started'&&!h.started)return false;
  if(filters.state&&!['all','started'].includes(filters.state)&&h.state!==filters.state)return false;
  return words.every(w=>[h.school,h.label,...(h.aliases||[]),h.region,facultyRegion(h.region),...h.people.flatMap(p=>[p.name,...(p.aliases||[])])].join(' ').toLowerCase().includes(w));
 });
 return rows.sort((a,b)=>filters.sort==='name'?a.school.localeCompare(b.school):Number(b.started)-Number(a.started)||(b.checked_at||'').localeCompare(a.checked_at||'')||a.school.localeCompare(b.school));
}
export function receivingCsv(schools){
 const rows=[['School ID','School','Region','Verification status','Faculty records (unknown if not started)','Linked placement records (unknown if not started)','Roster size (unknown unless confirmed)','Latest individual or school check','Original source notes','School evidence URLs','Roster scope (source wording)','Roster checked at','Roster evidence (JSON)']];
 for(const h of schools)rows.push([h.id,h.school||h.label,h.region,CHECK_STATES[h.state],h.started?h.people.length:'Unknown',h.started?h.linked:'Unknown',h.roster_total??'Unknown',h.checked_at||'Not checked',h.check?.notes||'No school-level check recorded',(h.check?.sources||[]).map(s=>s.url).join('; '),h.check?.roster?.scope||'',h.check?.roster?.checked_at||'',JSON.stringify(h.check?.roster?.evidence||[])]);
 return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}
export function filterFaculty(people,filters,catalog){
 const words=(filters.q||'').toLowerCase().trim().split(/\s+/).filter(Boolean);
 const hosts=new Map(receivingSchools(catalog).map(h=>[h.id,h]));
 const rows=people.filter(p=>{
  if(filters.id&&p.id!==filters.id)return false;
  if(filters.region==='overseas'&&!['US','CA','HK','SG'].includes(p.current.region))return false;
  if(filters.region==='expanded'&&!['MO','AU'].includes(p.current.region))return false;
  if(filters.region&&!['all','overseas','expanded'].includes(filters.region)&&p.current.region!==filters.region)return false;
  if(filters.host&&filters.host!=='all'&&p.host_id!==filters.host)return false;
  if(filters.grad&&filters.grad!=='all'&&graduationGroup(p,catalog.history_years)!==filters.grad)return false;
  if(filters.origin&&filters.origin!=='all'&&originGroup(p,catalog)!==filters.origin)return false;
  if(filters.track&&filters.track!=='all'&&!(p.tracks||[]).includes(filters.track))return false;
  if(filters.degreeYear&&filters.degreeYear!=='all'&&String(p.phd?.year)!==String(filters.degreeYear))return false;
  if(filters.career==='dated'&&!hasDatedCareer(p))return false;
  if(filters.career==='missing'&&hasDatedCareer(p))return false;
  if(filters.type&&filters.type!=='all'&&(p.faculty_type||'research')!==filters.type)return false;
  if(filters.gap==='degree_school'&&p.phd?.school)return false;
  if(filters.gap==='career'&&hasDatedCareer(p))return false;
  if(filters.gap==='degree_year'&&Number.isInteger(p.phd?.year))return false;
  if(filters.gap==='cv'&&p.cv_url)return false;
  if(filters.gap==='role_year'&&Number.isInteger(p.current.start_year))return false;
  if(filters.gap==='role'&&p.current.role)return false;
  if(filters.gap==='appointment_review'&&!appointmentNeedsReview(p))return false;
  if(filters.gap==='unlinked'&&p.placement_id)return false;
  if(filters.gap==='linked'&&!p.placement_id)return false;
  if(filters.gap==='conflict'&&!facultyHasConflict(p))return false;
  if(filters.gap==='degree_added'&&!catalog.faculty_followup_update?.existing.degree_year_ids?.includes(p.id))return false;
  if(filters.gap==='career_added'&&!catalog.faculty_followup_update?.existing.dated_career_ids?.includes(p.id))return false;
  const host=hosts.get(p.host_id);
  const text=[p.name,...(p.aliases||[]),p.current.institution,p.current.department,host?.label,...(host?.aliases||[]),p.current.role,facultyRegion(p.current.region),p.phd?.school,p.phd?.program,...(p.fields||[])].join(' ').toLowerCase();
  return words.every(w=>text.includes(w));
 });
 if(filters.sort==='name')rows.sort((a,b)=>a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
 if(filters.sort==='checked')rows.sort((a,b)=>(b.checked_at||'').localeCompare(a.checked_at||'')||a.name.localeCompare(b.name));
 return rows;
}
export function facultyCsv(people,catalog){
 const hosts=new Map(receivingSchools(catalog).map(h=>[h.id,h]));
 const rows=[['Name','Public aliases','Current institution','Current region','Official title (source wording)','Current rank start year (not first-job year)','PhD institution','PhD program','PhD award year','Degree-year group','Doctoral origin group','Research (source wording)','Linked placement ID','Homepage','CV','Checked at','Original source notes','Source URLs','Faculty type','Degree evidence status','Appointment status','Career segments (JSON)','Gaps and conflicts (JSON)','Field evidence (JSON)','Import batch ID','PhD date precision','Other degrees (JSON)','Followup review (JSON)','Reported PhD year (unverified)','Receiving school ID','Receiving scope group','Receiving scope plan IDs','Individual inclusion scope','Recorded school / department']];
 for(const p of people)rows.push([p.name,(p.aliases||[]).join('; '),p.current.institution,p.current.region,p.current.role,p.current.start_year,p.phd?.school,p.phd?.program,p.phd?.year,GRAD_GROUPS[graduationGroup(p,catalog.history_years)],ORIGIN_GROUPS[originGroup(p,catalog)],(p.fields||[]).join('; '),p.placement_id,p.homepage,p.cv_url,p.checked_at,p.notes,(p.sources||[]).map(s=>s.url).join('; '),p.faculty_type||'research',p.phd?.degree_status||p.phd?.verification_status||p.phd?.status||'See field evidence',p.current.status||'official_directory',JSON.stringify(p.career_events||[]),JSON.stringify(p.unknowns||[]),JSON.stringify(p.sources||[]),p.import_batch_id,p.phd?.date_precision||'year_or_unknown',JSON.stringify(p.additional_degrees||p.other_degrees||[]),JSON.stringify({followup:p.followup_review||null,previous:p.backfill_review||null}),p.phd?.reported_year,p.host_id,hosts.get(p.host_id)?.scope_group||'',(catalog.faculty.receiving_scope.extension_plans||[]).filter(plan=>plan.school_ids.includes(p.host_id)).map(plan=>plan.id).join('; '),p.faculty_scope||'See declared school roster scope',p.current.department||null]);
 return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}
