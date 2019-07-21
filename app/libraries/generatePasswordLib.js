const bcrypt = require('bcryptjs');
const logger = require('./loggerInfo')
const saltRounds = 10

let hashpassword = (myPlainTextPassword) => {
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(myPlainTextPassword,salt);
    return hash;
}

//The below funcition is Asynchronous..
let comparePassword = (oldPassword, hashpassword, callback) => {
    bcrypt.compare(oldPassword, hashpassword, (err, res) => {
        if(err){
            logger.captureError(err.message,'Comparison Error', 5);
            callback(err,null);
        } else {
            callback(null, res);
        }
    });
}

//The below function is Synchronous...
let comparePasswordSync = (myPlainTextPassword, hash) => {
    return bcrypt.compareSync(myPlainTextPassword, hash);
}

//Exporting modules
module.exports = {
    hashpassword : hashpassword,
    comparePassword : comparePassword,
    comparePasswordSync : comparePasswordSync
}