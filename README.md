# mkt-io-placement · Market Observatory

Placement about mkt and IO PhD

[网站](https://zyx-dirtystar.github.io/mkt-io-placement/) · [源代码与数据](https://github.com/zyx-dirtystar/mkt-io-placement) · [发布状态](https://github.com/zyx-dirtystar/mkt-io-placement/actions)

Marketing 全方向（含 Quant、Consumer Behavior）× Economics / Industrial Organization 的个人就业市场观察网站。博士培养院校范围为美国、加拿大、香港、新加坡；去向覆盖全球。

这是带有来源的首批样本，**不是完整市场普查**。所有图表明确展示样本分母。未核验的记录和信息不能作为不存在或否定值。

当前版本 0.3.0：114 人（第二批新增 38 人），其中 CB 标签 27 人、当季候选人 14 人。第二批核验 Northwestern、Penn、Toronto、HKU、NTU；累计 28 个来源年份 / 求职季单元与指定官方表对齐。发现清单仍为 139 个 Marketing 项目线索，不能当作已覆盖项目。默认历史首职筛选显示 88 人；11 条首职或年份待核验记录可用新增筛选查看。另有 1 条首职年为 2022 的保留档案。详见 [第二批修订与缺口](docs/BATCH-2-2026-10-08.md)；[第一批记录](docs/BATCH-2026-10-08.md)继续保留。

## 使用与预览

在此目录执行 `node server.mjs`，打开 http://127.0.0.1:4173 。无需安装依赖。页面包括概览、可筛选名录、当前求职季、院校覆盖和统计口径。身份筛选只接受公开明确依据；不根据姓名、照片、语言或教育推断国籍或族裔。

详细操作见 [年度更新指南](docs/ANNUAL-UPDATE.md)，包含 GitHub 网页修改、数据字段和年份冲突处理。

## 每年更新

1. 编辑 `data/records.json`。人员使用稳定 id，一人一条记录，领域允许多标签。`dist/data/record-template.json` 提供新增条目模板。
2. 在 `config.json` 更新 `current_cycle`（例如 `2027-2028`）、默认最近四年 `history_years`（例如 `[2024,2025,2026,2027]`）、版本、发布日期和更新说明。旧记录保留；旧年份自动留在时间筛选里。
3. 新增项目写入 `data/programs.json`，逐项目年度核验记录写入 `data/coverage.json`，当季官方发布进度写入 `data/release-notes.json`。日期应来自来源，不因刷新自动更改个人 `checked_at`。
4. 执行 `node scripts/sync-data.mjs`，再执行 `node scripts/check.mjs` 和 `node --check dist/app.js`。
5. 在本地查看筛选和个人详情后发布。完成 GitHub Pages 设置后，将更新提交到 `main` 会自动检查并发布；现有 Sites 私有预览仍可单独维护。`dist` 是部署资产。历史源文件和发布版本可追溯。

## GitHub 部署与分阶段改进

[从零开始的 GitHub 操作说明](docs/GITHUB-START-HERE.md) 解释账号、仓库、公开范围、Pages 设置和更新方法。[改进计划](docs/ROADMAP.md) 将后续工作分为部署、覆盖清单、分批补数据和年度维护。

`.github/workflows/pages.yml` 自动生成数据、检查和部署。工作流在 `main` 更新时运行，也支持手动运行。Pages 只发布 `dist`，网站无需数据库或安装第三方依赖。最新发布结果见仓库 Actions。

已找到 placement 的当季候选人改为 `status: "placed"` 并补充首职资料，保留原来的 `market_cycle`，因此不会从当季名录消失。先博后后教职时，`destination/role/placement_year` 保留首职，后续岗位写入 `subsequent`。历史求职季不明则留空，毕业年不能自动当 placement 年。

`identity.chinese_national` 与 `identity.chinese_heritage` 的肯定值必须有独立来源。华裔字段须本人公开自述。未知值写 `unknown`，不能按姓名推断，也不能算作非中国人或非华裔。本科院校地区单独记录。

## 数据结构

`fields` 保留公开研究领域；`tracks` 为 `marketing`、`qm`、`cb`、`io`（可同时包含）；Marketing 细分方向未确认时只标 `marketing`。`program_id` 独立标记培养项目；`source_cohort_year`、`graduation_year` 与 `placement_year` 分开；`topics` 是公开领域/论文的整理标签；`methods` 仅采用明确证据。`sources` 包含 URL 与用途。Assistant Professor 没有明确 tenure 证据时使用 `job_kind: "faculty"`。

`status` 可为 `placed`、`on_market` 或 `outcome_unknown`（历史名册中首职仍未知或职业顺序未厘清者）；项目 / 年份归属仍需补证的线索放到 `review-queue.json`，不进入默认统计。已确认名册归属的人不会因为去向未知而被排除。年份未知但首职可核验者保留为 placed；可在“去向 / 首职年待核验”或“全部记录”中查看，不进入年度图。`source_reported_placement` 保留来源表所报的机构，供首职冲突审阅，不进入首职统计；其他已知任职和相关说明保留在 `subsequent` 与 `notes`。

`source-data/` 保存首版研究证据。`scripts/prepare-data.mjs` 是首版来源格式转换器；日常维护以 `data/records.json` 为准，**不要重新运行此转换器覆盖后续手动修订**。

## 本版限制

- 四地区均有记录，但收集程度不均，尚未逐校核验完整名单；不能估算全市场就业率。
- 身份肯定标签目前没有足够公开依据，均保留未知；本科教育对照已可使用。
- 一些首职岗位名称、任职地区或年份仍待补证；原始材料中的时间差异保留在个人备注。
- 没有设置自动抓取或定时更新；年度新增通过上述数据流程完成。

## 校验

`scripts/check.mjs` 校验唯一人员、来源、领域、日期和资产，并检查当前季已获岗位者仍保留、历史分母排除未知、身份未知不误分类、跨领域人数去重，以及跨年配置生效。

站点使用静态 HTML/CSS/JavaScript，无数据库、账户管理或分析追踪。GitHub 仓库与 Pages 网站公开；原 Sites 预览为所有者私有。
