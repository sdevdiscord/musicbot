import "../logger"

import { MusicBot } from "../bot";

export default function(client: MusicBot) {
    // node events
    client.music.nodeManager.on("connect", (node) => {
        console.log(`[SHARD ${client.cluster.id}] Connected to node "${node.id}"`)
    })
    .on("disconnect", (node, reason) => {
        console.log(`[SHARD ${client.cluster.id}] Node "${node.id}" disconnected: ${reason}`)
    })
    .on("error", (node,error,payload) => {
        console.log(`[SHARD ${client.cluster.id}] Node "${node.id}" errored: ${error.message}; payload: ${payload}`)
    })

    // track events
    client.music.on("trackEnd", (player, track) =>{
        client.posthog.capture({
            distinctId: track.userData!.username as string,
            event: "track played",
            properties: {
                title: track.info.title,
                length: Math.floor(track.info.duration / 1000),
                guildName: client.guilds.cache.get(player.guildId)?.name,
                guildId: player.guildId,
                userId: track.userData!.userId
            }
        })
    })

    // raw data
    client.on("raw", (d) => client.music.sendRawData(d))
}