# AU B：ANU、UQ、UWA、Adelaide University 教师反查

核验日：2026-10-23。批次：`faculty-au-b-2026-10-23`。这是公开资料的观察快照，不是博士整届就业样本，也不表示完整职业路径。只新增独立研究批次；没有直接修改权威 faculty/records、没有导入或发布。

## 实际结果

|学校|研究名录收录|博士学校已知|博士授位年已知|有职业片段人员|职业片段|本轮目录判断|
|---|---:|---:|---:|---:|---:|---|
|university-of-queensland-marketing|15|14|0|4|14|声明范围内来源人员已对齐|
|australian-national-university-marketing|9|8|5|1|1|声明范围内来源人员已对齐|
|university-of-western-australia-marketing|19|17|9|4|13|声明范围内来源人员已对齐|
|adelaide-university-marketing|50|28|21|15|64|部分覆盖，整校完整性未确认|

合计 **93 人**：普通研究教师口径82人、独立研究岗位10人、明确博士后1人。博士学校已知67/93，未知26；博士年份已知35/93，未知58。24人有共92段来源明确的职业资料，其中91段带年份，1段仅确认先前机构而无日期。研究岗位、博士后和教学专职不可合并解释为普通终身轨教职。

## 目录范围与穷尽依据

### University of Queensland

