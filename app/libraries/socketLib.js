const socketio = require('socket.io');
const tokenLib = require('./../libraries/tokenLib');

let setServer = (server) =>{
    let allOnlineUsers = [];
    //Inititalize socket io
    let io = socketio.listen(server);
    let myIo = io.of('');

    myIo.on('connection', (socket) =>{
        console.log('on connection--emitting verify user');
        //Trigger an event in socket
        socket.emit('verifyUser','');

        //code to verify the user and make him online
        socket.on('set-user', (authToken) =>{
            console.log('set-user called');
            tokenLib.verifyClaimWithoutSecret(authToken, (err,user) => {
                if(err){
                    socket.emit('auth-error', {status : 500,error: 'please provide correct auth token'});
                } else {
                    console.log('user is verified..setting details');
                    let currentUser = user.data;
                    //setting socket user id
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                    console.log(`${fullName} is online`);
                    socket.emit(currentUser.userId,'You are online');
                }                
            })
        });

        //Disconnecting User
        socket.on('disconnect', () => {
            //disconnect the user from socket
            //remove the user from online list
            //unsubscribe the user from his own channel
            console.log('user is disconnected');
            console.log(socket.userId);
        }); //End Disconnecting User
    })
}

module.exports = {
    setServer : setServer
};