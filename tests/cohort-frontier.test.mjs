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
