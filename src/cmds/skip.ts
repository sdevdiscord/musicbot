import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

export default {
    data: {
        name: "skip",
        description: "Skips a song."
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
    async run(interaction, options, client) {
        let player = client.music.getPlayer(interaction.guildId!)
        await player.skip(undefined,false)
        return interaction.reply({content:'Skipped.'})
    },
} as ICommand