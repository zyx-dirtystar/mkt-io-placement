# 官方学位名册与 cohort 分母核对

复核日期：2026-11-17。网站版本：1.3.3。优先范围沿用上一轮的 14 个项目，检索目标为 2023–2026 年官方毕业生全名单、授位名册、项目年度报告。检索范围不表示四个年度的材料都已取得；逐份材料的年份、实际读取状态和限制保存在审计 JSON 中。

这轮核全了 **3 个定义明确的 Marketing 名单，共 6 人**：原优先项目中的 Kellogg、Berkeley 各一组，加上额外查到的 HKUST Marketing 一组。它们分别对应完成学位的时间窗口、学校公布的毕业届别或书册中的授位届别，**不能合称为三个完整的历年授位人口或求职季人口**。名单完整也不等于去向完整。

## 能核全的三组

| 项目／来源届别 | 独立全体证据与时间范围 | 名单核对 | 仍未知的内容 |
| --- | --- | --- | --- |
| Kellogg Marketing，2023 书册 | [官方 Convocation program](https://www.kellogg.northwestern.edu/-/media/files/the-experience/convocation/kellogg-school-2023-convocation-ceremony-program.ashx?hash=A4CB82E9CA940E09710BB04F01D6A9DB&la=en)，PDF 物理第 6 页，PhD 栏明确为 2022 年 6 月以来已完成学位者 | **3 / 3**：Carolyn Wells Keller、Youngeun Lee、Yingkang Xie。独立于只列后两人的 placement 表 | Keller 的首职、开始日期及确切授位年未知；不能把 2023 书册年填成确切毕业年 |
| Berkeley Haas Marketing，2025 公布毕业届 | [学校完整毕业生公告](https://newsroom.haas.berkeley.edu/11-berkeley-haas-phd-students-graduate/)，2025-05-08，列全校 11 人及各自 academic group | **2 / 2**：Yunhao Huang、William Ryan；与[另行维护的 placement 表](https://haas.berkeley.edu/phd/careers/job-placements/)吻合。其他 9 人属于其他学科 | 公告覆盖的这届可核全，但不能据此排除该历年其他时间授位者；Huang 的首职开始年仍未知 |
| HKUST Marketing，2025 书册授位届 | [具名名单，印刷第 59 页](https://booklet.congregation.ust.hk/2025/cbook_book1/61/)、[授位人数附录 iii](https://booklet.congregation.ust.hk/2025/cbook_book1/72/)、[2024–25 完成论文附录 xvi](https://booklet.congregation.ust.hk/2025/cbook_book1/85/)相互对应 | **1 / 1**：Jingling Yu；人数表的 Marketing PhD 为 1，具名名单与论文附录均只有此人，与既有 placement 档案吻合 | 书册没有给出精确授位日期和求职季开始日期；MPhil、MSc 与 Economics PhD 均排除 |

Kellogg 同一页的三位 Marketing **MS** 没有计入 PhD。新增的 Keller 保留在分母里，首职状态为 `outcome_unknown`。[Medill 官方页](https://www.medill.northwestern.edu/directory/faculty/carolyn-keller.html)报告其 Lecturer 任职，但没有起始日期或“首次任职”说明，因此仅记录为该网页报告的任职，不改填为首职。该页列出的 CB 教学兴趣也没有被当作明确 CB 研究身份。

三个完整名单里目前有 4 位带 Quant 标签、1 位带 CB 标签、1 位研究细分方向未知。Kellogg 仍有一位未细分者，所以其 Quant 子集不能声称完整。方向完整性与名单完整性分开：不靠论文方法、同院系或就业机构反推标签。

## 14 个优先项目逐项结果

下表中的“未核全”表示尚无足够分母证据，不表示该年度零毕业生。只列实际取得或访问过的版本；其余年度继续保留缺口。

| 优先项目 | 本轮取得／访问的官方材料 | 结果与下一步 |
| --- | --- | --- |
| Columbia Marketing | [2025 EMBA / PhD Recognition program](https://students.business.columbia.edu/sites/students/files-efs/imce-uploads/graduation/2025%20EMBA%20PhD%20Recognition%20Program.pdf)，物理第 5 页 | Marketing 三人与既有记录对应；增加 Eric Sanghyeok Park、Yu Ming (Jasmine) Yang 两个官方姓名别名。材料标题是 candidate hooding，还出现 anticipated 状态，不能证明最终全部授位 |
| Duke Marketing | [2025 大学毕业典礼手册](https://commencement.duke.edu/wp-content/uploads/2026/02/2025-Long-commencement-program_accessible.pdf)，物理第 17–18 页 | Denny Ho Huynh、Demilade Samuel Oba 的完整姓名与论文得到交叉核对，但没有单列 Marketing 全体分母 |
| Harvard / HBS Marketing | [2025 毕业公告](https://www.hbs.edu/news/releases/2025-commencement)、[2025 年报](https://www.hbs.edu/about/annualreport/2025/year-in-review)、[2024 年报](https://www.hbs.edu/about/annualreport/2024/year-in-review) | 11、19 等是学校层面的博士数，不能分配给 Marketing；还需要覆盖各授位批次的具名名单及方向 |
| HKUST Economics | 上述 2025 名单、授位人数及论文附录 | 全 Economics PhD 名单为 **Zhenghua Qi 1 人**，论文为宏观经济学；没有仅因 Econ 学位而把他导入 Quant / IO 子集。全系人数不是子集分母。另查到的 HKUST Marketing 是独立项目 |
| MIT Sloan Marketing | [2025 Graduates Name Book](https://commencement.mit.edu/sites/default/files/2025-05/MIT.Commencement.2025.Graduates.Name.Book.pdf)，物理第 100 页；[2024–25 授位统计](https://registrar.mit.edu/stats-reports/degrees-awarded/2024-2025) | 按 Management PhD 汇总，没有 Marketing 子方向；不能把 Management 总数当 Marketing 总数。Ding Du 与既有 Jason Du 的对应仍待直接证据，本轮不合并 |
| NYU Stern Marketing | [毕业典礼 Archive](https://www.stern.nyu.edu/graduation/archive) 的索引显示 2023–2026 入口，原页直接读取 403 | 找到归档入口，尚未读到完整 PhD 具名毕业册；NYU Shanghai 的 MS Marketing 结果不混入 |
| Kellogg Marketing | 上述 2023 已完成学位书册 | 核全该完成窗口的 3 人；2024–2026 尚缺同等强度的全体完成学位证据。上一轮的 hooding 参加者名单不能替代 |
| Purdue Marketing | [2025 夏季手册](https://www.purdue.edu/commencement/August2025_Program.pdf)索引、[2026 春季手册入口](https://www.purdue.edu/commencement/spring2026program/)、[官方 Marketing PhD 项目页](https://business.purdue.edu/phd/programs/marketing/home.php) | 手册是候选人及单次典礼，未拼成全年最终授位名单；官方页已足够把项目资格由 pending 更正为 verified。全年仍需合并各学期并识别 Management 中的 Marketing |
| Berkeley Haas Marketing | 上述 2025 全体毕业公告，以及 [class profile](https://haas.berkeley.edu/phd/community/class-profile/)、placement 表与[官方 2026 公告索引](https://www.linkedin.com/posts/berkeley-haas_berkeleyhaas-2026haasphdcommencement-ucberkeley-activity-7460008483367665664-yiih) | 2025 核全两人；2026 全校人数出现 **11 / 9 / 8** 三种口径，尚未弄清时间截点／人群差异，不提升完整性 |
| Chicago Booth Marketing | [Convocation](https://convocation.uchicago.edu/)、[Registrar 毕业说明](https://registrar.uchicago.edu/graduation/) | 当前入口已切到 2027，Registrar 页说明认证流程但不发布 Marketing 全体名单；仍需按季度取得历史授位名单。2026 placement 持续补录的限制保留 |
| UNC Marketing | [2026 春季官方手册](https://commencement.unc.edu/wp-content/uploads/sites/950/2026/07/2026-Commencement-Program-Digital-1.pdf) | May 2026 candidates，博士按 Business Administration 合组，尚不能得到 Marketing 最终授位分母 |
| Wharton Marketing | [毕业典礼官网](https://graduation.wharton.upenn.edu/)、[Doctoral career placement](https://doctoral.wharton.upenn.edu/career-placement/) | 当前日程／视频与 placement 历史不是独立毕业全体；保留上一轮按年对齐的名单，继续寻找学位全册 |
| UT Dallas Marketing | [Commencement](https://commencement.utdallas.edu/) 直接读取 502；[2025 毕业预告](https://news.utdallas.edu/campus-community/fall-commencement-preview-2025/) | 校级总数和跨期参加典礼不建立 Marketing PhD 分母；排除 University of Dallas、UNT、UT Tyler 等相似检索结果 |
| Wisconsin Marketing | [2025 官方手册](https://commencement.wisc.edu/content/uploads/2025/05/Spring2025-Commencement-program-INSIDE-8_375x10_875_web.pdf)、[选录 placement](https://business.wisc.edu/phd/placements/)、[官方 PhD program 毕业贴](https://www.linkedin.com/feed/update/urn:li:activity:7333499100820066305/)的索引正文 | 官方贴列 15 位 Business PhD，Marketing 为 Suyeon Jung、Yutian Liu 两人，但原贴正文直接读取失败，作为分母线索保留。手册物理第 24 页明确提示不能作为毕业的确凿证明，博士又按 Business 合组，因此暂不升级 |

本轮没有把“搜索到了入口”记成“读完年度全体名单”。审计 JSON 分别使用 `read_pdf`、`read_html`、`read`、`indexed`、`indexed_body_only`、`limited` 等状态。搜索年份是查找目标；`materials.year` 才是实际对应的材料版本。

## Quant、CB 与 Strategy 的数据边界

这一轮主要提高分母可信度，Quant 人物标签数仍为 83，没有为了增加覆盖数而把方法相近的人自动归为 Quant。新增 Keller 后总档案数为 **322**；2026–27 候选人仍为 **30**。独立教师库仍为 **1,358**，不并入毕业分母。

Suyeon Jung 的 [AMA-Sheth 2024 官方 consortium 简介](https://www.alliancembs.manchester.ac.uk/media/ambs/content-assets/documents/events/ama-sheth-doctoral-consortium-2024-booklet.pdf)明确 Consumer Behavior 方向，已补 CB 标签（全库 CB 从 65 到 66）；其中 2024 求职描述没有被填成毕业年。Yutian (Carol) Liu 的 Google 行业去向保留在名单里。

Strategy 原有三份档案继续保留，完整名单按整个 Marketing 项目核对，不因关注 Quant 而排除 Strategy、CB 或未细分者。这一轮没有获得新的明确 Strategy 身份证据，也没有把 Management / Strategy 项目或计量方法使用者自动增加为 Marketing Strategy。

## 网站和数据检查

覆盖矩阵与审计详情新增可读的群体定义、独立人数、原文证据及页码。完整名单筛选使用其自身时间轴；这三组以**来源名单年**选择，不再借用它们为“首职年”或“毕业年”筛选提供完整分母。项目对比中的完整 cohort 计数也遵守同样边界。

原始数据更改通过带前置值、稳定人物 ID 和内容哈希的研究批次导入；名册与项目资格的变动另保存前值／后值。职业观察截止日期仍是 2026-11-02，局部新核验日期没有延长所有人的连续任职观察。

- 人物导入：`data/research-updates/2026-11-17-degree-cohorts-v1.json`。
- 14 项目材料清单、完整人口定义、PDF / HTML 哈希、具体名单单元前后值：`data/research-updates/2026-11-17-degree-denominator-review.json`。
- 来源 PDF / HTML 本地快照不提交；官方链接、页码及 SHA-256 在上述审计文件中保留，便于识别官网后续修改。
- 校验包括既有数据／evidence／faculty／observatory／参考资料检查，以及完整名单、未知去向、时间轴隔离、Econ 子集边界、人数冲突和证据显示测试，共 92 项测试全部通过。执行日志为 `reports/validation-degree-cohorts-2026-11-17.log`（不提交）。

[网站查看完整名单](https://zyx-dirtystar.github.io/mkt-io-placement/#coverage?cv_progress=complete)；[按来源年查看完整名单中的人物](https://zyx-dirtystar.github.io/mkt-io-placement/#directory?period=cohorts&yearBasis=source&completeOnly=yes)。
