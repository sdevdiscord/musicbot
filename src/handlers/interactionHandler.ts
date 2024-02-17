import "../logger"

import { InteractionType } from "discord.js";
import { MusicBot } from "../bot";

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
                            let memberIdRegEx = /{\d*}/g
                            const match = customId.match(memberIdRegEx)
                            if (match) {
                                customId = customId.replace(match[0],'')
                                memberId = match[0].replace(/[{}]/g,'')
                            }
                            if (interaction.user?.id != memberId) {await interaction.deferUpdate(); break;}
                        }

                        let updated = await client.interactions.get(customId)?.run(interaction,client)
                        if (!updated) await interaction.deferUpdate()
                    } catch (e) {
                        console.log(e)

                        await interaction.update({
                            components: [],
                            content: `something happened`
                        })
                    }
                }
            } break
        }
    })
}