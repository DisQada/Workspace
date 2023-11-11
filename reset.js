const { writeFileSync } = require("fs");
const { resolve } = require("path");

writeFileSync(resolve("./config/tsconfig.json"), "{}");
writeFileSync(resolve("./config/tsconfig.doc.json"), "{}");
writeFileSync(resolve("./config/typedoc.json"), "{}");
