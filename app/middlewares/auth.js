const logger = require('./../libraries/loggerInfo');
// const mongoose = require("mongoose");
// console.log(typeof mongoose.model);
const authModel = require('./../models/authModel');

const response = require('./../libraries/responseLib');
const check = require('./../libraries/checkLib');
const token = require('./../libraries/tokenLib');

let isAuthorized = (req, res, next) => {
  if (
    req.params.authToken ||
    req.query.authToken ||
    req.body.authToken ||
    req.header('authToken')
  ) {
    authModel.findOne(
      {
        authToken:
          req.params.authToken ||
          req.body.authToken ||
          req.query.authToken ||
          req.header('authToken')
      },
      (err, authDetails) => {
        if (err) {
          console.log(err);
          logger.captureError(err.message, 'AuthorizationMiddleWare', 10);
          let apiResponse = response.generate(
            true,
            'Failed To Authorize',
            500,
            null
          );
          res.send(apiResponse);
        } else if (check.isEmpty(authDetails)) {
          logger.captureError(
            'User is not authorized',
            'middleWares : isAuthorized',
            5
          );
          let apiResponse = response.generate(
            true,
            'Invalid Or Expired Authorization Key',
            500,
            null
          );
          res.send(apiResponse);
        } else {
          //Verify
          token.verifyClaim(
            authDetails.authToken,
            authDetails.tokenSecret,
            (err, decoded) => {
              if (err) {
                console.log(err);
                logger.captureError(err.message, 'AuthorizationMiddleWare', 10);
                let apiResponse = response.generate(
                  true,
                  'Failed To Authorize',
                  500,
                  null
                );
                res.send(apiResponse);
              } else {
                req.user = { userId: decoded.data.userId };
                next();
              }
            }
          ); //End Verify Token
        }
      }
    );
  } else {
    logger.captureError(
      'Authorization Token Missing',
      'Authorization MiddleWare',
      5
    );
    let apiResponse = response.generate(
      true,
      'Authorization Token Is Missing In Request',
      400,
      null
    );
    res.send(apiResponse);
  }
};
//Exporting modules
module.exports = {
  isAuthorized: isAuthorized
};
