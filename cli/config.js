/** @import {CleanOptions, ConfigData, PackageData, TypedocData} from './types.js' */
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile, stat } from 'fs/promises'
import { dirname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @param {object} options
 * @param {NodeJS.BufferEncoding} options.encoding
 * @param {string} options.configPath
 * @async
 */
export default async function run({ encoding = 'utf8', configPath }) {
  const relativePath = relative(process.cwd(), __dirname)

  /** @type {string} */
  let configData

  if (!existsSync(configPath)) {
    const data = await readTemplateFile('workspace')
    await writeFile(configPath, data, encoding)
    configData = JSON.parse(data.toString())
  } else {
    const data = await readFile(configPath, encoding)
    configData = JSON.parse(data)
  }

  //

  let tsData = await readTemplateFile('tsconfig')
  if (tsData) {
    tsData = fillData(tsData, 'root', 'src')
    tsData = fillData(tsData, 'types', 'types')

    await writeConfigFile('tsconfig', tsData)
  }

  //

  let tsDocData = await readTemplateFile('tsconfig.doc')
  if (tsDocData) {
    tsDocData = fillData(tsDocData, 'types', 'types')

    await writeConfigFile('tsconfig.doc', tsDocData)
  }

  //

  let typedocData = await readTemplateFile('typedoc')
  if (typedocData) {
    typedocData = fillData(typedocData, 'root', 'src')
    typedocData = fillData(typedocData, 'types', 'types')
    typedocData = fillData(typedocData, 'out', 'docs')

    //

    const packagePath = resolve(process.cwd(), 'package.json')
    /** @type {object} */
    const packageData = JSON.parse(await readFile(packagePath, encoding))

    const arg1 = 'name'
    const regex1 = new RegExp('{{' + arg1 + '}}', 'g')
    typedocData = typedocData.replace(regex1, packageData[arg1])

    const arg2 = 'displayName'
    const regex2 = new RegExp('{{' + arg2 + '}}', 'g')
    typedocData = typedocData.replace(regex2, packageData[arg2] ?? packageData[arg1])

    /** @type {object} */
    typedocData = JSON.parse(typedocData)
    const navLinks = typedocData['navigationLinks']

    const repo = packageData['repository']
    if (repo && typeof repo === 'object' && repo.url) {
      navLinks['Source Code'] = repo.url
    }

    const links = configData['links']
    if (links) {
      typedocData['navigationLinks'] = Object.assign(navLinks, links)
    }

    /** @type {string} */
    typedocData = JSON.stringify(typedocData)

    //

    await writeConfigFile('typedoc', typedocData)
  }

  /**
   * @param {string} data
   * @param {string} arg
   * @param {string} defaultValue
   * @returns {string}
   */
  function fillData(data, arg, defaultValue) {
    /** @type {string} */
    let value = configData[arg]
    if (!value) value = defaultValue

    const regex = new RegExp('{{' + arg + '}}', 'g')
    return data.replace(regex, value)
  }

  /**
   * Read config template file
   * @param {string} fileName
   * @returns {Promise<string>} config template file data
   */
  async function readTemplateFile(fileName) {
    const p = resolve(relativePath, `../template/${fileName}.json`)
    return await readFile(p, encoding)
  }

  /**
   * Write config data to a file
   * @param {string} fileName
   * @param {string} data
   * @returns {Promise<void>}
   */
  async function writeConfigFile(fileName, data) {
    const dPath = resolve(process.cwd(), '../config')
    const fPath = resolve(dPath, `${fileName}.json`)

    if (!(await stat(dPath)).isDirectory()) await mkdir(dPath)
    await writeFile(fPath, data, encoding)
  }
}
