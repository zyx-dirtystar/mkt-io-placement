import fs from 'node:fs';
import {depthReport} from './depth-report.mjs';
import {buildObservatory, validateObservatory} from './observatory-model.mjs';
import {writeFacultyExpansionReport} from './faculty-na-report.mjs';
import {writeFacultyFollowupReport} from './faculty-followup-report.mjs';
import {writeFacultyExtensionReport} from './faculty-extension-report.mjs';
const config=JSON.parse(fs.readFileSync('config.json','utf8'));
const read=(name,fallback)=>fs.existsSync('data/'+name+'.json')?JSON.parse(fs.readFileSync('data/'+name+'.json','utf8')):fallback;
const raw=read('records'),records=structuredClone(raw),schools=read('schools'),release_notes=read('release-notes');
const faculty_update=writeFacultyExpansionReport();
const faculty_followup_update=writeFacultyFollowupReport();
const faculty_extension_update=writeFacultyExtensionReport();
const programs=read('programs'),coverage=read('coverage'),scope=read('scope'),faculty=read('faculty');
const targetIds=new Set([...scope.ranking.rows,...scope.asia].map(p=>p.program_id));
for(const r of records){r.target_scope=targetIds.has(r.program_id)?scope.id:null;r.origin_rank=programs.find(p=>p.id===r.program_id)?.kind==='marketing'?scope.ranking.rows.find(p=>p.school===r.school)?.rank||null:null;}
for(const p of programs)p.record_count=records.filter(r=>r.program_id===p.id).length;
const depthDate=fs.readdirSync('data').filter(f=>/^faculty-depth-receipt-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().at(-1).slice('faculty-depth-receipt-'.length,-5);
const faculty_depth_update=depthReport(faculty,{receiptPath:'data/faculty-depth-receipt-'+depthDate+'.json',asOf:depthDate});fs.writeFileSync('data/faculty-depth-audit-'+depthDate+'.json',JSON.stringify(faculty_depth_update,null,2)+'\n');
const appointmentPath=fs.readdirSync('data').filter(f=>/^faculty-affiliation-receipt-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().at(-1),appointmentReceipt=appointmentPath?read(appointmentPath.slice(0,-5)):null,faculty_appointment_update=appointmentReceipt?{as_of:appointmentReceipt.checked_at,reviewed:appointmentReceipt.profiles.length,...appointmentReceipt.changes,limitations:appointmentReceipt.limitations}:null;
const catalog={faculty_appointment_update,faculty_depth_update,...config,exhaustive:false,scope,programs,coverage,faculty,faculty_update,faculty_followup_update,faculty_extension_update,archive_years:[...new Set([...config.history_years,...records.map(r=>r.placement_year).filter(Boolean)])].sort(),schools,release_notes};
const observatory=buildObservatory({records:raw,programs,coverage,scope,faculty,config,taxonomy:read('taxonomy'),ioScope:read('io-scope',null),jobs:read('jobs',[]),researchAudit:read('research-audit-2026-10-24',read('research-audit-2026-10-22',null)),reviewQueue:fs.existsSync('review-queue.json')?JSON.parse(fs.readFileSync('review-queue.json','utf8')):[],maintenanceQueue:read('maintenance-queue',[]),sourceChecks:read('maintenance-sources',{}),baseline:read('maintenance-baseline',null)});
const errors=validateObservatory(observatory);
if(errors.length)throw new Error('Observatory generation failed:\n'+errors.join('\n'));
fs.mkdirSync('dist/data',{recursive:true});
fs.writeFileSync('dist/data/records.json',JSON.stringify(records,null,2)+'\n');
fs.writeFileSync('dist/data/catalog.json',JSON.stringify(catalog,null,2)+'\n');
fs.writeFileSync('dist/data/scope.json',JSON.stringify(scope,null,2)+'\n');
fs.writeFileSync('dist/data/observatory.json',JSON.stringify(observatory,null,2)+'\n');
fs.writeFileSync('dist/data/release-report.json',JSON.stringify(observatory.release,null,2)+'\n');
fs.writeFileSync('dist/data/quality-report.json',JSON.stringify({as_of:observatory.as_of,...observatory.quality},null,2)+'\n');
console.log(JSON.stringify({synchronized:records.length,cycle:catalog.current_cycle,events:observatory.events.length,claims:observatory.claims.length,complete_cohorts:observatory.quality.metrics.complete_cohorts,jobs:observatory.jobs.length}));

// Full historical exports remain available. Browsing uses a smaller searchable index.
fs.mkdirSync('dist/data/faculty-profiles',{recursive:true});
const slim=structuredClone(catalog);
slim.faculty.people=faculty.people.map(p=>{
 const detail_url='data/faculty-profiles/'+encodeURIComponent(p.id)+'.json';
 fs.writeFileSync('dist/data/faculty-profiles/'+p.id+'.json',JSON.stringify(p));
 const item=Object.fromEntries(['id','name','aliases','host_id','placement_id','current','phd','tracks','fields','homepage','cv_url','faculty_type','faculty_scope','checked_at','unknowns','conflicts','resolved_conflicts','research_inference','followup_review','backfill_review'].filter(k=>p[k]!==undefined).map(k=>[k,structuredClone(p[k])]));
 item.career_events=(p.career_events||[]).map(e=>{return Object.fromEntries(['type','event_type','institution','title','role','start','end','start_date','end_date','start_year','end_year','year','date','status'].filter(k=>e[k]!==undefined).map(k=>[k,e[k]]))});
 item.detail_url=detail_url;return item;
});
const ids=new Set(raw.map(p=>p.id));const runtime={...observatory,people:observatory.people.filter(p=>ids.has(p.id)),claims:observatory.claims.filter(c=>ids.has(c.person_id)),events:observatory.events.filter(e=>ids.has(e.person_id))};
fs.writeFileSync('dist/data/catalog-runtime.json',JSON.stringify(slim));
fs.writeFileSync('dist/data/observatory-runtime.json',JSON.stringify(runtime));
