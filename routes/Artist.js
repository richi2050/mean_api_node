'use strict'
const express = require('express');
const ArtistController = require('../controllers/ArtistController');
const middleware= require('../middlewares/Auth');
const api = express.Router();

api.get('/artist/:id',middleware.ensureAuth,ArtistController.getArtist);
api.post('/artist',middleware.ensureAuth,ArtistController.saveArtist);
api.get('/artists/:page?',middleware.ensureAuth,ArtistController.getArtists);


module.exports = api;