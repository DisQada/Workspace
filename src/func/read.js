const { readdir, stat } = require('fs/promises')
const { resolve } = require('path')

/**
 * Read all the files in the folder and it's subfolders as full paths.
 * @param {string} folderPath An absolute path to the folder to read
 * @returns {Promise<string[]>} full file paths
 * @async
 */
async function readFolder(folderPath) {
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
 * @returns {[string, string | null, string | null]} [file, path, type]
 */
function readImport(str) {
  let file = ''

  const bWord = 'typeof import("'
  const sWord = 'import("'
  const eWord = '").'

  const before = str.indexOf(bWord)
  let start = str.indexOf(sWord)

  if (start === -1) {
    return [str, null, null]
  }

  if (before !== -1 && before < start) {
    const breakIndex = str.indexOf('")') + 2
    file += str.substring(0, breakIndex)
    str = str.substring(breakIndex)

    start = str.indexOf(sWord)
    if (start === -1) {
      return [file + str, null, null]
    }
  }

  file += str.substring(0, start)
  str = str.substring(start + sWord.length)

  const end = str.indexOf(eWord)
  const path = str.substring(0, end)

  str = str.substring(end + eWord.length)
  file += str
  const type = str.substring(0, getEndIndex(str))

  return [file, path, type]
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

module.exports = {
  readFolder,
  readImport
}
