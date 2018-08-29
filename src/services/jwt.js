'use stric'
//generamos un token a traves de u n modulo

const jwt = require('jwt-simple');

const moment = require('moment');

const secret = 'clave_secreta_solo_la_se_yo_porq_soy_la_programadora_de_esta_api';

exports.createToken = function (user) {
    let payload = {
        sub: user._id, //identificador del documento
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        //fecha de creacion del token
        iat: moment().unix(),
        //tiempo de vida del token
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);

};
