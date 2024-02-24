import { MusicBot } from "../bot";
import { IButtonInteraction, ICommand } from "../types";

export default function (client: MusicBot) {
    for (const file of client.moduleFiles) {
        const mod = require(`../../modules/${file}`)
        if (mod.command) {
            let command: ICommand = mod.command
            client.cmds.set(command.data.name,command)
            let i = client.restCmds.findIndex(c => c.name === command.data.name)
            if (i !== -1){
                client.restCmds[i] = command.data
            } else {
                client.restCmds.push(command.data)
            }
        }

        if (mod.buttonInteractions) {
            let interactions: IButtonInteraction[] = mod.buttonInteractions
            for (const interaction of interactions) {
                client.interactions.set(interaction.name,interaction)
            }
        }
    }
}