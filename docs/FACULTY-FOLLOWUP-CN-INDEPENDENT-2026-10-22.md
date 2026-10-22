# 内地独立来源补查与整合审计 · 2026-10-22

原始研究输入：`data/research-updates/2026-10-22-faculty-followup-cn-independent.json`（保留未导入的候选观察）。正式发布采用 `2026-10-22-faculty-followup-cn-reviewed.json`；原始输入不能直接导入，索引年份的保护校验会拒绝。

本批实际修订 26 份既有档案；新增 11 个直接读取证据支持的主博士年。另 7 人仅有官方搜索索引年份，保存在phd.reported_year，主年份维持null，不计已核定年份。

读取材料包括上海交大公开教师资料、北大两份可读CV与个人站、南京人员的独立官方历史清册。CV公开页面仍可读而旧页面失败时保留双方访问状态；不以当前院系反推博士专业，不以任教年推授位年。

## 逐人实际结果

| 姓名 / 稳定ID | 发布主博士年 | 待复核索引年 | 资料性质与主要来源 |
|---|---:|---:|---|
| 才凤艳 / faculty-sjtu-才凤艳 | 2011 | — | [public HTML read](https://www.acem.sjtu.edu.cn/faculty/caifengyan.html) |
| 顾锋 / faculty-sjtu-顾锋 | 2000 | — | [public HTML read](https://www.acem.sjtu.edu.cn/faculty/gufeng.html) |
| 井淼 / faculty-sjtu-井淼 | 2006 | — | [public HTML read](https://acem.sjtu.edu.cn/faculty/jingmiao.html) |
| 刘益 / faculty-sjtu-刘益 | 1994 | — | [public HTML read](https://acem.sjtu.edu.cn/faculty/liuyi.html) |
| 张铄 / faculty-sjtu-张铄 | 2020 | — | [public HTML read](https://www.acem.sjtu.edu.cn/faculty/zhangshuo.html) |
| 余明阳 / faculty-sjtu-余明阳 | 1996 | — | [public HTML read](https://acem.sjtu.edu.cn/faculty/yumingyang.html) |
| 陈洁 / faculty-sjtu-陈洁 | 未知 | — |  |
| 伍青生 / faculty-sjtu-伍青生 | 未知 | — | [public HTML read](https://acem.sjtu.edu.cn/faculty/wuqingsheng.html) |
| 庄晖 / faculty-sjtu-庄晖 | 未知 | — | [public HTML read](https://www.acem.sjtu.edu.cn/faculty/zhuanghui.html) |
| 王良燕 / faculty-sjtu-王良燕 | 未知 | — | [public HTML read](https://acem.sjtu.edu.cn/faculty/wangliangyan.html) |
| 周颖 / faculty-sjtu-周颖 | 未知 | — | [public HTML read](https://www.acem.sjtu.edu.cn/faculty/zhouying.html) |
| 李杰 / faculty-sjtu-李杰 | 未知 | — |  |
| 沈靓 / faculty-sjtu-沈靓 | 未知 | — |  |
| 史正煜 / hku-zhengyu-shi | 未知 | — |  |
| 吕巍 / faculty-sjtu-吕巍 | 1996 | — | [public HTML read](https://emba.sjtu.edu.cn/faculty/lvwei.html) |
| Xing LI / faculty-peking-xingli | 2016 | — | [full PDF extracted](https://worksapi.gsm.pku.edu.cn/uploadfiles/20231115/144600_cv_en.pdf) |
| Jing Xu / faculty-peking-jingxu | 2007 | — | [full PDF extracted](https://worksapi.gsm.pku.edu.cn/uploadfiles/20231115/0290_cv_zhs.pdf) |
| Yingjie Zhang / faculty-peking-yingjiezhang | 2018 | — | [public HTML read](https://sites.google.com/view/yingjiezhang/) |
| Yi Zhang / faculty-peking-yizhang | 未知 | 2024 | [official search-index text; live retrieval unsuccessful](https://www.gsm.pku.edu.cn/info/1022/29718.htm) |
| Guoqun Fu / faculty-peking-guoqunfu | 未知 | 1999 | [official search-index text; live retrieval unsuccessful](https://www.gsm.pku.edu.cn/faculty/fugq/) |
| Phyliss Jia Gai / faculty-peking-phylissjiagai | 未知 | 2020 | [official search-index text; live retrieval unsuccessful](https://www.gsm.pku.edu.cn/faculty/gai/) |
| Hongju Liu / faculty-peking-hongjuliu | 未知 | 2007 | [official search-index text; live retrieval unsuccessful](https://www.gsm.pku.edu.cn/faculty/hliu/) |
| Rui Wang / faculty-peking-ruiwang | 未知 | 2008 | [official search-index text; live retrieval unsuccessful](https://www.gsm.pku.edu.cn/faculty/rwang/) |
| Kun Wang / faculty-peking-kunwang | 未知 | 2025 | [official search-index text; live retrieval unsuccessful](https://www.gsm.pku.edu.cn/faculty/wangk/) |
| Ying Zhang / faculty-peking-yingzhang | 未知 | 2007 | [official search-index text; live retrieval unsuccessful](https://www.gsm.pku.edu.cn/faculty/zhang/) |
| Jiang, Zhengrui / faculty-nanjing-jiangzhengrui | 2005 | — | [full PDF extracted](https://catalog.iastate.edu/previouscatalogs/2015-16/faculty/faculty.pdf) |

## 公开页面读取限制

2026-10-22整合时再次直接请求7份北大原页，公开网页读取器均返回timeout。原始官方索引摘录与URL仍保留，标 indexed_official_text；与实读HTML/PDF分开。没有将这些索引升级成原文确认。

- Yi Zhang：索引年 2024；https://www.gsm.pku.edu.cn/info/1022/29718.htm
- Guoqun Fu：索引年 1999；https://www.gsm.pku.edu.cn/faculty/fugq/
- Phyliss Jia Gai：索引年 2020；https://www.gsm.pku.edu.cn/faculty/gai/
- Hongju Liu：索引年 2007；https://www.gsm.pku.edu.cn/faculty/hliu/
- Rui Wang：索引年 2008；https://www.gsm.pku.edu.cn/faculty/rwang/
- Kun Wang：索引年 2025；https://www.gsm.pku.edu.cn/faculty/wangk/
- Ying Zhang：索引年 2007；https://www.gsm.pku.edu.cn/faculty/zhang/

## 整合修正

- Min Ding的IST与Smeal官方资料分别为2000/2001，主博士年撤回为null，保留两值与原文。修复导入保护曾将旧2001填回的问题，并添加回归测试。
- 新整合批把103条已解决的旧字段缺口移入resolved_gaps，旧文和previous_versions保留。仍缺首职或完整连续职业路径的部分不随已有日期片段清除。
- Shervin Shahrokhi Tehrani的Marketing2018和Mathematics2012、Dmitri Kuksov的两博士学位单独展示；不作为同一授位年冲突。
- 无法读取、没有明确年份、只列候选学位、仅为访问或研修等原因逐人保留。目录完整性不因本批个案增加而升级。
