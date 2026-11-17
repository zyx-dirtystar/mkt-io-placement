# Quant 优先：候选人、初始去向与学校年度核对

复核日期：2026-11-17。版本：1.3.2。范围是有边界的一轮补查，覆盖 Quant、CB、Strategy；不声称全球或单个学校整届已完整。

## 本轮结果

新增 13 位 2026–27 候选人，复核 72 份已有档案。历史名单覆盖 6 校、2023–2026 共 24 个年度单元、67 个具名行；另复核 13 个当季单元。共 14 个培养项目、37 个学校年度单元，其中 28 个与所读名单对齐，其他单元保留部分核验或资料不足。

| 指标 | 本轮前 | 本轮后 |
| --- | ---: | ---: |
| Placement / candidate 档案 | 308 | 321 |
| 2026–27 求职季档案（含 IO） | 17 | 30 |
| Quant 标签 | 74 | 83 |
| CB 标签 | 64 | 65 |
| Strategy 标签 | 3 | 3 |
| 已确认完整 cohort | 0 | 0 |
| Faculty 档案（独立人群） | 1,358 | 1,358 |

标签可交叉，数量变化不是三个市场的规模估计。新候选人中，7 人明确报告 Quant，4 人只作暂定 Quant，1 人明确 Behavioral Marketing，1 人尚未细分方向。默认 Quant 筛选只包括有明确标签者；高级筛选可选择纳入暂定方向。

原始日期证据的 `inferred` 在统一观察库中映射为 `provisional`，同时保留 `status_raw: inferred` 与支持推定的原文，不升级为确认，也不误降为没有原文的旧来源关联。

## 逐校、逐年核对

下列历史数量是本次所读官方表中的人数；年份保持官方表定义。毕业年、来源表年、求职季和首职开始年分别保存。本轮没有用表中的毕业年批量填充缺失的首职年。

