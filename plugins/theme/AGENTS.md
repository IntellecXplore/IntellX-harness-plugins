# AGENTS.md

面向在本仓库工作的 Agent 与维护者。先读 [README.md](README.md)。

## 项目定位

`@local/intellecxplore-theme` 是本地 DSH profile 插件包：用 **智域探金 / IntellecXplore** 品牌重绘 DeepSeek Harness Web UI。它不是通用主题市场包，品牌名、色板、字标和文案是固定产品决策。

## 目录职责

| 文件 | 职责 |
|---|---|
| `cordis.patch.yml` | 停用 `ui-brand-official`；插入品牌行 `intellecXplore-theme` 与资产行 `intellecXplore-theme-assets` |
| `index.js` | 品牌 Host 行，只做生命周期日志；保持最小 |
| `assets-server.js` | 资产 Host 行：3 个 exact PNG 路由，GET/HEAD |
| `client.js` | 全部品牌逻辑：token、slot、字体、文案、设置面板、favicon/title |
| `package.json` | `dsh.bundle` + `dsh.client` + exports/files |
| `README.md` | 用户/维护者文档，单一事实来源 |
| `skills/` | vendored DSH 插件与技能编写规范（rc.4） |

## 修改流程

1. 改代码；品牌资产保持独立 PNG，不放 base64。
2. 验证：
   ```sh
   node --check client.js
   node --input-type=module --check < assets-server.js
   node -e 'JSON.parse(require("fs").readFileSync("package.json","utf8"))'
   ```
3. 重载插件（当前 `desktop` profile）：
   - 使用 `plugin_manager` 的 `set_bundle`，目标 `@local/intellecxplore-theme`，先 `false` 再 `true`；
   - 不要手写 profile 的 `package.json` / `cordis.patch.yml`，不要在 profile 目录跑 pnpm。
4. 刷新页面；Host 半边代码变更通常需要重启宿主或重新加载模块行。
5. 抽查：
   ```sh
   curl -I http://127.0.0.1:63814/intellecxplore/brand/wordmark.png
   ```
   以及 `cordis_inspect_query` 的 `Slots.listSubTree`。

## 硬约束

- **Client 只在 slot 里渲染 React 组件**；不要 `require` 任何 `@deepseek-ai/dsh-client-*` 包，不要 iframe，不要替换 app root。
- **品牌资产必须独立文件 + Host `webServer` 路由**；`client.js` 里禁止出现 `data:image/png;base64,...`。
- **主题颜色优先用 `--dsw-alias-*` token**；字面颜色只允许出现在 logo / mark 插画内部。
- **设置面板保持宿主中性表面**：`[data-shortcut-modal="settings"]` 内恢复 `bg-layer-1/2` 和 `settings-card-fill`，不要套品牌深蓝。
- **运行文案双写**：同时改文本节点和 `data-shimmer-text` 属性；`TextShimmer` 的高亮层不是文本节点。
- 所有注册（slot、theme、locale、observer、style、favicon）都要在 `ctx.effect` / `ctx.on` 里返回 cleanup。
- 有 `exports` 就必须导出 `./package.json`、`./locale/*.json`、`./icon`、`./client`、`./assets-server`，否则展示元数据或加载会静默失效。
- 不提交临时/中间文档或审查快照；项目文档只保留 `README.md`、`AGENTS.md`、`skills/`（含 `PROVENANCE.txt`、`LICENSE`）。
- 不擅自新增 `engines.dsh`；当前是本地私有包，分发前再补并实测。

## 当前视觉行为（不要回退）

- 侧栏展开态：`brandMark` 隐藏，`IntellecXplore` wordmark 在整行居中；折叠 rail 与空白会话 hero 仍显示 X mark。
- running 状态：鲸鱼尾巴替换为 X mark；文案显示“智域探金中”，波纹高亮层也必须是“智域探金中”。
- 设置面板：Light `#fff`，Dark `#2c2c2e`；输入框 Dark `#232324`。
- favicon 与插件管理器图标使用 `icon.png` / `/intellecxplore/brand/icon.png`。

## 升级敏感点

DSH 升级后优先复查这些内部结构；失效时通常是静默回退，不会报错：

- `[data-chat-running]` 与 `data-shimmer-text`
- `class*="runningIcon"`、`brandMark`、`brandIdentity`
- `[data-shortcut-modal="settings"]`
- `body[data-ds-dark-theme]`
- slot 名：`sidebar.brand.mark`、`sidebar.brand.name`、`conversation.hero.brand.mark`
- `ui-brand-official` 是否仍可被 patch 停用

## 验证边界

- 能验证：语法、manifest/exports、YAML、资产路由 200、品牌行 `inactive`、slot occupant、client 注册。
- 不能只凭这些声称视觉通过；真实页面需要看：控制台无 slot crash、明暗主题各一次、侧栏字标居中、running 文案与波纹层、设置面板底色。
- 没有浏览器控制时，明确写“渲染未验证”。

## 技能包

`skills/` 是 vendored 的 `Thatgfsj/dsh-plugin-skills` rc.4（MIT，commit 见 `skills/PROVENANCE.txt`）。DSH 技能发现是一层深，插件包内不会自动加载；通过 `customSkillDirs` 指向本目录，或复制两个技能目录到 `~/.dsh/skills/`。

升级技能时：替换对应目录、更新 `PROVENANCE.txt`，不要手改上游正文；本地运行时是 `0.2.1-rc.5`，上游基线是 `0.2.1-rc.4`，结论以本机 inspection 为准。
