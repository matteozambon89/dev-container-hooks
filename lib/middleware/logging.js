exports.handler = async (ctx, next) => {
  console.log('EXEC', ctx.path)
  Object.entries(ctx.query).forEach(([key, value]) => console.log(`  - ${key}`, value))

  await next()

  console.log(`Responded ${ctx.status}`, ctx.body)
}
