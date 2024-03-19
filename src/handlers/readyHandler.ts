import '../logger'

import {MusicBot} from "../bot";
import mongoose from 'mongoose';
import { ActivityType } from 'discord.js';

const { version, mongoDB } = require("../../config");

export default function (c: MusicBot) {
    c.once('ready', async () => {
        console.log(`Logged in as ${c.user?.tag} with a shard id of ${c.cluster.id}`);

        let guildcount = (await c.application?.fetch())?.approximateGuildCount
        console.log(`[SHARD ${c.cluster.id}] In ${guildcount} servers`);

        c.user?.setPresence({
            status: 'online',
            activities: [
                {
                    name: `${guildcount} servers. version: ${version}`,
                    type: ActivityType.Listening
                }
            ]
        })

        // init mongoose
        await mongoose.connect(mongoDB)

        // init music client
        c.music.init({
            id: c.user!.id,
            username: c.user!.username
        })
    })

    setInterval(async () => {
        let guildcount = (await c.cluster.broadcastEval(c => c.guilds.cache.size)).reduce((acc:any, guildCount:any) => Number(acc + guildCount), 0);

        c.user?.setPresence({
            status: 'online',
            activities: [
                {
                    name: `${guildcount} servers. version: ${version}`,
                    type: ActivityType.Listening
                }
            ]
        })
    }, 1000 * 60 * 5)

    setInterval(async () => {
        await c.posthog.flushAsync()
    }, 1000 * 15)
}