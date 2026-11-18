import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {digest} from '../scripts/observatory-model.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));

test('frontier progress is reconciled to the frozen 184 actual school-year tasks and immutable receipts',()=>{
 const scope=read('data/research-updates/2026-11-18-frontier-scope.json');
 assert.equal(new Set(scope.program_ids).size,46);
 assert.equal(new Set(scope.cell_ids).size,184);
 const log=read('data/cohort-review-log.json');
 assert.equal(new Set(log.map(r=>r.id)).size,log.length);
 const reviews=log.filter(r=>r.id.includes(':frontier:'));
 const receipts=fs.readdirSync('data/research-updates').filter(f=>/^2026-11-18-frontier-.*-receipt\.json$/.test(f)).sort().map(f=>read('data/research-updates/'+f));
 const receipted=receipts.flatMap(r=>r.annual_review_ids);
 assert.deepEqual([...receipted].sort(),reviews.map(r=>r.id).sort());
 const checked=new Set(reviews.flatMap(r=>r.years.map(y=>r.program_id+':'+y)));
 for(const id of checked)assert.ok(scope.cell_ids.includes(id),'Every frontier review must name a frozen task: '+id);
 for(const r of reviews){assert.ok(r.finding.length>40);assert.ok(r.sources.length);assert.ok(r.source_packet);assert.ok(fs.existsSync(r.source_packet));for(const s of r.sources)assert.match(s.url,/^https:\/\//);}
 const checklist=read('dist/data/cohort-checklist.json');
 assert.deepEqual(checklist.first_pass_queue.map(r=>r.id).sort(),scope.cell_ids.filter(id=>!checked.has(id)).sort());
 const latest=receipts.at(-1);
 assert.equal(latest.coverage_after_sha256,digest(read('data/coverage.json')),'Coverage must match the latest reviewed receipt');
 for(const r of receipts)assert.equal(r.people_batch_sha256,digest(read(r.people_batch)));
});

test('new industrial outcomes and Quant evidence survive the source-year and graduation-year distinction',()=>{
 const records=read('data/records.json');
 const get=suffix=>records.find(r=>r.id==='frontier-university-of-texas-at-austin-'+suffix);
 const lan=get('xing-mike-lan');assert.equal(lan.job_kind,'industry');assert.equal(lan.source_cohort_year,2023);assert.equal(lan.graduation_year,null);assert.equal(lan.placement_year,null);
 assert.ok(get('nikkita-sarna').tracks.includes('cb'));
 const s=get('sachin-sridhar');assert.ok(s.tracks.includes('qm'));assert.equal(s.graduation_year,2025);assert.equal(s.placement_year,2025);
 assert.ok(s.claims.some(c=>c.field==='graduation_year'&&c.source_urls.some(u=>u.startsWith('https://www.iimb.ac.in/'))));
 const c=read('data/coverage.json').find(c=>c.program_id===s.program_id&&c.period==='2025');assert.equal(c.listed_count,3);assert.equal(c.cohort_complete,false);
});

test('independent HKUST award counts establish only the explicitly published class',()=>{
 const c=read('data/coverage.json').find(c=>c.program_id==='hong-kong-university-of-science-and-technology-marketing'&&c.period==='2024');
 assert.equal(c.cohort_complete,true);assert.equal(c.population.kind,'published_degree_conferment_class');
 assert.equal(c.population.independent_count,3);assert.equal(c.record_ids.length,3);
 assert.deepEqual(c.population.roster_names,['Da He','Lulu Shi','Xuewen Wang']);
 assert.ok(c.completeness_evidence.some(e=>e.physical_page===57&&e.count===3));
 const unknown=read('data/coverage.json').find(row=>row.program_id===c.program_id&&row.period==='2026');
 assert.equal(unknown.cohort_complete,false,'A printed aggregate without all names cannot establish a complete roster');
 assert.equal(unknown.aggregate_count_evidence[0].count,4);
 const row=read('dist/data/cohort-checklist.json').rows.find(r=>r.id===c.program_id+':2026');
 assert.equal(row.independent_count,null);assert.equal(row.official_aggregate_count,4);
 assert.equal(row.stages.independent_denominator,'count_only');assert.equal(row.cohort_complete,false);
 assert.ok(row.aggregate_count_evidence.every(e=>e.url.includes('/2026/')&&e.quote&&e.physical_page===100));
});

test('later affiliations and source-list years cannot replace independently dated initial jobs',()=>{
 const records=read('data/records.json'),get=id=>records.find(r=>r.id===id);
 const b=get('university-of-washington-bita-hajihashemi');
 assert.equal(b.destination,'Oklahoma State University');assert.equal(b.placement_year,2023);
 assert.ok(b.subsequent.some(s=>s.institution==='University of California, Davis'&&s.start_year===2024));
 const y=get('university-of-michigan-yeonjin-sung');
 assert.equal(y.source_cohort_year,2024);assert.equal(y.graduation_year,2024);assert.equal(y.placement_year,2025);
 const q=get('university-of-maryland-qihui-chen');
 assert.equal(q.destination,null);assert.equal(q.placement_year,null);
 assert.ok(q.subsequent.some(s=>s.institution==='Hong Kong University of Science and Technology'));
 assert.equal(read('data/faculty.json').people.find(f=>f.id==='faculty-hong-kong-university-of-science-and-technology-qihuichen').checked_at,'2026-11-02');
});
