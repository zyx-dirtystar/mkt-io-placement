# 北美 B 组博士授位年与职业日期补查审计（2026-10-22）

基线：`71504a30e328cd91189921c56308f332a0155612`。范围为既有15校、229位常设研究教师。本批实际更新 **86 位档案**，明确补齐 **55 位博士学位年份**，使 **66 位首次具备有日期的职业记录**，新增 **272 条职业片段**。没有新增教师或重做目录完整性声明。

该组博士年份缺失 83 → 28；没有任何日期职业段 110 → 44。这些计数从基线及最终批次合并视图计算，不是全站更新后计数。

## 逐校实际变化

| 学校 | 既有人数 | 本批更新 | 博士年份缺失 前→后 | 无日期路径 前→后 | 新职业段 |
|---|---:|---:|---:|---:|---:|
| Boston University | 18 | 1 | 0→0 | 2→1 | 5 |
| Emory | 9 | 0 | 0→0 | 0→0 | 0 |
| Harvard | 12 | 2 | 7→5 | 7→6 | 4 |
| Houston | 14 | 10 | 12→4 | 13→3 | 39 |
| Washington University St. Louis | 17 | 4 | 2→1 | 11→7 | 15 |
| Toronto | 25 | 18 | 22→8 | 23→7 | 53 |
| UT Austin | 21 | 18 | 2→0 | 19→2 | 72 |
| UCLA | 14 | 0 | 2→2 | 3→3 | 0 |
| Johns Hopkins | 13 | 12 | 13→1 | 8→1 | 41 |
| Arizona State | 17 | 14 | 9→0 | 12→2 | 41 |
| Georgia | 17 | 1 | 4→3 | 9→9 | 2 |
| Stanford | 17 | 0 | 1→1 | 1→1 | 0 |
| Rochester | 11 | 4 | 6→2 | 0→0 | 0 |
| Ohio State | 15 | 2 | 2→0 | 2→2 | 0 |
| Carnegie Mellon | 9 | 0 | 1→1 | 0→0 | 0 |

## 实际读取与证据口径

保存 96 条有哈希的来源读取观察，涉及 89 位教师；同一人可以有详细页和CV、不同读取范围等多条观察。这不代表全部229人的所有资料本轮都已重读。

- **UT Austin：21位的公开资料和所链CV均实际读取**。官方页面公开加载的DigitalMeasures/HAL资料给出Education与Download Vita；读取PDF、DOCX及四份旧DOC。PDF教育/任职通常读前两页，Vijay Mahajan任职段另读第3–4页，Ty Henderson检查全部六页。William Cunningham、Wayne Hoyer等旧DOC解码后核对Education和任职表。Linda Golden与Ty Henderson未找到带日期任职表，仍未知。下载URL带有效期，保留稳定官方个人页/API及读取时CV URL和字节哈希。
- **Houston：公开HB2504/Syllabi and CVs入口逐人检索**。14位中读到11份匹配CV；包含Martin Krämer以Martin Kraemer合法姓名匹配、Sam Hui检索返回Ka-Chuen姓名待继续消歧、Partha Krishnamurthy与Yanyan Li未取得匹配CV。CV教育/任职主要读前两页；Ye Hu所读范围未给授位年或日期任职。保留匿名公开附件路径和学校入口，不含账户凭据。
- **Toronto：现职页、官方Discover详细资料、个人页所链公开CV及独立培养机构资料交叉**。保留Cindy Chan/Zachary Zhong精确至日的区间。Hyesung Yoo由WashU官方论文库Date of Award确认2021-08-15；Dinara Akchurina由INSEAD官方博士校友资料确认2020。Nitin Mehta/Claire Tsai读取官方所链DOCX。部分Discover页渲染为空、旧rDrive文档失效，未把搜索索引年份改成确认值。
- **Johns Hopkins：12位博士年得到明确教育证据**。旧版Shubhranshu Singh CV（2024-02-28）可读，当前链接受限时保留旧版事实；Haiyang Yang仍缺可读教育/任职日期资料。Tinglong Dai和Yuexing Li跨列在Marketing目录，博士专业按原文保留Operations等字段。
- **Arizona State：官方CV和学校学历档案**。Education无年份的Christian Kim/Amy Ostrom，以及没有可读CV的Chaumanix Dutton，以2022–2023官方Instructional Faculty Archive补齐。档案第一页明确Year Issued是degree conferral date；未把档案年度当成任职起点。Maura Scott任职证据另读CV第28页，Douglas Olsen读第15–16页。
- **其他读取**：WashU的四份可读CV、Rochester的四条已完成博士教育区间、Harvard Amano/Troncoso、BU Srinivasan，以及Ohio State Walker/O’Brien等。官方PDF/DOC原字节哈希与工具渲染正文/摘录哈希分别标注，不能将后者当作原文件字节哈希。

仅明确授位年、官方conferral档案/论文库授位日期、或已经完成学位的Education区间末年写入博士年。区间末年标 `education_degree_interval_end`。DBA等博士类型保留实际degree，不统一改成PhD。expected、答辩、入职、placement、导师指导年份均不单独转为授位年。

