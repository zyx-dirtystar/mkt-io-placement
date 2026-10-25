import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {facultyBasicCoverage,appointmentNeedsReview,filterFaculty,hasDatedCareer,facultyCsv,facultyHasConflict} from '../dist/faculty.js';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
test('appointment backfill adds eleven titles without inventing people, degree dates or dated histories',()=>{
 const a=read('data/faculty.json'),r=read('data/faculty-affiliation-receipt-2026-10-25.json');
 assert.deepEqual(r.changes,{titles_added:11,departments_added:11,unknown_titles_before:13,unknown_titles_after:2});
 assert.equal(r.profiles.length,12);assert.equal(a.people.length,1358);
 for(const v of r.profiles){const p=a.people.find(p=>p.id===v.before.id);assert.deepEqual(p.phd,v.before.phd);assert.deepEqual(p.career_events,v.before.career_events);assert.equal(p.placement_id,v.before.placement_id);assert.equal(p.career_sequence_complete,false);assert.equal(hasDatedCareer(p),hasDatedCareer(v.before));}
 assert.equal(a.people.filter(p=>!hasDatedCareer(p)).length,396);assert.equal(a.people.filter(p=>!Number.isInteger(p.phd.year)).length,331);
 const j=a.people.find(p=>p.name==='江晓东');assert.equal(j.current.role,'教授');assert.equal(j.current.start_year,null);assert.equal(j.current.start_date,null);assert.ok(j.career_events.some(e=>e.role==='副教授'&&e.start_year===2010));assert.ok(j.unknowns.some(g=>/Conflict/.test(g.reason)));assert.equal(facultyHasConflict(j),true);
 assert.equal(a.people.find(p=>p.name==='吴芳').current.role,'教授（常任教职）');assert.notEqual(a.people.find(p=>p.name==='吴芳').current.tenure_status,'tenure_track');
 const chen=a.people.find(p=>p.name==='陈杰腾');assert.equal(chen.current.status,'independent_official_report');assert.ok(chen.sources.some(s=>s.source_date==='2026-10-15'&&s.quote.includes('上海交通大学助理教授陈杰腾')));
});
test('affiliation search and gaps remain independent of unknown PhD year and career dates',()=>{
 const c=read('dist/data/catalog.json'),a=c.faculty.people,b=facultyBasicCoverage(a);
 assert.equal(b.institution,1358);assert.equal(b.title,1356);assert.equal(b.title_unknown,2);assert.equal(b.department,968);
 const missing=filterFaculty(a,{gap:'role'},c);assert.deepEqual(missing.map(p=>p.name).sort(),['Minghua Jiang','Siqing Peng']);assert.ok(missing.every(appointmentNeedsReview));
 assert.equal(filterFaculty(a,{gap:'appointment_review'},c).length,b.membership_pending);
 const t=a.find(p=>p.id==='faculty-dartmouth-college-tamikim');assert.equal(t.phd.year,null);assert.equal(t.current.institution,'Dartmouth College');assert.equal(t.current.department,'Tuck School of Business');assert.ok(filterFaculty(a,{q:'Tuck School of Business'},c).some(p=>p.id===t.id));
 const csv=facultyCsv([t],c);assert.match(csv,/Tuck School of Business/);assert.match(csv,/Associate Professor of Business Administration/);
});
