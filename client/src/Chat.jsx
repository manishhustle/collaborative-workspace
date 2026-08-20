import React, { useState, useEffect } from 'react';

export default function Chat({ socket }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('receive-message');
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('send-message', text);
    setText('');
  };

  return (
    <div style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '15px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', background: '#fff' }}>
      <h3>Live Chat</h3>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
            <strong style={{ color: '#0284c7' }}>{m.id.substring(0, 5)}:</strong> {m.text}
            <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '5px' }}>{m.time}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '5px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
}
