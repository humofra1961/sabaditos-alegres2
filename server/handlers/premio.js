// ============================================================================
// 🏆 HANDLER DE PREMIOS - RECLAMAR, CONFIRMAR
// ============================================================================

const config = require('../config');
const gameState = require('../models/gameState');
const { verificarPozo } = require('../models/validacion');
const { pozosConfig, resetearPozo } = require('../models/pozos');
const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // ✅ RECLAMAR PREMIO
    socket.on('reclamarPremio', (numeroCarton, pozo, email) => {
      const carton = gameState.cartones.find(c => c.numero === numeroCarton);
      if (!carton || carton.dueño !== email) {
        socket.emit('error', 'No tienes este cartón.');
        return;
      }
      
      if (carton.pozos[pozo]) {
        socket.emit('error', 'Este pozo ya fue reclamado.');
        return;
      }
      
      const codigosCantados = gameState.cartasCantadas.map(c => c.codigo);
      const valido = verificarPozo(carton, pozo, codigosCantados);
      
      if (valido) {
        io.emit('alertaGanador', {
          carton: numeroCarton,
          pozo: pozosConfig[pozo].nombre,
          jugador: gameState.jugadores[email]?.nombre || email,
          email: email,
          premio: gameState.pozosDinamicos[pozo].total,
          fichas: gameState.pozosDinamicos[pozo].fichas,
          mensaje: `🏆 ¡${gameState.jugadores[email]?.nombre} RECLAMA ${pozosConfig[pozo].nombre}!`,
          esEspecial: pozo === 'especial'
        });
      } else {
        socket.emit('error', `${pozosConfig[pozo].nombre} no está completo.`);
      }
    });
    
    // ✅ CONFIRMAR PREMIO
    socket.on('confirmarPremio', (numeroCarton, pozo, emailGanador, emailCantador) => {
      if (gameState.cantador !== emailCantador) {
        socket.emit('error', 'Solo el cantador puede confirmar.');
        return;
      }
      
      const carton = gameState.cartones.find(c => c.numero === numeroCarton);
      const codigosCantados = gameState.cartasCantadas.map(c => c.codigo);
      
      if (verificarPozo(carton, pozo, codigosCantados)) {
        carton.pozos[pozo] = true;
        const premio = gameState.pozosDinamicos[pozo].total;
        const fichasGanadas = gameState.pozosDinamicos[pozo].fichas;
        
        gameState.pozosGanados.push({ 
          carton: numeroCarton, 
          pozo: pozo, 
          jugador: emailGanador, 
          premio: premio, 
          fichas: fichasGanadas,
          partida: gameState.partidaActual, 
          timestamp: Date.now() 
        });
        
        if (gameState.jugadores[emailGanador]) {
          gameState.jugadores[emailGanador].monedas += fichasGanadas;
          gameState.jugadores[emailGanador].fichasGanadas += fichasGanadas;
          gameState.jugadores[emailGanador].pozosGanados.push({
            pozo: pozosConfig[pozo].nombre,
            premio: premio,
            fichas: fichasGanadas,
            partida: gameState.partidaActual,
            fecha: new Date().toISOString()
          });
        }
        
        // Resetear pozo (excepto especial)
        resetearPozo(gameState.pozosDinamicos, pozo);
        
        gameState.banco.totalPagado += premio;
        
        io.emit('updateCartones', gameState.cartones);
        io.emit('updateJugadores', gameState.jugadores);
        io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
        io.emit('updateBanco', gameState.banco);
        io.emit('premioConfirmado', {
          jugador: gameState.jugadores[emailGanador]?.nombre,
          pozo: pozosConfig[pozo].nombre,
          premio: premio,
          fichas: fichasGanadas,
          esEspecial: pozo === 'especial'
        });
        
        logger.gameEvent('Premio Confirmado', { pozo, jugador: emailGanador, premio });
      }
    });
  });
};