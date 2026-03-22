// ============================================================================
// 🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR PRINCIPAL
// ============================================================================
// Versión: 14.0 (CORRECCIÓN VALIDACIÓN POZOS + CÓDIGOS UNIFICADOS)
// ============================================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ============================================================================
// 🏆 CONFIGURACIÓN DE LOS 6 POZOS
// ============================================================================

const VALOR_FICHA = 50;

const pozosConfig = {
  pokino: { nombre: 'POKINO', cartas: 5, tipo: 'linea', acumula: false },
  cuatroEsquinas: { nombre: '4 ESQUINAS', cartas: 4, indices: [0, 4, 20, 24], tipo: 'indices', acumula: true },
  full: { nombre: 'FULL', cartas: 5, tipo: 'indices', acumula: true },
  poker: { nombre: 'POKER', cartas: 4, tipo: 'indices', acumula: true },
  centro: { nombre: 'CENTRO', cartas: 1, tipo: 'centro', maxCartas: 5, acumula: true },
  especial: { nombre: 'ESPECIAL', cartas: 25, tipo: 'cartonLleno', acumula: true, acumulaPartidas: true }
};

// ============================================================================
// 🎴 MATRICES DE LOS 12 CARTONES OFICIALES (Datos de tu Excel)
// ============================================================================

const distribucionesCartones = [
  { numero: 1, nombre: 'Cartón A', poker: 'A', full2: 'Q', full3: '5', pokerFila: 3, fullFila: 4, cartas: ['8c', 'jt', '2d', '9c', '8d', '6c', 'kc', '3p', 'kt', '3d', '7c', 'Ap', 'Ac', 'At', 'Ad', '5c', 'qc', '5d', '5p', 'qd', '4c', '10c', '4p', '4d', '6d'] },
  { numero: 2, nombre: 'Cartón 3', poker: '3', full2: '5', full3: 'J', pokerFila: 3, fullFila: 5, cartas: ['Ap', '10c', '7d', '8d', 'Ac', '2p', '6c', '6d', '9d', '2t', '3t', '3c', '3d', '8t', '3p', '7c', '4c', '4d', '10t', '4t', 'jp', 'jc', '5d', 'jt', '5p'] },
  { numero: 3, nombre: 'Cartón 4', poker: '4', full2: 'A', full3: '9', pokerFila: 1, fullFila: 2, cartas: ['4c', '7c', '4t', '4d', '4p', 'Ac', '9t', '9c', '9d', 'Ap', '2d', '8c', '8t', '8d', '3p', '3c', '10p', '10d', '5d', '5p', '5t', 'jt', 'qc', 'qd', '2p'] },
  { numero: 4, nombre: 'Cartón 5', poker: '5', full2: '9', full3: '7', pokerFila: 3, fullFila: 1, cartas: ['9p', '7c', '7d', '7p', '9c', '4d', '9d', '4c', '4p', '10c', '5c', '5d', '5t', '5p', 'kc', '6d', '6p', '3t', 'qp', 'qc', 'At', '8p', '6c', 'jp', 'jc'] },
  { numero: 5, nombre: 'Cartón 6', poker: '6', full2: '2', full3: '8', pokerFila: 3, fullFila: 5, cartas: ['9t', '4c', '5d', '5c', 'qt', '10d', '9p', '4p', '9c', '4t', '6d', 'jd', '6p', '6c', '6t', '7d', 'kp', '3t', '7c', '7t', '8t', '8d', '2c', '8c', '2t'] },
  { numero: 6, nombre: 'Cartón 7', poker: '7', full2: 'A', full3: '6', pokerFila: 3, fullFila: 4, cartas: ['8p', '8d', '9d', 'jt', '4d', '5p', '4p', 'jd', '4t', '5d', '7p', '7t', '7d', 'kp', '7c', '6p', '6d', 'Ad', 'Ac', '6c', '9p', '5t', '3d', '3c', '3p'] },
  { numero: 7, nombre: 'Cartón 8', poker: '8', full2: '7', full3: '10', pokerFila: 3, fullFila: 4, cartas: ['kc', '4p', '7c', 'kp', '4c', 'jc', '5d', '9c', 'jd', 'jp', '8c', '8d', '8t', '9d', '8p', '10c', '7d', '10p', '10t', '7t', 'Ac', '6d', '6p', 'qc', '10d'] },
  { numero: 8, nombre: 'Cartón 9', poker: '9', full2: '8', full3: '5', pokerFila: 3, fullFila: 4, cartas: ['Ac', '8p', 'jd', '2p', 'jt', '3p', '6d', '10d', '3c', '3t', '9c', '9p', '9d', '6c', '9t', '5t', '5d', '8d', '5p', '8t', 'kd', '7p', '7c', '4p', '4t'] },
  { numero: 9, nombre: 'Cartón 10', poker: '10', full2: '4', full3: '9', pokerFila: 2, fullFila: 3, cartas: ['qp', '3d', 'qt', '3p', '8d', '10p', '2d', '10c', '10t', '10d', '9p', '4t', '9c', '4p', '9d', '7p', '5p', 'jt', '7t', '7d', '2p', 'Ac', 'kt', 'Ad', '6d'] },
  { numero: 10, nombre: 'Cartón J', poker: 'J', full2: 'Q', full3: '6', pokerFila: 2, fullFila: 4, cartas: ['5p', '5d', '10p', '8c', 'Ac', 'jp', '3p', 'jd', 'jc', 'jt', '4p', '7t', 'kt', '7c', 'kc', 'qp', '6d', 'qt', '6c', '6t', '9p', '4t', '9d', '9c', '2c'] },
  { numero: 11, nombre: 'Cartón Q', poker: 'Q', full2: '5', full3: 'J', pokerFila: 3, fullFila: 4, cartas: ['Ac', '8t', '4t', '7c', '7d', 'kt', '10t', '10c', '6d', '10d', 'qc', 'qt', 'qp', '9c', 'qd', 'jc', 'jt', '5p', '5t', 'jd', '10p', '9t', '9p', '8c', '5d'] },
  { numero: 12, nombre: 'Cartón K', poker: 'K', full2: 'Q', full3: '9', pokerFila: 2, fullFila: 4, cartas: ['Ac', '8c', '8d', '9t', '4p', 'kt', 'kc', '5d', 'kd', 'kp', 'kd', '10c', '6d', '6c', '10p', 'qc', '9p', '9d', 'qt', '9c', 'jc', '2c', '7d', 'At', 'jt'] },
  { numero: 13, nombre: 'Cartón Complemento', poker: 'J', full2: 'Q', full3: 'K', pokerFila: 3, fullFila: 4, cartas: ['jp', 'qc', 'kd', 'At', '2p', '3c', '4d', '5t', '6p', '7c', '8d', '9t', '10p', 'jc', 'qd', 'kp', 'Ac', '2d', '3t', '4p', '5c', '6d', '7t', '8p', '9c'] }
];

