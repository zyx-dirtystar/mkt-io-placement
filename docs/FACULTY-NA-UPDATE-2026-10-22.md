# 北美46校反查与既有档案补查 · 2026-10-22

基线提交：`c0fc3d516e013e10f4f70256cab1dac9a646ab06`。由 `node scripts/faculty-na-report.mjs` 计算；保留上一轮审计，不覆盖历史数字。

| 指标 | 本轮实际结果 |
|---|---:|
| 新增目标46校：已实际核验 | 46 / 46 |
| 新增目标46校：目录范围已对齐 | 45 / 46 |
| 北美合计：启动 / 目录对齐 | 50 / 49（目标50） |
| 教师总档案 / 新增档案 | 1114 / 708 |
| 原有406人：博士年未知 | 201 → 116 |
| 原有档案新增博士年 | 85 |
| 原有档案首次增加有日期职业片段 | 105 |
| 原有档案履历扩充人数 / 增加片段 | 109 / 329 |

## 逐校实际结果

| 学校 | 档案 | 目录状态 | 博士年已知 / 未知 | 有日期履历 |
|---|---:|---|---:|---:|
| Columbia University | 21 | complete | 21 / 0 | 21 |
| University of Chicago | 19 | complete | 19 / 0 | 17 |
| University of Washington | 17 | complete | 17 / 0 | 16 |
| Cornell University | 25 | complete | 25 / 0 | 25 |
| University of Texas at Dallas | 15 | partial | 15 / 0 | 9 |
| University of Southern California | 21 | complete | 17 / 4 | 18 |
| Indiana University | 24 | complete | 17 / 7 | 17 |
| University of Wisconsin-Madison | 17 | complete | 13 / 4 | 13 |
| University of Maryland | 18 | complete | 16 / 2 | 17 |
| Yale University | 14 | complete | 14 / 0 | 8 |
| Texas A&M University | 21 | complete | 19 / 2 | 18 |
| New York University | 25 | complete | 25 / 0 | 11 |
| University of Michigan | 14 | complete | 14 / 0 | 13 |
| University of North Carolina at Chapel Hill | 13 | complete | 6 / 7 | 6 |
| Duke University | 17 | complete | 16 / 1 | 16 |
| University of California, Berkeley | 12 | complete | 8 / 4 | 9 |
| Boston University | 18 | complete | 18 / 0 | 17 |
| Emory University | 9 | complete | 9 / 0 | 9 |
| Harvard University | 12 | complete | 7 / 5 | 6 |
| University of Houston | 14 | complete | 10 / 4 | 11 |
| Washington University in St. Louis | 17 | complete | 16 / 1 | 10 |
| University of Toronto | 25 | complete | 17 / 8 | 18 |
| University of Texas at Austin | 21 | complete | 21 / 0 | 19 |
| University of California, Los Angeles | 14 | complete | 12 / 2 | 11 |
| Johns Hopkins University | 13 | complete | 12 / 1 | 12 |
| Arizona State University | 17 | complete | 17 / 0 | 15 |
| University of Georgia | 17 | complete | 14 / 3 | 8 |
| Stanford University | 17 | complete | 16 / 1 | 16 |
| University of Rochester | 11 | complete | 9 / 2 | 11 |
| The Ohio State University | 15 | complete | 15 / 0 | 13 |
| Carnegie Mellon University | 9 | complete | 8 / 1 | 9 |
| University of Florida | 13 | complete | 13 / 0 | 13 |
| University of Notre Dame | 15 | complete | 15 / 0 | 15 |
| University of Colorado Boulder | 16 | complete | 16 / 0 | 16 |
| Dartmouth College | 9 | complete | 8 / 1 | 9 |
| Pennsylvania State University | 17 | complete | 15 / 2 | 8 |
| Western University | 11 | complete | 8 / 3 | 9 |
| University of South Carolina | 14 | complete | 13 / 1 | 13 |
| University of Minnesota | 14 | complete | 14 / 0 | 12 |
| University of California, San Diego | 10 | complete | 10 / 0 | 10 |
| Georgetown University | 12 | complete | 11 / 1 | 8 |
| York University | 14 | complete | 14 / 0 | 14 |
| Boston College | 11 | complete | 9 / 2 | 10 |
| University of Arizona | 11 | complete | 11 / 0 | 11 |
| University of Pittsburgh | 11 | complete | 9 / 2 | 9 |
| Rice University | 8 | complete | 7 / 1 | 7 |

