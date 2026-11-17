# 固定范围、逐年检查与本轮结果

复核日期：2026-11-18。网站版本：1.3.4。

## 以后按什么顺序更新

研究范围继续使用冻结的北美 50、香港 5、新加坡 3，共 **58 所目标学校**，不因为某校没有搜到人就删掉。历史窗口固定为 **2023–2026 来源名单年**，生成 **232 个学校年度单元**；Purdue Marketing、HKUST Economics 是独立扩展，另有 **8 格**。博士项目是否存在也单独核验，58 个目标学校不等于 58 个已确认开设的项目。

上一轮已开始的 14 个项目作为优先工作队列，含两个扩展项目，共 **56 格**。本轮逐格记录了实际检索／读取结果。其余目标学校仍留在主表，保留既有证据和待办，不能把生成了清单说成已经研究完全部 232 格。2026–27 当前求职季另列，避免与历史毕业名册混用。

每格按同样顺序处理：

| 检查 | 要回答的问题 | 何时能关闭 |
| --- | --- | --- |
| 1. 人口定义 | 是已授位、完成学位窗口、学校宣布的一届、典礼候选人，还是求职者？ | 具体来源和时间边界已写明 |
| 2. 独立分母 | 全体究竟有几人？是否包含行业、未知去向和非参加典礼者？ | 独立全体来源与具名人数一致；单次候选名单不够 |
| 3. 全体姓名 | 每个名字是否都进了档案？别名、同名和跨年如何对应？ | 在明确人口内逐人对齐，不按成功就业筛人 |
| 4. 研究方向 | Quant、CB、Strategy、交叉与未分类分别是谁？ | 使用官方或本人明确研究证据；不靠方法／职称强分 |
| 5. 首职去向 | 是首次毕业后去向，还是现职、后续工作、接受但未入职的 offer？ | 每个人有来源；查不到的保留未知 |
| 6. 日期 | 来源名单年、实际学位年和首职开始年是否分别有依据？ | 不相互代填；跨期差异必须保留 |

网站的 checklist 显示全部阶段、证据、人数及确定的下一步。默认看 14 个优先项目，可切至核心范围或扩展范围；支持分页、学校／年份／未解决步骤筛选和 CSV／JSON 下载。[完整 240 格文字清单](../reports/COHORT-CHECKLIST.md)由同一份数据自动生成。`next_queue` 按人数／身份问题、既定优先项目、年份排序，后续无需临时挑校，也不会遗漏没有人物的单元。

## Berkeley 2026：解释了什么，仍缺什么

