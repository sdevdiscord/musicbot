import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

export default {
    data: {
        name: "shuffle",
        description: "Shuffles the queue."
    },
    middlewares: [isInVoiceChannel, isInSameVoiceChannel, isPlayingInGuild],
    async run(interaction, options, client) {
        let player = client.music.getPlayer(interaction.guildId!)
        if (player.queue.tracks.length < 2) return await interaction.reply({content: 'There must be more than 1 track playing to shuffle the queue.', ephemeral:true})

        await player.queue.shuffle()

        return interaction.reply('Shuffled queue.')
    },
} as ICommand