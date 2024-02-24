import {Model, Schema, Types, model, Query, HydratedDocument} from "mongoose";

export interface IGuild {
    id: string

    // roles that can play music
    djRoles: Types.Array<string>

    // if /dj is enabled in the server
    djCommandEnabled: boolean

    // channels where the user can/can't use the commands
    channelFilterWhitelist: boolean
    listedChannels: Types.Array<string>
}

interface GuildModel extends Model<IGuild> {
    findByGuildId(guildId:string): Promise<HydratedDocument<IGuild>>
    addGuild(guildId:string): HydratedDocument<IGuild>
}

const guildSchema = new Schema<IGuild, GuildModel>({
    id:{type:String, required:true},

    djRoles:{type:[String], required:false, default:[]},

    djCommandEnabled:{type:Boolean, required:false, default:true},

    channelFilterWhitelist:{type:Boolean, required:false, default:true},
    listedChannels:{type:[String], required:false, default:[]},
})

guildSchema.static('findByGuildId',async function findByGuildId(guildId:string) {
    return await this.findOne({ id:guildId }).cache().exec()
})

guildSchema.static('addGuild',function addGuild(guildId:string) {
    return new this({ id: guildId })
})

const MGuild = model<IGuild,GuildModel>('Guild',guildSchema)

export {MGuild}