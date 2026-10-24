import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {filterFaculty,hasDatedCareer,facultyHasConflict} from '../dist/faculty.js';
import {selectDueSources} from '../scripts/check-sources.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
test('runtime faculty index preserves filters, dated careers, conflicts and exact full evidence hydration',()=>{
 const full=read('dist/data/catalog.json'),slim=read('dist/data/catalog-runtime.json');
 for(const f of [{},{career:'dated'},{career:'missing'},{gap:'conflict'},{degreeYear:'2017'},{region:'MO'},{track:'cb'},{gap:'degree_school'}])assert.deepEqual(filterFaculty(slim.faculty.people,f,slim).map(p=>p.id),filterFaculty(full.faculty.people,f,full).map(p=>p.id));
 for(const p of slim.faculty.people){const original=full.faculty.people.find(x=>x.id===p.id);assert.equal(hasDatedCareer(p),hasDatedCareer(original));assert.equal(facultyHasConflict(p),facultyHasConflict(original));const path='dist/'+decodeURIComponent(p.detail_url);assert.deepEqual(read(path),original);}
 assert.ok(fs.statSync('dist/data/catalog-runtime.json').size<fs.statSync('dist/data/catalog.json').size/2);
 const runtime=read('dist/data/observatory-runtime.json'),fullObs=read('dist/data/observatory.json');assert.deepEqual(runtime.quality,fullObs.quality);assert.deepEqual(runtime.jobs,fullObs.jobs);
});
test('tiered source scheduler revisits hiring promptly and does not repeatedly fetch fresh history',()=>{
 const now='2026-10-24T00:00:00Z',items=[{url:'hiring',tier:'hiring'},{url:'old',tier:'historical'},{url:'fresh',tier:'directory'}],previous=items.map(p=>({...p,fetched_at:'2026-10-20T00:00:00Z'}));
 assert.deepEqual(selectDueSources(items,previous,now,10).map(s=>s.url),['hiring']);
 assert.equal(selectDueSources([{url:'never',tier:'historical'},...items],previous,now,1)[0].url,'never');
});
test('reviewed depth import counts unique careers, preserves unknown award years and job ambiguity',()=>{
 const a=read('data/faculty.json'),report=read('data/faculty-depth-audit-2026-10-24.json');assert.equal(report.phd_years_added,6);assert.equal(report.phd_year_unknown,339);
 assert.deepEqual(report.newly_dated_evidence_types,{academic_or_teaching:10,industry_only:1,visiting_only:1});assert.equal(report.complete_career_histories_added,0);
 assert.equal(report.newly_dated_people,12);assert.equal(report.no_dated_career,419);assert.equal(report.career_segments_added,44);assert.equal(report.date_refinements,4);
 const epp=a.people.find(p=>p.name==='Amber Epp');assert.equal(epp.phd.year,2008);assert.ok(epp.sources.some(s=>s.url==='https://guide.wisc.edu/faculty/'&&s.quote.includes('2008')));
 const tami=a.people.find(p=>p.name==='Tami Kim');assert.equal(tami.phd.year,null);assert.equal(tami.phd.reported_year,2017);assert.ok(tami.career_events.some(e=>e.title?.includes('without tenure')&&e.source_snapshot_only));
 assert.equal(tami.career_events.filter(e=>e.start_date||e.start_year||e.start).length,2,'month precision must replace duplicate year intervals');
 assert.ok(tami.sources.some(s=>s.access_status==='unavailable_original_document'&&s.supports.length===0));
 const receipt=read('data/faculty-depth-receipt-2026-10-24.json');
 assert.equal(receipt.profiles.filter(r=>!hasDatedCareer(r.before)&&hasDatedCareer(a.people.find(p=>p.id===r.before.id))).length,12);
 const jobs=read('data/jobs.json');assert.equal(jobs.find(j=>j.id==='nus-marketing-july2027').positions,2);assert.equal(jobs.find(j=>j.id==='polyu-cb-260810006').tenure_status,'unknown');assert.equal(jobs.find(j=>j.id==='melbourne-lecturer-jr014835').deadline,null);
});

test('the two late CV additions contain five distinct dated roles, not complete academic careers',()=>{
 const a=read('data/faculty.json'),receipt=read('data/faculty-depth-receipt-2026-10-24.json');
 for(const [name,count] of [['Aprajita Gautam',4],['Martin Mende',1]]){const p=a.people.find(p=>p.name===name),before=receipt.profiles.find(r=>r.before.id===p.id).before;assert.equal(hasDatedCareer(before),false);assert.equal(hasDatedCareer(p),true);assert.equal(p.career_sequence_complete,false);assert.equal(p.career_events.filter(e=>e.checked_at==='2026-10-24').length,count);assert.ok(p.unknowns.some(g=>g.field==='career_sequence_complete'));}
 const m=a.people.find(p=>p.name==='Martin Mende');assert.equal(m.career_events[0].type,'visiting');assert.equal(m.career_events[0].start_date,'2020-03');assert.equal(m.career_events[0].source_snapshot_date,'2024-10');assert.equal(m.career_events[0].source_snapshot_only,true);assert.equal(m.career_events[0].end_date,null);
 const g=a.people.find(p=>p.name==='Aprajita Gautam'),events=g.career_events.filter(e=>e.type==='industry');assert.deepEqual(events.map(e=>[e.start_year,e.end_year]),[[2018,2018],[2016,2017],[2014,2016],[2011,2014]]);assert.equal(new Set(events.map(e=>[e.institution,e.title,e.start_year].join('|'))).size,4);
});
