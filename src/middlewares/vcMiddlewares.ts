import { CommandInteraction, GuildMember, VoiceChannel } from 'discord.js'
import { MusicBot } from '../bot'

export async function isInVoiceChannel(interaction: CommandInteraction, client: MusicBot){
    if(!(interaction.member as GuildMember).voice.channelId) {
        await interaction.reply({
            content: 'You must be in a voice channel to use this command!',
            ephemeral: true
        })
        return false
    }
    return true
}

export async function isVoiceChannelSpeakable(interaction: CommandInteraction, client: MusicBot){
    let voice = (interaction.member as GuildMember).voice.channel! as VoiceChannel
    if(!voice.joinable || !voice.speakable) {
        await interaction.reply({
            content: 'I can\'t speak/join this voice channel.',
            ephemeral: true
        })
        return false
    }
    return true
}

export async function isPlayingInGuild(interaction: CommandInteraction, client: MusicBot){
    if (!client.music.getPlayer(interaction.guildId!)) {
        await interaction.reply({
            content: 'Currently not playing in this',
            ephemeral: true
        })
        return false
    }
    return true
}

export async function isInSameVoiceChannel(interaction: CommandInteraction, client: MusicBot){
    let voice = (interaction.member as GuildMember).voice.channelId!
    let player = client.music.getPlayer(interaction.guildId!)
    if(voice !== player.voiceChannelId) {
        await interaction.reply({
            content: 'You are not in the same voice channel.',
            ephemeral: true
        })
        return false
    }
    return true
}
