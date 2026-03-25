// ============================================================================
// 🎴 HANDLER DE CARTONES - SELECCIONAR, LIBERAR, TAPAR
// ============================================================================

const config = require('../config');
const gameState = require('../models/gameState');
const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // ✅ SELECCIONAR CARTÓN
    socket.on('seleccionarCarton', (numero, email, nombre) => {
      logger.gameEvent('Seleccionar Cartón', { numero, email });
      
      if (gameState.faseJuego !== 'seleccion') {
        socket.emit('error', 'La selección está cerrada.');
        return;
      }
      
      const carton = gameState.cartones.find(c => c.numero === numero);
      
      if (!carton) {
        socket.emit('error', 'Cartón no encontrado.');
        return;
      }
      
      if (!carton.cartas || !Array.isArray(carton.cartas) || carton.cartas.length !== 25) {
        console.error(`❌ Cartón ${numero} inválido:`, carton);
        socket.emit('error', 'Cartón inválido.');
        return;
      }
      
      if (gameState.jugadores[email].cartones.length >= config.MAX_CARTONES_POR_JUGADOR && !carton.dueño) {
        socket.emit('error', `Máximo ${config.MAX_CARTONES_POR_JUGADOR} cartones por jugador.`);
        return;
      }
      
      if (!carton.dueño || carton.dueño === email) {
        carton.dueño = email;
        
        if (!gameState.jugadores[email].cartones.includes(numero)) {
          gameState.jugadores[email].cartones.push(numero);
        }
        
        console.log(`✅ Cartón ${numero} asignado a ${email} (sin costo)`);
        
        io.emit('updateCartones', gameState.cartones);
        io.emit('updateJugadores', gameState.jugadores);
        io.emit('updateEstadisticas', gameState.estadisticas);
      } else {
        socket.emit('cartonBloqueado', numero);
      }
    });
    
    // ✅ LIBERAR CARTÓN
    socket.on('liberarCarton', (numero, email) => {
      if (gameState.faseJuego !== 'seleccion') {
        socket.emit('error', 'La selección está cerrada.');
        return;
      }
      
      const carton = gameState.cartones.find(c => c.numero === numero);
      if (carton && carton.dueño === email) {
        carton.dueño = null;
        gameState.jugadores[email].cartones = gameState.jugadores[email].cartones.filter(n => n !== numero);
        
        io.emit('updateCartones', gameState.cartones);
        io.emit('updateJugadores', gameState.jugadores);
        io.emit('updateEstadisticas', gameState.estadisticas);
      }
    });
    
    // ✅ TAPAR CARTA
    socket.on('taparCarta', (numeroCarton, index, email) => {
      const carton = gameState.cartones.find(c => c.numero === numeroCarton);
      if (carton && carton.dueño === email) {
        carton.tapadas[index] = !carton.tapadas[index];
        io.emit('updateCartones', gameState.cartones);
      }
    });
  });
};
