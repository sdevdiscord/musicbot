import "../logger"

import { MusicBot } from "../bot";

export default function(client: MusicBot) {
    // node events
    client.music.nodeManager.on("connect", (node) => {
        console.log(`Connected to node "${node.id}"`)
    })
    .on("disconnect", (node, reason) => {
        console.log(`Node "${node.id}" disconnected: ${reason}`)
    })
    .on("error", (node,error,payload) => {
        console.log(`Node "${node.id}" errored: ${error.message}; payload: ${payload}`)
    })

    // track events
    client.music.on("trackStart", (player, track) =>{
        client.posthog.capture({
            distinctId: track.userData!.userId as string,
            event: "track played",
            properties: {
                title: track.info.title,
                length: Math.floor(track.info.duration / 1000),
                guildId: player.guildId
            }
        })
    })

    // raw data
    client.on("raw", (d) => client.music.sendRawData(d))
}