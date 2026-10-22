import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {homeMarkup} from '../dist/home-view.js';
import {receivingProgress} from '../dist/faculty.js';
import {canonicalLabel} from '../dist/observatory-logic.js';

test('home reports separate observed populations and actual complete cohorts',()=>{
 const records=JSON.parse(fs.readFileSync('dist/data/records.json','utf8'));
 const catalog=JSON.parse(fs.readFileSync('dist/data/catalog.json','utf8'));
 const observatory=JSON.parse(fs.readFileSync('dist/data/observatory.json','utf8'));
 const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;');
 const html=homeMarkup({records,catalog,observatory,esc,region:r=>r});
 const count=n=>n.toLocaleString('en-US');
 assert.ok(html.includes(`<strong>${count(records.length)}</strong><span>placement records</span>`));
 assert.ok(html.includes(`<strong>${count(catalog.faculty.people.length)}</strong><span>faculty profiles</span>`));
 assert.ok(html.includes(`${count(receivingProgress(catalog).length)} receiving institutions in scope`));
 assert.ok(html.includes(`<strong>${count(observatory.audit.filter(c=>c.cohort_complete).length)}</strong><span>confirmed complete cohorts</span>`));
 assert.match(html,/Current and historical advertisements/);
 assert.match(html,/different populations/);
 for(const dimension of ['topics','methods'])for(const term of observatory.taxonomy[dimension]){
  assert.ok(!/\p{Script=Han}/u.test(canonicalLabel(observatory,dimension,term.id)),`English display label missing: ${term.id}`);
  assert.equal(canonicalLabel(observatory,dimension,term.id),canonicalLabel(observatory,dimension,term.label),'Old label URLs resolve to the same display label');
 }
 for(const route of ['directory','faculty','jobs','compare','flows','current','coverage','quality','method'])assert.ok(html.includes('#'+route));
 const injected=homeMarkup({records,catalog:{...catalog,updated_at:'<untrusted>'},observatory,esc,region:r=>r});
 assert.ok(!injected.includes('<untrusted>'));
});
