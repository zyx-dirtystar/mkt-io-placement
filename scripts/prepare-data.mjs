import fs from 'node:fs';
import path from 'node:path';
const config=JSON.parse(fs.readFileSync('config.json','utf8'));
const research=path.resolve(process.argv[2]||'source-data');
const out=path.resolve('dist/data');fs.mkdirSync(out,{recursive:true});
const names=['us-marketing.json','us-marketing-extra.json','us-io.json','us-io-extra.json','ca-hk-sg.json'];
const regionMap={'United States':'US','USA':'US','Canada':'CA','Hong Kong':'HK','Singapore':'SG','China':'CN','Mainland China':'CN','Taiwan':'TW','Macau':'MO','United Kingdom':'UK','UK':'UK','Australia':'AU','South Korea':'KR','Japan':'JP','France':'FR','Germany':'DE','Spain':'ES','Vietnam':'VN','Uruguay':'UY','Iran':'IR'};
const reg=x=>x?regionMap[x]||x:'UNKNOWN';
const aliases={'MIT':'Massachusetts Institute of Technology','UC Berkeley':'University of California, Berkeley','Harvard Business School':'Harvard University','Chicago Booth':'University of Chicago','UChicago':'University of Chicago'};
const school=x=>aliases[x]||x;
const sourcesLabel=k=>({doctoral_program:'博士项目',field:'研究领域',initial_placement:'初始去向',placement_year_and_role:'岗位与入职年份',jmp:'Job Market Paper',education:'教育经历',doctoral_program_and_field:'博士项目与研究领域',initial_placement_and_year:'初始去向与年份',field_and_methods:'领域与方法',placement_year:'placement 年份',field_and_jmp:'领域与论文',employment_and_education:'任职与教育经历',employment:'任职记录',market_cycle:'求职季声明'}[k]||k.replaceAll('_',' '));
const topics=[['平台与数字市场',/platform|digital market|online market|e-commerce|two-sided|matching/i],['定价与需求',/pricing|price|demand|consumer choice|shrinkflation|choice model|discrete choice/i],['竞争与市场势力',/competition|market power|antitrust|monopoly|monopsony|merger|procurement/i],['广告与品牌',/advertis|brand|product placement|promotion|package design/i],['AI 与算法',/artificial intelligence|\bAI\b|algorithm|deep learning|machine learning/i],['隐私与信息',/privacy|information|data regulation|disclosure/i],['医疗与健康',/health|physician|drug|medical|hospital/i],['创新与创业',/innovation|entrepreneur|patent|startup/i],['拍卖与市场设计',/auction|market design|procurement|mechanism/i],['环境与能源',/environment|energy|electricity|renewable|climate/i],['消费者行为',/consumer behavior|consumer response|attention|learning|consumer information/i],['公共政策',/public economics|regulation|policy|taxation|public finance/i]];
const methodTags=[['结构估计',/structural model|structural estimation/i],['因果推断',/causal inference|causal methods/i],['机器学习',/machine learning|deep learning/i],['实验方法',/field experiment|randomized experiment|experimental design/i],['理论建模',/theoretical modeling|theoretical industrial|economic theory/i]];
const reviewed=[],excluded=[];
for(const filename of names){if(!fs.existsSync(path.join(research,filename)))continue;const data=JSON.parse(fs.readFileSync(path.join(research,filename),'utf8').replace(/^\uFEFF/,''));for(const raw of data.records){
 if(raw.id==='toronto-maximiliano-machado'||raw.id==='qifan-han-2026'){excluded.push({id:raw.id,name:raw.name,reason:'首职时间或当季声明尚需进一步原始来源核验',research_file:filename});continue;}
 const isM=!!raw.doctoral_institution,isC=!!raw.phd;
 let r={id:raw.id,name:raw.name,school:school(raw.doctoral_institution||raw.phd_institution||raw.phd?.institution),program:raw.doctoral_program||raw.phd_program||raw.phd?.program,origin:reg(raw.doctoral_region||raw.phd_region||raw.phd?.region),fields:isM?[raw.field,...raw.research_fields]:raw.fields||[],tracks:[],methods:raw.methods||[],topics:[],market_cycle:(raw.market_cycle||raw.job_market_cycle||'').replace(/[–/]/g,'-')||null,placement_year:raw.placement_year??null,status:raw.status||(/current_market_cycle_verified/.test(raw.record_status)?'on_market':'placed'),destination:isM?raw.initial_employer:raw.initial_placement?.institution||raw.initial_placement?.employer||null,destination_region:reg(isM?raw.destination_region:raw.initial_placement?.region),role:isM?raw.initial_role:raw.initial_placement?.title||null,job_kind:isM?raw.role_category:raw.initial_placement?.category,jmp:isM?raw.jmp:isC?raw.jmp?.title:raw.job_market_paper,field_evidence:raw.quant_evidence||raw.field_evidence?.text||raw.field_status||'',undergraduate:isM?{institution:raw.undergraduate_institution,region:reg(raw.undergraduate_region)}:Array.isArray(raw.undergraduate)?{institution:raw.undergraduate.map(u=>u.institution).join(' / '),region:reg(raw.undergraduate[0]?.region)}:raw.undergraduate?{...raw.undergraduate,region:reg(raw.undergraduate.region)}:null,identity:{chinese_national:{value:'unknown',source:null},chinese_heritage:{value:'unknown',source:null}},sources:[],subsequent:raw.subsequent_positions||[],checked_at:raw.checked_at||data.verified_at||data.compiled_on||data.collected_at?.slice(0,10)||'2026-10-08',notes:Array.isArray(raw.notes)?raw.notes.join(' '):raw.notes||'',source_file:filename};
 if(/^20\d{2}-\d{2}$/.test(r.market_cycle||''))r.market_cycle=r.market_cycle.slice(0,5)+'20'+r.market_cycle.slice(-2);
 if(isM){r.sources=Object.entries(raw.sources).filter(([,u])=>typeof u==='string').map(([k,u])=>({label:sourcesLabel(k),url:u}))}
 else if(isC){const ids=[...new Set(Object.values(raw.field_sources||{}).flat())];r.sources=ids.filter(id=>data.sources[id]).map(id=>({label:sourcesLabel(data.sources[id].type),url:data.sources[id].url}));if(raw.market_cycle_status?.includes('curated')){r.notes+=' 求职季尚仅由领域汇总名单提供，未作为明确市场周期存储。';r.market_cycle=null}}
 else r.sources=raw.sources.map(s=>({label:sourcesLabel(s.role||s.label||'公开资料'),url:s.url}));
 r.sources=[...new Map(r.sources.map(s=>[s.url,s])).values()];
 if(r.fields.some(f=>/quantitative marketing|marketing \(quant\)/i.test(f))||/Quantitative Marketing|Marketing \(Quant\)/i.test(r.program))r.tracks.push('qm');
 if(r.fields.some(f=>/industrial organization|\bIO\b/i.test(f)))r.tracks.push('io');
 const topicEvidence=[...r.fields,r.jmp||''].join(' ');r.topics=topics.filter(([,test])=>test.test(topicEvidence)).map(([t])=>t);
 const methodEvidence=[...r.fields,...r.methods,r.field_evidence].join(' ');r.methods_original=[...r.methods];r.methods=[...new Set([...r.methods,...methodTags.filter(([,test])=>test.test(methodEvidence)).map(([t])=>t)].map(m=>/machine|deep learning|artificial intelligence|language models|representation learning|机器学习/i.test(m)?'机器学习 / AI':/structural|demand estimation|dynamic discrete choice|结构估计/i.test(m)?'结构建模 / 估计':/causal|quasi-experiment|因果/i.test(m)?'因果推断':/field experiment|experimental design|实验/i.test(m)?'实验方法':/game theory|economic theory|analytical model|bargaining model|理论/i.test(m)?'理论建模':/optimization|optimal transport|reinforcement learning/i.test(m)?'优化与算法':/econometrics|nonparametric/i.test(m)?'计量方法':null).filter(Boolean))];
 if(r.status==='on_market'){r.job_kind='on_market';r.destination=null;r.destination_region='UNKNOWN';r.role=null}
 else if(!r.job_kind){if(/postdoc|post-doc|postdoctoral/i.test(r.role||''))r.job_kind='postdoc';else if(/professor|lecturer/i.test(r.role||''))r.job_kind='faculty';else if(/Analysis Group/.test(r.destination||''))r.job_kind='industry';else r.job_kind='unknown'}
 if(r.job_kind==='consulting')r.job_kind='industry';
 if(r.id==='us-io-nathaniel-hickok'){r.job_kind='industry';r.notes+=' 岗位类型按本人所列 Microsoft Senior Researcher 计为企业；导师所用 postdoc 称谓另保留在原始来源备注。'}
 if(r.id==='malika-korganbekova-2024')r.subsequent=[{institution:'Stanford University',title:'Assistant Professor of Marketing',start_year:2026}];
 if(r.id==='xinyao-kong-2023')r.subsequent=[{institution:'Indiana University',title:'Assistant Professor of Marketing',start_year:2025}];
 if(!r.tracks.length)throw new Error('No verified field '+r.name);
 reviewed.push(r);
 }for(const q of data.review_queue||[])excluded.push({name:q.name||q.id,reason:q.reason||q.review_reason||q.notes||'待补证',research_file:filename})}
