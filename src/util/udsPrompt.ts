import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

const { embedAccent } = require('../../config')

export async function sendUDSPrompt(interaction: ChatInputCommandInteraction) {
    let embed = new EmbedBuilder()
        .setTitle('We\'re sorry to interrupt...')
        .setDescription("But for this bot to be functional, we have to save some user data (only your user id!). By accepting this, you consent to having your user data saved.")
        .setColor(embedAccent)

    let ac = new ActionRowBuilder<ButtonBuilder>()

    ac.addComponents(
        new ButtonBuilder()
            .setCustomId('uds-accept')
            .setEmoji('✅')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('uds-decline')
            .setEmoji('❌')
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger)
    )

    await interaction.reply({ embeds: [embed], components: [ac] })
}