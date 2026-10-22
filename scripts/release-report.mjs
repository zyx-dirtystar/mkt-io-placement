import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync('dist/data/observatory.json','utf8'));
const m=d.quality.metrics,b=d.release.baseline,change=d.release.changes;
const label={people:'Placement 人员',marketing:'Marketing 人员',io:'IO 人员（可交叉）',complete_cohorts:'完整 cohort',source_reconciled:'来源表对齐单元',research_missing:'Marketing 方向待细分',outcome_missing:'首职路径待核验',year_missing:'首职年份待核验',cv:'CV 链接',jmp:'明确 JMP'};
const rows=Object.entries(label).map(([k,v])=>`| ${v} | ${b.counts[k]??'—'} | ${m[k]??'—'} | ${change[k]>0?'+':''}${change[k]??'—'} |`);
const text=[`# 数据更新报告 · ${d.as_of}`,'',`比较基线：${b.commit||'未提供'}（${b.as_of||'日期未知'}）。人数由本次构建直接计算。`,'','| 指标 | 基线 | 当前 | 变化 |','| --- | ---: | ---: | ---: |',...rows,'',`新增人员 ${d.release.added_ids.length}；修订人员 ${d.release.revised_ids.length}；职业事件 ${d.events.length}；字段证据 ${d.claims.length}（其中原文确认 ${m.confirmed_claims}、历史来源关联 ${m.legacy_claims}）。`,'',`招聘广告 ${d.jobs.length} 条；待核验队列 ${d.queue.length} 项。招聘广告数不是实际岗位数，链接数不等于逐份资料已经读完。`,'',`来源检查：${d.quality.source_checks.checked} 个 URL 有检查记录，${d.quality.source_checks.changed} 个标记变化，${d.quality.source_checks.unavailable} 个最近不可用。`,'','完整性不足或去向未知不代表没有毕业生或没有就业；来源表对齐不证明整届完整。',''];
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/UPDATE.md',text.join('\n'));console.log('Generated reports/UPDATE.md');
