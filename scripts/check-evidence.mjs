import assert from 'node:assert/strict';
import fs from 'node:fs';
import {effectiveTracks,regionalMatches,regionalSummary,outcomeScenario,gapSummary} from '../dist/evidence.js';
import {filterRecords} from '../dist/core.js';
import {CSV_HEADERS,csvRows} from '../dist/export.js';
const base={id:'test',name:'Example',school:'School',program:'Marketing',origin:'US',tracks:['marketing'],fields:[],methods:[],topics:[],sources:[],status:'placed',destination:'Example University',destination_region:'US',role:'Assistant Professor',placement_year:2024};
const provisional={...base,research_inference:{status:'provisional',tracks:['qm'],reason:'Analytical research',source_urls:['https://example.org/'],checked_at:'2026-10-08'}};
assert.deepEqual(effectiveTracks(provisional),['marketing']);
assert.deepEqual(effectiveTracks(provisional,'include_provisional'),['marketing','qm']);
assert.equal(filterRecords([provisional],{track:'qm'}).length,0);
assert.equal(filterRecords([provisional],{track:'qm',researchMode:'include_provisional'}).length,1);
assert.equal(filterRecords([provisional],{track:'marketing_unclassified',researchMode:'include_provisional'}).length,0);
assert.equal(filterRecords([provisional],{quality:'provisional'}).length,1);
assert.equal(filterRecords([provisional],{quality:'research_missing'}).length,1,'A provisional label does not close the evidence gap');
const event={kind:'academic_exchange',region:'CN',observed_date:'2024',source_url:'https://example.org/',evidence:'Ordinary seminar'};
assert.equal(regionalMatches({...base,name:'Zhang Wei',undergraduate:{region:'CN'}},'CN','any'),false,'Neither name nor education establishes interest');
assert.equal(regionalMatches({...base,regional_signals:[event]},'CN','any'),false,'Ordinary seminars are not recruitment');
assert.equal(regionalMatches({...base,regional_signals:[event]},'CN','exchange'),true);
assert.equal(regionalMatches({...base,regional_signals:[{...event,kind:'recruiting_event'}]},'CN','interest'),false,'Recruiting events do not establish self-stated preference');
assert.equal(regionalMatches({...base,regional_signals:[{...event,kind:'recruiting_event'}]},'CN','any'),true);
assert.equal(regionalMatches({...base,regional_signals:[{...event,kind:'explicit_interest',region:'HK'}]},'CN','interest'),false);
assert.equal(regionalMatches({...base,regional_signals:[{...event,kind:'explicit_interest',region:'HK'}]},'CN_HK','interest'),true);
const china={...base,destination:'CUHK Shenzhen',destination_region:'HK',role:null};
assert.equal(regionalMatches(china,'CN','placement'),true);
assert.equal(regionalMatches(china,'CN','faculty'),false,'Employer alone cannot count as a faculty position');
const path={...base,destination:'University A',destination_region:'CN',role:'Postdoc',final_placement:{destination:'University B',destination_region:'US',role:'Assistant Professor',year:2025}};
assert.equal(regionalMatches(path,'CN','placement','first'),true);assert.equal(regionalMatches(path,'CN','placement','final'),false);
const unknown={...base,status:'outcome_unknown',destination:null,role:null,placement_year:null};
const sample=[base,{...base,role:'Postdoc'},unknown,{...unknown,status:'deferred'},{...unknown,status:'on_market'}];
const s=outcomeScenario(sample,'final',0.5);
assert.deepEqual([s.known,s.unknown,s.denominator,s.lower,s.upper,s.scenario],[2,1,3,1/3,2/3,0.5]);
assert.equal(outcomeScenario([],undefined,0).scenario,null);
assert.equal(outcomeScenario([base],undefined,0).scenario,1);
assert.equal(outcomeScenario([unknown],undefined,1).scenario,1);
assert.throws(()=>outcomeScenario(sample,'final',NaN));assert.throws(()=>outcomeScenario(sample,'final',2));
const yearUnknown={...base,placement_year:null};
const g=gapSummary([unknown,yearUnknown]);assert.equal(g.outcome_missing,1);assert.equal(g.year_missing,1);
assert.equal(filterRecords([yearUnknown],{period:'2024'}).length,0,'Scenarios must not add dates');
const row=csvRows([provisional],'final','include_provisional')[0];assert.equal(row.length,CSV_HEADERS.length);assert.equal(row[CSV_HEADERS.indexOf('暂定研究方向')],'qm');assert.equal(row[CSV_HEADERS.indexOf('用于筛选的方向')],'marketing; qm');
const records=JSON.parse(fs.readFileSync('dist/data/records.json','utf8'));
for(const r of records){
 for(const x of [r.research_inference,r.research_classification].filter(Boolean)){
  assert.ok(x.checked_at&&x.source_urls.length&&x.source_urls.every(u=>r.sources.some(s=>s.url===u)),r.id+' classification provenance');
 }
 if(r.research_inference){assert.equal(r.research_inference.status,'provisional');assert.ok(r.research_inference.reason);assert.ok(r.research_inference.tracks.every(t=>['qm','cb','strategy','io'].includes(t)));}
 for(const x of r.regional_signals||[]){assert.ok(['CN','HK'].includes(x.region));assert.ok(['explicit_interest','recruiting_event','academic_exchange'].includes(x.kind));assert.match(x.observed_date,/^20\d{2}(?:-\d{2})?(?:-\d{2})?$/);assert.ok(x.evidence&&r.sources.some(s=>s.url===x.source_url));assert.ok(x.checked_at);}
}
assert.equal(records.find(r=>r.id==='indiana-university-der-wei-huang').placement_year,2023);
assert.equal(records.find(r=>r.id==='nus-shiwen-gao').tracks.includes('qm'),true);
assert.equal(regionalSummary(records.filter(r=>['nus-jingman-cao','hkust-da-he','indiana-university-der-wei-huang'].includes(r.id))).interest,0,'Ordinary exchanges in this batch must not become stated preferences');
console.log(JSON.stringify({evidence:'passed',checks:'provisional opt-in, source provenance, geographic evidence, no name/education proxy, no lecture-to-recruitment inference, no event-to-preference inference, scenario denominator and bounds, CSV separation'}));
