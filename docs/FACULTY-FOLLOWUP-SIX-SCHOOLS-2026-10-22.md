# 六校目录差异与教师履历补核 · 2026-10-22

本批以 `71504a3` 的六校教师档案及 receiving checks 为基线，只增补公开证据和可解释的范围差异。批次文件为 `data/research-updates/2026-10-22-faculty-followup-six-schools.json`。当前教师范围、跨院系关联、历史任职和博士授位信息分开保存；没有把现职倒填成首职。

## 实际结果

| 学校 | 当前明确目录范围 | 本轮结论 | 既有博士年已知 → 补核后 | 新增档案 |
|---|---:|---|---:|---:|
| Chicago | 19 研究教师；另 5 Adjunct | 指定公开动态目录已完整对齐 | 16/19 → 19/19 | 0 |
| UT Dallas | 已收录 15 研究教师 | 仍为部分核验，当前目录访问失败 | 12/15 → 15/15 | 0 |
| Yale | 14 研究教师；另 2 Lecturer、1 Emeritus | 当前目录与 2026–27 官方清册具名对齐 | 12/14 → 14/14 | 0 |
| NYU | NYC 22 主系 + 2 联合 + 1 附属；Shanghai 1 人单列 | 26 行完整表按任职和校区对齐 | 12/22 → 25/25，含新增 3 人 | 3 |
| Michigan | 14 当前研究教师；当前卡片中另 9 教学/临床/兼职、1 滞后卡片 | 24 张卡片及有日期人员变化已解释 | 13/14 → 14/14 | 0 |
| Notre Dame | 14 当前 Marketing 主系研究教师；另 3 教学 | 当前目录完整对齐，清册额外跨院系 1 人单列 | 原 15 档案均已知，仍保留 15 档案 | 0 |

六校原有档案 99 人，博士年已知由 80 人增加到 99 人；新增 NYC 研究关联成员 3 人后，102 份保留档案均有博士年。这是接收端档案信息覆盖，不是完整毕业 cohort。Otteson 保留在 102 份档案中，但不混入 Notre Dame 当前 Marketing 主系 14 人名单。六校当前明确名单合计 101 人，包含 NYU 三名联合/附属成员；UTD 的 15 人仍不宣称全系当前完整。

批次实际修订 71 份既有档案、新增 3 份。有日期职业片段在合并视图中由 52 段增至 214 段，至少有一段日期职业记录的人数由 42 人增至 87 人。批次本身含 197 段有日期片段，其中一部分为保留的既有证据；净增加 162 段。S. Sriram 的另 6 段历史记录仅放在 Michigan `historical_profiles`，不在当前教师数及上述 214 段中。

## 目录争议的具体处理

### Chicago

