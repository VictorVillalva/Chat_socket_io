const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8000

const usuarios = {}; //GUARDO MIS USUARIOS BEBES

server.listen(PORT, () => {
   console.log('Servidor ejecutando en puerto: http://localhost:' + PORT);
});

app.use(express.static(path.join(__dirname, 'src')));

io.on('connection', (socket) => {

   socket.on('register', ( username ) => {
      if ( usuarios[username] ) {
         socket.emit('login-issue');
         return;
      } else {
         usuarios[username] = socket.id;
         socket.username = username;
         socket.emit('login');
         io.emit('user-connected', usuarios);
      }
   });

   socket.on('send-message', ({message, image}) => {
      io.emit('send-message', {message, user: socket.username, image});
   });
//ENVIO DE MSJ PRIVADO
   socket.on('send-private-message', ({targetUser, message, image}) => {
      if ( usuarios[targetUser] ) {
         io.to(usuarios[targetUser]).emit('send-private-message', { from: socket.username, message, image });
         io.to(usuarios[socket.username]).emit('send-private-message', { from: socket.username, message, image });
      }else {
         socket.emit('send-private-message-issue');
      }
   });
//DESCONECTADO
   socket.on('disconnect', () => {
      delete usuarios[socket.username];
      io.emit('user-connected', usuarios);
   }); 
});



