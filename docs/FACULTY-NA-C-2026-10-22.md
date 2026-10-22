# 北美15校Marketing教师反查核验 — 2026-10-22

[冻结数据批次](../data/research-updates/2026-10-22-faculty-na-c.json)覆盖预先指定的Florida至Rice共15所接收院校，未按就业结果挑选学校或人员。`host_id`沿用`data/scope.json`；仅新增本批次和本文档，不直接覆盖正式faculty或placement数据。

本轮逐名保留186人：184名指定目录中的常规研究教授序列，另有2名研究资格待确认。已对照373条纳入/排除目录条目，187条排除记录含明确保存的重复节点；因此条目数不是独立研究教师人数。博士授予校185人已核实，博士年147人明确。只在184名研究教师内计算，博士校184/184已知、博士年146/184已知，38人年份仍未证实。未知不是零，也不能据此断言公开资料不存在。

102人的公开CV已实际读到全文，另7人读取官方PDF中包含学历与任职的相关页。346段职业记录均有起始年依据，涉及121人；65人保留当前职位及具体路径缺口。职业记录含加入本校、访问、博后、教学和临床等不同事件，不能把346当作346次转校；本批次没有将任何片段直接声明为独立核验的首职。6人与既有placement通过唯一精确个人主页/CV URL关联，并附`placement_id`和`identity_evidence`，未按姓名相似合并。

