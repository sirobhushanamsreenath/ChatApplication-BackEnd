const fs = require('fs');
const errorHandler = require('./app/middlewares/appErrorHandler');
const express = require('express');
const apiConfig = require('./config/appConfig');
const bodyParser = require('body-parser');
const routeLogger = require('./app/middlewares/routeLogger');
const response = require('./app/libraries/responseLib');
const logger = require('./app/libraries/loggerInfo');
const helmet = require('helmet');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');


let app = express();

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(routeLogger.logIp);
app.use(helmet());
// app.use(errorHandler.globalErrorHandler);
app.use(express.static(path.join(__dirname, 'client')));

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

/**
 * Create HTTP Server
 */
const server = http.createServer(app);
server.listen(apiConfig.port);
server.on('error', onError);
server.on('listening', onListening);

//Socket io connection handler
const socketLib = require('./app/libraries/socketLib');
const socketServer = socketLib.setServer(server);
//End Socket io connection handler

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
      logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
      throw error;
    }
  
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
        process.exit(1);
        break;
      default:
        logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    ('Listening on ' + bind);
    logger.captureInfo('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
    let db = mongoose.connect(apiConfig.db.uri,{useNewUrlParser: true});
  }
  
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });

//Handling connection error
mongoose.connection.on('error', function(err){
    response.generate(true, 502, err,null);
});

mongoose.connection.on('open', function(err){
    if(err){
        response.generate(true,502, err,null);
    } else{
        response.generate(false,200,'database connected successfully',null);
    }
});

// // listen to server
// app.listen(apiConfig.port, () =>{
//     console.log('Example app is listening on port 3000!');
//     let db = mongoose.connect(apiConfig.db.uri,{useNewUrlParser: true});
// })//end listening to the server
