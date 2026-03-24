// ============================================================================
// ⚙️ CONFIGURACIÓN GENERAL
// ============================================================================

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || '*',
  
  // Configuración del juego
  VALOR_FICHA: 50,
  MAX_CARTONES_POR_JUGADOR: 3,
  FICHAS_POR_APUESTA: 6,
  MINIMO_FICHAS_PARA_JUGAR: 40,
  TOTAL_PARTIDAS: 6,
  
  // Configuración de pozos
  POZOS: {
    pokino: { nombre: 'POKINO', cartas: 5, acumula: false },
    cuatroEsquinas: { nombre: '4 ESQUINAS', cartas: 4, acumula: true },
    full: { nombre: 'FULL', cartas: 5, acumula: true },
    poker: { nombre: 'POKER', cartas: 4, acumula: true },
    centro: { nombre: 'CENTRO', cartas: 1, acumula: true },
    especial: { nombre: 'ESPECIAL', cartas: 25, acumula: true }
  }
};