# 北美A组16校教师反查 · 2026-10-22

本批次按预先固定的16所范围逐校调查，未按博士来源或就业结果选人。所有数字从随附JSON计算。

- 研究教授主记录：290人；含明确joint/secondary观察，相关字段单列。
- 已列博士院校：279人（其中1人在所读CV中仍仅为PhD Candidate，不记已授位）；院校未知11人。
- 已有博士授位年：225人；未知65人。
- 有年份的职业/加入院校片段：241条，覆盖110人；另有290条本次现职观察。现职观察不算首职或完整职业史。
- 实际读取公开CV前四页：217人。每人cv_read保存实际页数、总页数、SHA256，失败尝试单列。
- 独立排除/历史目录条目：288条；11校确认界定范围内的目录对齐，其他校保留partial。

| 项目 | 人数 | 博士院校 | 博士年 | 职业片段 | 排除 | 目录状态 |
|---|---:|---:|---:|---:|---:|---|
| [columbia-university-marketing](https://business.columbia.edu/directory/departments/marketing) | 21 | 21 | 18 | 48 | 60 | 范围内对齐 |
| [university-of-chicago-marketing](https://www.chicagobooth.edu/phd/dissertation-areas/marketing) | 19 | 18 | 16 | 15 | 0 | 部分核验 |
| [university-of-washington-marketing](https://foster.uw.edu/faculty-research/directory/?_profile_department=marketing-international-business) | 17 | 17 | 16 | 33 | 29 | 范围内对齐 |
| [cornell-university-marketing](https://business.cornell.edu/expertise/faculty-areas/marketing-management-communications/) | 25 | 25 | 25 | 28 | 27 | 范围内对齐 |
| [university-of-texas-at-dallas-marketing](https://marketing.utdallas.edu/program-resources/faculty-research/) | 15 | 15 | 12 | 0 | 12 | 部分核验 |
| [university-of-southern-california-marketing](https://www.marshall.usc.edu/departments/marketing/faculty) | 21 | 21 | 15 | 29 | 24 | 范围内对齐 |
| [indiana-university-marketing](https://kelley.iu.edu/faculty-research/departments/marketing/faculty/index.html) | 24 | 20 | 16 | 21 | 24 | 范围内对齐 |
| [university-of-wisconsin-madison-marketing](https://business.wisc.edu/faculty-research/marketing/faculty/) | 17 | 16 | 13 | 20 | 14 | 范围内对齐 |
| [university-of-maryland-marketing](https://www.rhsmith.umd.edu/departments/marketing/faculty) | 18 | 18 | 16 | 2 | 10 | 范围内对齐 |
| [yale-university-marketing](https://som.yale.edu/faculty-research/faculty-directory/marketing) | 14 | 13 | 12 | 0 | 3 | 部分核验 |
| [texas-a-m-university-marketing](https://mays.tamu.edu/directory-teams/arch-h-aplin-iii-80-department-of-marketing/) | 21 | 20 | 16 | 0 | 39 | 范围内对齐 |
| [new-york-university-marketing](https://www.stern.nyu.edu/experience-stern/about/departments-centers-initiatives/academic-departments/marketing/faculty-staff/tenured-tenure-track-faculty) | 22 | 21 | 12 | 22 | 4 | 部分核验 |
| [university-of-michigan-marketing](https://michiganross.umich.edu/faculty-research/areas-of-study/marketing) | 14 | 14 | 13 | 0 | 10 | 部分核验 |
| [university-of-north-carolina-at-chapel-hill-marketing](https://www.kenan-flagler.unc.edu/faculty/?academic-areas=marketing) | 13 | 13 | 6 | 7 | 8 | 范围内对齐 |
| [duke-university-marketing](https://www.fuqua.duke.edu/faculty-research/directory/all) | 17 | 15 | 11 | 0 | 9 | 范围内对齐 |
| [university-of-california-berkeley-marketing](https://haas.berkeley.edu/academic-area/marketing/) | 12 | 12 | 8 | 16 | 15 | 范围内对齐 |

## 实际读取与范围

- **columbia-university-marketing**：Marketing Division当前官方目录，21名研究教授；目录同时列出的教学、兼职、访问、荣休、工作人员独立排除。 已完整读取官方目录全部姓名段落（73–654），没有依赖图片标题推断姓名。
- **university-of-chicago-marketing**：官方PhD Marketing领域19名研究教师的完整所列范围。 主Academic Areas页面使用动态Coveo组件，改读官方PhD领域页；该名单可对齐，但不能据此确认整个Marketing系当日在职名册完整，也未虚构教学/荣休排除名单。
- **university-of-washington-marketing**：Marketing and International Business官方筛选目录：46条原始卡片，17名研究教授，其余教学/荣休等排除。 官方department筛选结果完整读取；博士与职业信息独立核验。
- **cornell-university-marketing**：Marketing and Management Communications官方跨学院研究领域目录：52条原始卡片，研究教授25，教学/荣休等27。 包括Dyson、Johnson及Nolan Hotel学院；不会将Food Marketing和管理沟通岗位强行统一成Marketing PhD。
- **university-of-texas-at-dallas-marketing**：官方Marketing目录/PhD领域教师列表和2026年大学官方faculty roster对照，研究教授15名。 动态详情接口https://jsom.utdallas.edu/staff-list.php对15人分别请求均fetch failed；部分旧个人页仅通用模板或404。2026官方catalog补学历，2024/2025官方新聘新闻补Ivan Li/Behnam Mohammadi；不能确认目录完整，不能用新聘新闻年份当授位年。
- **university-of-southern-california-marketing**：官方Marketing Full-Time Faculty完整CMS名单27人，研究教授19；Courtesy/Joint另2，教学/附属/兼职/荣休24独立排除。 读取公开页面随HTML提供的people-list CMS数据，nextPage为0；区分19本系研究教师与Robert Kozinets/Norbert Schwarz两名joint。
- **indiana-university-marketing**：官方Marketing五页结果48条，按原始职称纳入24名研究教授，排除24名教学/临床等。 使用页面脚本实际调用的faculty-chunk.php公开分页2–5，department=57；不是只读第一页。
- **university-of-wisconsin-madison-marketing**：官方Marketing完整31条目录，17名研究教授，14条教学/行政等排除。 Verda Blythe和Alan Stoffer个人页证实教学/行政，不作为研究教授；兼任行政职务的研究教授不因Dean头衔被排除。
- **university-of-maryland-marketing**：官方Marketing完整三页28条，18名研究教授，10名临床/荣休排除。 完整读取page=0、1、2；Jessica Fong使用2026新版官方链接CV归入Maryland，保留Michigan2020–2026职业事件。
- **yale-university-marketing**：官方Marketing faculty directory共17条，纳入14名研究教授，排除2名senior lecturer和1名emeritus。 官方招聘页另称13名full-time，与目录14名不一致；保留未确认完整状态，未根据较小人数删人。
- **texas-a-m-university-marketing**：官方Arch H. Aplin III Department of Marketing完整60条团队目录，21名研究教授，其余39条单独排除。 团队页混有学生、教学与工作人员；Dean Emeritus同时仍为现任Professor的Eli Jones保留，未错误当Professor Emeritus。
- **new-york-university-marketing**：官方Tenured/Tenure-Track表26条：22名本系研究教授，4名affiliated独立排除。 学校页面另一口径称25名TT，与该表不一致；只确认已读取表格的对齐，不宣布整个系现职完整。Maria Trupia由官方个人页核定完整姓名Maria Giulia Trupia。
- **university-of-michigan-marketing**：官方department=31、status=Active目录24条，原15名研究教授；Jessica Fong转校后保留14名主在职观察，10条排除/历史。 Michigan目录及March2026旧CV仍列Jessica；Maryland新版CV明确2026转校，因此旧目录观察转排除并保留来源。受目录时效冲突，保持partial。
- **university-of-north-carolina-at-chapel-hill-marketing**：官方academic-areas=marketing筛选目录21条，研究教授13，教学/临床/荣休等8。 使用官方筛选表单真实参数，无分页；旧academic-areas/marketing/地址404后从官方Faculty目录找到筛选入口。
- **duke-university-marketing**：官方全体Faculty Directory152条中Marketing标签26条；逐人读后研究教授17，荣休8及practice-only1独立排除。 保留Scott Huettel和Gregory Samanez-Larkin两名明确Secondary Appointment，单独membership_kind；John Quelch实践岗不算Marketing研究教授。
- **university-of-california-berkeley-marketing**：官方Marketing Ladder Faculty12名；另以全体Marketing目录27条核对并排除15名专业/访问/荣休等。 官方Ladder页部分职级滞后，个人页2026年晋升更新单独保存；Przemyslaw Jeziorski位于In Memoriam，未作为现任教师。

## 重要差异与证据边界

- Jessica Fong仅保留Maryland一人：新版Maryland官方链接CV明确Maryland2026–present、Michigan2020–2026；Michigan旧目录与March2026旧CV保留在该校exclusions。没有按姓名猜测两个人相同。
- Rajeev Kohli官方同页Biography与Education分别为1984/1985；Fred Feinberg官方页1989、CV区间1984–1988；Shervin Tehrani官方catalog列Toronto PhD2012及2018。三项都保留冲突和未知，不选择有利年份。
- Elizabeth Friedman的CV为PhD2019，2021脚注是产假调整口径；Emaad Manzoor的Stony Brook2015–2016是转入CMU前博士在读，不记作另一个已完成博士。
- 博士学科不按现职推断。DBA、Marketing、Statistics、Psychology、Economics、Computer Science等原文类型分别保留。
- UTD动态接口15次实际请求失败；提供Marketing/PhD目录、2026官方大学catalog及官方新聘新闻备源。空模板不称个人履历已核验；目录完整性仍为false。
- Chicago只能确认官方PhD领域所列19人的范围，动态主目录未完整返回；NYU的26条TT表与主页25名口径、Yale14名目录与招聘文案13名存在差异；Michigan因转校后的滞后目录保持partial。
- 各人unknowns区分已读而未核定、个人页不可读、CV预览/格式受限。source_quoted与provisional_excerpt分别表示摘录充分性，不把不充分摘录虚写成确认原文。
- 本批次只改研究JSON及本说明，整合、稳定ID映射、自动检查和部署由主任务完成。

## 可复核文件

- data/research-updates/2026-10-22-faculty-na-a.json 保存人员、名单、排除条目、逐字段sources、职业区间、冲突、尝试URL与摘要哈希。
- 日期精度保持year；未从年份补月日。入校年份事件不代表已确认首职；open_interval_at_source不代表已核实连续任职到2026。