实际读取[官方 Marketing discipline](https://business.uq.edu.au/team/marketing-discipline)全部20个卡片及全部20个链接个人页；链接转至当前UQ Experts官方域。15人入研究名录；5个 Teaching Focused、Teaching Associate 或本人明确 education-focused 的职位保留排除。Zara Taba 虽职位为Business Analytics，官方明确列在Marketing discipline，保留该成员关系，不把她强分Quant。

单页无分页。博士学校14/15可从官方Qualifications/Background核定，个人页面不列可确认的授位年，15人的年份均保持空。任职行政片段和访问职位从Len Coote、Janet McColl-Kennedy、Ravi Pappu官方背景逐项摘录；不倒推首职。Felix Septianto原文明确此前在Auckland任教，但无日期，保留unknown精度。

### Australian National University

按[Research areas and researchers](https://rsm.anu.edu.au/research/research-areas-and-researchers)官方研究领域卡片筛出Marketing，而非将整个Research School of Management算作Marketing。第一页50人、末页3人；末页Nick Wang、Ashkan Zarghami、Ofer Zwikael均没有Marketing标签。11个Marketing相关卡片中2个Honorary/Emeritus分开，9个当前人员入库。当前个人页和其链接的ANU研究门户均实际读取。

直接原academic-staff入口404；research-area入口可读。原生`?page=1`请求回传缓存第一页，另用独立公开web reader实际读到末页3人；此差异在complete_evidence保留。博士年份优先明确Award Date，Patrick L'Espoir Decosta同源的教育区间末日与Award Date不同，保留原文及差异，不把source date当教育日期。

### University of Western Australia

[官方Marketing组织页](https://research-repository.uwa.edu.au/en/organisations/marketing/)明确26个profiles；全目录`/persons/`原生及web reader均403。使用官方目录可见索引清单作候选，将26个唯一官方个人页逐一实际HTTP200读取，当前Marketing成员、头衔与组织计数26对齐。19个Teaching&Research样本，6个当前Honorary/Emeritus分开。

第26人Antoine Musu的官方目录索引类别为Person:Teaching，但个人页称Lecturer、Educator and Researcher，没有明确合同类型；该人以appointment_eligibility_pending保留在排除/独立教学口径中，**不声称其没有研究职责或已证实教学专职合同**。目录人员对齐和任职资格、学历完整度是不同判断。Greg Brush简介仍含旧Associate Professor，但当前标题Honorary Research Fellow，按当前标题排除。

教育页明确Award Date时保存日精度；仅有2021→2025教育区间而无授位证据者（Lars-Erik Casper Ferm、David Goyeneche）保留year=null与reported_completion_year=2025。Rosie Thuy Pham-Henderson同页月份/日期不同但均2022，年份可确定，原日差异保留。未把Tarabashkina的Doctoral Research Medal2015或论文年份当授位年。

### Adelaide University（2026新校）

使用当前新校官方页面，而非将旧UniSA/University of Adelaide全目录迁为现职：

- [School of Marketing研究门户过滤](https://researchers.adelaide.edu.au/?department=School%20of%20Marketing%20%281734230%29)：4页54个个人档案，全部实际读取。含HDR、荣休、casual及非Marketing战略教师，逐人排除。
- [Office of Business and Law过滤](https://researchers.adelaide.edu.au/?department=Office%20of%20Business%20and%20Law%20%281734197%29)：2页21个个人档案，全部实际读取；3个既有匹配、14个新增Marketing/EB研究任职、4个兼职/法学/教育心理排除。
- [新校School leadership/program contacts](https://adelaide.edu.au/about/school/marketing/our-people/)及其当前个人页作为独立关联证据；Magda Nenycz-Thiel、Jenni Romaniuk等研究教授不因未出现在School过滤中遗漏。
- [Ehrenberg-Bass Our Team](https://marketingscience.info/who-we-are/our-team)：实际读取全部98个卡片，逐卡保留角色与链接在cross_check_rosters。98包括商业支持、研究助理、HDR、adjunct，以及1个owl吉祥物，并非98个faculty。团队Scientist头衔本身不充分证明大学研究任职；未核到大学任职者保留资格待核，未按是否有博士筛选成功样本。

共50个研究相关任职档案，其中39个普通研究教师、10个独立Research Fellow等研究岗位、1个明确Postdoctoral Research Fellow。29个校目录排除/待核记录独立保留；Institute更广名单另存cross_check_rosters，不混入这29个计数。**整校完整性仍partial**：新校AEM People搜索两端点403，School过滤不是完整Institute人员表；Institute-only科研人员中尚有大学研究任职类别待核。

旧机构任职行保留原机构及原时间，不能将2017起旧University of Adelaide经历直接改成新Adelaide University。仅Kate Sansome原文2026新校Lecturer行、Jodie Conduit原文2025新校行政任命有明确新校日期。Jodie的2025是ProViceChancellor行政任命，不是其Professor of Marketing起始年。John Dawes与Anne Souvertjis个人简介的Dean称谓和当前School领导页不同，保留冲突，没有据此替换Rebekah Russell-Bennett的当前Dean目录观察。

## 事实与未知值规则

每个非空phd.year都有实际读取的官方原文，摘录包含该年，supports含phd.year；未将姓名相似、现职、名单年、论文年、学生指导年、奖项年、索引摘要或抓取年作授位年。Education中的已完成PhD教育行结束年保留year_basis，ANU/UWA明示AwardDate则优先保存。学校有证据但专业未明时program仍空。

研究方向保留Marketing官方成员关系和本人原始研究词；不因使用机器学习、统计工具或当前院系强推Quant/CB。相互独立的研究岗位/博士后faculty_type保留。每人都有当前任职来源、未知授位年/当前职级开始年/职业序列的具体原因；读取个人页不等于读过所有历史CV或宣称公开资料绝无此信息。

所有career_sequence_complete=false；open-ended原表ongoing只是source_snapshot_only的来源观察，不是已经证明至核验日连续在职。访问、行政、行业和普通学术任职分别记录，不当首职或同一次求职最终安排。

## 访问障碍与保存方式

批次source_checks保存170次本地实际访问的URL、状态、SHA256（成功响应）及错误；完整响应位于本地工作缓存，不把大段原HTML/CV塞入批次。UWA目录403、ANU旧入口404、Adelaide两搜索端点403均保留。Go8原生请求超时，范围依据由主线独立读取当前Go8官网；本批不虚称原生抓取成功。Ashish Sinha博士Alberta证据来自[官方UNSW历史讲者简介](https://blogs.unsw.edu.au/marketinginasia/)实际web reader全文读取；原生超时单独保留，授位年仍空。

## 验证

已执行非写入模式：

`node scripts/import-faculty-batch.mjs data/research-updates/2026-10-23-faculty-au-b.json`

预演93 added、0 revised、0linked；没有应用。独立自检确认：4校roster_names逐名唯一解析到本批person；35个非空博士年份均有对应日期摘录与字段支持；所有职业段有URL、开始年存在时包含其原文；完整声明均有complete_evidence；没有完整职业路径声明；未自动按姓名关联旧placement或跨校人。

本批次交主线整合、统一站点验证与部署；这里不将dry-run描述为已发布。
