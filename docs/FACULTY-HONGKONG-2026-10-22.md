# 香港四校 Marketing 教师反查审计 · 2026-10-22

本批次逐一核查香港理工大学、香港科技大学、香港城市大学与香港大学的官方目录及个人资料。已交付78位教师：76位常规研究教授序列及2位单列研究助理教授；没有因博士年份缺失排除目录成员。CUHK由另一个独立批次处理。

目录完整性仅指指定网页快照的成员及排除清单对齐，不等于学位年度 cohort 完整或毕业去向完整。个人现职起始不自动视为首职；未披露的博士年份及职业日期保留 null。

HKU 直接连接 www.hkubs.hku.hk 多次 DNS getaddrinfo 失败，Professoriate 过滤器也无法读取。随后通过公开检索得到 Marketing、track=all 的官方目录，实际点击读取全部三页（第1页16名、第2页16名、第3页4名），并逐人读取职务资料。CityU 旧目录及 /staff/ 直接连接返回404，公开检索服务仍返回官方域名最近缓存内容；两种访问结果分开记录，未改写为实时服务器成功。

未修改正式 faculty.json、records.json 或网站代码。数据文件为 `data/research-updates/2026-10-22-faculty-hongkong.json`，供主任务进行稳定ID关联与可审阅导入。

| 学校 | 常规研究教师 | 单列RAP | 本目录排除 | 博士学校已知 | 博士年份已知 | 目录处理 |
|---|---:|---:|---:|---:|---:|---|
| PolyU | 15 | 0 | 6 | 15 | 12 | Marketing完整单页21名已对齐 |
| HKUST | 17 | 0 | 5 | 17 | 13 | regular/emeritus/adjunct整页已对齐 |
| CityU | 20 | 1 | 10 | 18 | 3 | 官方目录缓存整页；直接HTTP404另记 |
| HKU | 24 | 1 | 11 | 25中的24 | 10 | Marketing三页36名全部纳入或排除 |
| 合计 | 76 | 2 | 32 | 74 | 38 | 仅针对各自指定快照 |

学校表中的“博士学校已知”分母为该校全部纳入研究教师，包括RAP。HKU为24/25。全样本78人中，博士学校4人未知、博士年份40人未知、博士专业10人未知；不是零值，也不是没有博士。另有INSEAD博士的实际校区地区未确认。读完28份官方PDF CV（包括一个没有.pdf后缀的CityU Scholars公开CV端点）；Jessie Jia所链CV为PNG图片，保留原链接，不把文本解析失败当作学历或任职否定。共记录69条有明确来源的职业事件，未用当前职级起始年推定完整首职链。

## 名单证据及范围

