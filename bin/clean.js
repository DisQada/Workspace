#!/usr/bin/env node

const { writeFileSync, statSync } = require('fs')
const { resolve } = require('path')
const { cleanFolder } = require('../src/func/clean')
const { readFileSync } = require('fs')

const encoding = 'utf8'
let folderName

const configPath = resolve('../../../docconfig.json')
let configData = readFileSync(configPath, encoding)
if (configData) {
  configData = JSON.parse(configData)
  // @ts-ignore
  folderName = configData.types
} else {
  folderName = 'types'
}

const path = resolve(`../../../${folderName}`)
const stats = statSync(path)

if (stats && stats.isDirectory()) {
  cleanFolder(path)
    .then((dataMap) => {
      for (const pair of dataMap) {
        const filePath = pair[0]
        const fileData = pair[1]
        writeFileSync(filePath, fileData, encoding)
      }
      return
    })
    .catch(console.error)
}