const unique=new Map();for(const r of reviewed){const name=r.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const key=name+'|'+r.school;if(unique.has(key))throw new Error('Duplicate person '+r.name);unique.set(key,r)}
const records=[...unique.values()].sort((a,b)=>a.name.localeCompare(b.name));
const official={
 'Northwestern University':'https://www.kellogg.northwestern.edu/doctoral/placement/jobplacement/',
 'University of Chicago':'https://www.chicagobooth.edu/phd/career-outcomes',
 'University of Pennsylvania':'https://doctoral.wharton.upenn.edu/placement/',
 'Stanford University':'https://economics.stanford.edu/graduate/student-placement',
 'Yale University':'https://economics.yale.edu/phd-program/placement',
 'Massachusetts Institute of Technology':'https://economics.mit.edu/academic-programs/phd-program/job-market',
 'Georgetown University':'https://econ.georgetown.edu/academics/phd/phd-students/current-job-market-candidates/',
 'University of British Columbia':'https://economics.ubc.ca/graduate/phd-program/phd-job-market-placement/',
 'Hong Kong University of Science and Technology':'https://econ.hkust.edu.hk/programs-n-courses/mphd/placement-record',
 'National University of Singapore':'https://fass.nus.edu.sg/ecs/phd-placements/',
 'Nanyang Technological University':'https://www.ntu.edu.sg/business/admissions/phd-programme/on-the-job-market-candidates',
 'Singapore Management University':'https://economics.smu.edu.sg/phd-economics/students/student-placements',
 'Chinese University of Hong Kong':'https://admission.econ.cuhk.edu.hk/pg/phd-economics/',
 'University of Hong Kong':'https://phd.hkubs.hku.hk/People/graduate-placement'};
