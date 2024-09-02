/** @import {CleanOptions} from './types.js' */
import { readFile, stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { cleanFolder } from './func/clean.js'

/**
 * @param {CleanOptions} options The configuration files path and encoding
 */
export default async function run({ path: cPath, encoding = 'utf8' }) {
  const fn = await getFolderName({ path: cPath, encoding })
  const tPath = resolve(process.cwd(), fn)
  const stats = await stat(tPath)

  if (stats && stats.isDirectory()) await clearing({ path: tPath, encoding })
  else console.error('No types folder found')
}

/**
 * @param {CleanOptions} options
 * @returns {Promise<void>}
 */
async function clearing({ path, encoding }) {
  const fileMap = await cleanFolder(path)
  const promises = []

  for (const [p, data] of fileMap) promises.push(writeFile(p, data, encoding))
  await Promise.all(promises)
}

/**
 * @param {CleanOptions} options
 * @returns {Promise<string>}
 */
async function getFolderName({ path, encoding }) {
  const configData = await readFile(path, encoding)
  if (configData) return JSON.parse(configData).types
  else return 'types'
}
