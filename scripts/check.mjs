import fs from 'node:fs';
import {auditPeriods,findAudit,selectPrograms,scopeRows,AUDIT_STATUS} from '../dist/coverage-view.js';
import assert from 'node:assert/strict';
import {filterRecords,summarize,backgroundMatches,configure,REGIONS,JOBS} from '../dist/core.js';
const records=JSON.parse(fs.readFileSync('dist/data/records.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('dist/data/catalog.json','utf8'));
configure({currentCycle:catalog.current_cycle,historyYears:catalog.history_years});
assert.equal(new Set(records.map(r=>r.id)).size,records.length,'Duplicate record IDs');
assert.equal(new Set(records.map(r=>r.name.toLowerCase()+'|'+r.school)).size,records.length,'Duplicate people');
for(const r of records){assert.ok(r.name&&r.school&&['US','CA','HK','SG'].includes(r.origin),r.id);assert.ok(r.sources.length>0,'Missing source: '+r.id);for(const s of r.sources)assert.match(s.url,/^https?:\/\//);assert.ok(r.tracks.length&&r.tracks.every(t=>['marketing','qm','cb','io'].includes(t)),r.id);assert.ok(JOBS[r.job_kind],r.id);assert.ok(r.placement_year===null||Number.isInteger(r.placement_year),r.id);assert.ok(r.checked_at&&/^\d{4}-\d{2}-\d{2}$/.test(r.checked_at),r.id);for(const v of Object.values(r.identity))if(v.value!=='unknown')assert.ok(v.source,'Identity without evidence: '+r.id);if(r.status==='on_market'){assert.match(r.market_cycle,/^20\d{2}-20\d{2}$/);assert.equal(r.destination,null);assert.equal(r.placement_year,null)}}
const base={id:'test',name:'Test',school:'Test University',program:'Economics',origin:'US',fields:['IO'],tracks:['qm','io'],topics:[],methods:[],undergraduate:null,identity:{chinese_national:{value:'unknown'},chinese_heritage:{value:'unknown'}},status:'placed',placement_year:2026,market_cycle:catalog.current_cycle,destination:'University A',job_kind:'faculty'};
assert.equal(filterRecords([base],{period:'current'}).length,1,'Confirmed placement must remain in its current cohort');
assert.equal(filterRecords([base],{period:'history'}).length,0,'Current cohort must not enter historical comparison');
assert.equal(filterRecords([base],{track:'all'}).length,1,'Cross-fields must not double count');
assert.equal(backgroundMatches(base,'ug_other'),false,'Unknown education is not other education');
assert.equal(backgroundMatches(base,'cn_heritage'),false,'Unknown identity is not affirmative');
const mixed=[{...base,market_cycle:null},{...base,id:'unknown',destination:null,job_kind:'unknown'},{...base,id:'current',status:'on_market',destination:null,job_kind:'on_market'}];
assert.deepEqual([summarize(mixed).known,summarize(mixed).faculty,summarize(mixed).unknown],[1,1,1]);
configure({currentCycle:'2027-2028',historyYears:[2024,2025,2026,2027]});assert.equal(filterRecords([{...base,market_cycle:null,placement_year:2027}],{period:'history'}).length,1,'Annual configuration must include the new year');
assert.equal(filterRecords([{...base,market_cycle:'2027-2028'}],{period:'current'}).length,1);
const index=fs.readFileSync('dist/index.html','utf8');for(const file of ['styles.css','app-styles.css','app.js','core.js','data/records.json','data/catalog.json','data/record-template.json'])assert.ok(fs.existsSync('dist/'+file),'Missing asset '+file);assert.ok(/src="app\.js(?:\?[^"<>]*)?"/.test(index));
console.log(JSON.stringify({result:'passed',records:records.length,schools:new Set(records.map(r=>r.school)).size,checks:'evidence, unique people, dates, current placed cohort, denominator, background unknowns, annual rollover, assets'}));

const programs=catalog.programs,coverage=catalog.coverage;
assert.equal(new Set(programs.map(p=>p.id)).size,programs.length,'Duplicate program IDs');
assert.equal(new Set(coverage.map(c=>c.program_id+'|'+c.period)).size,coverage.length,'Duplicate audit cells');
for(const p of programs){assert.ok(['marketing','economics'].includes(p.kind));assert.ok(['verified','pending','not_identified'].includes(p.eligibility));assert.ok(p.sources.length);}
for(const r of records){
  const p=programs.find(p=>p.id===r.program_id);
  assert.ok(p&&p.school===r.school&&p.region===r.origin,'Wrong program membership: '+r.id);
  assert.ok(['placed','on_market','outcome_unknown'].includes(r.status),'Unsupported status');
  assert.ok(REGIONS[r.destination_region||'UNKNOWN'],'Unknown destination region');
  if(r.status==='outcome_unknown'){assert.equal(r.destination,null);assert.equal(r.placement_year,null);}
  if(p.kind==='marketing')assert.ok(r.tracks.includes('marketing'),'Marketing cohort excluded from all-Marketing');
}
for(const c of coverage){
  assert.ok(programs.some(p=>p.id===c.program_id));assert.ok(AUDIT_STATUS[c.status]);
  assert.ok(/^20\d{2}(-20\d{2})?$/.test(c.period));
  assert.equal(new Set(c.record_ids).size,c.record_ids.length,'Duplicate people in audit cell');
  for(const id of c.record_ids){const r=records.find(r=>r.id===id);assert.equal(r?.program_id,c.program_id,'Cross-program audit contamination');if(c.year_basis==='source_table_year')assert.equal(String(r.source_cohort_year),c.period);}
  if(c.status==='source_reconciled'){assert.ok(Number.isInteger(c.listed_count));assert.equal(c.record_ids.length,c.listed_count);assert.ok(c.sources.length&&c.checked_at);}
  if(c.listed_count!==null){assert.ok(Number.isInteger(c.listed_count)&&c.listed_count>=0);assert.ok(c.record_ids.length<=c.listed_count);}
  if(c.cohort_complete)assert.ok(c.completeness_evidence?.length,'Full cohort claim requires independent evidence');
}
const cb={...base,tracks:['marketing','cb'],market_cycle:null},unclassified={...cb,tracks:['marketing']};
assert.equal(filterRecords([cb,unclassified],{track:'marketing'}).length,2,'Unknown subfield must remain in Marketing');
assert.equal(filterRecords([cb,unclassified],{track:'cb'}).length,1);
assert.equal(filterRecords([cb,unclassified],{track:'qm'}).length,0,'CB must not be automatically Quant');
assert.equal(filterRecords([cb,unclassified],{track:'marketing_unclassified'}).length,1);
assert.equal(summarize([{...base,status:'outcome_unknown',destination:null,placement_year:null}]).unknown,1);
const ubc=programs.find(p=>p.school==='University of British Columbia'&&p.kind==='marketing');
const ubc2023=findAudit(catalog,ubc.id,'2023');
assert.equal(ubc2023.record_ids.length,3);
assert.equal(records.find(r=>r.id==='ubc-zining-wang').placement_year,2024,'Prefer CV job-start year over source table year');
assert.equal(records.find(r=>r.id==='ubc-ekin-ok').placement_year,2022);
assert.equal(findAudit(catalog,ubc.id,'2024').listed_count,null,'Missing source year is unknown, not zero');
const next={...catalog,history_years:[2024,2025,2026,2027],current_cycle:'2027-2028'};
assert.deepEqual(auditPeriods(next),['2024','2025','2026','2027','2027-2028']);
assert.equal(findAudit(next,ubc.id,'2027').status,'not_started');
assert.equal(selectPrograms(catalog,{q:'Harvard',region:'US',kind:'marketing',progress:'audited'}).length,1);
assert.equal(selectPrograms(catalog,{q:'Harvard',region:'CA',kind:'marketing',progress:'all'}).length,0);
console.log(JSON.stringify({coverage:'passed',programs:programs.length,auditCells:coverage.length,checks:'program membership, source reconciliation, unknown years, CB filters, year conflicts, annual audit rollover'}));

// Keep incomplete historical evidence discoverable without treating it as a dated placement.
configure({currentCycle:catalog.current_cycle,historyYears:catalog.history_years});
const dated={...base,market_cycle:null,placement_year:catalog.history_years.at(-1)};
const noYear={...dated,id:'no-year',placement_year:null};
const noOutcome={...noYear,id:'no-outcome',status:'outcome_unknown',destination:null};
const market={...base,id:'market',status:'on_market',placement_year:null,destination:null};
assert.deepEqual(filterRecords([dated,noYear,noOutcome,market],{period:'unresolved'}).map(r=>r.id),['no-year','no-outcome']);
assert.deepEqual(filterRecords([dated,noYear,noOutcome,market],{period:'history'}).map(r=>r.id),['test']);
assert.equal(summarize([market,{...market,id:'past',market_cycle:'2000-2001'}]).onMarket,1,'Past market status must not inflate current-cycle counts');
const conflict={...noOutcome,graduation_year:2024,source_cohort_year:2024,source_reported_placement:'University B',subsequent:[{institution:'University B',start_year:2025}]};
assert.equal(filterRecords([conflict],{period:'2024'}).length,0,'Source table and graduation dates must not create a first-placement year');
assert.equal(summarize([conflict]).known,0,'A reported employer under review must not enter the confirmed denominator');
for(const id of ['penn-yu-zhao','toronto-mohsen-foroughifar']){
  const r=records.find(r=>r.id===id);
  if(r.status==='outcome_unknown'){
    assert.equal(r.destination,null,'Unresolved career sequence must not be presented as a confirmed first employer');
    assert.equal(r.placement_year,null,'Graduation year must not replace disputed job-start year');
  }
  assert.ok(r.source_reported_placement&&r.subsequent.length,'Preserve reported placements and observed career evidence');
}
const ntu=programs.find(p=>p.school==='Nanyang Technological University'&&p.kind==='marketing');
assert.deepEqual(new Set(findAudit(catalog,ntu.id,'2023').record_ids),new Set(['ntu-qing-tang','ntu-ruoding-wang']));
const ruoding=records.find(r=>r.id==='ntu-ruoding-wang');
assert.ok(ruoding,'Known graduates must remain in the archive');
if(ruoding.status==='outcome_unknown')assert.ok(filterRecords(records,{period:'unresolved'}).includes(ruoding),'Known graduates without outcomes must remain discoverable');
assert.equal(records.find(r=>r.id==='ntu-lingyu-lin').market_cycle,'2025-2026','Old candidate roster is not the new cycle');
const hku=programs.find(p=>p.school==='University of Hong Kong'&&p.kind==='marketing');
const anonymous={...catalog,coverage:[{...findAudit(catalog,hku.id,'2024'),listed_count:null,status:'partial'}]};
assert.equal(findAudit(anonymous,hku.id,'2024').listed_count,null,'An anonymous destination list is not a person denominator');
assert.ok(selectPrograms(catalog,{q:'University of Hong Kong',region:'HK',kind:'marketing',progress:'checked'}).some(p=>p.id===hku.id));
const nw=programs.find(p=>p.school==='Northwestern University'&&p.kind==='marketing');
for(const id of ['northwestern-samuel-su','northwestern-caroline-wang','northwestern-andrew-wooders'])assert.ok(findAudit(catalog,nw.id,'2026-2027').record_ids.includes(id),'Keep observed candidates when a rolling list expands');
console.log(JSON.stringify({batch2:'passed',checks:'unresolved filter, career conflicts, missing outcomes, stale candidate pages, unknown denominators, current season'}));

// A cohort record can be discoverable without being eligible for a first-job trend.
const cohortUnknown={...noOutcome,id:'cohort-unknown',source_cohort_year:catalog.history_years[0],target_scope:catalog.scope.id};
const cohortCurrent={...market,source_cohort_year:catalog.history_years.at(-1),target_scope:catalog.scope.id};
assert.deepEqual(filterRecords([cohortUnknown,cohortCurrent],{period:'cohorts'}).map(r=>r.id),['cohort-unknown']);
assert.equal(filterRecords([cohortUnknown],{period:'history'}).length,0);
assert.equal(summarize([cohortUnknown]).known,0);
assert.equal(filterRecords([cohortUnknown,{...cohortUnknown,id:'extension',target_scope:null}],{scope:'target'}).length,1);
assert.equal(filterRecords([cohortUnknown,{...cohortUnknown,id:'extension',target_scope:null}],{scope:'extension'}).length,1);
const scope=catalog.scope,targets=scopeRows(catalog),targetIds=new Set(targets.map(p=>p.program_id));
assert.equal(scope.ranking.rows.length,50,'The selected research universe is 50 North American schools');
assert.equal(new Set(scope.ranking.rows.map(p=>p.school)).size,50);
assert.equal(scope.ranking.journals.length,4);
assert.equal(scope.asia.filter(p=>p.region==='HK').length,5);
assert.equal(scope.asia.filter(p=>p.region==='SG').length,3);
assert.equal(targetIds.size,58);
for(const row of targets){const p=programs.find(p=>p.id===row.program_id);assert.ok(p?.target_scope);assert.equal(p.region,row.region);assert.equal(p.school,row.school);assert.equal(p.kind,'marketing');}
for(const r of records)assert.equal(Boolean(r.target_scope),targetIds.has(r.program_id),'Scope follows training program, not hiring institution or a field tag');
const targetSelection=selectPrograms(catalog,{q:'',region:'all',kind:'all',progress:'all',scope:'target'});
assert.equal(targetSelection.length,58,'The coverage view must not hide schools lacking people');
assert.equal(selectPrograms(catalog,{q:'City University of Hong Kong',region:'HK',kind:'marketing',progress:'all',scope:'target'}).length,1);
assert.ok(targetSelection.some(p=>p.eligibility==='not_identified'),'Research rank does not imply a Marketing doctorate exists');
assert.equal(filterRecords(records,{period:'cohorts'}).some(r=>r.id==='york-university-rowan-el-bialy'),true,'Graduates without a known job remain discoverable');
assert.equal(findAudit(catalog,'university-of-california-san-diego-marketing','2023').record_ids.length,2,'Multiple source passes must not drop earlier names');
assert.equal(records.find(r=>r.name==='Junqiu Jiang').placement_year,2024,'Prefer dated personal employment evidence to a conflicting alumni label');
assert.equal(records.find(r=>r.name==='Tsung-Yiou Hsieh').destination,null,'Unresolved parallel 2023 jobs must not become a 2025 faculty first job');
assert.ok(fs.existsSync('dist/data/scope.json'));
assert.deepEqual(JSON.parse(fs.readFileSync('dist/data/scope.json','utf8')),scope);
configure({currentCycle:'2027-2028',historyYears:[2024,2025,2026,2027]});
assert.equal(filterRecords([{...cohortUnknown,source_cohort_year:2027}],{period:'cohorts'}).length,1,'Cohort discovery rolls forward with configuration');
configure({currentCycle:catalog.current_cycle,historyYears:catalog.history_years});
console.log(JSON.stringify({scope58:'passed',targetSchools:targetIds.size,checks:'scope membership, visible gaps, unknown outcomes, career sequence, multi-source reconciliation, yearly rollover'}));
