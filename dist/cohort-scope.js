// A complete publication cohort cannot supply a denominator for another time axis.
export function cohortMatchesTime(cell, person, {yearBasis='source', year='all', period}={}) {
  if (cell.program_id !== person.program_id || !cell.record_ids?.includes(person.id)) return false;
  let basis = yearBasis;
  if (basis === 'archive') basis = period === 'current' ? 'market'
    : period === 'history' || /^20\d{2}$/.test(period || '') ? 'placement' : 'source';
  const allowed = {
    market: ['explicit_market_cycle', 'market_cycle', 'market'],
    graduation: ['graduation_year', 'graduation'],
    placement: ['placement_year', 'placement', 'first_job_year']
  };
  if (allowed[basis] && !allowed[basis].includes(cell.year_basis)) return false;
  if (basis === 'source' && cell.year_basis && !['source_table_year', 'degree_completion_window', 'graduating_class'].includes(cell.year_basis)) return false;
  const value = basis === 'graduation' ? person.graduation_year : basis === 'market' ? person.market_cycle
    : basis === 'placement' ? person.placement_year : person.source_cohort_year;
  if (value == null || String(cell.period) !== String(value)) return false;
  return !year || year === 'all' || String(value) === String(year)
    || basis === 'market' && String(value).split('-')[0] === String(year);
}

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function cohortEvidenceMarkup(cell) {
  const p = cell.population;
  if (!p && !cell.completeness_evidence?.length) return '';
  const evidence = (cell.completeness_evidence || []).map(s => {
    const title = s.label || 'Independent roster evidence';
    const link = /^https?:\/\//.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>` : esc(title);
    return `<li>${link}${s.page != null ? `<span class="cell-note">Page ${esc(s.page)}${s.page_basis ? ' · '+esc(s.page_basis) : ''}</span>` : ''}<p>${esc(s.quote)}</p></li>`;
  }).join('');
  return `<section class="cohort-evidence"><h3>Defined cohort population</h3><p>${esc(p?.label || 'See source evidence')}</p>${p ? `<p class="detail-note">Independent population count: <strong>${esc(p.independent_count)}</strong> · Records matched: ${cell.record_ids.length}${p.parent_class_count ? ' · Whole-school class: '+esc(p.parent_class_count) : ''}</p><p class="detail-note">${esc(p.scope_note)}</p>` : ''}<p class="detail-note">Roster completeness confirms names within this population. First-job dates, subfield labels and outcomes are verified separately. A complete Marketing roster does not guarantee a complete Quant, CB or Strategy subset when members remain unclassified. Use the source roster year to select this cohort.</p><ul class="source-list">${evidence}</ul></section>`;
}

export function countReconciliationMarkup(cell) {
  const r=cell.count_reconciliation;if(!r)return '';
  return `<section class="cohort-evidence"><h3>Count discrepancy · ${esc(r.status)}</h3><div class="table-scroll"><table><thead><tr><th>Source population</th><th>Count</th><th>Published / modified</th></tr></thead><tbody>${r.sources.map(s=>`<tr><td><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a><span class="cell-note">${esc(s.population_label)}</span></td><td>${s.count}</td><td>${esc(s.date)}</td></tr>`).join('')}</tbody></table></div><p>${esc(r.explained)}</p><p><strong>Still unresolved:</strong> ${esc(r.unresolved)}</p><details><summary>Review all named differences and identity rules</summary><ul>${r.names.map(n=>`<li>${esc(n.name_raw)} · ${esc(n.field)}${n.field_evidence_level==='self_reported_primary'?' (author self-report)':''} · ${n.in_placement_table?'placement row present':'no placement row found'}${n.identity_status==='provisional'?' · provisional identity mapping':''}</li>`).join('')}</ul><p>${esc(r.identity_note)}</p></details><p class="detail-note">Three named Marketing placements are verified. The unresolved whole-school count does not establish a complete Marketing or Quant cohort.</p></section>`;
}
