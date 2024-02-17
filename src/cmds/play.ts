import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { ICommand } from "../types";
import { isInVoiceChannel, isVoiceChannelSpeakable } from "../middlewares/vcMiddlewares";
import { GuildMember } from "discord.js";
import { SearchPlatform, Track, UnresolvedTrack } from "lavalink-client";

export default {
    data: {
        name: "play",
        description: "Plays a song.",
        options: [
            {
                name: "query",
                description: "The song query",
                type: ApplicationCommandOptionType.String,
                required: true
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

        let res = await player.search({ query, source: provider }, interaction.user)
        if (!res || !res.tracks?.length) return await interaction.reply({content: 'No songs found.', ephemeral:true})

        res.tracks.forEach((track: UnresolvedTrack | Track) => {
            track.userData = {}
            track.userData['userId'] = interaction.user.id 
        })

        await player.queue.add(res.loadType == "playlist" ? res.tracks : res.tracks[0])

        await interaction.reply({
            content: res.loadType == "playlist" 
                ? `Added playlist \`${res.playlist?.name}\` to the queue with ${res.tracks.length} songs.`
                : `Added to the queue: \`${res.tracks[0].info.title}\``
        })

        if (!player.playing) await player.play()

        client.posthog.capture({
            distinctId: interaction.user.id as string,
            event: res.loadType == "playlist" ? "playlist requested" : "track requested",
            properties: {
                title: res.loadType == "playlist" ? res.playlist?.title : res.tracks[0].info.title,
                query,
                provider,
                guildId: interaction.guildId
            }
        })
    }
} as ICommand