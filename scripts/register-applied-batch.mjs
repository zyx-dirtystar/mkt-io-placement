import fs from 'node:fs';
import {digest} from './observatory-model.mjs';
import {commitPlan} from './batch-import.mjs';
const file=process.argv[2];
if(!file)throw new Error('Pass a batch that was already merged manually; every set value will be verified');
const batch=JSON.parse(fs.readFileSync(file,'utf8'));
const records=JSON.parse(fs.readFileSync('data/records.json','utf8'));
for(const item of [...(batch.updates||[]),...(batch.additions||[])]){
  const r=records.find(r=>r.id===item.id);if(!r)throw new Error('Missing person '+item.id);
  for(const [field,value]of Object.entries(item.set||{}))if(JSON.stringify(r[field])!==JSON.stringify(value))throw new Error('Batch is not fully merged: '+item.id+' '+field);
  for(const source of item.sources||[])if(!r.sources.some(s=>s.url===source.url))throw new Error('Missing batch source '+item.id+' '+source.url);
}
const fileName='data/maintenance-batches.json';
const original=fs.existsSync(fileName)?fs.readFileSync(fileName,'utf8'):null;
const ledger=original?JSON.parse(original):[];
const sha256=digest(batch),id=batch.id||batch.batch_id||'legacy-'+sha256.slice(0,20);
const old=ledger.find(x=>x.id===id);
if(old&&old.sha256!==sha256)throw new Error('Batch ID already exists with different contents');
if(!old&&!process.argv.includes('--verify-only')){
  ledger.push({id,sha256,checked_at:batch.checked_at,applied_at:new Date().toISOString(),status:'verified_existing_manual_merge',updates:(batch.updates||[]).map(x=>x.id),additions:(batch.additions||[]).map(x=>x.id)});
  commitPlan(process.cwd(),{id,sha256,noop:false,originals:{[fileName]:original},values:{[fileName]:ledger}});
}
console.log(JSON.stringify({id,sha256,verified:true,registered:!process.argv.includes('--verify-only'),already_registered:!!old}));
