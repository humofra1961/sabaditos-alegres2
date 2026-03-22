// ============================================================================
// 🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR PRINCIPAL
// ============================================================================
// Versión: 13.0 (MATRICES OFICIALES DE 12 CARTONES + 52 CARTAS INDIVIDUALES)
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
// 🃏 CONFIGURACIÓN DE CARTAS
// ============================================================================

const VALOR_FICHA = 50; // Cada ficha vale $50 COP

// ============================================================================
// 🏆 CONFIGURACIÓN DE LOS 6 POZOS
// ============================================================================

const pozosConfig = {
  pokino: { 
    nombre: 'POKINO', 
    cartas: 5, 
    tipo: 'linea',
    acumula: false,
    fichasPorJugador: 1
  },
  cuatroEsquinas: { 
    nombre: '4 ESQUINAS', 
    cartas: 4, 
    indices: [0, 4, 20, 24],
    tipo: 'indices',
    acumula: true,
    fichasPorJugador: 1
  },
  full: { 
    nombre: 'FULL', 
    cartas: 5, 
    tipo: 'indices',
    acumula: true,
    fichasPorJugador: 1
  },
  poker: { 
    nombre: 'POKER', 
    cartas: 4, 
    tipo: 'indices',
    acumula: true,
    fichasPorJugador: 1
  },
  centro: { 
    nombre: 'CENTRO', 
    cartas: 1, 
    tipo: 'centro',
    maxCartas: 5,
    acumula: true,
    fichasPorJugador: 1
  },
  especial: { 
    nombre: 'ESPECIAL', 
    cartas: 25, 
    tipo: 'cartonLleno',
    acumula: true,
    acumulaPartidas: true,
    fichasPorJugador: 1
  }
};

// ============================================================================
// 🎴 MATRICES DE LOS 12 CARTONES OFICIALES (Datos extraídos de PDFs)
// ============================================================================
// Cada cartón es un array de 25 cartas en orden fila por fila (5x5)
// Nomenclatura: 1p=As Picas, 1c=As Corazones, 1d=As Diamantes, 1t=As Tréboles
//               jp=Jota Picas, jc=Jota Corazones, etc.
// ============================================================================

