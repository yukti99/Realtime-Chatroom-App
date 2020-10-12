// for background sounds
const ping_snd = new Audio();
ping_snd.src = "music/msg_ping.mp3";


const chatForm = document.getElementById('chat-form'); // this is the id of chat form of chat.html
const chatMessages = document.querySelector('.messages');
const chatRoomName =document.getElementById('room-name');
const userList =document.getElementById('users');


// getting the username and room name from the url
const{ username, chatroom} = Qs.parse(location.search,{
    ignoreQueryPrefix: true // to prevent symbols in url to be retieved
   
});

//console.log(username,chatroom);
// this is the client side
const socket = io();

socket.emit('joinRoom',{username,chatroom});


// get chatroom users
socket.on('roomUsers',({chatroom,users}) => {
    outputChatRoomName(chatroom);
    outputUsers(users)
});



// Message from server
socket.on('message',message => {
    console.log(message);
    outputMessage(message); // to display message in the chatbox
    // scroll down
    // will automatically bring the user down to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// when a message is submitted
chatForm.addEventListener('submit',e => {
    e.preventDefault();// prevent the message to automatically go to a file
    const msg = e.target.elements.msg.value; // input for message has id 'msg'
    console.log(msg);
    // emitting a message to the server
    socket.emit('chatMessage',msg);
     // clear input after send button pressed
     e.target.elements.msg.value = '';
     // it focuses on the empty input after sending a message
     e.target.elements.msg.focus();
 
});

// Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="msg-text">
        ${message.textMsg}
    </p>`;
    // whenever a message is displayed messages class should be addes with a div
    document.querySelector('.messages').appendChild(div);
    ping_snd.play();

}
// Add room name to DOM
function outputChatRoomName(chatroom){
    chatRoomName.innerText = chatroom;
}
// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li><i class="fa fa-user"></i> ${user.username}</li>`).join('')}
    `;        
}

/*
<div class="messages" class="message-container">
                    <div class="message">
                        <p class="meta">Yukti <span> 6:00pm</span></p>
                        <p class="msg-text">
                            Hello Guys! Welcome to Yukti's Chat room!
                        </p>
                      

                    </div>
                    <div class="message">
                        <p class="meta">Yukti <span> 6:00pm</span></p>
                        <p class="msg-text">
                            Hi yukti! So nice to meet you...
                        </p>
                        
                  
                    </div>
                </div>


*/

