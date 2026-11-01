window.__ModuleLoader__.load({
  id: "@local/intellecxplore-theme",
  factory(require) {
    const React = require("react")
    const h = React.createElement

    const WORDMARK = "/intellecxplore/brand/wordmark.png"
    const MARK = "/intellecxplore/brand/mark.png"
    const FAVICON = "/intellecxplore/brand/icon.png"

    const TOKENS = {
      "--dsw-alias-bg-base": { light: "#ffffff", dark: "#070c1c" },
      "--dsw-alias-bg-layer-1": { light: "#ffffff", dark: "#0b1430" },
      "--dsw-alias-bg-layer-2": { light: "#f5f7fa", dark: "#101b3a" },
      "--dsw-alias-bg-overlay": { light: "#ffffff", dark: "#0c1430" },
      "--dsw-alias-border-l1": { light: "rgba(16, 27, 51, 0.10)", dark: "rgba(255, 255, 255, 0.10)" },
      "--dsw-alias-border-l2": { light: "rgba(16, 27, 51, 0.18)", dark: "rgba(255, 255, 255, 0.18)" },
      "--dsw-alias-brand-primary": { light: "#005cff", dark: "#5b8cff" },
      "--dsw-alias-label-primary": { light: "#101b33", dark: "#eef2fb" },
      "--dsw-alias-label-secondary": { light: "#5b677a", dark: "#9aa8c0" },
      "--dsw-alias-state-error-primary": { light: "#d92d20", dark: "#f97066" },
      "--dsw-alias-state-idle-primary": { light: "#8a94a6", dark: "#7c8aa3" },
      "--dsw-alias-state-success-primary": { light: "#2f9c79", dark: "#64d4b5" },
      "--dsw-alias-state-warn-primary": { light: "#b97613", dark: "#f5c26b" },
      "--dsw-specific-sidebar-fill": { light: "#f6f8fc", dark: "#050a17" },
    }

    const CSS = `
      :root {
        --ix-font-sans: "Sora", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif;
        --ix-font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      }
      body, button, input, select, textarea {
        font-family: var(--ix-font-sans) !important;
        -webkit-font-smoothing: antialiased;
      }
      code, pre, kbd, samp {
        font-family: var(--ix-font-mono) !important;
      }
      ::selection {
        background: var(--dsw-alias-brand-primary);
        color: var(--dsw-alias-bg-base);
      }
      /* Replace the running-status whale tail with the IntellecXplore mark. */
      [data-chat-running] > span:last-child > span[aria-hidden="true"]:first-child,
      [data-chat-running] [class*="runningIcon"] {
        background-color: currentColor !important;
        -webkit-mask-image: url("/intellecxplore/brand/mark.png") !important;
        mask-image: url("/intellecxplore/brand/mark.png") !important;
        -webkit-mask-size: contain !important;
        mask-size: contain !important;
        -webkit-mask-repeat: no-repeat !important;
        mask-repeat: no-repeat !important;
        -webkit-mask-position: center !important;
        mask-position: center !important;
      }
      [data-chat-running] > span:last-child > span[aria-hidden="true"]:first-child > *,
      [data-chat-running] [class*="runningIcon"] > * {
        display: none !important;
      }
      /* Sidebar brand: remove the mark seat so the wordmark centers in the whole row. */
      [class*="brandMark"] {
        display: none !important;
      }
      [class*="brandIdentity"] {
        width: 100% !important;
        justify-content: center !important;
      }
      /* Settings keeps the host's neutral surfaces instead of the brand layer tokens. */
      [data-shortcut-modal="settings"] {
        --dsw-alias-bg-layer-1: var(--dsw-static-neutral-bluish-00);
        --dsw-alias-bg-layer-2: var(--dsw-static-neutral-bluish-00);
        --dsw-alias-settings-card-fill: var(--dsw-static-neutral-bluish-00);
      }
      body[data-ds-dark-theme] [data-shortcut-modal="settings"] {
        --dsw-alias-bg-layer-1: var(--dsw-static-neutral-bluish-875);
        --dsw-alias-bg-layer-2: var(--dsw-static-neutral-bluish-850);
        --dsw-alias-settings-card-fill: var(--dsw-static-neutral-bluish-850);
      }
    `

    const PHRASES = [
      ["深度求索中，用时", "智域探金中，用时"],
      ["深度求索中", "智域探金中"],
    ]
    const CHARS = { "深": "智", "度": "域", "求": "探", "索": "金" }

    function maskStyle(src, width, height, color) {
      return {
        width,
        height,
        flex: "0 0 auto",
        display: "block",
        backgroundColor: color,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }
    }

    function BrandMark({ size = 28 }) {
      const edge = Number(size) > 0 ? Number(size) : 28
      const glyph = Math.max(14, Math.round(edge * 0.7))
      return h("span", {
        "aria-hidden": "true",
        "data-ix-brand-mark": "true",
        style: {
          width: edge,
          height: edge,
          flex: "0 0 auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Math.round(edge * 0.28),
          backgroundColor: "#000057",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 6px 18px -10px rgba(0,0,87,0.65)",
        },
      }, h("span", { style: maskStyle(MARK, glyph, glyph, "#ffffff") }))
    }

    function BrandName({ label }) {
      const text = label || "智域探金 · IntellecXplore"
      return h(React.Fragment, null,
        h("span", {
          role: "img",
          "aria-label": text,
          title: text,
          "data-ix-brand-name": "true",
          style: maskStyle(WORDMARK, 132, 25, "var(--dsw-alias-label-primary)"),
        }),
        h("span", {
          "aria-hidden": "true",
          "data-ix-brand-badge": "true",
          style: {
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            height: 16,
            padding: "0 6px",
            borderRadius: 3,
            background: "var(--dsw-alias-label-primary)",
            color: "var(--dsw-alias-bg-base)",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.08em",
            lineHeight: "16px",
            whiteSpace: "nowrap",
            flex: "0 0 auto",
          },
        }, "HARNESS")
      )
    }

    function HeroMark({ size = 40, className }) {
      return h("span", {
        className,
        "data-ix-hero-mark": "true",
        style: { display: "inline-flex", alignItems: "center", justifyContent: "center" },
      }, h(BrandMark, { size }))
    }

    function replaceBrandText(value) {
      if (!value || !/[深度求索]/.test(value)) return value
      let next = value
      for (const [from, to] of PHRASES) next = next.split(from).join(to)
      if (/[深度求索]/.test(next)) next = next.replace(/[深度求索]/g, (ch) => CHARS[ch])
      return next
    }

    function rewriteRunningNode(node) {
      const current = node.nodeValue
      const next = replaceBrandText(current)
      if (next !== current) node.nodeValue = next
    }

    function rewriteShimmerAttribute(element) {
      if (!element || typeof element.getAttribute !== "function") return
      const current = element.getAttribute("data-shimmer-text")
      const next = replaceBrandText(current)
      if (next !== current) element.setAttribute("data-shimmer-text", next)
    }

    function rewriteRunningTree(root) {
      if (!root) return
      if (root.nodeType === 3) {
        rewriteRunningNode(root)
        return
      }
      if (root.nodeType !== 1) return
      rewriteShimmerAttribute(root)
      for (let child = root.firstChild; child; child = child.nextSibling) rewriteRunningTree(child)
    }

    function installRunningCopy() {
      if (typeof document === "undefined" || typeof MutationObserver === "undefined" || !document.body) {
        return () => {}
      }
      const selector = "[data-chat-running]"
      const scan = () => {
        for (const element of document.querySelectorAll(selector)) rewriteRunningTree(element)
      }
      scan()
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          if (record.type === "characterData") {
            const parent = record.target.parentElement
            if (parent && typeof parent.closest === "function" && parent.closest(selector)) {
              rewriteRunningNode(record.target)
            }
            continue
          }
          if (record.type === "attributes") {
            if (record.attributeName === "data-shimmer-text") rewriteShimmerAttribute(record.target)
            continue
          }
          for (const node of record.addedNodes) {
            if (node.nodeType !== 1) continue
            if (typeof node.matches === "function" && node.matches(selector)) {
              rewriteRunningTree(node)
              continue
            }
            if (typeof node.querySelectorAll === "function") {
              for (const element of node.querySelectorAll(selector)) rewriteRunningTree(element)
            }
          }
        }
      })
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["data-shimmer-text"],
      })
      return () => observer.disconnect()
    }

    function installTitle() {
      if (typeof document === "undefined" || typeof MutationObserver === "undefined") return () => {}
      const fix = () => {
        const current = document.title || ""
        const next = current
          .replace(/DeepSeek Harness/g, "IntellecXplore")
          .replace(/DeepSeek/g, "IntellecXplore")
          .replace(/深度求索/g, "智域探金")
        if (next !== current) document.title = next
      }
      fix()
      const title = document.querySelector("title")
      const observer = new MutationObserver(fix)
      if (title) observer.observe(title, { childList: true, characterData: true, subtree: true })
      return () => observer.disconnect()
    }

    function installFavicon() {
      if (typeof document === "undefined" || !document.head) return () => {}
      const link = document.createElement("link")
      link.rel = "icon"
      link.type = "image/png"
      link.href = FAVICON
      link.dataset.ixFavicon = "true"
      document.head.appendChild(link)
      return () => link.remove()
    }

    return {
      inject: ["slots", "theme", "locale"],
      apply(ctx) {
        const t = ctx.locale.bind("intellecXplore-theme")

        ctx.effect(() => ctx.locale.register("intellecXplore-theme", "en", {
          name: "IntellecXplore",
          full: "IntellecXplore",
          tagline: "AI-powered global trade growth",
        }))
        ctx.effect(() => ctx.locale.register("intellecXplore-theme", "zh", {
          name: "智域探金",
          full: "智域探金 · IntellecXplore",
          tagline: "AI 驱动的外贸增长引擎",
        }))

        ctx.effect(() => ctx.theme.overrideTokens("@local/intellecxplore-theme", TOKENS))

        ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.register({ name: "sidebar.brand.mark" }, BrandMark))
        ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register({ name: "sidebar.brand.name" }, () => h(BrandName, { label: t("full") })))
        ctx.slots.inject("conversation.hero.brand.mark", () => ctx.slots.register({ name: "conversation.hero.brand.mark" }, HeroMark))

        ctx.effect(installRunningCopy)
        ctx.effect(installTitle)
        ctx.effect(installFavicon)
        ctx.effect(() => {
          const style = document.createElement("style")
          style.dataset.ixTheme = "true"
          style.textContent = CSS
          document.head.appendChild(style)
          return () => style.remove()
        })

        console.log("hello,world")
        ctx.on("ready", () => console.log("hello,world"))
        ctx.on("theme/change", () => console.log("hello,world"))
        ctx.on("slots/changed", () => console.log("hello,world"))
        ctx.on("locale/change", () => console.log("hello,world"))
        ctx.on("dispose", () => console.log("hello,world"))
      },
    }
  },
})
