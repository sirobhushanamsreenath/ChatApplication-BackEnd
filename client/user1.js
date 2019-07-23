//Connecting with sockets..
const socket = io('http://localhost:8080');
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkFWYkY1NUV4MyIsImlhdCI6MTU2MzgyNDMwNDI2NywiZXhwIjoxNTYzOTEwNzA0LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IlROeFZ3UEFLQiIsImZpcnN0TmFtZSI6IlNyZWVuYXRoIiwibGFzdE5hbWUiOiJTaXJvYmh1c2hhbmFtIiwiZW1haWwiOiJzcmVlbmF0aDFAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjoiMTIzNDU2Nzg5OSJ9fQ._mNepze2_sGaNKTmSPFcv5bgPrTdMbuziwAmJr1tEE4';
const userId = 'TNxVwPAKB';

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'SiAH8zKxU', //user 2 id here
  recieverName: 'Sachin', //user 2 name here
  senderId: userId,
  senderName: 'S Sreenath'
};

let chatSocket = () => {
  socket.on('verifyUser', data => {
    console.log('socket trying to verify user');
    socket.emit('set-user', authToken);
  });

  //Receiving the message
  socket.on(userId, data => {
    console.log(`you received a message from ${data.senderName}`);
    console.log(`${data.message}`);
  });

  //Broadcasting
  socket.on('online-user-list', data => {
    console.log(
      'Online user list is updated. Someone came online or went offline'
    );
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
  socket.on('typing', name => {
    console.log(`${name} is typing..`);
  });
};

chatSocket();
