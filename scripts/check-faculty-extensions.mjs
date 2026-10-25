import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {receivingProgress,hasDatedCareer,FACULTY_TYPES} from '../dist/faculty.js';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const c=read('dist/data/catalog.json'),a=c.faculty,plan=read('data/faculty-scope-macao-australia-2026-10-23.json');
const baseline=read('data/faculty-baseline-macao-australia-2026-10-23.json'),records=read('data/records.json');
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
assert.equal(hash(read('data/scope.json')),baseline.placement_scope_sha256,'The fixed doctoral placement universe must not expand with receiving geography');
for(const [name,expected] of Object.entries(baseline.historical_reports))assert.equal(hash(read('data/'+name+'.json')),expected,'Dated historical release changed: '+name);
const receiptPaths=fs.readdirSync('data').filter(f=>/^faculty-(depth|affiliation)-receipt-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort((a,b)=>a.slice(-15,-5).localeCompare(b.slice(-15,-5))||(Number(b.includes('-depth-'))-Number(a.includes('-depth-')))).map(f=>'data/'+f),reviewed=new Map(),allBatches=[];
function validateCurrentChange(p,k){
 assert.ok(['role','start_year','start_date','tenure_status','department','status'].includes(k),'Unexpected current field mutation '+k);
 const sources=p.sources.filter(s=>s.supports?.includes('current.'+k)&&s.quote);
 if(p.current[k]===null){assert.ok(['start_year','start_date'].includes(k));assert.ok(p.unknowns.some(g=>g.field==='current.'+k||g.field==='current.start_year'));assert.ok(sources.length,'Cleared rank date needs original contradictory evidence');return}
 if(k==='status'){assert.equal(p.current.status,'independent_official_report');assert.ok(sources.some(s=>s.access_status==='content_read'&&s.quote.includes(p.name)&&s.quote.includes(p.current.role)),'Independent report must name the person and title');return}
 assert.ok(sources.some(s=>k==='tenure_status'&&p.current[k]==='tenure_track'?/tenure[- ]track/i.test(s.quote):s.quote.includes(String(p.current[k]))),'Changed current field needs exact official excerpt '+k);
}
for(const path of receiptPaths){const receipt=read(path);for(const b of receipt.batches){const x=read(b.path);assert.equal(hash(x),b.sha256);assert.ok(a.import_batches.some(i=>i.id===b.id&&i.sha256===b.sha256));allBatches.push(x)}for(const r of receipt.profiles){const prior=reviewed.get(r.before.id);if(prior)assert.equal(hash(r.before),prior.after_sha256,'Broken reviewed release chain '+r.before.id);reviewed.set(r.before.id,{before:prior?.before||r.before,after_sha256:r.after_sha256})}}
const batch={people:allBatches.flatMap(b=>b.people)};
const oldIds=new Set(baseline.people.map(p=>p.id)),newHosts=new Map(plan.schools.map(h=>[h.id,h]));
assert.equal(baseline.people.length,1114);assert.equal(baseline.hosts.length,67);
for(const b of baseline.people){const p=a.people.find(p=>p.id===b.id);assert.ok(p,'Lost existing faculty '+b.id);const review=reviewed.get(b.id);if(review){assert.equal(hash(review.before),b.snapshot_sha256);assert.equal(hash(p),review.after_sha256);assert.ok(batch.people.some(x=>x.existing_faculty_id===p.id));}else assert.equal(hash(p),b.snapshot_sha256,'Existing faculty evidence changed without reviewed batch '+b.id);if(hash(p.current)!==hash(b.current)){assert.ok(review,'Unreviewed change to existing appointment '+b.id);for(const k of new Set([...Object.keys(p.current),...Object.keys(b.current)])){if(hash(p.current[k]??null)===hash(b.current[k]??null))continue;validateCurrentChange(p,k)}}if(!reviewed.has(b.id))assert.deepEqual(p.phd,b.phd,'Unreviewed change to existing degree '+b.id);}
assert.deepEqual(records.map(r=>r.id).sort(),baseline.placement_facts.map(r=>r.id).sort(),'Receiving extension cannot add placement people');
for(const b of baseline.placement_facts){const p=records.find(p=>p.id===b.id);for(const k of Object.keys(b))assert.deepEqual(p[k],b[k],'Placement history changed '+b.id+' / '+k);}
const added=a.people.filter(p=>!oldIds.has(p.id));
assert.ok(added.length>0,'Extension must contain verified faculty, not empty school shells');
for(const p of added){
 assert.ok(newHosts.has(p.host_id),p.id+' host not in the versioned selection');
 assert.equal(p.current.region,newHosts.get(p.host_id).region);
 assert.ok(FACULTY_TYPES[p.faculty_type],p.id+' unsupported appointment group');
 if(reviewed.has(p.id))assert.equal(hash(p),reviewed.get(p.id).after_sha256);else assert.equal(p.checked_at,'2026-10-23');assert.ok([p.homepage,p.cv_url].filter(Boolean).some(u=>p.sources.some(s=>s.url===u&&s.quote)),p.id+' readable individual profile or CV source');
 assert.ok(p.sources.some(s=>s.quote&&s.supports?.length),p.id+' readable field evidence');
 for(const source of p.sources)for(const field of source.supports||[])assert.notEqual(field.split('.').reduce((v,k)=>v?.[k],p),undefined,p.id+' dangling field evidence '+field);
 for(const e of p.career_events||[])assert.ok((e.source_urls?.length||e.sources?.length)&&(e.evidence||e.quote),p.id+' dated career needs actual source and excerpt');
 if(!Number.isInteger(p.phd.year))assert.ok(p.unknowns.some(g=>/phd|degree|year|博士|年份/i.test((g.field||'')+' '+(g.reason||''))),p.id+' unknown PhD year needs a reason');
 if(Number.isInteger(p.phd.year))assert.ok(p.sources.some(s=>s.quote?.includes(String(p.phd.year))&&s.supports?.some(f=>['phd','phd.year','phd.date'].includes(f))),p.id+' PhD year needs a field excerpt');
 if(!hasDatedCareer(p))assert.ok(p.unknowns.some(g=>/career|appointment|履历|职业|任职|start/i.test((g.field||'')+' '+(g.reason||''))),p.id+' undated career needs a reason');
 assert.notEqual(p.career_sequence_complete,true,p.id+' partial public biography cannot imply a complete career census');
}
const schools=receivingProgress(c).filter(h=>newHosts.has(h.id));
assert.equal(schools.length,11);assert.ok(schools.every(h=>h.started&&h.check?.sources.length),'Every selected school must have an actual checked status and evidence');
for(const h of schools){assert.ok(h.people.length>0||h.state==='blocked',h.id+' actual data or access limitation');if(h.state==='complete')assert.equal(h.roster_total,h.check.roster.member_ids.length);}
for(const name of ['faculty-na-audit-2026-10-22','faculty-followup-audit-2026-10-22'])assert.equal(read('data/'+name+'.json').as_of,'2026-10-22','Historical release must remain dated');
console.log(JSON.stringify({faculty_extension:'passed',selected_schools:schools.length,new_people:added.length,regions:Object.fromEntries(['MO','AU'].map(r=>[r,added.filter(p=>p.current.region===r).length]))}));

