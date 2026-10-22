import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkSources} from '../check-sources.mjs';
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'observatory-sources-'));fs.mkdirSync(path.join(root,'data'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;}
const read=(root,name)=>JSON.parse(fs.readFileSync(path.join(root,'data/'+name+'.json'),'utf8'));
test('first fetch establishes baseline, changed HTML queues review, and unavailable sources retain successful evidence',async t=>{
  const root=fixture(t),url='https://official.example/placements',options={root,limit:1,interval:0,onlyUrls:[url]};
  const first=await checkSources({...options,now:'2026-10-20T00:00:00Z',fetcher:async()=>new Response('<html>All graduates: A and B</html>',{headers:{'Content-Type':'text/html',ETag:'"v1"'}})});
  assert.equal(first.changed,0);const original=read(root,'maintenance-sources').sources[0];assert.equal(original.text_excerpt,'All graduates: A and B');assert.ok(fs.existsSync(path.join(root,original.snapshot_path)));
  await checkSources({...options,now:'2026-10-21T00:00:00Z',fetcher:async(_url,request)=>{assert.equal(request.headers['If-None-Match'],'"v1"');return new Response('<html>All graduates: A, B and C</html>',{headers:{'Content-Type':'text/html',ETag:'"v2"'}});}});
  const changed=read(root,'maintenance-sources').sources[0];assert.equal(changed.changed,true);assert.equal(changed.history.length,2);assert.equal(read(root,'maintenance-queue')[0].kind,'source_changed');
  await checkSources({...options,now:'2026-10-22T00:00:00Z',fetcher:async()=>new Response('temporarily unavailable',{status:503})});
  const failed=read(root,'maintenance-sources').sources[0];assert.equal(failed.sha256,changed.sha256);assert.equal(failed.snapshot_path,changed.snapshot_path);assert.equal(failed.history.length,2);assert.match(failed.error,/503/);assert.equal(read(root,'maintenance-queue').length,1);
});
test('304 and non-semantic markup changes do not create a false content-change alert',async t=>{
  const root=fixture(t),options={root,limit:1,interval:0,onlyUrls:['https://official.example/roster']};
  await checkSources({...options,fetcher:async()=>new Response('<p>A</p>',{headers:{'Content-Type':'text/html',ETag:'"same"'}})});
  await checkSources({...options,fetcher:async()=>new Response(null,{status:304})});assert.equal(read(root,'maintenance-sources').sources[0].changed,false);
  await checkSources({...options,fetcher:async()=>new Response('<div class="new">A</div>',{headers:{'Content-Type':'text/html'}})});assert.equal(read(root,'maintenance-sources').sources[0].changed,false);assert.equal(read(root,'maintenance-queue').length,0);
});
test('source requests obey configured concurrency and maximum response size',async t=>{
  const root=fixture(t);let active=0,peak=0;
  await checkSources({root,limit:4,concurrency:2,interval:0,onlyUrls:['a','b','c','d'].map(x=>'https://official.example/'+x),fetcher:async()=>{active++;peak=Math.max(peak,active);await new Promise(resolve=>setTimeout(resolve,10));active--;return new Response('hello',{headers:{'Content-Type':'text/plain'}});}});assert.equal(peak,2);
  const report=await checkSources({root,limit:1,interval:0,maxBytes:2,onlyUrls:['https://official.example/oversized'],fetcher:async()=>new Response('too large',{headers:{'Content-Length':'9'}})});assert.equal(report.unavailable,1);
});
test('conditional requests are disabled when metadata survives but its raw snapshot is absent',async t=>{
  const root=fixture(t),options={root,limit:1,interval:0,onlyUrls:['https://official.example/pdf']};
  await checkSources({...options,fetcher:async()=>new Response('A',{headers:{'Content-Type':'text/plain',ETag:'"etag"','Last-Modified':'Mon, 19 Oct 2026 00:00:00 GMT'}})});
  const prior=read(root,'maintenance-sources').sources[0];fs.unlinkSync(path.join(root,prior.snapshot_path));
  await checkSources({...options,fetcher:async(_url,request)=>{assert.equal(request.headers['If-None-Match'],undefined);assert.equal(request.headers['If-Modified-Since'],undefined);return new Response('A',{headers:{'Content-Type':'text/plain',ETag:'"etag"'}});}});
  assert.equal(fs.existsSync(path.join(root,read(root,'maintenance-sources').sources[0].snapshot_path)),true);
});
