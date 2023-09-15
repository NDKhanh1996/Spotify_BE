import { Songs } from "../../models/schemas/Songs";
import { Users } from "../../models/schemas/Users";
import { Playlists } from "../../models/schemas/Playlists";
import bcrypt from "bcrypt";
import {Singers} from '../../models/schemas/Singers';
import {Composers} from '../../models/schemas/Composers';
import {Tags} from '../../models/schemas/Tags';
import {Comments} from "../../models/schemas/Comments";
import {SongLikeCounts} from "../../models/schemas/SongLikeCounts";
import {PlaylistLikeCounts} from "../../models/schemas/PlaylistLikeCounts";
import {NotifyController} from "../notifyController/notify.controller";

class UserController {
    static async addSong(req, res) {
        try {
            let {
                songName,
                description,
                fileURL,
                avatar,
                singers,
                composers,
                tags,
                uploader,
                isPublic
            }
                = req.body;
            let existingSong = await Songs.find({songName, uploader})
            if (existingSong.length > 0) {
                res.status(409).json({status: "failed", message: "Song already existed"})
            } else {
                let song = new Songs(req.body)
                await song.save()
                res.status(200).json({status: "succeeded", message: "Song added", song: song})
            }
        } catch (e) {
            res.status(404).json({status: "failed", message: e.message})
        }
    }

    static async editSong(req, res) {
        try {
            const {
                _id, songName,
                description,
                fileURL,
                avatar,
                uploadTime,
                singers,
                composers,
                tags,
                uploader,
                isPublic
            } = req.body
            const song = await Songs.findOne({_id, uploader});
            if (!song) {
                const data = {
                    status: "failed",
                    message: 'Song does not exist!',
                }
                return res.status(404).json(data);
            }
            const userId = req.user.id;
            const uploaderId = song.uploader.toString();
            if (userId !== uploaderId) {
                const data = {
                    status: "failed",
                    message: 'This song does not belong to you!',
                }
                return res.status(403).json(data);
            }
            const updatedSong = await Songs.findOneAndUpdate(
                {_id: song._id},
                {
                    $set: {
                        songName,
                        description,
                        fileURL,
                        avatar,
                        uploadTime,
                        singers,
                        composers,
                        tags,
                        uploader,
                        isPublic
                    }
                },
                {new: true})
            res.status(200).json({status: "succeeded", song: updatedSong})
        } catch (err) {
            res.status(404).json({status: "failed", message: " err.message"});
        }
    }

