const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Drawing = require('./models/Drawing');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collaborative-workspace';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection warning:', err.message));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const users = {};
let currentStrokes = [];

Drawing.findOne({ roomId: 'default' }).then((drawing) => {
  if (drawing) {
    currentStrokes = drawing.strokes;
  }
});

io.on('connection', (socket) => {
  const userColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  users[socket.id] = { id: socket.id, x: 0, y: 0, color: userColor };

  socket.emit('canvas-history', currentStrokes);
  io.emit('users-update', Object.values(users));

  socket.on('draw', (data) => {
    currentStrokes.push(data);
    socket.broadcast.emit('draw', data);

    Drawing.findOneAndUpdate(
      { roomId: 'default' },
      { strokes: currentStrokes },
      { upsert: true, new: true }
    ).catch((err) => console.error('Save error:', err.message));
  });

  socket.on('clear-canvas', () => {
    currentStrokes = [];
    Drawing.findOneAndUpdate({ roomId: 'default' }, { strokes: [] }).catch((err) => console.error(err.message));
    io.emit('clear-canvas');
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
