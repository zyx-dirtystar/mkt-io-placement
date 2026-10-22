# Faculty Follow-up C — 2026-10-22

冻结基线：`71504a30e328cd91189921c56308f332a0155612`。仅补18个目标项目既有教师的学历年与有证据职业片段，优先队列89人。完整更新档使用稳定 `existing_faculty_id`，不按姓名合并；不修改正式数据、旧批次、目录完整性或 placement 分母。导入器负责保存前版本。

JSON SHA256：`355678d653220c112fe2f25d6308ee14ca33dda93f0536e2178d4b6167570bba`。

## 实际变化

- 修订64人，新增0人；新增28个博士授予年。优先样本博士年未知44→17，其中新发现Min Ding官方2000/2001冲突1例并置null，净减少27。
- 新增147个有日期职业事件/片段，按类型为 `{"appointment": 124, "academic_administration": 4, "joined_institution": 4, "announced_appointment": 2, "postdoc": 3, "industry": 5, "visiting": 3, "named_chair": 2}`。其中2条为宣布安排，独立标记，不能视为实际到岗。
- 完全无日期职业档78→24；排除纯宣布任职后，仍有25人缺实际职业路径日期。仅补已证实片段，未宣称整条路径或首职完整。
- 新增177条字段来源、33个本人/官方CV链接；保留19个来源给出的月/日精度。168条读取/访问调查记录见JSON。

## 项目范围与新增量

| 项目 | 优先对象 | 修订档案 | 新增博士年 | 新职业片段 |
|---|---:|---:|---:|---:|
| Florida | 0 | 0 | 0 | 0 |
| Colorado Boulder | 4 | 4 | 3 | 5 |
| Dartmouth | 2 | 1 | 0 | 7 |
| Penn State | 17 | 10 | 1 | 27 |
| Western / Ivey | 6 | 3 | 2 | 4 |
| South Carolina | 7 | 5 | 2 | 15 |
| Minnesota | 9 | 7 | 2 | 17 |
| UC San Diego | 1 | 1 | 0 | 5 |
| Georgetown | 10 | 8 | 7 | 6 |
| York | 4 | 4 | 3 | 13 |
| Boston College | 3 | 2 | 1 | 2 |
| Arizona | 0 | 0 | 0 | 0 |
| Pittsburgh | 8 | 6 | 4 | 14 |
| Rice | 3 | 2 | 2 | 2 |
| Wharton | 8 | 5 | 0 | 13 |
| MIT | 4 | 4 | 0 | 8 |
| UBC | 1 | 1 | 1 | 6 |
| Kellogg | 2 | 1 | 0 | 3 |

Florida与Arizona的0仅表示本基线“缺博士年或完全无日期职业片段”优先队列人数为0，绝非教师人数为0。Notre Dame由另一批次处理。

## 证据与时间口径

- 本轮新博士年使用明确学历栏目、官方博士毕业/校友年度记录；入职、答辩、placement、奖学金及论文提交年分开。Scott Shriver2011、Ying Zeng2024、Peter Darke1993、Yigang Pan1991等通过官方旧CV/历史报道补核。
- Suh Yeon Kim：2021典礼名册姓名为单星号；对应脚注明确August2020毕业，故授位年2020，不用典礼年2021。Gene Anderson：芝加哥大学官方校友文明确PhD89。Debora Thompson：Maryland官方2006新闻明确PhD06。
- Zuzanna Jurewicz：实际读取Ivey PhD Alumni 2024组的姓名与专业；Minnesota官方公开索引明确Doctor of Philosophy2024，Western Autumn2024毕业名册索引同人。原名册PDF现在404，Minnesota页现登录重定向；未声称读取受限内容或取得PDF哈希。
- 旧CV开放区间只表示该版本快照，例如Anita Rao2016、Stefan Wuyts2020、Punam Keller2021、Jeffrey Boichuk2023、William Hedgcock2017；一律不自动延续至2026。无明确版本日期保留source_date=null。
- Mark Bergen的官方CV确有2001开始Professor与1996–2003 Associate区间重叠，忠实保留且说明冲突，不擅自修成2003晋升。Punam Keller、Stefan Wuyts的并行/访问经历也保留。
- 当前职级开始、加入本校年和首职不互相代填；名誉/行政职衔标明事件类型。Anya Shchetkina的starting July2026仅记宣布，不改为实际到岗。

## 仍未知的博士年与已查阻碍

