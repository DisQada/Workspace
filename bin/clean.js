#!/usr/bin/env node

import { readFile, stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { cleanFolder } from '../src/func/clean.js'

const encoding = 'utf8'
let folderName

const configPath = resolve('../../../docconfig.json')
const configData = await readFile(configPath, encoding)
if (configData) {
  const data = JSON.parse(configData)
  folderName = data.types
} else {
  folderName = 'types'
}

const path = resolve(`../../../${folderName}`)
const stats = await stat(path)

if (stats && stats.isDirectory()) {
  const fileMap = await cleanFolder(path)
  for (const file of fileMap) {
    const path = file[0]
    const data = file[1]
    await writeFile(path, data, encoding)
  }
}
