'use strict'
const express = require('express');
const bodyParser = require('body-parser');
var app = express();

const UserRoutes = require('./routes/User');
const ArtistRoutes = require('./routes/Artist');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configuracion de las cabeceras

//Ruta base
app.use('/api', UserRoutes);
app.use('/api', ArtistRoutes);


app.get('/prueba', (req, res) =>{
    console.log('esta es la de prueba');
    res.status(200).send('Hola');
});

module.exports = app;