// ============================================================================
// 🎮 ESTADO DEL JUEGO
// ============================================================================

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
  totalPartidas: 6,
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

// ============================================================================
// 🎴 GENERACIÓN DE CARTONES Y MAZO
// ============================================================================

function generarCartonesFijos() {
  console.log('🚀 Generando 13 cartones con códigos unificados...');
  
  const cartones = distribucionesCartones.map(dist => {
    const cartas = dist.cartas.map((codigo, index) => {
      const valor = codigo.slice(0, -1);
      const paloCodigo = codigo.slice(-1);
      const palos = { 'p': '♠', 'c': '♥', 'd': '♦', 't': '♣' };
      const colores = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
      const palo = palos[paloCodigo] || '♠';
      
      let tipo = '';
      if (valor === dist.poker) tipo = 'poker';
      else if (valor === dist.full2 || valor === dist.full3) tipo = 'full';
      else if (index === 12) tipo = 'centro';

      return {
        codigo: codigo,
        valor: valor,
        palo: palo,
        color: colores[palo],
        tipo: tipo
      };
    });
    
    return {
      numero: dist.numero,
      nombre: dist.nombre,
      valorPoker: dist.poker,
      valorFull2: dist.full2,
      valorFull3: dist.full3,
      pokerFila: dist.pokerFila,
      fullFila: dist.fullFila,
      dueño: null,
      cartas: cartas,
      tapadas: Array(25).fill(false),
      pozos: { pokino: false, cuatroEsquinas: false, full: false, poker: false, centro: false, especial: false }
    };
  });
  
  console.log(`✅ Generados ${cartones.length} cartones`);
  return cartones;
}

function generarMazo() {
  const palos = ['p', 'c', 'd', 't'];
  const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const simbolos = { 'p': '♠', 'c': '♥', 'd': '♦', 't': '♣' };
  const colores = { 'p': 'black', 'c': 'red', 'd': 'red', 't': 'black' };
  
  let mazo = [];
  for (let palo of palos) {
    for (let valor of valores) {
      mazo.push({
        palo: simbolos[palo],
        valor: valor,
        color: colores[palo],
        codigo: valor + palo
      });
    }
  }
  return mazo;
}

function barajarMazo(mazo) {
  const mazoBarajado = [...mazo];
  for (let i = mazoBarajado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazoBarajado[i], mazoBarajado[j]] = [mazoBarajado[j], mazoBarajado[i]];
  }
  return mazoBarajado;
}

