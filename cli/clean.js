const { readFile, stat, writeFile } = require('fs/promises')
const { resolve } = require('path')
const { cleanFolder } = require('./func/clean.js')

/**
 * @param {object} options
 * @param {NodeJS.BufferEncoding} options.encoding
 * @param {string} options.configPath
 * @async
 */
async function run({ encoding = 'utf8', configPath }) {
  let folderName

  const configData = await readFile(configPath, encoding)
  if (configData) {
    const data = JSON.parse(configData)
    folderName = data.types
  } else {
    folderName = 'types'
  }

  const typesPath = resolve(process.cwd(), folderName)
  const stats = await stat(typesPath)

  if (stats && stats.isDirectory()) {
    const fileMap = await cleanFolder(typesPath)
    for (const file of fileMap) {
      const path = file[0]
      const data = file[1]
      await writeFile(path, data, encoding)
    }
  }
}

module.exports = run
