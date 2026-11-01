import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {applyFacultyBatch} from '../scripts/import-faculty-batch.mjs';
import {hasDatedCareer,facultyBasicCoverage,filterFaculty,facultyAppointmentGroup,appointmentNeedsReview,facultyCsv,facultyRoute} from '../dist/faculty.js';
import {facultyBasicsReport} from '../scripts/faculty-basics-report.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
test('reviewed basic backfill counts unique existing people and preserves all degree and career evidence',()=>{
 const a=read('data/faculty.json'),r=read('data/faculty-basics-receipt-2026-11-02.json');assert.equal(a.people.length,1358);assert.equal(r.profiles.length,727);assert.equal(new Set(r.profiles.map(p=>p.before.id)).size,727);
 const diffs={units:0,titles:0,research:0};for(const {before,after_sha256} of r.profiles){const after=a.people.find(p=>p.id===before.id);assert.equal(hash(after),after_sha256);const expectedDegree=structuredClone(before.phd);if(expectedDegree.region==='GB'){expectedDegree.reported_region='GB';expectedDegree.region='UK'}assert.deepEqual(after.phd,expectedDegree);assert.deepEqual(after.career_events,before.career_events);assert.equal(after.placement_id,before.placement_id);assert.equal(hasDatedCareer(after),hasDatedCareer(before));assert.equal(after.career_sequence_complete,false);diffs.units+=!before.current.department&&!!after.current.department;diffs.titles+=!before.current.role&&!!after.current.role;diffs.research+=!before.fields.length&&!!after.fields.length;
  for(const field of after.basic_review.fields){assert.ok(after.sources.some(s=>s.supports?.includes(field)&&s.quote&&s.checked_at<=s.reviewed_at),'Missing field evidence '+after.id+' '+field)}
 }
 assert.deepEqual(diffs,{units:338,titles:2,research:511});const b=facultyBasicCoverage(a.people);assert.equal(b.department,1306);assert.equal(b.research,836);assert.equal(b.title_unknown,0);assert.equal(a.people.filter(p=>!hasDatedCareer(p)).length,396);
 const report=facultyBasicsReport(a,r,read('data/research-updates/2026-11-02-faculty-basic-source-pass.json'));assert.equal(report.missing_fields.filter(g=>g.field==='fields').length,522);assert.equal(report.coverage.department_unknown,52);
});
test('Peking titles do not turn independent reports or lecture visits into reconciled current membership',()=>{
 const a=read('data/faculty.json');for(const id of ['faculty-peking-minghuajiang','faculty-peking-siqingpeng']){const p=a.people.find(p=>p.id===id);assert.equal(p.current.role,'教授');assert.equal(p.current.institution,'Peking University');assert.equal(facultyAppointmentGroup(p),'review');assert.ok(appointmentNeedsReview(p));assert.equal(p.phd.year,null);assert.equal(hasDatedCareer(p),false);assert.ok(p.sources.some(s=>s.supports.includes('current.role')&&s.access_status==='content_read'));assert.ok(p.sources.some(s=>s.supports.includes('current.status')));assert.equal(p.current.start_year,null);}
 const j=a.people.find(p=>p.id==='faculty-peking-minghuajiang');assert.equal(j.current.department,'光华管理学院');assert.equal(j.appointment_review.report_period_end,'2025-12-31');assert.ok(!j.current.department.includes('战略'));
 const wait=a.people.find(p=>p.name==='Andrew Wait');assert.equal(wait.current.department,null);assert.ok(wait.unknowns.some(g=>g.field==='current.department'&&/conflict/i.test(g.reason)));
 assert.equal(facultyAppointmentGroup({faculty_type:'visiting',current:{role:'Visiting Professor'}}),'visiting');assert.equal(facultyAppointmentGroup({current:{status:'historical_cv_snapshot'}}),'historical');
});
test('basic-field drilldowns, search, source dates and exports retain the actual scope',()=>{
 const c=read('dist/data/catalog.json'),a=c.faculty.people,b=facultyBasicCoverage(a);for(const [gap,n] of [['has_department',b.department],['department',52],['has_research',836],['research',522],['role',0]])assert.equal(filterFaculty(a,{gap},c).length,n);
 const p=a.find(p=>p.id==='faculty-university-of-maryland-jessicafong');assert.ok(filterFaculty(a,{q:'digital platforms and consumer information'},c).some(x=>x.id===p.id));assert.ok(p.sources.some(s=>s.supports.includes('fields')&&s.fetched_at==='2026-11-01'&&s.reviewed_at==='2026-11-02'));
 const csv=facultyCsv([p],c);assert.match(csv,/Research description evidence status/);assert.match(csv,/source_wording/);assert.match(csv,/2026-11-01/);assert.equal(c.faculty_basic_update.changes.career_segments_added,0);
});
test('reviewed basic batch replay is inert and the same excerpt retains all supported fields',()=>{
 const a=read('data/faculty.json'),records=read('data/records.json'),batch=read('data/research-updates/2026-11-02-faculty-basics-reviewed.json'),before=hash(a);const r=applyFacultyBatch(a,records,batch);assert.equal(r.report.replayed,true);assert.equal(hash(r.archive),before);
 const original={people:[],receiving_checks:[],import_batches:[]};const p={name:'A Person',host_id:'host',homepage:'https://example.edu/people/a',current:{institution:'University',role:'Professor'},phd:{year:null},sources:[{url:'https://example.edu/people/a',quote:'A Person Professor',supports:['current.role']},{url:'https://example.edu/people/a',quote:'A Person Professor',supports:['name']}]};const out=applyFacultyBatch(original,[],{id:'test-fixture-only',checked_at:'2026-11-02',people:[p],schools:[]});assert.deepEqual(out.archive.people[0].sources[0].supports.sort(),['current.role','name']);
});

test('people URLs retain an explicit view after visiting a school and survive legacy coverage inference',()=>{
 const defaults={view:'people',gap:'all',school:'',schoolRegion:'all',q:'',layout:'table'};
 const state={...defaults,school:'university-of-maryland-marketing',schoolRegion:'US',gap:'role'};
 const url=facultyRoute(state,defaults),params=new URLSearchParams(url.split('?')[1]);
 assert.equal(params.get('faculty_view'),'people');assert.equal(params.get('faculty_gap'),'role');assert.equal(params.get('faculty_school'),state.school);
 assert.equal(new URLSearchParams(facultyRoute({...state,view:'school'},defaults).split('?')[1]).get('faculty_view'),'school');
 assert.equal(new URLSearchParams(facultyRoute({...state,id:'faculty-peking-siqingpeng',layout:'cards'},defaults).split('?')[1]).get('faculty_id'),'faculty-peking-siqingpeng');
});
