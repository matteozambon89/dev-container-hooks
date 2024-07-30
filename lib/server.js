const koa = require('koa')

const { init: newRouter } = require('./router.js')

exports.init = ({ port = 3000 } = {}) => {
  const app = new koa()

  console.log('Setup router...')
  const router = newRouter(app)
  app.use(router.routes())
  console.log('')

  console.log('Starting server...')
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    console.log('')
  })
}

if (require.main === module) {
  exports.init({
    port: parseInt(process.env.DCH_SERVER_PORT || '3000')
  })
}