- [PolyU Marketing Academic Staff](https://www.polyu.edu.hk/mm/people/academic-staff_marketing/)：15位Chair/Professor/Associate/Assistant教授；3位Professor of Practice、1位Senior Lecturer、2位Lecturer列排除清单。逐人官方profile和CV链接在JSON中。
- [HKUST Faculty and Staff Directory](https://mark.hkust.edu.hk/faculty-and-staff/directory)：17位regular research faculty；Muthukrishnan荣休，Salvacruz、Cheung、Raitt、Helsen位于实践/兼职范围，另列排除。General Office/Support Staff不是教师分母。
- [CityU Marketing People](https://www.cb.cityu.edu.hk/MKT/about/people/)：20位教授序列与Caiyuan Ma研究助理教授；教学顾问、teaching fellows、instructors及adjunct逐名排除。Xin Shane Wang只出现在另一官方索引快照的Adjunct清单，保存差异，未混入本次快照人数。CityU Scholars仅提供独立身份/学位核验，不把在读博士学生混成教师。
- HKU实际读取 [第1页](https://www.hkubs.hku.hk/people/faculty?pg=1&staff_type=faculty&subject_area=marketing&track=all)、[第2页](https://www.hkubs.hku.hk/people/faculty/?pg=2&staff_type=faculty&subject_area=marketing&track=all)、[第3页](https://www.hkubs.hku.hk/people/faculty/?pg=3&staff_type=faculty&subject_area=marketing&track=all)，每页16/16/4人，末页无下一页。36人分解为24常规教授序列、1 RAP、11名誉/荣休/教学/兼职。Haipeng Shen、Kevin Zheng Zhou、Xi Li、Tuan Phan按官方明确联聘纳入，保留原博士学科；Yu Feng按RAP单列。

目录完整性是研究人员对指定页面全成员、分页、排除类别进行对齐后的声明，源页面不一定自行宣称全体在职人事名单。“已对齐”不证明历史全部聘用、完整毕业届次或全部职业路径。

## 具体访问阻碍与补救

1. HKU `https://www.hkubs.hku.hk/people/faculty?pg=1&staff_type=faculty&subject_area=marketing&track=professoriate&region=hku` 直接请求发生DNS `getaddrinfo`失败；带尾斜线的Professoriate过滤器也不可读。通过公开检索发现上列 `track=all` 官方入口，再实际点击全部分页，之后逐人确认角色。保留失败URL；没有猜目录API或绕过登录。
2. CityU旧目录及例如 `https://www.cb.cityu.edu.hk/staff/lianguo/` 的直接HTTP请求为404；网页检索服务提供相同官方URL近期缓存。采用官方缓存全页及独立CityU Scholars交叉验证，记录该访问方式和新旧Head行政头衔差异；不把缓存读取包装为服务器实时读取。
3. HKU Yu Feng个人页当前web open重定向首页，但[官方检索缓存](https://www.hkubs.hku.hk/people/yu-feng/)与[Statistics团队Current RAP](https://hkubs-stat.github.io/students_and_postdocs/)明确同一邮件和RAP身份。博士来源和年份仍为空；未将其与CityU机器人领域同名者合并。
4. CMU旧Flora Feng学生详情URL现404；读到CMU官方博士论文版权2025，另有2025年同济讲座仍写2026 expected。两者不等同明确授予年，批次留空年份并列冲突。既有placement记录若保留2025，应依原CMU placement年度证据单独判断，不能由该冲突覆盖。

## 学位与职业路径的关键处理

- Tat Yuen Chan：HKU官方新资料明确Yale Economics 2001，此后WashU，再到HKU；不从现任Marketing反推Marketing博士。
- Jinzhao Du：当前官方页为Associate Professor，Duke Marketing 2018；2019新聘材料AP属历史职称，晋升年未披露。
- HKUST Francesco Gabriele的博士是USC Economics 2025，Marketing现职与Empirical IO原文同时保留。Ralf van der Lans的Erasmus AP从2005年开始、博士2006；Rongrong Zhou的HKUST AP从2001、博士2002，按CV原时间保存。
- CityU Yanzhi Li、Yimin Yu、Despotakis、Nervino和HKU Haipeng Shen的博士分别涉及IE/Industrial Administration/Applied Linguistics/Statistics等，未改写为Marketing博士。Jiajia Cong的Shanghai Jiao Tong Economics条目是PhD Program经历，实际已授学位取HKU Strategy。
- Tianyi Li、Theresa Kwon、Junhong Chu的多个博士分别保存；Tuan Phan的Harvard DBA保留DBA原学位，不改成PhD。
- Bicheng Yang、June Shi官方当前profile已为Associate Professor，所链接CV仍是AP。任职事件保留历史状态，晋升年份未知，避免旧CV覆盖现职。
- Feifei Huang、Xubing Zhang及多位教授的教育栏未列年份，未用奖学金、助教截止年、论文奖、加入机构年推定学位授予年。Ziwei Wei的CV任职行仅写July–Present，没有把2026年CV页眉自动当任职年份。

## 身份关联与验证

精确官方profile/CV URL相同的5个既有稳定人员ID：`northwestern-jessie-jia`、`ubc-shangwen-yi`、`university-of-california-berkeley-tianyu-han`、`chicago-jiaqi-yu`、`duke-university-lingrui-zhou`。每人有 `identity_evidence`，不是姓名相似合并。

4个候选关联（ASU Ziwei Wei、CMU Flora Feng、WashU Zack Wang、Pittsburgh Theresa/Tess Kwon）保存建议ID、明确别名、博士来源、接收院校及证据URL，供整合者人工复核。Flora已有CityU profile URL吻合，但博士年份冲突仍保留。

本批次检查通过：JSON可解析；78个(host_id,name)唯一；学校roster_names与people逐项一致；每人有官方来源URL和supports；4校统计从最终people计算。对27个有.pdf后缀的CV进行了再次HTTP读取及短引文逐字核对，修正7条标点/学位措辞；CityU无后缀CV另经网页PDF工具读取。仅修改本JSON及本审计文档，未直接变更正式人员或网站数据。
