import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";
import { getSeekMessage } from "../util/seekMessage";

export default {
    data: {
        name: "seek",
        description: "Enables you to go forwards or backwards in the song."
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
    async run(interaction, options, client) {
        let player = client.music.getPlayer(interaction.guildId!)
        return interaction.reply(getSeekMessage(player.position, player.queue.current?.info.duration))
    },
} as ICommand