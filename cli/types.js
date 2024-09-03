export {}

/**
 * @typedef {object} CleanOptions
 * @property {string} path
 * @property {NodeJS.BufferEncoding} encoding
 */

/** @typedef {'root' | 'types' | 'out' | 'lang' | 'title' | 'links' | string} ConfigKey */

/**
 * @typedef {object} ConfigData
 * @property {string} root
 * @property {string} types
 * @property {string} out
 * @property {{[name:string]:string}} links
 */

/** @typedef {'name' | 'displayName' | 'repository' | string}  PackageKey */

/**
 * @typedef {object} PackageData
 * @property {string} name
 * @property {string} displayName
 * @property {string | {url:string}} repository
 */

/**
 * @typedef {object} TypedocData
 * @property {string} navigationLinks
 */
