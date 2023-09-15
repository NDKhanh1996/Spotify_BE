import {Schema, model} from "mongoose";

interface IPlaylistLikeCounts {
    playlist: object;
    user: object;
}

const playlistLikeCountsSchema = new Schema<IPlaylistLikeCounts>({
    playlist: {type: Schema.Types.ObjectId, ref: 'Playlists'},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
});

export const PlaylistLikeCounts = model<IPlaylistLikeCounts>('PlaylistLikeCounts', playlistLikeCountsSchema, 'playlistLikeCounts');