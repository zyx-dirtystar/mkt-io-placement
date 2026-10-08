import {csvCell,REGIONS} from './core.js?v=0.5.0';
import {placementOf,OUTCOMES} from './placement.js?v=0.5.0';
export const CSV_HEADERS=['姓名','博士院校','博士项目','培养地区','北美研究排名（UTD四刊2021–2025）','领域标签','研究领域','研究主题','研究方法','JMP','JMP核验依据','JMP资料链接','个人主页','CV','求职季','来源名单年','首次入职年','毕业年','首次机构','首次岗位','所选去向口径','统计机构','统计岗位','统计分类','统计地区','最终安排入职年','最终安排状态','最终安排依据','本科院校','本科地区','中国公民公开确认','华裔本人自述','核验备注','来源','核验日期'];
export function csvRows(records,basis='final'){
  return records.map(r=>{const p=placementOf(r,basis);return [r.name,r.school,r.program,REGIONS[r.origin],r.origin_rank,r.tracks.join('; '),r.fields.join('; '),r.topics.join('; '),r.methods.join('; '),r.jmp,r.jmp_evidence,r.jmp_url,r.homepage,r.cv_url,r.market_cycle,r.source_cohort_year,r.placement_year,r.graduation_year,r.destination,r.role,basis,p.destination,p.role,OUTCOMES[p.category],REGIONS[p.destination_region]||p.destination_region,r.final_placement?.year,r.final_placement?.status,r.final_placement?.evidence,r.undergraduate?.institution,REGIONS[r.undergraduate?.region]||'未核验',r.identity?.chinese_national?.value||'unknown',r.identity?.chinese_heritage?.value||'unknown',r.notes,r.sources.map(s=>s.url).join(' | '),r.checked_at]});
}
export function buildCsv(records,basis='final'){return '\uFEFF'+[CSV_HEADERS,...csvRows(records,basis)].map(row=>row.map(csvCell).join(',')).join('\r\n');}
