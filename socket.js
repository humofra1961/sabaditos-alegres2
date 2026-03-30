// ============================================================================
// 🔌 CONFIGURACIÓN DE SOCKET.IO
// ============================================================================

const { Server } = require('socket.io');
const config = require('./config');
const logger = require('./utils/logger');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.SOCKET_CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    path: '/socket.io'
  });

  io.on('connection', (socket) => {
    logger.playerConnected(socket.id);

    socket.on('disconnect', () => {
      logger.playerDisconnected(socket.id);
    });
  });

  return io;
};