import {APIApplicationCommand, Snowflake} from "discord-api-types/v10";
import { CommandInteraction, CommandInteractionOptionResolver, ButtonInteraction, Interaction, AutocompleteInteraction } from "discord.js";
import { MusicBot } from "./bot";

export interface APIApplicationCommandExt extends APIApplicationCommand{
    version?: Snowflake,
    application_id?: Snowflake,
    id?: Snowflake,
    default_member_permissions?: string,
    type?: 1
}

export type MiddlewareFunction = function(Interaction, MusicBot): Promise<boolean>
export type CommandMiddlewareFunction = function(CommandInteraction, MusicBot): Promise<boolean>
export type ButtonMiddlewareFunction = function(ButtonInteraction, MusicBot): Promise<boolean>

export interface ICommand {
    data: APIApplicationCommandExt,
    middlewares: CommandMiddlewareFunction[]
    run: (function(CommandInteraction, CommandInteractionOptionResolver, MusicBot): Promise<any>)
    autocomplete?: (function(AutocompleteInteraction, MusicBot): Promise<any>)
}

export interface IInteraction {
    name: string;
    middlewares: MiddlewareFunction[]
    run: (function(Interaction, MusicBot): Promise<boolean>)
}

export interface IButtonInteraction extends IInteraction {
    middlewares: ButtonMiddlewareFunction[]
    run: (function(ButtonInteraction, MusicBot): Promise<boolean>)
}
