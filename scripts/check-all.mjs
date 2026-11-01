import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const pluginsDir = join(root, "plugins")
const errors = []
const checked = []

for (const entry of readdirSync(pluginsDir)) {
  const dir = join(pluginsDir, entry)
  if (!statSync(dir).isDirectory()) continue
  const manifest = join(dir, "package.json")
  if (!existsSync(manifest)) continue

  const pkg = JSON.parse(readFileSync(manifest, "utf8"))
  const where = relative(root, dir)
  const fail = (message) => errors.push(`${where}: ${message}`)

  if (!pkg.name) fail("package.json name is required")
  if (!pkg.version) fail("package.json version is required")
  if (!pkg.dsh?.bundle?.patch) fail("dsh.bundle.patch is required")

  const patch = pkg.dsh?.bundle?.patch
  if (patch) {
    const patchPath = join(dir, patch)
    if (!existsSync(patchPath)) fail(`patch file not found: ${patch}`)
    else if (!readFileSync(patchPath, "utf8").includes("insert:")) fail(`patch has no insert block: ${patch}`)
  }

  const exports = pkg.exports ?? {}
  for (const key of ["./package.json", "./locale/*.json", "./icon"]) {
    if (!(key in exports)) fail(`exports["${key}"] is required`)
  }

  if (pkg.dsh?.client) {
    if (pkg.dsh.client.platform !== "web") fail("dsh.client.platform should be web")
    if (!("./client" in exports)) fail('exports["./client"] is required for dsh.client')
  }

  for (const key of ["./client", "./icon"]) {
    const target = exports[key]
    if (typeof target === "string" && !existsSync(join(dir, target))) {
      fail(`export target not found: ${key} -> ${target}`)
    }
  }

  for (const file of ["index.js", "client.js", "assets-server.js"]) {
    const path = join(dir, file)
    if (!existsSync(path)) continue
    const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
      input: readFileSync(path),
      encoding: "utf8",
    })
    if (result.status !== 0) fail(`${file}: ${(result.stderr || result.error || "syntax error").trim()}`)
  }

  checked.push(`${pkg.name}@${pkg.version}`)
}

if (errors.length > 0) {
  console.error("plugin check failed:\n" + errors.map((error) => ` - ${error}`).join("\n"))
  process.exit(1)
}

console.log(`checked ${checked.length} package(s): ${checked.join(", ")}`)
