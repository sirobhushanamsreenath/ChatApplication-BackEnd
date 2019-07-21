const fs = require('fs');
const errorHandler = require('./app/middlewares/appErrorHandler');
const express = require('express');
const apiConfig = require('./config/appConfig');
const bodyParser = require('body-parser');
const routeLogger = require('./app/middlewares/routeLogger');
const logger = require('./app/libraries/responseLib');
const helmet = require('helmet');
const mongoose = require('mongoose');


let app = express();

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(routeLogger.logIp);
app.use(helmet());

//Bootstrap Models
let modelPath = './app/models';
fs.readdirSync(modelPath).forEach(function(file){
    if(~file.indexOf('js')){
        require(modelPath+'/'+file);
    }
});
//End Bootstrap Models

//Bootstrap Routes
let routePath = './app/routes';
fs.readdirSync(routePath).forEach(function(file){
    if(~file.indexOf('js')){
        let route = require(routePath+'/'+file);
        route.setRouter(app);
    }
});
//End Bootstrap Routes

//calling 404 not found hander
app.use(errorHandler.globalNotFoundHandler);
//end calling 404 not found handler

//Handling connection error
mongoose.connection.on('error', function(err){
    logger.generate(true, 502, err,null);
});

mongoose.connection.on('open', function(err){
    if(err){
        logger.generate(true,502, err,null);
    } else{
        logger.generate(false,200,'database connected successfully',null);
    }
});

//listen to server
app.listen(apiConfig.port, () =>{
    console.log('Example app is listening on port 3000!');
    let db = mongoose.connect(apiConfig.db.uri,{useNewUrlParser: true});
})//end listening to the server
