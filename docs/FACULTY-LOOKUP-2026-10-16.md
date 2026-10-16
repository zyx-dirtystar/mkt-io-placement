# 2026-10-16：优先海外教师名录反查

当前网站版本 0.8.0。新增 4 位研究者、补充 2 位已有人员；placement 名录共 308 人，其中 Marketing 281、Quant 74、CB 62。一人可有多方向，不能将这些人数相加。默认近四年名录 289 人，严格已知首职年份样本 170 人。

## 按最新要求调整范围

更新顺序以美国、加拿大、香港、新加坡为先。海外首轮反查沿用固定的北美 Marketing 研究 50 校、港五、新加坡三所，后续可按明确线索增加海外接收院校。

内地只保留用户点名的 **清华、北大、上海交通大学、复旦、上海财经大学、浙江大学、中山大学、厦门大学、南京大学** 九校为重点。不再推进 985 加三所财经大学的 42 校方案。“9 校”是点名清单，不是按某个综合排名定义的 Top 5。

接收院校与博士培养院校是两个独立范围。反查发现某校教师，不代表这个人的博士由该校授予；访问、交换、联合培养经历也不能替代实际学位学校。

## 本批新增与更正

| 人员 | 核实的博士项目 | 首职与现职如何处理 |
| --- | --- | --- |
| Gaoyang Cai | Northwestern MES，2026 | CUHK Marketing AP，2026；归 IO 扩展项目，不误归 Northwestern Marketing 博士 |
| Zikun Liu | Yale Management / Quantitative Marketing | 官方 2026 学位公告是 2025-12 / 2026-05 合刊，精确毕业年仍待核；2026 CUHK 现职明确，首职完整顺序未读到，先留空 |
| Yu Song | Michigan Marketing，2026 | 本人 CV 分别明确博士 2026、CUHK AP 2026；QM 研究内容分类独立标为暂定 |
| Jin Kim | Yale Behavioral Marketing，2023 | 初始为 Northeastern 博后 2023–2025；当前 CUHK AP 另存，不能因现职改写最初 placement |
| Michelle Kim / Michelle Yoosun Kim | UCSD Marketing | 补首职 2025 与主页、CV；CV 没有明确授位年，博士年份仍未知 |
| Ta-Wei (David) Huang | Harvard Quantitative Marketing，2025 | 通过 NUS 托管本人 CV 补博士年份；已有人员不重复新增 |

新增 5 个个人主页、5 个 CV 链接和 1 个明确 JMP；总计主页 81、CV 84、明确 JMP 48。CV 链接存在和本轮是否读到 PDF 内容分开注明。

Zikun Liu 的 JMP 由本人主页明确标为 job market paper。其他工作论文或博士论文不自动变成 JMP。

## 独立教师档案

[教师反查档案](https://zyx-dirtystar.github.io/mkt-io-placement/#faculty) 首批 10 份：CUHK 8、NUS 1、MIT 1。7 份通过稳定的 `placement_id` 关联已有 placement 记录，另外 3 份历史教师档案不进入 placement 表。

按明确博士年份分类：近期博士 5、历史教师 3、博士精确年份待核验 2。标签读取 `config.json` 最近四年窗口，每年自动重新分类；不会用当前任职时间代替博士毕业时间。

历史教师包括 Xinyu Cao（MIT 2018、2023 转到 CUHK）、Chenxi Liao（UT Dallas 2019、2025 晋升 CUHK 副教授）和 Juanjuan Zhang（Berkeley 2006）。转校或晋升不算近期博士首职。

可筛选当前任职地区、接收院校、博士年份组、博士来源范围和研究方向，支持姓名及公开别名搜索、查看原 placement 路径和单独导出教师 CSV。当前职位与职级开始年在导出中明确标注为非首职字段。

## 仍有缺口

首轮 58 所海外接收院校只启动 3 校的局部核验，**没有任何一校被标为教师名录全部查完**。内地 9 校保留关注清单，本轮尚未系统核验。教师反查进度独立于原来的培养项目年度覆盖矩阵。

placement 数据仍有 142 位 Marketing 研究方向待细分，其中 13 人有独立暂定标签。120 条首职或年份待核验：23 条首职 / 路径未知，97 条已有首职但年份未知。新增已知当前任职而首职未核实者会使缺口人数上升；这不是应通过猜测清零的字段。

教师 CV 还发现 Jieteng Chen、Chongyan Sun、Xu Zhu、Xiang Zhou 等博士委员会线索，暂放 `review-queue.json`，核实本人项目及岗位后再入表。2026 新聘公告中的 Jinmyoung Kim 未与目录中的 Jin Kim 自动合并，避免同名和不同拼写误认。

## 下次如何继续

1. 优先海外目录和近年新聘公告，再查个人 Education、Appointments、研究页。
2. `data/faculty.json` 保留独立教师档案、接收院校进度和内地九校清单。较早毕业者可直接入档；来源范围外者标记扩展来源，不强行加入原四地区博士分母。
3. 符合原范围且近期的人员，核实项目、身份去重、年份与首职后，合并或新增到 `data/records.json`，并关联 `placement_id`。确认同一个人才能合并别名。
4. 公告年份与授位年分别保存。只有当前学校或毕业年份时，不能自动补首职。
5. 更新核验日期与来源，运行同步与四组数据检查；发布后验证教师筛选、来源链接、首职详情和原名录。

本轮为逐人公开来源核验，没有配置定时爬取或宣称自动监测。每年仍需核对官方网页；旧档案及排名快照保留。
