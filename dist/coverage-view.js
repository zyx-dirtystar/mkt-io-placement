import {REGIONS} from './core.js?v=1.1.0';

export const AUDIT_STATUS = {
  not_started: 'Not started',
  roster_found: 'Roster found',
  cohort_complete: 'Cohort roster confirmed complete',
  not_published: 'Not yet published by the program',
  eligibility_pending: 'Program eligibility unverified',
  partial: 'Partially verified',
  source_reconciled: 'Source roster reconciled',
  insufficient: 'Insufficient public evidence'
};
export function auditPeriods(catalog) {
  return [...catalog.history_years.map(String), catalog.current_cycle];
}
export function findAudit(catalog, programId, period) {
  return catalog.coverage.find(c => c.program_id === programId && c.period === period)
    || {program_id: programId, period, status: 'not_started', listed_count: null,
      record_ids: [], sources: [], checked_at: null, cohort_complete: false,
      notes: 'No verification record has been created for this period.'};
}
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceLink = s => /^https?:\/\//.test(s.url)
  ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>` : '';
let filters = {q:'', region:'all', kind:'all', scope:'target', progress:'all'};
function statusLabel(c,p){return p?.eligibility!=='verified'?'Program eligibility unverified':c.cohort_complete?'Cohort roster confirmed complete':AUDIT_STATUS[c.status]||AUDIT_STATUS[c.roster_status]||'Partially verified'}
const eligibilityLabel = p => ({verified:'Doctoral program verified',not_identified:'Marketing doctorate not identified',pending:'Program eligibility unverified'}[p.eligibility]);
export function scopeRows(catalog){return [...(catalog.scope?.ranking.rows||[]),...(catalog.scope?.asia||[])];}
export function selectPrograms(catalog, f) {
  const order=new Map(scopeRows(catalog).map((p,i)=>[p.program_id,i]));
  return catalog.programs.filter(p => {
    const cells = auditPeriods(catalog).map(period => findAudit(catalog,p.id,period));
    const audited = cells.some(c => c.status === 'source_reconciled');
    const checked = cells.some(c => c.status !== 'not_started');
    return (!f.q || p.school.toLowerCase().includes(f.q.toLowerCase()))
      && (!f.scope || f.scope === 'all' || f.scope === 'target' && order.has(p.id) || f.scope === 'extension' && !order.has(p.id))
      && (f.region === 'all' || p.region === f.region)
      && (f.kind === 'all' || p.kind === f.kind)
      && (f.progress === 'all' || f.progress === 'checked' && checked || f.progress === 'audited' && audited
        || f.progress === 'unaudited' && !audited
        || f.progress === 'pending' && p.eligibility !== 'verified'
        || f.progress === 'complete' && cells.some(c=>c.cohort_complete)
        || f.progress === 'no_records' && p.eligibility === 'verified' && !p.record_count);
  }).sort((a,b)=>(order.get(a.id)??1000)-(order.get(b.id)??1000)||a.school.localeCompare(b.school));
}
function options(items, value) {
  return items.map(([key,label]) => `<option value="${esc(key)}" ${key===value?'selected':''}>${esc(label)}</option>`).join('');
}
function table(catalog,records) {
  const programs = selectPrograms(catalog, filters), periods = auditPeriods(catalog);
  const ranking=new Map((catalog.scope?.ranking.rows||[]).map(r=>[r.program_id,r]));
  const total=filters.scope==='target'?scopeRows(catalog).length:filters.scope==='extension'?catalog.programs.length-scopeRows(catalog).length:catalog.programs.length;
  return `<p class="coverage-count" role="status">Showing ${programs.length} / ${total} ${filters.scope==='target'?'target schools':'discovered programs'}. Select a period to view its roster, sources and unresolved fields.</p>
    <div class="table-scroll"><table class="audit-table"><thead><tr><th>Doctoral program</th>${periods.map(y=>`<th>${esc(y.replace('-','–'))}<span class="cell-note">${y.includes('-')?'Job market cycle':'Source roster year'}</span></th>`).join('')}</tr></thead><tbody>
    ${programs.map(p=>`<tr><td>${ranking.has(p.id)?`<span class="rank-label">North America #${ranking.get(p.id).rank} · UTD four journals</span>`:p.target_scope?`<span class="rank-label">${p.region==='HK'?'Hong Kong · five-school scope':'Singapore · three-school scope'}</span>`:''}<strong>${esc(p.school)}</strong><span class="cell-note">${REGIONS[p.region]} · ${p.kind==='marketing'?'Marketing · all areas':'Economics / Business Economics'}</span><span class="tag">${eligibilityLabel(p)}</span><span class="cell-note">${records.some(r=>r.program_id===p.id)?`${records.filter(r=>r.program_id===p.id).length} named records across years`:'No named records collected'}</span></td>
      ${periods.map(period=>{const c=findAudit(catalog,p.id,period);return `<td><button type="button" class="audit-cell ${c.cohort_complete?'cohort_complete':c.status}" data-audit-program="${esc(p.id)}" data-audit-period="${period}" aria-label="${esc(p.school)} ${period} ${statusLabel(c,p)}"><strong>${c.listed_count===null?(c.record_ids.length?`${c.record_ids.length} / ?`:'Unverified'):`${c.record_ids.length} / ${c.listed_count}`}</strong><span>${statusLabel(c,p)}</span></button></td>`}).join('')}</tr>`).join('')}
    </tbody></table></div>${programs.length?'':'<p class="coverage-count">No matching programs. Adjust the scope or verification filters.</p>'}`;
}
export function coverageMarkup(catalog,records) {
  const params=new URLSearchParams(location.hash.split('?')[1]||'');for(const k of Object.keys(filters))filters[k]=params.get('cv_'+k)||({q:'',region:'all',kind:'all',scope:'target',progress:'all'})[k];
  const targets=new Set(scopeRows(catalog).map(p=>p.program_id));
  const marketing=catalog.programs.filter(p=>targets.has(p.id));
  const verified=marketing.filter(p=>p.eligibility==='verified');
  const withPeople=new Set(records.map(r=>r.program_id));
  const gaps=verified.filter(p=>!withPeople.has(p.id));
  const exceptions=marketing.filter(p=>p.eligibility!=='verified');
  const sourceCells=catalog.coverage.filter(c=>targets.has(c.program_id)&&c.status==='source_reconciled'&&auditPeriods(catalog).includes(c.period));
  return `<div class="coverage-summary">${['US','CA','HK','SG'].map(region=>`<article class="coverage-region"><span>${REGIONS[region]}</span><strong>${marketing.filter(p=>p.region===region).length}<small> target schools</small></strong><p>${verified.filter(p=>p.region===region).length} verified doctoral programs · ${marketing.filter(p=>p.region===region&&withPeople.has(p.id)).length} with named records</p></article>`).join('')}</div>
    <section class="panel scope-panel"><div class="panel-heading"><div><p class="eyebrow">A FIXED RESEARCH UNIVERSE</p><h2>North America 50 + Hong Kong 5 + Singapore 3</h2></div><a class="button secondary" href="data/scope.json" download>Download school scope</a></div>
    <div class="prose"><p>The North American scope uses the top 50 schools in the official ${sourceLink({url:catalog.scope.ranking.source_url,label:'UT Dallas journal research rankings'})} for <strong>${catalog.scope.ranking.start_year}–${catalog.scope.ranking.end_year}</strong>, selecting Journal of Consumer Research, Journal of Marketing, Journal of Marketing Research and Marketing Science. Frozen on ${catalog.scope.frozen_at}; this measures research output, not placement performance.</p><p>Hong Kong: HKU, CUHK, HKUST, CityU and PolyU. Singapore: NUS, NTU and SMU. Of ${marketing.length} target schools, ${verified.length} have verified doctoral-program evidence. ${sourceCells.length} source-year or job-market-cycle cells have been reconciled with the source roster. These are program and audit counts, not person-level coverage rates.</p>
    <details class="scope-gaps"><summary>${gaps.length} verified programs without named records · ${exceptions.length} eligibility exceptions</summary><p class="chart-note">Original source notes are preserved below. Eligibility exceptions remain in the fixed scope; they are not counted as zero graduates or replaced by other schools.</p><ul>${gaps.map(p=>`<li><strong>${esc(p.school)}</strong>: ${esc(p.notes)}</li>`).join('')}</ul><h3>Program eligibility exceptions</h3><ul>${exceptions.map(p=>`<li><strong>${esc(p.school)}</strong>: ${esc(p.notes)}</li>`).join('')}</ul></details></div></section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">PROGRAM × YEAR</p><h2>Roster verification by program</h2></div></div>
    <div class="prose"><p>All 58 target schools are shown by default, including unresolved cells. Choose “All discovered programs” for <a href="https://www.ama.org/phd-programs-in-marketing/" target="_blank" rel="noopener noreferrer">AMA directory</a> leads and the independently versioned Economics IO scope. Discovery, doctoral eligibility and annual IO-subset coverage are verified separately.</p><p>Each cell shows <strong>records collected / people listed in that source</strong>; “?” means the source denominator is unknown. <strong>Source roster reconciled</strong> does not establish a complete graduating cohort or complete outcomes. Source roster years can differ from first-job years; annual placement charts require an explicit first-job year.</p></div>
    <form id="coverage-filters" class="coverage-filters"><label class="filter-label">Search schools<input name="q" type="search" value="${esc(filters.q)}" placeholder="e.g. Harvard, Toronto"></label>
    <label class="filter-label">Program scope<select name="scope">${options([['target','58 target schools'],['all','All discovered programs'],['extension','Outside the fixed scope']],filters.scope)}</select></label>
    <label class="filter-label">Training region<select name="region">${options([['all','All regions'],...['US','CA','HK','SG'].map(r=>[r,REGIONS[r]])],filters.region)}</select></label>
    <label class="filter-label">Program type<select name="kind">${options([['all','All programs'],['marketing','Marketing · all areas'],['economics','Economics / Business Economics']],filters.kind)}</select></label>
    <label class="filter-label">Verification progress<select name="progress">${options([['all','All progress statuses'],['checked','Verification started'],['audited','Has a reconciled source roster'],['no_records','Verified program · no named records'],['unaudited','No reconciled source roster'],['pending','Doctoral program unverified'],['complete','Has a confirmed complete cohort roster']],filters.progress)}</select></label></form>
    <div id="coverage-results">${table(catalog,records)}</div></section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">CURRENT MARKET RELEASES</p><h2>Current-cycle source releases</h2></div></div><div class="release-grid">${(catalog.release_notes||[]).map(n=>`<article><h3>${esc(n.school)}</h3><details><summary>Original source notes</summary><p>${esc(n.note)}</p></details>${sourceLink({url:n.url,label:'Open official page'})}</article>`).join('')}</div><p class="chart-note">A published source is a verification lead; the matrix reports the roster checks actually completed.</p></section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">ANNUAL MAINTENANCE</p><h2>How this coverage is maintained</h2></div></div><div class="prose"><p>Collect full graduate or candidate rosters, then trace each person’s outcomes, retaining unknowns. Historical records, revisions, conflicts and verification dates remain available. Weekly source-change checks create review queues; verified facts are updated through reviewed data releases.</p><p>See the <a href="https://github.com/zyx-dirtystar/mkt-io-placement/blob/main/docs/ANNUAL-UPDATE.md" target="_blank" rel="noopener noreferrer">annual update guide</a>. Download <a href="data/records.json" download>person records</a>, the <a href="data/catalog.json" download>program and coverage catalog</a>, or a <a href="data/record-template.json" download>person-record template</a>. The data-quality page shows the latest completed maintenance checks.</p></div></section>`;
}
export function bindCoverage(catalog,records,openPerson) {
  const results=document.querySelector('#coverage-results');
  function bindCells() {
    results.querySelectorAll('[data-audit-program]').forEach(button=>button.onclick=()=>{
      const p=catalog.programs.find(p=>p.id===button.dataset.auditProgram);
      const c=findAudit(catalog,p.id,button.dataset.auditPeriod);
      let dialog=document.querySelector('#audit-dialog');
      if(!dialog){dialog=document.createElement('dialog');dialog.id='audit-dialog';dialog.setAttribute('aria-labelledby','audit-title');document.body.append(dialog);dialog.onclick=e=>{if(e.target===dialog)dialog.close()};}
      dialog.innerHTML=`<div class="dialog-inner"><div class="dialog-top"><p class="eyebrow">SOURCE RECONCILIATION</p><button class="close-button" aria-label="Close verification details">×</button></div><h2 id="audit-title">${esc(p.school)} · ${esc(c.period)}</h2><p class="muted">${statusLabel(c,p)} · ${p.kind==='marketing'?'Marketing':'Economics / Business Economics'}</p><p class="detail-note">Cohort roster completeness: ${c.cohort_complete?'confirmed':'unconfirmed'}. Last checked: ${c.checked_at||'Not started'}.</p><details><summary>Original source notes</summary><p class="detail-note">${esc(c.notes)}</p><p class="detail-note">${esc(p.notes)}</p></details>${c.record_ids.length?`<ul class="source-list">${c.record_ids.map(id=>{const r=records.find(r=>r.id===id);return `<li><button class="person-button" data-audit-person="${esc(id)}">${esc(r.name)}</button><span>First-job year: ${r.placement_year||'Unverified'} · ${esc(r.destination||'Outcome unverified')}</span></li>`}).join('')}</ul>`:'<p class="detail-note">No annual roster has been reconciled here. This does not establish a zero cohort size.</p>'}<h3>Roster and program sources</h3><ul class="source-list">${[...c.sources,...p.sources].filter((s,i,a)=>a.findIndex(x=>x.url===s.url)===i).map((s,i)=>`<li>${sourceLink({...s,label:`Source ${i+1}`})}${s.label?`<span class="cell-note">Original source title: ${esc(s.label)}</span>`:''}</li>`).join('')}</ul></div>`;
      dialog.querySelector('.close-button').onclick=()=>dialog.close();
      dialog.querySelectorAll('[data-audit-person]').forEach(b=>b.onclick=()=>{dialog.close();openPerson(b.dataset.auditPerson)});
      dialog.showModal();
    });
  }
  const form=document.querySelector('#coverage-filters');
  form.onsubmit=e=>e.preventDefault();
  form.oninput=e=>{filters[e.target.name]=e.target.value;const query=new URLSearchParams();for(const [k,v] of Object.entries(filters))query.set('cv_'+k,v);history.replaceState(null,'','#coverage?'+query);results.innerHTML=table(catalog,records);bindCells()};
  bindCells();
}
