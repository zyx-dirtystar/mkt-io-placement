# CV、JMP 与去向统计修订 · 2026-10-08

0.5.0 在原有 58 校目标范围上补充逐人证据和统计功能。23 人完成本轮资料或路径复核，另合并一条同人不同姓名写法。当前 295 人，尚未完整普查。

## 已交付

- 按用户指定文字规则区分教职、非终身轨、博后、业界及其他、延期、未知；另列当季求职中。教职率仅以四类明确去向为分母。
- 默认该次求职最终安排；首次岗位可切换。7 条过渡研究岗位后任教职路径有独立来源；2 条 2027 教职标为已宣布、尚未开始。普通多年后跳槽不改写原届 placement。
- 个人主页 47 条、本人 CV / Vita 57 条、JMP 题目 39 条。新增 Jennifer Allen 与 Vincent Chen 的明确 JMP；撤回 Adam Harris 原先间接推定的 JMP 标题，保留为研究线索。
- 培养院校 UTD 四刊 2021–2025 北美排名展示、前 10 / 25 / 50 筛选及排序。Econ 与亚洲学校不套用北美 Marketing 名次。
- 单列 Strategy，保留来源研究原文；不按是否使用计量或 NLP 一刀切判 Quant。
- 按最终机构地区统计，大陆四个指定分校覆盖原地区标签。CSV 随去向口径导出，并保留研究、教育背景、原始年份与证据。

## 具体证据例子

| 研究者 | 本次处理 | 依据 |
| --- | --- | --- |
| Jennifer Allen | 宾大 2024 博后；NYU 2025 教职；保留 JMP | [本人 CV](https://jenny-allen.com/uploads/ja_cv_20250701.pdf)、[NYU 预告](https://csmapnyu.org/people/jennifer-allen) |
| Amanda Geiser | CB；2026 Minnesota 首职 | [CV](https://www.amandageiser.com/_files/ugd/d33459_bad1fdfb174b49e8a64a239373d51940.pdf)、[新教师公告](https://carlsonschool.umn.edu/news/new-minnesota-carlson-tenure-track-faculty-2026) |
| Vincent Chen | CV 明确 Behavioral Marketing；保留 NLP 方法及 JMP；Vals AI 任职年份仍未明确 | [CV](https://vpchen.org/assets/pdf/cv.pdf) |
| Tianyu Han | HKUST 2024-07 入职；Quant 为研究方法整理分类 | [本人 CV](https://mark.hkust.edu.hk/files/staff/HAN_Tianyu.pdf) |
| Keyan Li | 方法与方向已补；Instructor → AP 转换日期仍待核验 | [本人主页](https://keyanl1.github.io/)、[2024–25 校历](https://registrar.nd.edu/assets/579606/boi2425ug_final_amended_8_21_24.pdf) |
| Jingyi Cui | Berkeley 2026–27 博后后 CMU 2027 教职，标为已宣布 | [本人主页](https://jingyi-cui.github.io/) |
| Ella Xu / Ella J. Xu | 确认为同一 NYU→Emory 研究者，合并并保留别名 | [Emory 官方页](https://goizueta.emory.edu/faculty/profiles/ella-xu) |

本輪 MIT / Berkeley 的 16 人逐人复核，另核对 6 人最终任职路径与 1 人 Strategy 分类。逐人列表在 data/cv-review-2026-10-08.json；详细依据保存在每人的 sources 和 notes。先前已核验链接也整理为显式主页 / CV 字段，不声称本轮重新读完全部 57 份 CV。

## 剩余缺口

新增 11 个首职年份后，143 人有明确首职年；严格 2023–2026 首职年样本 142 人，默认近四年名录 279 人。138 条首职或首职年份待核验；168 人尚待 Marketing 细分分类。学校名单覆盖仍以 coverage 矩阵为准，整届完整性未确认。

空缺并非同一种原因：有人尚未查到个人资料，有人公开材料只写毕业年，有人只有现职，有人 CV 与学校页面称谓冲突。完成一次核验也不一定能填满全部字段。

国籍与华裔不按姓名推断；保留有依据的公开身份及本科地区对照。

## 验证

数据唯一性与别名去重、来源和项目归属、年度滚动、职位限定词优先级、Lecturer 国家差异、首次/最终路径、教职率分母、大陆校区、排名、CSV 字段一致性与公式转义均有检查。浏览器核对了 Jennifer Allen 两种去向、排名筛选与排序、统计口径页面。
