// ============================================================================
// 🏆 CONFIGURACIÓN DE LOS 6 POZOS
// ============================================================================

const config = require('../config');

const pozosConfig = {
  pokino: { nombre: 'POKINO', cartas: 5, tipo: 'linea', acumula: false },
  cuatroEsquinas: { nombre: '4 ESQUINAS', cartas: 4, indices: [0, 4, 20, 24], tipo: 'indices', acumula: true },
  full: { nombre: 'FULL', cartas: 5, tipo: 'indices', acumula: true },
  poker: { nombre: 'POKER', cartas: 4, tipo: 'indices', acumula: true },
  centro: { nombre: 'CENTRO', cartas: 1, tipo: 'centro', maxCartas: 5, acumula: true },
  especial: { nombre: 'ESPECIAL', cartas: 25, tipo: 'cartonLleno', acumula: true, acumulaPartidas: true }
};

function inicializarPozosDinamicos() {
  return {
    pokino: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: false },
    cuatroEsquinas: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    full: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    poker: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    centro: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true },
    especial: { valorBase: 0, acumulado: 0, total: 0, fichas: 0, acumula: true, acumulaPartidas: true }
  };
}

function resetearPozo(pozos, pozo) {
  if (pozo !== 'especial') {
    pozos[pozo].acumulado = 0;
    pozos[pozo].total = pozos[pozo].valorBase;
    pozos[pozo].fichas = Math.floor(pozos[pozo].total / config.VALOR_FICHA);
  }
}

module.exports = { pozosConfig, inicializarPozosDinamicos, resetearPozo };