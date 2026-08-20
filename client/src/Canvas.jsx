import React, { useRef, useEffect, useState } from 'react';

export default function Canvas({ socket }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 380;
    canvas.height = window.innerHeight - 150;

    socket.on('draw', ({ prevPoint, currentPoint, color, lineWidth }) => {
      drawLine(ctx, prevPoint, currentPoint, color, lineWidth);
    });

    socket.on('cursor-update', (user) => {
      setCursors((prev) => ({ ...prev, [user.id]: user }));
    });

    socket.on('user-disconnected', (id) => {
      setCursors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });

    return () => {
      socket.off('draw');
      socket.off('cursor-update');
      socket.off('user-disconnected');
    };
  }, [socket]);

  const drawLine = (ctx, start, end, strokeColor, strokeWidth) => {
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const prevPointRef = useRef(null);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    prevPointRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    socket.emit('cursor-move', currentPoint);

    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    drawLine(ctx, prevPointRef.current, currentPoint, color, lineWidth);
    socket.emit('draw', { prevPoint: prevPointRef.current, currentPoint, color, lineWidth });
    prevPointRef.current = currentPoint;
  };

  return (
    <div style={{ position: 'relative', flex: 1, padding: '15px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '15px' }}>
        <label>Color: <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
        <label>Brush Size: <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} /></label>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={() => setIsDrawing(false)}
        style={{ border: '1px solid #ccc', background: '#fff', cursor: 'crosshair' }}
      />
      {Object.values(cursors).map((c) => (
        <div key={c.id} style={{ position: 'absolute', left: c.x + 15, top: c.y + 50, pointerEvents: 'none' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: c.color, borderRadius: '50%' }} />
          <span style={{ fontSize: '10px', background: '#eee', padding: '2px 4px', borderRadius: '3px' }}>{c.id.substring(0, 4)}</span>
        </div>
      ))}
    </div>
  );
}
