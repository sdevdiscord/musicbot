import {APIUser} from "discord-api-types/v10";
import {SnowTransfer} from "snowtransfer";
import {ChatInputCommand} from "@sdev/commands";

export type CommandManagerParams = [
    ChatInputCommand,
    number
]

export class MusicBot {
    public user: APIUser
    public constructor(public snow: SnowTransfer) { void snow }
}