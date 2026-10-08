import {gapSummary,outcomeScenario,regionalSummary,regionalSignals,TRACK_LABELS,SIGNAL_LABELS,provisionalTracks} from './evidence.js?v=0.6.0';

export function uncertaintyPanel(rs,basis,assumption,ui){
  const {panel,percent}=ui,s=outcomeScenario(rs,basis,assumption),g=gapSummary(rs);
  return panel('空缺影响有多大？','MISSING DATA & SCENARIOS',`<div class="evidence-content"><div class="gap-grid">${[['research_missing','方向待细分'],['outcome_missing','首职 / 路径待核验'],['year_missing','已有首职，缺年份'],['role_missing','已有机构，缺岗位类别']].map(([k,t])=>`<button class="gap-card" data-quality="${k}"><strong>${g[k]}</strong><span>${t}</span></button>`).join('')}</div><p class="chart-note">方向待细分中，${g.provisional} 人已有可复核的暂定标签。“首职 / 路径待核验”和“已有首职，缺年份”互不重叠；其他缺口可能重叠。点数字查看名单。空缺表示尚未完成核验，不等于查不到。</p><details class="scenario-details"><summary>尝试不同假设，观察教职率变化</summary><p>已有明确类别：${s.faculty} / ${s.known} = <strong>${percent(s.facultyShare)}</strong>；另有 ${s.unknown} 人类别未知。假设这些未知记录最终都落入四种已知去向类别：</p><label for="scenario-share">假设未知记录中，终身轨教职占比为 <output id="scenario-assumption">${Math.round(assumption*100)}%</output></label><input id="scenario-share" type="range" min="0" max="100" step="5" value="${Math.round(assumption*100)}"><p class="scenario-result">情景教职率：<strong id="scenario-result">${percent(s.scenario)}</strong></p><p>计算：（${s.faculty} + ${s.unknown} × 假设比例）÷ ${s.denominator}。极端假设范围：${percent(s.lower)}–${percent(s.upper)}。</p><p class="chart-note">50% 只是滑块起点，不是预测。此范围不是置信区间；不为任何人填入猜测去向，不包含尚未收录的人，不能据此估计完整市场。延期与当季求职者仍不进入分母。缺年份者也不会被填入年度图。</p></details></div>`);
}
export function regionalDetail(r,ui){
  const {esc,external,region}=ui;
  const signals=[...regionalSignals(r,'CN'),...regionalSignals(r,'HK')];
  if(!signals.length)return '<p class="chart-note">本档案尚未收录中国大陆 / 香港的明确求职意向或招聘活动证据；这不表示本人不考虑这些地区。任职去向见上方，教育背景另列。</p>';
  return '<ul class="event-list">'+signals.map(s=>`<li><strong>${esc(SIGNAL_LABELS[s.kind])} · ${region(s.region)}</strong><span>${esc(s.observed_date)} · ${esc(s.institution||'本人表述')} · ${esc(s.event_status==='announced'?'公告安排，未另证实出席':'来源记载')}</span><p>${esc(s.evidence)}</p>${external(s.source_url,'查看原始证据')}</li>`).join('')+'</ul><p class="chart-note">历史活动只描述当时的公开记录；招聘活动不等于录用或当前意向，一般讲座不计入求职证据。</p>';
}
export function inferenceDetail(r,ui){
  const {esc,external}=ui;
  if(!provisionalTracks(r).length)return '';
  const x=r.research_inference;
  return `<div class="inference-note"><strong>暂定研究方向：${x.tracks.map(t=>TRACK_LABELS[t]).join(' · ')}</strong><p>${esc(x.reason)}</p><p>依据：${x.source_urls.map(u=>external(u,'原始研究资料')).join(' · ')} · 核查 ${esc(x.checked_at)}</p><p>这是内容判断，尚未取得明确的细分方向表述。默认不并入该方向筛选；可在“研究方向口径”中开启。</p></div>`;
}
export function chinaPanel(base,rs,filters,ui){
  const {panel,table,option,region}=ui;
  const s=regionalSummary(base,filters.china_region,filters.basis);
  return panel('中国地区市场观察','REGIONAL MARKET EVIDENCE',`<div class="evidence-content"><p>先选 Quant / CB / IO 和时间，再看谁已有本地区去向、谁留下明确的招聘记录。大陆与香港分开；不按姓名筛人。本页继承上方全部筛选。</p><div class="regional-controls"><label>观察地区<select id="china-region">${[['CN','中国大陆'],['HK','香港'],['CN_HK','中国大陆 + 香港']].map(([v,t])=>option(v,t,filters.china_region)).join('')}</select></label><label>观察依据<select id="china-kind">${[['placement','已公布本地区去向 · 含岗位待核验'],['faculty','其中教职 · 终身轨口径'],['interest','本人明确表达本地区求职意向'],['recruiting','公开招聘活动 · 不等于录用'],['any','去向、明确意向或招聘活动'],['exchange','一般学术交流 · 单独查看']].map(([v,t])=>option(v,t,filters.china_kind)).join('')}</select></label></div><div class="gap-grid">${[['placement','本地区去向记录'],['faculty','其中终身轨口径教职'],['interest','已收录明确意向'],['recruiting','已收录招聘活动']].map(([k,t])=>`<button class="gap-card" data-china-kind="${k}"><strong>${s[k]}</strong><span>${t}</span></button>`).join('')}</div><p class="chart-note">人数可能重叠，不能相加。0 表示本库尚未收录相应证据，并非市场上无人申请。一般交流另有 ${s.exchange} 人，不计入求职证据。过去的去向也不意味着现在仍在求职。</p><p class="chart-note">可另用上方“本科在中国大陆／香港”等背景筛选做对照，但教育地区不用于推断求职意愿、国籍或族裔。</p></div>`)+panel(`符合观察条件的研究者 · ${rs.length} 人`,`${region(filters.china_region)||'CN + HK'} · PUBLIC RECORDS`,table(rs)+`<div class="panel-footer"><button class="button secondary" id="export-csv">导出当前观察名单 CSV</button></div>`)+panel('如何继续补充求职证据','SOURCE CHECKLIST',`<div class="prose"><p>优先保存本人主页明确的地区求职表述，以及主办方标为 Job Talk / Recruitment Seminar 的候选人公告。每条记录保留日期、来源、学校和原文依据；仅有 JMP 标题或普通讲座不足以证明是招聘活动。</p><p>APMA 设有独立的 ${ui.external('https://ma.szu.edu.cn/info/1048/8636.htm','Marketing Academic Job Market Forum')}，可作为后续核查入口；必须找到具体场次和人名，不能把整场会议的参会者都列作求职者。</p><p>目前该项尚未完成逐人普查。你可以先用本地区历史教职名单比较研究方向、培养院校和 JMP，再用明确招聘记录追踪当季相关候选人。</p></div>`);
}
