const jwt = require('jsonwebtoken');
const  shortid = require('shortid');
//This secretKey is used when we a decoding out jwt token
const secretKey = 'someRandomKeyThatNoBodyCanGuess';

//Generating the token
let generateToken = (data, callback) => {
    try{
        let claims = {
            //These fields can be coded from documentation of jwt for node..    
            jwtid : shortid.generate(),
            iat : Date.now(),
            exp : Math.floor(Date.now()/1000) + (60 * 60 * 24),
            sub : 'authToken',
            iss : 'edChat',
            data : data
        };
        let tokenDetails = {
            token : jwt.sign(claims, secretKey),
            secretKey : secretKey
        };
        callback(null, tokenDetails);
    } catch (err){
        console.log(err);   
        callback(err,null);
    }

} //End generating the token

//Verify claim
let verifyClaim = (token, secretKey, callback) => {
    //verify a token symmetric
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            console.log('error while verifying the token');
            console.log(err);
            callback(err, null);
        } else {
            console.log('User Verified');
            console.log(decoded);
            callback(null, decoded);
        }
    });
} //end verify claim


//Module Exports
module.exports = {
    generateToken : generateToken,
    verifyClaim : verifyClaim
}; // End module exports