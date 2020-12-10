'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    role: String,
    artist: {type:Schema.ObjectId, ref:'Artist'}
    //guarda el id de un objeto de la base de datos por eso se pone type 
    //ref es la referencia para relacionarlo
})

module.exports = mongoose.model('Album',AlbumSchema);