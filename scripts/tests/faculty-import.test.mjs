import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {applyFacultyBatch} from '../import-faculty-batch.mjs';
const person=()=>({name:'Alex Lee',host_id:'host',current:{institution:'Host',region:'US',role:'Assistant Professor',start_year:null},phd:{school:'Origin',program:'Marketing',year:2024,region:'US'},sources:[{url:'https://host.edu/profiles/alex',quote:'2024 PhD Marketing, Origin',supports:['phd.year']}],aliases:[],homepage:'https://host.edu/profiles/alex',career_events:[]});
const batch=()=>({id:'review-1',checked_at:'2026-10-22',people:[person()],schools:[{host_id:'host',directory_url:'https://host.edu/faculty',scope:'Research professors',roster_names:['Alex Lee'],complete_evidence:{url:'https://host.edu/faculty',quote:'Research professors'}}]});
const archive=()=>({people:[],receiving_checks:[]});
test('faculty imports are idempotent, immutable and reject changed batch IDs',()=>{
 const b=batch(),a=archive(),result=applyFacultyBatch(a,[],b);
 assert.equal(a.people.length,0);assert.equal(result.archive.people.length,1);
 const second=applyFacultyBatch(result.archive,[],b);assert.ok(second.report.replayed);assert.deepEqual(second.archive,result.archive);
 b.people[0].current.role='Professor';assert.throws(()=>applyFacultyBatch(result.archive,[],b),/different content/);
});
test('stale host or individual batches and failed version preconditions leave the input intact',()=>{
 const a=applyFacultyBatch(archive(),[],batch()).archive,b=batch();b.id='old';b.checked_at='2025-01-01';const before=JSON.stringify(a);
 assert.throws(()=>applyFacultyBatch(a,[],b),/Stale/);b.schools=[];assert.throws(()=>applyFacultyBatch(a,[],b),/Stale/);
 b.checked_at='2026-10-22';b.expected_faculty_sha256='wrong';assert.throws(()=>applyFacultyBatch(a,[],b),/precondition/);assert.equal(JSON.stringify(a),before);
});
test('matching names do not merge people; exact personal URLs or reviewed identities do',()=>{
 const r={id:'stable',name:'Alex Lee',school:'Origin',graduation_year:null,sources:[],destination:'First employer',placement_year:2023,homepage:'https://origin.edu/alex'};
 let result=applyFacultyBatch(archive(),[r],batch());assert.equal(result.archive.people[0].placement_id,null);
 const b=batch();b.people[0].placement_id='stable';assert.throws(()=>applyFacultyBatch(archive(),[r],b),/requires evidence/);
 b.people[0].identity_evidence={basis:'manual',source_urls:['https://origin.edu/alex','https://host.edu/profiles/alex']};
 result=applyFacultyBatch(archive(),[r],b);assert.equal(result.archive.people[0].placement_id,'stable');assert.equal(result.records[0].destination,'First employer');assert.equal(result.records[0].placement_year,2023);assert.equal(result.records[0].graduation_year,2024);assert.equal(result.records[0].claims[0].status,'confirmed');
});
test('doctoral training does not imply degree award or Marketing program membership',()=>{
 const b=batch();b.people[0].phd.verification_status='training_only';assert.throws(()=>applyFacultyBatch(archive(),[],b),/Training-only/);
 b.people[0].phd.year=null;const r=applyFacultyBatch(archive(),[],b,[{id:'origin-marketing',kind:'marketing',school:'Origin'}]);assert.equal(r.archive.people[0].phd.program_id,null);
});
test('directory-only updates retain earlier CV links and specific research evidence with their real dates',()=>{
 const a=applyFacultyBatch(archive(),[],batch()).archive,p=a.people[0];p.cv_url='https://host.edu/alex-cv.pdf';p.fields=['Structural demand'];p.tracks=['marketing','qm'];p.checked_at='2026-10-01';p.sources.push({url:p.cv_url,label:'Earlier verified CV'});
 const b=batch();b.id='later-directory';b.people[0].fields=[];b.people[0].tracks=['marketing'];b.people[0].cv_url=null;
 const r=applyFacultyBatch(a,[],b).archive.people[0];assert.equal(r.cv_url,p.cv_url);assert.deepEqual(r.fields,p.fields);assert.ok(r.tracks.includes('qm'));assert.equal(r.sources.find(s=>s.url===p.cv_url).checked_at,'2026-10-01');assert.ok(r.carried_forward.some(c=>c.field==='cv_url'&&c.checked_at==='2026-10-01'));
});
test('published directory snapshots retain field gaps, separate appointments and conflicts',()=>{
 const a=JSON.parse(fs.readFileSync('data/faculty.json','utf8'));
 const city=a.receiving_checks.find(c=>c.host_id==='city-university-of-hong-kong-marketing');assert.notEqual(city.status,'complete');
 assert.equal(a.people.find(p=>p.name==='Guanzhong Du').phd.year,null);
 const lee=a.people.find(p=>p.name==='Yih Hwai Lee');assert.equal(lee.phd.year,null);assert.deepEqual(lee.phd.reported_years,[1997,1998]);
 const anya=a.people.find(p=>p.name==='Anya Shchetkina');assert.equal(anya.current.status,'announced_future');
 assert.ok(a.people.some(p=>p.faculty_type==='teaching'));assert.ok(a.people.some(p=>p.career_events?.some(e=>e.type==='postdoc')));
});
test('the release preserves every prior stable ID and routes career sources to the correct event',()=>{
 const base=JSON.parse(fs.readFileSync('data/faculty-baseline-2026-10-22.json','utf8')),a=JSON.parse(fs.readFileSync('data/faculty.json','utf8')),r=JSON.parse(fs.readFileSync('data/records.json','utf8')),d=JSON.parse(fs.readFileSync('dist/data/observatory.json','utf8'));
 assert.deepEqual(r.map(p=>p.id).sort(),base.placement_ids.toSorted());for(const id of base.faculty_ids)assert.ok(a.people.some(p=>p.id===id));
 const raw=r.find(p=>p.id==='harvard-jimin-nam');assert.match(raw.destination,/Ohio/i);
 const e=d.events.find(e=>e.person_id===raw.id&&e.type==='appointment'&&e.institution==='Massachusetts Institute of Technology');assert.equal(e.start,'2025');assert.ok(e.source_urls.some(u=>u.includes('13887')));assert.ok(!e.source_urls.some(u=>u.includes('career-outcomes')));
 assert.ok(!d.events.some(e=>e.person_id===a.people.find(p=>p.name==='Guanzhong Du').id&&e.type==='graduation'));
 assert.equal(d.quality.metrics.complete_cohorts,0);
});
