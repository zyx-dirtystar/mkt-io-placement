import {csvCell} from './core.js?v=0.8.0';

export const GRAD_GROUPS={recent:'近四年博士',historical:'历史教师',newer:'较新博士年份',unknown:'博士年份待核验'};
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
export function filterFaculty(people,filters,catalog){
 const words=(filters.q||'').toLowerCase().trim().split(/\s+/).filter(Boolean);
 return people.filter(p=>{
  if(filters.region==='overseas'&&!['US','CA','HK','SG'].includes(p.current.region))return false;
  if(filters.region&&!['all','overseas'].includes(filters.region)&&p.current.region!==filters.region)return false;
  if(filters.host&&filters.host!=='all'&&p.host_id!==filters.host)return false;
  if(filters.grad&&filters.grad!=='all'&&graduationGroup(p,catalog.history_years)!==filters.grad)return false;
  if(filters.origin&&filters.origin!=='all'&&originGroup(p,catalog)!==filters.origin)return false;
  if(filters.track&&filters.track!=='all'&&!p.tracks.includes(filters.track))return false;
  const text=[p.name,...p.aliases,p.current.institution,p.current.role,p.phd?.school,p.phd?.program,...p.fields].join(' ').toLowerCase();
  return words.every(w=>text.includes(w));
 });
}
export function facultyCsv(people,catalog){
 const rows=[['姓名','公开别名','当前任职机构','当前任职地区','当前职位','当前职级开始年（非首职年）','博士院校','博士项目','博士毕业年','毕业年份分类','博士来源分类','研究方向','已关联 placement ID','个人主页','本人 CV','核验日期','备注','来源']];
 for(const p of people)rows.push([p.name,p.aliases.join('; '),p.current.institution,p.current.region,p.current.role,p.current.start_year,p.phd?.school,p.phd?.program,p.phd?.year,GRAD_GROUPS[graduationGroup(p,catalog.history_years)],ORIGIN_GROUPS[originGroup(p,catalog)],p.fields.join('; '),p.placement_id,p.homepage,p.cv_url,p.checked_at,p.notes,p.sources.map(s=>s.url).join('; ')]);
 return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}
