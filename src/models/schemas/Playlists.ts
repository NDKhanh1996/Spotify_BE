import { Schema, model } from "mongoose";

interface IPlaylists {
    uploader:object
    playlistName: string;
    avatar: string;
    uploadTime: Date;
    description: string;
    songs: object[],
    playlistLikeCounts: object[];
}

const playlistSchema = new Schema<IPlaylists>({
    uploader:{type:Schema.Types.ObjectId,ref:'Users'},
    playlistName: String,
    avatar: String,
    uploadTime: {type: Date, default: Date.now},
    description: String,
    songs: [{ type: Schema.Types.ObjectId, ref: 'Songs' }],
    playlistLikeCounts: [{type: Schema.Types.ObjectId, ref: 'PlaylistLikeCounts'}],
});

export const Playlists = model<IPlaylists>('Playlists', playlistSchema, 'playlists');