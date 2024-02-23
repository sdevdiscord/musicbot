import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { ICommand } from "../types";
import { MUser } from "../models/user";
import { ITrack, MTrack } from "../models/track";
import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";

export default {
    data: {
        name: "favorites",
        description: "Favourites",
        options: [
            {
                name: "add",
                description: "Adds the currently playing song to your favourites list.",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: "remove",
                description: "Removes the selected song from your favourites list.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "song",
                        description: "The song you want to remove",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true
                    }
                ]
            }
        ]
    },
    middlewares: [],

    run: async (interaction, options, client) => {
        let subcommand = options.getSubcommand()

        let user = await MUser.findByUserId(interaction.user.id)

        switch (subcommand) {
            case 'add': {
                if (!(await isInVoiceChannel(interaction, client)) 
                    || !(await isPlayingInGuild(interaction,client))
                    || !(await isInSameVoiceChannel(interaction,client))) return;

                let currentTrack = client.music.getPlayer(interaction.guildId!).queue.current
                let track = await MTrack.findByUrl(currentTrack?.info.uri!)
                if (track == null) {
                    track = MTrack.addTrack(currentTrack?.info.title!, currentTrack?.info.uri!)
                    await track.save()
                }
                user.favourites.push(track._id)
                await user.save()
                return await interaction.reply({
                    content: `Added \`${currentTrack?.info.title}\` to your favourites list.`,
                    ephemeral: true
                })
            }
            case 'remove': {
                const song = options.getString('song', true)
                let i = user.favourites.findIndex((v) => v.toString() == song)
                if (i == -1) return await interaction.reply({ content: "Couldn't find the song.", ephemeral: true })
                let track = await MTrack.findById(user.favourites.splice(i,1)).cache().exec()
                await user.save()

                return await interaction.reply({
                    content: `Removed \`${track?.name}\` from your favourites list.`,
                    ephemeral: true
                })
            }
        }
    },

    autocomplete: async (interaction, client) => {
        let user = await (await MUser.findByUserId(interaction.user.id)).populate<{favourites: ITrack[]}>('favourites')
        if (user == null) return await interaction.respond([])

        const query = interaction.options.getFocused().toLowerCase()

        const filtered = user.favourites.filter(f => f.name.toLowerCase().includes(query))

        await interaction.respond(filtered.map(f => ({ name: f.name, value: f._id.toString() })))
    }
} as ICommand