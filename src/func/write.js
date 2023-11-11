/**
 * convert an import data as a Map into a string of type imports
 * @param {Map<string, string[]>} imports imports data as <path, type[]>
 * @returns {string} the type imports string
 */
function writeImports(imports) {
    if (!imports || imports.size === 0) {
        return;
    }

    let lines = "";
    for (const iterator of imports) {
        const path = iterator[0];
        const types = iterator[1];

        lines += `import type { ${types.join(", ")} } from "${path}";\n`;
    }

    return lines;
}

module.exports = {
    writeImports
};
