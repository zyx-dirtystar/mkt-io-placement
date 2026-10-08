import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync('config.json','utf8'));
const read=name=>JSON.parse(fs.readFileSync('data/'+name+'.json','utf8'));
const records=read('records'),schools=read('schools'),release_notes=read('release-notes');
const catalog={...config,exhaustive:false,archive_years:[...new Set(records.map(r=>r.placement_year).filter(Boolean))].sort(),schools,release_notes};
fs.mkdirSync('dist/data',{recursive:true});
fs.writeFileSync('dist/data/records.json',JSON.stringify(records,null,2)+'\n');
fs.writeFileSync('dist/data/catalog.json',JSON.stringify(catalog,null,2)+'\n');
console.log(`Synchronized ${records.length} people; current cycle ${catalog.current_cycle}; ${catalog.history_years.length} historical years.`);
