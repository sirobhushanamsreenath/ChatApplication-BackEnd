const check = require('./../libraries/checkLib');
const apiConfig = require('./../../config/appConfig');
const response = require('./../libraries/responseLib');
const validateInput = require('./../libraries/paramsValidationLib');
const logger = require('./../libraries/loggerInfo');
const time = require('./../libraries/timeLib');
const mongoose = require('mongoose');
const passwordLib = require('./../libraries/generatePasswordLib');
const shortid = require('shortid');
const token = require('./../libraries/tokenLib');

/* Models */
const userModel = mongoose.model('User');
const authModel = mongoose.model('Auth');

/**
 * SignUp Functionality
 */
let signUpFunction = (req, res) => {

    //validating the user input
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if(req.body.email){
                if(!validateInput.Email(req.body.email)){
                    let apiResponse = response.generate(true, 'Email does not meet the requirement', 404, null);
                    res.send(apiResponse);
                    reject(apiResponse);
                } else if(check.isEmpty(req.body.password)){
                    console.log(req.body);
                    let apiResponse = response.generate(true, '"Password" parameter is missing', 404,null);
                    res.send(apiResponse);
                    reject(apiResponse);
                } else {
                    resolve(req);
                }
            } else{
                logger.captureError('Field Missing During User Creation','User Controller : createUser()',5);
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing',400,null);
                res.send(apiResponse);
                reject(apiResponse);
            }
        });
    } // End validating user input

    //Create User
    let createUser = () => {
            return new Promise((resolve, reject) =>{
                userModel.findOne({email: req.body.email})
                    .exec((err, retrievedUserDetails) => {
                        if(err){
                            logger.captureError(err.message, 'userController : createUser()',10);
                            let apiResponse = response.generate(true,'Failed To Create User', 404, null);
                            res.send(apiResponse);
                            reject(apiResponse);
                        } else if(check.isEmpty(retrievedUserDetails)){
                            console.log(req.body);
                            let newUser = userModel({
                                userId : shortid.generate(),
                                firstName : req.body.firstName,
                                lastName : req.body.lastName || '',
                                email : req.body.email.toLowerCase(),
                                mobileNumber : req.body.mobileNumber,
                                password : passwordLib.hashpassword(req.body.password),
                                createdOn : time.now()
                            })
                            newUser.save((err, newUser) => {
                                if(err){
                                    console.log(err);
                                    logger.captureError(err.message, 'userController : createUser()', 10);
                                    let apiResponse = response.generate(true, 'Failed to create a New User', 404,null);
                                    res.send(apiResponse);
                                    reject(apiResponse);
                                } else {
                                    let newUserObj = newUser.toObject();
                                    resolve(newUserObj);
                                }
                            })
                        } else{
                            logger.captureError('User Cannot Be Created. User Already Present', 'userController : createUser()', 5);
                            let apiResponse = response.generate(true, 'User Already Present With Given Email Id', 404, null);
                            res.send(apiResponse);
                            reject(apiResponse);
                        }
                    });
            });
    }// End Create User 

    //Validate User Input
    validateUserInput (req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password;
            let apiResponse = response.generate(false, 'User Created', 200, resolve);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}; // end user sign up function

/**
 * Login Functionality
 */
