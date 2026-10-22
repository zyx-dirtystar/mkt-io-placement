import test from 'node:test';
import assert from 'node:assert/strict';
import {selectStudyRecords,summarizeStudy,flowRows,fixedWindowObservation,filterJobs,jobState,datasetCsv,matchesTenure} from '../../dist/observatory-logic.js';
const person={id:'p',name:'P',school:'A',program_id:'a',origin:'US',tracks:['marketing','qm','io'],fields:[],topics:[],methods:[],source_cohort_year:2020,graduation_year:2020,placement_year:2021,status:'placed',destination:'B',destination_region:'US',role:'Assistant Professor',job_kind:'faculty',sources:[{url:'https://example.org'}]};
test('comparison tenure evidence distinguishes generic academic titles, explicit title text, and confirmed contract status',()=>{
  const summary=summarizeStudy([person]);assert.equal(summary.faculty,1);assert.equal(summary.confirmed_tt,0);
  assert.equal(summarizeStudy([{...person,role:'Teaching Assistant Professor'}]).faculty,0);
  assert.equal(matchesTenure({tenure_evidence_status:'title_explicit'},'confirmed'),false);
  assert.equal(matchesTenure({tenure_evidence_status:'title_explicit'},'title_explicit'),true);
});
test('complete-only comparisons cannot borrow completeness from another year or time axis',()=>{
  const observatory={audit:[{program_id:'a',period:'2019',year_basis:'source_table_year',record_ids:['p'],cohort_complete:true},{program_id:'a',period:'2020',year_basis:'source_table_year',record_ids:['p'],cohort_complete:false}]};
  assert.equal(selectStudyRecords([person],{},observatory,{year_basis:'source',year:'2020',complete_only:true}).length,0);
  observatory.audit[1].cohort_complete=true;assert.equal(selectStudyRecords([person],{},observatory,{year_basis:'source',year:'2020',complete_only:true}).length,1);
  assert.equal(selectStudyRecords([person],{},observatory,{year_basis:'graduation',year:'2020',complete_only:true}).length,0);
});
test('flow groups deduplicate a person within each multi-label path',()=>{
  const rows=flowRows([person,person]);assert.equal(rows.length,2);assert.equal(rows.every(row=>row.n===1&&row.ids.length===1),true);
});
test('fixed career windows do not invent continuity or maturity',()=>{
  assert.equal(fixedWindowObservation(person,[],3,'2022-10-22').status,'not_yet_observed');
  assert.equal(fixedWindowObservation({...person,graduation_year:null},[],1,'2026-10-22').status,'graduation_unknown');
  const event={person_id:'p',type:'first_job',start:'2021',end:null,institution:'B',title:'Assistant Professor',status:'placed'};
  assert.equal(fixedWindowObservation(person,[event],3,'2026-10-22').status,'date_or_continuity_unknown');
  event.start='2020-01';event.end='2025-01';assert.equal(fixedWindowObservation(person,[event],3,'2026-10-22').status,'observed');
});
test('expired recruitment announcements are historical and IO filters do not absorb unrelated quantitative jobs',()=>{
  const jobs=[{id:'io',institution:'A',title:'Economics',tracks:['io'],status:'active',deadline:'2025-01-01'},{id:'qm',institution:'B',title:'Marketing',tracks:['qm'],status:'active',deadline:null}];
  assert.equal(jobState(jobs[0],'2026-10-22'),'historical');assert.deepEqual(filterJobs(jobs,{track:'io'},'2026-10-22').map(j=>j.id),['io']);
});
test('current appointment observation ends at the real source check, not the site refresh date',()=>{
  const current={person_id:'p',type:'current_appointment',start:'2020-01',end:null,institution:'B',title:'Assistant Professor',status:'current_at_check',checked_at:'2024-10-22'};
  assert.equal(fixedWindowObservation(person,[current],3,'2026-10-22').status,'observed');
  current.source_snapshot_only=true;assert.equal(fixedWindowObservation(person,[current],3,'2026-10-22').status,'date_or_continuity_unknown');
  current.source_snapshot_only=false;current.checked_at='2022-10-22';assert.equal(fixedWindowObservation(person,[current],3,'2026-10-22').status,'path_unknown');
});
test('comparison datasets retain explicit export metadata and neutralize spreadsheet formulas',()=>{
  const csv=datasetCsv([{name:'=SUM(1,2)',n:0}],['name','n'],{as_of:'2026-10-22',year_basis:'source'});assert.ok(csv.includes('_year_basis'));assert.ok(csv.includes('"\'=SUM(1,2)"'));assert.ok(csv.includes('"0"'));
});
