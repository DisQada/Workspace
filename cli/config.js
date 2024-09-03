/** @import {CleanOptions, ConfigData, ConfigKey, PackageData, TypedocData} from './types.js' */
import { existsSync } from 'fs'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_DIR = '../template'
const CONFIG_DIR = '../config'

/**
 * @param {CleanOptions} options The configuration files path and encoding
 */
export default async function run({ path: cPath, encoding = 'utf8' }) {
  const rPath = relative(process.cwd(), __dirname)
  const options = { path: rPath, encoding }
  const config = await getConfigData(cPath, options)
  /** @type {ConfigData} */
  const defaultConfig = JSON.parse(await readTemplateFile('workspace', options))

  await Promise.all([
    fillTsData('tsconfig', config, defaultConfig, options),
    fillTsData('tsconfig.doc', config, defaultConfig, options),
    fillTypedocData(config, defaultConfig, options)
  ])
}

/**
 * @param {string} path The configuration file path
 * @param {CleanOptions} options
 * @returns {Promise<ConfigData>}
 */
async function getConfigData(path, options) {
  /** @type {string} */
  let data

  if (existsSync(path)) data = await readFile(path, options.encoding)
  else {
    data = await readTemplateFile('workspace', options)
    await writeFile(path, data, options.encoding)
  }

  return JSON.parse(data)
}

/**
 * @param {string} fileName
 * @param {ConfigData} config
 * @param {ConfigData} defaultConfig
 * @param {CleanOptions} options
 * @returns {Promise<void>}
 */
async function fillTsData(fileName, config, defaultConfig, options) {
  let data = await readTemplateFile(fileName, options)
  if (!data) return

  data = fillData(data, config, defaultConfig, ['root', 'types'])
  await writeConfigFile(fileName, data, options)
}

/**
 * @param {ConfigData} config
 * @param {ConfigData} defaultConfig
 * @param {CleanOptions} options
 * @returns {Promise<void>}
 */
async function fillTypedocData(config, defaultConfig, options) {
  let data = await readTemplateFile('typedoc', options)
  if (!data) return

  data = fillData(data, config, defaultConfig, ['root', 'types', 'out', 'lang', 'title'])

  //

  const pPath = resolve(process.cwd(), 'package.json')
  /** @type {PackageData} */
  const pData = JSON.parse(await readFile(pPath, options.encoding))

  const arg1 = 'name'
  const regex1 = new RegExp('{{' + arg1 + '}}', 'g')

  const arg2 = 'displayName'
  const regex2 = new RegExp('{{' + arg2 + '}}', 'g')

  data = data.replace(regex1, pData[arg1]).replace(regex2, pData[arg2] || pData[arg1])

  //

  /** @type {TypedocData} */
  const tdData = JSON.parse(data)
  let navLinks = tdData.navigationLinks

  const repo = pData.repository
  if (typeof repo === 'object' && repo.url) navLinks['Source Code'] = repo.url

  const links = config.links
  if (links) navLinks = Object.assign(navLinks, links)

  //

  tdData.navigationLinks = navLinks
  await writeConfigFile('typedoc', JSON.stringify(tdData), options)
}

/**
 * @param {string} data
 * @param {ConfigData} config
 * @param {ConfigData} defaultConfig
 * @param {ConfigKey[]} keys
 * @returns {string}
 */
function fillData(data, config, defaultConfig, keys) {
  for (const key of keys) {
    /** @type {string} */
    const value = config[key] || defaultConfig[key]
    const regex = new RegExp('{{' + key + '}}', 'g')
    data = data.replace(regex, value)
  }

  return data
}

/**
 * Read config template file
 * @param {string} fileName
 * @param {CleanOptions} options
 * @returns {Promise<string>} config template file data
 */
async function readTemplateFile(fileName, { path, encoding }) {
  const p = resolve(path, `${TEMPLATE_DIR}/${fileName}.json`)
  return await readFile(p, encoding)
}

/**
 * Write config data to a file
 * @param {string} fileName
 * @param {string} data
 * @param {CleanOptions} options
 * @returns {Promise<void>}
 */
async function writeConfigFile(fileName, data, { path, encoding }) {
  const dPath = resolve(path, CONFIG_DIR)
  const fPath = resolve(dPath, `${fileName}.json`)

  if (!existsSync(dPath)) await mkdir(dPath)
  await writeFile(fPath, data, encoding)
}
