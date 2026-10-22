# Market Observatory · Marketing / Economics IO

[在线网站](https://zyx-dirtystar.github.io/mkt-io-placement/) · [数据质量](https://zyx-dirtystar.github.io/mkt-io-placement/#quality) · [项目对比](https://zyx-dirtystar.github.io/mkt-io-placement/#compare) · [招聘市场](https://zyx-dirtystar.github.io/mkt-io-placement/#jobs)

版本 1.0.0，观察截至 2026-10-22。基于公开证据的持续收集样本，名单完整性与去向核验程度分别记录。当前人数、完整 cohort 数、缺失和新增修订均由实际数据生成，见网站数据质量页和 `dist/data/quality-report.json`。

## 网站功能

- 概览、人员名录、当季求职、中国地区观察、独立教师档案、项目年度覆盖矩阵与统计说明。
- 来源名单年、毕业年、求职季、首职年独立筛选；支持完整名册及 tenure 证据状态筛选。
- 2—5 项目比较：同一时间和方向口径，报告样本、未知、最终安排及首职回退。
- 培养项目 → 研究方向 → 接收机构 / 院系流向图及可核对的人员明细表。
- 职业事件时间线、字段级来源、证据状态、原文与冲突；普通工作论文不自动标作 JMP。
- 公开招聘公告筛选及去重，招聘人数未公布时为未知，过期与当前岗位分开。
- 数据质量、历史基线变化、来源新鲜度、冲突与待核验队列。
- URL 保存筛选、个人固定链接、CSV / JSON 导出，导出保留口径和证据引用。
- 教师反查默认展示院校进度：五地区范围、逐校状态、核验详情、最近核验和资料缺口；可切换教师档案，分享当前筛选并导出院校进度。

## 本地运行与验证

需要 Node.js 22 或更新版本。网站与数据构建无需第三方依赖。

```sh
node scripts/sync-data.mjs
node scripts/check.mjs
node scripts/check-placement.mjs
node scripts/check-evidence.mjs
node scripts/check-faculty.mjs
node --test
node server.mjs
```

打开 http://127.0.0.1:4173 。`dist/` 是发布目录，`data/` 是权威维护输入。新增的统一观察库、质量报告和发布报告 JSON 在本地及 CI 构建时生成，不重复提交生成文件。不要直接修改生成的 `dist/data/`；不要重跑首版 `prepare-data.mjs` 覆盖后续研究。

新增模型与维护命令、批次格式见 [维护指南](docs/MAINTENANCE.md)；本轮实际研究及限制见 [研究记录](docs/RESEARCH-2026-10-22.md)。早期研究批次和年度指南保留供追溯；其中日期标注的统计属于历史快照。

## 数据与证据

`data/records.json` 保留稳定人员 ID 与旧字段；`programs.json`、`coverage.json`、`faculty.json` 分别维护培养项目、名单年度和接收院校档案。`taxonomy.json` 提供标准标签和同义词；`io-scope.json` 独立定义 Economics IO 范围；`jobs.json` 保存真实招聘公告。研究复核、原始批次和排名清单都保留版本。

`sync-data.mjs` 同时生成兼容旧版的 records/catalog 与统一的 `observatory.json`：people、institutions、events、claims、taxonomy、jobs、audit、quality、release、queue。旧来源关联标作 `legacy_reference`，不自动升级成带原文的已核验证据。原始研究标签仍在 raw 中，标准化不等于新增事实核验。

Marketing 选校沿用固定的 UTD 四刊 2021—2025 北美 50、香港 5、新加坡 3。研究排名不代表就业质量或一定设有博士项目。Economics IO 使用独立发现范围；两个范围都有尚未完成核验的项目。

## 统计解释

“来源表已对齐”仅表示该表列出的人已录入。整届名单完整须有明确覆盖证据；录完成功 placement 案例不能证明整届完整。去向未知者保留在名册中，未查到不能自动填 0。

来源名单年、毕业年、求职季、首职年、最终安排开始年、后续转职分别保存。近四年档案可包含多种年份线索，项目对比须选择统一时间轴。已确认同次求职最终安排与首职回退分别计数，普通后续跳槽不改写原 placement。

学术岗位类型、原始职称、tenure 状态和证据等级独立。常规 Assistant Professor 只能支持职称规则下的学术教职类别，tenure 未经明确核实保持未知。旧分类键 tt 为兼容保留，界面标明含规则推定。已知样本中的岗位占比不代表全市场就业率、个人成功概率或因果效果。

一年 / 三年观察窗口必须满足观察时间、日期精度及任职连续性的证据要求，无法确定则单列。历史首职没有结束日期不等于一直在职。情景滑块只改变已收录未知样本的假设，不给个人填写猜测结果。

国籍、族裔与本科教育地区相互独立，姓名、照片、语言不用于推断身份或地区求职意向。

## 更新与发布

核对公开来源后修改 `data/`，运行生成与校验，再提交。定时来源检查只输出变化、失败和待核验资料，不自动修改人员事实。批次导入具备重复、过期和前置值冲突保护；确需修正旧事实时使用新批次并注明证据。

GitHub Actions 在推送 main 时检查并发布 GitHub Pages；PR 执行检查；独立来源检查工作流定时与手动运行并保存报告。来源短暂不可达不删除旧证据。历史证据、固定范围与 Git 版本可复现，新的定时结果在人工核验合入后才进入正式数据。