let loginFunction = (req, res) => {
    
    // Find user
    let findUser = () =>{
        console.log('Find user')
        return new Promise((resolve, reject) =>{
            if(req.body.email){
                userModel.findOne({email : req.body.email})
                    .exec((err, userDetails) =>{
                        if(err) {
                            console.log(err);
                            logger.captureError(err.message,'userController : findUser()', 10);
                            let apiResponse = response.generate(true,'Failed To Find User', 500, null);
                            res.send(apiResponse);
                            reject(apiResponse);
                        } else if(check.isEmpty(userDetails)){
                            logger.captureError('No User Found','userController : findUser()', 7);
                            let apiResponse = response.generate(true,'No User Details Found',404,null);
                            res.send(apiResponse);
                            reject(apiResponse);
                        } else {
                            logger.captureInfo('User Found','userController : findUser()',10);
                            // res.send(apiResponse);
                            resolve(userDetails);
                        }
                    })
            } else{
                let apiResponse = response.generate(true,'\'email\' parameter is missing', 400, null);
                res.send(apiResponse);
                reject(apiResponse);
            }
        })
    } // End Find User

    //Validate Password
    let validatePassword = (retrievedUserDetails) => {
        console.log('validating password');
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) =>{
                if(err){
                    console.log(err);
                    logger.captureError(err.message,'userController : validatePassword()',10);
                    let apiResponse = response.generate(true,'Login Failed', 500, null);
                    res.send(apiResponse);
                    reject(apiResponse);
                } else if(isMatch){
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password;
                    delete retrievedUserDetailsObj._id;
                    delete retrievedUserDetailsObj.__v;
                    delete retrievedUserDetailsObj.createdOn;
                    delete retrievedUserDetailsObj.modifiedOn;
                    resolve(retrievedUserDetailsObj);
                } else{
                    logger.captureInfo('Login Failed Due To Invalid Password','userController : validatePassword()',8);
                    let apiResponse = response.generate(true, 'Wrong Password. Login Failed',500,null);
                    res.send(apiResponse);
                    reject(apiResponse);
                }            
            })
        })
    } // End Validate Password

    //Generate token
    let generateToken = (userDetails) => {
        console.log('generate token');
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if(err){
                    console.log(err);
                    let apiResponse = response.generate(true,'Failed To Generate Token', 500, null);
                    reject(apiResponse);
                } else{
                    tokenDetails.userId = userDetails.userId;
                    tokenDetails.userDetails = userDetails;
                    resolve(tokenDetails);
                }
            })
        })
    } // End Generate Token

    //Save Token
    let saveToken = (tokenDetails) => {
        console.log('save token');
        return new Promise((resolve, reject) => {
            authModel.findOne({userId : tokenDetails.userId})
                .exec((err, retrievedUserDetails) => {
                    if(err){
                        console.log(err);
                        logger.captureError(err.message, 'userController : saveToken()',10);
                        let apiResponse = response.generate(true,'Failed To Generate Token', 500, null);
                        reject(apiResponse);
                    } else if(check.isEmpty(retrievedUserDetails)){
                        console.log('New token details generated');
                        let newAuthToken = new authModel({
                            userId : tokenDetails.userId,
                            authToken : tokenDetails.token,
                            tokenSecret : tokenDetails.secretKey,
                            tokenGenerationTime : time.now()
                        })
                        newAuthToken.save((err, newTokenDetails) => {
                            if(err) {
                                console.log(err);
                                logger.captureError(err.message,'userController : saveToken()', 10);
                                let apiResponse = response.generate(true,'Failed To Generate Token',500, null);
                                reject(apiResponse);
                            } else {
                                let responseBody = {
                                    authToken : newTokenDetails.authToken,
                                    userDetails : newTokenDetails.userDetails
                                };
                                resolve(responseBody);
                            }
                        });
                    } else {
                        console.log('old token details updated');
                        retrievedUserDetails.token = tokenDetails.token,
                        retrievedUserDetails.tokenSecret = tokenDetails.secretKey,
                        retrievedUserDetails.tokenGenerationTime = time.now(),
                        retrievedUserDetails.save((err, newTokenDetails) => {
                            if(err){
                                console.log(err);
                                logger.captureError(err.message, 'userController : saveToken()', 10);
                                let apiResponse = response.generate(true,'Failed To Generate Token', 500, null);
                                reject(apiResponse);
                            } else{
                                let responseBody = {
                                    authToken : newTokenDetails.authToken,
                                    userDetails : tokenDetails.userDetails
                                };
                                resolve(responseBody);
                            }
                        });
                    }
                });
        });
    }//End Save Token

    findUser (req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false,'Login Successfull.', 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log('errorhandler');
            console.log(err);
            res.status(err.status);
            res.send(err);
        });
}; //End Login Functionality

/**
 * Logout Functionality
 */
let logoutFunction = (req, res) => {
    authModel.findOneAndRemove({userId : req.user.userId})
        .exex((err, user) => {
            if(err){
                console.log(err);
                logger.captureError(err.message,'userController : logoutFunction()', 10);
                let apiResponse = response.generate(true,`Error Occurred : ${err.message}`, 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(user)){
                let apiResponse = response.generate(true, 'User Logged Out (Or) Invalid User', 500, null);
                res.send(apiResponse);
            } else {
                let apiResponse = resonse.generate(false, 'User Logged Out Successfully', 200, null);
                res.send(apiResponse);
            }
        })
};//End of Logout function


module.exports = {
    signUpFunction : signUpFunction,
    loginFunction : loginFunction,
    logoutFunction : logoutFunction
}