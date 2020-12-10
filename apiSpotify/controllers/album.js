'user strict'
var fs = require('fs'); //sistema de ficheros
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    //populate : obtiene el objeto entero de albun y ademas debe coger el objeto entero de artista  
    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!album) {
                res.status(404).send({ message: 'El album no existe.' });
            } else {
                res.status(200).send({ album });
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if (!artistId) {
        //sacar todos los albums de la base de datos
        var find = Album.find({}).sort('title');
    } else {
        //sacar los albums de un artista
        var find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!albums) {
                res.status(404).send({ message: 'No hay albums' });
            } else {
                res.status(200).send({ albums });
            }
        }
    });



}


function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el Album' });
        } else {
            if (!albumStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado' });
            } else {
                res.status(200).send({ album: albumStored });
            }
        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el Album' });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: 'No se ha actualizado el album' });
            } else {
                res.status(200).send({ album: albumUpdated, });
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    //Eliminar album como si fuese en escalado
    Album.findByIdAndRemove( albumId,(err, albumRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al borrar el Album' });
        } else {
            if (!albumRemoved) {
                res.status(404).send({ message: 'El Album no ha sido eliminado' });

            } else {
                //Eliminar las canciones que hay asociadas
                Song.find({ artist: albumRemoved._id }).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al borrar la Canción' });
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({ message: 'La canción no ha sido eliminado' });

                        } else {
                            res.status(200).send({ album: albumRemoved });
                        }
                    }
                });
            }
        }
    });

}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == "png" || file_ext == 'jpg' || file_ext == 'gif') {

            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdate) => {
                if (!albumUpdate) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario usuario' });
                } else {
                    res.status(200).send({ album: albumUpdate });

                    var file_path = './uploads/albums/' + albumUpdate.image;
                    try {
                        fs.unlinkSync(file_path);//borrar fichero antiguo
                    } catch (err) {
                        //console.error(err)
                    }
                }
            });

        } else {
            res.status(200).send({ message: 'Extensión del archivo no es válida' });
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna imagen' });

    }
}



function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));

        } else {
            res.status(200).send({ message: 'No existe la imagen' });

        }
    });
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile,
}