    static async deleteSong(req, res) {
        try {
            const song = await Songs.findOne({_id: req.body._id});
            const userId = req.user.id;
            if (!song) {
                const data = {
                    status: "failed",
                    message: 'Song does not exist!',
                }
                return res.status(404).json(data);
            }
            const uploaderId = song.uploader.toString();
            if (userId !== uploaderId) {
                const data = {
                    status: "failed",
                    message: 'This song does not belong to you!',
                }
                return res.status(403).json(data);
            }
            await Songs.deleteOne({_id: song._id});
            return res.status(200).json({
                status: "succeeded",
                message: 'The song has been deleted!'
            })
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async getSongs(req, res) {
        try {
            const userId = req.user.id;
            let songs = await
                Songs.find({uploader: userId})
                    .sort({uploadTime: -1})
                    .populate({path: 'singers', model: Singers})
                    .populate({path: 'composers', model: Composers})
                    .populate({path: 'tags', model: Tags})
            ;
            if (songs.length > 0) {
                res.status(200).json({
                    status: 'succeeded',
                    songs: songs,
                });
            } else {
                res.status(200).json({
                    status: 'succeeded',
                    songs: [],
                    message: 'No data',
                });
            }
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async getDetail(req, res) {
        try {
            let user = await Users.findOne({_id: req.body.id})
            if (!user) {
                res.status(404).json({
                    status: "failed",
                    message: "User does not Exist"
                })
            } else {
                res.status(200).json({
                    status: "succeeded",
                    user: user
                })
            }
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async editPassword(req, res) {
        try {
            const user = await Users.findOne({_id: req.body.id});
            const {oldpassword, newpassword, newpasswordconfirm} = req.body;
            if (!user) {
                const data = {
                    status: "failed",
                    message: 'User does not exist!'
                }
                return res.json(data);
            }
            const isPasswordValid = await bcrypt.compare(oldpassword, user.password);
            if (!isPasswordValid) {
                const data = {
                    status: "failed",
                    message: 'Incorrect password!'
                }
                return res.json(data);
            }
            if (newpassword !== newpasswordconfirm) {
                const data = {
                    status: "failed",
                    message: "Incorrect password confirm!"
                }
                return res.json(data)
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
            user.password = hashedPassword
            await user.save()
            res.status(200).json({
                status: "succeeded",
                newPassword: user.password
            })
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async editInfo(req, res) {
        const user = await Users.findOne({_id: req.body.id});
        const {firstName, lastName, phoneNumber, gender, avatar} = req.body;
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: 'User does not exist!'
            });
        } else {
            user.firstName = firstName
            user.lastName = lastName
            user.phoneNumber = phoneNumber
            user.gender = gender
            user.avatar = avatar
            await user.save()
            res.status(200).json({
                status: "succeeded",
                userEdited: user
            })
        }
    }

    static async getOneSong(req, res) {
        try {
            let songId = req.params.id;
            let song = await Songs.findOne({_id: songId})
                .populate({path: 'singers', model: Singers})
                .populate({path: 'composers', model: Composers})
                .populate({path: 'tags', model: Tags})
                .populate({path: 'songLikeCounts', model: SongLikeCounts})
            if (song) {
                res.status(200).json({
                    status: 'succeeded',
                    song: song
                })
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'No data'
                });
            }
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async createPlaylist(req, res) {
        try {
            let user = await Users.findOne({_id: req.user.id})

            let newPlayList = new Playlists({
                uploader: req.user.id,
                playlistName: req.body.playlistName,
                avatar: req.body.avatar,
                description: req.body.description,
            })
            await newPlayList.save()
            user.playlist.push(newPlayList._id)
            await user.save()
            res.status(200).json({
                status: 'succeeded',
                message: "add playlist success"
            })
        } catch (err) {
            res.status(404).json({status: "failed", message: err.message});
        }
    }

    static async getPlayList(req: any, res: any) {
        try {
            const userId = req.user.id;
            const userWithPlaylist = await Users.findById(userId)
                .populate({
                    path: 'playlist', model: Playlists, populate: {
                        path: 'songs',
                        model: Songs
                    }
                });
            const playlist = userWithPlaylist.playlist;
            res.status(200).json({data: playlist});
        } catch (error) {
            res.status(404).json({message: "This user dont have any playlist"});
        }
    }

    static async getSongInPlaylist(req: any, res: any) {
        try {
            const playlistId = req.params["playlistId"];
            const playlist = await Playlists.findById(playlistId)
                .populate({
                    path: 'songs', model: Songs, match: {
                        isPublic: true,
                    }, populate: {
                        path: 'singers',
                        model: Singers,
                    },
                })
                .populate({path: 'playlistLikeCounts', model: PlaylistLikeCounts});
            res.status(200).json({playlist: playlist});
        } catch (e) {
            res.status(404).json({message: "Can not find playlist"});
        }
    }

    static async searchSong(req: any, res: any) {
        try {
            const songName = req.query.name;
            if (songName) {
                const foundSongs = await Songs.find({
                    songName: {$regex: new RegExp(songName, 'i')},
                    isPublic: true
                }).populate({path: 'singers', model: Singers});

                res.status(200).json(foundSongs);
            } else {
                res.status(200).json('');
            }
        } catch (e) {
            res.status(404).json({message: e})
        }
    }

    static async addSongToPlaylist(req: any, res: any) {
        try {
            const songId = req.body['songId'];
            const playlistId = req.params["playlistId"];

            const playlist = await Playlists.findById(playlistId);

            if (playlist) {
                const songExists = playlist.songs.some(existingSongId => existingSongId.toString() === songId);

                if (!songExists) {
                    playlist.songs.push(songId);
                    await playlist.save();
                }
            }

            res.status(200).json({message: "Song added to playlist successfully"});
        } catch (e) {
            res.status(500).json({message: "Error adding song to playlist"});
        }
    }

    static async removeSongFromPlaylist(req: any, res: any) {
        try {
            const {playlistId, songId} = req.params;
            const playlist = await Playlists.findById(playlistId);

            if (playlist) {
                const updatedSongs = playlist.songs.filter(existingSongId => existingSongId.toString() !== songId);

                if (updatedSongs.length !== playlist.songs.length) {
                    playlist.songs = updatedSongs;
                    await playlist.save();
                    res.status(200).json({message: "Song removed from playlist successfully"});
                } else {
                    res.status(404).json({message: "Song not found in playlist"});
                }
            } else {
                res.status(404).json({message: "Playlist not found"});
            }
        } catch (e) {
            res.status(500).json({message: "Error removing song from playlist"});
        }
    }

    static async deletePlaylist(req, res) {
        try {
            const playlist = await Playlists.findOne({_id: req.body._id})
            const user = await Users.findOne({_id: req.user.id})
            if (!playlist) {
                const data = {
                    status: "failed",
                    message: 'Playlist does not exist!',
                }
                return res.status(404).json(data);
            }
            if (user) {
                await Playlists.deleteOne({_id: playlist._id})
                user.playlist = user.playlist.filter(e => e !== playlist._id)
                await user.save()
                res.status(200).json({
                    status: "success",
                    message: "delete success"
                })
            } else {

                res.status(401).json({
                    status: "failed",
                    message: "you have not permission to delete"
                })
            }
        } catch (err) {
            res.status(401).json({status: "failed", message: err.message});
        }
    }

    static async editPlayList(req, res) {
        try {
            const playlist = await Playlists.findOne({_id: req.body._id})

            if (!playlist) {
                const data = {
                    status: "failed",
                    message: 'Playlist does not exist!',
                }
                return res.status(404).json(data);
            } else {
                playlist.playlistName = req.body.playlistName
                playlist.description = req.body.description
                playlist.avatar = req.body.avatar
                playlist.uploadTime = new Date()
                await playlist.save()
                res.status(200).json({
                    status: "success",
                    message: "edit success"
                })
            }
        } catch (err) {
            res.status(401).json({status: "failed", message: err.message});
        }
    }

    static async updateSongState(req, res) {
        try {
            const {songId, isPublic} = req.body;
            const song = await Songs.findOne({_id: songId});
            if (!song) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Song not found'
                });
            }
            song.isPublic = (isPublic == 1);
            await song.save();
            return res.status(200).json({
                status: 'succeeded',
                message: 'Song state updated successfully',
                song: song,
            });
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                message: err.message
            });
        }
    }

    static async showCommentInSong(req: any, res: any) {
        try {
            const songId = req.params["songId"];
            const allComment = await Comments.find({song: songId})
                .populate({path: 'user', model: Users});
            res.status(200).json({message: "get song complete", allComment: allComment})
        } catch (e) {
            res.status(500).json({
                status: 'failed',
                message: e.message
            });
        }

    }

    static async commentOnSong(req: any, res: any) {
        try {
            const userId = req.user.id;
            const songId = req.params["songId"];
            const song = await Songs.findById(songId);
            const user = await Users.findById(userId);
            const content = req.body.comment

            if (!song) {
                return res.status(404).json({message: 'Song not found'});
            }

            const formattedDate = new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const comment = await Comments.create({
                song: song,
                user: user,
                uploadTime: formattedDate,
                content: content
            });

            const notify = await NotifyController.createNotify("Songs", null, song, "comment", req);

            res.status(201).json({ message: 'Comment created successfully', comment: comment, notify: notify });
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                message: err.message
            });
        }
    }

    static async deleteComment(req: any, res: any) {
        try {
            const commentId = req.params["commentId"];
            await Comments.deleteOne({_id: commentId});
            res.status(200).json({message: "delete comment complete"})
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                message: err.message
            });
        }
    }

    static async commentOnPlaylist(req: any, res: any) {
        try {
            const userId = req.user.id;
            const playlistId = req.params["playlistId"];
            const playlist = await Playlists.findById(playlistId);
            const user = await Users.findById(userId);
            const content = req.body.comment

            if (!playlist) {
                return res.status(404).json({message: 'Song not found'});
            }

            const formattedDate = new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const comment = await Comments.create({
                playlist: playlist,
                user: user,
                uploadTime: formattedDate,
                content: content
            });

            const notify = await NotifyController.createNotify("Playlists", playlist, null, "comment", req);

            res.status(201).json({ message: 'Comment created successfully', comment: comment, notify: notify });
        } catch (err) {
            res.status(500).json({
                status: 'failed',
                message: err.message
            });
        }
    }

    static async likeSong(req: any, res: any) {
        try {
            const userId = req.user.id;
            const songId = req.params.id;

            const existingLike = await SongLikeCounts.findOne({song: songId, user: userId});

            if (!existingLike) {
                const song = await Songs.findById(songId);
                const user = await Users.findById(userId);

                const songLikeCounts = await SongLikeCounts.create({
                    song: song,
                    user: user,
                });

                song.songLikeCounts.push(songLikeCounts);
                user.songLikeCounts.push(songLikeCounts);

                await song.save();
                await user.save();

                const notify = await NotifyController.createNotify("Songs", null, song, "like", req);

                res.status(201).json({message: 'Song like successfully'});
            } else {
                return res.status(400).json({message: 'Song like already'});
            }
        } catch (e) {
            res.status(500).json({
                status: 'likeSong failed',
                message: e.message
            });
        }
    }

    static async dislikeSong(req: any, res: any) {
        try {
            const userId = req.user.id;
            const songId = req.params["id"];
            const dislike = await SongLikeCounts.findOne({user: userId, song: songId});
            await dislike.deleteOne();

            await Users.findByIdAndUpdate(userId, {
                $pull: {songLikeCounts: dislike._id}
            });

            await Songs.findByIdAndUpdate(songId, {
                $pull: {songLikeCounts: dislike._id}
            })

            res.status(200).json({message: "dislike song success"});
        } catch (e) {
            res.status(500).json({
                status: 'dislike Song failed',
                message: e.message
            });
        }
    }

    static async likePlaylist(req: any, res: any) {
        try {
            const userId = req.user.id;
            const playlistId = req.params.id;

            const existingPlaylist = await PlaylistLikeCounts.findOne({playlist: playlistId, user: userId});

            if (!existingPlaylist) {
                const playlist = await Playlists.findById(playlistId);
                const user = await Users.findById(userId);

                const playlistLikeCounts = await PlaylistLikeCounts.create({
                    playlist: playlist,
                    user: user,
                });

                playlist.playlistLikeCounts.push(playlistLikeCounts);
                user.playlistLikeCounts.push(playlistLikeCounts);

                await playlist.save();
                await user.save();

                const notify = await NotifyController.createNotify("Playlists", playlist, null, "like", req);

                res.status(201).json({message: 'Playlist like successfully'});
            } else {
                return res.status(400).json({message: 'Playlist like already'});
            }
        } catch (e) {
            res.status(500).json({
                status: 'Like playlist failed',
                message: e.message
            });
        }
    }

    static async dislikePlaylist(req: any, res: any) {
        try {
            const userId = req.user.id;
            const playlistId = req.params["id"];

            const dislike = await PlaylistLikeCounts.findOne({user: userId, playlist: playlistId});
            await dislike.deleteOne();

            await Users.findByIdAndUpdate(userId, {
                $pull: {playlistLikeCounts: dislike._id}
            });

            await Playlists.findByIdAndUpdate(playlistId, {
                $pull: {playlistLikeCounts: dislike._id}
            })

            res.status(200).json({message: "dislike playlist success"});
        } catch (e) {
            res.status(500).json({
                status: 'Dislike playlist failed',
                message: e.message
            });
        }
    }
}

export default UserController