import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { formatMS_HHMMSS } from "./time";

const { embedAccent } = require('../../config')

export function getSeekMessage(currentPosition, maxDuration){
    let embed = new EmbedBuilder()
        .setTitle(`${formatMS_HHMMSS(currentPosition)} / ${formatMS_HHMMSS(maxDuration)}`)
        .setColor(embedAccent)

    let ac = new ActionRowBuilder<ButtonBuilder>()

    ac.addComponents(
        new ButtonBuilder()
        .setCustomId('seek-backward30')
        .setEmoji('⏪')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Backward 30 seconds')
        .setDisabled(currentPosition < 30_000))
    
    ac.addComponents(
        new ButtonBuilder()
        .setCustomId('seek-backward10')
        .setEmoji('◀')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Backward 10 seconds')
        .setDisabled(currentPosition < 10_000))

    ac.addComponents(
        new ButtonBuilder()
        .setCustomId('seek-forward10')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Forward 10 seconds')
        .setDisabled(currentPosition + 10_000 > maxDuration))

    ac.addComponents(
        new ButtonBuilder()
        .setCustomId('seek-forward30')
        .setEmoji('⏩')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Forward 30 seconds')
        .setDisabled(currentPosition + 30_000 > maxDuration))
    
    return { embeds: [embed], components:[ac] }
}