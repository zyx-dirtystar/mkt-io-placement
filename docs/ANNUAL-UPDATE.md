# 每年更新：先补名册，再补去向

网站：https://zyx-dirtystar.github.io/mkt-io-placement/

不需要重新建网站或重新设置 GitHub Pages。数据提交到 `main` 后，GitHub Actions 会检查并发布。官方网页内容变化不会自动进入网站；目前仍需人工核验。

## 先看懂四个文件

| 文件 | 用途 |
| --- | --- |
| `config.json` | 当前求职季、默认最近四年、版本与修订说明 |
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
2. 在 `data/programs.json` 核实目标学校确有符合范围的博士项目。AMA 目录包含 PhD / DBA，只是发现线索。确认学位、培养校区与有效年份后再把 `eligibility` 从 `pending` 改成 `verified`，并补官方来源。
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
- `tracks`：`marketing` 为 Marketing 大类，`qm` 为 Quant，`cb` 为 Consumer Behavior，`io` 为 IO，可交叉。Marketing 子方向未确定时只填 `marketing`，不排除该人员。方向必须有公开依据。
- `source_cohort_year`：来源表列出的年份，不自动等同毕业年、入职年或求职季。
- `graduation_year`：只有明确毕业资料时填写。
- `placement_year`：核验后的首职年份。若来源冲突尚未解决，保留 `null` 并写备注；仍可在“全部记录”与对应来源名单里看到。
- `market_cycle`：例如 `2026-2027`，只有明确本季求职依据时填写。毕业年不能自动转换为求职季。
- `status`：已知首职用 `placed`；有明确求职季的求职者用 `on_market`；历史名册中首职仍未知或职业顺序未厘清者用 `outcome_unknown`，雇主与首职年留空。已有工作但无法确认哪段算首职，也可以用这个待核验状态；不代表未就业。
- `source_reported_placement`（可选）：来源表列出的机构，但尚不能确认为真正初始岗位时保留在这里。它会在个人详情与导出中展示，不进入首职统计。
- `subsequent`：后续工作。先博士后、后教职，不能把后来的教职改写为首职。
- `job_kind`：普通 Assistant Professor 用 `faculty`，只有明确终身轨依据才用 `tt`；visiting/adjunct 用 `non_tt`，博士后用 `postdoc`，企业岗位用 `industry`。
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
