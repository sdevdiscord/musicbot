import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { ICommand } from "../types";

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

                return await interaction.reply({content: `Bot has been up for: \`${totalDays}:${totalHours % 24}:${totalMins % 60}:${totalSecs % 60}\``, ephemeral:true})
            }
        }

        return await interaction.reply({ content: `Test; subcommand: ${subcommand}` })
    }
} as ICommand