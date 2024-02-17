import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { ICommand } from "../types";
import { EmbedBuilder, Guild } from "discord.js";

function fmtUp(time:number) {
    return time < 10 ? `0${time}` : time
}

export default {
    data: {
        name: "bot",
        description: "Bot info",
        options: [
            {
                name: "ping",
                description: "Gets the bot's latency",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: "uptime",
                description: "Gets the bot's uptime",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: "stats",
                description: "Global stats",
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },
    middlewares: [],
    run: async (interaction, options, client) => {
        let subcommand = options.getSubcommand()

        switch (subcommand) {
            case 'ping': {
                return await interaction.reply({content: `Latency: \`${Date.now() - interaction.createdTimestamp}ms\`; Websocket latency: \`${client.ws.ping}ms\``, ephemeral:true})
            }
            case 'uptime': {
                let totalSecs  = Math.floor(process.uptime())
                let totalMins  = Math.floor(totalSecs / 60)
                let totalHours = Math.floor(totalMins / 60)
                let totalDays  = Math.floor(totalHours / 24)

                return await interaction.reply({content: `Bot has been up for: \`${fmtUp(totalDays)}:${fmtUp(totalHours % 24)}:${fmtUp(totalMins % 60)}:${fmtUp(totalSecs % 60)}\``, ephemeral:true})
            }
            case 'stats': {
                let guildcount = (await client.cluster.broadcastEval(`this.guilds.cache.size`)).reduce((acc:any, guildCount:any) => Number(acc + guildCount), 0);
                let usercount = (await client.cluster.broadcastEval(c => {
                    return c.guilds.cache.reduce((acc: any, guild: Guild) => Number(acc + guild.memberCount),0)
                })).reduce((acc:any, userCount:any) => Number(acc + userCount), 0);
                let memUsed = Math.round(process.memoryUsage().heapUsed / 1_000_000) /* MB */

                let embed = new EmbedBuilder()
                    .setTitle('Global Stats')
                    .addFields({
                        name: "Discord Stats",
                        value: `Server Count: \`${guildcount}\`\nUser Count: \`${usercount}\``
                    }, {
                        name: "Process Stats",
                        value: `Memory Usage: \`${memUsed}MB\``
                    })

                return await interaction.reply({embeds: [embed], ephemeral: true})
            }
        }

        return await interaction.reply({ content: `Test; subcommand: ${subcommand}` })
    }
} as ICommand