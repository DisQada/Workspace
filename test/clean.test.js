import { equal } from 'assert/strict'
import { cleanFile } from '../cli/func/clean.js'

describe('clean', function () {
  describe('cleanFile()', function () {
    it('should convert export to default export', function () {
      const a = cleanFile('export = example;')
      equal(a, 'export default example;')
    })

    it('should keep export as is', function () {
      let a = cleanFile('export * as Types from "./file/path.js";')
      equal(a, 'export * as Types from "./file/path.js";')

      a = cleanFile('export { example };')
      equal(a, 'export { example };')

      a = cleanFile('import type { example } from "./file/path.js";')
      equal(a, 'import type { example } from "./file/path.js";')
    })

    it('should convert export type to declare export type', function () {
      let a = cleanFile('export type exports = example;')
      equal(a, 'export declare type exports = example;')

      a = cleanFile('export type example = typeof import("./file/path.js");')
      equal(a, 'export declare type example = typeof import("./file/path.js");')
    })

    it('should convert export function to declare export function', function () {
      const a =
        cleanFile(`export function (...args: example[][], ...args2: example[example][], ...args3: example[][][]) :
    | Promise<import("file/path.js").example | void>
    | example
    | void { }`)
      equal(
        a,
        `import type { example } from "file/path.js";

export declare function (...args: example[], ...args2: example[example], ...args3: example[][]) :
    | Promise<example | void>
    | example
    | void { }`
      )
    })

    it('should convert export enum to declare export enum', function () {
      const a = cleanFile(`export enum Example = {
  other: import("../file/path.js").OtherExample;
};`)
      equal(
        a,
        `import type { OtherExample } from "../file/path.js";

export declare enum Example = {
  other: OtherExample;
};`
      )
    })

    it('should convert export type to declare export type with comment', function () {
      const a = cleanFile(
        `export type Example = {
  /**
   * pretend to be a useful comment
   */
  some?: import("../file/path.js").SomeExample;
};`
      )
      equal(
        a,
        `import type { SomeExample } from "../file/path.js";

export declare type Example = {
  /**
   * pretend to be a useful comment
   */
  some?: SomeExample;
};`
      )
    })

    it('should convert export type to declare export type with import', function () {
      const a = cleanFile(
        'export declare type Example = import("./file/path").example1 | import("./file/path").example2;'
      )
      equal(
        a,
        `import type { example1, example2 } from "./file/path";

export declare type Example = example1 | example2;`
      )
    })

    it('should keep import as is', function () {
      const a = cleanFile('import { example } from "./file/path";')
      equal(a, 'import { example } from "./file/path";')
    })

    it('should convert import to import type', function () {
      const a = cleanFile(`const e1 = import("./file/path.js").Example1;
const e2 = import("./file/path.js").Example2;`)
      equal(
        a,
        `import type { Example1, Example2 } from "./file/path.js";

const e1 = Example1;
const e2 = Example2;`
      )
    })

    it('should remove typedef', function () {
      const a = cleanFile('/** @typedef {Example} Example */')
      equal(a, '')
    })

    it('should remove export type', function () {
      const a = cleanFile('export type Example = Example;')
      equal(a, '')
    })

    it('should return it as is', function () {
      const newFile = cleanFile('function foo() { return 0 }')
      equal(newFile, 'function foo() { return 0 }')
    })
  })
})
