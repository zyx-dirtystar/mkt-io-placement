import fs from 'node:fs';
import assert from 'node:assert/strict';
import {digest} from './observatory-model.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));

// Preserve frozen historical baselines while accounting only for separately reviewed placement research.
export function replayPlacementReviews(baseline,batches,ledger){
 const facts=structuredClone(baseline.placement_facts||[]),ids=new Set(baseline.placement_ids||facts.map(r=>r.id));
 const fields=new Set(facts.flatMap(r=>Object.keys(r)));
 const defaults={destination:null,destination_region:'UNKNOWN',role:null,job_kind:'unknown',placement_year:null,source_cohort_year:null,market_cycle:null,subsequent:[]};
 const seen=new Set();
 for(const b of batches){
  assert.ok(!seen.has(b.id),'Duplicate reviewed placement batch');seen.add(b.id);
  assert.ok(ledger.some(x=>x.id===b.id&&x.sha256===digest(b)),'Placement revision must match the applied batch ledger');
  assert.ok(!b.people,'Faculty research cannot authorize placement mutations');
  for(const item of b.additions||[]){
   assert.ok(!ids.has(item.id),'Reviewed addition duplicates a baseline person');ids.add(item.id);
   const expected={id:item.id};
   for(const field of fields)if(field!=='id'){
    if(Object.hasOwn(item.set,field))expected[field]=structuredClone(item.set[field]);
    else if(Object.hasOwn(defaults,field))expected[field]=structuredClone(defaults[field]);
   }
   facts.push(expected);
  }
  for(const item of b.updates||[]){
   assert.ok(ids.has(item.id),'Reviewed update refers to an unknown person');
   const expected=facts.find(r=>r.id===item.id);
   for(const field of Object.keys(expected||{}))if(field!=='id'&&Object.hasOwn(item.set,field)){
    if(Object.hasOwn(item.expected||{},field))assert.deepEqual(item.expected[field],expected[field],'Broken placement revision chain '+item.id+' '+field);
    expected[field]=structuredClone(item.set[field]);
   }
  }
 }
 return {ids:[...ids].sort(),facts};
}

export function reviewedPlacementState(baseline){
 const manifest=read('data/placement-reviewed-revisions.json');
 return replayPlacementReviews(baseline,manifest.batches.map(read),read('data/maintenance-batches.json'));
}
