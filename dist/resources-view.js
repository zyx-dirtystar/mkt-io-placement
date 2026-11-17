const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, title) => {
  try { if (!['https:', 'http:'].includes(new URL(url).protocol)) return esc(title); }
  catch { return esc(title); }
  return '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(title) + ' ↗</a>';
};
export const RESOURCE_TRACKS = {all:'All three Marketing tracks + IO',qm:'Quant / Modeling',cb:'Consumer Behavior',strategy:'Marketing Strategy',io:'Economics / IO'};
export const RESOURCE_TASKS = {all:'All questions',jobs:'Find job advertisements',candidates:'Find candidate rosters',placements:'Trace placements',benchmarks:'Understand market conditions',process:'Prepare / follow the process',projects:'Compare similar projects',scope:'Expand program coverage'};
export const RESOURCE_PUBLISHERS = {all:'All source types',society:'Academic society',university:'University',researcher:'Researcher project / analysis',platform:'Recruitment platform'};
const ACCESS = {read:'Content reviewed',limited:'Access / extraction limited',redirect:'Redirect verified',demo:'Demo listings — excluded'};

export function filterResources(resources, filters = {}) {
  const query = (filters.q || '').trim().toLocaleLowerCase();
  return resources.filter(r => (!filters.track || filters.track === 'all' || r.tracks.includes(filters.track))
    && (!filters.task || filters.task === 'all' || r.tasks.includes(filters.task))
    && (!filters.publisher || filters.publisher === 'all' || r.publisher_type === filters.publisher)
    && (!query || [r.title,r.publisher,r.region,r.edition,r.use,r.limit,r.takeaway,...(r.aliases || [])].join(' ').toLocaleLowerCase().includes(query)));
}

export function marketCoverageSnapshot(records, catalog, observatory) {
  const tags = r => [...new Set([...(r.tracks || []),...(r.research?.tracks || [])])];
  const marketing = records.filter(r => tags(r).includes('marketing'));
  return {
    placement_records: records.length,
    faculty_profiles: catalog.faculty?.people?.length || 0,
    current_candidates: records.filter(r => r.market_cycle === catalog.current_cycle).length,
    job_advertisements: observatory.jobs?.length || 0,
    complete_cohorts: (observatory.audit || []).filter(c => c.cohort_complete).length,
    marketing_records: marketing.length,
    marketing_unclassified: marketing.filter(r => !tags(r).some(t => ['qm','cb','strategy'].includes(t))).length,
    recorded_tracks: Object.fromEntries(['qm','cb','strategy','io'].map(t => [t,records.filter(r => tags(r).includes(t)).length]))
  };
}

function resourceCard(r) {
  return '<article class="resource-card"><div class="resource-meta"><span>' + esc(RESOURCE_PUBLISHERS[r.publisher_type]) + '</span><span class="resource-access ' + (r.access === 'demo' || r.access === 'limited' ? 'attention' : '') + '">' + esc(ACCESS[r.access]) + '</span></div>'
    + '<h3>' + link(r.url,r.title) + '</h3><p class="resource-edition">' + esc(r.edition) + '</p><p>' + esc(r.use) + '</p>'
    + '<details><summary>Scope, limitations & what to borrow</summary><dl><dt>Coverage</dt><dd>' + esc(r.region) + ' · ' + (r.market === 'economics' ? 'Economics complement to Marketing' : esc(r.market)) + '</dd>'
    + '<dt>Interpret with care</dt><dd>' + esc(r.limit) + '</dd><dt>Use in this project</dt><dd>' + esc(r.takeaway) + '</dd>'
    + '<dt>Reviewed / attempted</dt><dd>' + esc(r.checked_at) + ' · ' + esc(r.publisher) + '</dd></dl></details></article>';
}

