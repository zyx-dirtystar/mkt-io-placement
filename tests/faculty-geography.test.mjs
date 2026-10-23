import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {receivingSchools,receivingProgress,filterReceivingSchools,filterFaculty,facultyRegion,facultyCsv,hasDatedCareer} from '../dist/faculty.js';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const catalog=()=>read('dist/data/catalog.json');

test('the Macao and Go8 receiving scope is independent of the original placement universe',()=>{
 const c=catalog(),plan=read('data/faculty-scope-macao-australia-2026-10-23.json'),hosts=receivingSchools(c);
 assert.equal(plan.schools.filter(h=>h.region==='MO').length,3);
 assert.equal(plan.schools.filter(h=>h.region==='AU').length,8);
 assert.equal(c.scope.ranking.rows.length,50);assert.equal(c.scope.asia.length,8);
 assert.equal(hosts.filter(h=>['US','CA','HK','SG'].includes(h.region)).length,58);
 assert.equal(hosts.filter(h=>h.region==='CN').length,9);
 assert.equal(new Set(hosts.map(h=>h.id)).size,hosts.length);
 assert.equal(hosts.length,78);
 assert.deepEqual(hosts.filter(h=>['MO','AU'].includes(h.region)).map(h=>h.id).sort(),plan.schools.map(h=>h.id).sort());
 assert.equal(facultyRegion('MO'),'Macao');assert.equal(facultyRegion('AU'),'Australia');
 assert.ok(plan.sources.some(s=>s.url==='https://go8.edu.au/about'));
 const adelaide=plan.schools.find(h=>h.id==='adelaide-university-marketing');
 assert.equal(adelaide.school,'Adelaide University');assert.ok(adelaide.predecessors.includes('University of Adelaide'));
});

test('region filters, search aliases and unknown denominators work for the new scope',()=>{
 const c=catalog(),schools=receivingProgress(c);
 assert.equal(filterReceivingSchools(schools,{region:'expanded'}).length,11);
 assert.equal(filterReceivingSchools(schools,{region:'overseas'}).length,58,'Legacy original-region URL retains its scope');
 assert.equal(filterReceivingSchools(schools,{region:'MO',q:'澳门科技大学'}).length,1);
 assert.equal(filterReceivingSchools(schools,{region:'AU',q:'UNSW'}).length,1);
 for(const region of ['MO','AU'])assert.deepEqual(filterFaculty(c.faculty.people,{region},c).map(p=>p.id).sort(),c.faculty.people.filter(p=>p.current.region===region).map(p=>p.id).sort());
 const fake={...c,faculty:{...c.faculty,people:[],receiving_checks:[]}};
 assert.ok(receivingProgress(fake).filter(h=>['MO','AU'].includes(h.region)).every(h=>h.state==='not_started'&&h.roster_total===null));
});


test('conflicting award years and historical career evidence remain distinct from current facts',()=>{
 const c=catalog(),people=c.faculty.people;
 const yu=people.find(p=>p.current.region==='MO'&&p.name==='Kaidong Yu');
 assert.equal(yu.phd.year,null);assert.ok(yu.unknowns.some(g=>g.field==='phd.year'&&/conflict/i.test(g.reason)));
 assert.ok(yu.sources.some(s=>s.url==='https://theses.gla.ac.uk/30599/'&&s.quote.includes('2018')));
 const loertscher=people.find(p=>p.name==='Simon Loertscher'&&p.current.region==='AU');
 assert.equal(loertscher.phd.year,2004);assert.equal(loertscher.current.tenure_status,undefined);assert.ok(loertscher.unknowns.some(g=>g.field==='current.tenure_status'));
 assert.ok(loertscher.career_events.some(e=>e.source_snapshot_only&&e.start_date==='2016'));
 assert.ok(hasDatedCareer(loertscher));
 const wait=people.find(p=>p.name==='Andrew Wait'&&p.current.region==='AU');
 assert.equal(wait.phd.year,null);assert.equal(wait.phd.reported_year,2002);assert.equal(wait.current.department,null);
 assert.ok(wait.unknowns.some(g=>g.field==='current.department'&&/conflict/i.test(g.reason)));
});

test('extension exports retain field provenance, unknowns and stable host scope',()=>{
 const c=catalog(),people=c.faculty.people.filter(p=>p.current.region==='MO');
 const csv=facultyCsv(people,c);
 assert.ok(csv.includes('Receiving scope plan IDs'));assert.ok(csv.includes('Individual inclusion scope'));
 assert.match(csv,/faculty-macao-au-go8-2026-10-23/);
 assert.match(csv,/theses.gla.ac.uk/);assert.match(csv,/2018/);assert.match(csv,/unknown/i);
 assert.equal(c.faculty_extension_update.by_region.MO.people,people.length);
 assert.equal(c.faculty_extension_update.counts.all_faculty,c.faculty.people.length);
});