const schools=[...new Set(records.map(r=>r.school))].map(name=>({name,region:records.find(r=>r.school===name).origin,url:official[name]||null}));
for(const [name,region] of [['National University of Singapore','SG'],['Singapore Management University','SG'],['Chinese University of Hong Kong','HK'],['University of Hong Kong','HK']])if(!schools.some(s=>s.name===name))schools.push({name,region,url:official[name]});
schools.sort((a,b)=>a.region.localeCompare(b.region)||a.name.localeCompare(b.name));
const catalog={...config,archive_years:[...new Set(records.map(r=>r.placement_year).filter(Boolean))].sort(),exhaustive:false,schools,review_queue_count:excluded.length,release_notes:[{school:'Chicago Booth',note:'官方说明 2026–27 候选人将陆续加入；Marketing 名单仍待更新。',url:'https://www.chicagobooth.edu/phd/job-market-candidates'},{school:'Yale Economics',note:'院系列表预告 11 月 4 日发布；部分个人主页已明确参加本季。',url:'https://economics.yale.edu/phd-program/placement'},{school:'Georgetown Economics',note:'2026–27 名单已发布；本版已核验其中两位 IO 候选人。',url:official['Georgetown University']},{school:'NUS Economics',note:'2026–27 名单待发布；未把毕业年份当作 placement 年。',url:'https://fass.nus.edu.sg/ecs/phd-job-market-candidates/'}]};
fs.writeFileSync(path.join(out,'records.json'),JSON.stringify(records,null,2)+'\n');fs.writeFileSync(path.join(out,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
fs.writeFileSync(path.join(out,'record-template.json'),JSON.stringify({id:'stable-person-id',name:'',school:'',program:'',origin:'US',fields:[],tracks:[],methods:[],topics:[],market_cycle:null,placement_year:null,status:'on_market',destination:null,destination_region:'UNKNOWN',role:null,job_kind:'on_market',jmp:null,field_evidence:'',undergraduate:null,identity:{chinese_national:{value:'unknown',source:null},chinese_heritage:{value:'unknown',source:null}},sources:[],subsequent:[],checked_at:null,notes:''},null,2)+'\n');
fs.writeFileSync(path.resolve('review-queue.json'),JSON.stringify(excluded,null,2)+'\n');
console.log(JSON.stringify({records:records.length,schools:new Set(records.map(r=>r.school)).size,regions:Object.fromEntries(['US','CA','HK','SG'].map(x=>[x,records.filter(r=>r.origin===x).length])),years:Object.fromEntries(catalog.history_years.map(y=>[y,records.filter(r=>r.placement_year===y).length])),onMarket:records.filter(r=>r.status==='on_market').length,excluded:excluded.length}));
