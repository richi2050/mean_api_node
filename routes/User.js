'use strict'
const express = require('express');
const UserController = require('../controllers/UserController');
const middleware= require('../middlewares/Auth');
const api = express.Router();
const multipart = require('connect-multiparty');
const middlewareUpload = multipart({uploadDir: './uploads/users'});

api.get('/probando-controlador', middleware.ensureAuth,UserController.prueba);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id', middleware.ensureAuth, UserController.updateUser);
api.post('/update-image-user/:id', [middleware.ensureAuth, middlewareUpload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;