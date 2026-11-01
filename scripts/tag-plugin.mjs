import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const args = process.argv.slice(2)
const target = args.find((arg) => !arg.startsWith("--"))
const push = args.includes("--push")

if (!target) {
  console.error("usage: node scripts/tag-plugin.mjs <plugin-dir> [--push]")
  process.exit(1)
}

const pkg = JSON.parse(readFileSync(join(resolve(root, target), "package.json"), "utf8"))
const tag = `${pkg.name}@${pkg.version}`

try {
  execFileSync("git", ["rev-parse", "--git-dir"], { cwd: root, stdio: "ignore" })
} catch {
  console.error("not a git repository; run git init first")
  process.exit(1)
}

try {
  execFileSync("git", ["rev-parse", "--quiet", "--verify", `refs/tags/${tag}`], { cwd: root, stdio: "ignore" })
  console.error(`tag already exists: ${tag}`)
  process.exit(1)
} catch {
  // expected: tag does not exist yet
}

execFileSync("git", ["tag", tag], { cwd: root, stdio: "inherit" })
console.log(`created tag ${tag}`)

if (push) {
  execFileSync("git", ["push", "origin", tag], { cwd: root, stdio: "inherit" })
  console.log(`pushed tag ${tag}`)
}
