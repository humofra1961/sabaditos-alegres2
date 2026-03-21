// ============================================================================
// 🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR PRINCIPAL
// ============================================================================
// Versión: 12.0 (CARTONES OFICIALES PDF + POZOS DINÁMICOS)
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

const palos = ['♠', '♥', '♦', '♣'];
const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const colores = {
  '♠': 'black',
  '♣': 'black',
  '♥': 'red',
  '♦': 'red'
};

// ============================================================================
// 🏆 CONFIGURACIÓN DE LOS 6 POZOS
// ============================================================================

const VALOR_FICHA = 50; // Cada ficha vale $50 COP

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
    indices: [5, 6, 7, 8, 9],
    tipo: 'indices',
    acumula: true,
    fichasPorJugador: 1
  },
  poker: { 
    nombre: 'POKER', 
    cartas: 4, 
    indices: [15, 16, 17, 18],
    tipo: 'indices',
    acumula: true,
    fichasPorJugador: 1
  },
  centro: { 
    nombre: 'CENTRO', 
    cartas: 1, 
    indices: [12], 
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
// 🎴 GENERACIÓN DE MAZO Y CARTONES
// ============================================================================

function generarMazo() {
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

function generarCartonesFijos() {
  console.log('🚀 Generando 13 cartones fijos...');
  let cartones = [];
  
  let todasCartas = [];
  for (let palo of palos) {
    for (let valor of valores) {
      todasCartas.push({
        palo,
        valor,
        color: colores[palo],
        codigo: palo + valor
      });
    }
  }
  
  // ✅ CARTONES 1-12: Datos extraídos de los PDFs oficiales
  // ✅ CARTÓN 13: Generado por código (para completar)
  const distribuciones = [
    // Cartón 1 - PDF Oficial
    { poker: 'A', full2: '8', full3: 'V' },
    
    // Cartón 2 - PDF Oficial
    { poker: '8', full2: '10', full3: '7' },
    
    // Cartón 3 - PDF Oficial
    { poker: '4', full2: '8', full3: '6' },
    
    // Cartón 4 - PDF Oficial
    { poker: '5', full2: '9', full3: '6' },
    
    // Cartón 5 - PDF Oficial
    { poker: '9', full2: '6', full3: '8' },
    
    // Cartón 6 - PDF Oficial
    { poker: '8', full2: '6', full3: '7' },
    
    // Cartón 7 - PDF Oficial
    { poker: 'K', full2: '8', full3: '10' },
    
    // Cartón 8 - PDF Oficial
    { poker: '8', full2: '5', full3: 'J' },
    
    // Cartón 9 - PDF Oficial
    { poker: 'Q', full2: '10', full3: '2' },
    
    // Cartón 10 - PDF Oficial
    { poker: '5', full2: '6', full3: 'Q' },
    
    // Cartón 11 - PDF Oficial
    { poker: '10', full2: '5', full3: '9' },
    
    // Cartón 12 - PDF Oficial
    { poker: 'K', full2: '9', full3: '6' },
    
    // Cartón 13 - Generado por código (complemento)
    { poker: 'J', full2: 'Q', full3: 'K' }
  ];
  
  for (let numCarton = 1; numCarton <= 13; numCarton++) {
    let poolCartas = JSON.parse(JSON.stringify(todasCartas));
    const dist = distribuciones[numCarton - 1];
    
    const valorPoker = dist.poker;
    const valorFull2 = dist.full2;
    const valorFull3 = dist.full3;

    const cartasPoker = palos.map(palo => ({
      palo,
      valor: valorPoker,
      color: colores[palo],
      codigo: palo + valorPoker,
      tipo: 'poker'
    }));

    poolCartas = poolCartas.filter(c => c.valor !== valorPoker);

    let cartasFull2 = [];
    for (let palo of palos) {
      const carta = poolCartas.find(c => c.valor === valorFull2 && c.palo === palo);
      if (carta && cartasFull2.length < 2) {
        cartasFull2.push({...carta, tipo: 'full'});
        poolCartas = poolCartas.filter(c => c.codigo !== carta.codigo);
      }
    }

    let cartasFull3 = [];
    for (let palo of palos) {
      const carta = poolCartas.find(c => c.valor === valorFull3 && c.palo === palo);
      if (carta && cartasFull3.length < 3) {
        cartasFull3.push({...carta, tipo: 'full'});
        poolCartas = poolCartas.filter(c => c.codigo !== carta.codigo);
      }
    }

    for (let i = poolCartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poolCartas[i], poolCartas[j]] = [poolCartas[j], poolCartas[i]];
    }

    let cartasCarton = [];

    for (let i = 0; i < 5; i++) cartasCarton.push(poolCartas.shift());
    cartasCarton.push(...cartasFull2);
    cartasCarton.push(...cartasFull3);
    for (let i = 0; i < 5; i++) cartasCarton.push(poolCartas.shift());
    cartasCarton.push(...cartasPoker);
    cartasCarton.push(poolCartas.shift());
    for (let i = 0; i < 5; i++) cartasCarton.push(poolCartas.shift());

    if (cartasCarton.length !== 25) {
      console.error(`❌ Cartón #${numCarton} tiene ${cartasCarton.length} cartas. Regenerando...`);
      numCarton--;
      continue;
    }

    cartasCarton = cartasCarton.map((carta, index) => {
      if (index >= 5 && index <= 9) return {...carta, tipo: 'full'};
      if (index >= 15 && index <= 18) return {...carta, tipo: 'poker'};
      if (index >= 10 && index <= 14) return {...carta, tipo: 'especial'};
      if (index === 12) return {...carta, tipo: 'centro'};
      return carta;
    });

    cartones.push({
      numero: numCarton,
      nombre: `Cartón ${valorPoker}`,
      valorPoker: valorPoker,
      valorFull2: valorFull2,
      valorFull3: valorFull3,
      dueño: null,
      cartas: cartasCarton,
      tapadas: Array(25).fill(false),
      pozos: {
        pokino: false,
        cuatroEsquinas: false,
        full: false,
        poker: false,
        centro: false,
        especial: false
      }
    });
    
    console.log(`✅ Cartón ${numCarton} generado con ${cartasCarton.length} cartas`);
  }
  
  console.log(`✅ Generados ${cartones.length} cartones completos`);
  return cartones;
}

// ============================================================================
// 🎮 ESTADO DEL JUEGO
// ============================================================================

const gameState = {
  cartones: generarCartonesFijos(),
  jugadores: {},
  cartasCantadas: [],
  cantador: null,
  cantadorAnterior: null,
  faseJuego: 'seleccion',
  ultimaCarta: null,
  solicitudes: [],
  juegoIniciado: false,
  pozosGanados: [],
  mazo: barajarMazo(generarMazo()),
  indiceMazo: 0,
  partidaActual: 1,
  totalPartidas: 6,
  estadisticas: {},
  premiosPendientes: [],
  // ✅ Sistema de Banco
  banco: {
    totalRecaudado: 0,
    totalPagado: 0,
    transacciones: []
  },
  // ✅ Pozos Dinámicos (Inician en 0)
  pozosDinamicos: {
    pokino: { 
      valorBase: 0, 
      acumulado: 0, 
      total: 0, 
      fichas: 0,
      acumula: false
    },
    cuatroEsquinas: { 
      valorBase: 0, 
      acumulado: 0, 
      total: 0, 
      fichas: 0,
      acumula: true
    },
    full: { 
      valorBase: 0, 
      acumulado: 0, 
      total: 0, 
      fichas: 0,
      acumula: true
    },
    poker: { 
      valorBase: 0, 
      acumulado: 0, 
      total: 0, 
      fichas: 0,
      acumula: true
    },
    centro: { 
      valorBase: 0, 
      acumulado: 0, 
      total: 0, 
      fichas: 0,
      acumula: true
    },
    especial: { 
      valorBase: 0, 
      acumulado: 0, 
      total: 0, 
      fichas: 0,
      acumula: true,
      acumulaPartidas: true
    }
  }
};

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
        console.log(`🎤 Cantador ${email} reconectado y restaurado`);
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
  
  // ✅ Comprar fichas
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
  
  // ✅ Apostar en pozos (6 fichas por jugador por partida)
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
  
  // ✅ Seleccionar cartón (SIN costo - el costo es al apostar)
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
      
      // ✅ SIN COSTO: Las fichas se descuentan al apostar, no al seleccionar
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
    
    console.log(`🃏 Carta #${gameState.indiceMazo}: ${carta.palo}${carta.valor} (Código: ${carta.codigo})`);
    
    verificarPremiosCompletados();
    
    if (gameState.indiceMazo >= 52) {
      io.emit('mazoAgotado', { 
        mensaje: '⚠️ ¡SE ACABARON LAS 52 CARTAS! Verifiquen el pozo ESPECIAL',
        totalCartas: gameState.indiceMazo
      });
      console.log('⚠️ MAZO AGOTADO - Verificar ESPECIAL');
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
          
          console.log(`🏆 PREMIO DETECTADO: ${pozosConfig[pozo].nombre} - ${carton.nombre} - ${jugador?.nombre} - $${gameState.pozosDinamicos[pozo].total} (${gameState.pozosDinamicos[pozo].fichas} fichas)`);
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
      console.log(`👆 Carta ${indexCasilla} del cartón ${numeroCarton} ${carton.tapadas[indexCasilla] ? 'TAPADA' : 'DESTAPADA'}`);
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
    
    if (gameState.premiosPendientes.length > 0) {
      socket.emit('premiosParaVerificar', {
        premios: gameState.premiosPendientes,
        mensaje: `🔍 Hay ${gameState.premiosPendientes.length} premio(s) pendiente(s) de verificación`
      });
    }
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
      console.log('🎊 PARTIDA ESPECIAL INICIADA - LLENAR CARTÓN');
    } else {
      io.emit('juegoIniciado', { 
        mensaje: `¡PARTIDA ${gameState.partidaActual} INICIADA!`, 
        partida: gameState.partidaActual,
        esEspecial: false
      });
      console.log('🎮 Juego iniciado');
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
    
    if (pozo === 'especial' || pozo === 'centro' || pozo === 'full' || pozo === 'poker' || pozo === 'cuatroEsquinas') {
      const ultimaCarta = gameState.ultimaCarta;
      const cartaRelevante = carton.cartas.find((c, i) => 
        carton.tapadas[i] && c.codigo === ultimaCarta?.codigo
      );
      
      if (!cartaRelevante) {
        socket.emit('error', `${pozosConfig[pozo].nombre} debe reclamarse con la ÚLTIMA carta cantada.`);
        return;
      }
    }
    
    if (pozo === 'centro') {
      if (gameState.cartasCantadas.length > pozosConfig.centro.maxCartas) {
        socket.emit('error', 'CENTRO debe reclamarse antes de la 6ta carta.');
        return;
      }
      
      const cartaCentro = carton.cartas[12];
      const ultimaCarta = gameState.ultimaCarta;
      if (!ultimaCarta || cartaCentro.codigo !== ultimaCarta.codigo) {
        socket.emit('error', 'La carta del CENTRO debe ser la última cantada.');
        return;
      }
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
      console.log(`🏆 Premio reclamado: ${pozo} por ${email} - $${premioTotal} (${fichasTotales} fichas)`);
    } else {
      console.log(`❌ Premio ${pozo} NO válido para cartón ${numeroCarton}`);
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
      
      gameState.premiosPendientes = gameState.premiosPendientes.filter(
        p => !(p.carton === numeroCarton && p.pozo === pozo)
      );
      
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
        gameState.jugadores[emailGanador].historialTransacciones.push({
          tipo: 'PREMIO',
          pozo: pozosConfig[pozo].nombre,
          fichas: fichasGanadas,
          valor: premio,
          fecha: new Date().toISOString(),
          partida: gameState.partidaActual
        });
      }
      
      if (gameState.estadisticas[emailGanador]) {
        gameState.estadisticas[emailGanador].monedas += fichasGanadas;
        gameState.estadisticas[emailGanador].ganadas += fichasGanadas;
        gameState.estadisticas[emailGanador].fichasGanadas += fichasGanadas;
        if (!gameState.estadisticas[emailGanador].pozosGanados) {
          gameState.estadisticas[emailGanador].pozosGanados = [];
        }
        gameState.estadisticas[emailGanador].pozosGanados.push({
          pozo: pozosConfig[pozo].nombre,
          partida: gameState.partidaActual,
          premio: premio,
          fichas: fichasGanadas
        });
      }
      
      // ✅ Resetear pozo según mecánica
      if (pozo === 'pokino') {
        gameState.pozosDinamicos[pozo].acumulado = 0;
        gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase;
        gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / VALOR_FICHA);
      } else if (pozo === 'especial') {
        // ESPECIAL NO se resetea hasta finalizar las 6 partidas
      } else {
        gameState.pozosDinamicos[pozo].acumulado = 0;
        gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase;
        gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / VALOR_FICHA);
      }
      
      gameState.banco.totalPagado += premio;
      gameState.banco.transacciones.push({
        tipo: 'PREMIO',
        jugador: emailGanador,
        nombre: gameState.jugadores[emailGanador]?.nombre || emailGanador,
        pozo: pozosConfig[pozo].nombre,
        fichas: fichasGanadas,
        valor: premio,
        fecha: new Date().toISOString(),
        partida: gameState.partidaActual
      });
      
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
      
      if (gameState.cantador) {
        const cantadorSocket = io.sockets.sockets.get(
          gameState.jugadores[gameState.cantador]?.socketId
        );
        if (cantadorSocket) {
          cantadorSocket.emit('premiosParaVerificar', {
            premios: gameState.premiosPendientes,
            mensaje: gameState.premiosPendientes.length > 0 ? 
              `🔍 ${gameState.premiosPendientes.length} premio(s) pendiente(s)` : 
              '✅ No hay premios pendientes'
          });
        }
      }
      
      console.log(`✅ Premio confirmado: ${pozo} para ${emailGanador} (${fichasGanadas} fichas - $${premio})`);
    } else {
      io.emit('premioRechazado', { 
        carton: numeroCarton, 
        pozo: pozosConfig[pozo].nombre, 
        mensaje: '❌ NO válido - El cantador rechazó el premio' 
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
    
    // ✅ Resetear SOLO POKINO (los demás acumulan)
    gameState.pozosDinamicos.pokino.acumulado = 0;
    gameState.pozosDinamicos.pokino.total = gameState.pozosDinamicos.pokino.valorBase;
    gameState.pozosDinamicos.pokino.fichas = Math.floor(gameState.pozosDinamicos.pokino.total / VALOR_FICHA);
    
    gameState.partidaActual++;
    
    let mensajePartida = `➡️ Partida ${gameState.partidaActual} iniciada`;
    if (gameState.partidaActual === 6) {
      mensajePartida = `🎊 PARTIDA 6: ESPECIAL INICIADO - ¡LLENAR CARTÓN! ($${gameState.pozosDinamicos.especial.total})`;
    }
    
    io.emit('gameState', gameState);
    io.emit('updateFaseJuego', 'seleccion');
    io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
    io.emit('siguientePartida', { 
      partida: gameState.partidaActual,
      esEspecial: gameState.partidaActual === 6,
      mensaje: mensajePartida
    });
    
    console.log(`➡️ Partida ${gameState.partidaActual} iniciada - POKINO reseteado, otros pozos mantienen acumulado`);
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
    
    // ✅ Resetear TODOS los pozos (incluido ESPECIAL)
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
    
    console.log('🔄 Juego reiniciado completamente - Todos los pozos reseteados');
  });
  
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
    console.log(`📝 Solicitud de cambio de ${email}`);
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
// ✅ VALIDACIÓN DE POZOS
// ============================================================================

function verificarPozo(carton, pozo, cartasCantadas) {
  const config = pozosConfig[pozo];
  
  const codigosCantados = cartasCantadas.map(c => c.codigo);
  console.log(`🔍 Validando ${pozo}: ${codigosCantados.length} cartas cantadas`);
  
  if (pozo === 'especial') {
    let tapadasCount = 0;
    for (let i = 0; i < 25; i++) {
      if (carton.tapadas[i]) {
        tapadasCount++;
        const carta = carton.cartas[i];
        if (!codigosCantados.includes(carta.codigo)) {
          console.log(`❌ ESPECIAL: Carta ${carta.codigo} tapada pero NO cantada`);
          return false;
        }
      }
    }
    
    if (tapadasCount === 25) {
      console.log(`✅ ESPECIAL VÁLIDO: 25/25 cartas tapadas y cantadas`);
      return true;
    } else {
      console.log(`❌ ESPECIAL: Solo ${tapadasCount}/25 cartas tapadas`);
      return false;
    }
  }
  
  if (pozo === 'centro') {
    if (!carton.tapadas[12]) {
      console.log('❌ CENTRO: Carta central no tapada');
      return false;
    }
    const carta = carton.cartas[12];
    const estaCantada = codigosCantados.includes(carta.codigo);
    console.log(`🔍 CENTRO: Carta ${carta.codigo} ${estaCantada ? 'SÍ' : 'NO'} cantada`);
    return estaCantada;
  }
  
  if (pozo === 'pokino') {
    const resultado = verificarLineaCompleta(carton, codigosCantados);
    console.log(`🔍 POKINO: ${resultado ? 'VÁLIDO' : 'NO VÁLIDO'}`);
    return resultado;
  }
  
  if (config.indices) {
    for (let index of config.indices) {
      if (!carton.tapadas[index]) {
        console.log(`❌ ${pozo}: Índice ${index} no tapado`);
        return false;
      }
      const carta = carton.cartas[index];
      const estaCantada = codigosCantados.includes(carta.codigo);
      if (!estaCantada) {
        console.log(`❌ ${pozo}: Carta ${carta.codigo} en índice ${index} NO cantada`);
        return false;
      }
    }
    console.log(`✅ ${pozo}: VÁLIDO - Todos los índices completados`);
    return true;
  }
  
  return false;
}

function verificarLineaCompleta(carton, codigosCantados) {
  const lineas = [
    [0, 1, 2, 3, 4], 
    [5, 6, 7, 8, 9], 
    [10, 11, 12, 13, 14], 
    [15, 16, 17, 18, 19], 
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], 
    [1, 6, 11, 16, 21], 
    [2, 7, 12, 17, 22], 
    [3, 8, 13, 18, 23], 
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], 
    [4, 8, 12, 16, 20]
  ];
  
  for (let linea of lineas) {
    let completa = true;
    let codigosLinea = [];
    
    for (let index of linea) {
      if (!carton.tapadas[index]) { 
        completa = false; 
        break; 
      }
      const carta = carton.cartas[index];
      codigosLinea.push(carta.codigo);
      if (!codigosCantados.includes(carta.codigo)) { 
        completa = false; 
        break; 
      }
    }
    
    if (completa) {
      console.log(`✅ POKINO: Línea ${linea.join(',')} completada con cartas: ${codigosLinea.join(', ')}`);
      return true;
    }
  }
  
  return false;
}

