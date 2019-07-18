const logger = require('pino')
const moment = require('moment')

//For capturing the information in the logger.
let captureError = (errorMessage, errorOrigin, errorLevel) => {
    let currentTime = moment();
    let errorResponse = {
        timestamp : currentTime,
        errorMessage : errorMessage,
        errorOrigin : errorOrigin,
        errorLevel : errorLevel
    }
    logger.error(errorResponse);
    return errorResponse;
} //End capturing the information in the logger.

let captureInfo = (message, origin, importance) =>{
    let currentTime = moment();
    let infoMessage = {
        timestamp : currentTime,
        message : message,
        origin : origin,
        importance : importance
    };
    logger.info(infoMessage);
    return infoMessage;
}

//Exporting the module
module.exports = {
    captureError : captureError,
    captureInfo : captureInfo
}//End exporting the module