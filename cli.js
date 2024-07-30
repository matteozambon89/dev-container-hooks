#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const { init: newServer } = require('./lib/server.js')

require('dotenv').config()

const { port } = yargs(hideBin(process.argv)).env('DCH_SERVER').option('port', {
  alias: 'p',
  type: 'number',
  description: 'Server port',
  default: 3000
}).argv

newServer({ port })
