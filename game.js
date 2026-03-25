// ============================================================================
// 🎮 HANDLER DE JUEGO - INICIAR, CANTAR, VALIDAR
// ============================================================================

const config = require('../config');
const gameState = require('../models/gameState');
const { generarMazo, barajarMazo } = require('../models/mazo');
const { verificarPozo } = require('../models/validacion');
const { pozosConfig, resetearPozo } = require('../models/pozos');
const logger = require('../utils/logger');

function verificarJugadoresListos() {
  const jugadoresListos = [];
  const jugadoresNoListos = [];
  
  Object.keys(gameState.jugadores).forEach(email => {
    const jugador = gameState.jugadores[email];
    
    if (jugador.monedas < config.MINIMO_FICHAS_PARA_JUGAR) {
      jugadoresNoListos.push({
        email: email,
        nombre: jugador.nombre,
        razon: `Saldo insuficiente (${jugador.monedas} fichas, mín. ${config.MINIMO_FICHAS_PARA_JUGAR})`,
        monedas: jugador.monedas
      });
      return;
    }
    
    if (!jugador.fichasApostadas || jugador.fichasApostadas < config.FICHAS_POR_APUESTA) {
      jugadoresNoListos.push({
        email: email,
        nombre: jugador.nombre,
        razon: `No ha apostado las ${config.FICHAS_POR_APUESTA} fichas`,
        monedas: jugador.monedas,
        apostado: jugador.fichasApostadas || 0
      });
      return;
    }
    
    jugadoresListos.push({
      email: email,
      nombre: jugador.nombre,
      monedas: jugador.monedas,
      apostado: jugador.fichasApostadas
    });
  });
  
  return {
    listos: jugadoresListos,
    noListos: jugadoresNoListos,
    todosListos: jugadoresNoListos.length === 0
  };
}

