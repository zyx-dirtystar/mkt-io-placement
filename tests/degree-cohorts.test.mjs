import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {configure,filterRecords} from '../dist/core.js';
import {cohortEvidenceMarkup} from '../dist/cohort-scope.js';
import {selectStudyRecords,comparisonRows} from '../dist/observatory-logic.js';
import {digest} from '../scripts/observatory-model.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const receipt=read('data/research-updates/2026-11-17-degree-denominator-review.json');
const records=read('data/records.json'),coverage=read('data/coverage.json');

test('degree review records all fourteen priority programs and limited-access editions explicitly',()=>{
  assert.equal(new Set(receipt.priority_programs).size,14);
  assert.deepEqual(receipt.program_reviews.map(r=>r.program_id),receipt.priority_programs);
  assert.ok(receipt.program_reviews.every(r=>r.materials.length&&r.next_step));
  const wis=receipt.program_reviews.find(r=>r.program_id==='university-of-wisconsin-madison-marketing');
  assert.ok(wis.materials.some(m=>m.access==='indexed_body_only'));
  assert.ok(!coverage.find(c=>c.program_id===wis.program_id&&c.period==='2025').cohort_complete);
  for(const a of receipt.artifacts)assert.match(a.sha256,/^[a-f0-9]{64}$/);
});

test('complete degree rosters retain an independent count, named population, scope and locator',()=>{
  const promoted=receipt.cell_changes.filter(x=>x.after.cohort_complete);
  assert.equal(promoted.length,3);
  for(const {after:c} of promoted){
    assert.equal(c.record_ids.length,c.population.independent_count);
    assert.equal(c.listed_count,c.population.roster_names.length);
    assert.ok(c.population.scope_note&&c.population.kind);
    assert.ok(c.completeness_evidence.every(e=>e.url&&e.quote&&e.checked_at));
    assert.ok(c.completeness_evidence.some(e=>e.count===c.listed_count));
    assert.deepEqual(coverage.find(x=>x.program_id===c.program_id&&x.period===c.period),c);
  }
});

test('the omitted graduate stays in the completion population with unknown first job and exact award year',()=>{
  const r=records.find(r=>r.id==='northwestern-carolyn-wells-keller');
  assert.equal(r.status,'outcome_unknown');
  assert.equal(r.destination,null);assert.equal(r.placement_year,null);assert.equal(r.graduation_year,null);
  assert.equal(r.tracks.includes('qm'),false);assert.equal(r.tracks.includes('cb'),false);
  assert.ok(r.claims.some(c=>c.field==='reported_appointment'&&c.value.role==='Lecturer'));
  const c=coverage.find(c=>c.program_id===r.program_id&&c.period==='2023');
  assert.equal(c.population.kind,'degree_completion_window');
  assert.equal(c.record_ids.length,3);assert.ok(c.population.excluded_degree_groups.includes('Master of Science'));
  const obs=read('dist/data/observatory.json').audit.find(c=>c.program_id===r.program_id&&c.period==='2023');
  assert.equal(obs.outcome_complete,false);assert.ok(obs.outcome_unknown>=1);
});

test('a complete published class cannot be borrowed as a graduation-year, first-job or market denominator',()=>{
  configure({currentCycle:'2026-2027',historyYears:[2023,2024,2025,2026],coverage});
  const ids=filterRecords(records,{completeOnly:'yes',yearBasis:'source',year:'2023'}).map(r=>r.id);
  assert.equal(ids.length,3);assert.ok(ids.includes('northwestern-carolyn-wells-keller'));
  for(const yearBasis of ['graduation','placement','market'])assert.equal(filterRecords(records,{completeOnly:'yes',yearBasis,year:'all'}).length,0);
  assert.equal(filterRecords(records,{completeOnly:'yes',period:'2023'}).length,0);
  const obs={audit:coverage};
  assert.equal(selectStudyRecords(records,{},obs,{complete_only:true,year_basis:'source',year:'2025'}).length,3);
  assert.equal(selectStudyRecords(records,{},obs,{complete_only:true,year_basis:'graduation',year:'2025'}).length,0);
  const comparison=comparisonRows(records,{programs:[]},obs,{programs:['northwestern-university-marketing'],year_basis:'placement',year:'2023'});
  assert.equal(comparison[0].complete,0);
});

test('Economics school count does not become the Marketing or IO-subset denominator',()=>{
  const marketing=coverage.find(c=>c.program_id==='hong-kong-university-of-science-and-technology-marketing'&&c.period==='2025');
  const econ=coverage.find(c=>c.program_id==='hong-kong-university-of-science-and-technology-economics'&&c.period==='2025');
  assert.deepEqual(marketing.record_ids,['hkust-jingling-yu']);assert.equal(marketing.listed_count,1);
  assert.equal(econ.cohort_complete,false);assert.equal(econ.listed_count,null);
  assert.equal(records.some(r=>r.name==='Zhenghua Qi'),false);
});

test('source conflicts, industry destinations and independently confirmed CB remain visible',()=>{
  const c=coverage.find(c=>c.program_id==='university-of-california-berkeley-marketing'&&c.period==='2026');
  assert.equal(c.cohort_complete,false);assert.match(c.notes,/eleven.*nine.*eight/);
  assert.equal(records.find(r=>r.id==='university-of-california-berkeley-yunhao-huang').placement_year,null);
  assert.ok(records.find(r=>r.id==='university-of-wisconsin-madison-suyeon-jung').tracks.includes('cb'));
  assert.equal(records.find(r=>r.id==='university-of-wisconsin-madison-yutian-carol-liu').destination,'Google');
});

test('audit evidence displays the actual population and safely links the independent denominator',()=>{
  const c=coverage.find(c=>c.program_id==='northwestern-university-marketing'&&c.period==='2023');
  const html=cohortEvidenceMarkup(c);
  assert.match(html,/since June 2022/);assert.match(html,/Page 6/);assert.match(html,/Independent population count/);
  assert.ok(html.includes('href="https://www.kellogg.northwestern.edu/'));
  const escaped=cohortEvidenceMarkup({...c,population:{...c.population,label:'<script>alert(1)</script>'},completeness_evidence:[{url:'javascript:alert(1)',quote:'<img src=x>'}]});
  assert.ok(!escaped.includes('<script>'));assert.ok(!escaped.includes('href="javascript:'));
});

test('the degree import remains registered with immutable ledger provenance',()=>{
  const batch=read('data/research-updates/2026-11-17-degree-cohorts-v1.json');
  assert.ok(read('data/placement-reviewed-revisions.json').batches.includes('data/research-updates/2026-11-17-degree-cohorts-v1.json'));
  assert.equal(read('data/maintenance-batches.json').find(b=>b.id===batch.id).sha256,digest(batch));
});
