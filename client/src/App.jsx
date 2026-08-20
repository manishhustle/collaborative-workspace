import React from 'react';
import Canvas from './Canvas';

function App() {
  return (
    <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '15px 30px', backgroundColor: '#1e293b', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Collaborative Whiteboard</h1>
      </header>
      <main>
        <Canvas />
      </main>
    </div>
  );
}

export default App;
