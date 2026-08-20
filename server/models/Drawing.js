const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
  roomId: { type: String, default: 'default' },
  strokes: [
    {
      prevPoint: { x: Number, y: Number },
      currentPoint: { x: Number, y: Number },
      color: String,
      lineWidth: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Drawing', DrawingSchema);
