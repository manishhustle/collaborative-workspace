# Real-Time Collaborative Whiteboard & Workspace

A full-stack, real-time collaborative workspace application that allows multiple concurrent users to draw on a shared canvas, track live user cursor locations, and chat in real time. Built with Node.js, Express, Socket.IO, React (Vite), and MongoDB.

## Features

* **Real-Time Canvas Synchronization:** Broadcasts brush strokes, colors, and line widths with low latency using WebSockets.
* **Live Presence & Cursor Tracking:** Renders real-time cursor positions and unique indicators for active users.
* **Persistent Canvas History:** Stores stroke data in MongoDB so drawings persist across page reloads and new connections.
* **Integrated Chat Room:** Embedded sidebar for live communication between online users.
* **Global Canvas Clearing:** Synchronized clear canvas event for all connected clients.

## Tech Stack

* **Frontend:** React, Vite, HTML5 Canvas API, Socket.IO Client, Lucide React
* **Backend:** Node.js, Express.js, Socket.IO, Mongoose
* **Database:** MongoDB
* **Version Control:** Git & GitHub

## Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB (running locally or a MongoDB Atlas URI)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/manishhustle/collaborative-workspace.git](https://github.com/manishhustle/collaborative-workspace.git)
   cd collaborative-workspace
