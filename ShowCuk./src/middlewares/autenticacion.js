'use strict'

const jwt = require('jwt-simple');

const moment = require('moment');

const secret = 'clave_secreta_solo_la_se_yo_porq_soy_la_programadora_de_esta_api';

exports.ensureAuth = function (req, res, next) {
    //conprobacion de la autorizacion
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticacion' });
    }

    let token = req.headers.authorization.replace(/['"]+/g, ''); //reemplazamos las comillas por nada


    try {
        let payload = jwt.decode(token, secret);
        if (payload.exp <= moment.unix()) {
            return res.status(401).send({ message: 'El token ha expirado' });
        }
    } catch (ex) {
        return res.status(404).send({ message: 'El token no es valido' });

    }
    req.user = payload //creo una propiedad en caliente

    next();
}