// ============================================================================
// 🌐 SERVIDOR WEB
// ============================================================================

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bingo_poker_v13.html'));
});

// ============================================================================
// 🔌 CONEXIONES SOCKET.IO
// ============================================================================

io.on('connection', (socket) => {
  console.log('✅ Jugador conectado:', socket.id);
  
  if (gameState.cartones.length === 0) {
    gameState.cartones = generarCartonesFijos();
    gameState.mazo = barajarMazo(generarMazo());
  }
  
  socket.emit('gameState', gameState);
  
  // ✅ REGISTRO DE JUGADOR
  socket.on('registerPlayer', (email, nombre) => {
    console.log(`👤 Jugador registrado: ${nombre} (${email})`);
    
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
    
    const costoTotal = cantidadFichas * VALOR_FICHA;
    
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
    
    console.log(`💰 ${gameState.jugadores[email].nombre} compró ${cantidadFichas} fichas por $${costoTotal} COP`);
  });
  
  // ✅ APOSTAR EN POZOS
  socket.on('apostarEnPozos', (email) => {
    if (!gameState.jugadores[email]) {
      socket.emit('error', 'Jugador no encontrado.');
      return;
    }
    
    const jugador = gameState.jugadores[email];
    const fichasRequeridas = 6;
    const costoTotal = fichasRequeridas * VALOR_FICHA;
    
    if (jugador.monedas < fichasRequeridas) {
      socket.emit('error', `No tienes suficientes fichas. Necesitas ${fichasRequeridas} fichas ($${costoTotal} COP) para apostar en los 6 pozos.`);
      return;
    }
    
    jugador.monedas -= fichasRequeridas;
    jugador.fichasApostadas += fichasRequeridas;
    
    Object.keys(gameState.pozosDinamicos).forEach(pozo => {
      gameState.pozosDinamicos[pozo].acumulado += VALOR_FICHA;
      gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase + gameState.pozosDinamicos[pozo].acumulado;
      gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / VALOR_FICHA);
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
    
    console.log(`🎰 ${jugador.nombre} apostó ${fichasRequeridas} fichas ($${costoTotal} COP) en los 6 pozos - Partida ${gameState.partidaActual}`);
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

    // ✅ SELECCIONAR CARTÓN
  socket.on('seleccionarCarton', (numero, email, nombre) => {
    console.log(`🎴 Intentando seleccionar cartón ${numero} para ${email}`);
    
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
    
    if (gameState.jugadores[email].cartones.length >= 3 && !carton.dueño) {
      socket.emit('error', 'Máximo 3 cartones por jugador.');
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
    
    verificarPremiosCompletados();
    
    if (gameState.indiceMazo >= 52) {
      io.emit('mazoAgotado', { 
        mensaje: '⚠️ ¡SE ACABARON LAS 52 CARTAS! Verifiquen el pozo ESPECIAL',
        totalCartas: gameState.indiceMazo
      });
    }
  });
  
  // ✅ VERIFICAR PREMIOS
  function verificarPremiosCompletados() {
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
          mensaje: `🔍 ${premiosDetectados.length} premio(s) completado(s). Verifica si los jugadores reclaman.`
        });
      }
    }
  }
  
  // ✅ TAPAR CARTA
  socket.on('taparCarta', (numeroCarton, index, email) => {
    const carton = gameState.cartones.find(c => c.numero === numeroCarton);
    if (carton && carton.dueño === email) {
      carton.tapadas[index] = !carton.tapadas[index];
      io.emit('updateCartones', gameState.cartones);
    }
  });
  
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
    console.log(`🎤 Cantador establecido: ${email}`);
  });
  
  // ✅ INICIAR JUEGO
  socket.on('iniciarJuego', (email) => {
    if (gameState.cantador !== email) {
      socket.emit('error', 'Solo el cantador puede iniciar.');
      return;
    }
    
    gameState.faseJuego = 'jugando';
    gameState.juegoIniciado = true;
    gameState.premiosPendientes = [];
    io.emit('updateFaseJuego', 'jugando');
    
    if (gameState.partidaActual === 6) {
      io.emit('juegoIniciado', { 
        mensaje: `🎊 ESPECIAL INICIADO - PARTIDA 6: ¡LLENAR CARTÓN! ($${gameState.pozosDinamicos.especial.total})`, 
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
  });
  
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
        mensaje: `🏆 ¡${gameState.jugadores[email]?.nombre} RECLAMA ${pozosConfig[pozo].nombre}! ($${gameState.pozosDinamicos[pozo].total})`,
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
      if (pozo !== 'especial') {
        gameState.pozosDinamicos[pozo].acumulado = 0;
        gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase;
        gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / VALOR_FICHA);
      }
      
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
    }
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
    
    if (gameState.partidaActual >= gameState.totalPartidas) {
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
    
    // Resetear solo Pokino
    gameState.pozosDinamicos.pokino.acumulado = 0;
    gameState.pozosDinamicos.pokino.total = 0;
    gameState.pozosDinamicos.pokino.fichas = 0;
    
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
    
    console.log('🔄 Juego reiniciado completamente');
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
    console.log('❌ Jugador desconectado:', socket.id);
    
    let cantadorDesconectado = false;
    
    for (const email in gameState.jugadores) {
      if (gameState.jugadores[email].socketId === socket.id) {
        gameState.jugadores[email].desconectado = true;
        gameState.jugadores[email].timestamp = Date.now();
        
        if (gameState.cantador === email) {
          gameState.cantadorAnterior = email;
          gameState.cantador = null;
          cantadorDesconectado = true;
          console.log(`🎤 Cantador ${email} se desconectó. Posición liberada para reconexión.`);
          
          io.emit('updateCantador', null);
          io.emit('updateJugadores', gameState.jugadores);
          io.emit('cantadorDesconectado', {
            mensaje: `⚠️ El cantador se desconectó. Puede reconectarse para recuperar su posición.`,
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

// ============================================================================
// ✅ VALIDACIÓN DE POZOS (CORREGIDA - CLAVE PARA EL FIX)
// ============================================================================

function verificarPozo(carton, pozo, codigosCantados) {
  // Función helper para verificar cartas tapadas y cantadas
  const verificarCartas = (indices) => {
    for (let i of indices) {
      if (!carton.tapadas[i]) return false; // Carta no tapada
      const carta = carton.cartas[i];
      if (!codigosCantados.includes(carta.codigo)) return false; // Carta no cantada
    }
    return true;
  };

  // ✅ ESPECIAL: 25 cartas
  if (pozo === 'especial') {
    return verificarCartas(Array.from({length: 25}, (_, i) => i));
  }
  
  // ✅ CENTRO: carta 12
  if (pozo === 'centro') {
    return verificarCartas([12]);
  }
  
  // ✅ 4 ESQUINAS: índices 0, 4, 20, 24
  if (pozo === 'cuatroEsquinas') {
    return verificarCartas([0, 4, 20, 24]);
  }
  
  // ✅ POKINO: cualquier línea de 5 cartas (filas, columnas, diagonales)
  if (pozo === 'pokino') {
    const lineas = [
      [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], // Filas
      [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], // Columnas
      [0,6,12,18,24], [4,8,12,16,20] // Diagonales
    ];
    return lineas.some(linea => verificarCartas(linea));
  }
  
  // ✅ POKER: usa la fila configurada en el cartón (pokerFila)
  if (pozo === 'poker') {
    const fila = carton.pokerFila || 3; // Default fila 3 si no está configurada
    let indices = [];
    
    if (fila === 1) indices = [0, 1, 2, 3]; // Solo 4 cartas de poker en fila 1
    else if (fila === 2) indices = [5, 6, 7, 8];
    else if (fila === 3) indices = [10, 11, 12, 13];
    else if (fila === 4) indices = [15, 16, 17, 18];
    else indices = [10, 11, 12, 13]; // Default
    
    return verificarCartas(indices);
  }
  
  // ✅ FULL: usa la fila configurada en el cartón (fullFila)
  if (pozo === 'full') {
    const fila = carton.fullFila || 4; // Default fila 4 si no está configurada
    let indices = [];
    
    if (fila === 1) indices = [0, 1, 2, 3, 4];
    else if (fila === 2) indices = [5, 6, 7, 8, 9];
    else if (fila === 3) indices = [10, 11, 12, 13, 14];
    else if (fila === 4) indices = [15, 16, 17, 18, 19];
    else if (fila === 5) indices = [20, 21, 22, 23, 24];
    else indices = [15, 16, 17, 18, 19]; // Default
    
    return verificarCartas(indices);
  }
  
  return false;
}

// ============================================================================
// 🚀 INICIAR SERVIDOR
// ============================================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR ACTIVO      ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log(`║  📡 Puerto: ${PORT}`);
  console.log(`║  🌐 URL: https://sabaditos-alegres.onrender.com`);
  console.log('║  🎴 13 cartones oficiales (12 PDFs + 1 código)');
  console.log('║  🃏 52 cartas individuales en PNG');
  console.log('║  🏆 6 Pozos dinámicos (inician en $0)');
  console.log('║  💰 VALOR FICHA: $50 COP');
  console.log('║  🎰 APUESTA POR PARTIDA: 6 fichas ($300 COP)');
  console.log('║  ✅ VALIDACIÓN DE POZOS: Corregida (Poker/Full por fila)');
  console.log('╚═══════════════════════════════════════════════════════════╝');
});
