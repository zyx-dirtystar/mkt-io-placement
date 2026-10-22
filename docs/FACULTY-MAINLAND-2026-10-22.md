# 内地九校教师反查：2026-10-22核验记录

固定清华、北大、上交、复旦、上财、浙大、中大、厦大、南大九校。先查官方目录，再补个人教育与职业资料；没有按博士来源或就业结果挑选目录成员。对应数据为 `data/research-updates/2026-10-22-faculty-mainland.json`，本文件和批次不直接改写既有人员ID或placement记录。

本批次登记141个目录人员档案，其中63人有可定位的官方博士学校证据，53人有博士年份，18人有当前岗位明确起始年。78人的博士学校仍未知。这里的“未知”包含两种不同状态：`directory_only`仅完成目录，个人履历待核验；`profile_verified`确实读取过个人页但具体教育或日期未给。不能把前者写成“官网未披露”。

| 学校 | 已登记人数 | 博士学校 / 年份已核验 | 实际目录状态 |
|---|---:|---:|---|
| 清华 | 11 | 10 / 8 | 当前教师两页11人全部读取，11个个人页也全部读取 |
| 北大 | 14 | 2 / 2 | 官方搜索索引14人；实时系目录timeout、独立HTTPS读取失败 |
| 上交 | 17 | 1 / 1 | 官方MIS索引17人；实时MIS读取失败，旧介绍页15人与索引版本不一致 |
| 复旦 | 22 | 21 / 21 | 官方公开目录API市场营销D06全部22条，逐条读取基本信息及教育列表 |
| 上财 | 14 | 5 / 3 | 营销页签15张卡，刘汝晗中英文两页同官方邮箱、教育和任职归一；介绍仍称11人，完整性未确认 |
| 浙大 | 2 | 1 / 1 | 管理学院目录timeout；校级组织名录确认学系，两个官方个人资料可读，不能据此代表全系 |
| 中大 | 19 | 1 / 1 | 全院Faculty中研究方向明确含Marketing/Consumer/营销/消费者的研究教师子集；不是全市场学系 |
| 厦大 | 18 | 4 / 3 | 实时HTML市场学系完整段落18人；旧搜索索引17人漏陈瑞，本次未沿用旧人数 |
| 南大 | 24 | 18 / 13 | 英文19人与中文23人并集24人；不等于当前24位。中英文差异及特殊研究岗位分类单独保存 |

目录当前快照能够穷尽且没有已知跨版本差异的有清华、复旦、厦大3校。名单完整与博士来源完整、履历完整均分开表达。

## 官方目录与访问结果

