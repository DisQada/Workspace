import { writeImports } from '../src/func/write.js'

describe('Converting types map to import', () => {
  it('should return valid string', () => {
    const result = writeImports(new Map([['./file', ['string']]]))
    expect(result).toEqual('import type { string } from "./file";\n')
  })

  // FIX
  it('should return invalid string with duplicates', () => {
    const result = writeImports(new Map([['./file', ['string', 'string']]]))
    expect(result).toEqual('import type { string, string } from "./file";\n')
  })

  it('should return valid string with multiple values', () => {
    const result = writeImports(new Map([['./file', ['string', 'number']]]))
    expect(result).toEqual('import type { string, number } from "./file";\n')
  })

  it('should return valid string with multiple imports', () => {
    const result = writeImports(
      new Map([
        ['./file1', ['string']],
        ['./file2', ['number']]
      ])
    )
    expect(result).toEqual(
      'import type { string } from "./file1";\nimport type { number } from "./file2";\n'
    )
  })
})

describe('Negative cases', () => {
  it('should return nothing', () => {
    const result = writeImports(new Map())
    expect(result).toBeUndefined()
  })
})
