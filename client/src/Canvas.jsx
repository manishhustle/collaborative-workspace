import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Canvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set high-DPI resolution scaling
    canvas.width = window.innerWidth - 80;
    canvas.height = window.innerHeight - 150;

    // Listen for incoming drawing data from other users
    socket.on('draw', ({ prevPoint, currentPoint, color, lineWidth }) => {
      drawLine(ctx, prevPoint, currentPoint, color, lineWidth);
    });

    return () => socket.off('draw');
  }, []);

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
    prevPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const ctx = canvasRef.current.getContext('2d');

    // Draw locally
    drawLine(ctx, prevPointRef.current, currentPoint, color, lineWidth);

    // Emit event to server
    socket.emit('draw', {
      prevPoint: prevPointRef.current,
      currentPoint,
      color,
      lineWidth,
    });

    prevPointRef.current = currentPoint;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    prevPointRef.current = null;
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ marginBottom: '15px', display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
        <label>
          Color: 
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ marginLeft: '5px' }} />
        </label>
        <label>
          Brush Size: 
          <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} style={{ marginLeft: '5px' }} />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '2px solid #333', borderRadius: '8px', cursor: 'crosshair', background: '#ffffff' }}
      />
    </div>
  );
}
