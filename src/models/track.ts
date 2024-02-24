import {Model, Schema, Types, model, HydratedDocument} from "mongoose";

export interface ITrack {
    _id: Types.ObjectId;

    name: string;
    url: string;
}

interface TrackModel extends Model<ITrack> {
    findByUrl(url:string): Promise<HydratedDocument<ITrack>>;
    addTrack(name:string, url:string): HydratedDocument<ITrack>;
}

const trackSchema = new Schema<ITrack, TrackModel>({
    name: { type: String, required: true },
    url: { type: String, required: true }
})

trackSchema.static('findByUrl', async function findByUrl(url: string) {
    return await this.findOne({ url }).cache().exec()
})

trackSchema.static('addTrack', function addTrack(name:string, url: string) {
    return new this({ name, url })
})

const MTrack = model<ITrack, TrackModel>('Track',trackSchema)

export {MTrack}