# AGENTS.md

本文件面向 `intellecxplore-dsh` monorepo 内的 Agent/维护者。先读根 [`README.md`](README.md)；具体插件再读该包的 `AGENTS.md`。

## 当前状态

- 1 个真实插件：`plugins/theme`（`@local/intellecxplore-theme@1.1.2`）。
- 结构按 10 个插件设计；新增插件横向复制 `plugins/<name>`。
- 根 `package.json` 是 private workspace root，不声明 `dsh`。

## 常用命令

```sh
pnpm install
pnpm check                 # 校验所有插件 manifest/exports/patch/JS 语法
pnpm pack:all              # 全部插件打包到 dist/<dir>/
pnpm pack:theme            # 只打包 plugins/theme
pnpm tag:theme             # 创建 <package>@<version> tag
pnpm changeset             # 记录改动
pnpm version-packages      # 提升版本 + CHANGELOG
pnpm release               # changeset publish（只发有变化的包）
```

## 硬约束

- 每个 `plugins/*` 必须独立声明 `dsh.bundle.patch`；带 UI 时声明 `dsh.client` + `./client`。
- `exports` 必须包含 `./package.json`、`./locale/*.json`、`./icon`；有 UI 再加 `./client`。
- patch 行 `id` 全局唯一；`config` 是整体替换，不要假设深合并。
- 根不声明 `dsh`；不要把根目录当成插件安装。
- Client 侧不要 `require` 任何 `@deepseek-ai/dsh-client-*` 包；共享 Client 代码必须构建进各自的 `client.js`（esbuild/tsdown），不能运行时 require 未注册的 workspace 包。
- 品牌资产保持独立 PNG + Host `webServer` 路由；不要在 `client.js` 内嵌 base64。
- 每个插件独立版本、独立 tag、独立 tarball；不要用一个仓库版本号覆盖 10 个包。
- 发布前补 `engines.dsh` 并实测；`private: true` 的包不能 npm publish。
- 安装/重装 profile 统一走 `plugin_manager` 或 `dsh plugin --profile <p> add ...`，不要手写 profile。
- 不创建空壳插件凑数；市场评审要求真实可运行代码。
- 不提交中间文档/审查快照；文档只保留 README、AGENTS、包的 README/AGENTS、skills/（含 PROVENANCE/LICENSE）。

## 10 个插件的组合规则

- 独立功能插件：各自插入唯一行、唯一资源路由、唯一 slot id，避免互相覆盖。
- 主题/品牌变体：不要做 10 个都停用 `ui-brand-official`、覆盖同一批 token 的 bundle；用一个 theme 插件注册多个 `ThemeDefinition`，让用户切换。
- 共享 Host 代码可放 `packages/*`，用 `workspace:^` 依赖；共享 Client 代码走构建。
- 若做主题包，先确认 `fixed`/`linked` 为空，保持独立版本。

## 升级敏感点

DSH 升级后，`plugins/theme` 的品牌层依赖这些内部结构，失效通常无报错：

- `[data-chat-running]`、`data-shimmer-text`
- `class*="runningIcon"`、`brandMark`、`brandIdentity`
- `[data-shortcut-modal="settings"]`
- `body[data-ds-dark-theme]`
- slot：`sidebar.brand.mark`、`sidebar.brand.name`、`conversation.hero.brand.mark`
- `ui-brand-official` 是否仍可被 patch 停用

## 验证边界

- 能验证：`pnpm check`、`pnpm pack:all`、资产路由 200、profile 行状态、slot occupant。
- 不能只凭这些声称视觉通过；真实页面需要看明暗主题、slot crash、侧栏字面居中、running 文案/波纹、设置面板底色。
- 没有浏览器控制时，明确写“渲染未验证”。

## Git / 发布

- 本目录是独立 git 仓库；父 home 仓库不要 add 本目录。
- tag 格式：`<package-name>@<version>`；`@`/`/` 在 shell 中要加引号。
- GitHub Release 每个 tag 独立创建，tarball 来自 `dist/<dir>/`。
- 公开上架前先处理 scope、private、license、品牌授权、`engines.dsh`。
