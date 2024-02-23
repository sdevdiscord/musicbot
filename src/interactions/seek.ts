import { isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel } from "../middlewares/vcMiddlewares";
import { IButtonInteraction } from "../types";
import { getSeekMessage } from "../util/seekMessage";

export const buttonInteractions = [
    {
        name: "seek-backward30",
        middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
        async run(interaction, client) {
            let player = client.music.getPlayer(interaction.guildId!)
            await player.seek(player.position - 30_000)
            interaction.update(getSeekMessage(player.position,player.queue.current?.info.duration))
            return true
        },
    },
    {
        name: "seek-backward10",
        middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
        async run(interaction, client) {
            let player = client.music.getPlayer(interaction.guildId!)
            await player.seek(player.position - 10_000)
            interaction.update(getSeekMessage(player.position,player.queue.current?.info.duration))
            return true
        },
    },
    {
        name: "seek-forward10",
        middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
        async run(interaction, client) {
            let player = client.music.getPlayer(interaction.guildId!)
            await player.seek(player.position + 10_000)
            interaction.update(getSeekMessage(player.position,player.queue.current?.info.duration))
            return true
        },
    },
    {
        name: "seek-forward30",
        middlewares: [isInVoiceChannel, isPlayingInGuild, isInSameVoiceChannel],
        async run(interaction, client) {
            let player = client.music.getPlayer(interaction.guildId!)
            await player.seek(player.position + 30_000)
            interaction.update(getSeekMessage(player.position,player.queue.current?.info.duration))
            return true
        },
    },

] as IButtonInteraction[]