function select(name, label, options, value) {
  return '<label class="filter-label">' + esc(label) + '<select name="' + name + '">' + Object.entries(options).map(([key,text]) => '<option value="' + key + '"' + (value === key ? ' selected' : '') + '>' + esc(text) + '</option>').join('') + '</select></label>';
}

export function resourcesMarkup({records,catalog,observatory}, state = {}) {
  const guide = catalog.market_resources;
  if (!guide) return '<h1>Market references</h1><p>The reference collection is unavailable in this data edition.</p>';
  const snapshot = marketCoverageSnapshot(records,catalog,observatory);
  const survey = guide.survey;
  const source = guide.resources.find(r => r.id === survey.resource_id);
  const trackRows = ['qm','cb','strategy'].map(t => '<tr><th scope="row">' + esc(RESOURCE_TRACKS[t]) + '</th><td>' + snapshot.recorded_tracks[t] + '</td><td><a href="#directory?period=all&track=' + t + '">Inspect recorded people →</a></td></tr>').join('');
  return '<div class="page-top"><div><p class="eyebrow">A RESEARCH DESK FOR MARKETING PHD CANDIDATES</p><h1>Market references<span class="title-dot">.</span></h1><p class="page-subtitle">Official sources and comparable projects, organized around the questions a job-market candidate needs to answer.</p></div><span class="outline-badge">References reviewed ' + esc(guide.reviewed_at) + '</span></div>'
    + '<section class="reference-start"><div><p class="eyebrow">QUANT / MODELING PRIORITY</p><h2>Follow both markets. Keep the evidence distinct.</h2><p>Start with Marketing advertisements and program rosters. Add Economics / IO channels for relevant crossover positions, then check the actual department and research requirements.</p><div class="reference-shortcuts"><a class="button" href="#resources?track=qm">Quant resources</a><a href="#resources?track=cb">Consumer Behavior</a><a href="#resources?track=strategy">Strategy</a></div></div><ol><li><strong>Demand</strong><span>AMA / ELMAR / AMS + EJM / JOE; verify the employer’s live call.</span></li><li><strong>Supply & outcomes</strong><span>Program-year rosters + first-placement pages + individual CVs.</span></li><li><strong>Context</strong><span>DocSIG survey benchmarks and dated faculty analyses.</span></li></ol></section>'
    + '<section class="reference-directory" aria-labelledby="reference-list-heading"><div class="section-intro"><div><p class="eyebrow">CHECK THE ORIGINAL</p><h2 id="reference-list-heading">Choose a question, then a source.</h2></div><p>Resource relevance helps discovery; it does not classify individual researchers. This is a reviewed starting map, not an exhaustive directory.</p></div>'
    + '<form class="filter-panel" id="reference-filters"><div class="reference-filters">' + select('track','Research area',RESOURCE_TRACKS,state.track || 'all') + select('task','Your question',RESOURCE_TASKS,state.task || 'all') + select('publisher','Source type',RESOURCE_PUBLISHERS,state.publisher || 'all') + '<label class="filter-label">Search references<input type="search" name="q" value="' + esc(state.q || '') + '" placeholder="Institution, source or keyword"></label></div></form>'
    + '<p id="reference-count" class="chart-note" role="status"></p><div id="reference-results" class="resource-grid"></div></section>'
    + '<section class="reference-evidence-grid"><article class="panel reference-panel"><p class="eyebrow">EXTERNAL SURVEY · ' + esc(survey.edition) + '</p><h2>Candidate experience benchmarks</h2><p>' + esc(survey.population) + ' Total respondents: <strong>' + survey.n_total + '</strong>.</p><div class="table-scroll"><table class="obs-table"><thead><tr><th scope="col">Measure</th><th scope="col">Mean</th><th scope="col">Respondents</th></tr></thead><tbody>'
    + survey.metrics.map(m => '<tr><th scope="row">' + esc(m.label) + '</th><td>' + m.mean + '</td><td>' + m.n + '</td></tr>').join('') + '</tbody></table></div><p>' + esc(survey.caution) + '</p><p>' + link(source.url,'DocSIG 2025, p. 10, Table 3') + '</p><p class="muted">Anonymous responses remain separate from named placements and this project’s denominators.</p></article>'
    + '<article class="panel reference-panel"><p class="eyebrow">THIS PROJECT · COVERAGE, NOT MARKET SHARES</p><h2>Where the sample still needs work</h2><div class="table-scroll"><table class="obs-table"><thead><tr><th scope="col">Recorded track</th><th scope="col">People</th><th scope="col">Evidence</th></tr></thead><tbody>' + trackRows + '<tr><th scope="row">Marketing area unclassified</th><td>' + snapshot.marketing_unclassified + '</td><td><a href="#directory?period=all&track=marketing_unclassified">Inspect gaps →</a></td></tr></tbody></table></div><p>Tags may overlap. Differences reflect collection and classification gaps, not the relative size of the three job markets.</p><p><strong>' + snapshot.complete_cohorts + ' complete cohorts</strong> confirmed; ' + snapshot.current_candidates + ' recorded candidates in ' + esc(catalog.current_cycle) + '. ' + snapshot.faculty_profiles.toLocaleString('en-US') + ' faculty profiles are a separate population.</p><p><a href="#coverage">Audit program-year coverage →</a></p></article></section>'
    + '<section class="panel reference-panel"><p class="eyebrow">WHAT TO BORROW · WHAT TO VERIFY</p><h2>A better basis for the next data expansion</h2><div class="reference-next"><article><h3>Quant: deepen both sides</h3><p>Reconcile candidate rosters and initial jobs for each program-year. Extend the sending-program frame to Europe and other missing regions. Keep empirical, analytical and methods evidence distinct; IO or machine learning alone does not establish a Quant Marketing identity.</p></article><article><h3>CB and Strategy: repair coverage</h3><p>Use the same roster standard for all three tracks. Strategy’s small recorded sample is a collection gap to investigate. Include industry and teaching destinations when the official roster supports them.</p></article><article><h3>Compare like with like</h3><p>Retain survey editions, common time windows, unknown outcomes and source-specific definitions. A current faculty directory or successful-placement list cannot supply a job-market success-rate denominator.</p></article></div></section>'
    + '<p class="footer-note">Reference review dates are separate from person-level evidence dates. ' + guide.resources.length + ' resources reviewed or attempted; no claim of a complete world market.</p>';
}

