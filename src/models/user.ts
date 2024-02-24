import {Model, Schema, Types, model, ObjectId, HydratedDocument} from "mongoose";

export interface IUser {
    id: string

    favourites: Types.Array<Types.ObjectId>
    playlists: Types.Array<Types.ObjectId>
}

interface UserModel extends Model<IUser> {
    findByUserId(userId:string): Promise<HydratedDocument<IUser>>,
    addUser(userId:string): HydratedDocument<IUser>
}

const userSchema = new Schema<IUser, UserModel>({
    id:{type:String, required:true},

    favourites: {type: [{ type: Schema.Types.ObjectId, ref: "Track" }], required: false, default: []},
    playlists: {type: [{ type: Schema.Types.ObjectId, ref: "Playlist" }], required: false, default: [] }
})

userSchema.static('findByUserId',async function findByUserId(userId:string) {
    return await this.findOne({ id:userId }).cache().exec()
})

userSchema.static('addUser',function addUser(userId:string) {
    return new this({ id: userId })
})

const MUser = model<IUser,UserModel>('User',userSchema)

export {MUser}