//Connecting with sockets..
const socket = io('http://localhost:8080');
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkNCMXhxNHpqWiIsImlhdCI6MTU2MzgyNDI0ODY2NSwiZXhwIjoxNTYzOTEwNjQ4LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IlNpQUg4ekt4VSIsImZpcnN0TmFtZSI6IlNhY2hpbiIsImxhc3ROYW1lIjoiVGVuZHVsa2FyIiwiZW1haWwiOiJzYWNoaW4yQGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6IjEyMzQ1Njc4OTkifX0.GBmiRf5L0Pje1rxhW8L5N67Pj4AHj-D6_aaqpelTD3k';
const userId = 'SiAH8zKxU';

let chatMessage = {
    createdOn : Date.now(),
    receiverId : 'TNxVwPAKB', //user 2 id here
    recieverName : 'S Sreenath', //user 2 name here
    senderId : userId,
    senderName : 'Sachin Tendulkar'
}

let chatSocket = () => {
    socket.on('verifyUser', (data) => {
        console.log('socket trying to verify user');
        socket.emit('set-user', authToken);
    });

    //Receiving the message
    socket.on(userId, (data) => {
        console.log(`you received a message from ${data.senderName}`);
        console.log(`${data.message}`);
    });

    //Broadcasting
    socket.on('online-user-list', (data) => {
        console.log('Online user list is updated. Someone came online or went offline');
        console.log(data);
    });

    //Sending the message
    $('#send').on('click', function() {
        let messageText = $('#messageToSend').val();
        chatMessage.message = messageText;
        socket.emit('chat-message', chatMessage);
    });

    $('#messageToSend').on('keypress', function() {
        socket.emit('typing', chatMessage.senderName);
    });

    //Typing event
    socket.on('typing', (name) => {
        console.log(`${name} is typing..`);
    });
}

chatSocket();