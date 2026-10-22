import fs from 'node:fs';
import assert from 'node:assert/strict';
import {validateObservatory,AUDIT_STATES} from './observatory-model.mjs';
const data=JSON.parse(fs.readFileSync('dist/data/observatory.json','utf8'));
const records=JSON.parse(fs.readFileSync('data/records.json','utf8'));
assert.deepEqual(validateObservatory(data),[]);
assert.equal(data.quality.metrics.people,records.length);
for(const raw of records){const p=data.people.find(p=>p.id===raw.id);assert.ok(p,'Person lost during migration '+raw.id);assert.deepEqual(p.sources,raw.sources);assert.deepEqual(p.research.raw.tracks,raw.tracks);assert.deepEqual(p.research.raw.methods,raw.methods);assert.equal(p.graduation_year,raw.graduation_year);if(!raw.graduation_year)assert.equal(data.events.some(e=>e.person_id===raw.id&&e.type==='graduation'),false,'A source roster year is not graduation');}
for(const c of data.claims){assert.ok(data.people.some(p=>p.id===c.person_id));assert.ok(Array.isArray(c.source_urls));if(c.status==='legacy_reference')assert.equal(c.quote,null,'Migration cannot fabricate original quotations');}
for(const a of data.audit){assert.ok(AUDIT_STATES[a.roster_status],a.roster_status);assert.equal(a.record_ids.length,a.outcome_known+a.outcome_unknown);if(a.listed_count===0)assert.equal(a.record_ids.length,0);if(a.cohort_complete)assert.ok(a.completeness_evidence?.length);}
for(const dimension of ['tracks','topics','methods']){const ids=new Set(data.taxonomy[dimension].map(t=>t.id));assert.equal(ids.size,data.taxonomy[dimension].length);for(const p of data.people)for(const id of p.research[dimension])assert.ok(ids.has(id));}
assert.equal(new Set(data.jobs.map(j=>j.id)).size,data.jobs.length);
for(const job of data.jobs){assert.ok(job.institution&&job.title&&job.source_urls.length);assert.ok(job.positions===null||Number.isInteger(job.positions)&&job.positions>=0);assert.ok(job.checked_at);assert.ok(job.published_at===null||/^\d{4}/.test(job.published_at));assert.ok(job.deadline===null||/^\d{4}/.test(job.deadline));}
assert.equal(data.release.changes.people,data.quality.metrics.people-data.release.baseline.counts.people);
for(const file of ['quality-report.json','release-report.json'])assert.ok(fs.existsSync('dist/data/'+file));
console.log(JSON.stringify({observatory:'passed',people:data.people.length,events:data.events.length,claims:data.claims.length,institutions:data.institutions.length,jobs:data.jobs.length,complete_cohorts:data.quality.metrics.complete_cohorts}));
