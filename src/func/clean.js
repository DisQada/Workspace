const { readFolder, readImport } = require('./read')
const { writeImports } = require('./write')
const { readFile } = require('fs/promises')

/**
 * @param {string} path
 * @returns {Promise<Map<string, string>>} Map<fileAbsolutePath, fileData>
 * @async
 */
async function cleanFolder(path) {
  const filePaths = await readFolder(path)
  const filesData = await Promise.all(filePaths.map((x) => readFile(x, 'utf8')))

  const newFiles = new Map()

  for (let i = 0; i < filePaths.length; i++) {
    newFiles.set(filePaths[i], cleanFile(filesData[i], filePaths[i]))
  }

  return newFiles
}

/**
 * @param {string} data
 * @param {string} [path]
 * @returns {string}
 */
function cleanFile(data, path) {
  if (data.includes('import(')) {
    data = cleanImports(data)
  }

  data = data.replace(/\.\.\.(\w+): (\w+)\[\]/g, '...$1: $2')
  data = data.replace(/export(?!s)(?!\s+(declare|=))/g, 'export declare')
  data = data.replace(/export(?!s)(\s+=)/g, 'export default')

  if (path?.endsWith('exports.d.ts')) {
    data += '\nexport * from "./options";'
  }

  return data
}

/**
 * @param {string} data
 * @returns {string}
 */
function cleanImports(data) {
  const imports = new Map()

  let path
  let type

  let count = 0
  const threshold = 10000

  while (count < threshold) {
    const result = readImport(data)

    path = result[1]
    type = result[2]
    if (path === null && type === null) {
      break
    }

    data = result[0]
    const arr = imports.get(path) || []
    if (!arr.includes(type)) {
      arr.push(type)
      imports.set(path, arr)
    }

    count++
  }

  if (count === threshold) {
    console.warn(`Reached threshold of ${threshold} loops`)
  }

  if (imports.size > 0) {
    return writeImports(imports) + '\n' + data
  } else {
    return data
  }
}

module.exports = {
  cleanImports,
  cleanFile,
  cleanFolder
}
