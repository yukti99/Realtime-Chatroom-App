const users = [];

// Join user to chat
function userJoin(id, username, chatroom){
    const user = {id,username,chatroom};
    users.push(user);
    return user;

}
// to get the current user
function getCurrentUser(id){
    return users.find(user=>user.id == id);

}

// when a user leaves the chatroom
function userLeft(id){
    const index = users.findIndex(user => user.id == id);
    if (index!=-1){
        // 1 user to be removes from the array from the index found
        return users.splice(index,1)[0]; 
    }
}

// to get chatroom users
function getChatRoomUsers(chatroom){
    //to return all the users in this chatroom
    return users.filter(user => user.chatroom == chatroom);
}

module.exports = {
    userJoin,
    getCurrentUser,
    getChatRoomUsers,
    userLeft
}