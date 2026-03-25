// ============================================================================
// 👤 HANDLER DE JUGADORES - REGISTRO, FICHAS, APUESTAS
// ============================================================================

const config = require('../config');
const gameState = require('../models/gameState');
const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.gameEvent('Conexion', { socketId: socket.id });

    // ✅ REGISTRO DE JUGADOR
    socket.on('registerPlayer', (email, nombre) => {
      logger.gameEvent('Registro', { email, nombre });
      
      if (gameState.jugadores[email]) {
        gameState.jugadores[email].socketId = socket.id;
        gameState.jugadores[email].timestamp = Date.now();
        gameState.jugadores[email].desconectado = false;
        
        if (gameState.cantadorAnterior === email && !gameState.cantador) {
          gameState.cantador = email;
          io.emit('updateCantador', email);
          io.emit('updateJugadores', gameState.jugadores);
          socket.emit('reconexionExitosa', {
            mensaje: 'Reconectado como CANTADOR. Tu posición fue restaurada.',
            monedas: gameState.jugadores[email].monedas,
            cartones: gameState.jugadores[email].cartones,
            esCantador: true
          });
        } else {
          socket.emit('reconexionExitosa', {
            mensaje: 'Reconectado. Tu estado se mantuvo.',
            monedas: gameState.jugadores[email].monedas,
            cartones: gameState.jugadores[email].cartones,
            esCantador: gameState.cantador === email
          });
        }
      } else {
        gameState.jugadores[email] = { 
          nombre, 
          timestamp: Date.now(), 
          socketId: socket.id,
          cartones: [],
          monedas: 0,
          fichasCompradas: 0,
          fichasGanadas: 0,
          fichasApostadas: 0,
          pozosGanados: [],
          historialTransacciones: [],
          desconectado: false,
          estadisticas: { ganadas: 0, perdidas: 0, pozosGanados: [], historial: [] }
        };
        
        if (!gameState.estadisticas[email]) {
          gameState.estadisticas[email] = {
            nombre, monedas: 0, ganadas: 0, perdidas: 0, pozosGanados: [], historial: [],
            fichasCompradas: 0, fichasGanadas: 0, fichasApostadas: 0, balanceFinal: 0
          };
        }
      }
      
      io.emit('updateJugadores', gameState.jugadores);
      io.emit('updateEstadisticas', gameState.estadisticas);
      io.emit('updateBanco', gameState.banco);
      io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
    });
    
    // ✅ COMPRAR FICHAS
    socket.on('comprarFichas', (email, cantidadFichas) => {
      if (!gameState.jugadores[email]) {
        socket.emit('error', 'Jugador no encontrado.');
        return;
      }
      
      const costoTotal = cantidadFichas * config.VALOR_FICHA;
      
      gameState.jugadores[email].monedas += cantidadFichas;
      gameState.jugadores[email].fichasCompradas += cantidadFichas;
      gameState.jugadores[email].historialTransacciones.push({
        tipo: 'COMPRA',
        fichas: cantidadFichas,
        valor: costoTotal,
        fecha: new Date().toISOString(),
        partida: gameState.partidaActual
      });
      
      gameState.banco.totalRecaudado += costoTotal;
      gameState.banco.transacciones.push({
        tipo: 'COMPRA',
        jugador: email,
        nombre: gameState.jugadores[email].nombre,
        fichas: cantidadFichas,
        valor: costoTotal,
        fecha: new Date().toISOString(),
        partida: gameState.partidaActual
      });
      
      io.emit('updateJugadores', gameState.jugadores);
      io.emit('updateEstadisticas', gameState.estadisticas);
      io.emit('updateBanco', gameState.banco);
      io.emit('fichasCompradas', {
        jugador: gameState.jugadores[email].nombre,
        fichas: cantidadFichas,
        valor: costoTotal,
        total: gameState.jugadores[email].monedas
      });
      
      logger.gameEvent('Compra Fichas', { email, cantidad: cantidadFichas, total: costoTotal });
    });
    
    // ✅ APOSTAR EN POZOS
    socket.on('apostarEnPozos', (email) => {
      if (!gameState.jugadores[email]) {
        socket.emit('error', 'Jugador no encontrado.');
        return;
      }
      
      const jugador = gameState.jugadores[email];
      const fichasRequeridas = config.FICHAS_POR_APUESTA;
      const costoTotal = fichasRequeridas * config.VALOR_FICHA;
      
      if (jugador.monedas < fichasRequeridas) {
        socket.emit('error', `No tienes suficientes fichas. Necesitas ${fichasRequeridas} fichas ($${costoTotal} COP).`);
        return;
      }
      
      jugador.monedas -= fichasRequeridas;
      jugador.fichasApostadas += fichasRequeridas;
      
      Object.keys(gameState.pozosDinamicos).forEach(pozo => {
        gameState.pozosDinamicos[pozo].acumulado += config.VALOR_FICHA;
        gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase + gameState.pozosDinamicos[pozo].acumulado;
        gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / config.VALOR_FICHA);
      });
      
      jugador.historialTransacciones.push({
        tipo: 'APUESTA_POZOS',
        fichas: fichasRequeridas,
        valor: costoTotal,
        fecha: new Date().toISOString(),
        partida: gameState.partidaActual,
        detalle: '1 ficha en cada uno de los 6 pozos'
      });
      
      gameState.banco.totalRecaudado += costoTotal;
      
      io.emit('updateJugadores', gameState.jugadores);
      io.emit('updateEstadisticas', gameState.estadisticas);
      io.emit('updateBanco', gameState.banco);
      io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
      
      logger.gameEvent('Apuesta', { email, fichas: fichasRequeridas, total: costoTotal });
    });
    
    // ✅ AGREGAR MONEDAS (Cantador)
    socket.on('agregarMonedas', (emailJugador, cantidad, emailCantador) => {
      if (gameState.cantador !== emailCantador) {
        socket.emit('error', 'Solo el cantador puede agregar monedas.');
        return;
      }
      
      if (!gameState.jugadores[emailJugador]) {
        socket.emit('error', 'Jugador no encontrado.');
        return;
      }
      
      gameState.jugadores[emailJugador].monedas += cantidad;
      gameState.estadisticas[emailJugador].monedas += cantidad;
      
      io.emit('updateJugadores', gameState.jugadores);
      io.emit('updateEstadisticas', gameState.estadisticas);
      io.emit('monedasAgregadas', {
        jugador: gameState.jugadores[emailJugador].nombre,
        cantidad: cantidad,
        total: gameState.jugadores[emailJugador].monedas
      });
    });
  });
};
