import fs from 'node:fs';
import path from 'node:path';
import {digest} from './observatory-model.mjs';
const json=(root,file,fallback)=>fs.existsSync(path.join(root,file))?JSON.parse(fs.readFileSync(path.join(root,file),'utf8')):fallback;
const get=(obj,field)=>field.split('.').reduce((v,k)=>v?.[k],obj);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const safeURL=s=>{try{return ['http:','https:'].includes(new URL(s).protocol);}catch{return false;}};
const filenames=['data/records.json','data/coverage.json','data/programs.json','data/maintenance-batches.json'];
export function planBatch(root,batch){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(batch.checked_at||''))throw new Error('Batch checked_at must be an explicit YYYY-MM-DD');
  const sha256=digest(batch),id=batch.id||batch.batch_id||'legacy-'+sha256.slice(0,20);
  const ledger=json(root,'data/maintenance-batches.json',[]);
  const previous=ledger.find(x=>x.id===id);
  if(previous){if(previous.sha256!==sha256)throw new Error('Batch ID already exists with different content: '+id);return {id,sha256,noop:true,reason:'Already applied; no files changed'};}
  const originals=Object.fromEntries(filenames.map(file=>[file,fs.existsSync(path.join(root,file))?fs.readFileSync(path.join(root,file),'utf8'):null]));
  const records=json(root,'data/records.json',[]),coverage=json(root,'data/coverage.json',[]),programs=json(root,'data/programs.json',[]);
  const additions=batch.additions||[],updates=batch.updates||[],touched=[],itemIds=new Set();
  for(const item of [...updates,...additions]){
    if(!item.id||itemIds.has(item.id))throw new Error('Missing or repeated item ID: '+item.id);itemIds.add(item.id);
    if(!item.set||typeof item.set!=='object'||Array.isArray(item.set))throw new Error('Missing set object: '+item.id);
    if(item.set.id&&item.set.id!==item.id)throw new Error('Stable person IDs cannot be mutated: '+item.id);
    let r=records.find(r=>r.id===item.id);
    const addition=additions.includes(item);
    if(addition&&r)throw new Error('Addition ID already exists: '+item.id);
    if(!addition&&!r)throw new Error('Unknown update ID: '+item.id);
    if(r){
      const expected=item.expected||item.preconditions||{};
      for(const [field,value]of Object.entries(expected))if(!equal(get(r,field),value))throw new Error('Precondition conflict '+item.id+' '+field);
      if(item.expected_checked_at&&item.expected_checked_at!==r.checked_at)throw new Error('Record revision conflict: '+item.id);
      const changed=Object.keys(item.set).filter(k=>!equal(r[k],item.set[k]));
      if(r.checked_at>batch.checked_at&&changed.some(k=>!Object.hasOwn(expected,k)))throw new Error('Stale batch would overwrite newer evidence: '+item.id);
      if(item.expected_hash&&item.expected_hash!==digest(r))throw new Error('Record hash conflict: '+item.id);
    }else{
      r={id:item.id,name:'',school:'',program:'博士项目 · Marketing',program_id:'',origin:'US',fields:['Marketing'],tracks:['marketing'],methods:[],topics:[],market_cycle:null,placement_year:null,source_cohort_year:null,graduation_year:null,status:'outcome_unknown',destination:null,destination_region:'UNKNOWN',role:null,job_kind:'unknown',jmp:null,field_evidence:'',undergraduate:null,identity:{chinese_national:{value:'unknown',source:null},chinese_heritage:{value:'unknown',source:null}},sources:[],subsequent:[],notes:''};records.push(r);
    }
    Object.assign(r,structuredClone(item.set));
    if(!r.name||!r.school)throw new Error('Person name and school are required: '+r.id);
    if(!programs.some(p=>p.id===r.program_id&&p.school===r.school))throw new Error('Unknown or mismatched program: '+r.id);
    for(const s of item.sources||[]){if(!safeURL(s.url))throw new Error('Invalid source URL: '+r.id);if(!r.sources.some(x=>x.url===s.url))r.sources.push(s);}
    if(!r.sources.length)throw new Error('Missing evidence sources: '+r.id);
    if(item.note&&!r.notes.includes(item.note))r.notes+=(r.notes?' ':'')+batch.checked_at+'：'+item.note;
    // A deliberately reviewed older value may pass explicit preconditions, but freshness never moves backwards.
    r.checked_at=r.checked_at>batch.checked_at?r.checked_at:batch.checked_at;
    r.research_review={checked_at:batch.checked_at,status:'reviewed',batch_id:id,evidence_urls:(item.sources||[]).map(s=>s.url)};
    if(item.set.final_placement)for(const url of item.set.final_placement.sources||[])if(!r.sources.some(s=>s.url===url))throw new Error('Final placement source missing '+r.id);
    touched.push(r);
  }
  for(const r of touched){
    const periods=[r.source_cohort_year&&String(r.source_cohort_year),r.market_cycle].filter(Boolean);
    for(const c of coverage)if(c.record_ids.includes(r.id)&&(c.program_id!==r.program_id||(c.year_basis==='source_table_year'&&!periods.includes(c.period)))){
      c.record_ids=c.record_ids.filter(x=>x!==r.id);c.status='partial';c.listed_count=null;c.cohort_complete=false;c.notes=(c.notes||'')+' '+batch.checked_at+'：批次更正人员项目或来源年份；保留原单元待重新核验。';
    }
    for(const period of periods){
      let cell=coverage.find(c=>c.program_id===r.program_id&&c.period===period);
      if(!cell){cell={program_id:r.program_id,period,status:'partial',listed_count:null,record_ids:[],year_basis:period.includes('-')?'explicit_market_cycle':'source_table_year',cohort_complete:false,checked_at:null,sources:[],notes:'逐人证据补充，尚未确认整届分母。'};coverage.push(cell);}
      if(!cell.record_ids.includes(r.id)){cell.record_ids.push(r.id);cell.status='partial';cell.listed_count=null;cell.cohort_complete=false;cell.checked_at=batch.checked_at;for(const url of r.research_review.evidence_urls)if(!cell.sources.some(s=>s.url===url))cell.sources.push({label:'逐人核验来源',url});}
    }
  }
  for(const p of programs)p.record_count=records.filter(r=>r.program_id===p.id).length;
  if(new Set(records.map(r=>r.id)).size!==records.length)throw new Error('Duplicate people IDs');
  for(const c of coverage){if(new Set(c.record_ids).size!==c.record_ids.length)throw new Error('Duplicate cell members');for(const id of c.record_ids)if(records.find(r=>r.id===id)?.program_id!==c.program_id)throw new Error('Cross-program membership '+id);}
  ledger.push({id,sha256,checked_at:batch.checked_at,applied_at:new Date().toISOString(),updates:updates.map(i=>i.id),additions:additions.map(i=>i.id)});
  const values={'data/records.json':records,'data/coverage.json':coverage,'data/programs.json':programs,'data/maintenance-batches.json':ledger};
  return {id,sha256,noop:false,originals,values,summary:{updates:updates.length,additions:additions.length,people:records.length}};
}
export function commitPlan(root,plan,{failAfter=Infinity}={}){
  if(plan.noop)return plan;
  const lock=path.join(root,'.batch-import.lock');let fd;
  try{fd=fs.openSync(lock,'wx');}catch{throw new Error('Another batch import is active (lock exists)');}
  const dir=path.join(root,'.batch-transaction-'+plan.sha256.slice(0,12));
  let touched=0;
  try{
    for(const [file,original]of Object.entries(plan.originals)){const current=fs.existsSync(path.join(root,file))?fs.readFileSync(path.join(root,file),'utf8'):null;if(current!==original)throw new Error('Concurrent file modification: '+file);}
    fs.mkdirSync(dir,{recursive:false});
    for(const [file,value]of Object.entries(plan.values)){const destination=path.join(dir,file);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,JSON.stringify(value,null,2)+'\n');if(plan.originals[file]!==null)fs.writeFileSync(destination+'.before',plan.originals[file]);}
    for(const file of Object.keys(plan.values)){if(touched===failAfter)throw new Error('Injected transaction failure');fs.renameSync(path.join(dir,file),path.join(root,file));touched++;}
    return plan;
  }catch(e){
    if(touched)for(const [file,original]of Object.entries(plan.originals)){const destination=path.join(root,file);if(original===null){if(fs.existsSync(destination))fs.unlinkSync(destination);}else fs.writeFileSync(destination,original);}
    throw e;
  }finally{
    if(fs.existsSync(dir))fs.rmSync(dir,{recursive:true,force:true});
    if(fd!==undefined)fs.closeSync(fd);if(fs.existsSync(lock))fs.unlinkSync(lock);
  }
}
export function applyBatch(root,batch,options){return commitPlan(root,planBatch(root,batch),options);}
