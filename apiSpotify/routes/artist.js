'use strict'
var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();
var mdAuth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artist'});

api.get('/artist/:id', mdAuth.ensureAuth, ArtistController.getArtist);
api.post('/artist', mdAuth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', mdAuth.ensureAuth, ArtistController.getArtists);//:page? significa que puede que venga o no
api.put('/artist/:id', mdAuth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', mdAuth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [mdAuth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;