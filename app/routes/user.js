const appConfig = require('./../../config/appConfig');
const controller = require('./../controllers/userController');
const authorizationMiddleWare = require('./../middlewares/auth');

module.exports.setRouter = (app) =>{
    let baseUrl = `${appConfig.apiVersion}/users`;

    //defining routes

    // app.get(`${baseUrl}/view/all`,authorizationMiddleWare.isAuthorized,controller.getAllUsers);

    //Params : userId
    // app.get(`${baseUrl}/view/:userId`,authorizationMiddleWare.isAuthorized,controller.getUserById);

    //params : firstName, lastName, email, mobileNumber, password
    app.post(baseUrl+'/signup',controller.signUpFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */

    //params : email, password
    app.post(baseUrl+'/login',controller.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
    */

    //auth Token params : userId
    app.post(baseUrl+'/logout', controller.logoutFunction);
}