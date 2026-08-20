import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Canvas from './Canvas';
import Chat from './Chat';

const socket = io('http://localhost:5000');

function App() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    socket.on('users-update', (users) => {
      setOnlineCount(users.length);
    });
    return () => socket.off('users-update');
  }, []);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '10px 20px', background: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Collaborative Whiteboard</h2>
        <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>● {onlineCount} Online</span>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <Canvas socket={socket} />
        <Chat socket={socket} />
      </div>
    </div>
  );
}

export default App;
