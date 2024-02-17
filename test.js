const {PostHog} = require('posthog-node')

const client = new PostHog(
    'phc_To2KFSGIZvTflmh4iasmM9cJ06r56vvWAkhoepIigK5',
    { host: 'https://eu.posthog.com' }
)

client.capture({
    distinctId: 'test-id',
    event: 'test-event'
})

// Send queued events immediately. Use for example in a serverless environment
// where the program may terminate before everything is sent
client.flush()


//MTE5NjQ3NTU4MzU2ODI4OTg4Mg.GNXbtI.hN2sBKVrtY7tDLGkKOgC7gJA17Ofwx2ohzarxQ

const { ActivityType } = require("discord-api-types/v10")

let config = {
    branch: "dev",
    version: "3.0.0-alpha",

    // discord
    discordTokens: {
        master: "",
        dev: ""
    },
    presence: {
        status: 'online',
        activities: [{
            name: '{server_count} servers. version: {version}',
            type: ActivityType.Listening,
            url : 'https://google.com'
        }]
    },
    totalShards: 'auto',

    // posthog
    posthogApiKey: "phc_To2KFSGIZvTflmh4iasmM9cJ06r56vvWAkhoepIigK5",

    // lavalink
    nodes: [
        {
            authorization: "fortnitemovesdoitagaindoitagain",
            host: "localhost",
            port: 2333,
            id: "main",
            requestTimeout: 10000,
        }
    ],
}

module.exports = config