| 官方来源 / 学校 | 保留人数 | 研究资格明确 | 资格待确认 | 排除条目 | 博士校已知 | 博士年已知 | 职业片段 |
|---|---:|---:|---:|---:|---:|---:|---:|
| [University of Florida](https://warrington.ufl.edu/directory/) | 13 | 13 | 0 | 29 | 13 | 13 | 27 |
| [University of Notre Dame](https://mendoza.nd.edu/mendoza-directory/?employeetype=Faculty) | 15 | 14 | 1 | 3 | 15 | 15 | 15 |
| [University of Colorado Boulder](https://www.colorado.edu/business/faculty-research/faculty-directory/marketing-faculty) | 16 | 16 | 0 | 17 | 16 | 13 | 41 |
| [Dartmouth College](https://tuck.dartmouth.edu/faculty/faculty-directory) | 9 | 9 | 0 | 1 | 9 | 8 | 28 |
| [Pennsylvania State University](https://smeal.psu.edu/directory?dept=mktg&page=1) | 17 | 16 | 1 | 30 | 16 | 15 | 0 |
| [Western University](https://www.ivey.uwo.ca/faculty_research/directory/) | 11 | 11 | 0 | 10 | 11 | 6 | 20 |
| [University of South Carolina](https://sc.edu/study/colleges_schools/moore/directory/index.php) | 14 | 14 | 0 | 12 | 14 | 11 | 27 |
| [University of Minnesota](https://carlsonschool.umn.edu/departments/marketing/faculty) | 14 | 14 | 0 | 25 | 14 | 12 | 20 |
| [University of California, San Diego](https://rady.ucsd.edu/faculty-research/faculty-directory/) | 10 | 10 | 0 | 10 | 10 | 10 | 33 |
| [Georgetown University](https://msb.georgetown.edu/faculty-research/marketing/) | 12 | 12 | 0 | 13 | 12 | 4 | 5 |
| [York University](https://schulich.yorku.ca/specializations/marketing/) | 14 | 14 | 0 | 0 | 14 | 11 | 46 |
| [Boston College](https://www.bc.edu/content/bc-web/schools/carroll-school/academic-departments/marketing.html) | 11 | 11 | 0 | 4 | 11 | 8 | 16 |
| [University of Arizona](https://eller.arizona.edu/departments-research/schools-departments/marketing/faculty) | 11 | 11 | 0 | 10 | 11 | 11 | 38 |
| [University of Pittsburgh](https://www.business.pitt.edu/connect/faculty/faculty-marketing-and-business-economics/) | 11 | 11 | 0 | 9 | 11 | 5 | 11 |
| [Rice University](https://business.rice.edu/faculty-research/research/marketing) | 8 | 8 | 0 | 14 | 8 | 5 | 19 |

**目录完整性的适用边界**

“完整”仅指指定官方页面或页面实际公开调用的完整响应已逐名纳入/排除，不是独立HR在职清册，更不代表任何培养项目的毕业cohort完整。15校均已读指定目录，Notre Dame另保留两组姓名写法差异及跨院系资格例外，状态为`directory_snapshot_reconciled_with_identity_conflicts`；其他14校为`directory_snapshot_reconciled`。个人博士年、首职、完整职业路径、当前职级开始年分别记录，未由目录完整性推定。

- **Florida**：官方目录HTML的`data-directory-json`实际指向公开`admin-ajax.php?action=wcb_directory_list_profiles`，一次445人；按`Marketing Department`组织单元对齐42条，而非只看默认12条。教师标记、emeritus和原始职称分别判断，保留13研究教师、29排除条目。
- **Colorado Boulder**：Marketing页面显示接口错误后，读取实际PeopleListProvider脚本和页面配置，按公开JSONAPI的department673/job_type674筛选；33条全读、`links.next=null`。16研究教师；17条教学/讲师/重复节点排除。Nithya Shankar两个节点作为目录差异保存，不合成第二位研究教师。
- **Penn State**：公开Next.js RSC响应内有全校553人的完整`people`数组，实际前端每页12人。按`departmentCodesLower=mktg`过滤全部47条，未把第一页当全名单；emeritus布尔、roleSlug及title独立判断。17保留中16研究资格明确、Powell待确认，30排除。
- **Boston College**：官方Full-Time Faculty组件实际请求公开`faculty-section.json`，15条全读；11研究教师、4教学/实践职务排除。源码旧profilesList含Katherine Lemon但当前响应未返回，记录来源配置差异，不据旧配置认定现职。独立[兼职目录](https://ccc.bc.edu/content/bc-web/schools/carroll-school/faculty-research/part-time-faculty.html)尚未与主目录统一展开，完整性限定在15条全职组件。
- **Notre Dame**：新院系站直连403，Leadership四人不能作为全名单。先读[2026–27官方学年教师清册](https://catalog.nd.edu/undergraduate/faculty/)（快照2026-06-30），再通过官方旧站全院目录前后段0–1189行完整对照。当前Marketing目录17条=14研究职务+3教学职务；学年清册额外Otteson列Marketing，但现目录列Business Ethics and Society，单列待确认。两者不是随意替换分母。
- **Minnesota**：[当前院系整页](https://carlsonschool.umn.edu/departments/marketing/faculty)明确14名Tenured and Tenure-Track、7全职教学、7荣休、11兼职教学，39条逐名对齐。直连403后公开网页读取可用；另查PhD faculty旧页，其Deborah Roedder John、Alison Jing Xu分类与当前院系页不同，优先采用更明确的当前分类并保留差异。曾读取全校TT分页但后续页受限，未把该不完整分页作为完整性证据。
- **Dartmouth**：全校目录HTML完整卡片中按Marketing研究组ID51对齐9研究教授+1临床职务；独立荣休页未完成统一清册核对。完整性不扩展为全部历史、访问、兼职及荣休名册。
- **Western**：全校目录HTML按实际`data-areagroup=10`对齐21条，11研究教师+10讲师/荣休。Zuzanna Jurewicz的当前卡片缺独立个人资料链接，但本人仍完整纳入；[官方博士校友页](https://www.ivey.uwo.ca/phd/alumni/)证实Marketing博士来源。原论文链接转为平台迁移说明，未用校友展示年直接填学位年。
- **South Carolina**：原mooreschool主机证书域名不匹配，改读官方sc.edu实际目录同路径，整张表按Marketing标签对齐26条，14研究教师+12排除。Ayse Ozturk的2026 CV明确由临床序列转为Assistant Professor，分别保存时间段，没有按旧临床职称漏排当前研究职位。
- **UC San Diego**：全校目录实际Marketing与research-faculty分类逐项核对20条，10研究+10教学/讲师；跨其他院系联聘没有因博士专业不同而排除。
- **Georgetown、Pittsburgh、Rice**：官方院系整页卡片分别25、20、22条逐项对齐。Pittsburgh涵盖Marketing & Business Economics交叉教师；Rice的Arun Gopalakrishnan当前明确在Part-Time而非凭既往文章中的教授职称混入研究名单。
- **York**：Marketing专门页面Faculty14人全读。排除数0仅指该指定名单没有需排除条目，不表示该校不存在其他教学或兼职教师。
- **Arizona**：Marketing目录21条完整对齐。Anastasiya Ghosh卡片只列行政职，另读官方CV确认2020起tenured Associate Professor，纳入研究名单并保留历年Maryland、South Carolina、Arizona任职区间。

**字段证据与不能混淆的日期**

`sources[].supports`明确对应博士校/专业/年、当前机构和职务。每项含真实URL、原文短摘录和2026-10-22核验日期；CV发布日期、文件名、抓取状态与核验日分开。正文复核摘录不包含批量复制的CV全文、住址或导航内容。

- Zhe Zhang的Marketing博士证据已包含“2019 PhD (Marketing) Bauer College of Business, University of Houston”；2014 Vermont Chemistry博士在`additional_degrees`独立保留。
- Steven Shugan的CV写答辩6/77、正式毕业6/17/78，官方教育栏明确1978；不把答辩年当毕业年。
- Eileen Fischer官方母校写`PhD'88`，1988是该明确校友年份的规范化，并留转换说明；不是从1988入职倒推。
- Ziwei Cong本人CV仍保留Candidate措辞，导师官方实验室明确“PhD graduated in 2022”独立支持毕业年，措辞差异保留说明。
- June Cotte链接文件名含Dec2026，但实际PDF首页为December17,2025；没有从文件名制造未来核验日期。
- Notre Dame清册末尾括号年明确是加入本校年，因此保存为`joined_institution`，不当博士年、当前职级开始年或首职年。
- 所有职业片段标记`reported_in_source`和`source_snapshot_only`，开放结束日期仅表示原资料当时未列结束。当前职位另由current实体表达，旧CV的“present”不自动延续到2026-10-22；访问、荣誉、行政及并行职位不当作离开原校转职。

**资格与身份例外**

James Roger Otteson的当前个人资料为Business Ethics and Society、兼任Political Science；学年清册组织归类为Marketing不足以独立证明当前Marketing联聘，保留在资格待确认，不计14名当前Marketing研究职务分母。John C. Powell当前只公开Sports Business项目Director，学位栏只有MBA和BA；没有据此宣称“没有博士”，也没有把Director或授课活动自动当研究教授。

Notre Dame清册的Ji Hyun Jin / Shijie Lyu与当前目录的Jianna Jin / Shijie Lu保留原始写法、共同学历职务线索和待明确别名状态，未以姓名相似自动合并稳定ID。正式placement只提供6个精确独立URL匹配；其余由整合者依据进一步明确证据关联。

**仍未证实的具体内容**

38名研究教师的博士授予年在本批次已读资料中仍未证实，分别为：

- **University of Colorado Boulder**：Gwen Ahn；Scott Shriver；Ying Zeng。
- **Dartmouth College**：Tami Kim。
- **Pennsylvania State University**：Luciano Lapa。
- **Western University**：Kersi Antia；Jeffrey Boichuk；Rod Duclos；Zuzanna Jurewicz；Guneet Nagpal。
- **University of South Carolina**：Rafael Becerril Arreola；Felix Jan Nitsch；Xiaojing Yang。
- **University of Minnesota**：Rohini Ahluwalia；George John。
- **Georgetown University**：Rebecca Hamilton；Suh Yeon Kim；Prashant Malaviya；Alice Moon；Michael O’Donnell；Anita Rao；Debora Thompson；Luc Wathieu。
- **York University**：Peter Darke；Ashwin Joshi；Yigang Pan。
- **Boston College**：S. Adam Brasel；Gergana Nenkov；Linda Salisbury。
- **University of Pittsburgh**：Gene Anderson；Esther Gal-Or；Yafei Guo；Vanitha Swaminathan；R. Venkatesh；Yifei Wang。
- **Rice University**：Piyush Anand；Jung Youn Lee；Vikas Mittal。

这些是已读来源的证据缺口，不是“公开资料肯定不存在”的结论。Georgetown四个GU360个人页只返回Loading/CSS Error，未把200状态当作内容已核实；另用官方入职介绍、本人主页或公开CV核验博士来源。Jeffrey Boichuk当前Drive CV返回401；Miranda Goode当前SharePoint链接未取得可用文档内容，改用已读的官方历史CV。部分公开CV确实未列学历年份；保留学位校而年份null。

65人尚无可确认起止区间的职业片段，继续保留当前目录事实和逐人缺口；已有片段也不等于整段职业史连续完整。额外荣休/兼职独立目录未统一扩展，不能用“当前研究教授快照已对齐”掩盖这一范围边界。

**冻结验证**

验证通过：15个host_id与scope匹配；host+姓名唯一；学校保留名单与people成员相同；纳入/排除计数一致；待确认资格独立计数；全部已知博士年都有包含该年或明确缩写规范化的字段证据；已缓存博士摘录逐字匹配；346段起始年与结束年无倒置；未知保留null；旧CV开放区间未自动延续；placement关联仅用精确独立个人URL。本批次已冻结，最终SHA256由交付消息给出；后续正式导入、关联、模型计算与部署由根代理统一完成。
