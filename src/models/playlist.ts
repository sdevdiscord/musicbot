import {HydratedDocument, Model, Schema, Types, model} from "mongoose";

export interface IPlaylist {
    _id: Types.ObjectId;

    name: string;
    public: boolean;
    tracks: Types.Array<Types.ObjectId>;
}

interface PlaylistModel extends Model<IPlaylist> {
    createPlaylist(name: string): HydratedDocument<IPlaylist>
}

const playlistSchema = new Schema<IPlaylist, PlaylistModel>({
    name: { type: String, required: true },
    public: { type: Boolean, required: false, default: false },
    tracks: { type: [{type: Schema.Types.ObjectId, ref: "Track"}], required: false, default: [] }
})

playlistSchema.static('createPlaylist', function createPlaylist(name: string) {
    return new this({ name })
})

const MPlaylist = model<IPlaylist, PlaylistModel>('Playlist',playlistSchema)

export {MPlaylist}