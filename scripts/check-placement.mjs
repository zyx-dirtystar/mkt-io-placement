import assert from 'node:assert/strict';
import fs from 'node:fs';
import {classifyPlacement,placementOf,placementSummary,institutionRegion,sortRecords,rankMatches} from '../dist/placement.js';
import {filterRecords} from '../dist/core.js';
import {buildCsv,csvRows,CSV_HEADERS} from '../dist/export.js';
const job=(role,destination_region='US',extra={})=>({destination:'Example University',role,destination_region,...extra});
for(const [role,region,expected] of [
 ['Assistant Professor','US','tt'],['Tenure-track Researcher','FR','tt'],
 ['Assistant Professor of Instruction','US','non_tt'],['AP of Instruction','US','non_tt'],
 ['Visiting Assistant Professor','UK','non_tt'],['Visiting AP','US','non_tt'],
 ['Clinical Assistant Professor','US','non_tt'],['Adjunct Professor','CA','non_tt'],
 ['Assistant Professor (non-tenure-track)','US','non_tt'],['Teaching Professor','AU','non_tt'],
 ['Lecturer','US','non_tt'],['Lecturer','CA','non_tt'],['Lecturer','UK','tt'],['Lecturer','AU','tt'],['Lecturer','NZ','tt'],
 ['Lecturer','HK','unknown'],['Postdoctoral Researcher','US','postdoc'],['Research Fellow','SG','postdoc'],['Visiting Scholar','CN','postdoc']
])assert.equal(classifyPlacement(job(role,region)),expected,role+' '+region);
assert.equal(classifyPlacement(job(null,'US',{job_kind:'faculty'})),'unknown','A university employer alone does not establish a tenure-track role');
assert.equal(classifyPlacement(job('Economist','US',{job_kind:'government'})),'other');
assert.equal(classifyPlacement({status:'deferred'}),'deferred');
assert.equal(classifyPlacement({status:'on_market'}),'on_market');
assert.equal(classifyPlacement({}),'unknown');
for(const institution of ['Hong Kong University of Science and Technology (Guangzhou)','CUHK (Shenzhen)','NYU Shanghai','Duke Kunshan University','港科大（广州）','港中文（深圳）','上海纽约大学','昆山杜克大学'])assert.equal(institutionRegion(institution,'HK'),'CN',institution);
assert.equal(institutionRegion('Hong Kong University of Science and Technology','HK'),'HK');
const example={id:'path',name:'Example',school:'School',program:'Marketing',origin:'US',tracks:['marketing','cb'],fields:[],methods:[],topics:[],sources:[],identity:{},undergraduate:null,placement_year:2024,status:'placed',...job('Postdoctoral Fellow'),final_placement:{...job('Assistant Professor','CN',{destination:'NYU Shanghai'}),year:2025,status:'placed'}};
assert.equal(placementOf(example,'first').category,'postdoc');assert.equal(placementOf(example).category,'tt');assert.equal(placementOf(example).destination_region,'CN');
assert.equal(filterRecords([example],{basis:'first',job:'postdoc',destination:'US'}).length,1);
assert.equal(filterRecords([example],{basis:'final',job:'tt',destination:'CN'}).length,1);
const known=[example,{...example,final_placement:null,...job('Visiting AP')},{...example,final_placement:null},{...example,final_placement:null,...job('Analyst','US',{job_kind:'industry'})}];
const unknowns=[{...example,final_placement:null,destination:null,status:'outcome_unknown'},{...example,final_placement:null,destination:null,status:'deferred'},{...example,final_placement:null,destination:null,status:'on_market'}];
const sum=placementSummary([...known,...unknowns]);assert.deepEqual([sum.known,sum.faculty,sum.facultyShare,sum.unknown,sum.deferred],[4,1,0.25,1,1]);
assert.equal(placementSummary([]).facultyShare,null);assert.equal(placementSummary(known,'first').faculty,0);
assert.equal(placementOf({...example,final_placement:{...example.final_placement,year:2027,status:'announced_future'}}).category,'tt','Announced future faculty is not a deferred job-market return');
const ranked=[{...example,name:'Unranked',origin_rank:null},{...example,name:'Rank 25',origin_rank:25},{...example,name:'Rank 2',origin_rank:2}];
assert.deepEqual(sortRecords(ranked,'rank').map(r=>r.origin_rank),[2,25,null]);assert.equal(rankMatches(ranked[0],'10'),false);assert.equal(rankMatches(ranked[1],'25'),true);assert.equal(rankMatches(ranked[0],'unranked'),true);
const row=csvRows([example])[0];assert.equal(row.length,CSV_HEADERS.length);assert.equal(row[CSV_HEADERS.indexOf('统计分类')],'教职（终身轨口径）');assert.equal(csvRows([example],'first')[0][CSV_HEADERS.indexOf('统计分类')],'博后');
assert.ok(buildCsv([{...example,name:'=SUM(1,2)'}]).includes('"\'=SUM(1,2)"'),'CSV formula protection');assert.ok(buildCsv([{...example,name:'A "B", C'}]).includes('"A ""B"", C"'),'CSV escaping');
const records=JSON.parse(fs.readFileSync('dist/data/records.json','utf8')),catalog=JSON.parse(fs.readFileSync('dist/data/catalog.json','utf8'));
for(const r of records){
 for(const k of ['homepage','cv_url','jmp_url'])if(r[k])assert.ok(/^https?:\/\//.test(r[k])&&r.sources.some(s=>s.url===r[k]),r.name+' missing source for '+k);
 if(r.final_placement){assert.ok(r.final_placement.evidence&&r.final_placement.sources.length,r.name);assert.ok(r.final_placement.sources.every(url=>r.sources.some(s=>s.url===url)),r.name);assert.ok(Number.isInteger(r.final_placement.year));assert.ok(r.final_placement.year>=r.placement_year);}
 if(r.origin_rank){assert.ok(r.tracks.includes('marketing'));assert.equal(catalog.scope.ranking.rows.find(s=>s.school===r.school)?.rank,r.origin_rank);}
 assert.ok(!r.cv_url?.includes('Sha-Yang'),'An adviser CV must not be presented as the candidate CV');
}
const j=records.find(r=>r.name==='Jennifer Allen');assert.equal(j.placement_year,2024);assert.equal(j.final_placement.year,2025);assert.equal(placementOf(j,'first').category,'postdoc');assert.equal(placementOf(j).category,'tt');
assert.equal(records.find(r=>r.name==='Adam Harris').jmp,null,'Indirectly related working paper must not masquerade as an explicitly identified JMP');
assert.equal(records.filter(r=>r.school==='New York University'&&/^Ella(?: J\.)? Xu$/.test(r.name)).length,1,'Ella Xu and Ella J. Xu must not be counted twice');
assert.ok(records.find(r=>r.id==='ella-xu-2025').aliases.includes('Ella Xu'));
assert.ok(!catalog.coverage.some(c=>c.record_ids.includes('new-york-university-ella-xu')),'Coverage references must follow the merged ID');
assert.equal(filterRecords(records,{track:'strategy'}).some(r=>r.name==='Soo Hyung (Ralph) Park'),true);
console.log(JSON.stringify({placement:'passed',checks:'title precedence, Lecturer countries, first/final paths, denominator exclusions, announced future jobs, mainland campuses, ranks, CSV consistency/escaping, material provenance'}));
