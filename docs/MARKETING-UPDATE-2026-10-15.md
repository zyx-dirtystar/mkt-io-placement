# Marketing 资料补充 · 2026-10-15 · v0.7.0

本轮新增 9 位人员、补充 33 位已有人员，重点为 Marketing 名单、研究子方向、个人主页、CV、JMP 和真实任职日期。目标学校清单、排名时间窗及近四年口径保持不变。网站仍是有来源的持续扩充样本，不是完整市场普查。

## 可复核的变化

| 指标 | v0.6.0 | v0.7.0 |
| --- | ---: | ---: |
| 全部独立人员 | 295 | 304 |
| Marketing 人员 | 269 | 278 |
| 明确 Consumer Behavior 标签 | 46 | 61 |
| Marketing 细分方向待核验 | 163 | 141 |
| 有独立暂定方向 | 2 | 12 |
| 首职 / 路径未知 | 21 | 22 |
| 已有首职，但年份未知 | 115 | 98 |
| 初始岗位类别未知 | 102 | 84 |
| 个人主页链接 | 51 | 76 |
| 本人 CV 链接 | 60 | 79 |
| 有明确标注依据的 JMP | 40 | 47 |
| 目标 58 校中有实名记录的学校 | 47 | 51 |
| 目标学校人员 | 263 | 272 |
| 近四年来源名录可见人员 | 279 | 285 |
| 有明确近四年首职年的人员 | 144 | 166 |

已有人员中，26 人补上明确子方向、18 人补上首职年。新增人员也会带来尚未解决的缺口，因此缺口变化不等于本轮完成量。暂定方向仍不计作“已核验”，仅在用户选择纳入时参与对应子方向筛选。

这些数字由 `data/records.json` 与前端实际筛选逻辑计算；链接数不代表逐份 CV 都已成功解析。DOCX 或受限 PDF 的读取障碍在来源说明中保留。

## 新增人员

| 人员 | 博士来源校 | 本轮确认内容 |
| --- | --- | --- |
| Kang Huang | Rochester | 本人明确 2026–27 求职、Quant Marketing、JMP；尚无去向 |
| Abigail Bergman | Stanford | 官方 2026–27 名册、本人的研究与教育；CB 为暂定 |
| Samuel Pertl | Stanford | 官方 2026–27 名册、明确 JMP；CB 为暂定 |
| Zhenyu Jin | South Carolina | 2023 Towson Marketing 助理教授、消费者心理学 |
| Angela Ziyan Xiao | CMU | 2025 Vanderbilt Marketing 博后、Consumer Behavior |
| Xiaohang (Flora) Feng | CMU | 2025 毕业、CityU 助理教授；首职开始年和 Quant 标签尚待补证 |
| Behnam Mohammadi | CMU | Quant Marketing、2025 UT Dallas 助理教授及本人网页 CV |
| Nan (Iris) Xue | CUHK | 学位明确含 Marketing and Tourism、2024-09 Birmingham Marketing 助理教授、CB |
| Chenfeng Yan | CityU | 2024-02-15 Marketing 博士授位、已知山东大学任职；第一份岗位顺序待核验 |