- **Shiri Melumad**：本人/Wharton简介无授位年；导师CV仅明确2017答辩，Columbia2017表为placement，均不等于授位；未填年。 已查 [1](https://marketing.wharton.upenn.edu/profile/melumad)。
- **David Reibstein**：2026本人官方CV学历不写年份。1975博士论文、导师指导列表、历史教师目录只作为检索线索，尚无独立明确授位记录。 已查 [1](https://marketing.wharton.upenn.edu/profile/reibstei)；[2](https://faculty.wharton.upenn.edu/wp-content/uploads/2016/11/Reibstein_CV-18.pdf)。
- **Thomas S. Robertson**：已读2026官方CV末页Education无年份。历史教师目录有1966参考，但未找到可读官方授位记录，保留null。 已查 [1](https://marketing.wharton.upenn.edu/profile/trobe)；[2](https://faculty.wharton.upenn.edu/wp-content/uploads/2016/11/TSR-CV-March-2026.pdf)。
- **Chethana Achar**：官方CV链接实际返回Northwestern校园VPN提示。已读UW论文2019标题页，但submitted in partial fulfillment与论文年不直接确认授位，仍保留null。 已查 [1](https://www.kellogg.northwestern.edu/academics-research/faculty/achar_chethana/)；[2](https://faculty.kellogg.northwestern.edu/fac_cv_download.php?fac_id=12820)。
- **S. Adam Brasel**：官方BC简介无学位日期；历史学术目录给2004参考，尚无可读官方CV/授位名册确认。 已查 [1](https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-directory/s--adam-brasel.html)。
- **Linda Salisbury**：官方BC及本人页学历不写年。2006placement/历史目录不足以单独证实授位；2006UMich离职记录只证任职，不据此填学历。 已查 [1](https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-directory/linda-salisbury.html)。
- **Kersi Antia**：2017官方CV学历无年；历史教师目录1997、导师1994–97指导区间不是独立授位证据。 已查 [1](https://www.ivey.uwo.ca/faculty_research/directory/kersi-antia/)；[2](https://www.ivey.uwo.ca/media/3777106/antia-cv-june-1-2017.pdf)。
- **Rod Duclos**：2026本人CV学历无年，2008香港任职和奖学金年份不转博士年。 已查 [1](https://www.ivey.uwo.ca/faculty_research/directory/rod-duclos/)；[2](https://www.ivey.uwo.ca/media/w2fhb3fz/cv-rod-duclos-june-2026.pdf)。
- **Guneet Nagpal**：本人/学校简介未列PhD年；导师2019委员会表、placement及公开教育经历只是线索，未确认授位年。 已查 [1](https://www.ivey.uwo.ca/faculty_research/directory/guneet-nagpal/)。
- **Tami Kim**：两份2025官方CV学历未列年；2017博士论文、Dean’s Award与Virginia入职年分别保留，不合并当授位年。 已查 [1](https://tuck.dartmouth.edu/faculty/faculty-directory/tami-kim)；[2](https://tuck.dartmouth.edu/uploads/faculty/CV_TKim_2025.pdf)。
- **Michael O’Donnell**：官方2019新教师报道确认Berkeley博士及加入Georgetown，不写授位年，未用2019入职代填。 已查 [1](https://gufaculty360.georgetown.edu/s/contact/0031Q000021wvJsQAI)。
- **Vanitha Swaminathan**：2026本人官方CV无博士年；历史目录1999与论文目录1998存在口径疑异，未自主选择。 已查 [1](https://www.business.pitt.edu/professors/vanitha-swaminathan/)；[2](https://www.business.pitt.edu/wp-content/uploads/2026/08/Revised_CV_Swaminathan_August_2026-2.pdf)。
- **R. Venkatesh**：官方profile确认1996加入Katz但不写PhD年；1994指导/目录线索不能当授位确认。 已查 [1](https://www.business.pitt.edu/professors/r-venkatesh/)。
- **Xiaojing Yang**：2025官方CV无PhD年；导师CV2005指导记录、2006开始任职不同口径，未转授位。 已查 [1](https://sc.edu/study/colleges_schools/moore/directory/yang_xiaojing.php)；[2](https://sc.edu/study/colleges_schools/moore/documents/curriculum_vitae/xiaojing_yang_cv_0125.pdf)。
- **Vikas Mittal**：现职官方简介无年份，官方旧CV地址404；1996博士联盟/公开教育经历不是授位证据。 已查 [1](https://business.rice.edu/person/vikas-mittal)。
- **Min Ding**：两个官方同人资料冲突：IST写PhD2000，Smeal教育字段写2001。置null，保留reported_years及两URL，待授位记录消解。 已查 [1](https://www.ist.psu.edu/directory/mqd9)；[2](https://smeal.psu.edu/directory/person/mqd9)。
- **John C. Powell**：官方仅见MBA/BA与director身份；研究教师资格待确认，未知PhD不等于未取得。 已查 [1](https://smeal.psu.edu/directory/person/jcp7)。

其余仍缺日期实际职业片段的人：Anya Shchetkina、Shiri Melumad、Chethana Achar、Linda Salisbury、Zuzanna Jurewicz、Guneet Nagpal、Ronald Goodstein、Suh Yeon Kim、Alice Moon、Michael O’Donnell、CB Bhattacharya、Yafei Guo、Wenyan Tuo、Vikas Mittal、Joseph Jason Bell、Min Ding、Sara Loughran Dommer、Luciano Lapa、Sean Melessa、John Andrew Petersen、John C. Powell、Courtney Szocs、Ning Zhong、Amanda Geiser、Irene Nahm。已查的具体官方URL、状态与可用内容哈希保存在 `investigations` / `unresolved.checked_urls`；缺失不填零。

## 自检与导入预览

- 稳定ID/host正确；旧sources（含checked_at）和旧career_events逐项完全相等。688处字段引用全部可解析。
- 156条本地来源哈希匹配缓存原内容，156条本地可比短摘录均与规范化原文相符；web工具专用证据分别注明读取范围，不伪造hash。
- 事件日期序、重复稳定ID及引用均通过。新增正式CV链接经过资料类型核对，AMA会议手册/毕业名册不误列为个人CV。
- 已执行 `node scripts/import-faculty-batch.mjs data/research-updates/2026-10-22-faculty-followup-c.json`，结果apply=false、added=0、revised=64、linked=4、schools=0；正式数据未被本批次写入。
- 本批次冻结后不再修改；主代理负责统一导入、发布及全站质量报告。
