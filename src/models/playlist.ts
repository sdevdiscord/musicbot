import {Schema, Types, model,ObjectId} from "mongoose";

export interface IPlaylist {
    name: string;
    public: boolean;
    tracks: Types.Array<ObjectId>;
}

const playlistSchema = new Schema<IPlaylist>({
    name: { type: String, required: true },
    public: { type: Boolean, required: false, default: false },
    tracks: { type: [{type: Schema.Types.ObjectId, ref: "Track"}], required: false, default: [] }
})

const MPlaylist = model<IPlaylist>('Playlist',playlistSchema)

export {MPlaylist}