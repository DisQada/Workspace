import { readFile } from 'fs/promises'
import { readFolder, readImport } from './read.js'
import { writeImports } from './write.js'

/**
 * @param {string} path
 * @returns {Promise<Map<string, string>>} Map<fileAbsolutePath, fileData>
 */
export async function cleanFolder(path) {
  const filePaths = await readFolder(path)
  const filesData = await Promise.all(filePaths.map((x) => readFile(x, 'utf8')))

  const newFiles = new Map()

  for (let i = 0; i < filePaths.length; i++) {
    newFiles.set(filePaths[i], cleanFile(filesData[i]))
  }

  return newFiles
}

/**
 * @param {string} data
 * @returns {string}
 */
export function cleanFile(data) {
  if (data.includes('import(')) data = cleanImports(data)

  data = data
    .replace(/\.\.\.([_a-zA-Z0-9]+): (([_a-zA-Z0-9]+)(\[[_a-zA-Z0-9]*\])?)\[\]/g, '...$1: $2')
    .replace(/\n?(export type (\w+) = \2;|\/\*\* @typedef {(\w+)} \3 \*\/)/g, '')
    .replace(/export(?!s)(?!\s+(\*|declare|=|{))/g, 'export declare')
    .replace(/export(?!s)(\s+=)/g, 'export default')

  return data
}

/**
 * @param {string} data
 * @returns {string}
 */
export function cleanImports(data) {
  const imports = new Map()

  let path
  let type

  let count = 0
  const threshold = 10000

  while (count < threshold) {
    const result = readImport(data)

    path = result[1]
    type = result[2]
    if (path === null && type === null) break

    data = result[0]
    const arr = imports.get(path) || []
    if (!arr.includes(type)) {
      arr.push(type)
      imports.set(path, arr)
    }

    count++
  }

  if (count === threshold) console.warn(`Reached threshold of ${threshold} loops`)

  if (imports.size > 0) return writeImports(imports) + '\n' + data
  else return data
}
