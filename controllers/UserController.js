'use strict'
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

function prueba(req, res){
    res.status(200).send({
        message: "probando la conexion"
    });
}

function saveUser(req, res){
    const user = new User();
    const params  = req.body;
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'NULL';
    if(params.password){
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                user.save((err, userStorage) => {
                    if(err){
                        res.status(500).send(err.message);
                    }else{
                        if(!userStorage){
                            res.status(404).send({ message : "Ocurrio un error al guardar el Usuario !!!"});
                        }else{
                            res.status(200).send(userStorage);
                        }
                        res.status(200).send();
                    }
                });

            }else{
                res.status(200).send({ message: 'Ingresa todos los campos !!!!'});
            }
        });
    }else {
        res.status(200).send({ message : 'Ingresa contsraeña'});
    }
}

function loginUser(req, res){
    const {email, password, gethash } = req.body;
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message : 'Error en la peticion'});
        }else{
            if(!user){
                res.status(404).send({ message: 'Elusuario no existe'});
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        if(gethash){
                            res.status(200).send({token: jwt.createToken(user) })

                        }else{
                            res.status(200).send(user);
                        }
                    }else{
                        res.status(404).send({ message: 'Ingresa Correctamente la Contraseña'});
                    }
                });

            }

        }

    });


}

function updateUser(req, res){
    var userId = req.params.id;
    var update= req.body;
    User.findByIdAndUpdate(userId,update, (err, userUpdate) =>{
        if(err){
            res.status(500).send({ message: "Error a Actualizar a usuario"});
        }else{
            if(!userUpdate){
                res.status(404).send({message: "No se a podido Actualizar Usuario"});
            }else{
                res.status(200).send({ message: userUpdate});
            }
        }
    });
}

function uploadImage(req, res){
    const userId = req.params.id;
    const file_name ="No subido ............";
    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId,{image: file_name}, (err, userUpdate) => {
                if(!userUpdate){
                    res.status(404).send({ message: 'No se puede actualizar el usurio'});
                }else{
                    res.status(200).send({ image: file_name, user: userUpdate});
                }
            });
        }else{
            res.status(200).send({ message: 'Extensión del archivo no valida'});
        }

        console.log(file_path);
    }else{
        res.status(200).send({ message: 'No se  a subido la imagen'});
    }
}

function getImageFile(req, res){
    const imageFile = req.params.imageFile;
    const path_file = './uploads/users/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen ......' });
        }
    });

}

module.exports = {
    prueba,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};