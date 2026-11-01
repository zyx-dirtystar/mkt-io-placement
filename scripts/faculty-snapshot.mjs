import fs from 'node:fs';
// Roll later reviewed batches back in reverse receipt order; never rewrite a dated release assertion.
export function facultySnapshot(archive,asOf){
 const result=structuredClone(archive);
 const rank=f=>f.includes('-depth-')?0:f.includes('-affiliation-')?1:2;
 const paths=fs.readdirSync('data').filter(f=>/^faculty-(depth|affiliation|basics)-receipt-\d{4}-\d{2}-\d{2}\.json$/.test(f)&&f.slice(-15,-5)>asOf).sort((a,b)=>a.slice(-15,-5).localeCompare(b.slice(-15,-5))||rank(a)-rank(b)).reverse();
 for(const path of paths){const receipt=JSON.parse(fs.readFileSync('data/'+path,'utf8'));for(const {before} of receipt.profiles){const i=result.people.findIndex(p=>p.id===before.id);if(i<0)throw Error('Missing historical faculty '+before.id);result.people[i]=structuredClone(before)}}
 result.updated_at=asOf;return result;
}
