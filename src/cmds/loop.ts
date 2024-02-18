import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

export default {
    data: {
        name: "loop",
        description: "Loops the current song (or the whole queue).",
        options: [
            {
                name: "mode",
                description: "The loop mode",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    {
                        name: "Song",
                        value: "track"
                    },
                    {
                        name: "Queue",
                        value: "queue"
                    }
                ]
            }
        ]
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
    async run(interaction, options, client) {
        let player = client.music.getPlayer(interaction.guildId!)

        let mode = options.getString('mode',false)
        mode = ((player.repeatMode != 'off') && (mode == null) ? 'off' : (mode || "track")) 
        
        await player.setRepeatMode(mode as 'off'|'track'|'queue')
        return interaction.reply({content: mode === 'off' ? 'Stopped looping.' : `Started looping in mode \`${mode}\``})
    },
} as ICommand