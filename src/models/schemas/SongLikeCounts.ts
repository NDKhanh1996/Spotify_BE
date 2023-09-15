import {Schema, model} from "mongoose";

interface ISongLikeCounts {
    song: object;
    user: object;
}

const songLikeCountsSchema = new Schema<ISongLikeCounts>({
    song: {type: Schema.Types.ObjectId, ref: 'Songs'},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
});

export const SongLikeCounts = model<ISongLikeCounts>('SongLikeCounts', songLikeCountsSchema, 'songLikeCounts');