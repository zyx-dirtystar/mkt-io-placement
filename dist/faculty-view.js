import {GRAD_GROUPS,ORIGIN_GROUPS,CHECK_STATES,graduationGroup,originGroup,receivingSchools,receivingProgress,filterReceivingSchools,receivingCsv,filterFaculty,facultyCsv} from './faculty.js?v=1.0.1';

export function mountFaculty(root,catalog,openPerson,ui){
 const {esc,external,region,option,panel}=ui;
 const archive=catalog.faculty,people=archive.people,hosts=receivingSchools(catalog),schools=receivingProgress(catalog);
 const defaults={view:'progress',q:'',region:'overseas',host:'all',grad:'all',origin:'all',track:'all',gap:'all',school:'',schoolRegion:'all',schoolState:'all',schoolQ:'',schoolSort:'checked',page:'1'};
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 const state={...defaults};for(const k of Object.keys(defaults))if(params.has('faculty_'+k))state[k]=params.get('faculty_'+k);
 // Existing links with teacher filters continue to open the teacher view.
 if(!params.has('faculty_view')&&['q','region','host','grad','origin','track'].some(k=>params.has('faculty_'+k)))state.view='people';
 if(!['progress','people'].includes(state.view))state.view='progress';
 if(!['all','overseas','US','CA','HK','SG','CN'].includes(state.schoolRegion))state.schoolRegion='all';
 if(!['all','started',...Object.keys(CHECK_STATES)].includes(state.schoolState))state.schoolState='all';
 if(!schools.some(h=>h.id===state.school))state.school='';
 const started=schools.filter(h=>h.started),complete=schools.filter(h=>h.state==='complete');
 const overseas=schools.filter(h=>h.region!=='CN'),mainland=schools.filter(h=>h.region==='CN');
 const shortDate=d=>d?esc(d):'未核验';
 const badge=h=>`<span class="faculty-state ${h.state}">${CHECK_STATES[h.state]}</span>`;
 const button=(label,action,extra='')=>`<button type="button" class="text-button" ${action} ${extra}>${label}</button>`;
 function download(content,name){const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)}
 function sync(){const query=new URLSearchParams();for(const [k,v] of Object.entries(state))if(v!==defaults[k])query.set('faculty_'+k,v);history.replaceState(null,'','#faculty'+(query.size?'?'+query:''))}
 function showPeople(patch={}){Object.assign(state,{view:'people',q:'',region:'all',host:'all',grad:'all',origin:'all',track:'all',gap:'all'},patch);render();root.querySelector('#faculty-content-title')?.focus()}
 function showSchool(id,focus=false){
  const h=schools.find(h=>h.id===id);if(!h)return;
  if(state.view==='people'||!filterReceivingSchools(schools,{region:state.schoolRegion,state:state.schoolState,q:state.schoolQ}).some(h=>h.id===id))Object.assign(state,{schoolRegion:h.region,schoolState:'all',schoolQ:'',page:'1'});
  state.school=id;state.view='progress';render();if(focus)root.querySelector('#faculty-school-title')?.focus();
 }
 root.innerHTML=`<div class="page-top faculty-head"><div><p class="eyebrow">FACULTY REVERSE LOOKUP</p><h1>教师反查：范围与进度<span class="title-dot">.</span></h1><p class="page-subtitle">查询各接收院校的核验进度，追溯教师的博士来源、现职与职业路径。</p></div><span class="outline-badge">数据核验截至 ${esc(archive.updated_at)}</span></div>
 <div class="faculty-metrics" aria-label="反查总览">
 <button type="button" class="faculty-metric" data-metric="started"><span>已启动院校</span><strong>${started.length}<small> / ${schools.length}</small></strong><span>海外 ${overseas.filter(h=>h.started).length}/${overseas.length} · 内地 ${mainland.filter(h=>h.started).length}/${mainland.length}</span></button>
 <button type="button" class="faculty-metric" data-metric="complete"><span>整系名单已对齐</span><strong>${complete.length}<small> 校</small></strong><span>需要名单范围与完整性证据</span></button>
 <button type="button" class="faculty-metric" data-metric="people"><span>已收录教师档案</span><strong>${people.length}<small> 人</small></strong><span>${new Set(people.map(p=>p.host_id)).size} 所任职院校 · 点击查看</span></button>
 <button type="button" class="faculty-metric faculty-metric-dark" data-metric="linked"><span>已关联 placement</span><strong>${people.filter(p=>p.placement_id).length}<small> 人</small></strong><span>同人关联 · 保留首次岗位</span></button></div>
 <div class="faculty-view-switch" role="group" aria-label="教师反查视图"><button type="button" data-faculty-view="progress">院校进度 <span>${schools.length}</span></button><button type="button" data-faculty-view="people">教师档案 <span>${people.length}</span></button><p>院校进度与培养项目年度覆盖分别核验</p></div>
 <div id="faculty-content"></div>`;
 const content=root.querySelector('#faculty-content');
 function schoolDetail(h){
  const sources=h.check?.sources||[];
  return `<section class="faculty-school-detail" aria-labelledby="faculty-school-title"><div class="faculty-detail-top"><div><p class="eyebrow">SCHOOL CHECK · ${esc(region(h.region))}</p><h2 id="faculty-school-title" tabindex="-1">${esc(h.label||h.school)}</h2></div>${button('收起','data-close-school',`aria-label="收起 ${esc(h.label||h.school)} 核验详情"`)}</div>
  <div class="faculty-detail-status">${badge(h)}<span>最近核验：${shortDate(h.checked_at)}</span><span>整系名单人数：${h.roster_total??'尚未确认'}</span></div>
  <p>${esc(h.check?.notes||(h.people.length?'已收录个人档案，尚无院校整体核验记录。':'尚无教师目录与个人核验记录。未开始核验不代表没有相关教师。'))}</p>
  <div class="faculty-detail-columns"><div><h3>已收录的教师 · ${h.people.length} 人</h3>${h.people.length?`<ul class="faculty-member-list">${h.people.map(p=>`<li>${button(esc(p.name),`data-show-person="${esc(p.id)}"`)}<span>${esc(p.phd?.school||'博士院校待核验')} · ${esc(p.phd?.year||'毕业年待核验')}</span></li>`).join('')}</ul>${button(`查看这所学校的 ${h.people.length} 份档案 →`,`data-school-people="${esc(h.id)}"`)}`:'<p class="muted">教师人数未知，等待官方在职目录核验。</p>'}</div>
  <div><h3>${h.state==='complete'?'完整性依据':'尚缺哪些核验'}</h3><p class="muted">${h.state==='complete'?`已按「${esc(h.check.roster.scope)}」对齐 ${h.roster_total} 人；名单观察日 ${shortDate(h.check.roster.checked_at)}。`:'仍需明确院系与在职范围、核对完整教师目录，逐人记录纳入 / 排除理由。个案数量不代表院系总人数。'}</p>${h.missing_year?button(`${h.missing_year} 人博士毕业年待核验 →`,`data-school-gap="${esc(h.id)}"`):''}<h3>院校核验来源</h3>${sources.length?`<ul class="source-list">${sources.map(s=>`<li>${external(s.url,s.label)}</li>`).join('')}</ul>`:'<p class="muted">尚未登记目录证据；个人来源见教师档案。</p>'}${h.state==='complete'?`<ul class="source-list">${h.check.roster.evidence.map(s=>`<li>${external(s.url,s.label||'完整性来源')}</li>`).join('')}</ul>`:''}</div></div></section>`;
 }
 function progressMarkup(){
  const regions=['US','CA','HK','SG','CN'];
  const rows=filterReceivingSchools(schools,{region:state.schoolRegion,state:state.schoolState,q:state.schoolQ,sort:state.schoolSort});
  const pages=Math.max(1,Math.ceil(rows.length/10));state.page=String(Math.min(pages,Math.max(1,parseInt(state.page,10)||1)));
  const page=Number(state.page),visible=rows.slice((page-1)*10,page*10);
  const latest=started.toSorted((a,b)=>(b.checked_at||'').localeCompare(a.checked_at||'')||a.school.localeCompare(b.school)).slice(0,4);
  const missingYear=people.filter(p=>!Number.isInteger(p.phd?.year)).length,missingCv=people.filter(p=>!p.cv_url).length,missingRoleYear=people.filter(p=>!Number.isInteger(p.current.start_year)).length;
  return `<section class="panel faculty-board"><div class="panel-heading"><div><p class="eyebrow">SCOPE & PROGRESS</p><h2 id="faculty-content-title" tabindex="-1">反查范围与进度</h2></div><span class="faculty-state partial">${started.length} 校已启动 · ${schools.length-started.length} 校未开始</span></div>
  <p class="faculty-intro">海外首轮沿用 Marketing 研究范围的北美 50、香港 5、新加坡 3 校；内地保留指定 9 校。下方进度表示<strong>院校是否启动核验</strong>，整系名单是否查全另行确认。</p>
  <div class="faculty-region-grid">${regions.map(r=>{const hs=schools.filter(h=>h.region===r),n=hs.filter(h=>h.started).length;return `<button type="button" class="faculty-region ${state.schoolRegion===r?'selected':''}" data-school-region="${r}" aria-pressed="${state.schoolRegion===r}"><span>${esc(region(r))}<small>${r==='CN'?'指定范围':'海外首轮'}</small></span><strong>${n}<small> / ${hs.length} 校启动</small></strong><span class="faculty-meter" aria-hidden="true"><i style="width:${100*n/hs.length}%"></i></span><span class="faculty-region-note">${hs.reduce((s,h)=>s+h.people.length,0)} 份已收录档案 · ${hs.filter(h=>h.state==='complete').length} 校整系对齐</span></button>`}).join('')}</div>
  <details class="faculty-explainer"><summary>为什么进度没有自动增加？</summary><p>当前数据由公开资料逐人核验后入库。每周来源检查只发现网页变化与失效链接，结果仍需人工核验、合入并发布，因此不会自动增加学校或教师人数。已核验少数个人，也不能把整所学校标为完成。</p><p>现职反查用于补充和校对职业路径；教师档案本身不进入 placement 的样本分母。${external('https://github.com/zyx-dirtystar/mkt-io-placement/actions/workflows/source-checks.yml','查看来源检查运行记录')} · <a href="#coverage">查看培养项目年度覆盖</a></p></details></section>
  <section class="panel faculty-schools"><div class="panel-heading"><div><p class="eyebrow">RECEIVING SCHOOLS</p><h2>按院校查看核验</h2></div><button type="button" class="button secondary" id="faculty-school-export">导出院校进度 CSV</button></div>
  <form id="faculty-school-filters" class="faculty-school-filters"><label class="search"><span aria-hidden="true">⌕</span><input type="search" name="schoolQ" value="${esc(state.schoolQ)}" aria-label="搜索反查院校" placeholder="搜索院校或已收录教师"></label>
  <label class="filter-label">地区<select name="schoolRegion">${[['all',`全部 ${schools.length} 校`],['overseas',`海外首轮 ${overseas.length} 校`],...regions.map(r=>[r,region(r)])].map(([v,t])=>option(v,t,state.schoolRegion)).join('')}</select></label>
  <label class="filter-label">核验进度<select name="schoolState">${[['all','全部进度'],['started','已启动'],...Object.entries(CHECK_STATES)].map(([v,t])=>option(v,t,state.schoolState)).join('')}</select></label>
  <label class="filter-label">院校排序<select name="schoolSort">${[['checked','最近核验优先'],['name','院校名称 A–Z']].map(([v,t])=>option(v,t,state.schoolSort)).join('')}</select></label></form>
  <div class="faculty-results-meta" role="status"><span>符合条件 ${rows.length} 校 · 已启动 ${rows.filter(h=>h.started).length} 校</span>${button('重置院校筛选','data-reset-schools')}</div>
  ${state.school?schoolDetail(schools.find(h=>h.id===state.school)):''}
  ${visible.length?`<div class="table-scroll"><table class="faculty-school-table"><caption class="sr-only">院校反查进度；未开始学校的教师人数未知</caption><thead><tr><th scope="col">接收院校</th><th scope="col">核验进度</th><th scope="col">已收录 / 已关联</th><th scope="col">最近核验</th><th scope="col">详情</th></tr></thead><tbody>${visible.map(h=>`<tr class="${state.school===h.id?'selected':''}"><th scope="row">${button(esc(h.label||h.school),`data-open-school="${esc(h.id)}"`)}<span class="cell-note">${esc(region(h.region))}</span></th><td data-label="进度">${badge(h)}</td><td data-label="已收录 / 已关联">${h.started?`<strong>${h.people.length}</strong> 人 / ${h.linked} 人`:'<span class="muted">未查 · 人数未知</span>'}</td><td data-label="最近核验">${shortDate(h.checked_at)}</td><td>${button('查看核验 →',`data-open-school="${esc(h.id)}"`,`aria-label="查看 ${esc(h.label||h.school)} 核验"`)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state"><h3>没有符合条件的院校</h3><p>试试其他地区、进度或名称。</p></div>'}
  <div class="faculty-pagination"><span>第 ${page} / ${pages} 页${rows.length?` · ${(page-1)*10+1}–${Math.min(page*10,rows.length)} / ${rows.length} 校`:''}</span><div><button type="button" class="button secondary" data-school-page="${page-1}" ${page===1?'disabled':''}>上一页</button><button type="button" class="button secondary" data-school-page="${page+1}" ${page===pages?'disabled':''}>下一页</button></div></div></section>
  <div class="faculty-secondary-grid">${panel('最近核验记录','LATEST CHECKS',`<ul class="faculty-activity">${latest.map(h=>`<li><time datetime="${esc(h.checked_at)}">${shortDate(h.checked_at)}</time><div>${button(esc(h.label||h.school),`data-open-school="${esc(h.id)}"`)}<span>${h.people.length} 份个案档案 · ${h.linked} 人已关联 placement</span></div></li>`).join('')}</ul><p class="chart-note">按核验日期排列；个案核验日期不等于整系目录复核日期。</p>`)}
  ${panel('已收录档案的待补资料','RECORD GAPS',`<div class="faculty-gap-list">${[['degree_year','博士毕业年待核验',missingYear],['cv','未登记 CV 链接',missingCv],['role_year','当前职级开始年待核验',missingRoleYear]].map(([k,label,n])=>`<button type="button" data-gap="${k}"><span>${label}</span><strong>${n}<small> / ${people.length} 人 →</small></strong></button>`).join('')}</div><p class="chart-note">只统计现有 ${people.length} 份档案，未启动院校人数未知。${people.filter(p=>!p.placement_id).length} 份未关联 placement 的档案独立保留，${button('查看未关联档案 →','data-gap="unlinked"')}</p>`)}</div>`;
 }
 function personCard(p){return `<article class="faculty-card"><div class="faculty-person-top"><div><h3 id="faculty-person-${esc(p.id)}" tabindex="-1">${esc(p.name)}</h3>${p.aliases.length?`<p class="cell-note">${esc(p.aliases.join(' · '))}</p>`:''}</div><span class="faculty-state ${p.placement_id?'partial':'not_started'}">${p.placement_id?'已关联 placement':'独立教师档案'}</span></div><div class="track-tags"><span class="tag">${GRAD_GROUPS[graduationGroup(p,catalog.history_years)]}</span><span class="tag">${ORIGIN_GROUPS[originGroup(p,catalog)]}</span>${p.research_inference?'<span class="tag">另有暂定方向</span>':''}</div><dl><dt>当前任职</dt><dd>${esc(p.current.institution)} · ${esc(region(p.current.region))}<br>${esc(p.current.role)}<br><span class="muted">当前职级开始年：${esc(p.current.start_year||'未核验')}（非首职年）</span></dd><dt>博士来源</dt><dd>${esc(p.phd?.school||'未核验')}<br>${esc(p.phd?.program||'未核验')} · ${esc(p.phd?.year||'年份待核验')}</dd><dt>研究</dt><dd>${esc(p.fields.join(' · '))}</dd></dl><div class="faculty-links">${p.homepage?external(p.homepage,'个人主页'):''}${p.cv_url?external(p.cv_url,'本人 CV'):''}${p.placement_id?button('查看 placement 路径',`data-faculty-person="${esc(p.placement_id)}"`):''}${button('查看院校进度',`data-open-school="${esc(p.host_id)}"`)}</div><details><summary>核验备注与来源 · ${esc(p.checked_at)}</summary><p>${esc(p.notes)}</p>${p.research_inference?`<p>暂定方向：${esc(p.research_inference.tracks.join(' · '))}。${esc(p.research_inference.reason)}</p>`:''}<ul class="source-list">${p.sources.map(s=>`<li>${external(s.url,s.label)}</li>`).join('')}</ul></details></article>`}
 function peopleMarkup(){
  const select=(name,label,options)=>`<label class="filter-label">${label}<select name="${name}">${options.map(([v,t])=>option(v,t,state[name])).join('')}</select></label>`;
  return `<div class="faculty-people-summary"><p><strong>${people.filter(p=>graduationGroup(p,catalog.history_years)==='recent').length}</strong> 位近四年博士（${catalog.history_years[0]}–${catalog.history_years.at(-1)}）<span> / </span><strong>${people.filter(p=>graduationGroup(p,catalog.history_years)==='historical').length}</strong> 位历史教师<span> / </span><strong>${people.filter(p=>graduationGroup(p,catalog.history_years)==='unknown').length}</strong> 位毕业年待核验</p><p class="muted">按博士毕业年分组。现职、晋升或转校时间分别保留，教师档案独立于 placement 样本。</p></div>
  <form id="faculty-filters" class="filter-panel"><div class="filter-top"><strong>查找教师与博士来源</strong><label class="search"><span aria-hidden="true">⌕</span><input name="q" value="${esc(state.q)}" aria-label="搜索教师" placeholder="姓名、博士院校、研究主题" type="search"></label></div><div class="filter-grid">
  ${select('region','当前任职地区',[['overseas','美 / 加 / 港 / 新（优先）'],['all','全部地区'],...['US','CA','HK','SG','CN'].map(r=>[r,region(r)])])}
  ${select('host','接收院校',[['all','全部接收院校'],...hosts.map(h=>[h.id,h.label||h.school])])}
  ${select('grad','博士毕业年份分类',[['all','全部年份分类'],...Object.entries(GRAD_GROUPS)])}
  ${select('origin','博士来源范围',[['all','全部博士来源'],...Object.entries(ORIGIN_GROUPS)])}
  ${select('track','已核实研究方向',[['all','全部方向'],['marketing','Marketing'],['qm','Quant Marketing'],['cb','Consumer Behavior'],['strategy','Strategy'],['io','Economics / IO']])}
  ${select('gap','资料状态',[['all','全部资料状态'],['degree_year','博士毕业年待核验'],['cv','未登记 CV 链接'],['role_year','当前职级开始年待核验'],['linked','已关联 placement'],['unlinked','未关联 placement']])}
  </div><div class="filter-bottom"><span>姓名支持公开别名搜索；未核验字段保持未知。</span>${button('重置教师筛选','data-reset-people')}</div></form><div id="faculty-results" aria-live="polite"></div>`;
 }
 function renderPeople(){
  const rows=filterFaculty(people,state,catalog);sync();
  content.querySelector('#faculty-results').innerHTML=panel(`<span id="faculty-content-title" tabindex="-1">筛选结果 · ${rows.length} 位教师</span>`,'FACULTY RECORDS',`<div class="faculty-actions"><button type="button" class="button secondary" id="faculty-export">导出当前教师 CSV</button><span class="muted">同一教师只保留一份档案；现职不改写首职。</span></div>${rows.length?`<div class="faculty-cards">${rows.map(personCard).join('')}</div>`:'<div class="empty-state"><h3>当前筛选没有已收录档案</h3><p>未启动院校不表示没有相关教师。可返回院校进度查看核验范围。</p><button type="button" class="button secondary" data-back-progress>查看院校进度</button></div>'}`);
  content.querySelector('#faculty-export').onclick=()=>download(facultyCsv(rows,catalog),'faculty-archive-'+archive.updated_at+'.csv');
  bindLinks();
 }
 function bindLinks(){
  content.querySelectorAll('[data-open-school]').forEach(b=>b.onclick=()=>showSchool(b.dataset.openSchool,true));
  content.querySelectorAll('[data-faculty-person]').forEach(b=>b.onclick=()=>openPerson(b.dataset.facultyPerson));
  content.querySelectorAll('[data-back-progress]').forEach(b=>b.onclick=()=>{state.view='progress';render()});
 }
 function render(){
  root.querySelectorAll('[data-faculty-view]').forEach(b=>{const selected=b.dataset.facultyView===state.view;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
  content.innerHTML=state.view==='progress'?progressMarkup():peopleMarkup();sync();
  if(state.view==='people'){
   const form=content.querySelector('#faculty-filters');form.onsubmit=e=>e.preventDefault();form.onchange=e=>{state[e.target.name]=e.target.value;renderPeople()};form.elements.q.oninput=e=>{if(!e.isComposing){state.q=e.target.value;renderPeople()}};
   content.querySelector('[data-reset-people]').onclick=()=>{Object.assign(state,{q:'',region:'overseas',host:'all',grad:'all',origin:'all',track:'all',gap:'all'});render()};
   renderPeople();return;
  }
  const form=content.querySelector('#faculty-school-filters');form.onsubmit=e=>e.preventDefault();
  function updateSchoolFilter(e){if(e.isComposing)return;const name=e.target.name,value=e.target.value,start=e.target.selectionStart,end=e.target.selectionEnd;state[name]=value;state.page='1';state.school='';render();if(name==='schoolQ'){const input=content.querySelector('[name="schoolQ"]');input.focus();if(start!==null)input.setSelectionRange(start,end)}}
  form.onchange=e=>{if(e.target.name!=='schoolQ')updateSchoolFilter(e)};form.elements.schoolQ.oninput=updateSchoolFilter;
  content.querySelectorAll('[data-school-region]').forEach(b=>b.onclick=()=>{state.schoolRegion=b.dataset.schoolRegion;state.school='';state.page='1';render()});
  content.querySelector('[data-reset-schools]').onclick=()=>{Object.assign(state,{schoolRegion:'all',schoolState:'all',schoolQ:'',schoolSort:'checked',school:'',page:'1'});render()};
  content.querySelectorAll('[data-school-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.schoolPage;state.school='';render();content.querySelector('#faculty-school-filters').scrollIntoView({block:'start'})});
  content.querySelector('#faculty-school-export').onclick=()=>download(receivingCsv(filterReceivingSchools(schools,{region:state.schoolRegion,state:state.schoolState,q:state.schoolQ,sort:state.schoolSort})),'faculty-school-progress-'+archive.updated_at+'.csv');
  content.querySelectorAll('[data-gap]').forEach(b=>b.onclick=()=>showPeople({gap:b.dataset.gap}));
  content.querySelector('[data-close-school]')?.addEventListener('click',()=>{state.school='';render()});
  content.querySelectorAll('[data-school-people]').forEach(b=>b.onclick=()=>showPeople({host:b.dataset.schoolPeople}));
  content.querySelectorAll('[data-school-gap]').forEach(b=>b.onclick=()=>showPeople({host:b.dataset.schoolGap,gap:'degree_year'}));
  content.querySelectorAll('[data-show-person]').forEach(b=>b.onclick=()=>{const p=people.find(p=>p.id===b.dataset.showPerson);showPeople({host:p.host_id,q:p.name});root.querySelector('[id="faculty-person-'+p.id+'"]')?.focus()});
  bindLinks();
 }
 root.querySelectorAll('[data-faculty-view]').forEach(b=>b.onclick=()=>{state.view=b.dataset.facultyView;render()});
 root.querySelectorAll('[data-metric]').forEach(b=>b.onclick=()=>{const key=b.dataset.metric;if(key==='people'||key==='linked')showPeople(key==='linked'?{gap:'linked'}:{});else{Object.assign(state,{view:'progress',schoolRegion:'all',schoolState:key==='complete'?'complete':'started',schoolQ:'',school:'',page:'1'});render();root.querySelector('#faculty-school-filters').scrollIntoView({block:'start'})}});
 render();
}
