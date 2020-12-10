'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave_secreta"

exports.createToken = function (user) {
    var payload = {
        sub: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //saca fecha actual     
        exp: moment().add(30, 'days').unix() // 30 dias para expiración
    };

     return jwt.encode(payload, secret); //codifca toda la información
}