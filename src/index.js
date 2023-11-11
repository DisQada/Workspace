const { writeFileSync, stat } = require("fs");
const { resolve } = require("path");
const { cleanFolder } = require("./func/clean");
const { readFileSync } = require("fs");

let folderName;

const configPath = resolve("../../../docconfig.json");
let configData = readFileSync(configPath);
if (configData) {
    configData = JSON.parse(configData.toString());
    folderName = configData.types;
} else {
    folderName = "types";
}

const path = resolve(`../../../${folderName}`);
stat(path, (err, stats) => {
    if (err) {
        console.error(err);
        return;
    }

    if (stats && stats.isDirectory()) {
        cleanFolder(path)
            .then((dataMap) => {
                for (const pair of dataMap) {
                    const filePath = pair[0];
                    const fileData = pair[1];
                    writeFileSync(filePath, fileData);
                }
            })
            .catch(console.error);
    }
});
