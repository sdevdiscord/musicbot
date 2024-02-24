import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { isInSameVoiceChannel, isInVoiceChannel, isPlayingInGuild } from "../middlewares/vcMiddlewares";
import { ICommand } from "../types";
import { MUser } from "../models/user";
import { IPlaylist, MPlaylist } from "../models/playlist";
import { ITrack, MTrack } from "../models/track";

export default {
    data: {
        name: "playlist",
        description: "Playlists",
        options: [
            {
                name: 'create',
                description: 'Creates a playlist',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'name',
                        description: 'The name of the playlist',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },
            {
                name: 'delete',
                description: 'Deletes a playlist',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'playlist',
                        description: 'The playlist',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: 'song',
                description: 'Song',
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'add',
                        description: 'Adds a song to a playlist',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'playlist',
                                description: 'The playlist',
                                type: ApplicationCommandOptionType.String,
                                required: true,
                                autocomplete: true
                            }
                        ]
                    },
                    {
                        name:'remove',
                        description: 'Removes a song from a playlist',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'playlist',
                                description: 'The playlist',
                                type: ApplicationCommandOptionType.String,
                                required: true,
                                autocomplete: true
                            },
                            {
                                name:'song',
                                description: 'The song',
                                type: ApplicationCommandOptionType.String,
                                required: true,
                                autocomplete: true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    middlewares: [],
    async run(interaction, options, client) {
        let user = await MUser.findByUserId(interaction.user.id)

        switch (options.getSubcommand(true)) {
            case 'create': {
                const name = options.getString('name',true)
                let playlist = MPlaylist.createPlaylist(name)
                await playlist.save()
                user.playlists.push(playlist._id)
                await user.save()
                return await interaction.reply({
                    content: `Created playlist \`${playlist.name}\`.`,
                    ephemeral: true
                })
            }
            case 'delete': {
                const playlist = options.getString('playlist',true)
                let i = user.playlists.findIndex((v) => v._id.toHexString() == playlist)
                if (i == -1) return await interaction.reply({ content: "Couldn't find the playlist.", ephemeral: true })
                await MPlaylist.deleteOne({ _id: user.playlists.splice(i,1) }).exec()
                await user.save()
                return await interaction.reply({ content: "Deleted the playlist.", ephemeral: true })
            }
            case 'add': {
                if (!(await isInVoiceChannel(interaction, client)) 
                    || !(await isPlayingInGuild(interaction,client))
                    || !(await isInSameVoiceChannel(interaction,client))) return;

                const player = client.music.getPlayer(interaction.guildId!)
                if (!player.queue.current) return await interaction.reply({ content: "Nothing is playing." })

                const playlist = options.getString('playlist',true)

                let dbPlaylist = await MPlaylist.findById(playlist).cache().exec()
                if (dbPlaylist == null) return await interaction.reply({ content: "Couldn't find the playlist.", ephemeral: true })
                
                let track = await MTrack.findByUrl(player.queue.current?.info.uri!)
                if (track == null) {
                    track = MTrack.addTrack(player.queue.current?.info.title!, player.queue.current?.info.uri!)
                    await track.save()
                }
                dbPlaylist.tracks.push(track._id)
                await dbPlaylist.save()
                return await interaction.reply({ content: `Added \`${track.name}\` to the playlist.`, ephemeral: true })
            }
            case 'remove': {
                const playlist = options.getString('playlist',true)
                const song = options.getString('song',true)

                let dbPlaylist = await MPlaylist.findById(playlist).cache().exec()
                if (dbPlaylist == null) return await interaction.reply({ content: "Couldn't find the playlist.", ephemeral: true })
                
                let i = dbPlaylist.tracks.findIndex((v) => v._id.toHexString() == song)
                if (i == -1) return await interaction.reply({ content: "Couldn't find the song.", ephemeral: true })

                let track = await MTrack.findById(dbPlaylist.tracks.splice(i,1)).cache().exec()
                await dbPlaylist.save()
                return await interaction.reply({ content: `Removed \`${track?.name}\` from the playlist.`, ephemeral: true })
            }
        }
    },
    async autocomplete(interaction, client) {
        const query = interaction.options.getFocused(true)
        const value = query.value.toLowerCase()
        switch (query.name) {
            case 'playlist': {
                let dbUser = await MUser.findByUserId(interaction.user.id)
                if (dbUser == null) return await interaction.respond([])
                let user = await dbUser.populate<{playlists: IPlaylist[]}>('playlists')

                const filtered = user.playlists.filter(f => f.name.toLowerCase().includes(value))
                return await interaction.respond(filtered.map(f => ({
                    name: f.name,
                    value: f._id.toHexString()
                })))
            }
            case 'song': {
                let dbPlaylist = await MPlaylist.findById(interaction.options.getString('playlist',true)).cache().exec()
                if (dbPlaylist == null) return await interaction.respond([])
                let playlist = await dbPlaylist.populate<{ tracks: ITrack[] }>('tracks')
                
                const filtered = playlist.tracks.filter(f => f.name.toLowerCase().includes(value))
                await interaction.respond(filtered.map(f => ({ name: f.name, value: f._id.toHexString() })))
            }
        }
    }
} as ICommand