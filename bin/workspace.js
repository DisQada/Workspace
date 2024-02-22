#!/usr/bin/env node

/**
 * @file Main CLI that is run via the `disqada` command
 */

'use strict'

const { execSync } = require('child_process')
const { program } = require('commander')
const { resolve } = require('path')

program
  .name('@disqada/workspace')
  .description('CLI to @disqada/workspace commands')
  .version('0.1.0')

program
  .argument('[path]', 'configuration file path', './workspace.json')
  .option('--no-config', 'skip re-reading configuration file')
  .option('-t, --types', 'generate typescript types')
  .option('-d, --docs', 'generate documentation')

program.parse()

const opts = program.opts()

/** @type {object & import('child_process').ExecSyncOptionsWithStringEncoding} */
const options = {
  stdio: 'inherit',
  encoding: 'utf8',
  configPath: resolve(process.cwd(), program.args[0])
}

const basePath = './node_modules/@disqada/workspace/config'

/**
 *
 */
async function run() {
  if (opts.config) {
    await require('../cli/config.js')(options)
  }

  if (opts.types) {
    execSync(`tsc -p ${basePath}/tsconfig.json`, options)
    await require('../cli/clean.js')(options)
  }

  if (opts.docs) {
    execSync(`typedoc --options ${basePath}/typedoc.json`, options)
  }
}

run().catch(console.error)