- 清华：[Faculty第1页](https://www.sem.tsinghua.edu.cn/marken/Faculty.htm)、[第2页](https://www.sem.tsinghua.edu.cn/marken/Faculty/1.htm)。Current Faculty与Retired Faculty分开；博士后独立栏目不混入研究教师。
- 北大：[Marketing Faculty Directory](https://en.gsm.pku.edu.cn/marketing/Faculty_Directory.htm)。官方索引可读，实际页面打开超时，Node独立HTTPS读取仍失败。赵璞用官方托管CV，沈俏蔚采用官方个人页可定位索引并注明该限制。
- 上交：[官方MIS营销教师目录](https://mis.acem.sjtu.edu.cn/psc/ACEMPRD/EMPLOYEE/CRM/s/WEBLIB_TZ_JSWW.TZ_WEB_JS_WW.FieldFormula.IScript_TzTeaTeam?ByYuanxi=BM101&class_yuanx=y)、[系介绍](https://www.acem.sjtu.edu.cn/acem2021/acem/marketing.html)。实际系介绍HTML可读但名单动态，MIS实时超时；左思用安泰官方个人页与Cornell官方Economics博士去向表交叉核验。
- 复旦：[教师名录](https://www.fdsm.fudan.edu.cn/Aboutus/minglu.aspx)。原始页面JavaScript调用官方 `app.fdsm.fudan.edu.cn/NewTeacherService/api/Professor/GetDeptTeacherList?language=cn`，按`deptId=D06`取22人；公开个人页调用`GetSingleTeacherOtherInfo`，分别读取`personMessage`及`educationalBackground`。原始API含无关个人信息，本批次仅保留学术任职、教育、研究证据，没有发布出生日期或私人联系方式。
- 上财：[Faculty/Department](https://cob.sufe.edu.cn/Faculty/Department)。已读取营销页签和陈豪隽、刁文、龚晗、刘汝晗、汪新博官方个人页。刘汝晗`Resume/244`和`Resume/246`同学校邮箱、同学历和任职，作为双语重复；没有仅凭姓名去重。
- 浙大：[管理学院](https://www.som.zju.edu.cn/)及HTTP版本均超时；[校级组织目录](https://www.zju.edu.cn/599/listm.htm)可读。周欣悦用浙大官方EDP材料与其联席学校[emlyon官方资料](https://www.em-lyon.com.cn/faculty/view/62)；王小毅用[浙大个人主页](https://person.zju.edu.cn/wangxiaoyi/)。两位资料不证明整系人员完整。
- 中大：[全院Faculty](https://bus.sysu.edu.cn/en/bus-faculty)已实际读取。按公开研究文字登记19位，包含运营与营销交叉。3位明确Postdoctor（LIM XIN JEAN、Tan Wenying、Zhang Yu）保留在排除名单，不计研究教师。孟思雨另读官方中文教育背景，博士为北大管理学2025，未从入职或所在系反推学位。
- 厦大：[官方按系师资](https://smr.xmu.edu.cn/TeacherWeb/Teacher_Special_2022.aspx)市场学系18人，保留全部人员。国际访问学者为其他类别。贺达、陈韵清、张学立、沈鹏的官方个人页有独立教育/工作证据；未访问个人页的其他成员明确为仅目录核验。
- 南大：[英文19人目录](https://nubs.nju.edu.cn/nubs_en/17371/list.htm)与[中文当前师资](https://nubs.nju.edu.cn/8878/list.htm)均实际读取；英文19个和中文23个个人页全部请求成功。中文页公开`search.js`使用只读POST接口`/_wp3services/generalQuery?queryObj=teacherHome`，本次按原样`published=1`、`exField2=营销与电子商务系`读取，返回`total=23`、实际23行，完整查询参数摘要保存在批次。

## 南大差异与字段冲突

英文目录有Jiang Zhengrui，中文23人目录没有；保留英文资料与历任职业，不据目录缺席推定已离职。中文新增DICKSON TOK、李然、李晨、吴宜真、杨雪。英文目录标题Tao Xiangcai对应页面正文Tao Xiangnan，中文陶向南页学校邮箱一致，保留原名及别名、解释依据。

中文API李晨`exField8=是`，官网脚本将此用于“名誉/兼职”分类，但个人页明确“现任特任副研究员”。本次保留特殊研究岗位与分类冲突，不擅自断言其为标准教授、兼职或不在职。其哈尔滨工业大学与香港城市大学博士为联合培养，保留双学位原文。

英文若干职称较旧，中文个人资料提供当前副教授/教授，两个来源同时保留。王翔英文页页首误写Wang Quansheng及其邮箱，正文与中文王翔页清楚，未合并王翔和王全胜。郑称德博士后终止年英文2005、中文2006，保存候选年份及冲突，不强行计算确定任期。

## 职业与学位口径

现职观察只表明本次在官方目录/个人资料中出现。起始年缺失时保留null；没有从博士年份、网页发布时间或职称推断首职。研究教师在营销系任教，也可持信息系统、经济学、心理学、社会学、大众传播学等博士，学位专业保留官方原文。

例如赵钰2024年Indeed分析师与2025年清华助理教授分开；张学立2021—2023年NUS Research Fellow和2023年厦大教职分开；沈鹏2021—2022年澳门科技大学教职与2022年厦大教职分开；吴宜真1998年任教早于2010年博士，不据此制造同届毕业placement。

所有来源日期缺失保持null，核验时间为2026-10-22。列表人数、博士缺失数与质量指标均可从JSON重新计算。没有将访问失败、未读取个人页或名单缺席写成“零人”“没有博士”或“已经离职”。
