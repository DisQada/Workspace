#!/usr/bin/env node

const { readFile, stat, writeFile } = require('fs/promises')
const { resolve } = require('path')
const { cleanFolder } = require('../src/func/clean.js')

const encoding = 'utf8'
let folderName

async function run() {
  const configPath = resolve('../../../workspace.json')
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
}

run().catch(console.error)
