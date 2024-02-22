import "../logger"

import { MUser } from "../models/user";
import { IButtonInteraction } from "../types";

export const buttonInteractions = [
    {
        name: "uds-accept",
        run: async (interaction, client) => {
            await MUser.addUser(interaction.user.id).save()
            console.log('Saved user')
            await interaction.update({
                components: [],
                embeds: [],
                content: `Thank you for accepting!`
            })
            return true
        },
    },
    {
        name: "uds-decline",
        run: async (interaction, client) => {
            await interaction.update({
                components: [],
                embeds: [],
                content: `Sorry, but without accepting you are not allowed to use this bot. Please accept to use this bot.`
            })
            return true
        },
    }
] as IButtonInteraction[]