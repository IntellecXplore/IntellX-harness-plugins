import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

/** Brand assets served to the Web client as ordinary same-origin PNG files. */
const ASSETS = [
  {
    path: "/intellecxplore/brand/wordmark.png",
    file: fileURLToPath(new URL("./assets/logo-wordmark.png", import.meta.url)),
  },
  {
    path: "/intellecxplore/brand/mark.png",
    file: fileURLToPath(new URL("./assets/logo-mark.png", import.meta.url)),
  },
  {
    path: "/intellecxplore/brand/icon.png",
    file: fileURLToPath(new URL("./icon.png", import.meta.url)),
  },
]

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
                  "content-type": "image/png",
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
