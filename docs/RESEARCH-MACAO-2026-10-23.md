# 澳门 Marketing / IO 教师反查审计（2026-10-23）

批次：`faculty-macao-2026-10-23`。本文件与同名 JSON 已冻结供根代理审阅、导入；研究代理未改动权威数据、未执行 `--apply`、未提交。

## 实际交付与范围

三校保留 42 份真实接收端教师档案：32 名主要 Marketing 研究教师、6 名跨领域关联研究教师、2 名教学教师，另有 2 名官方明确研究 Industrial Organization 的教师独立成组。博士授位年已确认 35 人，7 人保留未知或冲突；124 条有明确年份或月份的职业片段。职业片段不等于完整职业序列，不宣称首职，不自动进入 placement 分母。

| 学校 | 原始目录成员 | 本批保留 | 主要 Marketing | 关联研究 | 教学 | 独立 IO | 明确博士年 | 有日期职业段 | 逐人排除 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Macau University of Science and Technology | 14 | 14 | 14 | 0 | 0 | 0 | 14 | 35 | 0 |
| University of Macau | 33 | 13 | 12 | 1 | 0 | 0 | 10 | 38 | 20 |
| City University of Macau | 53 | 15 | 6 | 5 | 2 | 2 | 11 | 51 | 38 |

**完整性的限定**：三个 `directory_complete` 仅说明已按下面明确范围，将所读官方目录快照中的全部成员对齐到“纳入/单列/排除”。不表示三校全部院系的相关研究者无一遗漏，不表示学历和职业路径资料齐全，更不表示任何毕业 cohort 完整。

## 目录与资格核对

### Macau University of Science and Technology

