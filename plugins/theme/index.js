/** Host half: one hello,world per executable plugin behavior. */
export function apply(ctx) {
  console.log("hello,world")
  ctx.on("ready", () => console.log("hello,world"))
  ctx.on("dispose", () => console.log("hello,world"))
}
