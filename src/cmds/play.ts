import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { ICommand } from "../types";
import { isInVoiceChannel, isVoiceChannelSpeakable } from "../middlewares/vcMiddlewares";
import { GuildMember } from "discord.js";
import { PluginInfo, SearchPlatform, SearchResult, Track, UnresolvedTrack } from "lavalink-client";
import { MUser } from "../models/user";
import { ITrack } from "../models/track";
import { IPlaylist, MPlaylist } from "../models/playlist";
import { isObjectIdOrHexString } from "mongoose";

export default {
    data: {
        name: "play",
        description: "Plays a song.",
        options: [
            {
                name: "query",
                description: "The song query",
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true
            },
            {
                name: "provider",
                description: "Song provider",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    {
                        name: "YouTube",
                        value: "ytsearch"
                    },
                    {
                        name: "YouTube Music",
                        value: "ytmsearch"
                    },
                    {
                        name: "SoundCloud",
                        value: "scsearch"
                    },
                    {
                        name: "Spotify",
                        value: "spsearch"
                    },
                    {
                        name: "Apple Music",
                        value: "amsearch"
                    },
                    {
                        name: "Bandcamp",
                        value: "bcsearch"
                    },
                    {
                        name: "TTS",
                        value: "speak"
                    },
                ]
            }
        ]
    },
    middlewares: [isInVoiceChannel, isVoiceChannelSpeakable],
    run: async (interaction, options, client) => {
        const query = options.getString("query",true)
        const provider = (options.getString("provider",false) || "ytsearch") as SearchPlatform;

        const player = client.music.getPlayer(interaction.guildId!) || client.music.createPlayer({
            guildId: interaction.guildId!,
            textChannelId: interaction.channelId!,
            voiceChannelId: (interaction.member! as GuildMember).voice.channelId!,
            selfDeaf: true,
            selfMute: false,
            volume: 100,
            instaUpdateFiltersFix: true,
            applyVolumeAsFilter: false
        })

        if (!player.connected) await player.connect()

        let res: SearchResult

        if (isObjectIdOrHexString(query)) {
            let _playlist = await MPlaylist.findById(query)
            if (!_playlist) return await interaction.reply({content: 'Playlist not found.', ephemeral:true})
            let playlist = await _playlist.populate<{ tracks: ITrack[] }>('tracks')

            res = {
                loadType: "playlist",
                tracks: playlist.tracks.map(track => client.music.utils.buildUnresolvedTrack({ title: track.name, uri: track.url }, interaction.user)),
                exception: null,
                playlist: {
                    title: playlist.name,
                    selectedTrack: null,
                    name: playlist.name,
                    duration: 0
                },
                pluginInfo: {}
            } as SearchResult
        } else {
            res = (await player.search({ query, source: provider }, interaction.user)) as SearchResult
            if (!res || !res.tracks?.length) return await interaction.reply({content: 'No songs found.', ephemeral:true})
        }

        res.tracks.forEach((track: UnresolvedTrack | Track) => {
            track.userData = {}
            track.userData['userId'] = interaction.user.id 
            track.userData['username'] = interaction.user.tag
        })

        await player.queue.add(res.loadType == "playlist" ? res.tracks : res.tracks[0])

        await interaction.reply({
            content: res.loadType == "playlist" 
                ? `Added playlist \`${res.playlist?.name ? res.playlist.name : res.playlist?.title}\` to the queue with ${res.tracks.length} songs.`
                : `Added to the queue: \`${res.tracks[0].info.title}\``
        })

        if (!player.playing) await player.play()

        client.posthog.capture({
            distinctId: interaction.user.tag,
            event: res.loadType == "playlist" ? "playlist requested" : "track requested",
            properties: {
                title: res.loadType == "playlist" 
                        ? (res.playlist?.name ? res.playlist.name : res.playlist?.title) 
                        : res.tracks[0].info.title,
                query,
                provider,
                guildName: client.guilds.cache.get(player.guildId)?.name,
                guildId: interaction.guildId,
                userId: interaction.user.id
            }
        })
    },

    autocomplete: async (interaction, client) => {
        let dbUser = await MUser.findByUserId(interaction.user.id)
        if (dbUser == null) return await interaction.respond([])
        let user = await dbUser.populate<{favourites: ITrack[], playlists: IPlaylist[]}>(['favourites', 'playlists'])

        const query = interaction.options.getFocused().toLowerCase()

        let complete: {name: string, value: string}[] = []

        const favFiltered = user.favourites.filter(f => f.name.toLowerCase().includes(query))
        complete.push(...favFiltered.map(f => ({ name: f.name, value: f.url })))

        const playlistFiltered = user.playlists.filter(f => f.name.toLowerCase().includes(query))
        complete.push(...playlistFiltered.map(f => ({ name: `Playlist | ${f.name}`, value: f._id.toHexString() })))

        await interaction.respond(complete)
    }
} as ICommand