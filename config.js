const { ActivityType } = require("discord-api-types/v10")

let config = {
    branch: "dev",
    version: "3.0.0-alpha",

    // discord
    discordTokens: {
        master: "",
        dev: "MTE5NjQ3NTU4MzU2ODI4OTg4Mg.GU8Jd-.R7W7rMZRIup_j5sANy9YS8ArfBCT6UrCvaBpM8"
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