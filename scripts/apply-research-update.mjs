import fs from 'node:fs';
import {applyBatch} from './batch-import.mjs';
const path=process.argv[2];
if(!path)throw new Error('Pass a reviewed data/research-updates/*.json file');
const batch=JSON.parse(fs.readFileSync(path,'utf8'));
const result=applyBatch(process.cwd(),batch);
console.log(JSON.stringify({batch_id:result.id,sha256:result.sha256,noop:result.noop,...result.summary,reason:result.reason}));
/* The former in-place importer is intentionally removed: validation, idempotency,
   optimistic preconditions and rollback now live in batch-import.mjs. */
