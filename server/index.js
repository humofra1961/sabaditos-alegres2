// ============================================================================
// 🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR PRINCIPAL
// ============================================================================
// Versión: 2.0 (Arquitectura Modular)
// ============================================================================

const express = require('express');
const http = require('http');
const path = require('path');
const config = require('./config');
const socketConfig = require('./socket');
const logger = require('./utils/logger');
const gameState = require('./models/gameState');
const playerHandler = require('./handlers/player');
const gameHandler = require('./handlers/game');
const cartonHandler = require('./handlers/carton');
const premioHandler = require('./handlers/premio');
const bancoHandler = require('./handlers/banco');
const cantadorHandler = require('./handlers/cantador');

const app = express();
const server = http.createServer(app);

// Configurar Socket.io
const io = socketConfig(server);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Registrar handlers de Socket.io
playerHandler(io);
gameHandler(io);
cartonHandler(io);
premioHandler(io);
bancoHandler(io);
cantadorHandler(io);

// Iniciar servidor
server.listen(config.PORT, '0.0.0.0', () => {
  logger.serverStarted(config.PORT);
});

module.exports = { app, server, io };