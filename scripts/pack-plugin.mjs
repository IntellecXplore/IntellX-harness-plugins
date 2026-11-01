import { execFileSync } from "node:child_process"
import { mkdirSync, readdirSync, readFileSync, statSync } from "node:fs"
import { basename, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const args = process.argv.slice(2)
const targets = args.includes("--all")
  ? readdirSync(join(root, "plugins"))
      .filter((name) => statSync(join(root, "plugins", name)).isDirectory())
      .map((name) => join("plugins", name))
  : args.filter((arg) => !arg.startsWith("--"))

if (targets.length === 0) {
  console.error("usage: node scripts/pack-plugin.mjs <plugin-dir> | --all")
  process.exit(1)
}

for (const target of targets) {
  const dir = resolve(root, target)
  const manifest = join(dir, "package.json")
  const pkg = JSON.parse(readFileSync(manifest, "utf8"))
  const out = join(root, "dist", basename(dir))
  mkdirSync(out, { recursive: true })

  console.log(`\npack ${pkg.name}@${pkg.version} -> ${out}`)
  execFileSync("npm", ["pack", "--pack-destination", out], { cwd: dir, stdio: "inherit" })
}
