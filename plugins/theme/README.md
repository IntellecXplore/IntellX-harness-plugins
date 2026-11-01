# intellecXplore-theme

`@intellecxplore/plugin-theme` — 用 **智域探金 / IntellecXplore** 品牌重绘 DeepSeek Harness Web UI 的插件包。

> 本包是 monorepo [`intellecxplore-dsh`](../../README.md) 的 `plugins/theme` 包；根工作区命令见根 README。

## 能力

| 能力 | 说明 |
|---|---|
| 主题色板 | 深蓝 `#000057` + 电光蓝 `#005cff`；覆盖 14 个 `--dsw-alias-*` token，含 light/dark |
| 字体 | Sora / Noto Sans SC / PingFang SC 字体栈；代码区保持等宽 |
| 侧栏字标 | `IntellecXplore` wordmark，居中显示；右侧 HARNESS 徽标顶部对齐；展开态隐藏方形 mark |
| 品牌 mark | 折叠 rail 与空白会话 hero 使用 X mark；插件图标、favicon 同步 |
| 运行文案 | `深度求索中` → `智域探金中`，同时覆盖 `TextShimmer` 的 `data-shimmer-text` 高亮层 |
| 鲸鱼图标 | running 状态的鲸鱼尾巴替换为 X mark（CSS mask，继承文字颜色） |
| 设置面板 | 设置范围恢复宿主中性表面，不跟随品牌深蓝 |
| i18n | 注册 `intellecXplore-theme` 中英文词典（`full` / `name` / `tagline`） |
| 标题 | `document.title` 中的 DeepSeek 品牌名替换为 IntellecXplore |

## 架构

Agent 维护约束见 [AGENTS.md](AGENTS.md)。

```
intellecXplore-theme/
├── cordis.patch.yml      # 停用官方品牌行；插入品牌行 + 资产行
├── index.js              # 品牌 Host 行：仅生命周期日志
├── assets-server.js      # 资产 Host 行：注册 3 个同源 PNG 路由
├── client.js             # Client 半边：主题 token / slot / 文案 / 设置面板
├── icon.png              # 插件管理器图标
├── assets/
│   ├── logo-wordmark.png # 640×120，CSS mask 用
│   └── logo-mark.png     # 192×192，方形 X mark
├── locale/
│   ├── en.json
│   └── zh.json
├── package.json
├── README.md
├── AGENTS.md
└── skills/               # vendored DSH 插件/技能编写规范（rc.4）
```

### Host 路由

`assets-server.js` 用 `webServer.register` 提供：

| 路径 | 文件 |
|---|---|
| `/intellecxplore/brand/wordmark.png` | `assets/logo-wordmark.png` |
| `/intellecxplore/brand/mark.png` | `assets/logo-mark.png` |
| `/intellecxplore/brand/icon.png` | `icon.png` |

均为 `GET/HEAD`、`image/png`、`Cache-Control: public, max-age=60`；Client 只引用 URL，不内嵌 base64。

### Client 品牌层

- `ctx.theme.overrideTokens`：14 个 alias token，light/dark 成对。
- `ctx.slots`：
  - `sidebar.brand.mark` → `BrandMark`（展开态由 CSS 隐藏，rail 仍用）
  - `sidebar.brand.name` → `BrandName`（wordmark mask，132×25）
  - `conversation.hero.brand.mark` → `HeroMark`
- `ctx.locale.register`：中英文词典。
- 运行状态：文本节点 + `data-shimmer-text` 属性双写；`attributes` observer 只监听该属性。
- 设置面板：`[data-shortcut-modal="settings"]` 内局部恢复 `bg-layer-1/2` 与 `settings-card-fill`；dark 用 `body[data-ds-dark-theme]`。

## 主题色

| Token | Light | Dark |
|---|---|---|
| `--dsw-alias-bg-base` | `#ffffff` | `#070c1c` |
| `--dsw-alias-bg-layer-1` | `#ffffff` | `#0b1430` |
| `--dsw-alias-bg-layer-2` | `#f5f7fa` | `#101b3a` |
| `--dsw-alias-bg-overlay` | `#ffffff` | `#0c1430` |
| `--dsw-alias-brand-primary` | `#005cff` | `#5b8cff` |
| `--dsw-alias-label-primary` | `#101b33` | `#eef2fb` |
| `--dsw-alias-label-secondary` | `#5b677a` | `#9aa8c0` |
| `--dsw-specific-sidebar-fill` | `#f6f8fc` | `#050a17` |

