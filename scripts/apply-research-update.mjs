import fs from 'node:fs';
const path=process.argv[2];
if(!path)throw new Error('Pass a reviewed data/research-updates/*.json file');
const batch=JSON.parse(fs.readFileSync(path,'utf8'));
const records=JSON.parse(fs.readFileSync('data/records.json','utf8'));
const coverage=JSON.parse(fs.readFileSync('data/coverage.json','utf8'));
const programs=JSON.parse(fs.readFileSync('data/programs.json','utf8'));
const touched=[];
for(const item of [...batch.updates,...batch.additions]){
 let r=records.find(r=>r.id===item.id);
 if(!r){
  if(!batch.additions.includes(item))throw new Error('Unknown update ID '+item.id);
  r={id:item.id,name:'',school:'',program:'博士项目 · Marketing',program_id:'',origin:'US',fields:['Marketing'],tracks:['marketing'],methods:[],topics:[],market_cycle:null,placement_year:null,source_cohort_year:null,graduation_year:null,status:'outcome_unknown',destination:null,destination_region:'UNKNOWN',role:null,job_kind:'unknown',jmp:null,field_evidence:'',undergraduate:null,identity:{chinese_national:{value:'unknown',source:null},chinese_heritage:{value:'unknown',source:null}},sources:[],subsequent:[],notes:''};records.push(r);
 }
 Object.assign(r,item.set);
 for(const s of item.sources)if(!r.sources.some(x=>x.url===s.url))r.sources.push(s);
 if(item.note&&!r.notes.includes(item.note))r.notes+=(r.notes?' ':'')+batch.checked_at+'：'+item.note;
 r.checked_at=batch.checked_at;
 r.research_review={checked_at:batch.checked_at,status:'reviewed',evidence_urls:item.sources.map(s=>s.url)};
 if(item.set.final_placement)for(const u of item.set.final_placement.sources)if(!r.sources.some(s=>s.url===u))throw new Error('Final placement source missing '+r.id);
 touched.push(r);
}
for(const r of touched){
 if(!programs.some(p=>p.id===r.program_id))throw new Error('Unknown program '+r.id+' '+r.program_id);
 const periods=[r.source_cohort_year&&String(r.source_cohort_year),r.market_cycle].filter(Boolean);
 for(const period of periods){
  let cell=coverage.find(c=>c.program_id===r.program_id&&c.period===period);
  if(!cell){cell={program_id:r.program_id,period,status:'partial',listed_count:null,record_ids:[],year_basis:period.includes('-')?'explicit_market_cycle':'source_table_year',cohort_complete:false,checked_at:null,sources:[],notes:'逐人证据补充，尚未确认整届分母。'};coverage.push(cell)}
  const isNew=!cell.record_ids.includes(r.id);
  if(isNew){cell.record_ids.push(r.id);cell.status='partial';cell.listed_count=null;}
  if(isNew||batch.additions.some(x=>x.id===r.id)){cell.checked_at=batch.checked_at;for(const s of r.research_review.evidence_urls.map(url=>({label:'本轮逐人核验来源',url})))if(!cell.sources.some(x=>x.url===s.url))cell.sources.push(s);}
 }
}
for(const p of programs){p.record_count=records.filter(r=>r.program_id===p.id).length;}
fs.writeFileSync('data/records.json',JSON.stringify(records,null,2)+'\n');
fs.writeFileSync('data/coverage.json',JSON.stringify(coverage,null,2)+'\n');
fs.writeFileSync('data/programs.json',JSON.stringify(programs,null,2)+'\n');
console.log(`Applied ${batch.updates.length} updates and ${batch.additions.length} additions (${records.length} records).`);
