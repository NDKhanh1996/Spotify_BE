import express from "express";
import userController from "../../controllers/userController/user.controller";
import {Security} from "../../security/security";
import {NotifyController} from "../../controllers/notifyController/notify.controller";

const userRouter = express.Router();

userRouter.get('/songs/:id', userController.getOneSong);
userRouter.get('/songs/:songId/comments', userController.showCommentInSong);

userRouter.use(Security.verifyToken);

userRouter.post('/songs', userController.addSong);
userRouter.post('/playlists/:playlistId/songs', userController.addSongToPlaylist);
userRouter.delete('/playlists/:playlistId/songs/:songId', userController.removeSongFromPlaylist);
userRouter.post('/songs/:songId/comments', userController.commentOnSong);
userRouter.post('/playlists/:playlistId/comments', userController.commentOnPlaylist);
userRouter.delete('/comments/:commentId', userController.deleteComment);
userRouter.get('/songs', userController.getSongs);
userRouter.patch('/songs/:id/like', userController.likeSong);
userRouter.patch('/songs/:id/dislike/', userController.dislikeSong);
userRouter.patch('/playlists/:id/like', userController.likePlaylist);
userRouter.patch('/playlists/:id/dislike', userController.dislikePlaylist);
userRouter.get('/details', userController.getDetail);
userRouter.get('/playlists', userController.getPlayList);
userRouter.get('/playlists/:playlistId/songs', userController.getSongInPlaylist);
userRouter.get('/search/songs', userController.searchSong);
userRouter.put('/password', userController.editPassword);
userRouter.put('/info', userController.editInfo);
userRouter.delete('/songs', userController.deleteSong);
userRouter.post('/playlists', userController.createPlaylist)
userRouter.delete('/playlists', userController.deletePlaylist)
userRouter.put('/playlists', userController.editPlayList)
userRouter.put('/songs/update-state', userController.updateSongState);
userRouter.put('/songs', userController.editSong);

userRouter.patch('/notifications/:id/seen', NotifyController.changeToSeen)
export default userRouter;