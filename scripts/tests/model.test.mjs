import test from 'node:test';
import assert from 'node:assert/strict';
import {buildObservatory,appointment,canonicalize,observeWindow,validateObservatory} from '../observatory-model.mjs';
const template=()=>({records:[{id:'one',name:'One',school:'A University',program_id:'a-mkt',origin:'US',status:'placed',tracks:['marketing'],topics:['数字平台'],methods:['结构模型','结构估计'],source_cohort_year:2023,graduation_year:null,placement_year:null,destination:'B University',role:'Assistant Professor',job_kind:'faculty',sources:[{url:'https://example.org/roster',label:'roster'}],checked_at:'2026-10-01',subsequent:[]}],programs:[{id:'a-mkt',school:'A University',region:'US',kind:'marketing',eligibility:'verified'}],coverage:[{program_id:'a-mkt',period:'2023',status:'source_reconciled',record_ids:['one'],listed_count:1,cohort_complete:false,sources:[{url:'https://example.org/roster'}],checked_at:'2026-10-01'}],scope:{id:'scope',ranking:{rows:[{program_id:'a-mkt'}]},asia:[]},config:{updated_at:'2026-10-22',current_cycle:'2026-2027'},taxonomy:{version:'test',tracks:[{id:'marketing',label:'Marketing',aliases:[]}],topics:[{id:'platforms',label:'平台与数字市场',aliases:['数字平台']}],methods:[{id:'structural',label:'结构估计',aliases:['结构模型','结构估计']} ]},baseline:{counts:{people:1},people:[]}});
test('migration preserves unknown dates, deduplicates controlled labels, and never upgrades roster reconciliation to complete',()=>{
  const d=buildObservatory(template());
  assert.deepEqual(validateObservatory(d),[]);
  assert.deepEqual(d.people[0].research.methods,['structural']);
  assert.deepEqual(d.people[0].research.raw.methods,['结构模型','结构估计']);
  assert.equal(d.events.some(e=>e.type==='graduation'),false);
  assert.equal(d.events.find(e=>e.type==='first_job').start,null);
  assert.equal(d.quality.metrics.complete_cohorts,0);
  assert.equal(d.audit.find(a=>a.period==='2026-2027').checked_at,null);
  assert.equal(d.claims.every(c=>c.status==='legacy_reference'&&c.quote===null),true);
});
test('explicit field-level evidence is separate from source-only migration and requires an original quote',()=>{
  const input=template();input.records[0].claims=[{field:'tracks',value:['marketing'],status:'confirmed',quote:'Marketing PhD',source_urls:['https://example.org/degree']}];
  const d=buildObservatory(input);assert.equal(d.claims.filter(c=>c.field==='tracks').length,2);assert.equal(d.quality.metrics.confirmed_claims,1);assert.deepEqual(validateObservatory(d),[]);
  input.records[0].claims[0].quote=null;assert.equal(buildObservatory(input).quality.metrics.confirmed_claims,0);
});
test('Assistant Professor is an academic title with unknown tenure; current tenure cannot rewrite first-job tenure',()=>{
  assert.deepEqual(appointment('Assistant Professor','faculty'),{job_family:'academic',tenure_status:'unknown',tenure_evidence_status:'inferred'});
  assert.equal(appointment('Assistant Professor (non-tenure-track)','faculty').tenure_status,'non_tt');
  const input=template();input.records[0].current_tenure={status:'tt'};assert.equal(buildObservatory(input).events.find(e=>e.type==='first_job').tenure_status,'unknown');
  assert.equal(appointment('Associate Professor (untenured)').tenure_status,'unknown');
  assert.equal(appointment('Associate Professor (without Tenure)').tenure_status,'unknown');
});

test('faculty backfill preserves month precision, earlier event checks, and distinct earned doctorates',()=>{
 const input=template();input.records=[];input.faculty={people:[{id:'f',name:'Faculty',aliases:[],tracks:[],sources:[{url:'https://official.example/cv',supports:['phd.year'],quote:'PhD 2012-06'}],checked_at:'2026-10-22',phd:{school:'A University',year:2012,date:'2012-06'},career_events:[{institution:'B University',role:'Assistant Professor',start_year:2013,checked_at:'2025-04-01',source_urls:['https://official.example/old-cv']}],additional_degrees:[{degree:'PhD',school:'C University',program:'History',year:2005,date:'2005-12',source_urls:['https://official.example/second-degree']}]}]};
 const d=buildObservatory(input),g=d.events.find(e=>e.type==='graduation');assert.equal(g.start,'2012-06');assert.equal(g.date_precision,'month');
 assert.equal(d.events.find(e=>e.type==='appointment').checked_at,'2025-04-01');
 assert.equal(d.events.filter(e=>e.type==='graduation').length,1);assert.equal(d.events.find(e=>e.type==='additional_degree').start,'2005-12');assert.deepEqual(validateObservatory(d),[]);
});
test('missing role categories differ from missing title strings and use the same chart classification',()=>{
  const input=template();input.records[0].destination='Company';input.records[0].role=null;input.records[0].job_kind='industry';
  let d=buildObservatory(input);assert.equal(d.quality.gaps.role_missing.length,0);assert.equal(d.quality.gaps.title_missing.length,1);
  input.records[0].job_kind='faculty';d=buildObservatory(input);assert.equal(d.quality.gaps.role_missing.length,1);
});
test('unknown outcome counts and zero roster membership remain distinct',()=>{
  const input=template();input.records[0].status='outcome_unknown';input.records[0].destination=null;input.coverage.push({program_id:'a-mkt',period:'2024',status:'not_started',record_ids:[],listed_count:null,cohort_complete:false});
  const d=buildObservatory(input);assert.equal(d.audit[0].outcome_unknown,1);assert.equal(d.audit[1].listed_count,null);assert.equal(d.audit[1].record_ids.length,0);
});
test('completeness requires independent quoted evidence and cannot be inferred from empty counts',()=>{
  const input=template();input.coverage[0].cohort_complete=true;input.coverage[0].completeness_evidence=[{url:'https://example.org/selected-placements'}];assert.ok(validateObservatory(buildObservatory(input)).some(e=>e.includes('completeness')));
  input.coverage[0].completeness_evidence[0].quote='All graduates of the cohort';assert.deepEqual(validateObservatory(buildObservatory(input)),[]);
});
test('observation windows respect maturity, precision and evidence of continuous employment',()=>{
  const p={id:'p'};const events=[{person_id:'p',type:'graduation',start:'2023-06-01'},{person_id:'p',type:'first_job',start:'2023-07-01',end:'2025-06-30'}];
  assert.equal(observeWindow(p,events,1,'2026-10-22').status,'observed');
  assert.equal(observeWindow(p,events,3,'2025-10-22').status,'not_yet_observable');
  assert.equal(observeWindow(p,events,3,'2026-10-22').status,'insufficient_dates_or_followup');
  events[0].start='2023';events[1].end='2024-06';assert.equal(observeWindow(p,events,1,'2026-10-22').status,'insufficient_dates_or_followup');
  assert.equal(observeWindow(p,[],1,'2026-10-22').status,'graduation_unknown');
});
test('unmapped punctuation-equivalent labels keep different stable IDs',()=>{
  const terms=[];assert.equal(new Set(canonicalize(['A+B','A B'],terms,'topic')).size,2);
});
