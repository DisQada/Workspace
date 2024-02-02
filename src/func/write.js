/**
 * convert an import data as a Map into a string of type imports
 * @param {Map<string, string[]>} imports imports data as <path, type[]>
 * @returns {string | void} the type imports string
 */
export function writeImports(imports) {
  if (imports.size === 0) {
    return
  }

  let lines = ''
  for (const iterator of imports) {
    const path = iterator[0]
    const types = iterator[1]

    lines += `import type { ${types.join(', ')} } from "${path}";\n`
  }

  return lines
}
