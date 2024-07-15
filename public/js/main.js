const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});



const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room);
    OutputUsers(users);
})

socket.on('message', msg => {
    console.log(msg);
    outputMessage(msg);

    //Scroll down to new messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


//Output msg to DOM

function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
						<p class="text">
							${msg.text}
						</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function OutputUsers(users) {
     userList.innerHTML = "";
     users.forEach((user) => {
       const li = document.createElement("li");
       li.innerText = user.username;
       userList.appendChild(li);
     });
}
