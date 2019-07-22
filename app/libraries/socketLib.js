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
                    //Making a list of all online users..
                    let userObj = {userId : socket.userId, fullName : fullName};
                    allOnlineUsers.push(userObj);
                    console.log(allOnlineUsers);

                    //Broadcasting
                    socket.room = 'groupChat';
                    //Joining groupChat room
                    socket.join(socket.room);
                    socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
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
            var removeIndex = allOnlineUsers.map(function(user){return user.userId;}).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1);
            console.log(allOnlineUsers);

            //Disconnecting in Broadcast
            socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
            socket.leave(socket.room);
        }); //End Disconnecting User

        //Sending the chat message to the receiver
        socket.on('chat-message', (data) => {
            console.log('socket chat-message called..')
            console.log(data);
            console.log(data.receiverId);
            myIo.emit(data.receiverId, data);
        });

        //Handling the typing event
        socket.on('typing', (fullName) => {
            console.log('typing event has been called..');
            socket.to(socket.room).broadcast.emit('typing', fullName);
        });
    })
}

module.exports = {
    setServer : setServer
};