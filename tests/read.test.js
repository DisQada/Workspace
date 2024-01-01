const { readFolder, readImport } = require('../src/func/read')
const { sep, isAbsolute } = require('path')

describe('Reading folder paths', () => {
  it('should return expected paths', async () => {
    const paths = await readFolder('src')
    expect(paths).toEqual(
      ['func/clean.js', 'func/read.js', 'func/write.js'].map((subPath) =>
        (process.cwd() + '/src/' + subPath).replace(/\//g, sep)
      )
    )
  })

  it('should return absolute paths', async () => {
    const paths = await readFolder('src')
    expect(paths.every((x) => isAbsolute(x))).toBeTruthy()
  })
})

describe('Reading file contents', () => {
  it('should return valid path and type', () => {
    const content = readImport('@param {import("./file").string} str')
    expect(content).toEqual(['@param {string} str', './file', 'string'])

    const content2 = readImport("@param {import('./file').string} str")
    expect(content2).toEqual(['@param {string} str', './file', 'string'])

    const content3 = readImport('@param {import(`./file`).string} str')
    expect(content3).toEqual(['@param {string} str', './file', 'string'])
  })

  it('should return valid path and type with space', () => {
    const content = readImport('@param {import("./file").string } str')
    expect(content).toEqual(['@param {string } str', './file', 'string'])
  })

  it('should return valid path and type with ()', () => {
    const content = readImport('@param {(import("./file").string)} str')
    expect(content).toEqual(['@param {(string)} str', './file', 'string'])
  })

  it('should return valid path and type with []', () => {
    const content = readImport('@param {import("./file").string[]} str')
    expect(content).toEqual(['@param {string[]} str', './file', 'string'])
  })

  it('should return valid path and type with [any]', () => {
    const content = readImport('@param {import("./file").string[any]} str')
    expect(content).toEqual(['@param {string[any]} str', './file', 'string'])
  })

  it('should return valid path and type with tuple', () => {
    let content = readImport(
      '@param {[import("./file").string, import("./file").number]} str'
    )

    expect(content).toEqual([
      '@param {[string, import("./file").number]} str',
      './file',
      'string'
    ])

    content = readImport(content[0])
    expect(content).toEqual([
      '@param {[string, number]} str',
      './file',
      'number'
    ])
  })

  it('should return valid path and type with <any>', () => {
    const content = readImport('@param {import("./file").string<any>} str')
    expect(content).toEqual(['@param {string<any>} str', './file', 'string'])
  })

  it('should return valid path and type with Promise', () => {
    const content = readImport('@param {Promise<import("./file").string>} str')
    expect(content).toEqual([
      '@param {Promise<string>} str',
      './file',
      'string'
    ])
  })

  it('should return valid path and type with Map', () => {
    let content = readImport(
      '@param {Map<import("./file").string, import("./file").number>} str'
    )

    expect(content).toEqual([
      '@param {Map<string, import("./file").number>} str',
      './file',
      'string'
    ])

    content = readImport(content[0])
    expect(content).toEqual([
      '@param {Map<string, number>} str',
      './file',
      'number'
    ])
  })

  it('should return valid path and type with same path multiple imports', () => {
    let content = readImport(
      '@param {import("./file").string|import("./file").number} str'
    )

    expect(content).toEqual([
      '@param {string|import("./file").number} str',
      './file',
      'string'
    ])

    content = readImport(content[0])
    expect(content).toEqual(['@param {string|number} str', './file', 'number'])
  })

  it('should return valid path and type with different path multiple imports', () => {
    let content = readImport(
      '@param {import("./file1").string|import("./file2").number} str'
    )
    expect(content).toEqual([
      '@param {string|import("./file2").number} str',
      './file1',
      'string'
    ])

    content = readImport(content[0])
    expect(content).toEqual(['@param {string|number} str', './file2', 'number'])
  })

  it('should return valid path and type with full imports', () => {
    const content = readImport('export type string = typeof import("./file");')
    expect(content).toEqual([
      'export type string = typeof import("./file");',
      null,
      null
    ])
  })
})

describe('Negative cases', () => {
  it('should return absolute paths', () => {
    const content = readImport('str')
    expect(content).toEqual(['str', null, null])
  })
})
