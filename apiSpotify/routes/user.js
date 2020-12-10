'use strict'
var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router();
var mdAuth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/probando-controlador', mdAuth.ensureAuth, UserController.pruebas);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [mdAuth.ensureAuth, md_upload], UserController.uploadImage);
//Segundo middleware: md_upload para subir la imagen y usar los file y recoger los ficheros
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;