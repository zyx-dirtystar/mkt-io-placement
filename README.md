# mkt-io-placement · Market Observatory

Placement about mkt and IO PhD

[网站](https://zyx-dirtystar.github.io/mkt-io-placement/) · [源代码与数据](https://github.com/zyx-dirtystar/mkt-io-placement) · [发布状态](https://github.com/zyx-dirtystar/mkt-io-placement/actions)

Marketing 全方向（含 Quant、Consumer Behavior）× Economics / Industrial Organization 的个人就业市场观察网站。博士培养院校范围为美国、加拿大、香港、新加坡；去向覆盖全球。

这是持续扩充、带有来源的样本，**不是完整市场普查**。所有图表明确展示样本分母。未核验的记录和信息不能作为不存在或否定值。

当前版本 **0.6.0：295 人**。本轮为 5 人补上明确细分方向，2 人补上首职年份，另外 2 人保存独立的暂定研究分类。Marketing 269 人、CB 46 人；默认近四年名录 279 人，严格首职年筛选 144 人。仍有 **163 人方向待细分**（其中 2 人有暂定标签）；**136 条首职或年份待核验**由 21 条首职 / 路径未知和 115 条已有首职但年份待核验组成。102 条初始岗位类别仍待核验，与上述缺口可能重叠。已有 51 个个人主页、60 个 CV 链接和 40 个 JMP 标题。

目标范围固定为 **北美 Marketing 研究前 50、港五、新加坡三所**。依据 UTD 四本 Marketing 期刊的 2021–2025 北美研究产出结果，含美国 46 所、加拿大 4 所、香港 5 所、新加坡 3 所。58 所中 53 所找到对应博士项目资料，47 所已有实名记录（263 人）；其余记录保留在扩展档案。研究排名不代表就业质量或一定开设博士项目。107 个来源年份 / 求职季单元与所查表对齐，**所有整届完整性标记仍为未确认**。

中国地区观察、暂定分类和情景分析详见 [0.6.0 修订记录](docs/REGIONAL-EVIDENCE-2026-10-08.md)。上一轮 CV、JMP、岗位分类与排名功能详见 [0.5.0 修订记录](docs/CV-AND-OUTCOMES-2026-10-08.md)。选校依据、全部 58 校进度与缺口见 [本轮修订记录](docs/SCOPE-58-2026-10-08.md)。[第二批](docs/BATCH-2-2026-10-08.md)和[第一批](docs/BATCH-2026-10-08.md)记录继续保留。网站覆盖页默认显示全部目标学校，缺资料的学校不会被隐藏。

## 使用与预览

在此目录执行 `node server.mjs`，打开 http://127.0.0.1:4173 。无需安装依赖。页面包括概览、可筛选名录、当前求职季、中国地区观察、院校覆盖和统计口径。身份筛选只接受公开明确依据；不根据姓名、照片、语言或教育推断国籍或族裔。

详细操作见 [年度更新指南](docs/ANNUAL-UPDATE.md)，包含 GitHub 网页修改、数据字段和年份冲突处理。

## 每年更新

1. 编辑 `data/records.json`。人员使用稳定 id，一人一条记录，领域允许多标签。`dist/data/record-template.json` 提供新增条目模板。
2. 在 `config.json` 更新 `current_cycle`（例如 `2027-2028`）、默认最近四年 `history_years`（例如 `[2024,2025,2026,2027]`）、版本、发布日期和更新说明。旧记录保留；旧年份自动留在时间筛选里。
3. 当前选校清单在 `data/scope.json`；跨年可沿用，不要随排名刷新静默改变历史范围。需改范围时先保留旧清单快照，再创建新版本。新增项目写入 `data/programs.json`，逐项目年度核验记录写入 `data/coverage.json`，当季官方发布进度写入 `data/release-notes.json`。日期应来自来源，不因刷新自动更改个人 `checked_at`。
4. 执行 `node scripts/sync-data.mjs`，再执行 `node scripts/check.mjs`、`node scripts/check-placement.mjs`、`node scripts/check-evidence.mjs` 和 `node --check dist/app.js`。
5. 在本地查看筛选和个人详情后发布。完成 GitHub Pages 设置后，将更新提交到 `main` 会自动检查并发布。`dist` 是部署资产。历史源文件和发布版本可追溯。

## GitHub 部署与分阶段改进

[从零开始的 GitHub 操作说明](docs/GITHUB-START-HERE.md) 解释账号、仓库、公开范围、Pages 设置和更新方法。[改进计划](docs/ROADMAP.md) 将后续工作分为部署、覆盖清单、分批补数据和年度维护。

`.github/workflows/pages.yml` 自动生成数据、检查和部署。工作流在 `main` 更新时运行，也支持手动运行。Pages 只发布 `dist`，网站无需数据库或安装第三方依赖。最新发布结果见仓库 Actions。

已找到 placement 的当季候选人改为 `status: "placed"` 并补充首职资料，保留原来的 `market_cycle`，因此不会从当季名录消失。先博后后教职时，`destination/role/placement_year` 保留首职，后续岗位写入 `subsequent`；有明确证据属于该次求职最终安排时另填 `final_placement`。默认统计最终安排，也可切换首次岗位。历史求职季不明则留空，毕业年不能自动当 placement 年。

`identity.chinese_national` 与 `identity.chinese_heritage` 的肯定值必须有独立来源。华裔字段须本人公开自述。未知值写 `unknown`，不能按姓名推断，也不能算作非中国人或非华裔。本科院校地区单独记录。

## 数据结构

`fields` 保留公开研究领域；`tracks` 为 `marketing`、`qm`、`cb`、`strategy`、`io`（可同时包含）；Marketing 细分方向未确认时只标 `marketing`。`program_id` 独立标记培养项目；`source_cohort_year`、`graduation_year` 与 `placement_year` 分开；`topics` 是公开领域/论文的整理标签；`methods` 仅采用明确证据。`sources` 包含 URL 与用途。`job_kind` 保留原始资料类别；展示与教职率按 `dist/placement.js` 的职位文字规则计算：一般 Assistant Professor 纳入终身轨统计口径，但教学、Visiting、Clinical、Adjunct 等例外优先识别。这不等于逐份核实雇佣合同。

`status` 可为 `placed`、`on_market` 、`deferred`（明确次年重上市场）或 `outcome_unknown`（历史名册中首职仍未知或职业顺序未厘清者）；项目 / 年份归属仍需补证的线索放到 `review-queue.json`，不进入默认统计。已确认名册归属的人不会因为去向未知而被排除。年份未知但首职可核验者保留为 placed；可在“去向 / 首职年待核验”或“全部记录”中查看，不进入年度图。`source_reported_placement` 保留来源表所报的机构，供首职冲突审阅，不进入首职统计；其他已知任职和相关说明保留在 `subsequent` 与 `notes`。

`source-data/` 保存首版研究证据。`scripts/prepare-data.mjs` 是首版来源格式转换器；日常维护以 `data/records.json` 为准，**不要重新运行此转换器覆盖后续手动修订**。

## 本版限制

- 四地区均有记录，但收集程度不均，尚未逐校核验完整名单；不能估算全市场就业率。
- 身份肯定标签目前没有足够公开依据，均保留未知；本科教育对照已可使用。
- 一些首职岗位名称、任职地区或年份仍待补证；原始材料中的时间差异保留在个人备注。
- 没有设置自动抓取或定时更新；年度新增通过上述数据流程完成。

## 校验

`scripts/check.mjs` 校验唯一人员、来源、领域、日期和资产，并检查当前季已获岗位者仍保留、历史分母排除未知、身份未知不误分类、跨领域人数去重，以及跨年配置生效。

站点使用静态 HTML/CSS/JavaScript，无数据库、账户管理或分析追踪。GitHub 仓库与 Pages 网站公开。

## 地区观察与估计

中国地区观察按去向机构所在地筛选，分别查看大陆、香港或合计。现有样本含大陆去向 15 人（其中终身轨口径教职 12 人）、香港去向 14 人（其中教职 10 人）。它们是已收录的历史结果，不是当前候选人或申请者总数。普通讲座 / 会议以独立记录显示，不转换为招聘意向。

`research_inference` 保存暂定方向、理由、来源与日期；默认不加入该子方向，可通过“研究方向口径”开关纳入。`regional_signals` 保存明确意向、招聘活动或一般交流，含时间、学校、地区、原始来源与证据说明。两者详情都可追溯，导出 CSV 也区分归档分类和暂定分类。

概览的情景滑块改变“未知去向中有多少比例是教职”的假设，不替任何人填写岗位、年份或地域意向。极端情景范围不是置信区间，不能代表未收录人群。数据仍需继续核验；估计不会把未完成的普查变成完整资料。
