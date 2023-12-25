const fs = require("fs")
const path = require("path")

const config = require("../../config")

let dtsString = "declare namespace Config {\n"

function describe(value) {
    return typeof value !== "object"
        ? typeof value
        : Array.isArray(value)
            ? `Array<${typeof value[0] !== "undefined" ? describe(value[0]) : "unknown"}>`
            : value === null
                ? "null"
                : `{ ${Object.keys(value).map(k => `${k}: ${describe(value[k])}`).join(", ")} }`
}

for (const [key, value] of Object.entries(config)) {
    const val = describe(value)
    dtsString += `\tconst ${key}: ${val}\n`
}

dtsString += "}\nexport default Config"

fs.writeFileSync(path.join(__dirname, "./config.d.ts"), dtsString)
console.log("Generated config.d.ts")