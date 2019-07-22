//Connecting with sockets..
const socket = io('http://localhost:8080');
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjV0T0Q3UXc4MSIsImlhdCI6MTU2MzgwNjY3OTc4NSwiZXhwIjoxNTYzODkzMDc5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6Ik9CU0d2RmVKeSIsImZpcnN0TmFtZSI6IlNyZWVuYXRoIiwibGFzdE5hbWUiOiJTaXJvYmh1c2hhbmFtIiwiZW1haWwiOiJzYWNoaW4xQGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6IjEyMzQ1Njc4OTkifX0.0BtoDYZcZHZuu_LVGo04KVtqQ1rqsM3qKG8VEWJ8rr4';
const userId = 'OBSGvFeJy';

let chatSocket = () => {
    socket.on('verifyUser', (data) => {
        console.log('socket trying to verify user');
        socket.emit('set-user', authToken);
    });

    socket.on(userId, (data) => {
        console.log('you received a message');
        console.log(data);
    });
}

chatSocket();