完整列表见 [`client.js`](client.js#L11)。

设置面板例外：Light 使用 `#fff`，Dark 使用 `#2c2c2e`；输入框 Dark 使用 `#232324`，不跟随品牌色。

## 安装与更新

- 已安装到 `desktop` profile；profile 依赖是 `link:` 指向本目录。
- npm 安装（发布后）：

  ```sh
  dsh plugin --profile desktop add @intellecxplore/plugin-theme
  ```
- 修改 Client 代码后刷新页面；Host 代码变更需要重启宿主或让新模块行重新加载。
- 本次使用 `plugin_manager` 的 `set_bundle` 启停来重载插件；不要手写 profile 的 `package.json` / `cordis.patch.yml`。
- 资产路由可直接验证：

```sh
curl -I http://127.0.0.1:63814/intellecxplore/brand/wordmark.png
```

## 验证状态

已验证：

- `node --check client.js`、`assets-server.js`、JSON/YAML 解析。
- `exports` 子路径 `package.json` / `locale/zh.json` / `icon` / `client` 均可从 profile 解析。
- 三个资产路由返回 `200 image/png`。
- `ui-brand-official` 状态为 `inactive`；`conversation.hero.brand.mark` 已有占用。
- 技能 frontmatter 合法，相对链接 0 缺失。

未验证：

- 真实页面明暗主题、控制台 slot crash、running 波纹层最终视觉效果。
- 本会话没有浏览器控制，不能声称视觉通过。

## 已知限制

- **受控 DOM/CSS 例外**：running 文案与高亮层、鲸鱼替换、侧栏品牌行、设置面板均依赖内部结构/class 后缀或 data 属性：
  - `[data-chat-running]`
  - `data-shimmer-text`
  - `class*="runningIcon"` / `brandMark` / `brandIdentity`
  - `[data-shortcut-modal="settings"]`
  - `body[data-ds-dark-theme]`

  上游改结构/类名时会静默失效，需要随 DSH 升级复查。
- 全局 `characterData` observer 会在流式输出时收到较多 record；后续可改为按 running 元素局部观察。
- `document.title` 替换会作用于任何包含 `DeepSeek` 的标题，包括用户命名的 Session。
- `assets-server` 是子路径插件，按 DSH 规则不读根 `package.json`，该行没有自己的展示元数据。
- 如启用了第三方主题，其 token 层可能覆盖本插件的品牌 token；设置面板已做局部恢复，其余区域以实际主题为准。
- 品牌 PNG 为 IntellecXplore 商标资产，不在 MIT 范围内；见 `NOTICE`。

## 技能包

[`skills/`](skills/) 内置两份 DSH 技能：

- [`dsh-plugin-construction`](skills/dsh-plugin-construction/SKILL.md)
- [`dsh-skill-authoring`](skills/dsh-skill-authoring/SKILL.md)

来源：`Thatgfsj/dsh-plugin-skills`，commit `74455412ba468c13a6a6249441ace5043d539b8c`，版本目录 `0.2.1-rc.4`，MIT。详见 [`skills/PROVENANCE.txt`](skills/PROVENANCE.txt)。

DSH 技能发现是一层深（`<root>/<name>/SKILL.md`），本包内的技能不会自动加载。启用方式：

```yaml
customSkillDirs:
  - /Users/limingxuan/code/dsh/plugins/intellecxplore-dsh/plugins/theme/skills
```

或把两个技能目录复制到 `~/.dsh/skills/`。注意不要把 `customSkillDirs` 指向包含其他 `*.md` 的父目录。

版本提醒：技能基线是 `0.2.1-rc.4`（上游静态分析，rc.5 待办），本机运行时是 `0.2.1-rc.5`；slot/service 结论以本机 `cordis_inspect_query` 为准。
