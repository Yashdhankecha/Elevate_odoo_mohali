const socketIo = require('socket.io');

let io;

module.exports = {
  initSocket: (server) => {
    io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      console.log(`🔌 Client connected to socket: ${socket.id}`);

      // Wait for authentication message from client
      socket.on('authenticate', (userId) => {
        if (userId) {
          socket.join(userId);
          console.log(`👤 Client ${socket.id} authenticated and joined room: ${userId}`);
        }
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected from socket: ${socket.id}`);
      });
    });

    return io;
  },
  
  getIo: () => {
    if (!io) {
      console.warn('Socket.io not initialized. Ensure initSocket is called first.');
    }
    return io;
  }
};
