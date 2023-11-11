const { cleanFile } = require("../src/func/clean");

const file = `import { something } from "file";

export type Type1 = import("file").string | import("file").number;

export type Type2 = {
    /**
     * pretend to be a useful comment
     */
    some?: import("../types/file").SomeType;
};

export type Type3 = {
    other: import("../types/file").OtherType;
};

export type Func1 = (obj: object) =>
    | Promise<import("file").string | void>
    | string
    | void;

export type string = typeof import("./file");`;

const cleanedFile = `import type { string, number } from "file";
import type { SomeType, OtherType } from "../types/file";

import { something } from "file";

export type Type1 = string | number;

export type Type2 = {
    /**
     * pretend to be a useful comment
     */
    some?: SomeType;
};

export type Type3 = {
    other: OtherType;
};

export type Func1 = (obj: object) =>
    | Promise<string | void>
    | string
    | void;

export type string = typeof import("./file");`;

describe("Cleaning one file", () => {
    it("should clean it properly", () => {
        const newFile = cleanFile(file);
        expect(newFile).toEqual(cleanedFile);
    });

    it("should return it as is", () => {
        const newFile = cleanFile("function foo() { return 0 }");
        expect(newFile).toEqual("function foo() { return 0 }");
    });
});
