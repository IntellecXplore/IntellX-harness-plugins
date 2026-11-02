import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const BRAND = "/intellecxplore/brand"

/** Brand assets served to the Web client as ordinary same-origin files. */
const ASSETS = [
  { name: "wordmark.png", file: "./assets/logo-wordmark.png", contentType: "image/png" },
  { name: "mark.png", file: "./assets/logo-mark.png", contentType: "image/png" },
  { name: "icon.png", file: "./icon.png", contentType: "image/png" },
  { name: "favicon.ico", file: "./assets/favicon.ico", contentType: "image/x-icon" },
  { name: "icon-16.png", file: "./assets/icon-16.png", contentType: "image/png" },
  { name: "icon-32.png", file: "./assets/icon-32.png", contentType: "image/png" },
  { name: "icon-48.png", file: "./assets/icon-48.png", contentType: "image/png" },
  { name: "icon-64.png", file: "./assets/icon-64.png", contentType: "image/png" },
  { name: "icon-128.png", file: "./assets/icon-128.png", contentType: "image/png" },
  { name: "icon-180.png", file: "./assets/icon-180.png", contentType: "image/png" },
  { name: "icon-192.png", file: "./assets/icon-192.png", contentType: "image/png" },
  { name: "icon-256.png", file: "./assets/icon-256.png", contentType: "image/png" },
  { name: "icon-512.png", file: "./assets/icon-512.png", contentType: "image/png" },
  { name: "manifest.webmanifest", file: "./assets/manifest.webmanifest", contentType: "application/manifest+json" },
].map((asset) => ({
  path: `${BRAND}/${asset.name}`,
  file: fileURLToPath(new URL(asset.file, import.meta.url)),
  contentType: asset.contentType,
}))

export function apply(ctx) {
  ctx.inject(["webServer"], (scope) => {
    for (const asset of ASSETS) {
      scope.effect(
        () =>
          scope.webServer.register({
            kind: "exact",
            path: asset.path,
            handler: async (req, res) => {
              if (req.method !== "GET" && req.method !== "HEAD") {
                res.writeHead(405)
                res.end()
                return
              }
              try {
                const body = await readFile(asset.file)
                res.writeHead(200, {
                  "content-type": asset.contentType,
                  "content-length": String(body.length),
                  "cache-control": "public, max-age=60",
                })
                if (req.method === "HEAD") res.end()
                else res.end(body)
              } catch {
                res.writeHead(404)
                res.end()
              }
            },
          }),
        `intellecXplore-theme: ${asset.path}`,
      )
    }
  })
}
