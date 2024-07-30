const { spawn } = require('child_process')

const { handler: logging } = require('../middleware/logging.js')

exports.type = 'hook'
exports.route = '/git-gui'
exports.middleware = [logging]
exports.handler = ({ app, workspace, args = '' }) => {
  const argsArr = args.split(',')

  spawn(app, [...argsArr, workspace])
}