| 培养项目 | 2023 | 2024 | 2025 | 2026 | 所读来源及边界 |
| --- | ---: | ---: | ---: | ---: | --- |
| Wharton Marketing | 1 | 3 | 7 | 3 | [毕业年份及 First Placement 表](https://marketing.wharton.upenn.edu/phd-recent-alumni/)；保留行业去向与 Yu Zhao 的首职冲突 |
| Columbia Marketing | 2 | 5 | 3 | 2 | [PhD Year / Initial Placement 表](https://business.columbia.edu/faculty/divisions/marketing/phd)；Jasmine Yang 的 Meta 与 CUHK 安排不合为同年首职 |
| HBS Marketing | 1 | 1 | 1 | 1 | [Initial Placement](https://www.hbs.edu/doctoral/placement/marketing)；仅核对明确的 Marketing 部分，不并入 Business Economics |
| Kellogg Marketing | 2 | 4 | 5 | 4 | [分项目年度表](https://www.kellogg.northwestern.edu/doctoral/placement/jobplacement/)；不把 Managerial Economics & Strategy 混入 Marketing |
| Duke Marketing | 1 | 3 | 2 | 1 | [Initial / Current Placement 表](https://areas.fuqua.duke.edu/marketing/ph-d-program/placement/)；2026 具名行的雇主存在冲突，去向未算作确认 |
| Chicago Booth Marketing | 3 | 5 | 2 | 5 | [Initial Graduate Outcomes](https://www.chicagobooth.edu/phd/career-outcomes)；2026 官方明确持续增补，不能视为最终全体名单 |

## 新增当季档案

| 学校／项目 | 新增人物 | 方向与证据 |
| --- | --- | --- |
| Purdue Marketing | Arindam Roy Chowdhury；Chaewon Seol | [官方候选人及 expected graduation](https://business.purdue.edu/academics/marketing/job-market-candidates.php)与 CV；Seol 明确 Quant，Chowdhury 暂定 Quant。2026–27 季由当前名单与预计 2027 毕业推定，字段证据明确标 inferred，未当作已授位 |
| MIT Sloan Marketing | Lei Huang；Zelin (James) Li | [官方 Marketing-group 名单](https://mitsloan.mit.edu/phd/students/on-the-job-market)与两人主页／CV；Li 明确 Quant，Huang 暂定；两人本人均明确求职季 |
| Berkeley Marketing | Kristine Cho；Peiyao Li | [官方候选人表](https://haas.berkeley.edu/phd/careers/job-market-candidates/)与本人主页；Cho 明确 Behavioral Marketing，Li 暂定 Quant；两人确认当季 |
| UT Dallas Marketing | Seung Mok (Simon) Kim | [本人主页](https://www.kimsm.com/)明确 Quant、求职季和 JMP；官方学生 API 完整读取返回 502，仅保留发现线索，不宣称整表已读 |
| Wisconsin Marketing | Yepeng Jin；Jungeun Lim；Yohei Nishimura | [官方 2026–27 全校候选人表](https://business.wisc.edu/phd/job-candidates/)及全部 8 份个人官方部门资料；三人属于 Marketing。Jin 明确 Quant，Nishimura 暂定，Lim 保留未细分 |
| UNC Marketing | Yimeng (Margaret) Cai | [本人主页](https://margaretcaim.github.io/)明确 Quant 与 2026–27；官网当前名单未成功取得，保留部分核验；未公开的工作论文不猜测为 JMP |
| NYU Stern Marketing | Steve (Shitai) Zhang | [本人主页](https://steveshitaizh.github.io/)明确 Quant、2026/27，[研究页](https://steveshitaizh.github.io/research/)明确 JMP；官网 program 页面返回 403，不宣称整届完整 |
| HKUST Economics | Ke-Cheng Hsu | [本人主页](https://cliohsu1997.github.io/)明确 Economics、Quant Marketing 交叉及求职季；官方索引相符但原页返回 502。培养项目保留 Economics，不进入 Marketing-program 分母 |

Wisconsin 的其余五位是 Accounting、Finance、Real Estate、Management、Insurance 候选人，已排除出 Marketing 名单。没有根据姓名、方法、同属商学院或“Strategy”字样推断项目归属。

Kellogg 原有的 Andrew Wooders、Caroline Wang、Samuel Su 三人重新与官方当季 Marketing 名单对齐。Wharton 当前学生页、Columbia 当前学生页不能证明谁在当季市场；HBS 和 Chicago 当季提取未得到可用的 Marketing 分组名单，保持未知，不填 0。

## 关键纠错与未解决问题

1. **Siddharth Prusty：初始雇主冲突。** Duke 表列 Indiana University，但 [ISB 官方页面](https://www.isb.edu/faculty-and-research/faculty-directory/siddharth-prusty)与[本人 CV](https://siddharthprusty.com/uploads/cv.pdf)均明确 2026 年起任职 Indian School of Business，且明确 Quant。已确认研究方向与 ISB 任职；首职机构及年份暂留未知，完整保存两种说法。未假定这是两个先后岗位，也未把两个学校名当作别名。
2. **Jason Zhao：Quant 身份和职称补证。** [Purdue 托管 CV](https://apps.it.purdue.edu/sites/Home/Files/User/61e2631f-07c8-42bf-8cf7-098c8589d2d7/DownloadCv)明确 Quantitative Marketing / IO，及 2025 年起 Assistant Professor of Management (Marketing)。保留 tenure 未经确认，不由 AP 职称推断轨道。
3. **Berkeley 当季网页混有历史人物。** Candidate 表仍列 Amanda Geiser，但学校 2026 毕业／placement 表和[本人现主页](https://www.amandageiser.com/)已列 Minnesota AP。未把她重新放入当季。另一个学生目录把 Mengyao Huang 标为 Job Market Candidate，未给季别且与主候选人表不一致；保留待核验，不机械增加当季人数。
4. **JMP 与 dissertation 的标题差异。** Seol 的学校页给 dissertation 标题，个人研究页明确另一版本为 JMP，两者分开，不由 dissertation 栏推定 JMP。
5. **Strategy 继续复核。** Tushmit Hasan 本人页明确 Marketing Strategy；Junqiu Jiang 的 ESSEC 官方 CV 重新核对。Ralph Park 旧 Binghamton CV 返回 404，保留旧证据和访问失败，不提升核验状态。本轮未把方法、教学课名或 Management Strategy 候选人当作 Marketing Strategy 增员依据。

## 为什么完整 cohort 仍为 0

核对到所有公开行是 `source_reconciled`。升级 `cohort_complete` 还需要可定位的、针对同一项目和同一年度的独立全体分母证据，并核对未就业、行业、继续求职、延期等情形。

额外查过的 Northwestern 2025 hooding ceremony program 是参加典礼的项目材料，不能单独证明所有授位者或全部求职者。Wharton 前协调员提到三年共 13 位毕业生，但没有逐年完整名册及与毕业年／market 年的明确对应；这个合计不足以把三个年度分别升级。持续更新的当季名单也不等于最终毕业 cohort。

下一轮应优先为上述年度寻找学位授予名册、年度项目报告或明确的全体人数声明，再与官方 placement 和个人资料交叉核对。其他学校和全球地区仍有未完成单元，覆盖矩阵继续显示实际状态。

## 可复核文件与日期

- `data/research-updates/2026-11-17-quant-cohorts-v1.json`：人物变更、前置值、字段证据、来源。
- `data/research-updates/2026-11-17-quant-date-provenance-v2.json`：Purdue 季别推定与作者求职季来源的细分证据。
- `data/research-updates/2026-11-17-quant-evidence-detail-v3.json`：冲突字段连接两侧来源，PDF 保留为 CV。
- `data/research-updates/2026-11-17-quant-material-sources-v4.json`：注册逐份已读的主页、CV、JMP 链接。
- `data/research-updates/2026-11-17-quant-roster-reconciliation.json`：每个核对单元的前值、后值、来源及覆盖哈希。

人物各字段使用实际复核日期；统一职业观察窗口仍保持 2026-11-02，避免局部名单补查延长所有教师的连续任职观察。教师资料库不参与本轮增员，也不加入 placement 分母。

历史教师扩展校验原先固定 placement 的 308 人快照。本轮保留快照，只允许登记于 `placement-reviewed-revisions.json`、内容哈希与导入台账一致的独立 placement 研究批次更改受保护字段。未登记的增员、首职更正和 faculty 批次不能通过该校验。

本地数据、placement、evidence、faculty、observatory 与参考资料检查通过；84 项测试全部通过，包括新增的 cohort 完整性边界、日期推定、过时名单排除、首职冲突及批次哈希／前置值保护。执行日志为 `reports/validation-quant-2026-11-17.log`（不提交）。
