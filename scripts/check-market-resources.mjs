import fs from 'node:fs';
import assert from 'node:assert/strict';
import {RESOURCE_TRACKS,RESOURCE_TASKS,RESOURCE_PUBLISHERS,marketCoverageSnapshot} from '../dist/resources-view.js';
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
const guide = read('data/market-resources.json');
assert.equal(guide.schema_version,'1.0');
assert.match(guide.reviewed_at,/^\d{4}-\d{2}-\d{2}$/);
assert.ok(guide.scope?.trim());
const ids = new Set(), urls = new Set();
for (const r of guide.resources) {
  assert.ok(r.id && !ids.has(r.id),'Duplicate or missing reference ID'); ids.add(r.id);
  assert.ok(!urls.has(r.url),'Duplicate canonical reference URL'); urls.add(r.url);
  assert.ok(['http:','https:'].includes(new URL(r.url).protocol));
  assert.ok(['read','limited','redirect','demo'].includes(r.access));
  assert.ok(['marketing','economics','mixed'].includes(r.market));
  assert.ok(Object.hasOwn(RESOURCE_PUBLISHERS,r.publisher_type));
  assert.ok(r.tracks.length && r.tracks.every(t => t !== 'all' && Object.hasOwn(RESOURCE_TRACKS,t)));
  assert.ok(r.tasks.length && r.tasks.every(t => t !== 'all' && Object.hasOwn(RESOURCE_TASKS,t)));
  for (const field of ['title','publisher','edition','region','use','limit','takeaway']) assert.ok(r[field]?.trim(),r.id + ': missing ' + field);
  assert.match(r.checked_at,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(r.checked_at <= guide.reviewed_at);
}
assert.ok(ids.has(guide.survey.resource_id));
assert.ok(Number.isInteger(guide.survey.n_total) && guide.survey.n_total > 0);
for (const metric of guide.survey.metrics) {
  assert.ok(Number.isInteger(metric.n) && metric.n > 0 && metric.n <= guide.survey.n_total);
  assert.ok(Number.isFinite(metric.mean));
}
const catalog = read('dist/data/catalog.json'), observatory = read('dist/data/observatory.json');
assert.deepEqual(catalog.market_resources,guide,'Build must include the authoritative reference collection');
assert.deepEqual(read('dist/data/catalog-runtime.json').market_resources,guide,'Browser catalog must contain the same reference collection');
const snapshot = marketCoverageSnapshot(read('data/records.json'),catalog,observatory);
const access_counts = Object.fromEntries(['read','limited','redirect','demo'].map(key => [key,guide.resources.filter(r => r.access === key).length]));
const audit = {reviewed_at:guide.reviewed_at,person_observation_as_of:observatory.as_of,scope:guide.scope,resources:guide.resources.length,access_counts,snapshot,limitations:['Resource relevance is not a person-level research classification.','An access attempt does not refresh person evidence.','Survey respondent totals do not enter placement denominators.','Reference-directory size does not establish cohort completeness; defined populations require separate roster evidence. Job coverage is not globally exhaustive.']};
fs.writeFileSync(`data/market-reference-audit-${guide.reviewed_at}.json`,JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify({market_resources:'passed',...audit}));
