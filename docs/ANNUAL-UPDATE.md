# 每年更新：先补名册，再补去向

网站：https://zyx-dirtystar.github.io/mkt-io-placement/

不需要重新建网站或重新设置 GitHub Pages。数据提交到 `main` 后，GitHub Actions 会检查并发布。官方网页内容变化不会自动进入网站；目前仍需人工核验。

## 先看懂五个文件

| 文件 | 用途 |
| --- | --- |
| `config.json` | 当前求职季、默认最近四年、版本与修订说明 |
| `data/scope.json` | 固定的北美 50 / 香港 5 / 新加坡 3 选校清单、排名年份与期刊 |
| `data/programs.json` | 目标博士项目发现清单；Marketing 与 Economics 分开 |
| `data/coverage.json` | 每个项目、每个来源名单年份的核验状态 |
| `data/records.json` | 每位研究者的首职、研究方向、背景、来源与后续任职 |

`dist/data` 是生成的网页数据，不要只改这里。旧 `data/schools.json` 保留兼容，覆盖矩阵以 `programs.json` 为准。

## 以后在 GitHub 上操作

1. 打开仓库，点击相应文件，再点铅笔按钮（Edit this file）。首次学习时建议只做一条有来源的更正。
2. 修改后点 **Commit changes**，写清更正内容，例如“补充某人的首职年份及 CV 来源”。在原仓库的 `main` 提交会触发自动发布。
3. 打开仓库 **Actions**。最新任务全部为绿色后，刷新网站，检查这位研究者的详情与来源。若失败，先点失败步骤看错误；上一版成功网站通常仍可访问，不必重新建仓库。

JSON 的文字使用英文双引号；项目之间保留逗号，最后一项后不能有多余逗号。修改前可以先复制原内容。GitHub 的文件 History 可以找回旧版本。一次涉及多个数据文件时，更适合在本地完成后一起提交，避免中间状态导致检查失败。

## 新一年的具体顺序

1. 在 `config.json` 将 `current_cycle` 改为例如 `2027-2028`，将 `history_years` 改为 `[2024, 2025, 2026, 2027]`。同时更新版本和真实修改日期；不要批量把所有人的核验日期改成今天。
2. 先沿用 `data/scope.json` 的固定 58 校，保证年度可比。如果决定换排名年份或更换学校，先将旧清单保存到 `data/scopes/旧版本id.json`，再给新清单独立 `id`；不能悄悄覆盖旧范围。在 `data/programs.json` 核实目标学校确有符合范围的博士项目。AMA 目录包含 PhD / DBA，只是发现线索。确认学位、培养校区与有效年份后再把 `eligibility` 从 `pending` 改成 `verified`，并补官方来源；当前目录未找到对应博士则为 `not_identified`，不据此写 0 毕业生。同步维护 `target_scope` 标记，使其与清单一致。
3. 优先找完整候选人或毕业生名单。Marketing 全方向纳入；Economics 按公开研究资料识别 IO 或相关 Quant Marketing。暂时未知去向的人也入库，不只收成功就职者。
4. 每人沿用稳定 `id`，更新或新增记录，不能因换工作重复建人。新记录可参考网站下载的 `record-template.json`。
5. 在 `data/coverage.json` 为新年份增加对应单元。没有核验记录的新年份会自动显示“未开始”，旧核验单元和旧人员继续保留。
6. 本地运行下列检查，再提交；GitHub 发布时会再运行同样的数据检查。

```sh
node scripts/sync-data.mjs
node scripts/check.mjs
node --check dist/app.js
node --check dist/coverage-view.js
node server.mjs
```

最后一条开启本地预览：http://127.0.0.1:4173 。核对名录、覆盖矩阵和个人详情后，用 Ctrl+C 结束预览。

## 容易混淆的字段

- `program_id`：培养项目；即使同校，也要分开 Marketing 与 Economics。研究方向标签不决定培养项目。
- `tracks`：`marketing` 为 Marketing 大类，`qm` 为 Quant，`cb` 为 Consumer Behavior，`strategy` 为 Marketing Strategy，`io` 为 IO，可交叉。Marketing 子方向未确定时只填 `marketing`，不排除该人员。方向必须有公开依据。
- `source_cohort_year`：来源表列出的年份，不自动等同毕业年、入职年或求职季。
- `source_cohort_label`（可选）：保留原始学年标签，例如 `2022–2023`；矩阵按末年展示，但不推断精确毕业年。
- `graduation_year`：只有明确毕业资料时填写。
- `placement_year`：核验后的首职年份。若来源冲突尚未解决，保留 `null` 并写备注；仍可在“全部记录”与对应来源名单里看到。
- `market_cycle`：例如 `2026-2027`，只有明确本季求职依据时填写。毕业年不能自动转换为求职季。
- `status`：已知首职用 `placed`；有明确求职季的求职者用 `on_market`；历史名册中首职仍未知或职业顺序未厘清者用 `outcome_unknown`，雇主与首职年留空。已有工作但无法确认哪段算首职，也可以用这个待核验状态；不代表未就业。
- `source_reported_placement`（可选）：来源表列出的机构，但尚不能确认为真正初始岗位时保留在这里。它会在个人详情与导出中展示，不进入首职统计。
- `subsequent`：后续工作。先博士后、后教职，不能把后来的教职改写为首职。
- `job_kind`：保留原始资料类别（如 `faculty` / `postdoc` / `industry`）；前端另按职位文字计算统计分类。普通 Assistant Professor 计终身轨口径，教学/Visiting/Clinical/Adjunct 优先归非终身轨；Lecturer 按国家处理。详细规则见下方。
- `identity`：未知继续 `unknown`，不能根据姓名或本科院校猜国籍、华裔身份。本科地区单独记。

