#!/usr/bin/env node

import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'

const encoding = 'utf8'

const configPath = resolve('../../../docconfig.json')
/** @type {string} */
let configData

if (!existsSync(configPath)) {
  const data = await readTemplateFile('docconfig')
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

  const packagePath = resolve('../../../package.json')
  /** @type {object} */
  const packageData = JSON.parse(await readFile(packagePath, encoding))

  const arg1 = 'name'
  const regex1 = new RegExp('{{' + arg1 + '}}', 'g')
  typedocData = typedocData.replace(regex1, packageData[arg1])

  const arg2 = 'displayName'
  const regex2 = new RegExp('{{' + arg2 + '}}', 'g')
  typedocData = typedocData.replace(
    regex2,
    packageData[arg2] ?? packageData[arg1]
  )

  /** @type {object} */
  typedocData = JSON.parse(typedocData)
  const navLinks = typedocData['navigationLinks']

  const repo = packageData['repository']
  if (repo && typeof repo === 'object' && repo.url) {
    navLinks['Source Code'] = repo.url
  }

  const links = packageData['links']
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
  if (!value) {
    value = defaultValue
  }

  const regex = new RegExp('{{' + arg + '}}', 'g')
  return data.replace(regex, value)
}

/**
 * Read config template file and convert it to string
 * @param {string} fileName
 * @returns {Promise<string>}
 */
async function readTemplateFile(fileName) {
  return await readFile(resolve(`./template/${fileName}.json`), encoding)
}

/**
 * Write config data to a file
 * @param {string} fileName
 * @param {string} data
 * @returns {Promise<void>}
 */
async function writeConfigFile(fileName, data) {
  const path = `./config/${fileName}.json`

  try {
    await writeFile(resolve(path), data, encoding)
  } catch (err) {
    if (err.code === 'ENOENT') {
      mkdirSync('./config')
      await writeFile(resolve(path), data, encoding)
    } else {
      throw err
    }
  }
}
