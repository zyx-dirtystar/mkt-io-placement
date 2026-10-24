import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
const read=(root,name,fallback)=>fs.existsSync(path.join(root,name))?JSON.parse(fs.readFileSync(path.join(root,name),'utf8')):fallback;
const write=(name,value)=>{fs.mkdirSync(path.dirname(name),{recursive:true});const temp=name+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2)+'\n');fs.renameSync(temp,name);};
export function discoverSources(root){
  const found=new Map();
  function walk(x,context){
    if(typeof x==='string'&&/^https?:\/\//.test(x)){try{const u=new URL(x);u.hash='';const url=u.href;if(!found.has(url))found.set(url,{url,contexts:[]});if(!found.get(url).contexts.includes(context))found.get(url).contexts.push(context);}catch{}}
    else if(Array.isArray(x))x.forEach(v=>walk(v,context));
    else if(x&&typeof x==='object')for(const [k,v] of Object.entries(x))if(k!=='notes'&&k!=='evidence'&&k!=='quote')walk(v,x.id||context);
  }
  for(const name of ['data/records.json','data/programs.json','data/faculty.json','data/jobs.json','data/io-scope.json','data/coverage.json'])walk(read(root,name,[]),name);
  const jobs=read(root,'data/jobs.json',[]);const jobUrls=new Set();function collect(x){if(typeof x==='string'&&/^https?:/.test(x))jobUrls.add(x);else if(Array.isArray(x))x.forEach(collect);else if(x&&typeof x==='object')Object.values(x).forEach(collect)}collect(jobs);return [...found.values()].map(s=>({...s,tier:jobUrls.has(s.url)?'hiring':/job.market|candidates|placement|faculty|people|directory/i.test(s.url)?'directory':'historical'}));
}
export function selectDueSources(discovered,previous,now,limit){
 const prior=new Map(previous.map(s=>[s.url,s]));const days={hiring:2,directory:14,historical:45};
 return discovered.map(s=>{const p=prior.get(s.url),interval=days[s.tier]||45,age=p?.fetched_at?(Date.parse(now)-Date.parse(p.fetched_at))/86400000:Infinity;return {...s,due_score:age/interval,review_interval_days:interval}}).filter(s=>s.due_score>=1).sort((a,b)=>b.due_score-a.due_score||({hiring:0,directory:1,historical:2}[a.tier]??2)-({hiring:0,directory:1,historical:2}[b.tier]??2)||a.url.localeCompare(b.url)).slice(0,limit);
}
function textOf(bytes,type,snapshotPath){
  if(type.includes('pdf')||bytes.subarray(0,4).toString()==='%PDF'){
    try{const result=execFileSync('pdftotext',['-layout',snapshotPath,'-'],{encoding:'utf8',timeout:15000,maxBuffer:8*1024*1024,windowsHide:true});return {text:result.replace(/\s+/g,' ').trim(),extraction:'pdftotext'};}catch{return {text:null,extraction:'pdf_hash_only_parser_unavailable'};}
  }
  if(!type.includes('text')&&!type.includes('json')&&!type.includes('xml'))return {text:null,extraction:'binary_hash_only'};
  return {text:bytes.toString('utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim(),extraction:'html_text'};
}
export async function checkSources({root=process.cwd(),limit=40,concurrency=3,timeout=15000,maxBytes=8*1024*1024,interval=250,fetcher=fetch,now=new Date().toISOString(),onlyUrls=null}={}){
  if(!Number.isInteger(limit)||limit<0||limit>500)throw new Error('Source limit must be an integer between 0 and 500');
  if(!Number.isInteger(concurrency)||concurrency<1||concurrency>4)throw new Error('Concurrency must be an integer between 1 and 4');
  const statePath=path.join(root,'data/maintenance-sources.json');
  const previous=read(root,'data/maintenance-sources.json',{sources:[]});
  const old=new Map((previous.sources||[]).map(s=>[s.url,s]));
  const discovered=onlyUrls?onlyUrls.map(url=>({url,contexts:['manual']})):discoverSources(root);
  const selected=onlyUrls?discovered.slice(0,limit):selectDueSources(discovered,previous.sources||[],now,limit);
  let cursor=0;const outcomes=[];
  async function worker(){
    while(cursor<selected.length){
      const source=selected[cursor++],prior=old.get(source.url),headers={'User-Agent':'MarketObservatorySourceCheck/1.0 (public evidence audit)','Accept':'text/html,application/pdf,application/json;q=0.9,*/*;q=0.5'};
      const cachedSnapshot=prior?.snapshot_path&&fs.existsSync(path.join(root,prior.snapshot_path));
      if(cachedSnapshot&&prior?.etag)headers['If-None-Match']=prior.etag;
      if(cachedSnapshot&&prior?.last_modified)headers['If-Modified-Since']=prior.last_modified;
      let result;
      try{
        const response=await fetcher(source.url,{headers,redirect:'follow',signal:AbortSignal.timeout(timeout)});
        if(response.status===304&&prior&&cachedSnapshot){result={...prior,...source,fetched_at:now,http_status:304,error:null,changed:false};}
        else{
          if(!response.ok)throw new Error('HTTP '+response.status);
          const declared=Number(response.headers.get('content-length')||0);if(declared>maxBytes)throw new Error('Content exceeds '+maxBytes+' bytes');
          const reader=response.body.getReader(),chunks=[];let size=0;
          while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.length;if(size>maxBytes){await reader.cancel();throw new Error('Content exceeds '+maxBytes+' bytes');}chunks.push(Buffer.from(chunk.value));}
          const bytes=Buffer.concat(chunks),sha256=hash(bytes),type=response.headers.get('content-type')||'application/octet-stream';
          const rel='data/source-snapshots/'+hash(source.url).slice(0,16)+'/'+sha256+(type.includes('pdf')?'.pdf':'.txt');
          const target=path.join(root,rel);fs.mkdirSync(path.dirname(target),{recursive:true});if(!fs.existsSync(target))fs.writeFileSync(target,bytes);
          const extracted=textOf(bytes,type,target);
          const normalized_hash=extracted.text?hash(extracted.text):sha256;
          const changed=!!prior?.sha256&&(prior.normalized_hash||prior.sha256)!==normalized_hash;
          const history=[...(prior?.history||[])];
          if(!history.some(h=>h.sha256===sha256))history.push({fetched_at:now,sha256,normalized_hash,snapshot_path:rel,content_type:type,bytes:size});
          result={...source,fetched_at:now,last_success_at:now,http_status:response.status,final_url:response.url||source.url,content_type:type,bytes:size,etag:response.headers.get('etag'),last_modified:response.headers.get('last-modified'),sha256,normalized_hash,snapshot_path:rel,text_excerpt:extracted.text?.slice(0,2400)||null,extraction:extracted.extraction,changed,error:null,history,change:changed?{before:prior.sha256,after:sha256,previous_snapshot:prior.snapshot_path}:null};
        }
      }catch(e){result={...prior,...source,fetched_at:now,http_status:null,error:String(e.message||e),changed:false,history:prior?.history||[]};}
      outcomes.push(result);old.set(source.url,result);
      await sleep(interval);
    }
  }
  await Promise.all(Array.from({length:Math.min(concurrency,selected.length)},worker));
  const state={schema_version:'1.0',last_run:now,discovered:discovered.length,selected:selected.length,policy:'变化与不可用仅进入待核验；不修改人员、岗位或覆盖事实。新来源首次成功抓取建立基线，不算已发现变化。',sources:[...old.values()].sort((a,b)=>a.url.localeCompare(b.url))};
  write(statePath,state);
  const queuePath='data/maintenance-queue.json';
  const queue=read(root,queuePath,[]);const byId=new Map((Array.isArray(queue)?queue:queue.items||[]).map(x=>[x.id,x]));
  for(const s of outcomes.filter(s=>s.error||s.changed)){const id='source-'+hash(s.url).slice(0,12);byId.set(id,{...byId.get(id),id,kind:s.error?'source_unavailable':'source_changed',status:'pending',source_url:s.url,checked_at:s.fetched_at,reason:s.error||'来源文本或二进制内容变化，需核对字段。',change:s.change||null});}
  write(path.join(root,queuePath),[...byId.values()]);
  const report={checked:outcomes.length,changed:outcomes.filter(s=>s.changed).length,unavailable:outcomes.filter(s=>s.error).length,success:outcomes.filter(s=>!s.error).length,state_path:'data/maintenance-sources.json',snapshot_directory:'data/source-snapshots',pending_review:[...byId.values()].filter(q=>q.status==='pending').length};
  write(path.join(root,'data/maintenance-source-report.json'),{as_of:now,...report});
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const option=(name,value)=>Number(process.argv.find(x=>x.startsWith('--'+name+'='))?.split('=')[1]||value);
  const report=await checkSources({limit:option('limit',40),concurrency:Math.max(1,Math.min(4,option('concurrency',3))),timeout:option('timeout',15000)});
  console.log(JSON.stringify(report));
  if(report.checked&&report.success===0)process.exitCode=2;
}
