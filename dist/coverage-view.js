import {REGIONS} from './core.js?v=0.3.0';

export const AUDIT_STATUS = {
  not_started: '未开始核对',
  partial: '核验中',
  source_reconciled: '官方表已对齐',
  insufficient: '该年资料不足'
};
export function auditPeriods(catalog) {
  return [...catalog.history_years.map(String), catalog.current_cycle];
}
export function findAudit(catalog, programId, period) {
  return catalog.coverage.find(c => c.program_id === programId && c.period === period)
    || {program_id: programId, period, status: 'not_started', listed_count: null,
      record_ids: [], sources: [], checked_at: null, cohort_complete: false,
      notes: '该年度尚未建立核验记录。'};
}
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceLink = s => /^https?:\/\//.test(s.url)
  ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>` : '';
let filters = {q:'', region:'all', kind:'all', progress:'checked'};
export function selectPrograms(catalog, f) {
  return catalog.programs.filter(p => {
    const cells = auditPeriods(catalog).map(period => findAudit(catalog,p.id,period));
    const audited = cells.some(c => c.status === 'source_reconciled');
    const checked = cells.some(c => c.status !== 'not_started');
    return (!f.q || p.school.toLowerCase().includes(f.q.toLowerCase()))
      && (f.region === 'all' || p.region === f.region)
      && (f.kind === 'all' || p.kind === f.kind)
      && (f.progress === 'all' || f.progress === 'checked' && checked || f.progress === 'audited' && audited
        || f.progress === 'unaudited' && !audited
        || f.progress === 'pending' && p.eligibility === 'pending');
  });
}
function options(items, value) {
  return items.map(([key,label]) => `<option value="${esc(key)}" ${key===value?'selected':''}>${esc(label)}</option>`).join('');
}
function table(catalog,records) {
  const programs = selectPrograms(catalog, filters), periods = auditPeriods(catalog);
  return `<p class="coverage-count" role="status">当前显示 ${programs.length} / ${catalog.programs.length} 个发现项目。点击年份格查看名单与缺口。</p>
    <div class="table-scroll"><table class="audit-table"><thead><tr><th>博士培养项目</th>${periods.map(y=>`<th>${esc(y.replace('-','–'))}<span class="cell-note">${y.includes('-')?'求职季':'来源名单年份'}</span></th>`).join('')}</tr></thead><tbody>
    ${programs.map(p=>`<tr><td><strong>${esc(p.school)}</strong><span class="cell-note">${REGIONS[p.region]} · ${p.kind==='marketing'?'Marketing 全方向':'Economics / Business Economics'}</span><span class="tag">${p.eligibility==='verified'?'博士项目已确认':'项目资格待核实'}</span><span class="cell-note">已录入 ${records.filter(r=>r.program_id===p.id).length} 人（跨年）</span></td>
      ${periods.map(period=>{const c=findAudit(catalog,p.id,period);return `<td><button type="button" class="audit-cell ${c.status}" data-audit-program="${esc(p.id)}" data-audit-period="${period}" aria-label="${esc(p.school)} ${period} ${AUDIT_STATUS[c.status]}"><strong>${c.listed_count===null?(c.record_ids.length?`${c.record_ids.length} / ?`:'待核验'):`${c.record_ids.length} / ${c.listed_count}`}</strong><span>${AUDIT_STATUS[c.status]}</span></button></td>`}).join('')}</tr>`).join('')}
    </tbody></table></div>${programs.length?'':'<p class="coverage-count">没有匹配的项目。可把“核验进度”切换为“全部发现项目”。</p>'}`;
}
export function coverageMarkup(catalog,records) {
  const marketing=catalog.programs.filter(p=>p.kind==='marketing');
  const audited=new Set(catalog.coverage.filter(c=>c.status==='source_reconciled').map(c=>c.program_id));
  return `<div class="coverage-summary">${['US','CA','HK','SG'].map(region=>`<article class="coverage-region"><span>${REGIONS[region]}</span><strong>${marketing.filter(p=>p.region===region).length}<small> 个 Marketing 发现项目</small></strong><p>${catalog.programs.filter(p=>p.region===region&&audited.has(p.id)).length} 个项目已开始官方表对齐</p></article>`).join('')}</div>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">PROGRAM × YEAR</p><h2>逐项目核验进度</h2></div></div>
    <div class="prose"><p>Marketing 发现清单来自 <a href="https://www.ama.org/phd-programs-in-marketing/" target="_blank" rel="noopener noreferrer">AMA 项目目录</a>，并补充香港、新加坡官方项目。目录含 PhD / DBA，可能有过时或校区不明的条目；<strong>发现项目数不是已确认项目数，也不是覆盖率分母</strong>。Economics 清单目前仅包含既有记录涉及的项目，仍待系统扩展。</p><p><strong>“官方表已对齐”</strong>只说明该来源表所列人员全部入库，不说明已覆盖整届毕业生或所有求职者。格内数字为“已录入 / 此表列出”；“?” 表示尚无可靠人员分母。只公布去向机构、不列姓名的表，仍保留核验中。未列年份保留未知；没有用空白推断零毕业生。表格年份与首次任职年份可能不同，趋势图使用个人核验后的首职年。</p></div>
    <form id="coverage-filters" class="coverage-filters"><label class="filter-label">搜索院校<input name="q" type="search" value="${esc(filters.q)}" placeholder="例如 Harvard、Toronto"></label>
    <label class="filter-label">培养地区<select name="region">${options([['all','全部地区'],...['US','CA','HK','SG'].map(r=>[r,REGIONS[r]])],filters.region)}</select></label>
    <label class="filter-label">培养项目<select name="kind">${options([['all','全部项目'],['marketing','Marketing 全方向'],['economics','Economics / Business Economics']],filters.kind)}</select></label>
    <label class="filter-label">核验进度<select name="progress">${options([['checked','已开展核验'],['audited','已有名单对齐'],['all','全部发现项目'],['unaudited','尚未对齐名单'],['pending','项目资格待核实']],filters.progress)}</select></label></form>
    <div id="coverage-results">${table(catalog,records)}</div></section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">CURRENT MARKET RELEASES</p><h2>当季资料发布进度</h2></div></div><div class="release-grid">${(catalog.release_notes||[]).map(n=>`<article><h3>${esc(n.school)}</h3><p>${esc(n.note)}</p>${sourceLink({url:n.url,label:'查看官方页面'})}</article>`).join('')}</div><p class="chart-note">发布线索不等于当季人员已经查全；矩阵仍按实际完成的名单核验记录显示。</p></section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">ANNUAL MAINTENANCE</p><h2>以后每年如何继续</h2></div></div><div class="prose"><p>按项目收集完整毕业生或求职候选人名册，再追踪每人的去向；未找到工作信息者也保留。新增年份由配置控制，历史档案不删除。修订来源、年份冲突和核验日期都保存在数据中。</p><p>当前为人工核验后提交 GitHub 自动发布，尚未定时抓取。可查看 <a href="https://github.com/zyx-dirtystar/mkt-io-placement/blob/main/docs/ANNUAL-UPDATE.md" target="_blank" rel="noopener noreferrer">年度更新步骤</a>，下载 <a href="data/records.json" download>人员数据</a>、<a href="data/catalog.json" download>项目与核验矩阵</a>、<a href="data/record-template.json" download>人员模板</a>。</p></div></section>`;
}
export function bindCoverage(catalog,records,openPerson) {
  const results=document.querySelector('#coverage-results');
  function bindCells() {
    results.querySelectorAll('[data-audit-program]').forEach(button=>button.onclick=()=>{
      const p=catalog.programs.find(p=>p.id===button.dataset.auditProgram);
      const c=findAudit(catalog,p.id,button.dataset.auditPeriod);
      let dialog=document.querySelector('#audit-dialog');
      if(!dialog){dialog=document.createElement('dialog');dialog.id='audit-dialog';dialog.setAttribute('aria-labelledby','audit-title');document.body.append(dialog);dialog.onclick=e=>{if(e.target===dialog)dialog.close()};}
      dialog.innerHTML=`<div class="dialog-inner"><div class="dialog-top"><p class="eyebrow">SOURCE RECONCILIATION</p><button class="close-button" aria-label="关闭核验详情">×</button></div><h2 id="audit-title">${esc(p.school)} · ${esc(c.period)}</h2><p class="muted">${AUDIT_STATUS[c.status]} · ${p.kind==='marketing'?'Marketing':'Economics / Business Economics'}</p><p class="detail-note">${esc(c.notes)}</p><p class="detail-note">${esc(p.notes)}</p><p class="detail-note">整届完整性：${c.cohort_complete?'已确认':'尚未确认'}；核验日期：${c.checked_at||'未开始'}。</p>${c.record_ids.length?`<ul class="source-list">${c.record_ids.map(id=>{const r=records.find(r=>r.id===id);return `<li><button class="person-button" data-audit-person="${esc(id)}">${esc(r.name)}</button><span>首职年：${r.placement_year||'待核验'} · ${esc(r.destination||'去向待核验')}</span></li>`}).join('')}</ul>`:'<p class="detail-note">暂无已对齐的年度名单；不代表没有毕业生或没有相关人员记录。</p>'}<h3>名单与项目来源</h3><ul class="source-list">${[...c.sources,...p.sources].filter((s,i,a)=>a.findIndex(x=>x.url===s.url)===i).map(s=>`<li>${sourceLink(s)}</li>`).join('')}</ul></div>`;
      dialog.querySelector('.close-button').onclick=()=>dialog.close();
      dialog.querySelectorAll('[data-audit-person]').forEach(b=>b.onclick=()=>{dialog.close();openPerson(b.dataset.auditPerson)});
      dialog.showModal();
    });
  }
  const form=document.querySelector('#coverage-filters');
  form.onsubmit=e=>e.preventDefault();
  form.oninput=e=>{filters[e.target.name]=e.target.value;results.innerHTML=table(catalog,records);bindCells()};
  bindCells();
}
