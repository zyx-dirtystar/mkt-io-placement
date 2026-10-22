// Reviewed cross-source identities. Matching is never inferred from names alone.
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const pairs=[
 ['singapore','Varad Vivek Deolankar','university-of-michigan-varad-vivek-deolankar'],
 ['singapore','Ta-Wei (David) Huang','ta-wei-huang-2025'],
 ['singapore','Jane Jiaqian Wang','northwestern-jane-jiaqian-wang'],
 ['singapore','Ian Nicholas Weaver','yale-university-ian-weaver'],
 ['singapore','Jong Yeob Kim','new-york-university-jong-yeob-kim'],
 ['singapore','Kyu Ree Kim','indiana-university-kyu-ree-kim'],
 ['singapore','Verina F. Que','toronto-verina-que'],
 ['singapore','Sai Chand Chintala','cornell-university-sai-chand-chintala'],
 ['singapore','Minkwang Jang','chicago-minkwang-jang'],
 ['mainland','Pu Zhao','boston-university-pu-zhao'],
 ['mainland','史正煜','hku-zhengyu-shi'],
 ['mainland','贺达','hkust-da-he'],
 ['hongkong','Zi Wei Wei','arizona-state-university-ziwei-wei'],
 ['hongkong','Xiaohang (Flora) Feng','carnegie-mellon-xiaohang-flora-feng'],
 ['hongkong','Chong Bo Zack Wang','washington-university-in-st-louis-chong-bo-zack-wang'],
 ['hongkong','Theresa Anna Kwon','university-of-pittsburgh-theresa-tess-kwon']
];
const records=read('data/records.json'),out=[];
for(const [batch,name,id]of pairs){
 const b=read('data/research-updates/2026-10-22-faculty-'+batch+'.json');
 const p=b.people.find(p=>p.name===name||p.aliases?.includes(name)),r=records.find(r=>r.id===id);
 if(!p||!r)throw Error('Reviewed identity entry no longer matches batch: '+name);
 out.push({name:p.name,host_id:p.host_id,placement_id:id,identity_evidence:{basis:'manual_cross_source_reconciliation',reason:'正向培养项目名册的培养院校、姓名/公开别名与接收院校吻合；接收端个人教育资料或同一官方名册交叉核对。不是仅凭姓名相似合并。',source_urls:[...new Set([...r.sources.map(s=>s.url),...p.sources.filter(s=>s.supports?.some(k=>k==='phd'||k.startsWith('phd.'))||s.url===p.homepage).map(s=>s.url)])],checked_at:b.checked_at}});
}
fs.writeFileSync('data/faculty-identities.json',JSON.stringify(out,null,2)+'\n');

