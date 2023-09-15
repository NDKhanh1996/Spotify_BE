import {Schema, model} from "mongoose";

interface ISongs {
    songName: string;
    description: string;
    fileURL: string;
    avatar: string;
    uploadTime: Date;
    singers: object[];
    composers: object[];
    tags: object[];
    uploader: object;
    isPublic: boolean;
    songLikeCounts: object[];
}

const songSchema = new Schema<ISongs>({
    songName: String,
    description: String,
    fileURL: String,
    avatar: String,
    uploadTime: {type: Date, default: Date.now},
    singers: [{type: Schema.Types.ObjectId, ref: 'Singers'}],
    composers: [{type: Schema.Types.ObjectId, ref: 'Composers'}],
    tags: [{type: Schema.Types.ObjectId, ref: 'Tags'}],
    uploader: {type: Schema.Types.ObjectId, ref: 'Users'},
    isPublic: Boolean,
    songLikeCounts: [{type: Schema.Types.ObjectId, ref: 'SongLikeCounts'}],
});
export const Songs = model<ISongs>('Songs', songSchema, 'songs');