import { equal } from 'assert/strict'
import { writeImports } from '../cli/func/write.js'

describe('Converting types map to import', function () {
  it('should return valid string', function () {
    const result = writeImports(new Map([['./file', ['string']]]))
    equal(result, 'import type { string } from "./file";\n')
  })

  // FIX
  it('should return invalid string with duplicates', function () {
    const result = writeImports(new Map([['./file', ['string', 'string']]]))
    equal(result, 'import type { string, string } from "./file";\n')
  })

  it('should return valid string with multiple values', function () {
    const result = writeImports(new Map([['./file', ['string', 'number']]]))
    equal(result, 'import type { string, number } from "./file";\n')
  })

  it('should return valid string with multiple imports', function () {
    const result = writeImports(
      new Map([
        ['./file1', ['string']],
        ['./file2', ['number']]
      ])
    )
    equal(result, 'import type { string } from "./file1";\nimport type { number } from "./file2";\n')
  })
})

describe('Negative cases', function () {
  it('should return nothing', function () {
    const result = writeImports(new Map())
    equal(result, undefined)
  })
})
