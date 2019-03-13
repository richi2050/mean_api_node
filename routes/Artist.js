'use strict'
const express = require('express');
const ArtistController = require('../controllers/ArtistController');
const middleware= require('../middlewares/Auth');
const api = express.Router();
const multipart = require('connect-multiparty');
const middlewareUpload = multipart({uploadDir: './uploads/artist'});

api.get('/artists/:page?',middleware.ensureAuth,ArtistController.getArtists);
api.get('/artist/:id',middleware.ensureAuth,ArtistController.getArtist);
api.post('/artist',middleware.ensureAuth,ArtistController.saveArtist);
api.put('/artist/:id',middleware.ensureAuth,ArtistController.updateArtist);
api.delete('/artist/:id',middleware.ensureAuth,ArtistController.deleteArtist);

api.post('/update-image-artist/:id', [middleware.ensureAuth, middlewareUpload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;