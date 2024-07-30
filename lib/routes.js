const fs = require('fs')
const path = require('path')

const routes = []

const findRoutes = dir => {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      findRoutes(fullPath)
    } else if (file.endsWith('route.js')) {
      routes.push(require(fullPath))
    }
  }
}

findRoutes(__dirname)

module.exports = routes
