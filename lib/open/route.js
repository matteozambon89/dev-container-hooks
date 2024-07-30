const { spawn } = require('child_process')

const { handler: logging } = require('../middleware/logging.js')

exports.type = 'hook'
exports.route = '/open'
exports.middleware = [logging]
exports.handler = ({ path = '.', cwd }) => {
  spawn('open', [path], { cwd })
}
