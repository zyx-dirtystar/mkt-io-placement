import fs from 'node:fs';
import assert from 'node:assert/strict';
import {graduationGroup,originGroup,receivingSchools,receivingProgress,filterFaculty,facultyCsv} from '../dist/faculty.js';
import {filterRecords} from '../dist/core.js';
import {placementOf} from '../dist/placement.js';
const catalog=JSON.parse(fs.readFileSync('dist/data/catalog.json','utf8'));
const records=JSON.parse(fs.readFileSync('dist/data/records.json','utf8'));
const archive=catalog.faculty,people=archive.people,hosts=receivingSchools(catalog);
assert.equal(hosts.length,67);
assert.equal(archive.receiving_scope.mainland.length,9);
assert.deepEqual(archive.receiving_scope.mainland.map(h=>h.id),['tsinghua','peking','sjtu','fudan','sufe','zhejiang','sun-yat-sen','xiamen','nanjing']);
assert.equal(new Set(people.map(p=>p.id)).size,people.length);
const linked=people.map(p=>p.placement_id).filter(Boolean);
assert.equal(new Set(linked).size,linked.length,'Faculty aliases must not duplicate placements');
for(const p of people){
 assert.ok(hosts.some(h=>h.id===p.host_id&&h.region===p.current.region),p.id+' host membership');
 assert.ok(p.current.institution&&p.checked_at&&p.sources.length,p.id);
 if(!p.current.role)assert.ok(p.unknowns?.length,p.id+' unknown rank needs an explanation');
 assert.ok(p.phd.year===null||Number.isInteger(p.phd.year),p.id+' degree year');
 for(const s of p.sources)assert.match(s.url,/^https?:\/\//);
 for(const k of ['homepage','cv_url'])if(p[k])assert.ok(p.sources.some(s=>s.url===p[k]),p.id+' '+k+' provenance');
 if(p.placement_id){const r=records.find(r=>r.id===p.placement_id);assert.ok(r,p.id+' missing linked placement');assert.equal(r.school,p.phd.school);if(p.phd.year&&r.graduation_year)assert.ok(p.phd.year===r.graduation_year||p.unknowns?.some(g=>g.field==='phd.year'),p.id+' years differ without conflict');}
}
for(const c of archive.receiving_checks){
 assert.ok(hosts.some(h=>h.id===c.host_id));
 assert.ok(['partial','complete','blocked','needs_review'].includes(c.status));assert.ok(c.checked_at&&c.sources.length);
 if(c.status==='complete')assert.equal(receivingProgress({...catalog,faculty:{...archive,receiving_checks:[c]}}).find(h=>h.id===c.host_id).state,'complete','A complete department check requires explicit roster members, scope, date and quoted evidence');
}
const cao=people.find(p=>p.id==='faculty-xinyu-cao');
assert.equal(cao.current.start_year,2023);
assert.equal(graduationGroup(cao,[2023,2024,2025,2026]),'historical','A recent transfer must not create a recent graduate');
assert.equal(cao.placement_id,null);
assert.ok(!records.some(r=>r.id===cao.id),'Faculty archive must not be appended to placement stats');
const michelle=people.find(p=>p.id==='university-of-california-san-diego-michelle-kim');
assert.equal(michelle.current.start_year,2025);
assert.equal(graduationGroup(michelle,catalog.history_years),'unknown','Employment date cannot supply a degree date');
const cai=people.find(p=>p.id==='northwestern-gaoyang-cai');
assert.equal(originGroup(cai,catalog),'extension','MES degree is not a Marketing doctoral project');
assert.equal(records.find(r=>r.id===cai.id).target_scope,null);
assert.equal(records.find(r=>r.id===cai.id).origin_rank,null);
const kim=records.find(r=>r.id==='yale-jin-kim');
assert.equal(placementOf(kim).category,'postdoc','A later current AP must not rewrite original placement');
assert.equal(kim.placement_year,2023);
assert.equal(kim.subsequent[0].institution,'Chinese University of Hong Kong');
assert.equal(filterFaculty(people,{q:'金攸宣'},catalog)[0].id,michelle.id);
assert.ok(filterFaculty(people,{grad:'historical'},catalog).some(p=>p.id===cao.id));
assert.equal(filterFaculty(people,{region:'CN'},catalog).length,people.filter(p=>p.current.region==='CN').length);
assert.ok(filterFaculty(people,{q:'yale',region:'HK',track:'cb'},catalog).some(p=>p.id===kim.id));
assert.equal(graduationGroup(cai,[2027,2028,2029,2030]),'historical','Tags must roll with annual configuration');
const outside={...cai,phd:{school:'Peking University',region:'CN',year:2024,program_id:null}};
assert.equal(originGroup(outside,catalog),'outside','Visiting training in an overseas school must not change awarding institution');
assert.equal(graduationGroup({...cai,phd:{...cai.phd,year:2028}},catalog.history_years),'newer');
assert.equal(facultyCsv([{...cai,name:'=FORMULA'}],catalog).split('\r\n')[1].startsWith('"\'=FORMULA"'),true,'CSV formula injection protection');
assert.match(facultyCsv(people,catalog),/not first-job year/);
assert.ok(filterRecords(records,{period:'cohorts'}).some(r=>r.id==='yale-zikun-liu'));
console.log(JSON.stringify({faculty:'passed',people:people.length,linked:linked.length,checks:'scope restriction, current vs first job, graduation vs employment, historical transfers, program distinctions, source links, aliases, annual rollover, CSV protection, separate denominators'}));
