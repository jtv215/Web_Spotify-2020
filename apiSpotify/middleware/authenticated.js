'use strict'
var jwt = require('jwt-simple');
var moment = require('moment'); //libreria para fechas de expiración
var secret = "clave_secreta";

//Se va a ejecutar antes de que llegue al controlador.
exports.ensureAuth = function (req, res, next) {

    if (!req.headers.authorization) {       
        return res.status(403).send({ message: 'La petición no tiene la cabecera de autenticación' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
     //Cuando el token llega con comillas dobles o simpleas las quitas

    try {       
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix() ) { //si ha expirado el token que se vuelva a logear
            return res.status(401).send({ message: 'El token ha expirado' });
        }

    } catch (ex) {
        return res.status(404).send({ message: 'El token no es válido' });
    }

    req.user = payload;
    next();
}