import "../logger"

import { CommandInteractionOptionResolver } from "discord.js";
import { MusicBot } from "../bot";
import { ICommand } from "../types";

export default function (client: MusicBot) {
    for (const file of client.commandFiles) {
        const command: ICommand = require(`../cmds/${file}`).default

        client.cmds.set(command.data.name, command)
        client.restCmds.push(command.data)
    }

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.inGuild()) {await interaction.reply({content:"not inteligent enough to play music in dms"}); return; }

        const { commandName, options } = interaction

        if (!client.cmds.has(commandName)) {await interaction.reply({content:"idk how to do that", ephemeral: true}); return; }
    
        try {
            const command: ICommand = client.cmds.get(commandName)!
            for (const middleware of command.middlewares) {
                if (await middleware(interaction, client)) {
                    continue
                }
                return
            }
            
            await command.run(interaction,options as CommandInteractionOptionResolver,client)
        } catch (err) {
            console.warn(err)
            interaction.replied
                ? await interaction.editReply({content: 'rip. try again later'})
                : await interaction.reply({content:'rip. try again later',ephemeral:true})
        }
    })
}