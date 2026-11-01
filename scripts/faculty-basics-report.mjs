import fs from 'node:fs';
import {hasDatedCareer,facultyBasicCoverage,appointmentNeedsReview} from '../dist/faculty.js';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export function facultyBasicsReport(archive,receipt,pass){
 const coverage=facultyBasicCoverage(archive.people),attempts=new Map(pass.records.map(r=>[r.person_id,r]));
 const missing=[];
 for(const p of archive.people)for(const [field,known] of [['current.institution',!!p.current.institution],['current.department',!!p.current.department],['current.role',!!p.current.role],['fields',!!p.fields?.some(f=>String(f).trim())]]){
  if(known)continue;const attempt=attempts.get(p.id);
  missing.push({person_id:p.id,name:p.name,field,profile_url:'https://zyx-dirtystar.github.io/mkt-io-placement/#faculty?faculty_id='+encodeURIComponent(p.id),source_url:attempt?.url||null,retrieval_status:attempt?.status||'not_in_this_source_pass',reason:p.unknowns?.find(g=>g.field===field)?.reason||attempt?.reason||(attempt?.status==='no_individual_homepage_registered'?'No individual homepage registered; existing source references retained.':'No unambiguous person-specific excerpt selected in this review. Retrieved pages are not automatically field-verified.')});
 }
 return {as_of:receipt.checked_at,scope:receipt.scope,changes:receipt.changes,coverage:{...coverage,department_unknown:coverage.total-coverage.department,research_unknown:coverage.total-coverage.research,phd_year_unknown:archive.people.filter(p=>!Number.isInteger(p.phd?.year)).length,no_dated_career:archive.people.filter(p=>!hasDatedCareer(p)).length},membership_reviews:archive.people.filter(appointmentNeedsReview).map(p=>({person_id:p.id,status:p.current.status,review:p.appointment_review||null})),limitations:receipt.limitations,missing_fields:missing};
}
if(process.argv[1]?.endsWith('faculty-basics-report.mjs')){const r=facultyBasicsReport(read('data/faculty.json'),read('data/faculty-basics-receipt-2026-11-02.json'),read('data/research-updates/2026-11-02-faculty-basic-source-pass.json'));fs.writeFileSync('data/faculty-basics-audit-2026-11-02.json',JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({changes:r.changes,coverage:r.coverage}));}