[Stanford 名册](https://www.gsb.stanford.edu/programs/phd/placement/job-market-candidates)为滚动发布页，索引可读而本轮直连受限。[Kang Huang 本人主页](https://sites.google.com/view/kanghuang)明确写了求职季，不以博士在读年级推定。

[CMU 初始去向表](https://www.cmu.edu/tepper/programs/phd/job-market)增加了 Flora Feng 和 Behnam Mohammadi，但未列 Angela Xiao；后者由 [Vanderbilt 2025 秋新任职公告](https://business.vanderbilt.edu/news/2025/07/25/vanderbilt-business-welcomes-new-faculty-members-fall-2025/)及学位论文交叉补入。这是为何单靠一张官方表仍会漏人的具体例子。

Nan Xue 的 [接收院校资料](https://www.birmingham.ac.uk/staff/profiles/business/xue-nan)明确学位为 Business Administration (Marketing and Tourism)。按用户要求覆盖 Marketing 全方向，保留原学位名称纳入；不将纯 Tourism 学位自动视作 Marketing。Chenfeng Yan 的 [CityU 学位记录](https://scholars.cityu.edu.hk/en/studentTheses/the-impact-of-the-adoption-of-algorithmic-organizational-decision/)与 [山东大学履历](https://www.glxy.sdu.edu.cn/info/1131/7542.htm)确认双博士背景，一人只记一次。

## 重要更正

- Jasmine Yang：本人任职 CV 确认 Meta 的第一份岗位是 2025-06 起的 **Postdoctoral Researcher**，随后 2026-08 到 CUHK 任助理教授。公司中的博后仍按岗位文字归“博后”；最终安排另列，保留两种统计口径。[CV](https://www.bschool.cuhk.edu.hk/wp-content/uploads/CV_Jasmine-Yang_202609.pdf)
- George (Zhida) Gui：2023 Columbia **Instructor**、2024 再任 **Assistant Professor**；不能把后来的助理教授职称倒算到首职年。[CV](https://www.georgegui.com/files/CV_GeorgeGui.pdf)
- Mohamed A. Hussein：Columbia 官方页列 2024 加入，2026-07 CV 列助理教授自 2025 起。保留该差异，2024 的首职职称继续未知，2025 助理教授另列，未猜测 2024 是什么岗位。
- Nofar Duani：本人任职 CV 确认 2023-06 起任 USC **Instructor**，按非终身轨教职口径统计。
- Yinghao Wu / Alisa Wu、Max / Maxwell Alberhasky 等增加公开可对齐的别名，避免重复收录。
- Randy Gao 的 Yale 博后后赴 Bocconi 记录为后续履历。尚未确认两者同属原求职时的预定安排，不把之后的转职改写成原 placement 最终安排。
- 博士论文、获奖论文和当前工作论文不自动充作 JMP；只有个人主页、CV 或官方求职资料明确标注时填写。

## 覆盖缺口与下一轮入口

目标 58 校中，51 校已有实名记录；另 2 所已确认相关博士项目、但尚无已核验的近期实名记录：**Maryland、Rice**。还有 5 所研究排名入选学校尚未识别到符合范围的 Marketing 博士项目，不能当成 0 毕业生：Johns Hopkins、Notre Dame、Dartmouth、Georgetown、Boston College。

- Maryland 的官方 career 页面可读的 Marketing placement 仍停在 2022，不能用于填满 2023–26。
- Rice 的正式学位目录仍有 Marketing 博士方向，不能因当前招生页未列而删除项目；近期毕业名册仍待找到。
- CUHK 的最新 placement 链接跳到 SharePoint 登录；本轮新增个案由接收单位与导师资料独立补证。
- CityU 的学院 career 页只有匿名机构；学位论文库能补人，不能单独确认第一份岗位。
- Rochester 旧平台另列 Jinsoul Seo，尚无明确本季声明；CityU / Zhejiang 双博士 Hanyu Chen 的具体培养项目尚需确认，均保存在 `review-queue.json`，不强配当季或项目。

107 个来源单元与所查来源表对齐，所有 `cohort_complete` 仍为 false。**至少有一位毕业生记录、来源表对齐、整届完整是三件不同的事。** 更新后仍有 141 人需补明确细分方向、120 条首职或年份待核验（22 + 98），其中还有 84 条初始岗位类别未知，后者与其他缺口重叠。

## 逐条审计与复用

本轮三个证据批次保存原 URL、所改字段、日期和解释：

- `data/research-updates/2026-10-15.json`
- `data/research-updates/2026-10-15-supplement.json`
- `data/research-updates/2026-10-15-hong-kong.json`

`scripts/apply-research-update.mjs` 将经过核验的批次合入数据，并维护项目计数和对应覆盖单元。它不是抓取器，不会判断来源真假。以后应新建日期批次；旧批次是审计记录，**不要在有较新修订后重跑旧批次**，否则旧字段可能覆盖新资料。

校验覆盖一人一条、项目归属、来源、当季与历史分母、首职和最终安排、Instructor 转职、公司博后、未知日期及 JMP 标注；发布前同时运行全部三项数据检查及 JS 语法检查。
