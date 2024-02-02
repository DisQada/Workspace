import { readdir, stat } from 'fs/promises'
import { resolve } from 'path'

/**
 * Read all the files in the folder and it's subfolders as full paths.
 * @param {string} folderPath An absolute path to the folder to read
 * @returns {Promise<string[]>} full file paths
 * @async
 */
export async function readFolder(folderPath) {
  const cwd = process.cwd()
  const files = []

  const fileNames = await readdir(folderPath)
  for (let i = 0; i < fileNames.length; i++) {
    const name = fileNames[i]
    files.push(resolve(cwd, folderPath, name))
  }

  const stats = await Promise.all(files.map((x) => stat(x)))
  const paths = []

  for (let i = 0; i < files.length; i++) {
    const f = files[i]
    const s = stats[i]

    if (s.isFile()) {
      paths.push(f)
    } else {
      paths.push(...(await readFolder(f)))
    }
  }

  return paths
}

/**
 * @param {string} str
 * @returns {[string, string | null, string | null]} [data, path, type]
 */
export function readImport(str) {
  let data = ''

  const bWord = /typeof import\(("|'|`)/
  const sWord = /import\(("|'|`)/ // NOTE: change the length value below if you change this
  const eWord = /("|'|`)\)\./ // NOTE: change the length value below if you change this

  const before = str.search(bWord)
  let start = str.search(sWord)

  if (start === -1) {
    return [str, null, null]
  }

  if (before !== -1 && before < start) {
    const breakIndex = str.search(/("|'|`)\)/) + 2
    data += str.substring(0, breakIndex)
    str = str.substring(breakIndex)

    start = str.search(sWord)
    if (start === -1) {
      return [data + str, null, null]
    }
  }

  data += str.substring(0, start)
  str = str.substring(start + 8 /** sWord.length */)

  const end = str.search(eWord)
  const path = str.substring(0, end)

  str = str.substring(end + 3 /** eWord.length */)
  data += str
  const type = str.substring(0, getEndIndex(str))

  return [data, path, type]
}

/**
 * @param {string} str
 * @returns {number}
 * @throws {Error} if didn't get a valid index
 */
function getEndIndex(str) {
  const ends = [' ', '}', ')', '|', '[', ']', '<', '>', '\r', '\n', ',', ';']
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (ends.some((x) => x === char)) {
      return i
    }
  }

  throw new Error("Shouldn't be here")
}
