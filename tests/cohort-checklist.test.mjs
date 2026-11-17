import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildCohortChecklist} from '../scripts/cohort-checklist.mjs';
import {checklistRows,checklistMarkup} from '../dist/checklist-view.js';
import {countReconciliationMarkup} from '../dist/cohort-scope.js';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const inputs=()=>({plan:read('data/cohort-research-plan.json'),scope:read('data/scope.json'),programs:read('data/programs.json'),coverage:read('data/coverage.json'),records:read('data/records.json'),reviewLog:read('data/cohort-review-log.json')});

test('fixed scope produces exactly one cell for every school and year including empty and eligibility gaps',()=>{
  const x=inputs(),d=buildCohortChecklist(x);
  assert.equal(d.summary.core_cells,232);assert.equal(d.summary.extension_cells,8);assert.equal(d.rows.length,240);
  assert.equal(new Set(d.rows.map(r=>r.id)).size,240);assert.equal(d.summary.priority_cells,56);
  for(const r of [...x.scope.ranking.rows,...x.scope.asia])for(const y of x.plan.history_years)assert.ok(d.rows.some(c=>c.program_id===r.program_id&&c.year===y));
  for(const r of d.rows.filter(r=>r.recorded_count===0&&!r.cohort_complete)){assert.equal(r.independent_count,null);assert.equal(r.work_complete,false);}
  assert.equal(d.rows.find(r=>r.program_id.endsWith('-economics')).scope,'extension');
  assert.equal(d.first_pass_queue.length,184);assert.equal(d.revisit_queue.length,56);
  assert.equal(d.next_queue[0].queue,'first_pass','An unresolved prior source gap must not trap the work queue ahead of untouched school-years');
  assert.ok(d.next_queue.slice(0,184).every(t=>!d.rows.find(r=>r.id===t.id).annual_reviews.length));
});

test('a search, a matched placement table and candidate counts cannot create a degree denominator',()=>{
  const x=inputs(),r=x.records[0],p=x.programs.find(p=>p.id===r.program_id);
  const d=buildCohortChecklist({...x,plan:{...x.plan,history_years:[2026]},coverage:[{program_id:p.id,period:'2026',record_ids:[r.id],status:'source_reconciled',listed_count:1,cohort_complete:false}],reviewLog:[{program_id:p.id,years:[2026],checked_at:'2026-11-18',result:'read_pdf',candidate_count:1,sources:[{url:'https://example.edu/candidates'}]}]});
  const c=d.rows.find(c=>c.program_id===p.id);
  assert.equal(c.source_matched,true);assert.equal(c.independent_count,null);assert.equal(c.cohort_complete,false);assert.equal(c.next_stage,'independent_denominator');
});

test('complete names, research labels, destinations and dates are independent milestones',()=>{
  const x=inputs(),cell=x.coverage.find(c=>c.cohort_complete),ids=new Set(cell.record_ids);
  const missing=x.records.map(r=>ids.has(r.id)?{...r,tracks:['marketing'],placement_year:null}:r);
  let row=buildCohortChecklist({...x,records:missing}).rows.find(r=>r.id===cell.program_id+':'+cell.period);
  assert.equal(row.cohort_complete,true);assert.equal(row.work_complete,false);assert.equal(row.next_stage,'research_classification');
  const allLabelled=missing.map(r=>ids.has(r.id)?{...r,tracks:['marketing','cb']}:r);
  row=buildCohortChecklist({...x,records:allLabelled}).rows.find(r=>r.id===cell.program_id+':'+cell.period);
  assert.ok(['initial_destination','independent_dates'].includes(row.next_stage));
});

test('Berkeley discrepancy stays partly resolved and preserves the provisional surname mapping',()=>{
  const c=read('data/coverage.json').find(c=>c.program_id==='university-of-california-berkeley-marketing'&&c.period==='2026');
  assert.equal(c.cohort_complete,false);
  assert.deepEqual(c.count_reconciliation.sources.map(s=>s.count),[11,9,8]);
  const sophia=c.count_reconciliation.names.find(n=>n.name_raw==='Sophia L.');assert.equal(sophia.identity_status,'provisional');
  const perry=c.count_reconciliation.names.find(n=>n.name_raw==='Andrew Maurice Perry');assert.equal(perry.field,'Finance');assert.equal(perry.in_placement_table,false);
  const html=countReconciliationMarkup(c);assert.match(html,/Still unresolved/);assert.match(html,/provisional/);assert.match(html,/Andrew Maurice Perry/);
});

test('the website checklist exposes the whole scope, preserves empty rows and offers reproducible exports',()=>{
  const d=buildCohortChecklist(inputs());
  assert.equal(checklistRows(d,{scope:'core'}).length,232);assert.equal(checklistRows(d,{scope:'extension'}).length,8);assert.equal(checklistRows(d,{scope:'priority'}).length,56);
  const html=checklistMarkup({cohort_checklist:d});assert.match(html,/cohort-checklist.csv/);assert.match(html,/independent denominator/i);assert.match(html,/not a zero-graduate/);
  assert.deepEqual(read('dist/data/cohort-checklist.json'),d);
  assert.equal(read('dist/data/catalog-runtime.json').cohort_checklist.rows.length,240);
});

test('new degree and source-year corrections preserve earliest jobs and retain unknowns',()=>{
  const r=read('data/records.json'),get=id=>r.find(r=>r.id===id);
  const k=get('northwestern-carolyn-wells-keller');assert.ok(k.tracks.includes('cb'));assert.equal(k.graduation_year,2022);assert.equal(k.source_cohort_year,2023);assert.equal(k.destination,null);
  const xu=get('university-of-california-berkeley-yixiang-xu');assert.equal(xu.placement_start_date,'2026-08-01');
  const cash=get('mit-matthew-cashman');assert.equal(cash.source_cohort_year,2024);assert.equal(cash.graduation_year,2023);assert.equal(cash.destination,'University of Warwick');assert.ok(cash.subsequent.some(s=>s.institution==='Massachusetts Institute of Technology'));
  const xi=get('mit-xi-chen');assert.equal(xi.graduation_year,2025);assert.equal(xi.source_cohort_year,2026);assert.equal(xi.destination,null);
  assert.equal(get('mit-yunhao-jerry-zhang').graduation_year,null);
  assert.equal(get('nyu-m-leonor-neto').graduation_year,null);
  assert.equal(get('new-york-university-zekun-liu').placement_year,2024);assert.equal(get('new-york-university-zekun-liu').graduation_year,2025);
});

test('a reviewed same-person link preserves the faculty stable ID, dates and independent first job',()=>{
  const d=read('dist/data/observatory.json'),f=read('data/faculty.json').people.find(f=>f.id==='faculty-university-of-notre-dame-andreurbanmartin');
  const p=d.people.find(p=>p.id==='unc-andre-martin');
  assert.ok(p.faculty_ids.includes(f.id));assert.equal(d.people.some(p=>p.id===f.id),false);
  assert.equal(f.checked_at,'2026-11-02');assert.equal(f.placement_id,null);
  assert.equal(p.destination,'University of Notre Dame');assert.equal(p.placement_year,2023);
  const observed=d.events.find(e=>e.person_id===p.id&&e.type==='current_appointment');
  assert.equal(observed.checked_at,f.checked_at,'Forward identity research must not refresh receiving-side observation dates');
});
