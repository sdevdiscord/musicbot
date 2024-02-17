import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

export default {
    data: {
        name: "stop",
        description: "Stops the bot."
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
    async run(interaction, options, client) {
        let player = client.music.getPlayer(interaction.guildId!)
        player.destroy()
    },
} as ICommand