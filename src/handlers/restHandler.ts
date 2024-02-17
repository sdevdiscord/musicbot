import "../logger"
import { MusicBot } from "../bot";
import { Routes } from "discord.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function(client: MusicBot) {
    try {
        while (client.application === null) await sleep(100);
        await client.rest.put(
            Routes.applicationCommands(client.application!.id),
            { body: client.restCmds },
        )
    } catch (err) {
        console.error(err);
    }
}