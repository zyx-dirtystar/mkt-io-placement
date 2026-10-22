# 数据模型、核验与持续维护

本版沿用静态 GitHub Pages。原始研究资料保存在 `data/`；`dist/data/` 是从原始数据生成的兼容数据和统一观察库。构建不会抓网页、重写人员核验日期或自动改变未知事实。

## 生成与验证

在仓库根目录运行：

```sh
node scripts/sync-data.mjs
node scripts/check.mjs
node scripts/check-placement.mjs
node scripts/check-evidence.mjs
node scripts/check-faculty.mjs
node scripts/check-observatory.mjs
node --test scripts/tests/*.test.mjs tests/*.test.mjs
node scripts/release-report.mjs
node server.mjs
```

发布工作流保留以上数据与逻辑校验。PR 运行构建和检查，`main` 更新或手动运行发布 GitHub Pages。生成的数据包括：

| 文件 | 用途 |
| --- | --- |
| `dist/data/records.json` | 原有人员字段及范围标记；旧界面与旧 CSV 继续兼容 |
| `dist/data/catalog.json` | 原有项目、范围、覆盖、教师及配置 |
| `dist/data/observatory.json` | 统一人员、机构、职业事件、字段证据、分类词表、岗位、核验单元、队列和更新对比 |
| `dist/data/quality-report.json` | 字段缺失、名单覆盖、来源新鲜度、冲突与分项目指标 |
| `dist/data/release-report.json` | 相对固定基线的计数变化及新增／修订人员 ID |
| `reports/UPDATE.md` | 从当前构建自动生成的可读更新报告 |

`data/maintenance-baseline.json` 冻结改造前 Git 提交及指标、人员哈希，构建不会将它自动更新为当前值。需要新比较基线时，应有意创建新版本并保留旧快照。

## 统一观察库

`people` 保留稳定 ID 和所有历史字段。教师档案通过明确的 `placement_id` 关联；历史教师不会自动加入 placement 分母。没有确认同一身份时不按姓名近似合并。

`institutions` 使用稳定名称映射与机构 ID，保留别名、地区、院系及分校。自动移除院系后缀仅在机构前缀已存在于培养项目清单时进行，不进行模糊名称合并。

`events` 具有人员、类型、机构、院系、原职称、开始／结束日期、日期精度、岗位性质、tenure 状态和证据关联。来源名单年不会转成毕业事件。首次岗位可采用有独立证据的 `placement_start_date`；没有月份就保留年份精度，没有年份就保留空值。当前教师任职的 tenure 证据不倒填首职。

`claims` 记录字段和值、支持 URL、原文、来源日期、抓取日期、核验日期及冲突。旧数据迁移后的字段标为 `legacy_reference`，原文留空，明确表示历史来源关联而非本轮逐字段确认。新证据可在人员中写：

```json
{
  "claims": [{
    "field": "placement_start_date",
    "value": "2025-07-01",
    "status": "confirmed",
    "quote": "原始资料直接支持该字段的文字",
    "source_urls": ["https://example.edu/official-cv.pdf"],
    "source_date": null,
    "fetched_at": null,
    "checked_at": "2026-10-22",
    "conflict": null
  }]
}
```

上例仅为结构说明，不进入正式研究数据。没有原文与 URL 的新 claim 不会升级为原文确认。来源冲突与事实本身可同时保留：例如论文提交日期已确认，但不能据此解决授位年差异。

`data/taxonomy.json` 定义方向、主题、方法的标准 ID、同义词与定义；生成结果保留 `research.raw`。完整原文 `Empirical Industrial Organization` 等可作同义词标准化，证据等级仍为历史引用；机器学习、实验等单一方法不推导 QM 或 CB。暂定方向独立保存并由界面选择是否纳入。

岗位类型、原始职称、tenure 状态和证据等级分别保存。普通 Assistant Professor 是学术职称，tenure 保留未知；明确职称含 tenure-track 可标 `title_explicit`，独立原文核验的轨道证据才标 `confirmed`。既有基于职称的类别兼容保留，界面不将其表述为已核实合同。

## 名单覆盖与观察窗口

Marketing 与 IO 使用各自版本的范围。统一核验单元提供八类状态：未开始、名单已找到、部分核验、来源表对齐、整届完整、官方未发布、资料不足、项目资格待确认。项目资格、名册完整性和去向核验程度独立。

