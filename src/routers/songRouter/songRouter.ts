import express from "express";
import {SongController} from "../../controllers/songController/song.controller";

const songRouter = express.Router();

songRouter.get('/playlists/:playlistId',SongController.getPlaylistPublic)
songRouter.get('/songs', SongController.getPublicSongs);
songRouter.get('/songs/search',SongController.searchSongPublic)
songRouter.post('/random-songs', SongController.getRandomSong);
songRouter.get('/singers', SongController.getSingers);
songRouter.get('/composers', SongController.getComposers);
songRouter.get('/tags', SongController.getTags);
songRouter.get('/playlists', SongController.getAllPlaylistPublic);

export default songRouter;