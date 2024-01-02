const { readFolder, readImport } = require('./read')
const { writeImports } = require('./write')
const { readFile } = require('fs/promises')

/**
 * @param {string} path
 * @returns {Promise<Map<string, string>>} Map<fileAbsolutePath, fileData>
 * @async
 */
async function cleanFolder(path) {
  const fullPaths = await readFolder(path)
  const files = await Promise.all(fullPaths.map((x) => readFile(x)))

  const newFiles = new Map()

  for (let i = 0; i < fullPaths.length; i++) {
    let file = files[i].toString()
    file = cleanFile(file, fullPaths[i])
    newFiles.set(fullPaths[i], file)
  }

  return newFiles
}

/**
 * @param {string} file
 * @param {string} [path]
 * @returns {string}
 */
function cleanFile(file, path) {
  if (file.includes('import(')) {
    file = cleanImports(file)
  }

  file = file.replace(/\.\.\.(\w+): (\w+)\[\]/g, '...$1: $2')
  file = file.replace(/export(?!s)(?!\s+(declare|=))/g, 'export declare')
  file = file.replace(/export(?!s)(\s+=)/g, 'export default')

  if (path?.endsWith('exports.d.ts')) {
    file += '\nexport * from "./options";'
  }

  return file
}

/**
 * @param {string} file
 * @returns {string}
 */
function cleanImports(file) {
  const imports = new Map()

  let path
  let type

  let count = 0
  const threshold = 10000

  while (count < threshold) {
    const result = readImport(file)

    path = result[1]
    type = result[2]
    if (path === null && type === null) {
      break
    }

    file = result[0]
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
    return writeImports(imports) + '\n' + file
  } else {
    return file
  }
}

module.exports = {
  cleanImports,
  cleanFile,
  cleanFolder
}