| 官方材料 | 人数 | 材料日期 | 实际含义 |
| --- | ---: | --- | --- |
| [Class Profile](https://haas.berkeley.edu/phd/community/class-profile/) | 11 | 页面修订 2026-05-27 | 确实写的是 2026 Graduates，不能解释成招生数；没有具名分解或完整时间窗口 |
| [校方毕业公告](https://www.linkedin.com/posts/berkeley-haas_berkeleyhaas-2026haasphdcommencement-ucberkeley-activity-7460008483367665664-yiih) | 9 | 发布 2026-05-12 | 九个具名毕业生，不是来源明确限定的“只参加典礼者” |
| [学校 placement 表](https://haas.berkeley.edu/phd/careers/job-placements/) | 8 | 页面修订 2026-09-30 | 八个有公开去向的具名行，不是独立全体毕业人口 |

逐名差集发现 **Andrew Maurice Perry** 出现在九人公告中，未出现在八行 placement 中；其 [本人学术页](https://andrewperry.owlstown.net/)报告 Finance 身份，这是本人一手资料，不是学校官方方向认定。未列 placement 不等于失业。

匹配还保留一处身份边界：公告写 **Sophia L.**，placement 写 **Sophia Li**。这是上下文工作映射，未写成永久确认别名。不采用该暂定映射时，严格差集是公告独有 Sophia L.、Andrew Maurice Perry，placement 独有 Sophia Li。

因此，**9→8 的具名差异得到解释，但 11→9 仍未解决**。如果两份材料指同一人口，另两位身份及方向未知；如果人口不同，来源也没有解释如何不同。不能靠发布时间猜测为全年／典礼、延期或非 Marketing，2026 Marketing / Quant 完整性保持未确认。完整比较、九人原名和来源类型见 [逐名核对数据](../data/cohort-reconciliations/berkeley-2026.json)。

Quant 的实质补证是 **Yixiang Xu 首职于 2026-08-01 开始**：[剑桥官方任命公报](https://www.admin.cam.ac.uk/reporter/2025-26/weekly/6834/section2.shtml)给日期，Park Sinchaisri 本人 CV 物理第 9 页明确 Cambridge 是 Initial Placement。英国 probation 没有转换成美国 tenure 状态。

## Kellogg：未分类成员已解决

Carolyn Wells Keller 的官方论文库本人论文明确研究贡献属于 consumer behavior；委员会成员 CV 明确其 Marketing PhD 为 **2022**。已补 **CB、graduation_year=2022**，来源名单年仍是 2023。2024–25 Medill Lecturer 公告只保存为有学年依据的任职，首职去向／开始日期继续未知。

2024、2025、2026 三份大学正式完整手册的 Marketing PhD 条目分别核对 **4、5、4 人**，与已有档案匹配。手册明确不作为完成学位证明，并区分已授位旧学期和当年 June candidates，因此未升级成实际全年毕业完整。Joseph Malcolm Abruzzo 位于实际 2025-03-28 授位区块，具体日期独立留存。

## 本轮补入的十个漏项

| 培养项目 | 人物 | 日期／去向处理 |
| --- | --- | --- |
| MIT Marketing | Matthew Patrick Cashman | 2024 书册、实际 PhD 2023；首个毕业后 Warwick fellowship 2023–25，MIT 2025 postdoc 为后续，不改写首职 |
| MIT Marketing | Yunhao (Jerry) Zhang | 2023 书册；记录 2023 postdoc 和 2026 UCL AP 观察，确切授位年及首次任职仍未知 |
| MIT Marketing | Xi Chen | 2026 书册明确 September 2025；以独特论文题目核对 Marketing 身份，首职与细分方向未知 |
| MIT Marketing | Yiqun (Cathy) Cao | 2023 书册明确 September 2022；Quora 是未给日期的任职，不自动作首职 |
| Columbia Marketing | Daniel Jesse Konstant Russman | 2026 candidate 名册；官方年刊本人明确 CB；授位和去向未知 |
| NYU Marketing | M. Leonor Neto | 官方 2026 placement 与本人 CV 确认 Dartmouth postdoc、CB；CV 仍写 Candidate，授位年不补成 2026 |
| UNC Marketing | Andre Martin | PhD 2023、Notre Dame AP 2023 起、明确 Marketing Strategy；与既有教师档案显式关联，保留两个稳定 ID、不重复计算统一人物 |
| UNC Marketing | Jiaming (Jasmine) Wei | 明确 Quant，作者确认 PhD 2026；本人 Beihang 与索引 Tongji 任职线索不一致，首职未知 |
| UNC Marketing | Carlos Siri | 官方 2026 hooding／部门毕业公告；旧本人页仍为 candidate，去向、确切授位和细分方向保留未知 |
| UT Dallas Marketing | Taewook Lim | 2026 Management Science PhD candidate 名册＋AMA 本人 Marketing 简介；授位、首职、求职季及 Quant 身份不推定 |

补入人物的依据是官方具名材料及可核对项目身份，不要求先查到成功就业。没有按相似姓名合并 Cornell／NJIT 等其他 Yunhao Zhang、其他 Xi Chen 或其他领域 Yutian Liu。

## 其他项目逐项结果

本轮源资料包保存了 14 项目 × 4 年的具体检查和限制：

| 项目 | 本轮新增的检查／结果 | 尚缺的关键证据 |
| --- | --- | --- |
| Columbia | 2024／2025／2026 candidate block 为 5／3／3 人，发现 Russman 漏项 | 完成授位人口；anticipated 不作为已授位 |
| Duke | 2023／2024／2026 正式手册及既有 2025 材料交叉检查 | Business Administration 中全体 Marketing 归属及最终授位 |
| HBS | 分年查找；2026 公告给学校跨项目博士数，2024／2025 已有年报保留 | Marketing 具名全体，不能分摊学校总数 |
| HKUST Economics | 按年查找；2025 全系一名宏观毕业生仍不并入 IO 子集；2026 典礼窗口尚在进行 | 年度 Economics 全体与逐人 IO／Quant 子集归属 |
| MIT | 2023／2024／2026 学位册和 Marketing 项目／alumni／论文标题对照，补四位漏项 | Management 全体对应的 Marketing 最终人口；Jason／Ding 独特论文匹配仅为暂定身份对应 |
| NYU | 2024–26 具名册与中央 placement 对照；Zekun Liu 的 January 2025 学位年不改其 2024 首职年 | 候选与已授位、不同授位月份的最终全体 |
| Kellogg | 见上：Keller 分类／学位年，三年完整手册具名对照 | 2024–26 实际完成学位的独立年度分母 |
| Purdue | 分年查找；2026 春季正式手册的 Business PhD 段已实际读取 | Marketing 子领域、各学期实际最终授位；单次候选册不够 |
| Berkeley | 四年部门名单重读，2026 九人与八人差集核对 | 11 人统计中未具名者及口径说明 |
| Chicago Booth | 找到大学图书馆 2026-11-04 宣布的 [654 份 Convocation programs 档案](https://www.lib.uchicago.edu/about/news/convocation-programs-come-alive-on-uchicagonode/) | 动态档案平台中具体年度册尚未取得，不能把找到集合当作读完 |
| UNC | 2023–25 春冬六册、2024–26 hooding 网页逐年查找／读取；新增 Quant、Strategy 和未分类者 | Business Administration 全体领域映射，候选／实际授位的最终人口 |
| Wharton | 四年正式毕业册已读取，明确名单 tentative | 最终实际授位名单；现有 placement 人数不能替代 |
| UT Dallas | 官方出版账号六册入口核实；2026 博士页实际读取，其余仅材料元数据；三位已有者明确 Quant | 其余册博士页和 Management Science 的 Marketing 全体分解 |
| Wisconsin | 四年逐年检查；2025 官方公告完整正文实际取得 | 2023／2024／2026 最终全体，不由 Selected placements 或典礼候选册补 0 |

Wisconsin 2025 公告的 15 名 Business PhD 中，Marketing 为 **Suyeon Jung、Yutian (Carol) Liu 两人**，与独立 placement 表一致，Google 行业去向保留。现在可核全这个**校方宣布的毕业届**，不能扩大为全历年授位或整个求职季。Yutian 仍未分方向，Quant 子集不声称完整。Nitisha Tomar 的 Bayes 官方页另确认 CB 与 2024 年 8 月结束的 PhD，解释了春季候选册为何不能代表全年。

UTD 的 Salar Nozari、Ehsan Saremi、Ata Jameei 有明确本人 Quantitative Marketing 表述，补确认标签；Ata 历史 CV 的 expected graduation 不转成授位证明。

## 数字、文件与维护

| 指标 | 本轮前 | 本轮后 |
| --- | ---: | ---: |
| Placement / candidate 档案 | 322 | 332 |
| Quant 标签 | 83 | 87 |
| CB 标签 | 66 | 70 |
| Strategy 标签 | 3 | 4 |
| 范围明确的核全名单 | 3 | 4 |
| 当前求职季档案 | 30 | 30 |
| 独立教师档案 | 1,358 | 1,358 |

十人新增、25 份已有档案复核；标签可交叉，数量不是三个子市场规模。本轮四个核全名单共八人，仍有首职、日期或研究分类缺口，所以“全部显示阶段都关闭”的年度格仍为 0。不能把分母进展说成全市场研究完成。

- 规则：`data/cohort-research-plan.json`；逐次审读日志：`data/cohort-review-log.json`。
- 人物前置值、字段证据和稳定 ID：`data/research-updates/2026-11-18-systematic-cohorts-v1.json`。
- 名单前后值及范围：`data/research-updates/2026-11-18-systematic-review.json`。
- 原始官方来源、页码、候选名单、访问限制及本地快照哈希：`data/research-updates/2026-11-18-official-source-packet.json`。
- 自动生成完整表：`node scripts/cohort-checklist.mjs`；网站构建会执行同一逻辑，CSV／JSON 和界面保持一致。

职业观察窗口仍截止 2026-11-02。接收端教师资料没有批量刷新；Andre 的显式身份链接仅合并观察、保留既有教师日期，不改写第一份工作。

本地数据、placement、evidence、faculty、observatory、参考资料检查及 99 项测试全部通过；浏览器已实际核对 56／232 格范围切换、Berkeley 差异弹窗和紧凑表格布局。验证日志为 `reports/validation-systematic-cohorts-2026-11-18.log`，不提交。
