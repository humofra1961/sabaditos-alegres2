// ============================================================================
// 🏦 HANDLER DE BANCO - REPORTES, TRANSACCIONES
// ============================================================================

const gameState = require('../models/gameState');
const config = require('../config');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // ✅ GENERAR REPORTE FINAL
    socket.on('generarReporteFinal', (email) => {
      if (gameState.cantador !== email) {
        socket.emit('error', 'Solo el cantador puede generar reportes.');
        return;
      }
      
      const reporte = {
        fecha: new Date().toISOString(),
        partida: gameState.partidaActual,
        resumen: {
          totalRecaudado: gameState.banco.totalRecaudado,
          totalPagado: gameState.banco.totalPagado,
          balance: gameState.banco.totalRecaudado - gameState.banco.totalPagado
        },
        jugadores: Object.keys(gameState.jugadores).map(email => {
          const jugador = gameState.jugadores[email];
          const valorInvertido = jugador.fichasCompradas * config.VALOR_FICHA;
          const valorGanado = jugador.fichasGanadas * config.VALOR_FICHA;
          const balance = valorGanado - valorInvertido;
          
          return {
            nombre: jugador.nombre,
            email: email,
            valorInvertido: valorInvertido,
            valorGanado: valorGanado,
            fichasActuales: jugador.monedas,
            balance: balance,
            valorDevolver: jugador.monedas * config.VALOR_FICHA
          };
        })
      };
      
      socket.emit('reporteFinalGenerado', reporte);
    });
  });
};