实际读取 [Marketing Academic Areas](https://www.chicagobooth.edu/faculty/academic-areas/marketing) 页面自身使用的同源公开 Coveo 响应：

`https://www.chicagobooth.edu/coveo/rest/search/v2?aq=%40facultydirectoryacademicdepartments%3D%22Marketing%22%20%40z95xdatabase%3D%22web%22&numberOfResults=100&pipeline=facultydirectory`

公开 web 数据库 `totalCount=24`，单次返回 24 条，没有漏页；19 条明确 `Tenured` / `Tenure-Track`、5 条 `Adjunct`。原不加数据库限制的 48 条由 web/master 两份版本造成，不是 48 人。主目录 19 名研究成员与官方 PhD 领域页相符。批次保留 24 个原始姓名、5 项排除、组件 URL、总数和 SHA256；个人 tenure 状态只使用目录明确 faculty type。完整仅指这份已穷尽的公开目录范围。

### Yale

[当前 Marketing 目录](https://som.yale.edu/faculty-research/faculty-directory/marketing) 与 [2026–27 Management 官方清册](https://catalog.yale.edu/management/administration-faculty/) 都具名列出 Alex Burnap 和 Lan E. Luo，共 14 名研究教师。另有 2 名 Senior Lecturer、1 名 Emeritus 明确排除。

旧招聘领域介绍称 13 人并遗漏 Alex；未找到 Alex 离任证据，不能据人数较小的招聘介绍删人。采用两份具名官方枚举确认本批指定目录范围，保留招聘介绍与目录的来源范围差异，不推断它们是同一份 HR 人数统计。

### NYU

[Tenured/Tenure-Track 及 Affiliated 完整表](https://www.stern.nyu.edu/experience-stern/about/departments-centers-initiatives/academic-departments/marketing/faculty-staff/tenured-tenure-track-faculty) 有 26 行。旧记录一律排除 4 名 affiliated，丢掉了 3 个实际 NYC 研究关联成员：

- [Bruce S. Buchanan](https://www.stern.nyu.edu/faculty/bio/bruce-buchanan)：官方个人页同时列 Business and Society 与 Marketing，正文明确 Professor of Marketing。
- [Anindya Ghose](https://www.stern.nyu.edu/faculty/bio/anindya-ghose)：官方明确 TOPS 与 Marketing 联合任职；另读校方 CV。
- [Yaacov Trope](https://www.stern.nyu.edu/faculty/bio/yaacov-trope)：心理学教授，Marketing 为 affiliated appointment。

三人分别保存 `joint_research` / `affiliated_research`，不混为主系 22 人，不把表格标题自动当作每人的 tenure 证据。22+3 与院系概览 25 人仅作交叉核对，不能反过来证明这三人均为主系 TT。

[Yuxin Chen](https://www.stern.nyu.edu/faculty/bio/yuxin-chen) 官方明确现职 NYU Shanghai、2013 年 7 月加入，实际所在地中国，保留境外附属名单，不建美国现职档案。Eitan Muller 页面同时显示 Professor 与 Research Professor，个人 tenure 继续未知。

### Michigan

[当前 Marketing 过滤目录](https://michiganross.umich.edu/faculty-research/directory?department=31) 的 24 张卡片全部归类。直接程序请求 Ross 返回 403，公开网页阅读器实际成功读到完整名单及校方新闻。

[2026-03-20 校方文章](https://rossweb.bus.umich.edu/faculty-staff-blog/2026/03/20/connecting-research-teaching-and-real-world-impact-the-marketing-area-at-michigan-ross/) 所述 15 名研究教师是当时快照。后续变化各有具体证据：Jessica Fong 的 Maryland 新 CV 明确 Michigan 2020–2026 → Maryland 2026–Present；[Samantha Kassirer 的新聘报道](https://michiganross.umich.edu/news/michigan-ross-adds-11-faculty-members) 与官方 CV 明确 Michigan 2026–、Toronto 博后 2024–2026；[2026-08-28 Ross 讣告](https://rossweb.bus.umich.edu/faculty-staff-blog/2026/08/28/michigan-ross-community-members-mourn-the-loss-of-associate-dean-s-sriram/) 确认 S. Sriram 已故。逐名变化与 15−2+1=14 相符，算式仅作核对，不替代证据。

Jessica 旧卡片保留为滞后观察，不重复建人。Sriram 的 March2026 CV 明确 Purdue PhD2004 和 Binghamton→Connecticut→Michigan 的职级片段，单独保留历史资料；CV 当时的 present 不延伸成 October 在职。August19 是讣告提到的葬礼日期，不填为死亡日。

Fred Feinberg 的旧 CV 教育区间为 1984–1988，Ross 与[独立 Statistics 教育栏](https://lsa.umich.edu/stats/people/affiliated-faculty/feinf.html) 明确 PhD1989，采用明确授位年并保留旧区间。旧 CV 的 Michigan1998–2022 任职片段仍按原文保存，不能据此推断 2022 离任，因为当前目录仍列在职。

### Notre Dame

[完整全院目录](https://mendoza.nd.edu/mendoza-directory/?employeetype=Faculty) 中 Marketing 17 项 = 14 研究职务 + 3 Teaching。当前短名与清册法定名分两种方式核验：

- 7 个省略中间名的写法由目录卡片的个人 URL 与既有稳定个人 URL 精确对齐，只规范末尾斜杠；未按姓名近似合并。
- [官方 2024–25 新聘](https://ndworks.nd.edu/news/new-faculty-hires-2024-25/) 直接写 `Ji Hyun “Jianna” Jin`；当前个人页与 September2026 CV 同为 `jjin5@nd.edu`。
- [Shijie Lu 官方页](https://new.business.nd.edu/directory/shijie-lu) 的邮箱 `slyu@nd.edu`、论文作者 `Shijie Lyu`、同邮箱 August2026 CV 的 `Shijie Lu` 以及 USC2015/UNC/Houston/Notre Dame 路径相互对应，沿用 Lyu 的既有稳定 ID。

[June30 学年清册](https://catalog.nd.edu/undergraduate/faculty/) 另有 James Roger Otteson 的 Marketing 标签；当前个人页和 September2026 CV 的主系/职务为 Business Ethics and Society、另兼 Political Science。因此单列清册跨院系观察，保留本人完整档案和历史，不把它当未知姓名冲突，也不虚构 Marketing 任职终止日期。

## 博士年与职业证据

本轮补齐的 19 个原有博士年缺口：Bartels2007、Misra1999、Avner2019、Ivan2024、Behnam2025、Shervin Marketing2018、Ghili2017、Novemsky2000、Runshan2022、Minah2015、Joshua2020、Jiarui2023、Eitan1977、William2025、Vishal2003、Maria2022、Raluca2016、Qiaochu2024、Feinberg1989。

大部分来自实际读取的公开 CV 学位行。重要的独立材料：

- [CMU 官方毕业生初职表](https://www.cmu.edu/tepper/programs/phd/job-market) 表头明确 `Graduation Year`，据此确认 Qiaochu2024、Behnam2025；不是把一般 placement 表年份改称博士年。
- [Princeton 官方新闻](https://www.princeton.edu/index.php/news/2024/03/28/daniel-kahneman-pioneering-behavioral-psychologist-nobel-laureate-and-giant-field) 明确 Nathan Novemsky earned his PhD in2000。
- [NYU 2021–2023 Bulletin](https://www.stern.nyu.edu/sites/default/files/2023-06/Final_2021-2023_Bulletin_FINAL-ua.pdf) PDF 第 95/96 页明确 Joshua PhD2020、Eitan PhD1977；另读 2017–2019 Bulletin 第 90 页交叉核对 Eitan。Joshua 旧2020 CV 直接请求重定向失败/403，不把它写成成功抓取。
- [Berkeley 论文库 PDF](https://escholarship.org/content/qt3zn1f4k8/qt3zn1f4k8.pdf) 的题名页与摘要明确 Minah Hong Jung、PhD Business Administration、Spring2015；与本人已完成 PhD 的 CV 和 Haas 初职表交叉核对，标为 corroborated。
- [UCLA 官方托管 Maria CV](https://www.anderson.ucla.edu/sites/default/files/document/2024-07/Maria-Giulia-Trupia_CVJune-24.pdf) 明确 IESE Marketing-specialization PhD September2022，修正博士所在地为西班牙。UCLA 博后 present 仅代表 June2024 CV 当时观察，NYU July2025 入职另有现职页证据，不猜博后结束月。
- Shervin Tehrani 官方 CV 明确两个真实博士：Toronto Marketing2018、Toronto Mathematics2012。Dmitri Kuksov 官方 CV 也有两个博士：Berkeley Marketing2003、BYU Mathematics1998。双博士分别保存，不能因年份不同删掉一项或混为同一学位冲突。

职业事件保留年/月精度、来源、原文、来源观察时间；访问和博后独立类型。Sanjog Misra 原 CV 的 Rochester/UCLA 重叠、Ying Xie 的 Rutgers/WashU visiting 重叠都按原文保留，不擅自裁掉日期。UTD Khai Chiong CV 明确 September2026 Associate with tenure，更新现职并保留早期 AP、Yale访问与 USC博后。

## 仍存在的具体限制

UTD 当前完整院系目录仍无法确认。实际重试 Marketing faculty-research、PhD 教师页、Jindal全院 faculty、JSOM目录 API 和旧详情接口，分别出现 TLS/fetch failed、502。2026 综合 catalog 虽可读，但跨学科标签并不等于当前 Marketing 全名册，不能用它强行宣布完整。独立官方 Endowed Chairs 页明确 Brian Ratchford 为 Emeritus/Former，纠正其在综合 catalog 中仍显示 Professor 的时效差异；Simon Kim 为明确博士候选人，不因 seminar 所属 UTD 就认定是漏录教授。

已改用大学托管 CV CDN、Dox、现/前任机构官方页和本人公开 CV，实际补入 UTD 的 Ivan、Behnam、Shervin、Khai、Joonhwi、Kuksov、Upender、Ying、Samir 等职业片段。Nanda 的官方个人 URL HTTP200 实际转到通用 IT 网页责任说明，并非可读履历；Samir 的 Católica2018 CV 本轮 TLS 失败；Sanjay 本人校方托管页可读前任机构但未列任职年。未查到的区间继续未知。旧 CV 的 present 不自动延伸成 2026 连续任职证明。

全部职业序列仍标 `career_sequence_complete=false`。102 份档案有博士年不代表 CV、晋升、首职、跨校任职和每个日期均完整；其中 15 人仍无任何有日期职业片段。学校名单完整性仅升级已明确穷尽的五个目录范围，不能用于宣布五校所有毕业 cohort 完整。

## 本批验证与导入

已验证 6 个 host ID、所有 `roster_names` 唯一且能解析至既有或本批人员、既有 ID 的 host 与身份材料、博士年新增原文含年份、日期区间先后、排除名单无重复、NYU 实际校区和 Sriram 历史独立范围。最终批次 74 人（71 修订、3 新增）。

维护者可运行：

```powershell
node scripts/import-faculty-batch.mjs data/research-updates/2026-10-22-faculty-followup-six-schools.json
```

已实际 dry-run 通过。该命令默认不写权威数据；本研究子任务只交付批次与说明，由整合任务按既有事务导入、全站校验和发布流程处理。本文不声明已独立上线。
