import { EmbedBuilder } from "discord.js";
import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

const { embedAccent } = require('../../config')

// TODO: Add buttons
export default {
    data: {
        name: "queue",
        description: "Gets the next 5 songs in the queue and the current one."
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild],
    async run(interaction, options, client) {
        let player = client.music.getPlayer(interaction.guildId!)
        if (player.queue.tracks.length < 1) return await interaction.reply({content: 'Nothing is in the queue.', ephemeral:true})

        let queueString = player.queue.tracks
            .slice(0,5)
            .map((track, index) => `**${index + 1}.** \`${track.info.title}\``)
            .join('\n')

        const embed = new EmbedBuilder()
            .setTitle(`In Queue: ${player.queue.tracks.length}`)
            .addFields(
                {
                    name: "Currently Playing",
                    value: `\`${player.queue.current?.info.title}\``,
                    inline: false
                },
                {
                    name: "Queue",
                    value: queueString,
                    inline: false
                },
            )
            .setColor(embedAccent);

        return interaction.reply({embeds:[embed]})
    },
} as ICommand