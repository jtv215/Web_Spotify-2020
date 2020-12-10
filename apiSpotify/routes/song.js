'use strict'
var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var mdAuth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song/:id', mdAuth.ensureAuth, SongController.getSong);
api.post('/song', mdAuth.ensureAuth, SongController.saveSong);
api.get('/songs/:id?', mdAuth.ensureAuth, SongController.getSongs);
api.put('/song/:id', mdAuth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', mdAuth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [mdAuth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-file-song/:songFile', SongController.getSongFile);

module.exports = api;