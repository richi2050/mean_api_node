'use strict'

var mongoose = require('mongoose');
var app = require('./app');
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin123@ds157735.mlab.com:57735/mibase',{ useNewUrlParser: true },(err, res) =>{
    if(err){
        throw err;
    }else{
        console.log('Conexion exitosa');
    }
});
app.listen(port , () => {
    console.log('El Servicio se esta realizando en http://localhost:'+port);
});
