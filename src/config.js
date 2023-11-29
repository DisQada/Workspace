const { readFileSync, writeFileSync, existsSync } = require("fs");
const { resolve } = require("path");

const configPath = resolve("../../../docconfig.json");
/** @type {string} */
let configData;

if (!existsSync(configPath)) {
    const data = readConfigTemplateFile("docconfig");
    writeFileSync(configPath, data);
    configData = JSON.parse(data.toString());
} else {
    configData = JSON.parse(readFileSync(configPath).toString());
}

//

let tsData = readConfigTemplateFile("tsconfig");
if (tsData) {
    tsData = fillData(tsData, "root", "src");
    tsData = fillData(tsData, "types", "types");

    writeConfigFile("tsconfig", tsData);
}

//

let tsDocData = readConfigTemplateFile("tsconfig.doc");
if (tsDocData) {
    tsDocData = fillData(tsDocData, "types", "types");

    writeConfigFile("tsconfig.doc", tsDocData);
}

//

let typedocData = readConfigTemplateFile("typedoc");
if (typedocData) {
    typedocData = fillData(typedocData, "root", "src");
    typedocData = fillData(typedocData, "types", "types");
    typedocData = fillData(typedocData, "out", "docs");
    typedocData = fillData(typedocData, "npm");
    typedocData = fillData(typedocData, "github");

    writeConfigFile("typedoc", typedocData);
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

/**
 * Read config template file and convert it to string
 * @param {string} fileName
 * @returns {string}
 */
function readConfigTemplateFile(fileName) {
    return readFileSync(
        resolve(`./config/${fileName}.template.json`)
    ).toString();
}
/**
 * Write config data to a file
 * @param {string} fileName
 * @param {string} data
 * @returns {void}
 */
function writeConfigFile(fileName, data) {
    writeFileSync(resolve(`./config/${fileName}.json`), data);
}
