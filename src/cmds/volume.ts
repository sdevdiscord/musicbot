import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

const maxVolume = 200;

export default {
    data: {
        name: "volume",
        description: "Sets the volume of the playback.",
        options: [
            {
                name: "volume",
                description: "The volume to set",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
    async run(interaction, options, client) {
        let volume = options.getInteger('volume', true);
        volume = volume > maxVolume ? maxVolume : volume;
        let player = client.music.getPlayer(interaction.guildId!)
        await player.setVolume(volume)
        return interaction.reply({content:`Set the volume to ${volume}.`})
    },
} as ICommand