整届完整须有 `cohort_complete: true` 及独立 `completeness_evidence`（URL、支持完整性的原文和核验日期）。生成脚本和校验不会由来源表对齐、空名单或已知去向数量自动推导整届完整。当前季缺失单元自动显示未开始，其 `checked_at` 为 null；这不表示构建已经访问过官方页面。

项目比较必须明确来源年、毕业年、求职季或首职年。完整性只适用于被核验的名单与时间轴，不能借另一年的完整名单过滤当前记录。固定职业窗口保留未达到观察时长、毕业日期未知、连续任职证据不足及多重任职状态。历史开放结束时间不自动表示持续在职；当前任职观察也不能超过其真实核验日期。

招聘数据保存广告 ID、招聘季、机构／院系、研究标签、职级、岗位性质、来源和核验时间。跨平台公告通过明确匹配的来源归在同条记录；广告数、已公布招聘人数和实际聘用人数分别处理。未知人数为 null，零值保持为 0。过了明确截止日期的岗位在界面归历史，即使源记录尚未更新为 closed。

## 安全导入经核验批次

```sh
node scripts/apply-research-update.mjs data/research-updates/日期批次.json
```

批次必须有明确 `checked_at`，建议有稳定 `id`，条目含 `id`、`set`、`sources` 和可选 `note`。无批次 ID 的旧格式以内容哈希作为身份。同 ID 同内容重复执行无修改；同 ID 改内容拒绝导入。需要更正时创建新 ID 的批次。

旧批次默认不能覆盖较新核验日期的字段。确需采用较旧来源修正现值时，必须为每个改变的字段提供准确 `expected` 前置值；也可提供 `expected_checked_at` 或 `expected_hash` 进一步防止并发修改。即使采用较旧证据，人员核验日期也不会向后倒退。

导入前先完成身份、项目、来源、最终安排证据、成员关系等验证。数据文件与批次台账在同一受锁事务中替换；普通异常自动回滚所有已替换文件。并发文件变化会中止，不覆盖他人的新修改。异常进程终止若留下 `.batch-import.lock` 和 `.batch-transaction-*`，先检查事务备份及 Git 差异再恢复，不能直接重复导入。

本轮研究如果已经人工合入原始数据，可运行以下命令逐字段验证并登记，防止以后重放；任何 `set` 值或来源未匹配都会拒绝登记：

```sh
node scripts/register-applied-batch.mjs data/research-updates/日期批次.json --verify-only
node scripts/register-applied-batch.mjs data/research-updates/日期批次.json
```

台账在 `data/maintenance-batches.json`。历史批次不应随较新数据重新应用。

## 来源变化检测

```sh
node scripts/check-sources.mjs --limit=40 --concurrency=3 --timeout=15000
node scripts/sync-data.mjs
```

从人员、项目、教师、覆盖和招聘资料中发现 URL，优先轮换检查最久未查的来源。限制并发、单份大小与超时；保存 ETag、Last-Modified、原始字节哈希、标准化文本哈希、摘要、抓取时间和历史快照路径。仅在本地原始快照存在时发送条件请求；缓存被清空而元数据还在时会重新完整抓取。

HTML 提取可读文本并忽略脚本、样式和标签变化。PDF 保留原始文件哈希和快照；系统有 `pdftotext` 时提取文本，没有解析器时明确标注 `pdf_hash_only_parser_unavailable`，不声称已经读到 CV。二进制哈希变化只是核验线索，不能直接证明事实改变。

首次成功抓取建立来源基线。后续内容变化或不可用进入 `data/maintenance-queue.json`，检查状态保存在 `data/maintenance-sources.json`，简报保存在 `data/maintenance-source-report.json`。失败不删除旧哈希、摘要和成功快照，不修改人员事实、去向、完整性或核验日期。来源变化与冲突会在生成的统一数据中显示为待核验队列。

原始快照在 `data/source-snapshots/`，包含来源哈希与版本哈希目录，默认不进入 Git。已核验的数据、批次、范围版本和摘要可通过 Git 历史复现；原始网页快照的长期保存应单独归档。

`.github/workflows/source-checks.yml` 每周一 UTC 01:20（中国时间 09:20）运行，也支持手动执行并设置检查上限。任务恢复历史缓存，输出 review artifact，不自动合并研究事实或部署变更。Artifact 保留 90 天；GitHub 缓存可能被逐出，不能当作永久档案。需要长期保存时下载归档。缓存缺失不会伪造旧快照存在，也不会把 304 当作重新获取了原始内容。

