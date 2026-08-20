const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const users = {};

io.on('connection', (socket) => {
  // Assign random color to user cursor
  const userColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  users[socket.id] = { id: socket.id, x: 0, y: 0, color: userColor };

  io.emit('users-update', Object.values(users));

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  socket.on('cursor-move', (data) => {
    if (users[socket.id]) {
      users[socket.id].x = data.x;
      users[socket.id].y = data.y;
      socket.broadcast.emit('cursor-update', users[socket.id]);
    }
  });

  socket.on('send-message', (message) => {
    io.emit('receive-message', {
      id: socket.id,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('users-update', Object.values(users));
    io.emit('user-disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
