// ============================================================================
// 🎮 ESTADO GLOBAL DEL JUEGO
// ============================================================================

const config = require('../config');

const gameState = {
  cartones: [],
  jugadores: {},
  cartasCantadas: [],
  cantador: null,
  cantadorAnterior: null,
  faseJuego: 'seleccion',
  ultimaCarta: null,
  solicitudes: [],
  juegoIniciado: false,
  pozosGanados: [],
  mazo: [],
  indiceMazo: 0,
  partidaActual: 1,
  totalPartidas: config.TOTAL_PARTIDAS,
  estadisticas: {},
  premiosPendientes: [],
  banco: {
    totalRecaudado: 0,
    totalPagado: 0,
    transacciones: []
  },
  pozosDinamicos: {
    pokino: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: false },
    cuatroEsquinas: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    full: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    poker: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    centro: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    especial: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true, acumulaPartidas: true }
  }
};

module.exports = gameState;