const { readFileSync, writeFileSync, existsSync } = require("fs");
const { resolve } = require("path");

const configPath = resolve("../../../docconfig.json");
/** @type {string} */
let configData;

if (!existsSync(configPath)) {
    const data = readFileSync(resolve("./config/docconfig.template.json"));
    writeFileSync(configPath, data);
    configData = JSON.parse(data.toString());
} else {
    configData = JSON.parse(readFileSync(configPath).toString());
}

//

let tsData = readFileSync(resolve("./config/tsconfig.template.json"));

if (tsData) {
    tsData = tsData.toString();

    tsData = fillData(tsData, "root", "src");
    tsData = fillData(tsData, "types", "types");

    writeFileSync(resolve("./config/tsconfig.json"), tsData);
}

//

let tsDocData = readFileSync(resolve("./config/tsconfig.template.doc.json"));

if (tsDocData) {
    tsDocData = tsDocData.toString();

    tsDocData = fillData(tsDocData, "types", "types");

    writeFileSync(resolve("./config/tsconfig.doc.json"), tsDocData);
}

//

let typedocData = readFileSync(resolve("./config/typedoc.template.json"));

if (typedocData) {
    typedocData = typedocData.toString();

    typedocData = fillData(typedocData, "root", "src");
    typedocData = fillData(typedocData, "types", "types");
    typedocData = fillData(typedocData, "out", "docs");
    typedocData = fillData(typedocData, "npm");
    typedocData = fillData(typedocData, "github");

    writeFileSync(resolve("./config/typedoc.json"), typedocData);
}

/**
 * @param {string} data
 * @param {string} arg
 * @param {string} defaultValue
 * @returns {string}
 */
function fillData(data, arg, defaultValue) {
    /** @type {string} */
    let value = configData[arg];
    if (!value) {
        value = defaultValue;
    }

    const regex = new RegExp("{{" + arg + "}}", "g");
    return data.replace(regex, value);
}
