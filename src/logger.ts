import { BackTracker } from 'backtracker'
import { inspect } from 'util'

const oldLog = {
    info: console.log,
    warn: console.warn,
    error: console.error
}

type LogType = "info" | "warn" | "error"
const scopeMaxLogLen = 20

function pref(type: LogType) {
    const stack = BackTracker.stack
    const first = stack[1]
    const scope = `${first.srcFilename}:${first.srcLine}:${first.srcColumn}`
    const color = type === "warn" ? "\x1b[93m" : type === "error" ? "\x1b[91m" : "\x1b[92m"

    const datePart = new Date().toISOString().replace(new RegExp(/T/), " ").replace(new RegExp(/Z/), "")
    const dateTypePad = type.length === 4 ? " " : ""
    const scopeLogPad = " ".repeat((scopeMaxLogLen - scope.length) < 1 ? 1 : scopeMaxLogLen - scope.length)

    return `\x1b[90m${datePart} ${dateTypePad}${color}${type.toUpperCase()} \x1b[0m--- \x1b[36m${scope}${scopeLogPad}\x1b[0m :`
}

function log(type: LogType, ...data:any[]){
    const logFunc = oldLog[type]
    logFunc(pref(type),...data)
}

console.log = log.bind(null, "info")
console.warn = log.bind(null, "warn")
console.error = log.bind(null, "error")

const errorHandler = (reason: unknown) => log("error", inspect(reason, false, 5, true))
process.on("unhandledRejection", errorHandler)
process.on("uncaughtException", errorHandler)