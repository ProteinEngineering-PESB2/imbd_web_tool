const express = require('express'); //importa el servidor
const path = require('path'); //sirve para acceder a rutas
const app = express(); //crea la variable app que es el servidor
var mongoose = require("mongoose");
const port = 5001
//settings
app.set('port', port); //setea el puerto

app.set('views', path.join(__dirname, 'views')); //deja como carpeta base 'views'

app.set('view engine', 'ejs'); //setea el motor de plantillas ejs

//middlewares
app.use(express.urlencoded({extended: false}));
//routes
app.use(require('./routes/routes')); //setea la carpeta base de rutas
//static files
app.use(express.static(path.join(__dirname, 'public'))); //setea la carpeta base de public

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/IMDb", {useNewUrlParser:true, useUnifiedTopology: true})
.then(()=>{
    app.listen(app.get('port'), () =>{ //pone el server a escucha
        console.log("server on port:", app.get('port'));
    });
}).catch(err => console.log(err));
module.exports = app;