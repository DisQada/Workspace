#!/usr/bin/env node

'use strict'

/** @import {ExecSyncOptionsWithStringEncoding} from 'child_process' */
/** @import {CleanOptions} from '../cli/types.js' */
import { execSync } from 'child_process'
import { program } from 'commander'
import { resolve } from 'path'

program
  .name('@disqada/workspace')
  .description('CLI to use @disqada/workspace commands')
  .version('0.1.0')

  .argument('[path]', 'configuration file path', './workspace.json')
  .option('-c, --config', 'read and cache configuration file')
  .option('-t, --types', 'generate typescript types')
  .option('-d, --docs', 'generate documentation files')

  .parse()

const opts = program.opts()

/** @type {CleanOptions & ExecSyncOptionsWithStringEncoding} */
const options = {
  stdio: 'inherit',
  encoding: 'utf8',
  path: resolve(process.cwd(), program.args[0])
}

const basePath = './node_modules/@disqada/workspace/config'
run().catch(console.error)

async function run() {
  if (opts.config) await runConfig()
  if (opts.types) await runTypes()
  if (opts.docs) await runDocs()
}

async function runConfig() {
  await runCliModule('config')
}

async function runTypes() {
  execSync(`tsc -p ${basePath}/tsconfig.json`, options)
  await runCliModule('clean')
}

async function runDocs() {
  execSync(`typedoc --options ${basePath}/typedoc.json`, options)
}

/**
 * @param {string} fileName
 */
async function runCliModule(fileName) {
  const func = (await import(`../cli/${fileName}.js`)).default
  await func(options)
}
