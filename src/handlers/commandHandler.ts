import "../logger"

import { CommandInteractionOptionResolver } from "discord.js";
import { MusicBot } from "../bot";
import { ICommand } from "../types";
import { IGuild, MGuild } from "../models/guild";
import { HydratedDocument } from "mongoose";
import { MUser } from "../models/user";
import { sendUDSPrompt } from "../util/udsPrompt";

export default function (client: MusicBot) {
    for (const file of client.commandFiles) {
        const command: ICommand = require(`../cmds/${file}`).default

        client.cmds.set(command.data.name, command)
        client.restCmds.push(command.data)
    }

    // command handling
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.inGuild()) {await interaction.reply({content:"not inteligent enough to play music in dms"}); return; }

        let guild: HydratedDocument<IGuild> = await MGuild.findByGuildId(interaction.guildId);
        if (guild == null) {
            guild = await MGuild.addGuild(interaction.guildId)
            await guild.save()
        }
        if (guild.listedChannels && guild.listedChannels.find(id => interaction.channelId === id)) { 
            if (!guild.channelFilterWhitelist && guild.listedChannels.find(id => interaction.channelId === id)){
                await interaction.reply({content: 'This channel is blacklisted.', ephemeral: true})
                return
            }
            if (guild.channelFilterWhitelist && guild.listedChannels.find(id => interaction.channelId !== id)){
                await interaction.reply({content: 'This channel is not whitelisted.', ephemeral: true})
                return
            }
        }

        if ((await MUser.findByUserId(interaction.user.id)) == null) {await sendUDSPrompt(interaction); return}

        const { commandName, options } = interaction

        if (!client.cmds.has(commandName)) {await interaction.reply({content:"idk how to do that", ephemeral: true}); return; }
    
        try {
            const command: ICommand = client.cmds.get(commandName)!
            let passedMiddlewares = true
            for (const middleware of command.middlewares) {
                if (!passedMiddlewares) continue;
                if (await middleware(interaction, client)) {
                    continue
                }
                passedMiddlewares = false
            }
            
            if (passedMiddlewares)
                await command.run(interaction,options as CommandInteractionOptionResolver,client)
        } catch (err) {
            console.warn(err)
            interaction.replied
                ? await interaction.editReply({content: 'rip. try again later'})
                : await interaction.reply({content:'rip. try again later',ephemeral:true})
        }
    })

    // autocomplete
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isAutocomplete()) return;
        if (!interaction.inGuild()) return;

        const { commandName } = interaction

        if (!client.cmds.has(commandName)) return;

        try {
            const command: ICommand = client.cmds.get(commandName)!
            if (!command.autocomplete) return;

            await command.autocomplete(interaction,client)
        } catch (err) {
            console.warn(err)
        }
        
    })
}