setInterval(() => {
  const ahora = Date.now();
  const emailsAEliminar = [];
  
  for (const email in gameState.jugadores) {
    if (gameState.jugadores[email].desconectado && 
        ahora - gameState.jugadores[email].timestamp > 7200000) {
      emailsAEliminar.push(email);
      gameState.cartones.forEach(carton => {
        if (carton.dueño === email) carton.dueño = null;
      });
    }
  }
  
  emailsAEliminar.forEach(email => {
    delete gameState.jugadores[email];
    console.log(`🗑️ Jugador eliminado por inactividad: ${email}`);
  });
  
  if (emailsAEliminar.length > 0) {
    io.emit('updateCartones', gameState.cartones);
    io.emit('updateJugadores', gameState.jugadores);
  }
}, 60000);

// ============================================================================
// 🚀 INICIAR SERVIDOR
// ============================================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR ACTIVO      ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log(`║  📡 Puerto: ${PORT}                                        `);
  console.log(`║  🌐 URL: https://sabaditos-alegres.onrender.com            `);
  console.log('║  🎴 13 cartones fijos (12 PDFs + 1 código)               ║');
  console.log('║  🏆 6 Pozos: POKINO, 4 ESQUINAS, FULL, POKER, CENTRO, ESPECIAL ║');
  console.log('║  ⭐ ESPECIAL: 25 cartas (CARTÓN LLENO)                   ║');
  console.log('║  💰 VALOR FICHA: $50 COP                                  ║');
  console.log('║  🎰 APUESTA POR PARTIDA: 6 fichas ($300 COP)             ║');
  console.log('║  🏦 SISTEMA DE BANCO: ACTIVO                              ║');
  console.log('║  🏆 POZOS DINÁMICOS: Inician en $0                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
});