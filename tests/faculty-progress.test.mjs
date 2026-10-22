import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {receivingProgress,filterReceivingSchools,receivingCsv,filterFaculty} from '../dist/faculty.js';
const catalog=JSON.parse(fs.readFileSync('dist/data/catalog.json','utf8'));
function fixture(){return {history_years:[2023,2024,2025,2026],scope:{ranking:{rows:[{program_id:'a',school:'Alpha University',region:'US'},{program_id:'b',school:'Beta University',region:'CA'}]},asia:[]},faculty:{receiving_scope:{mainland:[]},receiving_checks:[],people:[{id:'p',host_id:'a',name:'Person',aliases:['公开别名'],checked_at:'2026-10-22',phd:{year:null},current:{region:'US'},fields:[],tracks:[],placement_id:null}]}}}
test('published reverse-lookup counts keep receiving scope and person sample separate',()=>{
 const rows=receivingProgress(catalog);
 assert.equal(rows.length,67);assert.equal(rows.filter(h=>h.started).length,new Set([...catalog.faculty.receiving_checks.map(c=>c.host_id),...catalog.faculty.people.map(p=>p.host_id)]).size);
 assert.equal(rows.reduce((s,h)=>s+h.people.length,0),catalog.faculty.people.length);assert.equal(rows.reduce((s,h)=>s+h.linked,0),catalog.faculty.people.filter(p=>p.placement_id).length);
 assert.deepEqual(['US','CA','HK','SG','CN'].map(r=>rows.filter(h=>h.region===r).length),[46,4,5,3,9]);
 assert.ok(rows.every(h=>h.roster_total===null||h.state==='complete'));
});
test('unstarted schools have unknown denominators; individual records only start a partial check',()=>{
 const c=fixture(),rows=receivingProgress(c);
 assert.equal(rows[0].state,'partial');assert.equal(rows[0].checked_at,'2026-10-22');assert.equal(rows[0].missing_year,1);
 assert.equal(rows[1].state,'not_started');assert.equal(rows[1].roster_total,null);assert.equal(rows[1].checked_at,null);
 c.faculty.people.push({...c.faculty.people[0]});assert.equal(receivingProgress(c)[0].people.length,1);
 const csv=receivingCsv(rows);assert.match(csv,/Unknown/);assert.ok(csv.split('\r\n')[1].includes('"1","0","Unknown"'));assert.ok(csv.split('\r\n')[2].includes('"Unknown","Unknown","Unknown"'));
});
test('complete status alone never confirms a department roster, nor does a foreign person ID',()=>{
 const c=fixture();c.faculty.receiving_checks=[{host_id:'a',status:'complete',checked_at:'2026-10-20',sources:[]}];
 assert.equal(receivingProgress(c)[0].state,'needs_review');assert.equal(receivingProgress(c)[0].roster_total,null);
 const check=c.faculty.receiving_checks[0];check.roster={status:'confirmed_complete',scope:'Marketing permanent faculty',checked_at:'2026-10-20',member_ids:['p'],evidence:[{url:'https://example.edu/faculty',quote:'The complete current faculty list contains Person.'}]};
 assert.equal(receivingProgress(c)[0].state,'complete');assert.equal(receivingProgress(c)[0].roster_total,1);
 for(const ids of [['absent'],['p','p']]){check.roster.member_ids=ids;assert.equal(receivingProgress(c)[0].state,'needs_review')}
 check.roster.member_ids=['p'];delete check.roster.evidence[0].quote;assert.equal(receivingProgress(c)[0].state,'needs_review');
});
test('latest school audit wins, while a newer personal date does not claim a newer roster audit',()=>{
 const c=fixture();c.faculty.receiving_checks=[{host_id:'a',status:'partial',checked_at:'2026-10-21'},{host_id:'a',status:'blocked',checked_at:'2026-10-10'}];
 assert.equal(receivingProgress(c)[0].state,'partial');assert.equal(receivingProgress(c)[0].check.checked_at,'2026-10-21');assert.equal(receivingProgress(c)[0].checked_at,'2026-10-22');
 c.faculty.receiving_checks.push({host_id:'b',status:'blocked',checked_at:'2026-10-22'});assert.equal(receivingProgress(c)[1].state,'blocked');assert.equal(receivingProgress(c)[1].roster_total,null);
});
test('school filters combine geography, audit state and public aliases without changing counts',()=>{
 const rows=receivingProgress(catalog);
 assert.equal(filterReceivingSchools(rows,{region:'HK',state:'started'}).length,rows.filter(h=>h.region==='HK'&&h.started).length);
 assert.equal(filterReceivingSchools(rows,{region:'CN',state:'not_started'}).length,rows.filter(h=>h.region==='CN'&&!h.started).length);
 assert.equal(filterReceivingSchools(rows,{state:'complete'}).length,rows.filter(h=>h.state==='complete').length);
 const f=receivingProgress(fixture());assert.equal(filterReceivingSchools(f,{q:'公开别名'})[0].id,'a');assert.equal(filterReceivingSchools(f,{q:'公开别名',region:'CA'}).length,0);
 assert.equal(filterReceivingSchools(f,{state:'all',sort:'checked'})[0].id,'a');
});
test('profile gap drilldowns reconcile with their counters and CSV keeps formula safety',()=>{
 const people=catalog.faculty.people;
 const missing={degree_year:p=>!Number.isInteger(p.phd?.year),cv:p=>!p.cv_url,role_year:p=>!Number.isInteger(p.current.start_year),unlinked:p=>!p.placement_id,linked:p=>!!p.placement_id};
 for(const [gap,check] of Object.entries(missing))assert.equal(filterFaculty(people,{gap},catalog).length,people.filter(check).length,gap);
 const h=receivingProgress(fixture())[0];assert.ok(receivingCsv([{...h,school:'=UNSAFE()'}]).includes('"\'=UNSAFE()"'));
});
