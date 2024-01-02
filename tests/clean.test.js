const { cleanFile } = require('../src/func/clean')

const fileData = `import { something } from "example/path";

export declare type Type1 = import("example/path").string | import("example/path").number;

export type Type2 = {
    /**
     * pretend to be a useful comment
     */
    some?: import("../types/example/path").SomeType;
};

export enum Type3 = {
    other: import("../types/example/path").OtherType;
};

export function (...args: number[][]) :
    | Promise<import("example/path").string | void>
    | string
    | void { }

export type string = typeof import("./example/path");

export type exports = number

export = something;
`

const cleanedFile = `import type { string, number } from "example/path";
import type { SomeType, OtherType } from "../types/example/path";

import { something } from "example/path";

export declare type Type1 = string | number;

export declare type Type2 = {
    /**
     * pretend to be a useful comment
     */
    some?: SomeType;
};

export declare enum Type3 = {
    other: OtherType;
};

export declare function (...args: number[]) :
    | Promise<string | void>
    | string
    | void { }

export declare type string = typeof import("./example/path");

export declare type exports = number

export default something;

export * from "./options";`

describe('Cleaning one file', () => {
  it('should clean it properly', () => {
    const newFile = cleanFile(fileData, 'exports.d.ts')
    expect(newFile).toEqual(cleanedFile)
  })

  it('should return it as is', () => {
    const newFile = cleanFile('function foo() { return 0 }')
    expect(newFile).toEqual('function foo() { return 0 }')
  })
})