function verificarPremiosCompletados(io) {
  const premiosDetectados = [];
  const codigosCantados = gameState.cartasCantadas.map(c => c.codigo);
  
  gameState.cartones.forEach(carton => {
    if (!carton.dueño) return;
    
    Object.keys(pozosConfig).forEach(pozo => {
      if (carton.pozos[pozo]) return;
      
      if (verificarPozo(carton, pozo, codigosCantados)) {
        premiosDetectados.push({
          carton: carton.numero,
          nombreCarton: carton.nombre,
          pozo: pozo,
          nombrePozo: pozosConfig[pozo].nombre,
          jugador: gameState.jugadores[carton.dueño]?.nombre || carton.dueño,
          email: carton.dueño,
          premio: gameState.pozosDinamicos[pozo].total,
          fichas: gameState.pozosDinamicos[pozo].fichas,
          timestamp: Date.now()
        });
      }
    });
  });
  
  if (premiosDetectados.length > 0 && gameState.cantador) {
    gameState.premiosPendientes.push(...premiosDetectados);
    
    const cantadorSocket = io.sockets.sockets.get(
      gameState.jugadores[gameState.cantador]?.socketId
    );
    
    if (cantadorSocket) {
      cantadorSocket.emit('premiosParaVerificar', {
        premios: premiosDetectados,
        mensaje: `🔍 ${premiosDetectados.length} premio(s) completado(s).`
      });
    }
  }
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    // ✅ CANTAR CARTA
    socket.on('cantarCartaAleatoria', (email) => {
      if (gameState.cantador !== email) {
        socket.emit('error', 'Solo el cantador puede cantar cartas.');
        return;
      }
      
      if (gameState.faseJuego !== 'jugando') {
        socket.emit('error', 'El juego no ha iniciado.');
        return;
      }
      
      if (gameState.indiceMazo >= gameState.mazo.length) {
        socket.emit('error', 'Se acabaron las cartas.');
        return;
      }
      
      const carta = gameState.mazo[gameState.indiceMazo];
      gameState.indiceMazo++;
      
      gameState.cartasCantadas.push(carta);
      gameState.ultimaCarta = carta;
      
      io.emit('updateCartasCantadas', gameState.cartasCantadas);
      io.emit('updateUltimaCarta', carta);
      io.emit('cartaCantada', { carta, total: gameState.indiceMazo });
      
      console.log(`🃏 Carta #${gameState.indiceMazo}: ${carta.palo}${carta.valor}`);
      
      verificarPremiosCompletados(io);
      
      if (gameState.indiceMazo >= 52) {
        io.emit('mazoAgotado', { 
          mensaje: '⚠️ ¡SE ACABARON LAS 52 CARTAS! Verifiquen el pozo ESPECIAL',
          totalCartas: gameState.indiceMazo
        });
      }
    });
    
    // ✅ INICIAR JUEGO (CON VALIDACIÓN)
    socket.on('iniciarJuego', (email) => {
      if (gameState.cantador !== email) {
        socket.emit('error', 'Solo el cantador puede iniciar.');
        return;
      }
      
      const validacion = verificarJugadoresListos();
      
      if (!validacion.todosListos) {
        socket.emit('validacionFallida', {
          mensaje: '❌ No se puede iniciar el juego. Faltan requisitos:',
          jugadoresNoListos: validacion.noListos,
          totalJugadores: Object.keys(gameState.jugadores).length,
          jugadoresListos: validacion.listos.length
        });
        return;
      }
      
      gameState.faseJuego = 'jugando';
      gameState.juegoIniciado = true;
      gameState.premiosPendientes = [];
      io.emit('updateFaseJuego', 'jugando');
      
      if (gameState.partidaActual === 6) {
        io.emit('juegoIniciado', { 
          mensaje: `🎊 ESPECIAL INICIADO - PARTIDA 6: ¡LLENAR CARTÓN!`, 
          partida: gameState.partidaActual,
          esEspecial: true
        });
      } else {
        io.emit('juegoIniciado', { 
          mensaje: `¡PARTIDA ${gameState.partidaActual} INICIADA!`, 
          partida: gameState.partidaActual,
          esEspecial: false
        });
      }
      
      logger.gameEvent('Juego Iniciado', { partida: gameState.partidaActual, jugadores: validacion.listos.length });
    });
    
    // ✅ SOLICITAR ESTADO DE APUESTAS
    socket.on('solicitarEstadoApuestas', (email) => {
      if (gameState.cantador !== email) {
        socket.emit('error', 'Solo el cantador puede verificar.');
        return;
      }
      
      const validacion = verificarJugadoresListos();
      socket.emit('estadoApuestas', validacion);
    });
    
    // ✅ TOGGLE FASE SELECCIÓN
    socket.on('toggleFaseSeleccion', (email) => {
      if (gameState.cantador !== email) {
        socket.emit('error', 'Solo el cantador.');
        return;
      }
      gameState.faseJuego = gameState.faseJuego === 'seleccion' ? 'jugando' : 'seleccion';
      io.emit('updateFaseJuego', gameState.faseJuego);
    });
    
    // ✅ SIGUIENTE PARTIDA
    socket.on('siguientePartida', (email) => {
      if (gameState.cantador !== email) {
        socket.emit('error', 'Solo el cantador.');
        return;
      }
      
      if (gameState.partidaActual >= config.TOTAL_PARTIDAS) {
        socket.emit('error', 'Partidas completadas. Reinicia el juego.');
        return;
      }
      
      gameState.cartasCantadas = [];
      gameState.ultimaCarta = null;
      gameState.juegoIniciado = false;
      gameState.faseJuego = 'seleccion';
      gameState.indiceMazo = 0;
      gameState.mazo = barajarMazo(generarMazo());
      gameState.premiosPendientes = [];
      
      gameState.cartones.forEach(carton => {
        carton.tapadas.fill(false);
        Object.keys(carton.pozos).forEach(k => carton.pozos[k] = false);
      });
      
      resetearPozo(gameState.pozosDinamicos, 'pokino');
      
      gameState.partidaActual++;
      
      io.emit('gameState', gameState);
      io.emit('updateFaseJuego', 'seleccion');
      io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
      io.emit('siguientePartida', { 
        partida: gameState.partidaActual,
        esEspecial: gameState.partidaActual === 6,
        mensaje: `➡️ Partida ${gameState.partidaActual} iniciada`
      });
    });
    
    // ✅ REINICIAR JUEGO
    socket.on('reiniciarJuego', (email) => {
      if (gameState.cantador !== email) {
        socket.emit('error', 'Solo el cantador.');
        return;
      }
      
      gameState.cartasCantadas = [];
      gameState.ultimaCarta = null;
      gameState.juegoIniciado = false;
      gameState.pozosGanados = [];
      gameState.premiosPendientes = [];
      gameState.faseJuego = 'seleccion';
      gameState.partidaActual = 1;
      gameState.indiceMazo = 0;
      gameState.mazo = barajarMazo(generarMazo());
      gameState.cantador = null;
      gameState.cantadorAnterior = null;
      
      gameState.banco = { totalRecaudado: 0, totalPagado: 0, transacciones: [] };
      
      Object.keys(gameState.pozosDinamicos).forEach(p => {
        gameState.pozosDinamicos[p].acumulado = 0;
        gameState.pozosDinamicos[p].total = 0;
        gameState.pozosDinamicos[p].fichas = 0;
      });
      
      gameState.cartones.forEach(c => { 
        c.dueño = null; 
        c.tapadas.fill(false); 
        Object.keys(c.pozos).forEach(k => c.pozos[k] = false); 
      });
      
      io.emit('gameState', gameState);
      io.emit('updateFaseJuego', 'seleccion');
      io.emit('updateCantador', null);
      io.emit('updateCartones', gameState.cartones);
      io.emit('updateBanco', gameState.banco);
      io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
      
      logger.gameEvent('Juego Reiniciado', {});
    });
  });
};