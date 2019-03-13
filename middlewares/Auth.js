'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La solicitud no contiene headers de autentificación'});
    }
    const token = req.headers.authorization.replace(/['"']+/g,'');
    try{
        console.log('Entra a t5ry');
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment.unix()){
            return res.status(401).send({message: 'El Token ha expirado'});
        }
    }catch(error){
        return res.status(403).send({message: 'El Token no es válido'});
    }
    req.user = payload;
    next();
};
