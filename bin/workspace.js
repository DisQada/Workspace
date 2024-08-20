#!/usr/bin/env node

'use strict'

/** @import {ExecSyncOptionsWithStringEncoding} from 'child_process' */
import { execSync } from 'child_process'
import { program } from 'commander'
import { resolve } from 'path'

program.name('@disqada/workspace').description('CLI to @disqada/workspace commands').version('0.1.0')

program
  .argument('[path]', 'configuration file path', './workspace.json')
  .option('--no-config', 'skip re-reading configuration file')
  .option('-t, --types', 'generate typescript types')
  .option('-d, --docs', 'generate documentation')

program.parse()

const opts = program.opts()

/** @type {object & ExecSyncOptionsWithStringEncoding} */
const options = {
  stdio: 'inherit',
  encoding: 'utf8',
  configPath: resolve(process.cwd(), program.args[0])
}

const basePath = './node_modules/@disqada/workspace/config'

async function run() {
  if (opts.config) {
    const configFunc = (await import('../cli/config.js')).default
    await configFunc(options)
  }

  if (opts.types) {
    execSync(`tsc -p ${basePath}/tsconfig.json`, options)
    const cleanFunc = (await import('../cli/clean.js')).default
    await cleanFunc(options)
  }

  if (opts.docs) execSync(`typedoc --options ${basePath}/typedoc.json`, options)
}

run().catch(console.error)
