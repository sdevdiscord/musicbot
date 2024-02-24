import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

export default {
    data: {
        name: "pause",
        description: "Pauses the playback."
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
    async run(interaction, options, client) {
        let player = client.music.getPlayer(interaction.guildId!)
        await player.pause()
        return interaction.reply({content:'Playback paused.'})
    },
} as ICommand