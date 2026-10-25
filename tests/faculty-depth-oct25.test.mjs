import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {hasDatedCareer,facultyHasConflict} from '../dist/faculty.js';
import {depthReport} from '../scripts/depth-report.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const a=read('data/faculty.json'),receipt=read('data/faculty-depth-receipt-2026-10-25.json');
const find=n=>a.people.find(p=>p.name===n);
test('October 25 release reconciles the fixed 419-person gap and preserves historical totals',()=>{
 const r=depthReport(a,{receiptPath:'data/faculty-depth-receipt-2026-10-25.json',asOf:'2026-10-25'});
 assert.equal(receipt.profiles.length,24);assert.ok(receipt.profiles.every(p=>!hasDatedCareer(p.before)));
 assert.equal(r.newly_dated_people,23);assert.equal(r.no_dated_career,396);assert.equal(r.phd_years_added,8);assert.equal(r.phd_year_unknown,331);
 assert.equal(r.career_segments_added,100);assert.equal(r.date_refinements,0);assert.equal(r.complete_career_histories_added,0);
 assert.equal(read('data/faculty-depth-audit-2026-10-24.json').no_dated_career,419);
 assert.deepEqual(r.newly_dated_evidence_types,{academic_or_teaching:23,industry_only:0,visiting_only:0});
 for(const v of receipt.profiles){const p=a.people.find(p=>p.id===v.before.id);assert.equal(p.career_sequence_complete,false);assert.equal(p.placement_id,v.before.placement_id);}
});
test('duplicate CV summaries, open snapshots, visits and degree types stay distinct',()=>{
 const j=find('Julian De Freitas');const dated=j.career_events.filter(e=>hasDatedCareer({career_events:[e]}));assert.equal(dated.filter(e=>(e.title||'').startsWith('Assistant Professor')).length,1);assert.equal(dated.find(e=>(e.title||'').startsWith('Assistant Professor')).start_date,'2021-07-01');
 assert.equal(find('Joseph Priester').phd.program,'Social Psychology');assert.ok(!find('Joseph Priester').unknowns.some(g=>/博士授位年份未获/.test(g.reason)));assert.ok(!find('John Dawes').unknowns.some(g=>g.field==='phd.school'));
 assert.equal(find('Amelie Burgess').phd.year,null,'2018 is honours, not the undated PhD');assert.equal(find('Ivy Chu Dang').phd.year,null,'joining after PhD does not identify award year');
 assert.equal(find('David Jaud').phd.year,null);assert.equal(find('David Jaud').phd.school,'Massey University');assert.equal(find('David Jaud').phd.reported_year,2018);assert.equal(find('Rosie Thuy Pham-Henderson').current.tenure_status,'tenure_track');
 assert.equal(find('Jan-Benedict Steenkamp').phd.year,1989,'2010 honorary doctorate is separate');assert.equal(find('John Dawes').phd.year,1999);
 const g=find('Geeta Menon');assert.ok(g.career_events.some(e=>e.type==='industry'));assert.ok(g.career_events.some(e=>e.type==='visiting'));assert.ok(g.career_events.some(e=>e.source_snapshot_only&&e.source_date==='2026-01-04'));
 assert.equal(facultyHasConflict(find('Wang Haizhong')),true);assert.equal(facultyHasConflict(find('Sarah Moshary')),true);assert.equal(find('Sarah Moshary').current.role,'Associate Professor');assert.ok(find('Sarah Moshary').sources.some(s=>s.supports?.includes('current.role')&&s.quote.includes('May 2026')));
 const pass=read('data/research-updates/2026-10-25-faculty-source-pass.json');assert.equal(pass.people.length,419);assert.equal(pass.people.filter(p=>p.verification==='reviewed_fields_imported').length,24);assert.equal(pass.counts.retrieved_for_review,347);assert.equal(pass.counts.unavailable,36);assert.equal(pass.counts.no_individual_homepage_registered,36);
});