const distribucionesCartones = [
  // Cartón 1 - PDF Oficial
  {
    numero: 1,
    nombre: 'Cartón A',
    poker: 'A',
    full2: 'Q',
    full3: '5',
    pokerFila: 3,
    fullFila: 4,
    cartas: [
      '8c.png', 'jt.png', '2d.png', '9c.png', '8d.png',
      '6c.png', 'kc.png', '3p.png', 'kt.png', '3d.png',
      '7c.png', '1p.png', '1c.png', '1t.png', '1d.png',
      '5c.png', 'qc.png', '5d.png', '5p.png', 'qd.png',
      '4c.png', '10c.png', '4p.png', '4d.png', '6d.png'
    ]
  },
  
  // Cartón 2 - PDF Oficial
  {
    numero: 2,
    nombre: 'Cartón 3',
    poker: '3',
    full2: '5',
    full3: 'J',
    pokerFila: 3,
    fullFila: 5,
    cartas: [
      '1p.png', '10c.png', '7d.png', '8d.png', '1c.png',
      '2p.png', '6c.png', '6d.png', '9d.png', '2t.png',
      '3t.png', '3c.png', '3d.png', '8t.png', '3p.png',
      '7c.png', '4c.png', '4d.png', '10t.png', '4t.png',
      'jp.png', 'jc.png', '5d.png', 'jt.png', '5p.png'
    ]
  },
  
  // Cartón 3 - PDF Oficial
  {
    numero: 3,
    nombre: 'Cartón 4',
    poker: '4',
    full2: 'A',
    full3: '9',
    pokerFila: 1,
    fullFila: 2,
    cartas: [
      '4c.png', '7c.png', '4t.png', '4d.png', '4p.png',
      '1c.png', '9t.png', '9c.png', '9d.png', '1p.png',
      '2d.png', '8c.png', '8t.png', '8d.png', '3p.png',
      '3c.png', '10p.png', '10d.png', '5d.png', '5p.png',
      '5t.png', 'jt.png', 'qc.png', 'qd.png', '2p.png'
    ]
  },
  
  // Cartón 4 - PDF Oficial
  {
    numero: 4,
    nombre: 'Cartón 5',
    poker: '5',
    full2: '9',
    full3: '7',
    pokerFila: 3,
    fullFila: 1,
    cartas: [
      '9p.png', '7c.png', '7d.png', '7p.png', '9c.png',
      '4d.png', '9d.png', '4c.png', '4p.png', '10c.png',
      '5c.png', '5d.png', '5t.png', '5p.png', 'kc.png',
      '6d.png', '6p.png', '3t.png', 'qp.png', 'qc.png',
      '1t.png', '8p.png', '6c.png', 'jp.png', 'jc.png'
    ]
  },
  
  // Cartón 5 - PDF Oficial
  {
    numero: 5,
    nombre: 'Cartón 6',
    poker: '6',
    full2: '2',
    full3: '8',
    pokerFila: 3,
    fullFila: 5,
    cartas: [
      '9t.png', '4c.png', '5d.png', '5c.png', 'qt.png',
      '10d.png', '9p.png', '4p.png', '9c.png', '4t.png',
      '6d.png', 'jd.png', '6p.png', '6c.png', '6t.png',
      '7d.png', 'kp.png', '3t.png', '7c.png', '7t.png',
      '8t.png', '8d.png', '2c.png', '8c.png', '2t.png'
    ]
  },
  
  // Cartón 6 - PDF Oficial
  {
    numero: 6,
    nombre: 'Cartón 7',
    poker: '7',
    full2: 'A',
    full3: '6',
    pokerFila: 3,
    fullFila: 4,
    cartas: [
      '8p.png', '8d.png', '9d.png', 'jt.png', '4d.png',
      '5p.png', '4p.png', 'jd.png', '4t.png', '5d.png',
      '7p.png', '7t.png', '7d.png', 'kp.png', '7c.png',
      '6p.png', '6d.png', '1d.png', '1c.png', '6c.png',
      '9p.png', '5t.png', '3d.png', '3c.png', '3p.png'
    ]
  },
  
  // Cartón 7 - PDF Oficial
  {
    numero: 7,
    nombre: 'Cartón 8',
    poker: '8',
    full2: '7',
    full3: '10',
    pokerFila: 3,
    fullFila: 4,
    cartas: [
      'kc.png', '4p.png', '7c.png', 'kp.png', '4c.png',
      'jc.png', '5d.png', '9c.png', 'jd.png', 'jp.png',
      '8c.png', '8d.png', '8t.png', '9d.png', '8p.png',
      '10c.png', '7d.png', '10p.png', '10t.png', '7t.png',
      '1c.png', '6d.png', '6p.png', 'qc.png', '10d.png'
    ]
  },
  
  // Cartón 8 - PDF Oficial
  {
    numero: 8,
    nombre: 'Cartón 9',
    poker: '9',
    full2: '8',
    full3: '5',
    pokerFila: 3,
    fullFila: 4,
    cartas: [
      '1c.png', '8p.png', 'jd.png', '2p.png', 'jt.png',
      '3p.png', '6d.png', '10d.png', '3c.png', '3t.png',
      '9c.png', '9p.png', '9d.png', '6c.png', '9t.png',
      '5t.png', '5d.png', '8d.png', '5p.png', '8t.png',
      'kd.png', '7p.png', '7c.png', '4p.png', '4t.png'
    ]
  },
  
  // Cartón 9 - PDF Oficial
  {
    numero: 9,
    nombre: 'Cartón 10',
    poker: '10',
    full2: '4',
    full3: '9',
    pokerFila: 2,
    fullFila: 3,
    cartas: [
      'qp.png', '3d.png', 'qt.png', '3p.png', '8d.png',
      '10p.png', '2d.png', '10c.png', '10t.png', '10d.png',
      '9p.png', '4t.png', '9c.png', '4p.png', '9d.png',
      '7p.png', '5p.png', 'jt.png', '7t.png', '7d.png',
      '2p.png', '1c.png', 'kt.png', '1d.png', '6d.png'
    ]
  },
  
  // Cartón 10 - PDF Oficial
  {
    numero: 10,
    nombre: 'Cartón J',
    poker: 'J',
    full2: 'Q',
    full3: '6',
    pokerFila: 2,
    fullFila: 4,
    cartas: [
      '5p.png', '5d.png', '10p.png', '8c.png', '1c.png',
      'jp.png', '3p.png', 'jd.png', 'jc.png', 'jt.png',
      '4p.png', '7t.png', 'kt.png', '7c.png', 'kc.png',
      'qp.png', '6d.png', 'qt.png', '6c.png', '6t.png',
      '9p.png', '4t.png', '9d.png', '9c.png', '2c.png'
    ]
  },
  
  // Cartón 11 - PDF Oficial
  {
    numero: 11,
    nombre: 'Cartón Q',
    poker: 'Q',
    full2: '5',
    full3: 'J',
    pokerFila: 3,
    fullFila: 4,
    cartas: [
      '1c.png', '8t.png', '4t.png', '7c.png', '7d.png',
      'kt.png', '10t.png', '10c.png', '6d.png', '10d.png',
      'qc.png', 'qt.png', 'qp.png', '9c.png', 'qd.png',
      'jc.png', 'jt.png', '5p.png', '5t.png', 'jd.png',
      '10p.png', '9t.png', '9p.png', '8c.png', '5d.png'
    ]
  },
  
  // Cartón 12 - PDF Oficial
  {
    numero: 12,
    nombre: 'Cartón K',
    poker: 'K',
    full2: 'Q',
    full3: '9',
    pokerFila: 2,
    fullFila: 4,
    cartas: [
      '1c.png', '8c.png', '8d.png', '9t.png', '4p.png',
      'kt.png', 'kc.png', '5d.png', 'kd.png', 'kp.png',
      'kd.png', '10c.png', '6d.png', '6c.png', '10p.png',
      'qc.png', '9p.png', '9d.png', 'qt.png', '9c.png',
      'jc.png', '2c.png', '7d.png', '1t.png', 'jt.png'
    ]
  },
  
  // Cartón 13 - Generado por código (complemento)
  {
    numero: 13,
    nombre: 'Cartón Complemento',
    poker: 'J',
    full2: 'Q',
    full3: 'K',
    pokerFila: 3,
    fullFila: 4,
    cartas: [
      'jp.png', 'qc.png', 'kd.png', '1t.png', '2p.png',
      '3c.png', '4d.png', '5t.png', '6p.png', '7c.png',
      '8d.png', '9t.png', '10p.png', 'jc.png', 'qd.png',
      'kp.png', '1c.png', '2d.png', '3t.png', '4p.png',
      '5c.png', '6d.png', '7t.png', '8p.png', '9c.png'
    ]
  }
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
// 🎴 GENERACIÓN DE CARTONES
// ============================================================================

function generarCartonesFijos() {
  console.log('🚀 Generando 13 cartones con matrices oficiales...');
  
  const cartones = distribucionesCartones.map(dist => {
    // Convertir array de nombres de archivo a objetos de carta
    const cartas = dist.cartas.map(nombreArchivo => {
      // Extraer valor y palo del nombre del archivo (ej: '8c.png' → valor: '8', palo: 'c')
      const nombre = nombreArchivo.replace('.png', '');
      const valor = nombre.slice(0, -1);
      const paloCodigo = nombre.slice(-1);
      
      const palos = { 'p': '♠', 'c': '♥', 'd': '♦', 't': '♣' };
      const colores = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
      
      const palo = palos[paloCodigo] || '♠';
      
      // Determinar tipo de carta (poker, full, etc.) basado en la fila
      let tipo = '';
      const indicesPoker = dist.pokerFila === 1 ? [0,1,2,3] : 
                          dist.pokerFila === 2 ? [5,6,7,8] :
                          dist.pokerFila === 3 ? [10,11,12,13] :
                          dist.pokerFila === 4 ? [15,16,17,18] : [20,21,22,23];
      
      const indicesFull2 = dist.fullFila === 1 ? [0,1] : 
                          dist.fullFila === 2 ? [5,6] :
                          dist.fullFila === 3 ? [10,11] :
                          dist.fullFila === 4 ? [15,16] : [20,21];
      
      const indicesFull3 = dist.fullFila === 1 ? [2,3,4] : 
                          dist.fullFila === 2 ? [7,8,9] :
                          dist.fullFila === 3 ? [12,13,14] :
                          dist.fullFila === 4 ? [17,18,19] : [22,23,24];
      
      return {
        codigo: nombreArchivo,
        valor: valor,
        palo: palo,
        color: colores[palo] || 'black',
        tipo: tipo
      };
    });
    
    return {
      numero: dist.numero,
      nombre: dist.nombre,
      valorPoker: dist.poker,
      valorFull2: dist.full2,
      valorFull3: dist.full3,
      dueño: null,
      cartas: cartas,
      tapadas: Array(25).fill(false),
      pozos: {
        pokino: false,
        cuatroEsquinas: false,
        full: false,
        poker: false,
        centro: false,
        especial: false
      }
    };
  });
  
  console.log(`✅ Generados ${cartones.length} cartones completos`);
  return cartones;
}

// ============================================================================
// 🃏 GENERAR MAZO
// ============================================================================

function generarMazo() {
  const palos = ['♠', '♥', '♦', '♣'];
  const valores = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const colores = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
  
  let mazo = [];
  for (let palo of palos) {
    for (let valor of valores) {
      mazo.push({
        palo,
        valor,
        color: colores[palo],
        codigo: palo + valor
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
  
  // Inicializar cartones al conectar
  if (gameState.cartones.length === 0) {
    gameState.cartones = generarCartonesFijos();
    gameState.mazo = barajarMazo(generarMazo());
  }
  
  socket.emit('gameState', gameState);
  
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
  
  function verificarPremiosCompletados() {
    const premiosDetectados = [];
    
    gameState.cartones.forEach(carton => {
      if (!carton.dueño) return;
      
      Object.keys(pozosConfig).forEach(pozo => {
        if (carton.pozos[pozo]) return;
        
        const valido = verificarPozo(carton, pozo, gameState.cartasCantadas);
        
        if (valido) {
          const jugador = gameState.jugadores[carton.dueño];
          premiosDetectados.push({
            carton: carton.numero,
            nombreCarton: carton.nombre,
            pozo: pozo,
            nombrePozo: pozosConfig[pozo].nombre,
            jugador: jugador?.nombre || carton.dueño,
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
  
  socket.on('taparCarta', (numeroCarton, indexCasilla, email) => {
    const carton = gameState.cartones.find(c => c.numero === numeroCarton);
    if (carton && carton.dueño === email) {
      carton.tapadas[indexCasilla] = !carton.tapadas[indexCasilla];
      io.emit('updateCartones', gameState.cartones);
    }
  });
  
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
    
    const valido = verificarPozo(carton, pozo, gameState.cartasCantadas);
    
    if (valido) {
      const premioTotal = gameState.pozosDinamicos[pozo].total;
      const fichasTotales = gameState.pozosDinamicos[pozo].fichas;
      
      io.emit('alertaGanador', {
        carton: numeroCarton,
        pozo: pozosConfig[pozo].nombre,
        jugador: gameState.jugadores[email]?.nombre || email,
        email: email,
        premio: premioTotal,
        fichas: fichasTotales,
        mensaje: `🏆 ¡${gameState.jugadores[email]?.nombre || email} RECLAMA ${pozosConfig[pozo].nombre}! ($${premioTotal} - ${fichasTotales} fichas)`,
        esEspecial: pozo === 'especial'
      });
    } else {
      socket.emit('error', `${pozosConfig[pozo].nombre} no está completo.`);
    }
  });
  
  socket.on('confirmarPremio', (numeroCarton, pozo, emailGanador, emailCantador) => {
    if (gameState.cantador !== emailCantador) {
      socket.emit('error', 'Solo el cantador puede confirmar.');
      return;
    }
    
    const carton = gameState.cartones.find(c => c.numero === numeroCarton);
    const valido = verificarPozo(carton, pozo, gameState.cartasCantadas);
    
    if (valido) {
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
      
      // Resetear pozo según mecánica
      if (pozo === 'pokino' || pozo === 'cuatroEsquinas' || pozo === 'full' || pozo === 'poker' || pozo === 'centro') {
        gameState.pozosDinamicos[pozo].acumulado = 0;
        gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase;
        gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / VALOR_FICHA);
      }
      
      gameState.banco.totalPagado += premio;
      
      io.emit('updateCartones', gameState.cartones);
      io.emit('updateJugadores', gameState.jugadores);
      io.emit('updateEstadisticas', gameState.estadisticas);
      io.emit('updateBanco', gameState.banco);
      io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
      io.emit('premioConfirmado', {
        carton: numeroCarton,
        pozo: pozosConfig[pozo].nombre,
        jugador: gameState.jugadores[emailGanador]?.nombre || emailGanador,
        premio: premio,
        fichas: fichasGanadas,
        esEspecial: pozo === 'especial'
      });
    }
  });
  
  socket.on('toggleFaseSeleccion', (email) => {
    if (gameState.cantador !== email) {
      socket.emit('error', 'Solo el cantador.');
      return;
    }
    gameState.faseJuego = gameState.faseJuego === 'seleccion' ? 'jugando' : 'seleccion';
    io.emit('updateFaseJuego', gameState.faseJuego);
  });
  
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
      carton.tapadas = Array(25).fill(false);
      carton.pozos = { 
        pokino: false, 
        cuatroEsquinas: false, 
        full: false, 
        poker: false, 
        centro: false, 
        especial: false 
      };
    });
    
    // Resetear SOLO POKINO (los demás acumulan)
    gameState.pozosDinamicos.pokino.acumulado = 0;
    gameState.pozosDinamicos.pokino.total = gameState.pozosDinamicos.pokino.valorBase;
    gameState.pozosDinamicos.pokino.fichas = Math.floor(gameState.pozosDinamicos.pokino.total / VALOR_FICHA);
    
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
    
    gameState.banco = {
      totalRecaudado: 0,
      totalPagado: 0,
      transacciones: []
    };
    
    Object.keys(gameState.pozosDinamicos).forEach(pozo => {
      gameState.pozosDinamicos[pozo].acumulado = 0;
      gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase;
      gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / VALOR_FICHA);
    });
    
    gameState.cartones.forEach(carton => {
      carton.dueño = null;
      carton.tapadas = Array(25).fill(false);
      carton.pozos = { 
        pokino: false, 
        cuatroEsquinas: false, 
        full: false, 
        poker: false, 
        centro: false, 
        especial: false 
      };
    });
    
    for (const email in gameState.jugadores) {
      gameState.jugadores[email].cartones = [];
      gameState.jugadores[email].monedas = 0;
      gameState.jugadores[email].fichasCompradas = 0;
      gameState.jugadores[email].fichasGanadas = 0;
      gameState.jugadores[email].fichasApostadas = 0;
      gameState.jugadores[email].pozosGanados = [];
      gameState.jugadores[email].historialTransacciones = [];
    }
    
    io.emit('gameState', gameState);
    io.emit('updateFaseJuego', 'seleccion');
    io.emit('updateCantador', null);
    io.emit('updateCartones', gameState.cartones);
    io.emit('updateBanco', gameState.banco);
    io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
    
    console.log('🔄 Juego reiniciado completamente');
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Jugador desconectado:', socket.id);
    
    for (const email in gameState.jugadores) {
      if (gameState.jugadores[email].socketId === socket.id) {
        gameState.jugadores[email].desconectado = true;
        gameState.jugadores[email].timestamp = Date.now();
        
        if (gameState.cantador === email) {
          gameState.cantadorAnterior = email;
          gameState.cantador = null;
          io.emit('updateCantador', null);
          io.emit('updateJugadores', gameState.jugadores);
        }
        break;
      }
    }
  });
});

// ============================================================================
// ✅ VALIDACIÓN DE POZOS
// ============================================================================

function verificarPozo(carton, pozo, cartasCantadas) {
  const codigosCantados = cartasCantadas.map(c => c.codigo);
  
  if (pozo === 'especial') {
    let tapadasCount = 0;
    for (let i = 0; i < 25; i++) {
      if (carton.tapadas[i]) {
        tapadasCount++;
        const carta = carton.cartas[i];
        if (!codigosCantados.includes(carta.codigo)) {
          return false;
        }
      }
    }
    return tapadasCount === 25;
  }
  
  if (pozo === 'centro') {
    return carton.tapadas[12];
  }
  
  if (pozo === 'pokino') {
    return verificarLineaCompleta(carton, codigosCantados);
  }
  
  if (pozo === 'cuatroEsquinas') {
    const indices = [0, 4, 20, 24];
    for (let index of indices) {
      if (!carton.tapadas[index]) return false;
      const carta = carton.cartas[index];
      if (!codigosCantados.includes(carta.codigo)) return false;
    }
    return true;
  }
  
  if (pozo === 'full' || pozo === 'poker') {
    // Buscar índices según la configuración del cartón
    let indices = [];
    if (pozo === 'poker') {
      const fila = carton.valorPoker ? 3 : 2; // Según configuración
      indices = fila === 1 ? [0,1,2,3] : fila === 2 ? [5,6,7,8] : fila === 3 ? [10,11,12,13] : [15,16,17,18];
    } else {
      indices = [5,6,7,8,9]; // Default full
    }
    
    for (let index of indices) {
      if (!carton.tapadas[index]) return false;
      const carta = carton.cartas[index];
      if (!codigosCantados.includes(carta.codigo)) return false;
    }
    return true;
  }
  
  return false;
}

function verificarLineaCompleta(carton, codigosCantados) {
  const lineas = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ];
  
  for (let linea of lineas) {
    let completa = true;
    for (let index of linea) {
      if (!carton.tapadas[index]) { completa = false; break; }
      const carta = carton.cartas[index];
      if (!codigosCantados.includes(carta.codigo)) { completa = false; break; }
    }
    if (completa) return true;
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
  console.log('╚═══════════════════════════════════════════════════════════╝');
});
