import {GRAD_GROUPS,ORIGIN_GROUPS,graduationGroup,originGroup,receivingSchools,filterFaculty,facultyCsv} from './faculty.js?v=1.0.0';

export function mountFaculty(root,catalog,openPerson,ui){
 const {esc,external,region,option,panel}=ui;
 const archive=catalog.faculty,people=archive.people,hosts=receivingSchools(catalog);
 const initial=()=>({q:'',region:'overseas',host:'all',grad:'all',origin:'all',track:'all'});
 let filters=initial();const params=new URLSearchParams(location.hash.split('?')[1]||'');for(const k of Object.keys(filters))if(params.has('faculty_'+k))filters[k]=params.get('faculty_'+k);
 const select=(name,label,options)=>`<label class="filter-label">${label}<select name="${name}">${options.map(([v,t])=>option(v,t,filters[name])).join('')}</select></label>`;
 const stat=(label,value,note)=>`<div class="stat-card"><p>${label}</p><strong>${value}</strong><span>${note}</span></div>`;
 root.innerHTML=`<div class="page-top"><div><p class="eyebrow">FACULTY REVERSE LOOKUP</p><h1>从教师名录，补回就业路径<span class="title-dot">.</span></h1><p class="page-subtitle">优先美国、加拿大、香港和新加坡；保留较早毕业者与扩展来源，逐人核对近期博士的首职。</p></div><span class="outline-badge">核验于 ${esc(archive.updated_at)}</span></div>
 <div class="notice"><strong>首批教师档案 · 局部核验</strong><span>已核实 ${people.length} 份档案，涉及 ${new Set(people.map(p=>p.host_id)).size} 所接收院校；尚未完成逐校普查。现职、晋升或转校年份分别保留，教师档案不直接进入 placement 人数与学术教职样本占比。</span></div>
 <div class="stats-grid">${stat('教师档案',people.length,'独立于 placement 统计')}${stat('近四年博士',people.filter(p=>graduationGroup(p,catalog.history_years)==='recent').length,`${catalog.history_years[0]}–${catalog.history_years.at(-1)} · 按博士毕业年`)}${stat('历史教师',people.filter(p=>graduationGroup(p,catalog.history_years)==='historical').length,'早于当前四年窗口')}${stat('已关联 placement',people.filter(p=>p.placement_id).length,'同人关联，一人不重复计数')}</div>
 <form id="faculty-filters" class="filter-panel"><div class="filter-top"><strong>查找教师与博士来源</strong><label class="search"><span aria-hidden="true">⌕</span><input name="q" aria-label="搜索教师" placeholder="姓名、博士院校、研究主题" type="search"></label></div><div class="filter-grid">
 ${select('region','当前任职地区',[['overseas','美 / 加 / 港 / 新（优先）'],['all','全部地区'],...['US','CA','HK','SG','CN'].map(r=>[r,region(r)])])}
 ${select('host','接收院校',[['all','全部接收院校'],...hosts.map(h=>[h.id,h.label||h.school])])}
 ${select('grad','博士毕业年份分类',[['all','全部年份分类'],...Object.entries(GRAD_GROUPS)])}
 ${select('origin','博士来源范围',[['all','全部博士来源'],...Object.entries(ORIGIN_GROUPS)])}
 ${select('track','已核实研究方向',[['all','全部方向'],['marketing','Marketing'],['qm','Quant Marketing'],['cb','Consumer Behavior'],['strategy','Strategy'],['io','Economics / IO']])}
 </div><div class="filter-bottom"><span>年份标签随最近四年配置更新；年份未知单列。</span><button id="faculty-reset" type="button" class="text-button">重置筛选</button></div></form>
 <div id="faculty-results" aria-live="polite"></div>
 ${panel('反查范围与进度','RECEIVING SCHOOLS',`<div class="faculty-scope"><p>海外首轮：北美研究 50 校、港五、新加坡三所。已启动 ${archive.receiving_checks.filter(c=>hosts.some(h=>h.id===c.host_id&&h.region!=='CN')).length} / 58 校的局部核验；启动不代表整系教师或整届毕业生已查全。</p><p>内地仅关注：${archive.receiving_scope.mainland.map(h=>esc(h.label)).join('、')}。按你点名的 9 校保留，并非排名“前五”。内地暂未开始本轮系统反查。</p><details><summary>查看全部院校进度</summary><ul class="event-list">${hosts.map(h=>{const c=archive.receiving_checks.find(c=>c.host_id===h.id);return `<li><strong>${esc(h.label||h.school)}</strong><span>${c?'局部核验 · '+esc(c.checked_at):'尚未开始'}${c?' · '+esc(c.notes):''}</span>${c?c.sources.map(s=>external(s.url,s.label)).join(' · '):''}</li>`}).join('')}</ul></details><p class="chart-note">接收院校反查与“覆盖与来源”中的博士培养项目年度核验是两项进度。转校、访问经历不等于首职或授予博士学位。</p></div>`)}`;
 const results=root.querySelector('#faculty-results');
 function render(){
  const query=new URLSearchParams();for(const [k,v] of Object.entries(filters))if(v!==initial()[k])query.set('faculty_'+k,v);history.replaceState(null,'','#faculty'+(query.size?'?'+query:''));
  const rows=filterFaculty(people,filters,catalog);
  results.innerHTML=panel(`筛选结果 · ${rows.length} 位教师`,'FACULTY RECORDS',`<div class="faculty-actions"><button type="button" class="button secondary" id="faculty-export">导出当前教师 CSV</button><span class="muted">这是教师现职档案，不能用于计算近期 placement 率。</span></div>${rows.length?`<div class="faculty-cards">${rows.map(p=>`<article class="faculty-card"><div><h3>${esc(p.name)}</h3><p class="cell-note">${esc(p.aliases.join(' · '))}</p><div class="track-tags"><span class="tag">${GRAD_GROUPS[graduationGroup(p,catalog.history_years)]}</span><span class="tag">${ORIGIN_GROUPS[originGroup(p,catalog)]}</span>${p.research_inference?'<span class="tag">另有暂定方向</span>':''}</div></div><dl><dt>当前任职</dt><dd>${esc(p.current.institution)} · ${esc(region(p.current.region))}<br>${esc(p.current.role)}<br><span class="muted">当前职级开始年：${esc(p.current.start_year||'未核验')}（非首职年）</span></dd><dt>博士来源</dt><dd>${esc(p.phd?.school||'未核验')}<br>${esc(p.phd?.program||'未核验')} · ${esc(p.phd?.year||'年份待核验')}</dd><dt>研究</dt><dd>${esc(p.fields.join(' · '))}</dd></dl><div class="faculty-links">${p.homepage?external(p.homepage,'个人主页'):''}${p.cv_url?external(p.cv_url,'本人 CV'):''}${p.placement_id?`<button type="button" class="text-button" data-faculty-person="${esc(p.placement_id)}">查看 placement 路径</button>`:'<span class="muted">未进入近期 placement 统计</span>'}</div><details><summary>核验备注与来源</summary><p>${esc(p.notes)}</p>${p.research_inference?`<p>暂定方向：${esc(p.research_inference.tracks.join(' · '))}。${esc(p.research_inference.reason)}</p>`:''}<ul class="source-list">${p.sources.map(s=>`<li>${external(s.url,s.label)}</li>`).join('')}</ul><p class="muted">核验于 ${esc(p.checked_at)}</p></details></article>`).join('')}</div>`:'<p class="faculty-empty">当前筛选没有已收录档案。尚未开始的院校不表示没有相关教师。</p>'}`);
  results.querySelectorAll('[data-faculty-person]').forEach(b=>b.onclick=()=>openPerson(b.dataset.facultyPerson));
  results.querySelector('#faculty-export').onclick=()=>{
   const url=URL.createObjectURL(new Blob([facultyCsv(rows,catalog)],{type:'text/csv;charset=utf-8'}));
   const a=document.createElement('a');a.href=url;a.download='faculty-archive-'+archive.updated_at+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
  };
 }
 const form=root.querySelector('#faculty-filters');form.onsubmit=e=>e.preventDefault();
 for(const [k,v] of Object.entries(filters))if(form.elements[k])form.elements[k].value=v;
 form.onchange=e=>{filters[e.target.name]=e.target.value;render()};
 form.elements.q.oninput=e=>{filters.q=e.target.value;render()};
 root.querySelector('#faculty-reset').onclick=()=>{filters=initial();form.reset();render()};
 render();
}