## 原有档案补查

| 姓名 | 博士年 | 职业片段变化 | 本轮核验说明 |
|---|---:|---:|---|
| Zikun Liu | 2026 | 0 → 0 | 本人主页所链公开PDF实际读取，Education明确PhD 2026，无expected限定；不从CUHK入职年或奖学金期限推断。 |
| Michelle Kim | 未知 / 见冲突 | 0 → 1 | 重读官方CV的Education仍未列学位年；2019–2025 graduate fellowship不等于2025授位，保留未知。 |
| Xinyu Cao | 2018 | 0 → 2 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Meng Zhang | 2006 | 2 → 2 | 官方页面明确2006加入和2018晋升；助理教授终止年及中间职级未知，不填连续完整履历；博士年未公开。 |
| Feifei Huang | 未知 / 见冲突 | 2 → 2 | 已读2025-07 CV。教育段未给PhD年份；2018论文奖及入职均不等于授位证明，博士年继续未知，补已核任职与晋升。 |
| Xubing Zhang | 2005 | 2 → 2 | 已读官方CV。教育段仅列Toronto PhD、不列年份；1999-2004奖学金与2005入职不用于推断博士授位年。 |
| Karl Aquino | 1992 | 0 → 6 | 重读官方个人页并跟随真实CV下载链接，修复旧URL末尾冒号。正确PDF地址直连仍403、网页读取Cache miss；官方介绍确认Northwestern博士但没有年份。Delaware历史欢迎公告只有曾任GeorgiaState，不能据1999公告倒推博士或完整职业日期。 |
| Lisa Cavanaugh | 2009 | 1 → 2 | 2026官方CV直连403、网页读取Cache miss；继续检索并实际读到本人网站2015 CV，确认Duke Marketing博士2009-05和USC助理教授2009-07起。该CV是2015快照，结束日期未知，不把USC当现职。新UBC CV链接修复，但不宣称内容已读。 |
| David Hardisty | 2011 | 0 → 3 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Sinan Aral | 2007 | 0 → 3 | 官方MIT News校友报道明确PhD ’07，按MIT校友学位年份记法规范化为2007；不使用同年论文奖作推断。现职冠名教授开始年仍待完整CV或任命资料。 |
| Dean Eckles | 2012 | 2 → 8 | 按实际CV内容而非2022上传路径判断版本；明确保留2019无tenure与2022有tenure两个阶段。 |
| Drazen Prelec | 1983 | 0 → 6 | CV将LSE访问写为2013-1014，疑似笔误，未擅自更正或新增该日期片段；其他明确任职阶段照录。荣誉博士另列，不替代Harvard博士。 |
| Anya Shchetkina | 2026 | 0 → 1 | 本人旧CV仍为2026(expected)，新官方Recent PhD Placements明确表头为已获学位年份；保留旧CV而以培养端新毕业名单核实2026。 |
| Duncan Simester | 1993 | 1 → 4 | 官方2001晋升公告确认博士1993、Chicago1993-97、MIT1997加入与2001tenure。2001职位为历史晋升且终止时间未知，不覆盖现职NTU冠名教授。 |
| Yih Hwai Lee | 未知 / 见冲突 | 1 → 1 | 重读实际CV页眉August2020，上传路径2024不是资料日期。CV教育段Marketing1998与Discovery1997冲突仍未裁决，博士年继续null，保留reported_years和两份来源；不任选一个年份。 |
| Sharon Ng | 未知 / 见冲突 | 3 → 5 | 实际PDF含2025活动，不能由文件名2021判定版本。教育段仅列Minnesota PhD未列年份；补1997至今四段任职，博士年仍未知。 |
| 陈豪隽 | 未知 / 见冲突 | 1 → 2 | 官方页明确2026任职，教育只写香港大学市场营销博士、无年，继续保留博士年未知。 |
| 刁文 | 未知 / 见冲突 | 1 → 2 | 教育明确复旦管理学博士而未列年份，补已核2022入职，不倒填博士年。 |
| 高维和 | 2007 | 1 → 3 | 官方页明列博士2007与2023-02讲席教授。Minnesota访问写2024/12-2015/1，时序矛盾，不擅自改成年份正确的访问事件。 |
| 江晓东 | 2004 | 1 → 4 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 楼尊 | 2001 | 1 → 3 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 李楠 | 2019 | 1 → 3 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 刘诚晨 | 2026 | 1 → 1 | 官方教育段明确PolyU博士2026；ASU2024访问不认作第二博士。未给本校入职日期，不用博士年代填。 |
| 孙琦 | 2010 | 1 → 4 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 王晓玉 | 2004 | 1 → 4 | 官方页明确2018-07晋升教授，但未给当前讲席头衔开始日期；不把教授晋升年自动当成讲席开始年。 |
| 吴芳 | 未知 / 见冲突 | 1 → 1 | 补官方教育段博士院校与专业；页面没有博士年和任职起止，继续未知，常任教职原称谓保留不推断tenure。 |
| 叶巍岭 | 2005 | 1 → 1 | 教育段明确博士2005；2018起教师发展中心主任是行政任期，不能填当前教授晋升年。 |
| Chiu Chun-Hung | 未知 / 见冲突 | 1 → 4 | 补博士培养院校、明确专业与2004/2003冲突；保存官方教育区间倒置笔误而不擅自修复。补Instructor与SYSU副教授/教授的明确年月。 |
| Jin Haofeng | 未知 / 见冲突 | 1 → 3 | 官方明确untenured副教授，记录原文，不能把Associate Professor自动归作tenured；教育未给博士年，不从2022博后起始推断。 |
| LI Li | 未知 / 见冲突 | 1 → 4 | 博士为Operations Management，不因本平台关注营销交叉而标成Marketing博士；教育未给授位年。 |
| Pang Jun | 2010 | 1 → 4 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| Huaxiao Shen | 2015 | 1 → 4 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| Shi Zhuomin | 2005 | 1 → 5 | 官方Postdoctoral Research写06/10-08/09，可解释为年月或月年、格式不明，不强制生成该段精确日期；博士2005-07与教授2012-07均明确。 |
| Tian Yu | 2000 | 1 → 4 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| WANG Xiayang | 2008 | 1 → 6 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| Yuan Han | 2021 | 1 → 3 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| Zheng Xiaoying | 2015 | 1 → 5 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| Zhou Yanfeng | 2003 | 1 → 5 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 陈瑞 | 2015 | 1 → 5 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 高月涛 | 2016 | 1 → 4 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 郭朝阳 | 2002 | 1 → 5 | 中文精确任职段副教授至2006-07，英文简表写2002-2005，保留来源差异不以英文较粗简表覆盖中文月份。 |
| 贾艳丽 | 2015 | 1 → 3 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 江玮 | 2011 | 1 → 1 | 补教育段明确博士年月；未找到当前教授开始年，保持未知。 |
| 李冰州 | 2007 | 1 → 3 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| 谭群 | 未知 / 见冲突 | 1 → 3 | 同一官方页中文简介写2014获博士，教育栏及英文写2013；保留2013/2014冲突、主年份null。UCD是博士在读转校经历，不认作授予第二博士。 |
| 周晨希 | 2014 | 1 → 3 | 逐项实际读取官方个人页教育与任职段落；博士授位、访问培养和当前职级起始分开，不推断缺失首职。 |
| Ron Berman | 2014 | 1 → 3 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Eric T Bradlow | 1994 | 1 → 5 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Wendy De La Rosa | 2022 | 1 → 2 | 公开Drive CV成功直接读取PDF。博士教育结束年月2022-01与入职2021-07分开记录；不能以2021入职替代博士授位年。 |
| Ryan Dew | 2019 | 1 → 5 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Raghuram (Raghu) Iyengar | 2005 | 1 → 4 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Zhenling Jiang | 2019 | 1 → 4 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Cait Lamberton | 2008 | 1 → 4 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Shiri Melumad | 未知 / 见冲突 | 1 → 1 | 本人网站仍超时，继续查到博士导师官方CV明确2017答辩。另有Columbia placement表2017，但同表Ryan Dew列2018而其本人CV授位2019，说明表年不能直接当授位年；因此只补defense_year2017、授位年仍未知。 |
| Gideon Nave | 2016 | 1 → 4 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Michael Platt | 1994 | 1 → 7 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Stefano Puntoni | 2005 | 1 → 6 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Jagmohan Raju | 1988 | 1 → 4 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Americus Reed | 2000 | 1 → 4 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| David Reibstein | 未知 / 见冲突 | 1 → 3 | 本人2026-07 CV教育段没有授位年，不能以1975 HBS入职代替；历史任职已有明确时间。 |
| Thomas S. Robertson | 未知 / 见冲突 | 1 → 10 | 2026-03完整CV教育段未列博士授位年。1966助理教授/论文奖不能用于推断授位年，博士年继续未知；已补实际可读任职阶段。 |
| Marissa A. Sharif | 2017 | 1 → 3 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Christophe Van den Bulte | 1998 | 1 → 6 | 实际读取教育及任职段落，补博士授位年与可核实职业片段；不改首职统计。 |
| Patti Williams | 1999 | 1 → 2 | 本人/现任校页面缺少年份，改查其博士委员Gavan Fitzsimons在Duke托管CV的博士委员会完成名单，明确UCLA Marketing completed1999；原来的院校身份来源一起保留，未从首次任职推断。 |
| Pinar Yildirim | 2012 | 1 → 7 | 新CV所链Dropbox已删除，继续检索到官方托管Resume_2并实际读取。两项博士分别为Pittsburgh营销/商业经济2012与工业工程2010；CMU是课程/论文合作，不是授位机构。现任校官网交叉确认2022起副教授任职。 |
| Z. John Zhang | 1994 | 1 → 6 | 本人有两项博士学位：Penn 1989-12与Michigan经济学1994-05，保留主档经济学博士和另一学位，不能将两者误标为年份冲突。 |
| Chethana Achar | 未知 / 见冲突 | 0 → 0 | 进一步查到UW博士导师官方CV列2019论文指导与Kellogg去向。仅填reported_dissertation_year2019；正式授位时间仍待本人教育或授位名册，不能将指导年直接代替授位年。 |

