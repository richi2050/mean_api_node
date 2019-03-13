'use strict'
const express = require('express');
const bodyParser = require('body-parser');
var app = express();

const UserRoutes = require('./routes/User');
const ArtistRoutes = require('./routes/Artist');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configuracion de las cabeceras

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Ruta base
app.use('/api', UserRoutes);
app.use('/api', ArtistRoutes);


app.get('/prueba', (req, res) =>{
    console.log('esta es la de prueba');
    res.status(200).send('Hola');
});

module.exports = app;