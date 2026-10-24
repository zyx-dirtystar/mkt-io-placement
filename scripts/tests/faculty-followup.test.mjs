import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {facultyFollowupReport} from '../faculty-followup-report.mjs';
import {hasDatedCareer,filterFaculty,facultyCsv} from '../../dist/faculty.js';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
test('follow-up changes use the fixed 1111-person denominator and count newly exposed conflicts',()=>{
 const c=read('dist/data/catalog.json'),b=read('data/faculty-baseline-followup-2026-10-22.json');
 const r=facultyFollowupReport(c.faculty,b,c.scope,c);
 // Filter the computed observation, while the dated published snapshot stays immutable.
 c.faculty_followup_update=r;
 assert.equal(r.baseline.people,1111);assert.equal(r.baseline.degree_year_unknown,340);assert.equal(r.baseline.dated_career_missing,577);
 assert.equal(r.existing.missing_ids.length,0);assert.equal(r.existing.people,1111);
 assert.equal(r.existing.degree_year_unknown,340-r.existing.degree_years_added+r.existing.degree_years_withdrawn);
 assert.equal(r.existing.dated_career_missing,577-r.existing.dated_career_added);
 assert.equal(r.counts.people,r.existing.people+r.new_people.people);
 for(const [gap,ids]of [['degree_added',r.existing.degree_year_ids],['career_added',r.existing.dated_career_ids],['conflict',r.conflict_ids]])assert.deepEqual(filterFaculty(c.faculty.people,{region:'all',gap},c).map(p=>p.id).sort(),ids.toSorted());
 assert.ok(r.existing.degree_year_ids.every(id=>!Number.isInteger(b.people.find(p=>p.id===id).year)));
 assert.ok(r.existing.dated_career_ids.every(id=>hasDatedCareer(c.faculty.people.find(p=>p.id===id))));
});
test('verified follow-up retains award versus study dates, MD distinction and corrected wrong CV evidence',()=>{
 const c=read('dist/data/catalog.json'),a=c.faculty.people;
 const dina=a.find(p=>p.name==='Dina Mayzlin');assert.equal(dina.phd.year,2002);assert.ok(dina.sources.some(s=>s.quote?.includes('1997')&&s.quote?.includes('2002')));
 const ubel=a.find(p=>p.name==='Peter A Ubel');assert.equal(ubel.phd.year,null);assert.ok(ubel.additional_degrees.some(d=>d.degree==='MD'&&d.year===1988));
 const j=a.find(p=>p.id==='northwestern-jessie-jia');assert.equal(j.cv_url,null);assert.equal(j.phd.year,2026);assert.ok(j.previous_versions.some(p=>p.cv_url?.includes('.png')));assert.ok(j.reviewed_link_corrections.length);
 assert.match(facultyCsv([j],c),/2026/);assert.match(facultyCsv([j],c),/本轮复核|followup|复核/);
});
test('five reconciled school rosters retain identity evidence and UTD does not borrow completeness from a catalogue',()=>{
 const c=read('dist/data/catalog.json'),r=c.faculty_followup_update;
 assert.equal(r.six_schools.length,6);assert.equal(r.six_schools.filter(s=>s.after==='complete').length,5);
 const utd=r.six_schools.find(s=>s.host_id==='university-of-texas-at-dallas-marketing');assert.equal(utd.after,'partial');assert.equal(utd.roster_count,null);assert.ok(utd.access_limitations.length);
 const shervin=c.faculty.people.find(p=>p.name==='Shervin Shahrokhi Tehrani');assert.equal(shervin.phd.year,2018);assert.ok(shervin.additional_degrees.some(d=>d.year===2012));
 const jasmine=c.faculty.people.find(p=>p.id==='columbia-university-jasmine-yang');assert.ok(jasmine.career_events.some(e=>e.institution==='Meta'&&e.start_date==='2025-06'&&e.type==='postdoc'&&e.job_kind==='industry'));
 const fudan=c.faculty.people.find(p=>p.name==='谢晓燕');assert.equal(fudan.phd.year,null);assert.ok(fudan.career_events.some(e=>e.type==='visiting'));assert.ok(!fudan.career_events.some(e=>e.institution.includes('研修班')));
});
