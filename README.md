# intellecxplore-dsh

智域探金 / IntellecXplore 的 DeepSeek Harness 插件 **monorepo**。

当前只有 1 个真实插件（`plugins/theme`），目录和发布流程按 10 个插件设计；新增插件时横向复制 `plugins/<name>` 即可，不需要再改根工具链。

## 结构

```text
intellecxplore-dsh/
├── package.json                 # private workspace root；不声明 dsh
├── pnpm-workspace.yaml
├── .changeset/
│   └── config.json              # 独立版本；fixed/linked 为空
├── .github/workflows/
│   ├── ci.yml                   # check + pack + artifact
│   └── release.yml              # changesets/action 发布
├── scripts/
│   ├── check-all.mjs
│   ├── pack-plugin.mjs
│   └── tag-plugin.mjs
├── plugins/
│   └── theme/                   # 当前唯一真实插件
│       ├── package.json         # @intellecxplore/plugin-theme
│       ├── cordis.patch.yml
│       ├── index.js
│       ├── assets-server.js
│       ├── client.js
│       ├── assets/
│       ├── locale/
│       ├── icon.png
│       ├── README.md
│       ├── AGENTS.md
│       └── skills/
└── packages/                    # 预留共享源码/构建包（当前为空）
```

## 快速开始

```sh
pnpm install
pnpm check
pnpm pack:all
```

`pnpm pack:all` 会为每个 `plugins/*` 生成独立 tarball：

```text
dist/<plugin-dir>/<package-name>-<version>.tgz
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `pnpm check` | 校验每个插件的 `dsh.bundle`、exports、patch 和 JS 语法 |
| `pnpm pack:all` | 打包全部插件到 `dist/` |
| `pnpm pack:theme` | 只打包 `plugins/theme` |
| `pnpm tag:theme` | 为 `plugins/theme` 创建 `<package>@<version>` git tag |
| `pnpm changeset` | 为改动包记录一个 changeset |
| `pnpm version-packages` | 按 changeset 提升版本并生成 CHANGELOG |
| `pnpm release` | `changeset publish`，只发布有变化的包 |

## 独立版本 / 独立 tag

每个插件包有自己的 `version`。`.changeset/config.json` 里：

```json
{ "fixed": [], "linked": [] }
```

表示 10 个插件互不绑定，各自 patch/minor/major。

Changesets 默认 tag：

```text
@intellecxplore/plugin-theme@1.1.2
```

手动创建（不推送）：

```sh
pnpm tag:theme
# 或
node scripts/tag-plugin.mjs plugins/theme
```

推送：

```sh
git push origin "@intellecxplore/plugin-theme@1.1.2"
```

单个插件打包：

```sh
pnpm pack:theme
# 或
node scripts/pack-plugin.mjs plugins/theme
```

单个插件 GitHub Release：

```sh
gh release create "@intellecxplore/plugin-theme@1.1.2" \
  dist/theme/*.tgz \
  --title "intellecxplore-theme 1.1.2" \
  --notes "…"
```

## 新增一个插件

1. 复制一个现有插件作为起点，或在 `plugins/<name>/` 新建最小包：

   ```sh
   cp -R plugins/theme plugins/<name>
   ```

2. 修改该包的：
   - `package.json` 的 `name` / `version` / `description` / `icon` / `repository`；
   - `cordis.patch.yml` 的行 `id`（必须全局唯一）；
   - `assets-server.js` 的路由前缀（不要和别的插件撞路径）；
   - `locale/*.json` 的标题/描述；
   - `README.md` / `AGENTS.md`。
3. 保证 `dsh.bundle.patch` 存在；带 Web UI 的包再加 `dsh.client` 和 `./client`。
4. `exports` 必须包含 `./package.json`、`./locale/*.json`、`./icon`；有 UI 再加 `./client`。
5. `pnpm install`，然后 `pnpm check`。
6. 在 profile 里单独安装/重装该包。

**不要**为了凑 10 个插件而创建空壳包；市场/评审要求真实可运行代码。

## DSH 约束

- 根 `package.json` 不要声明 `dsh`；它是 workspace root，不是插件。
- 每个 `plugins/*` 是独立 bundle，独立安装、独立版本、独立 tarball。
- patch 的 `config` 是整体替换，不是深合并；行 `id` 必须唯一，避免 10 个插件互相覆盖。
- 10 个“品牌主题”不建议做 10 个 bundle：每个都停用 `ui-brand-official`、覆盖同一批 token 会互斥。更合适的是一个 theme 插件注册 10 个 `ThemeDefinition`，用户在主题列表切换。
- Client 共享代码不能直接 `require` 一个未注册的 workspace 包；需要 esbuild/tsdown 打包进每个 `client.js`，或接受复制代码。
- 每个包声明 `engines.dsh` 时需实测预发布版本的 semver 匹配；当前 theme 已声明 `>=0.2.1-rc.2 <0.3.0`。
- 安装/重装统一走 `plugin_manager` 或 `dsh plugin --profile <p> add ...`，不要手写 profile。

## 当前插件

- 目录：`plugins/theme`
- 包名：`@intellecxplore/plugin-theme`
- 版本：`1.1.2`
- profile：`desktop`，通过 `link:` 指向本目录
- 文档：`plugins/theme/README.md`、`plugins/theme/AGENTS.md`
- 技能：`plugins/theme/skills/`（vendored DSH 插件/技能规范）

## 发布到线上

当前包已按公开 npm 配置：

- 包名：`@intellecxplore/plugin-theme`
- 已补 `LICENSE`（MIT）、`NOTICE`（品牌资产）、`repository`、`homepage`、`keywords`、`engines.dsh`
- GitHub 仓库已公开；固定名资产 `intellecxplore-theme.tgz` 提供 latest tarball

npm 发布（需要 npm 账号拥有 `@intellecxplore` scope）：

```sh
cd plugins/theme
npm publish --access public
```

安装：

```sh
dsh plugin --profile desktop add @intellecxplore/plugin-theme
```

上架 dshmarket 时，向 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 提交 `category: theme` 条目；monorepo 子包的 `url` 指向 `plugins/theme`，`name` 用 `owner/repo#theme`。

## Git

本目录是一个**独立 git 仓库**，嵌套在个人 home 仓库下。父仓库不要把本目录 `git add` 进去；tag/Release 都只在本仓库内操作。

已初始化 `main`，完成首个提交，并已创建首个 tag：

```sh
git tag
# @intellecxplore/plugin-theme@1.1.2
```

后续提交与标签：

```sh
git add .
git commit -m "feat(theme): ..."
pnpm tag:theme
```

## 文档

- 根：`README.md`、`AGENTS.md`
- 插件：`plugins/theme/README.md`、`plugins/theme/AGENTS.md`
- 技能：`plugins/theme/skills/`（不改上游正文；升级时更新 `PROVENANCE.txt`）
