import test from 'node:test';
import assert from 'node:assert/strict';
import {filterRecords,configure} from '../dist/core.js';
import {tenureOf,placementOf,appointmentOf,placementSummary} from '../dist/placement.js';
import {buildCsv,csvRows,CSV_HEADERS} from '../dist/export.js';

const person={id:'a',name:'A',school:'School',program_id:'school-mkt',status:'placed',tracks:['marketing'],fields:[],topics:[],methods:[],sources:[],source_cohort_year:2023,graduation_year:2024,placement_year:2025,destination:'University',destination_region:'US',role:'Assistant Professor',job_kind:'faculty'};
test('a generic academic title never establishes confirmed tenure',()=>{
 assert.deepEqual(tenureOf(person),{tenure_status:'unknown',tenure_evidence_status:'inferred'});
 assert.equal(placementOf(person).tenure_status,'unknown');
 assert.equal(tenureOf({...person,role:'Assistant Professor (non-tenure-track)'}).tenure_status,'non_tenure_track');
 assert.equal(tenureOf({...person,role:'Tenure-track Assistant Professor'}).tenure_evidence_status,'title_explicit');
 assert.equal(tenureOf({...person,tenure:{status:'tt',evidence_status:'confirmed'}}).tenure_status,'unknown');
 assert.equal(tenureOf({...person,tenure:{status:'tt',evidence_status:'confirmed',quote:'Tenure Track',source_urls:['https://example.edu/appointment']}}).tenure_status,'tenure_track');
 assert.equal(appointmentOf({...person,role:'Visiting Scholar',job_kind:'research'}).job_family,'visiting');
});
test('time axes retain distinct people rather than replacing missing dates',()=>{
 configure({currentCycle:'2026-2027',historyYears:[2023,2024,2025,2026]});
 assert.equal(filterRecords([person],{yearBasis:'source',year:'2023'}).length,1);
 assert.equal(filterRecords([person],{yearBasis:'graduation',year:'2023'}).length,0);
 assert.equal(filterRecords([person],{yearBasis:'graduation',year:'2024',period:'2023'}).length,1);
 assert.equal(filterRecords([{...person,placement_year:null}],{yearBasis:'placement',year:'all'}).length,0);
 assert.equal(filterRecords([{...person,market_cycle:'2026-2027'}],{yearBasis:'market',year:'2026-2027'}).length,1);
});
test('complete-only and tenure-evidence filters do not upgrade uncertainty',()=>{
 configure({currentCycle:'2026-2027',historyYears:[2023,2024,2025,2026],coverage:[{program_id:'school-mkt',period:'2023',record_ids:['a'],cohort_complete:false}]});
 assert.equal(filterRecords([person],{completeOnly:'yes'}).length,0);
 configure({currentCycle:'2026-2027',historyYears:[2023,2024,2025,2026],coverage:[{program_id:'school-mkt',period:'2023',record_ids:['a'],cohort_complete:true}]});
 assert.equal(filterRecords([person],{completeOnly:'yes',tenureEvidence:'inferred'}).length,1);
 assert.equal(filterRecords([person],{tenureEvidence:'confirmed'}).length,0);
});
test('final arrangements expose fallback and preserve first employment',()=>{
 const r={...person,role:'Postdoctoral Fellow',final_placement:{destination:'Other',destination_region:'UK',role:'Lecturer',year:2026,status:'announced_future'}};
 assert.equal(placementOf(r,'first').category,'postdoc');
 assert.equal(placementOf(r).basis,'final_verified');
 assert.equal(placementOf(person).basis,'first_observed');
 const summary=placementSummary([r,person]);assert.equal(summary.finalVerified,1);assert.equal(summary.firstFallback,1);assert.equal(summary.confirmedTenure,0);
});
test('CSV preserves evidence and export scope, and neutralizes formulas',()=>{
 const row=csvRows([person],'first','standard',{yearBasis:'source',year:'2023'})[0];
 assert.equal(row.length,CSV_HEADERS.length);
 assert.equal(row[CSV_HEADERS.indexOf('Tenure status')],'unknown');
 assert.match(row.at(-1),/2023/);
 for(const value of ['=HYPERLINK("x")','+1','@x','-1','\t=1'])assert.ok(buildCsv([{...person,name:value}]).includes('"\''+value.replaceAll('"','""')+'"'));
});
