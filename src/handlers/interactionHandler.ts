import "../logger"

import { InteractionType } from "discord.js";
import { MusicBot } from "../bot";

const memberIdRegEx = /{\d*}/g
const customArgsRegEx = /\(.*\)/g

export default function(client: MusicBot) {
    for (const file of client.interactionFiles) {
        const interactions = require(`../interactions/${file}`);
        if (interactions.buttonInteractions) {
            for (const interaction of interactions.buttonInteractions) {
                client.interactions.set(interaction.name, interaction);
            }
        }
    }

    client.on('interactionCreate',async (interaction) => {
        if (interaction.isCommand()) return;
        switch (interaction.type) {
            case InteractionType.MessageComponent: {
                if (interaction.isButton()){
                    try {
                        let customId = interaction.customId
                        let memberId
                        {
                            const match = customId.match(memberIdRegEx)
                            if (match) {
                                customId = customId.replace(match[0],'')
                                memberId = match[0].replace(/[{}]/g,'')
                            }
                            if (memberId && interaction.user?.id != memberId) {await interaction.deferUpdate(); break;}
                        }

                        let customArgs: string[] = []
                        {
                            const match = customId.match(customArgsRegEx)
                            if (match) {
                                customId = customId.replace(match[0],'')
                                customArgs = match[0].replace(/[()]/g,'').split(',')
                            }
                        }

                        let updated = await client.interactions.get(customId)?.run(interaction,client, ...customArgs)
                        if (!updated) await interaction.deferUpdate()
                    } catch (e) {
                        console.log(e)

                        await interaction.update({
                            components: [],
                            embeds: [],
                            content: `something happened`
                        })
                    }
                }
            } break
        }
    })
}