定时检查报告是独立产物。维护者核验后，将所需状态、队列及证据批次合入仓库，重新生成、检查和发布，网站才更新。检查 run 整批失败会报告失败；个别受限来源保留具体错误和旧证据。

## 接收院校反查进度

网站 `#faculty` 默认打开院校进度，`faculty_view=people` 打开教师档案。地区、进度、搜索、排序、分页、当前院校及教师筛选写入 URL；旧教师筛选链接继续打开档案视图。进度 CSV 导出所有符合当前筛选的院校，而非仅当前页。

固定反查范围来自 Marketing 海外 58 校及内地指定 9 校，不表示这些学校均已开始核验。`faculty.json` 中的 `receiving_checks` 记录院校核验，`people` 记录个人证据。只有个人档案时显示“个案核验中”；没有两类记录时显示“尚未开始”，人数未知。地区卡片统计已启动院校，不是整系核验完成率。最近核验取院校和个人的最新日期，院校详细来源保留各自原日期。

`receiving_checks.status` 支持 `partial`、`blocked`、`needs_review` 和 `complete`。整系对齐须明确提供 `roster`：`status: confirmed_complete`、`scope`（院系、在职类型及排除规则）、`checked_at`（名单观察日）、`member_ids`（已入库人员 ID，去重且属于该院校）及 `evidence`（含 URL 和支持完整性判断的原文 `quote`）。单独写 `complete` 不会升级展示；校验会拒绝缺少这些依据的发布。明确核实的空名单可用空成员数组和完整性证据表达，未知人数则保持 null。个人现职变动不自动更新完整名单的观察日。

资料缺口的分母仅为已收录教师；未关联 placement 的历史教师继续独立保留。网页变化监测不产生新的事实、院校核验或人数，仍需核验后提交 `data/faculty.json`，运行生成与校验并发布。可运行 `node --test tests/faculty-progress.test.mjs` 检查范围、未知值、完整性门槛、状态筛选与导出。

## 北美46校批次与授位年补查（2026-10-22）

本轮可复现基线为 `data/faculty-baseline-na-2026-10-22.json`，固定保存原406人ID、博士年、职业片段数量与308条placement的时间和去向事实。三个北美研究批次及两个既有档案补查批次位于 `data/research-updates/`，已在 `faculty.json.import_batches` 登记；再次导入相同内容无变化，不能修改已应用批次后重跑。

`node scripts/faculty-na-report.mjs` 从当前权威数据重新生成北美逐校审计与既有档案变化。`sync-data.mjs` 自动执行该报告，并将汇总送到网站；不要运行旧 `faculty-report.mjs` 覆盖上一轮日期审计。测试 `scripts/tests/faculty-expansion.test.mjs` 检查46校、原有稳定ID及首职/最终安排没有被接收端教师数据改写。

已发布人员的主页更换时可用 `existing_faculty_id`，必须提供同一接收机构及 `identity_evidence.basis/source_urls`。仅姓名相似不能合并。博士 `date` 保留月/日精度，`defense_year` 和 `reported_dissertation_year` 不生成授位事件；确有第二个博士学位用 `additional_degrees`，不可把访问或联合培养作为第二学位。

职业片段的旧 `checked_at` 不随新批次刷新。只有现职目录且没有起止日期的片段不计入“有日期履历”，博士年、入职年和职级开始年不能互相替代。部分目录只证明某类在职研究教师，教学、荣休、访问、跨系身份的纳入/排除及目录陈旧问题须逐校记录。

## 本轮教师补查与可复现汇总

`node scripts/faculty-followup-report.mjs` 以 `faculty-baseline-followup-2026-10-22.json` 的1111位固定人员计算新增博士年、撤回冲突年份、有日期职业片段及六校名单变化；新教师缺失单列。`sync-data.mjs` 和Pages构建同时计算该报表。审计批次不可改写，修正须新批。

错误个人主页/CV链接可以使用 `reviewed_link_corrections` 明确撤下：须包含field、previous_value、reason和source_urls，并在sources提供同URL、字段supports和实际检查摘录。普通空链接仍保留旧值；撤下不会删除原来源及previous_versions。学位year为null且有reported_years或多值冲突时，不能被旧值保护机制填回。
