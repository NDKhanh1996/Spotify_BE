import {Schema, model} from "mongoose";

export interface IComments {
    playlist:object
    song: object;
    user: object;
    uploadTime: string;
    content: string;
}

const commentSchema = new Schema<IComments>({
    playlist:{type: Schema.Types.ObjectId, ref: 'Playlists'},
    song: {type: Schema.Types.ObjectId, ref: 'Songs'},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    uploadTime: String,
    content: String
});

export const Comments = model<IComments>('Comments', commentSchema, 'comments');