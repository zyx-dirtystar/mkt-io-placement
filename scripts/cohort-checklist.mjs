import fs from 'node:fs';
const read=(f,fallback)=>fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):fallback;
const uniq=xs=>[...new Set(xs)];
export function buildCohortChecklist({plan,scope,programs,coverage,records,reviewLog=[]}) {
  const core=uniq([...scope.ranking.rows,...scope.asia].map(r=>r.program_id));
  const extensions=plan.extension_program_ids.filter(id=>!core.includes(id));
  const programIds=[...core,...extensions];
  const priority=new Map(plan.priority_program_ids.map((id,i)=>[id,i]));
  const rows=[];
  for(const program_id of programIds)for(const year of plan.history_years){
    const p=programs.find(p=>p.id===program_id);
    const c=coverage.find(c=>c.program_id===program_id&&c.period===String(year));
    const ids=c?.record_ids||[];
    const people=ids.map(id=>records.find(r=>r.id===id)).filter(Boolean);
    const full=!!(c?.cohort_complete&&c?.population&&c?.completeness_evidence?.length);
    const sourceMatched=full||c?.status==='source_reconciled';
    const annual=reviewLog.filter(r=>r.program_id===program_id&&(r.years||[]).includes(year));
    const issues=annual.flatMap(a=>(a.issues||[]).filter(i=>i.status!=='resolved').map(i=>({...i,reviewed_at:a.checked_at})));
    const labels={qm:[],cb:[],strategy:[],unclassified:[]};
    for(const r of people){const ts=(r.tracks||[]).filter(t=>['qm','cb','strategy'].includes(t));if(!ts.length)labels.unclassified.push(r.id);for(const t of ts)labels[t].push(r.id);}
    const unknownDestination=people.filter(r=>r.status!=='placed'||!r.destination).map(r=>r.id);
    const missingJobYear=people.filter(r=>!r.placement_year).map(r=>r.id);
    const missingGradYear=people.filter(r=>!r.graduation_year).map(r=>r.id);
    const stages={population:full?'defined':'open',independent_denominator:full?'matched':'unknown',named_roster:full?'complete':sourceMatched?'source_matched':ids.length?'partial':'not_collected',research_classification:!people.length?'unknown':labels.unclassified.length?'partial':'all_recorded_labelled',initial_destination:!people.length?'unknown':unknownDestination.length?'partial':'all_recorded_known',independent_dates:!people.length?'unknown':missingJobYear.length||missingGradYear.length?'partial':'all_recorded_dated'};
    const complete=full&&labels.unclassified.length===0&&unknownDestination.length===0&&missingJobYear.length===0&&missingGradYear.length===0&&!issues.length;
    let next_stage='complete',next_action='Defined population reconciled; retain sources and monitor changes.';
    if(p?.eligibility!=='verified'){next_stage='eligibility';next_action='Verify that this school offers the relevant doctorate; keep the school in the fixed scope.';}
    else if(issues.length){next_stage='conflict';next_action=issues[0].next_action||issues[0].detail;}
    else if(!full){next_stage='independent_denominator';next_action='Find an independent full named degree roster and define its exact population; reconcile all names, including unknown outcomes.';}
    else if(labels.unclassified.length){next_stage='research_classification';next_action='Verify primary research-field evidence for: '+people.filter(r=>labels.unclassified.includes(r.id)).map(r=>r.name).join(', ')+'.';}
    else if(unknownDestination.length){next_stage='initial_destination';next_action='Trace the initial outcome for: '+people.filter(r=>unknownDestination.includes(r.id)).map(r=>r.name).join(', ')+'; retain unknown until supported.';}
    else if(missingJobYear.length||missingGradYear.length){next_stage='independent_dates';next_action='Verify missing exact graduation / first-job years separately; never fill them from the source-list year.';}
    const latest=uniq([c?.checked_at,...annual.map(a=>a.checked_at)].filter(Boolean)).sort().at(-1)||null;
    rows.push({id:program_id+':'+year,program_id,school:p?.school||program_id,kind:p?.kind||'unknown',eligibility:p?.eligibility||'pending',scope:core.includes(program_id)?'core':'extension',priority:priority.has(program_id),year,population:c?.population||null,cohort_complete:full,work_complete:complete,stages,record_ids:ids,recorded_count:ids.length,source_listed_count:c?.listed_count??null,independent_count:full?c.population.independent_count:null,label_counts:Object.fromEntries(Object.entries(labels).map(([k,v])=>[k,v.length])),unclassified_ids:labels.unclassified,unknown_destination_ids:unknownDestination,missing_first_job_year_ids:missingJobYear,missing_graduation_year_ids:missingGradYear,source_matched:sourceMatched,reviewed_at:latest,annual_reviews:annual,issues,next_stage,next_action,source_urls:uniq([...(c?.sources||[]).map(s=>s.url),...annual.flatMap(a=>(a.sources||[]).map(s=>s.url))].filter(Boolean))});
  }
  rows.sort((a,b)=>(a.next_stage==='conflict'?0:1)-(b.next_stage==='conflict'?0:1)||(priority.get(a.program_id)??1000)-(priority.get(b.program_id)??1000)||programIds.indexOf(a.program_id)-programIds.indexOf(b.program_id)||b.year-a.year);
  // A completed research pass is not a completed cohort. Do not repeatedly research
  // the same blocked school while untouched school-years remain in the universe.
  const frontier=rows.filter(r=>!r.work_complete&&!r.annual_reviews.length);
  const revisits=rows.filter(r=>!r.work_complete&&r.annual_reviews.length);
  const task=(r,queue)=>({id:r.id,school:r.school,year:r.year,stage:r.next_stage,action:r.next_action,queue});
  return {schema_version:'1.0',plan_id:plan.id,generated_from:'Authoritative coverage, person records and append-only review log; labels are reported coverage, not automatically new field verification.',history_years:plan.history_years,current_cycle_separate:plan.current_cycle_separate,summary:{core_programs:core.length,core_cells:core.length*plan.history_years.length,extension_programs:extensions.length,extension_cells:extensions.length*plan.history_years.length,total_cells:rows.length,priority_cells:rows.filter(r=>r.priority).length,defined_rosters_complete:rows.filter(r=>r.cohort_complete).length,fully_resolved_cells:rows.filter(r=>r.work_complete).length,with_recorded_people:rows.filter(r=>r.recorded_count>0).length,without_recorded_people:rows.filter(r=>r.recorded_count===0).length,annual_source_reviews:rows.filter(r=>r.annual_reviews.length).length,unresolved_issues:rows.reduce((n,r)=>n+r.issues.length,0),first_pass_remaining:frontier.length,revisit_with_evidence_gap:revisits.length},rows,first_pass_queue:frontier.map(r=>task(r,'first_pass')),revisit_queue:revisits.map(r=>task(r,'revisit_when_new_evidence')),next_queue:[...frontier.map(r=>task(r,'first_pass')),...revisits.map(r=>task(r,'revisit_when_new_evidence'))]};
}
function csv(rows){const cols=['id','school','kind','scope','year','priority','recorded_count','source_listed_count','independent_count','cohort_complete','work_complete','next_stage','next_action','reviewed_at'];const cell=v=>{let text=String(v??'');if(/^[=+@\t\r-]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};return cols.join(',')+'\n'+rows.map(r=>cols.map(k=>cell(r[k])).join(',')).join('\n')+'\n';}
export function writeCohortChecklist(){
  const plan=read('data/cohort-research-plan.json',null);if(!plan)return null;
  const result=buildCohortChecklist({plan,scope:read('data/scope.json'),programs:read('data/programs.json'),coverage:read('data/coverage.json'),records:read('data/records.json'),reviewLog:read('data/cohort-review-log.json',[])});
  fs.mkdirSync('dist/data',{recursive:true});fs.mkdirSync('reports',{recursive:true});
  fs.writeFileSync('dist/data/cohort-checklist.json',JSON.stringify(result,null,2)+'\n');
  fs.writeFileSync('dist/data/cohort-checklist.csv','\ufeff'+csv(result.rows));
  const lines=['# 固定范围 cohort 核对清单','','自动由 data/scope.json、coverage.json、records.json、cohort-review-log.json 生成；不要手工勾选结果。','','范围：58 个固定 Marketing 项目 × 2023–2026 = 232 格；扩展项目另列 8 格。2026–27 求职季在网站 Current candidates / 覆盖矩阵单列。','','标签 Q/C/S/U 为已收录人物的 Quant / CB / Strategy / 未细分人数，可交叉，不是全市场分母。独立人数“?”表示未知；完整名单仅适用于其明确群体。','','| 项目 | 年 | 范围 | 来源名单匹配 | 独立人数 | 完整名单 | Q/C/S/U | 首职去向已知 | 首职年份已知 | 下一步 |','| --- | ---: | --- | --- | ---: | --- | --- | --- | --- | --- |'];
  for(const r of result.rows)lines.push(`| ${r.school}${r.priority?' ★':''} | ${r.year} | ${r.scope} | ${r.recorded_count}/${r.source_listed_count??'?'}${r.source_matched?' ✓':''} | ${r.independent_count??'?'} | ${r.cohort_complete?'✓ 定义内核全':'○ 待核全'} | ${r.recorded_count?['qm','cb','strategy','unclassified'].map(k=>r.label_counts[k]).join('/'):'?'} | ${r.recorded_count?`${r.recorded_count-r.unknown_destination_ids.length}/${r.recorded_count}`:'?'} | ${r.recorded_count?`${r.recorded_count-r.missing_first_job_year_ids.length}/${r.recorded_count}`:'?'} | ${r.next_action.replace(/\|/g,'/')} |`);
  fs.writeFileSync('reports/COHORT-CHECKLIST.md',lines.join('\n')+'\n');return result;
}
if(process.argv[1]?.replace(/\\/g,'/').endsWith('/cohort-checklist.mjs'))console.log(JSON.stringify(writeCohortChecklist()?.summary));
