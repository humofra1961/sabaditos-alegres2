// ============================================================================
// 🎤 HANDLER DEL CANTADOR - ESTABLECER, DESCONECTAR
// ============================================================================

const gameState = require('../models/gameState');
const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // ✅ ESTABLECER CANTADOR
    socket.on('establecerCantador', (email) => {
      if (gameState.cantador && gameState.cantador !== email) {
        socket.emit('error', 'Ya hay un cantador en esta partida.');
        return;
      }
      
      gameState.cantador = email;
      gameState.cantadorAnterior = email;
      io.emit('updateCantador', email);
      io.emit('updateJugadores', gameState.jugadores);
      logger.gameEvent('Cantador Establecido', { email });
    });
    
    // ✅ SOLICITUD DE CAMBIO
    socket.on('solicitarCambio', (email, mensaje) => {
      const solicitud = { 
        id: Date.now(), 
        email, 
        nombre: gameState.jugadores[email]?.nombre || email, 
        mensaje, 
        timestamp: Date.now() 
      };
      gameState.solicitudes.push(solicitud);
      io.emit('updateSolicitudes', gameState.solicitudes);
    });
    
    socket.on('responderSolicitud', (solicitudId, emailCantador, aprobar) => {
      if (gameState.cantador !== emailCantador) {
        socket.emit('error', 'Solo el cantador.');
        return;
      }
      
      const index = gameState.solicitudes.findIndex(s => s.id === solicitudId);
      if (index !== -1) {
        const solicitud = gameState.solicitudes[index];
        if (aprobar) {
          gameState.faseJuego = 'seleccion';
          io.emit('updateFaseJuego', 'seleccion');
        }
        gameState.solicitudes.splice(index, 1);
        io.emit('updateSolicitudes', gameState.solicitudes);
        
        const jugadorSocket = io.sockets.sockets.get(gameState.jugadores[solicitud.email]?.socketId);
        if (jugadorSocket) {
          jugadorSocket.emit('solicitudRespondida', { aprobada: aprobar });
        }
      }
    });
    
    // ✅ DESCONECTAR
    socket.on('disconnect', () => {
      logger.gameEvent('Desconexión', { socketId: socket.id });
      
      let cantadorDesconectado = false;
      
      for (const email in gameState.jugadores) {
        if (gameState.jugadores[email].socketId === socket.id) {
          gameState.jugadores[email].desconectado = true;
          gameState.jugadores[email].timestamp = Date.now();
          
          if (gameState.cantador === email) {
            gameState.cantadorAnterior = email;
            gameState.cantador = null;
            cantadorDesconectado = true;
            
            io.emit('updateCantador', null);
            io.emit('updateJugadores', gameState.jugadores);
            io.emit('cantadorDesconectado', {
              mensaje: '⚠️ El cantador se desconectó.',
              cantadorAnterior: email
            });
          }
          break;
        }
      }
      
      if (!cantadorDesconectado) {
        io.emit('updateJugadores', gameState.jugadores);
      }
    });
  });
};
