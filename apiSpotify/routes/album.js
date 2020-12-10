'use strict'
var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var mdAuth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});

api.get('/album/:id', mdAuth.ensureAuth, AlbumController.getAlbum);
api.post('/album/', mdAuth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', mdAuth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', mdAuth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', mdAuth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [mdAuth.ensureAuth, md_upload], AlbumController.uploadImage);
//Segundo middleware: md_upload para subir la imagen y usar los file y recoger los ficheros
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;