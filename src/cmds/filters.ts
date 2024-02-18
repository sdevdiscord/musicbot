import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";

export default {
    data: {
        name: "filters",
        description: "Filters",
        options: [
            {
                name: "clear",
                description: "Clears the current filters.",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: "apply",
                description: "Applies a filter.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "filter",
                        description: "The filter to apply.",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: "Nightcore", value: "nightcore" },
                            { name: "Vaporwave", value: "vaporwave" },
                            { name: "Low Pass", value: "lowpass" },
                            { name: "Karaoke", value: "karaoke" },
                            { name: "Rotation", value: "rotation" },
                            { name: "Tremolo", value: "tremolo" },
                            { name: "Vibrato", value: "vibrato" }
                        ]
                    },
                ]
            }
        ]
    },
    middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
    async run(interaction, options, client) {
        let sub = options.getSubcommand()

        let player = client.music.getPlayer(interaction.guildId!)
        if (sub == 'clear') {
            await player.filterManager.resetFilters()
            return await interaction.reply({ content: 'Cleared filters.' })
        }

        let filter = options.getString('filter',true)
        switch (filter) {
            case 'nightcore': {await player.filterManager.toggleNightcore()} break;
            case 'vaporwave': {await player.filterManager.toggleVaporwave()} break;
            case 'lowpass': {await player.filterManager.toggleLowPass()} break;
            case 'karaoke': {await player.filterManager.toggleKaraoke()} break;
            case 'rotation': {await player.filterManager.toggleRotation()} break;
            case 'tremolo': {await player.filterManager.toggleTremolo()} break;
            case 'vibrato': {await player.filterManager.toggleVibrato()} break; 
        }

        return interaction.reply({content:`Applied filter \`${filter}\`.`})
    },
} as ICommand