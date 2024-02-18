const { ActivityType } = require("discord-api-types/v10")

let config = {
    branch: "master",
    version: "3",

    // discord
    discordTokens: {
        master: "",
        // dev: ""
    },

    presence: {
        status: 'online',
        activities: [{
            name: 'bot',
            type: ActivityType.Playing,
            url : 'https://google.com'
        }]
    },

    embedAccent: "#000000",

    totalShards: 'auto',

    // posthog
    posthog: {
        apiKey: "<api_key_here>",
        host: "https://eu.posthog.com",
    },

    // your lavalink nodes
    nodes: [
        {
            authorization: "<password_here>",
            host: "localhost",
            port: 2333,
            id: "main",
            requestTimeout: 10000,
        }
    ],
}

module.exports = config