// node js core module
const path = require('path');
const http = require('http'); // used by express 
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeft, getChatRoomUsers} = require('./utils/users');


const botname = "ChatBot"

const app = express();
const server = http.createServer(app);

const io = socketio(server);

// set static folder
// this will make the public folder as static to open our front end chat app when local host 3000 is opened
app.use(express.static(path.join(__dirname,'public')));

// Run when client connects
// listens for some event like a connection
io.on('connection', socket => {
    socket.on('joinRoom',({username,chatroom})=>{
        const user = userJoin(socket.id,username,chatroom);
        socket.join(user.chatroom);

        // whenever a new client connects 
        console.log('New Web socket Connection...');
        // Welcome current user 
        socket.emit('message',formatMessage(botname,'Welcome to ChatRoom App!'));

        //  broadcast  when a  new user connects
        // all the clients in the current chatroom except  the user that's connecting 
        socket.broadcast.to(user.chatroom).emit(
            'message',formatMessage(botname,`${user.username} has joined the chat`)
        ); 
        // Send users and room info ( so that that can be displayed on chatbar)
        io.to(user.chatroom).emit('roomUsers', {
            chatroom: user.chatroom,
            users: getChatRoomUsers(user.chatroom)
        });
    });
    
    
    // catch the emitted chat message by the client (listen for the message)
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        //console.log(msg);
        // we need to broadcast this message to everyone
        io.to(user.chatroom).emit('message',formatMessage(user.username,msg));    
    });

     
    // runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeft(socket.id);
        if (user){
            console.log(user.username);
            // message is the object returned by formatMessage function
            io.to(user.chatroom).emit('message',formatMessage(botname,`${user.username} has left the chat`));
        }
        // Send users and room info
        io.to(user.chatroom).emit('roomUsers', {
            chatroom: user.chatroom,
            users: getChatRoomUsers(user.chatroom)
        });
        
    }); 


}); 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//io.emit(); // broacast to all clients