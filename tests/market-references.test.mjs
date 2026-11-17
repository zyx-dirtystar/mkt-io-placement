import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {filterResources,marketCoverageSnapshot,resourcesMarkup} from '../dist/resources-view.js';
import {jobTiming,jobState,filterJobs} from '../dist/observatory-logic.js';
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));

test('priority dates and ad expiry do not establish a closed search or a hire',() => {
  const rolling = {status:'open',deadline:'2026-07-15',deadline_kind:'priority',positions:null,hires:null};
  assert.equal(jobState(rolling,'2026-11-17'),'active');
  assert.equal(jobTiming(rolling,'2026-11-17').priority_passed,true);
  assert.equal(jobTiming(rolling,'2026-11-17').application_deadline,null);
  assert.equal(jobState({...rolling,status:'closed'},'2026-11-17'),'historical');
  assert.equal(jobState({...rolling,posting_end_date:'2026-10-31'},'2026-11-17'),'unknown');
  assert.equal(jobState({...rolling,application_deadline:'2026-11-16'},'2026-11-17'),'historical');
  assert.equal(jobState({...rolling,deadline_kind:'application',deadline:'2026-11-17'},'2026-11-17'),'active');
  assert.equal(jobState({...rolling,deadline_kind:'application',deadline:'2026-11'},'2026-11-17'),'active');
  assert.equal(rolling.hires,null);
});

test('reviewed deadline conflicts and Quant vacancy evidence survive generation',() => {
  const jobs = read('dist/data/observatory.json').jobs;
  for (const id of ['ubc-sbe-ejm12709','cornell-io-ejm12658','cuhksz-platform-ejm12463']) {
    const job = jobs.find(j => j.id === id);
    assert.equal(jobState(job,'2026-11-17'),'historical');
    assert.equal(job.checked_at,'2026-11-17');
    assert.equal(job.hires,null);
    assert.ok(job.status_source_url && job.status_quote);
  }
  const calgary = jobs.find(j => j.id === 'calgary-quant-18360463');
  assert.equal(jobState(calgary,'2026-11-17'),'active');
  assert.equal(jobState(calgary,'2026-11-19'),'historical');
  assert.equal(calgary.title.startsWith('Assistant Professor'),true);
  assert.equal(calgary.tracks.includes('strategy'),false,'Teaching interests do not classify research');
  assert.equal(jobState(jobs.find(j => j.id === 'frankfurt-marketing-interfolio184939'),'2026-11-17'),'historical');
  assert.ok(filterJobs(jobs,{track:'qm',status:'active'},'2026-11-17').some(j => j.id === calgary.id));
});

test('reference filtering retains source limitations and distinguishes adjacent IO from CB',() => {
  const guide = read('data/market-resources.json');
  const qmJobs = filterResources(guide.resources,{track:'qm',task:'jobs'});
  assert.ok(qmJobs.some(r => r.id === 'ejm'));
  assert.ok(qmJobs.some(r => r.id === 'ama-elmar'));
  assert.equal(filterResources(guide.resources,{track:'cb'}).some(r => r.id === 'ejm'),false);
  assert.equal(filterResources(guide.resources,{q:'marketingphdjobs'})[0].id,'ams-jobs');
  assert.equal(guide.resources.find(r => r.id === 'emac-jobs').access,'demo');
  assert.equal(read('data/jobs.json').some(j => /fictional|Example European University/.test(j.institution)),false);
});

test('coverage counts describe records, preserve unknown tracks and exclude faculty from placements',() => {
  const records = [{tracks:['marketing','qm','qm'],market_cycle:'2026-2027'},{tracks:['marketing'],market_cycle:null},{tracks:['io'],market_cycle:null}];
  const result = marketCoverageSnapshot(records,{current_cycle:'2026-2027',faculty:{people:[{},{},{},{}]}},{audit:[{cohort_complete:false}],jobs:[{}]});
  assert.equal(result.placement_records,3);
  assert.equal(result.faculty_profiles,4);
  assert.equal(result.recorded_tracks.qm,1);
  assert.equal(result.marketing_unclassified,1);
  assert.equal(result.complete_cohorts,0);
  assert.equal(result.current_candidates,1);
});

test('reference markup separates survey populations and safely renders untrusted text',() => {
  const catalog = read('dist/data/catalog.json'), observatory = read('dist/data/observatory.json');
  const ctx = {records:read('data/records.json'),catalog,observatory};
  const html = resourcesMarkup(ctx,{q:'<script>alert(1)</script>'});
  assert.ok(html.includes('Total respondents: <strong>61</strong>'));
  assert.ok(html.includes('neither Quant-specific targets nor market-wide success rates'));
  assert.ok(html.includes('value="&lt;script&gt;'));
  assert.equal(html.includes('<script>alert(1)</script>'),false);
  assert.ok(html.includes('Reference review dates are separate'));
  assert.equal(observatory.as_of,read('config.json').observation_as_of,'Release dates must not override person observation windows');
});