每条新增职业段保留原文、source_urls、读取日、日期精度和job_kind，并设 `source_snapshot_only=true`。旧CV中的present只反映该版本；文档没有日期时source_date/source_as_of保持null。没有用下一次晋升自动填补前职结束年，也没有推定首职。

## 尚未解决的具体记录

| 学校 / 人员 | 剩余字段 | 本轮结果与限制 |
|---|---|---|
| Boston University / Jonathan Hibbard | career_events.dates | 已读官方所链CV前两页；没有带日期的任职段，余页本轮未继续核查。 |
| Harvard / Elie Ofek | phd.year, career_events.dates | HBS正式个人资料入口访问受限/403，公开可索引官方传记未给足缺失授位年或任职日期；未把奖项/第一份职位年写作授位年。 |
| Harvard / Julian De Freitas | career_events.dates | HBS正式个人资料入口访问受限/403，公开可索引官方传记未给足缺失授位年或任职日期；未把奖项/第一份职位年写作授位年。 |
| Harvard / Anita Elberse | phd.year, career_events.dates | HBS正式个人资料入口访问受限/403，公开可索引官方传记未给足缺失授位年或任职日期；未把奖项/第一份职位年写作授位年。 |
| Harvard / Sunil Gupta | phd.year, career_events.dates | HBS正式个人资料入口访问受限/403，公开可索引官方传记未给足缺失授位年或任职日期；未把奖项/第一份职位年写作授位年。 |
| Harvard / Rajiv Lal | phd.year | HBS正式个人资料入口访问受限/403，公开可索引官方传记未给足缺失授位年或任职日期；未把奖项/第一份职位年写作授位年。 |
| Harvard / Das Narayandas | phd.year, career_events.dates | HBS正式个人资料入口访问受限/403，公开可索引官方传记未给足缺失授位年或任职日期；未把奖项/第一份职位年写作授位年。 |
| Harvard / Demi Oba | career_events.dates | HBS正式个人资料入口访问受限/403，公开可索引官方传记未给足缺失授位年或任职日期；未把奖项/第一份职位年写作授位年。 |
| Houston / Michael Ahearne | phd.year | Houston公开HB2504 CV明确列出任职起止，但Education段没有博士授位年；未以第一份教职年推算。 |
| Houston / Ye Hu | phd.year, career_events.dates | Houston公开HB2504 CV已读前两页；教育段未列PhD年，所读范围没有带日期任职段。个人网站也未提供可确认年份。 |
| Houston / Partha Krishnamurthy | phd.year, career_events.dates | 官方主页及匿名公开HB2504按Krishnamurthy检索未找到可匹配CV；未取得明确授位年或日期履历。 |
| Houston / Yanyan Li | phd.year, career_events.dates | HB2504公开检索未取得匹配CV；旧候选人资料为expected 2025、导师指导清单2025均不能单独证明实际授位年。 |
| UT Austin / Linda Golden | career_events.dates | UT公开Download Vita DOCX已完整提取，教育年已知；没有可确认的带日期任职表，委员会和课程年份不作任职起点。 |
| UT Austin / Ty Henderson | career_events.dates | UT公开Download Vita PDF六页已检查，博士年已知，但未找到可确认的Employment/Academic Appointments日期段。 |
| UCLA / Anand V. Bodapati | phd.year, career_events.dates | UCLA官方教育资料没有博士授位年；本轮未取得可读官方CV。非官方Hasselback目录年份未采用。 |
| UCLA / Hal Hershfield | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| UCLA / Shi(shir) Zhang | phd.year, career_events.dates | UCLA官方资料涉及Columbia Marketing与Arizona Linguistics两个博士，未列可确认年份；本轮未取得可读官方CV，不混并两学位。 |
| Stanford / Jonathan Levav | phd.year, career_events.dates | Stanford官方个人页/Profiles教育条目未列博士年；导师委员会表2003不是独立授位证据。Duke旧placement年度未转成授位年。 |
| Rochester / Hana Choi | phd.year | 已读现职所链CV，PhD Duke Marketing未附年；Duke placement页工具超时，直接请求证书链错误，未取得明确授位字段。 |
| Rochester / Mitchell Lovett | phd.year | 现职页确认Duke博士但无年；Duke论文下载返回Anubis机器人检查，placement页超时/证书链错误；未用2008加入Simon或placement行推定授位年。 |
| Ohio State / Jiae Kim | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Ohio State / Mingyung Kim | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Carnegie Mellon / Tim Derdenger | phd.year | 已核现职资料中的USC Economics博士但缺授位年；现有带日期任职路径保留，不由2010教职起点推断博士年。 |
| Arizona State / Chaumanix Dutton | career_events.dates | ASU官方2022–2023学历档案明确博士授位2021；现职页只有joined ASU from USC和企业名称，没有任职日期，CV端点回到个人页。 |
| Arizona State / Martin Mende | career_events.dates | 已读ASU官方CV教育及任职相关内容，明确ASU博士2008、另有德国管理学博士2006；所读CV没有带日期的学术职位表。 |
| Washington University St. Louis / Tat Chan | career_events.dates | 已尝试现职资料链接的官方Box CV，返回404/不可用；本轮未读到可核的带日期职位段。 |
| Washington University St. Louis / Fausto Gonzalez | career_events.dates | 已找到官方个人页所链Google Sites CV入口，本轮尚未完成该CV正文核读；保留未知。 |
| Washington University St. Louis / Stephen Nowlis | career_events.dates | 已尝试现职资料链接的官方Box CV，返回404/不可用；本轮未读到可核的带日期职位段。 |
| Washington University St. Louis / Hannah Perfecto | career_events.dates | 已尝试现职资料链接的官方Box CV，返回404/不可用；本轮未读到可核的带日期职位段。 |
| Washington University St. Louis / Seethu Seetharaman | career_events.dates | 已尝试现职资料链接的官方Box CV，返回404/不可用；本轮未读到可核的带日期职位段。 |
| Washington University St. Louis / Zijun Tian | phd.year, career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Washington University St. Louis / Yingkang Xie | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Johns Hopkins / Haiyang Yang | phd.year, career_events.dates | 已检查JHU官方个人资料/所链个人页面；本轮未取得可读的带Education和任职起止CV，博士年和日期路径保留未知。 |
| Georgia / Sundar Bharadwaj | phd.year | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Anindita Chakravarty | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Hua Chen | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Jinjie Chen | phd.year, career_events.dates | UGA现职页确认Minnesota博士及曾在CityU任教，但没有日期；Minnesota旧候选人CV写expected May2021/In Progress，不作授位确认。 |
| Georgia / Son K. Lam | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Julio Sevilla | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Amin Shiri | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Sarah C. Whitley | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Elham Yazdani | career_events.dates | 本轮未重新读取足以补齐该字段的个人CV，保留上轮确认内容及未知状态。 |
| Georgia / Vincent Zhang | phd.year, career_events.dates | UGA官方个人页只有现职和vincentz@uga.edu；没有博士学校/前职/shared个人URL等足够身份交叉证据，不按姓名合并HKU Vincent Peng Zhang，也不把2020 placement年写为授位年。 |
| Toronto / Dinara Akchurina | career_events.dates | INSEAD官方博士项目校友资料明确PhD in Marketing (2020)；Toronto现职未给入职日期，本轮未取得带日期CV。 |
| Toronto / Cindy Chan | phd.year | Toronto官方Discover个人资料明确列出逐日任职区间，但Education未列博士授位年；导师委员会2014不作授位日期。 |
| Toronto / Kristen Duke | phd.year | 已读Toronto官方Discover资料，任职起点2019明确，博士Education条目不含年份。 |
| Toronto / Scott Hawkins | phd.year, career_events.dates | Toronto现职页已读；Discover详细页返回cache miss/不可读，本轮未取得教育年或带日期CV。 |
| Toronto / Peter Landry | career_events.dates | Toronto现职资料确认博士年但无带日期任职条目；本轮未取得可读CV。 |
| Toronto / Chang-Yuan Lee | phd.year, career_events.dates | Toronto现职页已读；Discover详细页渲染为空/需要客户端脚本，本轮未取得教育年或带日期履历。 |
| Toronto / Sridhar Moorthy | phd.year, career_events.dates | Toronto旧rDrive CV返回Document not Found，Discover详细页无可读正文；搜索索引出现Stanford PhD March1983，但本批未把未能读取的索引单独写成确认年。 |
| Toronto / Avni Shah | phd.year, career_events.dates | 已读Toronto官方Discover的Duke博士Education与职位条目，未列授位年或任职起止；旧Duke placement年度不转写为授位年。 |
| Toronto / David Soberman | phd.year | Toronto当前页及既有带日期职位资料保留；Discover详细页无正文/旧CV未取得可读Education授位年。 |
| Toronto / Hyesung Yoo | career_events.dates | Washington University官方论文库明确Date of Award 2021-08-15；Toronto入职时间没有独立日期证据，不用授位年反推。 |
| Toronto / Zachary Zhong | phd.year | Toronto官方Discover明确列逐日职位区间及CityU访学，博士Education未列授位年。 |

跨校同人处理：Vincent Zhang保留UGA独立观察；未取得博士学校、前职或共享个人URL等足够交叉证据，本批没有与HKU Vincent Peng Zhang或placement记录自动合并。

## 保护与验证

- 逐条对照71504a：86位旧姓名、学校、官方主页、已有关联ID保持；全部旧来源和旧职业片段都保留。
- existing_faculty_id唯一且指向基线；每条新博士年有明确证据，没有expected/in progress确认年。新职业段均有job_kind、短摘录、有效来源关联和source_snapshot_only。
- 日期起止顺序、年/月/日/季精度、来源SHA256格式通过自检；正式批次没有research_raw/research_text/research_cv_text/cv_text/raw_html等原始正文。完整缓存位于gitignored source-snapshots目录，未发布整篇CV。
- 本子任务只写新批次和本审计文档，未apply、未修改权威faculty.json、旧批次或网页代码。全站导入、模型校验和上线由根任务处理，不能将本批冻结表述为已上线。