export function mountResources(root, ctx) {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const state = {track:params.get('track') || 'all',task:params.get('task') || 'all',publisher:params.get('publisher') || 'all',q:params.get('q') || ''};
  for (const [name,options] of Object.entries({track:RESOURCE_TRACKS,task:RESOURCE_TASKS,publisher:RESOURCE_PUBLISHERS})) if (!Object.hasOwn(options,state[name])) state[name] = 'all';
  root.innerHTML = resourcesMarkup(ctx,state);
  const form = root.querySelector('#reference-filters');
  if (!form) return;
  function renderResults() {
    const all = ctx.catalog.market_resources.resources;
    const selected = filterResources(all,state);
    root.querySelector('#reference-count').textContent = selected.length + ' of ' + all.length + ' references · access limitations and historical editions are labeled';
    root.querySelector('#reference-results').innerHTML = selected.length ? selected.map(resourceCard).join('') : '<p class="empty">No references match. Change the filters or clear the search.</p>';
    const query = new URLSearchParams();
    for (const [key,value] of Object.entries(state)) if (value && value !== 'all') query.set(key,value);
    history.replaceState(null,'','#resources' + (query.size ? '?' + query : ''));
  }
  form.addEventListener('submit',e => e.preventDefault());
  form.addEventListener('input',e => {if (Object.hasOwn(state,e.target.name)) {state[e.target.name] = e.target.value; renderResults();}});
  renderResults();
}
