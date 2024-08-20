import { readFile, stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { cleanFolder } from './func/clean.js'

/**
 * @param {object} options
 * @param {NodeJS.BufferEncoding} options.encoding
 * @param {string} options.configPath
 * @async
 */
export default async function run({ encoding = 'utf8', configPath }) {
  let folderName

  const configData = await readFile(configPath, encoding)
  if (configData) {
    const data = JSON.parse(configData)
    folderName = data.types
  } else folderName = 'types'

  const typesPath = resolve(process.cwd(), folderName)
  const stats = await stat(typesPath)

  if (stats && stats.isDirectory()) {
    const fileMap = await cleanFolder(typesPath)
    for (const file of fileMap) {
      const [path, data] = file
      await writeFile(path, data, encoding)
    }
  }
}
