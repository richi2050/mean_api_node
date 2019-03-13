'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta';

exports.createToken = function(user){
    const payload ={
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), // Fecha de creacion del Token, unix() saca la fecha en timestap actual
        exp: moment().add(30,'days').unix() //Fecha de Expiracion y se da el formato unix
    };
    return jwt.encode(payload, secret);
};
