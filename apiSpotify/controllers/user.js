'user strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../service/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una acción del controlador de usuario con Node y Mongo'
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        //encriptar contraseña y guaradar datos
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;

            if (user.name != null && user.surname != null && user.email != null) {
                //guar usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar usuario' });
                    } else {
                        if (!user) {
                            res.status(404).send({ message: 'No se ha registrado el usuario usuario' });

                        } else {
                            res.status(200).send({ user: userStored });

                        }

                    }
                });

            } else {
                res.status(200).send({ message: 'Rellana todos los campos' });

            }
        })

    } else {
        res.status(200).send({ message: 'Introduce la contraseña' });
    }
}


function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!user) {
                res.status(404).send({ message: 'El usuario no existe' });

            } else {
                //si existe el usuario comprobamos contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        if (params.gethash) {
                            //devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)

                            })

                        } else {
                            res.status(200).send({ user });

                        }
                    } else {
                        res.status(404).send({ message: 'Correo o contraseña incorrecta' });

                    }
                });
            }
        }
    });

}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body.image;
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdate) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario usuario' });
            } else {
                res.status(200).send({ user: userUpdate }); //el usuario antes de actualizarse
            }
        }
    });
}


function uploadImage(req, res) {
    var userId = req.params.id;

    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;

        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == "png" || file_ext == 'jpg' || file_ext == 'gif') {

            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdate) => {

                if (!userUpdate) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario usuario' });
                } else {
                    res.status(200).send({
                        image: file_name,
                        user: userUpdate
                    });

                    var file_path = './uploads/users/' + userUpdate.image;

                    try {
                        fs.unlinkSync(file_path);//borrar fichero antiguo
                    } catch (err) {
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
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,

};