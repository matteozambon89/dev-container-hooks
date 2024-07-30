const Router = require('@koa/router')

const routes = require('./routes.js')

exports.init = () => {
  const router = new Router()

  routes.filter(({ type }) => type === 'route').forEach(route => this.addRoute(router, route))
  routes.filter(({ type }) => type === 'hook').forEach(hook => this.addHook(router, hook))

  return router
}

exports.addRoute = (router, { method = 'all', route, handler, middleware = [] }) => {
  console.log('Registering route', route)
  router[method](route, ...middleware, handler)
}

exports.addHook = (router, { route, handler, middleware = [] }) => {
  console.log('Registering hook', route)
  router.get(route, ...middleware, async ctx => {
    try {
      await handler(ctx.query, ctx)
    } catch (error) {
      ctx.status = 500
      ctx.body = `Error: ${error.message}`
    }

    ctx.body = 'accepted'
    ctx.status = 202
  })
}
