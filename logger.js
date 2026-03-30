// ============================================================================
// 📝 LOGGER PERSONALIZADO
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

module.exports = {
  serverStarted: (port) => {
    console.log(`${colors.green}`);
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR ACTIVO      ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  📡 Puerto: ${port}`);
    console.log(`║  🌐 URL: https://sabaditos-alegres.onrender.com`);
    console.log('║  🎴 13 cartones oficiales (12 PDFs + 1 código)');
    console.log('║  🃏 52 cartas individuales en PNG');
    console.log('║  🏆 6 Pozos dinámicos (inician en $0)');
    console.log('║  💰 VALOR FICHA: $50 COP');
    console.log('║  🎰 APUESTA POR PARTIDA: 6 fichas ($300 COP)');
    console.log('║  ✅ ARQUITECTURA: Modular v2.0');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`${colors.reset}`);
  },

  playerConnected: (socketId) => {
    console.log(`${colors.blue}[Socket]${colors.reset} ✅ Jugador conectado: ${socketId}`);
  },

  playerDisconnected: (socketId) => {
    console.log(`${colors.yellow}[Socket]${colors.reset} ❌ Jugador desconectado: ${socketId}`);
  },

  gameEvent: (event, data) => {
    console.log(`${colors.cyan}[Game]${colors.reset} ${event}:`, data);
  },

  error: (message, error) => {
    console.log(`${colors.red}[Error]${colors.reset} ${message}:`, error);
  }
};