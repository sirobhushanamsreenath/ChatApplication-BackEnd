const check = require('./../libraries/checkLib')
const apiConfig = require('./../../config/appConfig')
const response = require('./../libraries/responseLib')
const validation = require('./../libraries/paramsValidationLib')
const logget = require('./../libraries/loggerInfo')
const time = require('./../libraries/timeLib')
const mongoose = require('mongoose')

/* Models */
const userModel = mongoose.model('User');

/**
 * SignUp Functionality
 */
let signUpFunction = (req, res) => {

};

/**
 * Login Functionality
 */
let loginFunction = (req, res) => {

};

/**
 * Logout Functionality
 */
let logoutFunction = (req, res) => {

};


module.exports = {
    signUpFunction : signUpFunction,
    loginFunction : loginFunction,
    logoutFunction : logoutFunction
}