## 范围与未确认项

- 目录对齐指观察日声明范围内的公开教师名单，不表示所有教师的完整履历，更不等于培养端完整cohort。
- 有日期的职业片段要求机构、岗位和至少一个起止日期；只有当前目录身份的无日期片段不计为补齐职业时间。
- 博士年未知、明确来源冲突与博士培养但授位未证实继续区分；入职年、访问年和奖学金截止年不用于补博士年。
- 新增教师独立于placement样本；原有首职、最终安排及来源年保留，后续职业片段另列。

### University of Texas at Dallas

["本轮重试Marketing系页、PhD教师及JSOM接口仍fetch failed；2026官方catalog可读、官方新聘与个人CV补足个体，但不能证明当前完整HR范围。","Shervin的2012/2018为不同学科的两个博士学位，并非一个博士年冲突。Simon Kim是2026–27求职季博士候选人，不将seminar机构标签误当UTD教师任职。"]

- {"url":"https://marketing.utdallas.edu/program-resources/faculty-research/","result":"fetch failed","cause":null,"checked_at":"2026-10-22"}
- {"url":"https://jindal.utdallas.edu/phd-programs/management-science/marketing/","result":"fetch failed","cause":null,"checked_at":"2026-10-22"}
- {"url":"https://jindal.utdallas.edu/faculty/","result":"fetch failed","cause":null,"checked_at":"2026-10-22"}
- {"url":"https://jsom.utdallas.edu/faculty/api.php?area=marketing","result":"502 Bad Gateway","checked_at":"2026-10-22"}
- {"url":"https://personal.utdallas.edu/~nkumar","result":"HTTP200 redirects to Personal Webpage Responsibility Acknowledgement generic IT page; no readable biography","checked_at":"2026-10-22"}


逐人字段证据、名单纳入/排除和访问结果保存在本轮 `data/research-updates/2026-10-22-faculty-na-{a,b,c}.json` 与 `2026-10-22-faculty-existing-backfill.json`、`2026-10-22-faculty-existing-supplement.json` 与范围/定位修正批次 `2026-10-22-faculty-na-reconciliation.json`。目录证据保存在每个学校的 receiving check 中；未公开值保留 null。