[官方独立 Marketing 目录](https://msb.must.edu.mo/person/id-15212.html?locale=en_US) 明示 `Marketing（14）`，14 个独立官方 CV 链接全部取得并提取全文，对姓名、职称、机构邮箱、博士与履历部分逐项核对；目录顺序 14 人与本批 14 人一一对应。其他管理学专业以及单独的 Part-time Staff 栏不属于本名单。完整性只覆盖这份官方 Marketing 专门列表。

### University of Macau

[Management and Marketing → Staff](https://fba.um.edu.mo/mmi/staff/) 的管理员卡片与 Staff 卡片按同一精确个人 URL 去重，得到 33 人。33 份官方个人页均实际读取；12 人有当前 Marketing 教授序列职称；Chanthika Pornpitakpan 当前明确为 Management，但其官方简介及 46 页 CV 确认长期 Marketing / consumer behavior 研究、2008—2022 年 Marketing 任职，故作为 `affiliated_research` 单列。其余 20 人保留个人 URL、研究原文与排除原因；不能因博士或本科为 Marketing，便把当前组织行为、战略、管理学教师算入 Marketing 名册。

院系简介过去“27 人”的描述与 Staff 当前网页不同，未把旧描述当作当前人数。完整声明限定此 Department Staff 快照；不把院系范围偷换成全校所有 Marketing 相关研究者。

### City University of Macau

官方全职教师目录三页全部读取：[1—25](https://fob.cityu.edu.mo/en/full-time-academic-staff)、[26—50](https://fob.cityu.edu.mo/en/full-time-academic-staff?p=2)、[51—53](https://fob.cityu.edu.mo/en/full-time-academic-staff?p=3)。53 个独立个人页的 Current Research 与 Teaching 全部核对，再选择学科，未将整个商学院 53 人当作 Marketing。15 名保留人员的真实官方 CV 全部取得。

- 主要 Marketing 研究教师 6 人：Kaidong Yu、Liangbo Zhang、Rui Liu、Lingyu (Lynn) Lin、Li (Lily) Liu、Mingxia Zhu。
- 跨领域关联研究 5 人：Liujian Huang（Operations–Marketing interface）、José Ferreira Pinto（管理学计量／韧性，明确 Marketing 与 Marketing Research 教学）、Lifu Li（直播电商／信息系统）、Yi Li（营销策略与智能服务）、Ziqing Yuan（移动电商与渠道／信息系统）。保留原始学位和研究定位，不强改为 Marketing PhD 或量化营销方向。
- 教学教师 2 人：Sunny Zhenzhen Nong、Zhuohang Li；单独 `faculty_type=teaching`。
- 独立 IO 2 人：Yat Fung Wong、Zhutong Gu；当前官方研究字段明确 Industrial Organization，不计入主要 Marketing 32 人。
- 其余 38 人逐人排除，完整姓名、研究原文、URL、抓取哈希在 JSON 中。纯管理、会计、金融、一般经济或信息系统研究，不因一个 AI / market / service 关键词自动归为 Marketing。

## 逐人学历与有日期履历

| 人员 | 学校 | 类型 | 博士授予校／专业 | 博士年 | 日期职业段 | 个人页或 CV |
|---|---|---|---|---:|---:|---|
| Alice Ling Jiang | MUST | research | Southwest Jiaotong University / Marketing | 2010 | 3 | [来源](https://wm-fs2.must.edu.mo/group1/M00/08/D1/rBCDo2iljWiAOcE2AAR2dXJeN6g964.pdf) |
| James G.C. Shi | MUST | research | Hong Kong Baptist University / Marketing | 2005 | 6 | [来源](https://wm-fs2.must.edu.mo/group1/M00/05/79/rBCDpGaPiyiAFx2NABZQz5QRUDA400.pdf) |
| Yong Dong Shi | MUST | research | Huazhong University of Science and Technology / Business Administration | 2008 | 3 | [来源](https://wm-fs2.must.edu.mo/group1/M00/08/E0/rBCDpGiv_CKABdrhAAPx2N-KvRI005.pdf) |
| Huimei Bu | MUST | research | Macau University of Science and Technology / Marketing | 2013 | 2 | [来源](https://wm-fs2.must.edu.mo/group1/M00/08/D2/rBCDo2imjKSAf7FoAATUtln4Faw264.pdf) |
| Yao Qin | MUST | research | City University of Hong Kong / Marketing | 2014 | 3 | [来源](https://wm-fs2.must.edu.mo/group1/M00/08/C3/rBCDpGiZXemAYeJIAASo8AGTF0s777.pdf) |
| Lei Zheng | MUST | research | Peking University / 专业未披露 | 2019 | 2 | [来源](https://wm-fs2.must.edu.mo/group1/M00/05/CF/rBCDpGbGuSSAJeZCAAWXJe_Ancs848.pdf) |
| Caleb Huanyong Chen | MUST | research | Hong Kong Baptist University / Management | 2013 | 2 | [来源](https://wm-fs2.must.edu.mo/group1/M00/0C/93/rBCDpGrR1IyAJqkoAAW1v30xMpg372.pdf) |
| Yanchen Li | MUST | research | Southwest Jiaotong University / Management | 2010 | 1 | [来源](https://wm-fs2.must.edu.mo/group1/M00/06/63/rBCDo2bO1huAS8tKAAKMLKPU0D8895.pdf) |
| Haibo Pan | MUST | research | City University of Hong Kong / Marketing | 2022 | 1 | [来源](https://wm-fs2.must.edu.mo/group1/M00/08/D1/rBCDpGimfxOAStQtAAKyyPfQjcE384.pdf) |
| Yi Peng | MUST | research | Singapore Management University / Marketing | 2022 | 2 | [来源](https://wm-fs2.must.edu.mo/group1/M00/09/CA/rBCDpGkuoeWAUaSoAAIC0Ol9m7M300.pdf) |
| Jie Sheng | MUST | research | University of Glasgow / Management (Marketing) | 2024 | 3 | [来源](https://wm-fs2.must.edu.mo/group1/M00/0C/20/rBCDo2qVA7GAZm_yAAIXl2RyPJs112.pdf) |
| Edmund Yangming Wu | MUST | research | Curtin University / Marketing | 2025 | 3 | [来源](https://wm-fs2.must.edu.mo/group1/M00/0A/1A/rBCDo2lopwWAQ-aVAAKhL-StNbI630.pdf) |
| Yanan Yu | MUST | research | North Carolina State University / Textile Technology Management | 2021 | 2 | [来源](https://wm-fs2.must.edu.mo/group1/M00/08/D2/rBCDpGimoAuAbLH1AAJ7yFLtAOI107.pdf) |
| Xiangyun Zhang | MUST | research | Sun Yat-sen University / Marketing | 2025 | 2 | [来源](https://wm-fs2.must.edu.mo/group1/M00/0C/03/rBCDpGqFgNKAUs8sAAL5L9n5J5Q843.pdf) |
| Cheris Wing Chi Chow | UM | research | City University of Hong Kong / Marketing | 2009 | 3 | [来源](https://fba.um.edu.mo/faculty/cherischow/) |
| Lancy Vai Iun Mac | UM | research | ISCTE - University Institute of Lisbon / Marketing | 未知 | 0 | [来源](https://fba.um.edu.mo/faculty/lancymac/) |
| Fangyuan Chen | UM | research | Hong Kong University of Science and Technology / Marketing | 2014 | 4 | [来源](https://fba.um.edu.mo/faculty/fangyuanchen/) |
| Isabel Siu Fong Fu | UM | research | Hong Kong Polytechnic University / 专业未披露 | 未知 | 0 | [来源](https://fba.um.edu.mo/faculty/isabelfu/) |
| Grace Ying Ho | UM | research | Chinese University of Hong Kong / Marketing | 2007 | 3 | [来源](https://fba.um.edu.mo/faculty/graceho/) |
| Michael King Man Hui | UM | research | London Business School / 专业未披露 | 1988 | 8 | [来源](https://fba.um.edu.mo/faculty/michaelhui/) |
| Matthew Ting Chi Liu | UM | research | Peking University / Management | 未知 | 3 | [来源](https://fba.um.edu.mo/faculty/matthewliu/) |
| Esther Qianqian Liu | UM | research | Hong Kong Polytechnic University / Marketing | 2024 | 2 | [来源](https://fba.um.edu.mo/faculty/estherliu/) |
| Kao Si | UM | research | Chinese University of Hong Kong / Marketing | 2018 | 0 | [来源](https://fba.um.edu.mo/faculty/kaosi/) |
| Joseph Adea Sy-Changco | UM | research | Aston University / Marketing | 2007 | 0 | [来源](https://fba.um.edu.mo/faculty/josephsychangco/) |
| Elaine Li Yan | UM | research | Monash University / Marketing | 2019 | 0 | [来源](https://fba.um.edu.mo/faculty/lyliyan/) |
| Xinyue Zhou | UM | research | University of Arizona / Educational Psychology | 2004 | 7 | [来源](https://fba.um.edu.mo/faculty/xinyuezhou/) |
| Chanthika Pornpitakpan | UM | affiliated_research | University of British Columbia / International Business / Marketing | 1995 | 8 | [来源](https://fba.um.edu.mo/faculty/chanthikap/) |
| Kaidong Yu | CityU | research | University of Glasgow / Marketing | 未知 | 3 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/578) |
| Liujian Huang | CityU | affiliated_research | South China University of Technology / Management Science and Engineering | 2022 | 1 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/620) |
| José Ferreira Pinto | CityU | affiliated_research | University of Macau / Business Administration (SME resilience) | 2023 | 10 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/669) |
| Lifu Li | CityU | affiliated_research | University of Technology Sydney / Information System | 2022 | 4 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/783) |
| Liangbo Zhang | CityU | research | Harbin Institute of Technology, Shenzhen / Management Information Systems | 2025 | 5 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/787) |
| Rui Liu | CityU | research | Newcastle University / Marketing | 2024 | 0 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/891) |
| Yi Li | CityU | affiliated_research | Hefei University of Technology / Management Science | 2024 | 0 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/890) |
| Lingyu (Lynn) Lin | CityU | research | Nanyang Technological University / Marketing (Quant) | 2026 | 1 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/1003) |
| Li (Lily) Liu | CityU | research | University of Nottingham / Marketing | 未知 | 1 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/1010) |
| Ziqing Yuan | CityU | affiliated_research | City University of Hong Kong / Information Systems | 未知 | 4 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/1007) |
| Mingxia Zhu | CityU | research | University of Macau / Marketing | 未知 | 1 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/1012) |
| Zhuohang Li | CityU | teaching | Macau University of Science and Technology / Management | 2014 | 5 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/161) |
| Sunny Zhenzhen Nong | CityU | teaching | University of Macau / Business Administration (Hospitality Management) | 2026 | 7 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/784) |
| Yat Fung Wong | CityU | IO research | Boston College / Economics | 2015 | 3 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/475) |
| Zhutong Gu | CityU | IO research | Rutgers University / Economics | 2017 | 6 | [来源](https://fob.cityu.edu.mo/en/full-time-academic-staff/942) |

## 缺口、冲突与已尝试资料

| 人员 | 字段与实际阻碍 | 已读资料 |
|---|---|---|
| Lancy Vai Iun Mac | Not disclosed in the official education information read. | [官方个人资料](https://fba.um.edu.mo/faculty/lancymac/) |
| Isabel Siu Fong Fu | 官方个人页确认 PolyU 博士，无年份。PolyU 官方论文库搜索索引提示 2007，但直接读库返回 Waiting JavaScript challenge，因此没有把索引年写成确认授位年。 | [官方个人资料](https://fba.um.edu.mo/faculty/isabelfu/) |
| Matthew Ting Chi Liu | Not disclosed in the official education information read. | [官方个人资料](https://fba.um.edu.mo/faculty/matthewliu/) |
| Kaidong Yu | Conflict: official employer historical CV states PhD Marketing 2017; University of Glasgow doctoral repository explicitly states Date of Award 2018. Current CV omits the year. Both primary sources preserved; no year selected. | [官方个人资料](https://fob.cityu.edu.mo/en/full-time-academic-staff/578) |
| Li (Lily) Liu | Not disclosed in the official education information read. | [官方个人资料](https://fob.cityu.edu.mo/en/full-time-academic-staff/1010) |
| Ziqing Yuan | Official CV prints the doctoral date row in reversed order “Nov 4, 2021 - Sep 1, 2016”; completion is not silently inferred from reversed dates. Degree institution and subject are explicit. | [官方个人资料](https://fob.cityu.edu.mo/en/full-time-academic-staff/1007) |
| Mingxia Zhu | Not disclosed in the official education information read. | [官方个人资料](https://fob.cityu.edu.mo/en/full-time-academic-staff/1012) |

- Kaidong Yu：[2025 年历史官方 CV](https://fob.cityu.edu.mo/en/uploads/ueditor/file/20251217/1765960659292808.pdf) 的 Education 写 `Ph.D Marketing, University of Glasgow 2017`；[Glasgow 官方授位库](https://theses.gla.ac.uk/30599/) 明确 `Date of Award: 2018`，不是仅把仓储上传年当毕业年。现 CV 不写年，所以 `phd.year=null`，双方年份与真实摘录全部保存。另同名 Manchester Sociology PhD 2023 的研究者未合并。
- Ziqing Yuan：官方 CV 的博士日期印成 `Nov 4, 2021 - Sep 1, 2016`。不未经说明调换源日期，博士年保留 null，记录两个原值和原因；有明确起止的任职片段正常保留。
- Zhuohang Li：[当前目录](https://fob.cityu.edu.mo/en/full-time-academic-staff/161) 为 Senior Lecturer，旧 CV 说 2018 年 8 月起 Assistant Professor。当前标题遵循当前目录，旧 CV 仅存原时点履历片段，不推测降职、转岗或其日期。
- Kao Si：[UM 个人页](https://fba.um.edu.mo/faculty/kaosi/) 不写博士年；[CUHK 官方导师页](https://www.bschool.cuhk.edu.hk/staff/dai-xianchi/) 链接的[导师个人站已毕业博士名单](https://xianchi.wixsite.com/homepage/chinese) 明确“司考 (Kao Si) 毕业于2018年”，并同列澳门大学。采用该明确毕业记录，未把另一份 CV 的 dissertation committee 年份充当授位年。
- Elaine Li Yan：[Monash 官方毕业名单](https://www.monash.edu/business/research/our-researchers/previous-phd-candidates-and-placements/marketing) 的 Year of Graduation 表明确 Li Yan / 2019 / The Effects of Social Class on Green Consumption / UTS。与 UM 的 Monash Marketing 学位、UTS 经历和相关研究一致。浏览研究工具直接打开完整表，非只读搜索摘要；普通 raw HTTPS 403，故该来源 `content_sha256=null`，没有伪造哈希。

## 身份关联与口径保护

- `ntu-lingyu-lin`：CityU 官方个人 URL 与 CV URL 均精确匹配已有 placement 附件；CV 的全名 Lingyu (Lynn) Lin、NTU Marketing (Quant) 博士 2026、当前机构完全一致。CV 明确 Updated: Aug 2026，保留来源月精度。
- `hong-kong-polytechnic-university-qianqian-liu`：当前 UM 个人页明确 Marketing PhD 2024；PolyU 官方毕业 placement 表同时明确 Qianqian LIU / 2024 / Assistant Professor, University of Macau。保存两方身份依据，未仅凭姓名合并。
- 所有当前 tenure 均未知。仅 Zhutong Gu 的历史 Peking University 工作在源 CV 明写 tenure-track、Chanthika 的历史 Monash Malaysia 工作明写 Tenured；这些不移植为当前澳门职位的 tenure 状态。
- 年精度、月精度分别保留；2013 年访问经历不被扩写成整年任职。合并写作 Assistant Professor / Associate Professor 的区间不人为拆出晋升年。现职开始不能自动成为首职。
- 旧 CV 的 present 只保留为 `source_snapshot_only=true`，不自动延伸到 2026 年检查日；目录现职与旧职业区间分别储存。

## 资料读取与复核

HTML 资料保存真实 URL、检查日期、原文短摘录与 SHA256。PDF 均实际取得并对全部页面提取文本，`page_count` 为真实页数；人工核验范围是教育、任职和研究兴趣部分，未声称逐条审计几十页论文列表。每条来源均写 `read_scope`、`extraction_scope`；哈希针对实际取得的原始响应字节。未将只登记的 CV 链接写成已经读取。

UM 部分页面通过浏览研究工具返回 403/503，但普通公开 HTTPS 对真实 Staff 和个人页读取成功 200；两类访问结果都在批次保存。没有登录、猜测私有 API 或绕过权限。PolyU 学位库 JavaScript challenge 没有强行突破，博士年保留未知。

## 本地自检

已运行 `node scripts/import-faculty-batch.mjs data/research-updates/2026-10-23-faculty-macao.json`，仅 dry run：42 added、2 linked、1 degree year added、3 schools；`apply=false`。权威 faculty/records 未写入。

附加自检通过：42 人 current.region=MO；35 个非空博士年均在实际来源短摘录中含对应年份，并支持 `phd.year`；7 个未知年均有字段级原因；所有 `sources.supports` 路径存在；124 个职业片段均有对应原文证据；3 个目录的成员数严格等于纳入加逐人排除，无重复成员。

JSON 原始字节 SHA256：`fab49c99c00fcd19750bc1fe064a20ffeefcd4859562bab0fa17705260a81c11`。
