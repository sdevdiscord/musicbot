import '../logger'

import {MusicBot} from "../bot";
import mongoose from 'mongoose';

const { presence, version, mongoDB } = require("../../config");

export default function (c: MusicBot) {
    c.once('ready', async () => {
        console.log(`Logged in as ${c.user?.tag} with a shard id of ${c.cluster.id}`);

        let guildcount = (await c.application?.fetch())?.approximateGuildCount
        console.log(`[SHARD ${c.cluster.id}] In ${guildcount} servers`);

        let pres = presence
        pres.activities.forEach(element => {
            element.name = element.name.replace('{server_count}',guildcount).replace('{version}',version)
        });
        c.user?.setPresence(pres)

        // init mongoose
        await mongoose.connect(mongoDB)

        // init music client
        c.music.init({
            id: c.user!.id,
            username: c.user!.username
        })
    })

    setInterval(async () => {
        let guildcount = (await c.application?.fetch())?.approximateGuildCount

        let pres = presence
        pres.activities.forEach(element => {
            element.name = element.name.replace('{server_count}',guildcount).replace('{version}',version)
        });
        c.user?.setPresence(pres)
    }, 1000 * 60 * 5)

    setInterval(async () => {
        await c.posthog.flushAsync()
    }, 1000 * 15)
}