## 如何写核验矩阵

一个单元由 `program_id` 与 `period` 唯一确定。`period` 是字符串年份或求职季；记录 `status`、`listed_count`、`record_ids`、`year_basis`、`sources`、`checked_at`、`notes` 与 `cohort_complete`。

| 状态 | 可以表达什么 |
| --- | --- |
| `not_started` | 还未核对该项目该年完整名册；`listed_count: null` |
| `partial` | 已找到名册，逐人核验尚未完成 |
| `source_reconciled` | 此来源表所列人员全部录入，`record_ids` 数量等于 `listed_count` |
| `insufficient` | 查过资料，但该年名单仍不足；不能据此填 0 |

`cohort_complete: false` 是目前所有单元的状态。仅把 placement 成功案例表录完，不能改成整届完整。需要独立的候选人/毕业生名册与人员范围交叉核对，明确缺失去向者也包含在内，才能确认整届分母。Marketing 整届与 Economics 的 IO 子集口径要写清。

UBC 本批是一个例子：官方来源表把 Zining Wang 列在 2023，但 BC 官方 CV 明确 2024 年开始任职。因此其覆盖单元留在 2023，首职图计入 2024。不要为了让两个表人数一致而改掉实际日期。

第二批的 Yu Zhao、Mohsen Foroughifar 是尚未解决的例子：来源表所报机构、毕业年和个人履历不能直接拼成首职。人员照常录入，首职保留未知，其他经历与冲突原因写清。名录的“去向 / 首职年待核验”筛选可以集中找到这些记录。只有匿名去向机构的表不能作为人员分母；核验格显示“已录入 / ?”。

## 本版如何看名单

默认“近四年名录”纳入来源名单年、毕业年或首职年落在最近四年的非当季人员，包含首职未知者；它不是按同一毕业届统计。选“已知首职年”才是严格的首职年份样本。2026–27 的当季人员独立查看；不要把预计 2027 毕业的所有在读学生直接归为求职者。

“院校范围 → 目标 58 校 · Marketing”按博士培养项目筛选；在这 58 所学校任教、但在其他地方读博的人不因此进入目标样本。范围外和 Economics IO 记录留在“全部档案 / 扩展档案”。

多份来源核对同一院校年度时，要合并人员 ID，不能用最后查到的一人覆盖先前名册。若来源只是选录，或两表不一致，仍保留 `cohort_complete: false`。本轮全部学校进度与待补项见 [58 校记录](SCOPE-58-2026-10-08.md)。


## 0.5.0：CV、研究资料与最终求职安排

先核对学校、博士年份和研究方向以排除同名者，再读取本人 CV 的 Education 与 Appointments。毕业年、求职季、首职年分别填；当前主页的职称不能直接当作毕业时职称。导师 CV 可支持 placement，但不能放入候选人的 `cv_url`。

- `homepage`：已经查看并确认属于本人的个人学术主页。
- `cv_url`：本人 CV / Vita；记录链接不保证文件未来永远可访问。
- `jmp`、`jmp_url`、`jmp_evidence`：明确标为 Job Market Paper 的题目、资料链接、依据。不要把第一篇工作论文、招聘报告或博士论文自动当作 JMP。
- `final_placement`：该次求职已确认的最终安排。含 `destination`、`role`、`destination_region`、`year`、`job_kind`、`status`、`evidence`、`sources`（URL 数组）。所有 URL 也应在记录的 `sources` 中。未来已宣布岗位填 `status: "announced_future"`；已任职填 `placed`。
- `subsequent`：普通后续任职，不自动转成最终 placement。原字段 `destination/role/placement_year` 始终保存首职。
- `deferred`：仅明确下一季重上求职市场者使用；职位次年开始不是延期。
- `origin_rank`：同步脚本根据固定选校快照生成，不手填。北美 Marketing 排名不套用到 Economics 项目、香港或新加坡学校。

教职率分母仅含教职、非终身轨、博后、业界及其他；延期、未知和仍在求职者排除。美国/加拿大 Lecturer 归非终身轨，英国/澳大利亚/新西兰 Lecturer 归教职；其他地区需补依据。岗位性质未知的大学去向仍显示机构，但不强行计入教职率分母。校区按实际所在地归类，四个指定大陆分校均归中国大陆。

发布前执行 `node scripts/sync-data.mjs`、`node scripts/check.mjs`、`node scripts/check-placement.mjs`、`node --check dist/app.js`。实际打开网站检查首次/最终切换、排名、个人资料和 CSV。姓名不同写法通过 `aliases` 合并；同步修正 coverage 的 record_ids，不能重复计人。

## 0.6.0：暂定研究方向与区域公开证据

- 新的内容推断放在 research_inference，结构为 {status: "provisional", tracks: ["qm"], reason: "具体研究内容支持的理由", source_urls: ["https://..."], checked_at: "YYYY-MM-DD"}。默认不修改 tracks；取得明确方向后移入 tracks，删除或记录已被替代的暂定标签，保留变更历史。
- 有明确自述或院校子方向标签时可补 research_classification: {status: "explicit", source_urls: [...], checked_at: "..."}。不要批量把旧标签升级为 explicit。
- regional_signals 是数组，每条含 kind（explicit_interest / recruiting_event / academic_exchange）、region（CN / HK）、institution、observed_date（实际来源可支持的年 / 月 / 日）、event_status（announced / reported）、source_url、evidence、checked_at。需要具体证据，所有 source_url 也加入 sources。公告不证明出席，一般讲座不证明应聘。
- 每年保留过去活动日期，不把历史表述自动改成新季意愿。姓名、语言、合作网络、教育地区都不参与意向或身份推断。
- 发布前额外运行 node scripts/check-evidence.mjs，验证情景和暂定字段不改写事实。
