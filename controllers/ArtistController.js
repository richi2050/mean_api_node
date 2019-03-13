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

function updateArtist(req, res){
    var artistId = req.params.id;
    var update= req.body;
    Artist.findByIdAndUpdate(artistId, update, (err, ArtistUpdate) =>{
        if(err){
            res.status(500).send({ message: "Error a Actualizar a usuario"});
        }else{
            if(!ArtistUpdate){
                res.status(404).send({message: "No se a podido Actualizar Usuario"});
            }else{
                res.status(200).send({ message: ArtistUpdate});
            }
        }
    });
}

function deleteArtist(req, res){
    const artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) =>{
        if(err){
            res.status().send({ message: 'Error al borrar el artista'});
        }else{
            if(!artistRemoved){
                res.status(400).send({ message: 'El artista no ha sido eliminado'});
            }else{
                Album.find({ artist: artistRemoved._id}).remove((err, almbumRemoved) => {
                    if(err){
                        res.status(500).send({message: "Error al eliminar el album"});
                    }else{
                        if(!almbumRemoved){
                            res.status().send({message: "Error al eliminar el album."});
                        }else{
                            Song.find({album: almbumRemoved._id}).remove((err, songRemoved) => {
                                if(err){
                                    res.status(500).send({ message: 'Error al eliminar la cancion'});
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({message: "Error la cancion no ha sido eliminada"});
                                    }else{
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    const artistId = req.params.id;
    const file_name ="No subido ............";
    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId,{image: file_name}, (err, artistUpdate) => {
                if(!artistUpdate){
                    res.status(404).send({ message: 'No se puede actualizar el artista'});
                }else{
                    res.status(200).send({ user: artistUpdate});
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
    const path_file = './uploads/artist/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen ......' });
        }
    });

}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}