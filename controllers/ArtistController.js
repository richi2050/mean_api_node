'use strict'

const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');

function getArtist(req, res){
    const artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status().send({ message : 'error en la petición'});
        }else{
            if(!artist){
                res.status(404).send({ message: 'El arista no existe'});
            }else{
                res.status(200).send(artist);
            }
        }
    });
}

function getArtists(req, res){
    var page = 0;
    if(req.params.page){
        page = req.params.page;
    }else{
        page = 1;
    }
    const itemsPerPage = 5;
    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: 'Error en la petición.'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No Hay Artistas' });
            }else{
                return res.status(200).send({
                    total_items:total,
                    artists: artists
                });
            }
        }
    });
}
function saveArtist(req, res){
    const artist = new Artist();
    
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({ message: 'Error al guardar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({ message: 'El artista no a sido guardado' });
            }else{
                res.status(200).send(artistStored);
            }
        }
    });
    
}
module.exports = {
    getArtist,
    saveArtist,
    getArtists
}