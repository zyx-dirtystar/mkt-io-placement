import {csvCell} from './core.js?v=1.0.0';

export const GRAD_GROUPS={recent:'近四年博士',historical:'较早毕业博士',newer:'较新博士年份',unknown:'博士年份待核验'};
export const ORIGIN_GROUPS={target:'目标 58 项目',extension:'四地区扩展项目',outside:'博士来源范围外',unknown:'博士来源待核验'};
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
 return [...catalog.scope.ranking.rows,...catalog.scope.asia].map(r=>({id:r.program_id,school:r.school,region:r.region})).concat(catalog.faculty.receiving_scope.mainland);
}
export const CHECK_STATES={not_started:'尚未开始',partial:'名单 / 履历部分核验',complete:'官方目录已对齐',blocked:'资料受限',needs_review:'完整性待复核'};
export const hasDatedCareer=p=>(p.career_events||[]).some(e=>e.institution&&(e.role||e.title)&&(e.start_date||e.end_date||Number.isInteger(e.start_year)||Number.isInteger(e.end_year)));
export const facultyHasConflict=p=>(p.unknowns||[]).some(g=>/冲突|conflict|不一致|不同/.test(typeof g==='string'?g:g.reason||''))||(p.phd?.reported_years?.length||0)>1||(p.conflicts||[]).some(c=>c.status!=='resolved'&&!p.resolved_conflicts?.some(r=>r.field===c.field));
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
  if(filters.region&&!['all','overseas'].includes(filters.region)&&h.region!==filters.region)return false;
  if(filters.state==='started'&&!h.started)return false;
  if(filters.state&&!['all','started'].includes(filters.state)&&h.state!==filters.state)return false;
  return words.every(w=>[h.school,h.label,h.region,...h.people.flatMap(p=>[p.name,...p.aliases])].join(' ').toLowerCase().includes(w));
 });
 return rows.sort((a,b)=>filters.sort==='name'?a.school.localeCompare(b.school):Number(b.started)-Number(a.started)||(b.checked_at||'').localeCompare(a.checked_at||'')||a.school.localeCompare(b.school));
}
export function receivingCsv(schools){
 const rows=[['院校 ID','院校','地区','核验状态','已收录教师（未启动为未知）','已关联 placement（未启动为未知）','整系名单人数（未经确认则未知）','最近个案或院校核验日期','核验说明','院校核验来源']];
 for(const h of schools)rows.push([h.id,h.label||h.school,h.region,CHECK_STATES[h.state],h.started?h.people.length:'未知',h.started?h.linked:'未知',h.roster_total??'未知',h.checked_at||'未核验',h.check?.notes||'尚无院校核验记录',(h.check?.sources||[]).map(s=>s.url).join('; ')]);
 return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}
export function filterFaculty(people,filters,catalog){
 const words=(filters.q||'').toLowerCase().trim().split(/\s+/).filter(Boolean);
 return people.filter(p=>{
  if(filters.id&&p.id!==filters.id)return false;
  if(filters.region==='overseas'&&!['US','CA','HK','SG'].includes(p.current.region))return false;
  if(filters.region&&!['all','overseas'].includes(filters.region)&&p.current.region!==filters.region)return false;
  if(filters.host&&filters.host!=='all'&&p.host_id!==filters.host)return false;
  if(filters.grad&&filters.grad!=='all'&&graduationGroup(p,catalog.history_years)!==filters.grad)return false;
  if(filters.origin&&filters.origin!=='all'&&originGroup(p,catalog)!==filters.origin)return false;
  if(filters.track&&filters.track!=='all'&&!p.tracks.includes(filters.track))return false;
  if(filters.type&&filters.type!=='all'&&(p.faculty_type||'research')!==filters.type)return false;
  if(filters.gap==='degree_school'&&p.phd?.school)return false;
  if(filters.gap==='career'&&hasDatedCareer(p))return false;
  if(filters.gap==='degree_year'&&Number.isInteger(p.phd?.year))return false;
  if(filters.gap==='cv'&&p.cv_url)return false;
  if(filters.gap==='role_year'&&Number.isInteger(p.current.start_year))return false;
  if(filters.gap==='unlinked'&&p.placement_id)return false;
  if(filters.gap==='linked'&&!p.placement_id)return false;
  if(filters.gap==='conflict'&&!facultyHasConflict(p))return false;
  if(filters.gap==='degree_added'&&!catalog.faculty_followup_update?.existing.degree_year_ids.includes(p.id))return false;
  if(filters.gap==='career_added'&&!catalog.faculty_followup_update?.existing.dated_career_ids.includes(p.id))return false;
  const text=[p.name,...p.aliases,p.current.institution,p.current.role,p.phd?.school,p.phd?.program,...p.fields].join(' ').toLowerCase();
  return words.every(w=>text.includes(w));
 });
}
export function facultyCsv(people,catalog){
 const rows=[['姓名','公开别名','当前任职机构','当前任职地区','当前职位','当前职级开始年（非首职年）','博士院校','博士项目','博士毕业年','毕业年份分类','博士来源分类','研究方向','已关联 placement ID','个人主页','本人 CV','核验日期','备注','来源','教师类型','学位核验状态','到岗状态','履历片段（JSON）','具体缺口（JSON）','字段证据（JSON）','批次 ID','博士日期精度','其他学位（JSON）','本轮补查（JSON）','博士年线索（未核定）']];
 for(const p of people)rows.push([p.name,p.aliases.join('; '),p.current.institution,p.current.region,p.current.role,p.current.start_year,p.phd?.school,p.phd?.program,p.phd?.year,GRAD_GROUPS[graduationGroup(p,catalog.history_years)],ORIGIN_GROUPS[originGroup(p,catalog)],p.fields.join('; '),p.placement_id,p.homepage,p.cv_url,p.checked_at,p.notes,p.sources.map(s=>s.url).join('; '),p.faculty_type||'research',p.phd?.degree_status||p.phd?.verification_status||p.phd?.status||'见证据',p.current.status||'official_directory',JSON.stringify(p.career_events||[]),JSON.stringify(p.unknowns||[]),JSON.stringify(p.sources),p.import_batch_id,p.phd?.date_precision||'year_or_unknown',JSON.stringify(p.additional_degrees||[]),JSON.stringify({followup:p.followup_review||null,previous:p.backfill_review||null}),p.phd?.reported_year]);
 return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}
