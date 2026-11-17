import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {filterRecords,configure} from '../dist/core.js';
import {replayPlacementReviews} from '../scripts/placement-reviewed-state.mjs';
import {digest} from '../scripts/observatory-model.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const batch=read('data/research-updates/2026-11-17-quant-cohorts-v1.json');
const receipt=read('data/research-updates/2026-11-17-quant-roster-reconciliation.json');
const records=read('dist/data/records.json');

test('frozen faculty baselines accept only ledger-matched placement research and intact preconditions',()=>{
  const base={placement_facts:[{id:'old',destination:'A',placement_year:2025}]};
  const review={id:'review',updates:[{id:'old',expected:{destination:'A'},set:{destination:null}}],additions:[{id:'new',set:{destination:null,placement_year:null}}]};
  const ledger=[{id:review.id,sha256:digest(review)}];
  const result=replayPlacementReviews(base,[review],ledger);
  assert.deepEqual(result.ids,['new','old']);
  assert.equal(result.facts.find(r=>r.id==='old').destination,null);
  assert.equal(base.placement_facts[0].destination,'A');
  assert.throws(()=>replayPlacementReviews(base,[review],[]),/ledger/);
  const tampered=structuredClone(review);tampered.updates[0].set.destination='B';
  assert.throws(()=>replayPlacementReviews(base,[tampered],ledger),/ledger/);
  tampered.updates[0].expected.destination='wrong';
  assert.throws(()=>replayPlacementReviews(base,[tampered],[{id:tampered.id,sha256:digest(tampered)}]),/revision chain/);
  const faculty={id:'faculty',people:[]};
  assert.throws(()=>replayPlacementReviews(base,[faculty],[{id:faculty.id,sha256:digest(faculty)}]),/Faculty research/);
});

test('a roster match, a rolling list and an expected degree never establish a complete graduating cohort',()=>{
  assert.equal(receipt.cell_changes.length,37);
  for(const {after:c} of receipt.cell_changes){
    assert.equal(c.cohort_complete,false);
    assert.equal(new Set(c.record_ids).size,c.record_ids.length);
    for(const id of c.record_ids)assert.equal(records.find(r=>r.id===id)?.program_id,c.program_id);
    if(c.status==='source_reconciled')assert.equal(c.listed_count,c.record_ids.length);
  }
  for(const item of batch.additions){
    assert.equal(item.set.graduation_year??null,null);
    assert.equal(item.set.placement_year??null,null);
    assert.equal(item.set.destination??null,null);
    assert.ok(records.some(r=>r.id===item.id));
  }
});

test('the receiving employer conflict remains visible instead of manufacturing a first-job sequence',()=>{
  const u=batch.updates.find(r=>r.id==='duke-university-siddharth-prusty').set;
  assert.equal(u.destination,null);
  assert.equal(u.placement_year,null);
  assert.equal(u.status,'outcome_unknown');
  assert.deepEqual(u.first_job_conflict.values,['Indiana University','Indian School of Business']);
  assert.ok(u.claims.some(c=>c.field==='current_appointment'&&c.value.institution==='Indian School of Business'));
});

test('stale candidate and school-wide non-Marketing names do not enter the current Marketing roster',()=>{
  const cell=pid=>receipt.cell_changes.find(c=>c.after.program_id===pid&&c.after.period==='2026-2027').after;
  const berkeley=cell('university-of-california-berkeley-marketing');
  assert.equal(berkeley.status,'partial');
  assert.equal(berkeley.record_ids.includes('university-of-california-berkeley-amanda-geiser'),false);
  assert.equal(cell('university-of-wisconsin-madison-marketing').record_ids.length,3);
  const crossover=batch.additions.find(r=>r.id==='hkust-ke-cheng-hsu').set;
  assert.ok(crossover.program_id.endsWith('-economics'));
  assert.equal(crossover.tracks.includes('marketing'),false);
});

test('provisional Quant labels require an explicit opt-in and inferred seasons retain their status',()=>{
  configure({currentCycle:'2026-2027',historyYears:[2023,2024,2025,2026]});
  const frozen=batch.additions.map(x=>({id:x.id,topics:[],methods:[],...x.set}));
  const regular=filterRecords(frozen,{track:'qm'}),expanded=filterRecords(frozen,{track:'qm',researchMode:'include_provisional'});
  assert.equal(regular.some(r=>r.id==='mit-lei-huang'),false);
  assert.equal(expanded.some(r=>r.id==='mit-lei-huang'),true);
  const revised=read('data/research-updates/2026-11-17-quant-date-provenance-v2.json');
  for(const item of revised.updates.filter(r=>r.id.startsWith('purdue-'))){
    const c=item.set.claims.find(c=>c.field==='market_cycle');
    assert.equal(c.status,'inferred');
    assert.match(c.quote,/Graduation/);
    const generated=read('dist/data/observatory.json').claims.find(c=>c.person_id===item.id&&c.field==='market_cycle'&&c.status_raw==='inferred');
    assert.equal(generated.status,'provisional');
    assert.equal(generated.status_raw,'inferred');
    assert.match(generated.quote,/Expected Graduation/);
  }
});
