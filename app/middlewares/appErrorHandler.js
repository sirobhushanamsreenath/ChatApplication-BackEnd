const response = require('./../libraries/responseLib');
const logger = require('./../libraries/loggerInfo');
//Example for Error handling middleware
// implementing errorHandler
let globalErrorHandler = (err, req, res, next) => {
  logger.captureError(err.message, 'globalErrorHandler', 8);
  console.log(err);
  let apiResponse = response.generate(
    true,
    'Some error occured at Global level',
    500,
    null
  );
  res.send(apiResponse);
}; //end errorHandler

//implementing notFoundHandler
let globalNotFoundHandler = (req, res, next) => {
  logger.captureError(
    'Global not found handler called..',
    'globalNotFoundHandler',
    8
  );
  let apiResponse = response.generate(
    true,
    'Route not found in the application',
    500,
    null
  );
  res.status(404).send(apiResponse);
}; //end notFoundHandler

module.exports = {
  globalErrorHandler: globalErrorHandler,
  globalNotFoundHandler: globalNotFoundHandler
};
