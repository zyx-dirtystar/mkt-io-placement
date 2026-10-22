import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {facultyExpansionReport,hasDatedCareer} from '../faculty-na-report.mjs';
import {filterFaculty,facultyCsv} from '../../dist/faculty.js';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
test('the 46-school expansion preserves all baseline people, IDs, and placement events',()=>{
 const a=read('data/faculty.json'),base=read('data/faculty-baseline-na-2026-10-22.json'),r=read('data/records.json'),catalog=read('dist/data/catalog.json');
 const report=facultyExpansionReport(a,base,catalog.scope,catalog);
 assert.equal(report.existing.missing_ids.length,0);assert.equal(report.counts.target_started,46);
 assert.deepEqual(r.map(p=>p.id).sort(),base.placement_ids.toSorted());
 for(const expected of base.placement_facts){const actual=r.find(p=>p.id===expected.id);for(const [field,value]of Object.entries(expected))assert.deepEqual(actual[field],value,expected.id+' '+field+' must survive reverse lookup');}
 for(const host of base.unstarted_na){const c=a.receiving_checks.find(c=>c.host_id===host);assert.ok(c?.sources.length,host+' evidence');assert.ok(c.roster?.member_ids.length||c.status==='blocked',host+' actual roster or explained block');}
 for(const p of a.people.filter(p=>!base.people.some(b=>b.id===p.id)))assert.ok(p.phd.year!==null||p.unknowns.some(g=>/year|博士|年份/.test((g.field||'')+' '+(g.reason||''))),p.name+' unknown degree reason');
 assert.ok(report.existing.degree_years_added>0);assert.ok(report.existing.expanded_career_people>0);
});
test('undated current-directory stubs do not count as dated career backfill',()=>{
 assert.equal(hasDatedCareer({career_events:[{institution:'A',role:'Professor',start_year:null}]}),false);
 assert.equal(hasDatedCareer({career_events:[{institution:'A',role:'Professor',start_date:'2020-07'}]}),true);
 const catalog=read('dist/data/catalog.json'),rows=filterFaculty(catalog.faculty.people,{region:'all',gap:'career'},catalog);
 assert.ok(rows.every(p=>!hasDatedCareer(p)));
});
test('degree conflicts remain unknown while earned second doctorates and date distinctions remain exportable',()=>{
 const catalog=read('dist/data/catalog.json'),people=catalog.faculty.people;
 const lee=people.find(p=>p.name==='Yih Hwai Lee');assert.equal(lee.phd.year,null);assert.deepEqual(lee.phd.reported_years,[1997,1998]);
 const tan=people.find(p=>p.name==='谭群');assert.equal(tan.phd.year,null);assert.ok(tan.unknowns.some(g=>g.values?.includes(2014)));
 const wendy=people.find(p=>p.name==='Wendy De La Rosa');assert.equal(wendy.phd.year,2022);assert.equal(wendy.current.start_year,2021);
 const zhang=people.find(p=>p.name==='Z. John Zhang');assert.equal(zhang.phd.year,1994);assert.equal(zhang.additional_degrees[0].year,1989);
 assert.match(facultyCsv([zhang],catalog),/History and Sociology/);
});
