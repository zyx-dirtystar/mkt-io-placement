# 把网站放到你自己的 GitHub

目标仓库：[zyx-dirtystar/mkt-io-placement](https://github.com/zyx-dirtystar/mkt-io-placement)。网站源文件与部署流程已准备好；是否发布成功，以仓库 Actions 中的绿色成功状态和 Pages 实际网址为准。现有私有预览继续保留。

你不需要一次完成下面所有步骤。我们可以每次只处理一步；不需要先学习命令行。

## 1. 确认账号与公开范围

本次使用的账号是 `zyx-dirtystar`，GitHub 连接与仓库写入权限已确认。不要发送密码、验证码或访问令牌。

GitHub 仓库保存网站文件和修改记录；GitHub Pages 将文件发布成网站。这是两件事。

使用 GitHub Free 发布 Pages 通常需要公开仓库；Pages 网站一般对外公开，即使来源仓库是私有的。若你只想自己查看，我们先保存私有代码，再选择合适的访问方式，不直接公开发布。公开仓库还会公开其中的研究资料与修改记录，因此上传前应检查整个仓库，而不只是网页。

## 2. 连接账号并准备仓库

可以按聊天中的 GitHub 安装或连接提示完成授权。也可以使用浏览器逐步操作。连接成功后，我们会确认目标仓库，再上传现有文件。

你已创建公开仓库 `mkt-io-placement`。仓库主分支使用 `main`，与已准备的工作流一致。

如果手动创建：GitHub 右上角 “+” → “New repository”，填写仓库名，并按已确认的公开范围选择 Public 或 Private。为了上传现有项目，初次创建无需勾选初始化 README、许可证或 .gitignore。

本地项目根目录是 `market-observatory`。上传时需要包含 `data`、`config.json`、`scripts`、`dist` 和隐藏目录 `.github`，不应把它们再包在仓库里的同名外层文件夹下。

`.openai/hosting.json` 是旧预览的配置，GitHub Pages 不使用它。GitHub 发布时只上传 `dist` 作为网站内容。

## 3. 开启 GitHub Pages

在目标仓库打开 “Settings” → “Pages”，在 “Build and deployment” 下把 “Source” 选择为 “GitHub Actions”。

然后打开 “Actions”，选择 “Publish website to GitHub Pages” → “Run workflow”，分支选择 `main`，运行。

流程会先生成网页数据，再执行数据检查；通过后才发布。失败时打开红色的步骤查看日志，把报错文字告诉我，我们一起修复。

## 4. 收藏网站

发布成功后，在仓库 “Settings” → “Pages” 或运行结果中找到实际网址并打开。预期地址是 `https://zyx-dirtystar.github.io/mkt-io-placement/`，以 GitHub 显示的实际地址为准。

首次验收包括：名录可加载、筛选有效、来源链接可打开、刷新后正常、手机上可浏览。

## 5. 以后更新

主要维护 `data/records.json` 中的人员记录。跨年时再修改 `config.json`，保留旧年份资料。每次将更新提交到 `main` 后，GitHub 会自动检查并重新发布。不要直接只修改 `dist/data`；它会从 `data` 重新生成。

自动发布不等于自动搜集数据。新增候选人、首职和证据仍需核验。

## 官方说明

- [创建 GitHub Pages 网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [选择发布方式与网站可见性](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [使用 GitHub Actions 发布](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
