require('@sdev/logger')
const Sync = require('heatsync')
const sync = new Sync()
sync.events.on('any', filename => console.log(`File changed: ${filename}`))