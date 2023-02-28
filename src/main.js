//HTML SCREENS
const loginScreen = document.querySelector('.login-screen');
const chatScreen = document.querySelector('.chat-screen');
const conectedUsersArea = document.querySelector('.conectedUsersArea');
chatScreen.style.display = 'none';
conectedUsersArea.style.display = 'none';

//HTML REFERENCES
const usernameInput = document.querySelector('.usernameInput');
const usernameButton = document.querySelector('.usernameButton');
const inputMessage = document.querySelector('.inputMessage');
const inputMessageButton = document.querySelector('.inputMessageButton');
const messagesList = document.querySelector('.messages');
const conectedUsers = document.querySelector('.conectedUsers');
const photoInput = document.querySelector('.photoInput');
const photoButton = document.querySelector('.photoButton');


let DataURL;

const socket = io();

socket.on('user-connected', ( users ) => {
    conectedUsers.innerHTML = '';
    for (const user in users) {
        conectedUsers.insertAdjacentHTML('beforeend',`<li>${user}</li>`);
    }
})
//Logiado
socket.on('login', ( ) => {
    alert('Bienvenido al Chat')
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'inline';
    conectedUsersArea.style.display = 'inline';
})
//Logiado si no esta disponible
socket.on('login-issue', () => {
    alert('Nombre no disponible, intenta uno nuevo');
    usernameInput.value = '';
})
//Envio de mensajes
socket.on('send-message', ({message, user, image}) => {
    messagesList.insertAdjacentHTML('beforeend',`<li>${user}: ${message}</li>`);
    if(image!== undefined){
        const imagen = document.createElement("img")
        imagen.src = image
        messagesList.appendChild(imagen);
    }
    window.scrollTo(0, document.body.scrollHeight);
});
//ENvio de mensaje privado
socket.on('send-private-message', ({from, message, image}) => {
    messagesList.insertAdjacentHTML('beforeend',`<li>[Privado]${from}:${message}</li>`);
    if(image!== undefined){
        const imagen = document.createElement("img")
        imagen.src = image
        messagesList.appendChild(imagen);
    }
    window.scrollTo(0, document.body.scrollHeight);
});
//SI no existe usuario para enviar privado
socket.on('send-private-message-issue', () => {
    alert('Usuario Inexistente');
    usernameInput.value = '';
})
//Registro usuarios
usernameButton.addEventListener('click', ()=>{
    let username = usernameInput.value;
    socket.emit('register', username);
});
//input de mensaje
inputMessageButton.addEventListener('click', ()=>{
    if ( inputMessage.value.startsWith('@') ) {
        const targetUser = inputMessage.value.split(' ')[1];
        const message = inputMessage.value.substr(targetUser.length + 2);
        socket.emit('send-private-message', { targetUser, message, image: DataURL });
    }else {
        socket.emit('send-message', { message: inputMessage.value, image: DataURL});
    }
    inputMessage.value = '';
    DataURL = undefined;
});
//botton de la foto
photoButton.addEventListener('click', ()=>{
    photoInput.click();
})
//Input de la foto
photoInput.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        DataURL = reader.result
    };
    reader.readAsDataURL(file);
    DataURL ? alert('Foto Adjuntada') : alert('Confirme si desea enviar la imagen');
})