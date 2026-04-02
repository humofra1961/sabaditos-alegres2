// ============================================================================
// 🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR PRINCIPAL
// ============================================================================
// Versión: 2.0 (Arquitectura Modular)
// ============================================================================

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

// ============================================================================
// 🚀 CONFIGURACIÓN DEL SERVIDOR
// ============================================================================

const app = express();
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// ============================================================================
// 📁 SERVICIO DE ARCHIVOS ESTÁTICOS
// ============================================================================

app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/img', express.static(path.join(__dirname, '../img')));

// Ruta principal
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============================================================================
// 🏆 CONFIGURACIÓN DEL JUEGO
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
  { numero: 12, nombre: 'Cartón K', poker: 'K', full2: 'Q', full3: '9', pokerFila: 2, fullFila: 4, cartas: ['Ac', '8c', '8d', '9t', '4p', 'kt', 'kc', '5d', 'kd', 'kp', '2p', '10c', '6d', '6c', '10p', 'qc', '9p', '9d', 'qt', '9c', 'jc', '2c', '7d', 'At', 'jt'] },
  { numero: 13, nombre: 'Cartón Complemento', poker: '2', full2: 'Q', full3: 'K', pokerFila: 3, fullFila: 4, cartas: ['jp', '4p', '9t', 'At', '8d', '3c', '4d', '5t', '6p', '7c', '2p', '2d', '2c', '2t', '3t', 'qd', 'qc', 'kd', 'kp', 'kt', '5c', '6d', '7t', '8p', '9c'] }
];

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
  historialPremios: [],  // ✅ NUEVO: Track de TODOS los premios (reclamados o no)
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
// 🎴 GENERAR CARTONES Y MAZO
// ============================================================================

function generarCartonesFijos() {
  console.log('🚀 Generando 13 cartones...');
  const cartones = distribucionesCartones.map(function(dist) {
    const cartas = dist.cartas.map(function(codigo, index) {
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
  console.log('✅ Generados ' + cartones.length + ' cartones');
  return cartones;
}

function generarMazo() {
  const palos = ['p', 'c', 'd', 't'];
  const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const simbolos = { 'p': '♠', 'c': '♥', 'd': '♦', 't': '♣' };
  const colores = { 'p': 'black', 'c': 'red', 'd': 'red', 't': 'black' };
  let mazo = [];
  for (let i = 0; i < palos.length; i++) {
    for (let j = 0; j < valores.length; j++) {
      mazo.push({
        palo: simbolos[palos[i]],
        valor: valores[j],
        color: colores[palos[i]],
        codigo: valores[j] + palos[i]
      });
    }
  }
  return mazo;
}

function barajarMazo(mazo) {
  const mazoBarajado = mazo.slice();
  for (let i = mazoBarajado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = mazoBarajado[i];
    mazoBarajado[i] = mazoBarajado[j];
    mazoBarajado[j] = temp;
  }
  return mazoBarajado;
}

// ============================================================================
// ✅ VALIDACIÓN COMPLETA DE APUESTAS - 3 NIVELES - CORREGIDA
// ============================================================================

function verificarJugadoresListos() {
  const jugadoresListos = [];
  const jugadoresNoListos = [];
  let totalCartones = 0;
  let totalFichasDeberianApostar = 0;
  let totalFichasApostadas = 0;
  
  Object.keys(gameState.jugadores).forEach(function(email) {
    const jugador = gameState.jugadores[email];
    const cartonesJugador = jugador.cartones ? jugador.cartones.length : 0;
    const fichasDeberianApostar = cartonesJugador * 6;
    const fichasYaApostadas = jugador.fichasApostadas || 0;
    
    totalCartones += cartonesJugador;
    totalFichasDeberianApostar += fichasDeberianApostar;
    totalFichasApostadas += fichasYaApostadas;
    
    // ✅ CORRECCIÓN: Si el jugador YA APOSTÓ, está listo (independiente del saldo actual)
    if (fichasYaApostadas >= fichasDeberianApostar && fichasDeberianApostar > 0) {
      jugadoresListos.push({
        email: email,
        nombre: jugador.nombre,
        monedas: jugador.monedas,
        cartones: cartonesJugador,
        fichasApostadas: fichasYaApostadas,
        fichasDeberianApostar: fichasDeberianApostar
      });
      return;
    }
    
    // NIVEL 1: Verificar mínimo 40 fichas (solo si NO ha apostado aún)
    if (jugador.monedas < 40 && fichasYaApostadas === 0) {
      jugadoresNoListos.push({
        email: email,
        nombre: jugador.nombre,
        razon: 'Saldo insuficiente (' + jugador.monedas + ' fichas, mín. 40)',
        monedas: jugador.monedas,
        cartones: cartonesJugador,
        fichasApostadas: fichasYaApostadas,
        fichasDeberianApostar: fichasDeberianApostar,
        nivel: 1
      });
      return;
    }
    
    // NIVEL 2: Verificar al menos 1 cartón
    if (cartonesJugador === 0) {
      jugadoresNoListos.push({
        email: email,
        nombre: jugador.nombre,
        razon: 'No ha seleccionado ningún cartón (mín. 1)',
        monedas: jugador.monedas,
        cartones: cartonesJugador,
        fichasApostadas: fichasYaApostadas,
        fichasDeberianApostar: fichasDeberianApostar,
        nivel: 2
      });
      return;
    }
    
    // NIVEL 3: Verificar apuesta según número de cartones
    if (fichasYaApostadas < fichasDeberianApostar) {
      jugadoresNoListos.push({
        email: email,
        nombre: jugador.nombre,
        razon: 'Apuesta insuficiente. Tiene ' + cartonesJugador + ' cartón(es) → debe apostar ' + fichasDeberianApostar + ' fichas (lleva ' + fichasYaApostadas + ')',
        monedas: jugador.monedas,
        cartones: cartonesJugador,
        fichasApostadas: fichasYaApostadas,
        fichasDeberianApostar: fichasDeberianApostar,
        nivel: 3
      });
      return;
    }
    
    // ✅ Jugador listo
    jugadoresListos.push({
      email: email,
      nombre: jugador.nombre,
      monedas: jugador.monedas,
      cartones: cartonesJugador,
      fichasApostadas: fichasYaApostadas,
      fichasDeberianApostar: fichasDeberianApostar
    });
  });
  
  return {
    listos: jugadoresListos,
    noListos: jugadoresNoListos,
    todosListos: jugadoresNoListos.length === 0,
    totalJugadores: Object.keys(gameState.jugadores).length,
    totalCartones: totalCartones,
    totalFichasDeberianApostar: totalFichasDeberianApostar,
    totalFichasApostadas: totalFichasApostadas,
    resumen: '📊 ' + totalCartones + ' cartones en juego → ' + totalFichasDeberianApostar + ' fichas en pozos ($' + (totalFichasDeberianApostar * 50) + ' COP)'
  };
}

// ============================================================================
// ✅ VALIDACIÓN DE POZOS - CORREGIDA (SINTAXIS ARREGLADA)
// ============================================================================

function verificarPozo(carton, pozo, codigosCantados, ultimaCartaCodigo) {
  console.log('🔍 Verificando pozo:', pozo, 'Cartón:', carton.numero, 'Última carta:', ultimaCartaCodigo, 'Partida:', gameState.partidaActual);
  
  // ✅ CORRECCIÓN: CENTRO solo válido antes de la 6ta carta (EXCEPTO en Partida 6/ESPECIAL)
  if (pozo === 'centro') {
    if (gameState.partidaActual === 6) {
      console.log('  ✅ ESPECIAL (Partida 6): CENTRO válido en cualquier momento');
    } else {
      if (codigosCantados.length > 5) {
        console.log('  ❌ CENTRO: Ya se cantaron más de 5 cartas (' + codigosCantados.length + '). Solo válido hasta la 5ta carta en partidas 1-5.');
        return false;
      }
      console.log('  ✅ CENTRO: ' + codigosCantados.length + ' cartas cantadas (válido hasta 5)');
    }
  }
    function verificarCartas(indices) {
      console.log('  Verificando índices:', indices);
      for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      
      if (!carton.tapadas[index]) {
        console.log('  ❌ Carta', index, 'NO está tapada');
        return false;
      }
      
      const carta = carton.cartas[index];
      if (!carta) {
        console.log('  ❌ Carta', index, 'NO existe');
        return false;
      }
      
      const codigoEncontrado = codigosCantados.indexOf(carta.codigo);
      if (codigoEncontrado === -1) {
        console.log('  ❌ Carta', carta.codigo, 'NO está en cartas cantadas');
        return false;
      }
      
      console.log('  ✅ Carta', index, carta.codigo, 'OK (tapada y cantada)');
    }
    
    // ✅ TODOS LOS PREMIOS: Verificar que la última carta esté en este pozo
    if (ultimaCartaCodigo) {
      const ultimaCartaEnPozo = indices.some(function(index) {
        return carton.cartas[index] && carton.cartas[index].codigo === ultimaCartaCodigo;
      });
      
      if (!ultimaCartaEnPozo) {
        console.log('  ❌ La última carta cantada NO está en este pozo');
        return false;
      }
      console.log('  ✅ La última carta cantada SÍ está en este pozo');
    }
    
    return true;
  }
  // POKER - 4 cartas del mismo valor (índices configurados en carton.pokerFila)
  if (pozo === 'poker') {
    const fila = carton.pokerFila || 3;
    let indices = [];
    if (fila === 1) indices = [0, 1, 2, 3];
    else if (fila === 2) indices = [5, 6, 7, 8];
    else if (fila === 3) indices = [10, 11, 12, 13];
    else if (fila === 4) indices = [15, 16, 17, 18];
    else indices = [10, 11, 12, 13];
    
    const valido = verificarCartas(indices);
    console.log('  POKER (sin última carta):', valido ? '✅ VÁLIDO' : '❌ INVÁLIDO');
    return valido;
  }
  
  return false;
}
  
  function verificarCartas(indices) {
    console.log('  Verificando índices:', indices);
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      
      if (!carton.tapadas[index]) {
        console.log('  ❌ Carta', index, 'NO está tapada');
        return false;
      }
      
      const carta = carton.cartas[index];
      if (!carta) {
        console.log('  ❌ Carta', index, 'NO existe');
        return false;
      }
      
      const codigoEncontrado = codigosCantados.indexOf(carta.codigo);
      if (codigoEncontrado === -1) {
        console.log('  ❌ Carta', carta.codigo, 'NO está en cartas cantadas');
        return false;
      }
      
      console.log('  ✅ Carta', index, carta.codigo, 'OK (tapada y cantada)');
    }
    
    // ✅ CORRECCIÓN POKINO: Verificar que la última carta cantada esté en esta línea
    if (ultimaCartaCodigo && pozo === 'pokino') {
      const ultimaCartaEnLinea = indices.some(function(index) {
        return carton.cartas[index] && carton.cartas[index].codigo === ultimaCartaCodigo;
      });
      
      if (!ultimaCartaEnLinea) {
        console.log('  ❌ La última carta cantada NO está en esta línea');
        return false;
      }
      console.log('  ✅ La última carta cantada SÍ está en esta línea');
    }
    
    // ✅ OTROS POZOS: Verificar que la última carta esté en el pozo
    if (ultimaCartaCodigo && pozo !== 'pokino' && pozo !== 'centro') {
      const ultimaCartaEnPozo = indices.some(function(index) {
        return carton.cartas[index] && carton.cartas[index].codigo === ultimaCartaCodigo;
      });
      
      if (!ultimaCartaEnPozo) {
        console.log('  ❌ La última carta cantada NO está en este pozo');
        return false;
      }
      console.log('  ✅ La última carta cantada SÍ está en este pozo');
    }
    
    return true;
  }
  
  // ESPECIAL - 25 cartas
  if (pozo === 'especial') {
    var indicesEspecial = [];
    for (var i = 0; i < 25; i++) indicesEspecial.push(i);
    const valido = verificarCartas(indicesEspecial);
    console.log('  ESPECIAL:', valido ? '✅ VÁLIDO' : '❌ INVÁLIDO');
    return valido;
  }
  // CENTRO - 1 carta (índice 12)
  if (pozo === 'centro') {
    // ✅ CENTRO ya tiene validación de máximo 5 cartas cantadas (ver inicio de función)
    const valido = verificarCartas([12]);
    console.log('  CENTRO:', valido ? '✅ VÁLIDO' : '❌ INVÁLIDO');
    
    // ✅ CORRECCIÓN: Verificar que el CENTRO sea la última carta cantada
    if (valido && ultimaCartaCodigo) {
      const cartaCentro = carton.cartas[12];
      if (!cartaCentro || cartaCentro.codigo !== ultimaCartaCodigo) {
        console.log('  ❌ CENTRO: La última carta cantada NO es el centro');
        return false;
      }
      console.log('  ✅ CENTRO: La última carta cantada SÍ es el centro');
    }
    
    return valido;
  }  
  // CUATRO ESQUINAS - índices 0, 4, 20, 24
  if (pozo === 'cuatroEsquinas') {
    const valido = verificarCartas([0, 4, 20, 24]);
    console.log('  4 ESQUINAS:', valido ? '✅ VÁLIDO' : '❌ INVÁLIDO');
    
  // ✅ CORRECCIÓN CORRECTA: Verificar que al menos UNA esquina sea la última carta cantada
  if (valido && ultimaCartaCodigo) {
    const ultimaCartaEnEsquinas = [0, 4, 20, 24].some(function(index) {
      return carton.cartas[index] && carton.cartas[index].codigo === ultimaCartaCodigo;
    });
    
    if (!ultimaCartaEnEsquinas) {
      console.log('  ❌ 4 ESQUINAS: La última carta cantada NO está en las esquinas');
      return false;
    }
    console.log('  ✅ 4 ESQUINAS: La última carta cantada SÍ está en las esquinas');
  }
  
  return valido;
}  
  // POKINO - 5 cartas en línea (horizontal, vertical o diagonal)
  if (pozo === 'pokino') {
    const lineas = [
      // Horizontales
      [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
      // Verticales
      [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
      // Diagonales
      [0,6,12,18,24], [4,8,12,16,20]
    ];
    
    for (let l = 0; l < lineas.length; l++) {
      if (verificarCartas(lineas[l])) {
        console.log('  POKINO: ✅ VÁLIDO (línea', l, ')');
        return true;
      }
    }
    console.log('  POKINO: ❌ INVÁLIDO (ninguna línea completa)');
    return false;
  }
  // POKER - 4 cartas del mismo valor (índices configurados en carton.pokerFila)
  if (pozo === 'poker') {
    const fila = carton.pokerFila || 3;
    let indices = [];
    if (fila === 1) indices = [0, 1, 2, 3];
    else if (fila === 2) indices = [5, 6, 7, 8];
    else if (fila === 3) indices = [10, 11, 12, 13];
    else if (fila === 4) indices = [15, 16, 17, 18];
    else indices = [10, 11, 12, 13];
    
    const valido = verificarCartas(indices);
    console.log('  POKER:', valido ? '✅ VÁLIDO' : '❌ INVÁLIDO');
    
    // ✅ CORRECCIÓN: Verificar que al menos UNA carta del POKER sea la última carta cantada
    if (valido && ultimaCartaCodigo) {
      const ultimaCartaEnPoker = indices.some(function(index) {
        return carton.cartas[index] && carton.cartas[index].codigo === ultimaCartaCodigo;
      });
      
      if (!ultimaCartaEnPoker) {
        console.log('  ❌ POKER: La última carta cantada NO está en el POKER');
        return false;
      }
      console.log('  ✅ POKER: La última carta cantada SÍ está en el POKER');
    }
    
    return valido;
  }  
  
  // FULL - 5 cartas (2 de un valor + 3 de otro) (índices configurados en carton.fullFila)
  if (pozo === 'full') {
    const fila = carton.fullFila || 4;
    let indices = [];
    if (fila === 1) indices = [0, 1, 2, 3, 4];
    else if (fila === 2) indices = [5, 6, 7, 8, 9];
    else if (fila === 3) indices = [10, 11, 12, 13, 14];
    else if (fila === 4) indices = [15, 16, 17, 18, 19];
    else if (fila === 5) indices = [20, 21, 22, 23, 24];
    else indices = [15, 16, 17, 18, 19];
    
    const valido = verificarCartas(indices);
    console.log('  FULL:', valido ? '✅ VÁLIDO' : '❌ INVÁLIDO');
    
    // ✅ CORRECCIÓN: Verificar que al menos UNA carta del FULL sea la última carta cantada
    if (valido && ultimaCartaCodigo) {
      const ultimaCartaEnFull = indices.some(function(index) {
        return carton.cartas[index] && carton.cartas[index].codigo === ultimaCartaCodigo;
      });
      
      if (!ultimaCartaEnFull) {
        console.log('  ❌ FULL: La última carta cantada NO está en el FULL');
        return false;
      }
      console.log('  ✅ FULL: La última carta cantada SÍ está en el FULL');
    }
    
    return valido;
  }  
 
 // ============================================================================
 // ✅ VERIFICAR PREMIOS COMPLETADOS
 // ============================================================================

function verificarPremiosCompletados() {
  const premiosDetectados = [];
  const codigosCantados = gameState.cartasCantadas.map(function(c) { return c.codigo; });
  
  gameState.cartones.forEach(function(carton) {
    if (!carton.dueño) return;
    
    Object.keys(pozosConfig).forEach(function(pozo) {
      if (carton.pozos[pozo]) return;
      
      if (verificarPozo(carton, pozo, codigosCantados)) {
        premiosDetectados.push({
          carton: carton.numero,
          nombreCarton: carton.nombre,
          pozo: pozo,
          nombrePozo: pozosConfig[pozo].nombre,
          jugador: gameState.jugadores[carton.dueño] ? gameState.jugadores[carton.dueño].nombre : carton.dueño,
          email: carton.dueño,
          premio: gameState.pozosDinamicos[pozo].total,
          fichas: gameState.pozosDinamicos[pozo].fichas,
          timestamp: Date.now()
        });
      }
    });
  });
  
  if (premiosDetectados.length > 0 && gameState.cantador) {
    gameState.premiosPendientes.push.apply(gameState.premiosPendientes, premiosDetectados);
  }
}

// ============================================================================
// 🔌 CONEXIONES SOCKET.IO
// ============================================================================

io.on('connection', function(socket) {
  console.log('✅ Jugador conectado:', socket.id);
  
  if (gameState.cartones.length === 0) {
    gameState.cartones = generarCartonesFijos();
    gameState.mazo = barajarMazo(generarMazo());
  }
  
  socket.emit('gameState', gameState);
  
  // ✅ REGISTRO DE JUGADOR
  socket.on('registerPlayer', function(email, nombre) {
    console.log('👤 Jugador registrado: ' + nombre + ' (' + email + ')');
    
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
        nombre: nombre, 
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
          nombre: nombre, monedas: 0, ganadas: 0, perdidas: 0, pozosGanados: [], historial: [],
          fichasCompradas: 0, fichasGanadas: 0, fichasApostadas: 0, balanceFinal: 0
        };
      }
    }
    
    io.emit('updateJugadores', gameState.jugadores);
    io.emit('updateEstadisticas', gameState.estadisticas);
    io.emit('updateBanco', gameState.banco);
    io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
    socket.emit('updateCantador', gameState.cantador);
  });
  
  // ✅ COMPRAR FICHAS
  socket.on('comprarFichas', function(email, cantidadFichas) {
    console.log('💰 Compra solicitada:', email, cantidadFichas);
    
    if (!gameState.jugadores[email]) {
      console.error('❌ Jugador no encontrado:', email);
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
    
    console.log('✅ Compra registrada:', gameState.jugadores[email].nombre, cantidadFichas, 'fichas. Total:', gameState.jugadores[email].monedas);
    
    io.emit('updateJugadores', gameState.jugadores);
    io.emit('updateEstadisticas', gameState.estadisticas);
    io.emit('updateBanco', gameState.banco);
    io.emit('fichasCompradas', {
      jugador: gameState.jugadores[email].nombre,
      fichas: cantidadFichas,
      valor: costoTotal,
      total: gameState.jugadores[email].monedas
    });
  });
  
  // ✅ APOSTAR EN POZOS - CORREGIDO
  socket.on('apostarEnPozos', function(email) {
    if (!gameState.jugadores[email]) {
      socket.emit('error', 'Jugador no encontrado.');
      return;
    }
    
    const jugador = gameState.jugadores[email];
    const cartonesJugador = jugador.cartones ? jugador.cartones.length : 0;
    
    if (cartonesJugador === 0) {
      socket.emit('error', 'Debes seleccionar al menos 1 cartón antes de apostar.');
      return;
    }
    
    // ✅ CÁLCULO CORRECTO: 6 fichas por cartón
    const fichasRequeridas = cartonesJugador * 6;
    const costoTotal = fichasRequeridas * VALOR_FICHA;
    
    // Validar si YA apostó en esta partida
    if (jugador.fichasApostadas >= fichasRequeridas) {
      socket.emit('error', 'Ya apostaste ' + jugador.fichasApostadas + ' fichas para ' + cartonesJugador + ' cartones en esta partida.');
      return;
    }
    
    // Validar saldo mínimo después de apostar (18 fichas)
    const saldoDespuesDeApuesta = jugador.monedas - fichasRequeridas;
    if (saldoDespuesDeApuesta < 18) {
      socket.emit('error', 'Saldo insuficiente. Después de apostar te quedarían ' + saldoDespuesDeApuesta + ' fichas. Necesitas mantener al menos 18 fichas para la siguiente partida.');
      return;
    }
    
    // Validar saldo actual
    if (jugador.monedas < fichasRequeridas) {
      socket.emit('error', 'No tienes suficientes fichas. Necesitas ' + fichasRequeridas + ' fichas ($' + costoTotal + ' COP) para ' + cartonesJugador + ' cartones.');
      return;
    }
    
    // ✅ Descontar fichas del jugador
    jugador.monedas -= fichasRequeridas;
    jugador.fichasApostadas = fichasRequeridas;
    
    // ✅ CORRECCIÓN: Distribuir fichas por pozo
    const fichasPorPozo = cartonesJugador;
    
    Object.keys(gameState.pozosDinamicos).forEach(function(pozo) {
      gameState.pozosDinamicos[pozo].acumulado += fichasPorPozo;
      gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase + (gameState.pozosDinamicos[pozo].acumulado * VALOR_FICHA);
      gameState.pozosDinamicos[pozo].fichas = gameState.pozosDinamicos[pozo].acumulado;
    });
    
    jugador.historialTransacciones.push({
      tipo: 'APUESTA_POZOS',
      fichas: fichasRequeridas,
      valor: costoTotal,
      fecha: new Date().toISOString(),
      partida: gameState.partidaActual,
      cartones: cartonesJugador,
      fichasPorPozo: fichasPorPozo
    });
    
    gameState.banco.totalRecaudado += costoTotal;
    
    io.emit('updateJugadores', gameState.jugadores);
    io.emit('updateEstadisticas', gameState.estadisticas);
    io.emit('updateBanco', gameState.banco);
    io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
    
    socket.emit('apuestaRealizada', {
      fichas: fichasRequeridas,
      cartones: cartonesJugador,
      fichasPorPozo: fichasPorPozo,
      valor: costoTotal,
      saldoRestante: jugador.monedas,
      mensaje: '✅ Apostaste ' + fichasRequeridas + ' fichas (' + cartonesJugador + ' cartones × 6). ' + fichasPorPozo + ' fichas por pozo. Saldo restante: ' + jugador.monedas + ' fichas'
    });
    
    console.log('🎰 Apuesta registrada:', email, 'apostó', fichasRequeridas, 'fichas para', cartonesJugador, 'cartones. Fichas por pozo:', fichasPorPozo, 'Saldo:', jugador.monedas);
  });
  
  // ✅ AGREGAR MONEDAS (Cantador)
  socket.on('agregarMonedas', function(emailJugador, cantidad, emailCantador) {
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
  socket.on('seleccionarCarton', function(numero, email, nombre) {
    console.log('🎴 Intentando seleccionar cartón ' + numero + ' para ' + email);
    
    if (gameState.faseJuego !== 'seleccion') {
      socket.emit('error', 'La selección está cerrada.');
      return;
    }
    
    const carton = gameState.cartones.find(function(c) { return c.numero === numero; });
    
    if (!carton) {
      socket.emit('error', 'Cartón no encontrado.');
      return;
    }
    
    if (!carton.cartas || !Array.isArray(carton.cartas) || carton.cartas.length !== 25) {
      console.error('❌ Cartón ' + numero + ' inválido:', carton);
      socket.emit('error', 'Cartón inválido.');
      return;
    }
    
    if (gameState.jugadores[email].cartones.length >= 3 && !carton.dueño) {
      socket.emit('error', 'Máximo 3 cartones por jugador.');
      return;
    }
    
    if (!carton.dueño || carton.dueño === email) {
      carton.dueño = email;
      
      if (gameState.jugadores[email].cartones.indexOf(numero) === -1) {
        gameState.jugadores[email].cartones.push(numero);
      }
      
      console.log('✅ Cartón ' + numero + ' asignado a ' + email);
      
      io.emit('updateCartones', gameState.cartones);
      io.emit('updateJugadores', gameState.jugadores);
      io.emit('updateEstadisticas', gameState.estadisticas);
    } else {
      socket.emit('cartonBloqueado', numero);
    }
  });
  
  // ✅ LIBERAR CARTÓN
  socket.on('liberarCarton', function(numero, email) {
    if (gameState.faseJuego !== 'seleccion') {
      socket.emit('error', 'La selección está cerrada.');
      return;
    }
    
    const carton = gameState.cartones.find(function(c) { return c.numero === numero; });
    if (carton && carton.dueño === email) {
      carton.dueño = null;
      gameState.jugadores[email].cartones = gameState.jugadores[email].cartones.filter(function(n) { return n !== numero; });
      
      io.emit('updateCartones', gameState.cartones);
      io.emit('updateJugadores', gameState.jugadores);
      io.emit('updateEstadisticas', gameState.estadisticas);
    }
  });
  
  // ✅ TAPAR CARTA
  socket.on('taparCarta', function(numeroCarton, index, email) {
    const carton = gameState.cartones.find(function(c) { return c.numero === numeroCarton; });
    if (carton && carton.dueño === email) {
      carton.tapadas[index] = !carton.tapadas[index];
      io.emit('updateCartones', gameState.cartones);
    }
  });
  
  // ✅ ESTABLECER CANTADOR
  socket.on('establecerCantador', function(email) {
    if (gameState.cantador && gameState.cantador !== email) {
      socket.emit('error', 'Ya hay un cantador en esta partida.');
      return;
    }
    gameState.cantador = email;
    gameState.cantadorAnterior = email;
    io.emit('updateCantador', email);
    io.emit('updateJugadores', gameState.jugadores);
    console.log('🎤 Cantador establecido:', email);
  });
  
  // ✅ CANTAR CARTA
  socket.on('cantarCartaAleatoria', function(email) {
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
    io.emit('cartaCantada', { carta: carta, total: gameState.indiceMazo });
    
    console.log('🃏 Carta #' + gameState.indiceMazo + ':', carta.palo + carta.valor);
    
    verificarPremiosCompletados();
    
    if (gameState.indiceMazo >= 52) {
      io.emit('mazoAgotado', { 
        mensaje: '⚠️ ¡SE ACABARON LAS 52 CARTAS! Verifiquen el pozo ESPECIAL',
        totalCartas: gameState.indiceMazo
      });
    }
  });
  
  // ✅ INICIAR JUEGO (CON VALIDACIÓN)
  socket.on('iniciarJuego', function(email) {
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
        mensaje: '🎊 ESPECIAL INICIADO - PARTIDA 6: ¡LLENAR CARTÓN!', 
        partida: gameState.partidaActual,
        esEspecial: true
      });
    } else {
      io.emit('juegoIniciado', { 
        mensaje: '¡PARTIDA ' + gameState.partidaActual + ' INICIADA!', 
        partida: gameState.partidaActual,
        esEspecial: false
      });
    }
    
    console.log('🎮 Juego iniciado -', validacion.listos.length, 'jugadores listos');
  });
  
  // ✅ SOLICITAR ESTADO DE APUESTAS
  socket.on('solicitarEstadoApuestas', function(email) {
    if (gameState.cantador !== email) {
      socket.emit('error', 'Solo el cantador puede verificar.');
      return;
    }
    
    const validacion = verificarJugadoresListos();
    console.log('📋 Validación completada:', validacion);
    
    socket.emit('estadoApuestas', validacion);
    
    if (!validacion.todosListos) {
      io.emit('notificacionCantador', {
        tipo: 'verificacion',
        mensaje: '📋 El cantador está verificando apuestas... ' + validacion.noListos.length + ' jugadores deben completar requisitos',
        validacion: validacion
      });
    }
  });

  // ✅ RECLAMAR PREMIO - CON VALIDACIÓN DE ÚLTIMA CARTA PARA TODOS
  socket.on('reclamarPremio', function(numeroCarton, pozo, email) {
    console.log('🏆 Reclamando premio:', pozo, 'Cartón:', numeroCarton, 'Jugador:', email, 'Partida:', gameState.partidaActual);
    
    const carton = gameState.cartones.find(function(c) { return c.numero === numeroCarton; });
    if (!carton || carton.dueño !== email) {
      socket.emit('error', 'No tienes este cartón.');
      return;
    }
    if (carton.pozos[pozo]) {
      socket.emit('error', 'Este pozo ya fue reclamado.');
      return;
    }
    
    const codigosCantados = gameState.cartasCantadas.map(function(c) { return c.codigo; });
    const ultimaCartaCodigo = gameState.ultimaCarta ? gameState.ultimaCarta.codigo : null;
    
    // ✅ CORRECCIÓN: Validación específica para CENTRO (máximo 5 cartas)
    if (pozo === 'centro' && gameState.partidaActual !== 6 && codigosCantados.length > 5) {
      socket.emit('error', '❌ El pozo CENTRO se reclama antes de la sexta carta cantada. Llevas ' + codigosCantados.length + ' cartas cantadas. En la Partida 6 (ESPECIAL) esta regla no aplica.');
      return;
    }
    
    // ✅ TODOS LOS PREMIOS usan la misma validación con última carta
    const valido = verificarPozo(carton, pozo, codigosCantados, ultimaCartaCodigo);
    
    if (valido) {
      io.emit('alertaGanador', {
        carton: numeroCarton,
        pozo: pozosConfig[pozo].nombre,
        jugador: gameState.jugadores[email] ? gameState.jugadores[email].nombre : email,
        email: email,
        premio: gameState.pozosDinamicos[pozo].total,
        fichas: gameState.pozosDinamicos[pozo].fichas,
        mensaje: '🏆 ¡' + (gameState.jugadores[email] ? gameState.jugadores[email].nombre : email) + ' RECLAMA ' + pozosConfig[pozo].nombre + '!',
        esEspecial: pozo === 'especial'
      });
    } else {
      let mensajeError = '';
      if (pozo === 'pokino') {
        mensajeError = 'POKINO no está completo. Verifica que las 5 cartas de una línea estén tapadas y que la última carta cantada esté en esa línea.';
      } else if (pozo === 'especial') {
        mensajeError = 'ESPECIAL no está completo. Verifica que las 25 cartas estén tapadas y que la última carta cantada esté en el cartón.';
      } else {
        mensajeError = pozosConfig[pozo].nombre + ' no está completo. La última carta cantada debe estar en este premio.';
      }
      socket.emit('error', mensajeError);
    }    
  });
  
    // ✅ CORRECCIÓN: Validación específica para CENTRO
    if (pozo === 'centro' && gameState.partidaActual !== 6 && codigosCantados.length > 5) {
      socket.emit('error', '❌ El pozo CENTRO se reclama antes de la sexta carta cantada. Llevas ' + codigosCantados.length + ' cartas cantadas. En la Partida 6 (ESPECIAL) esta regla no aplica.');
      return;
    }
    
    const valido = verificarPozo(carton, pozo, codigosCantados, ultimaCartaCodigo);
    
    if (valido) {
      io.emit('alertaGanador', {
        carton: numeroCarton,
        pozo: pozosConfig[pozo].nombre,
        jugador: gameState.jugadores[email] ? gameState.jugadores[email].nombre : email,
        email: email,
        premio: gameState.pozosDinamicos[pozo].total,
        fichas: gameState.pozosDinamicos[pozo].fichas,
        mensaje: '🏆 ¡' + (gameState.jugadores[email] ? gameState.jugadores[email].nombre : email) + ' RECLAMA ' + pozosConfig[pozo].nombre + '!',
        esEspecial: pozo === 'especial'
      });
    } else {
      const mensajeError = pozo === 'pokino' ? 'POKINO no está completo. Verifica que las 5 cartas de una línea estén tapadas y que la última carta cantada esté en esa línea.' : pozosConfig[pozo].nombre + ' no está completo.';
      socket.emit('error', mensajeError);
    }
  });
  
  // ✅ CONFIRMAR PREMIO - CON DIVISIÓN MÚLTIPLE GANADORES Y ACTUALIZACIÓN CORRECTA
  socket.on('confirmarPremio', function(numeroCarton, pozo, emailGanador, emailCantador) {
    if (gameState.cantador !== emailCantador) {
      socket.emit('error', 'Solo el cantador puede confirmar.');
      return;
    }
    
    const carton = gameState.cartones.find(function(c) { return c.numero === numeroCarton; });
    const codigosCantados = gameState.cartasCantadas.map(function(c) { return c.codigo; });
    const ultimaCartaCodigo = gameState.ultimaCarta ? gameState.ultimaCarta.codigo : null;
    
    if (verificarPozo(carton, pozo, codigosCantados, ultimaCartaCodigo)) {
      carton.pozos[pozo] = true;
      
      const ganadores = [];
      gameState.cartones.forEach(function(c) {
        if (c.pozos[pozo] && c.dueño) {
          if (verificarPozo(c, pozo, codigosCantados, ultimaCartaCodigo)) {
            ganadores.push({
              email: c.dueño,
              carton: c.numero,
              nombre: gameState.jugadores[c.dueño] ? gameState.jugadores[c.dueño].nombre : c.dueño
            });
          }
        }
      });
      
      const premioTotal = gameState.pozosDinamicos[pozo].total;
      const fichasTotales = gameState.pozosDinamicos[pozo].fichas;
      const premioPorGanador = Math.floor(premioTotal / ganadores.length);
      const fichasPorGanador = Math.floor(fichasTotales / ganadores.length);
      
      console.log('🏆 Ganadores:', ganadores.length, 'Premio por ganador:', fichasPorGanador, 'fichas');
      
      // ✅ ACTUALIZAR BILLETERA DE CADA GANADOR
      ganadores.forEach(function(ganador) {
        if (gameState.jugadores[ganador.email]) {
          gameState.jugadores[ganador.email].monedas += fichasPorGanador;
          gameState.jugadores[ganador.email].fichasGanadas += fichasPorGanador;
          gameState.jugadores[ganador.email].pozosGanados.push({
            pozo: pozosConfig[pozo].nombre,
            premio: premioPorGanador,
            fichas: fichasPorGanador,
            partida: gameState.partidaActual,
            fecha: new Date().toISOString()
          });
          
          gameState.estadisticas[ganador.email].ganadas += 1;
          gameState.estadisticas[ganador.email].pozosGanados.push({
            pozo: pozosConfig[pozo].nombre,
            partida: gameState.partidaActual
          });
        }
        
        gameState.pozosGanados.push({ 
          carton: ganador.carton, 
          pozo: pozo, 
          jugador: ganador.email, 
          premio: premioPorGanador, 
          fichas: fichasPorGanador,
          partida: gameState.partidaActual, 
          timestamp: Date.now() 
        });
      });
      
      // ✅ CORRECCIÓN: Resetear POKINO después de pagar (los demás pozos acumulan)
      if (pozo === 'pokino') {
        gameState.pozosDinamicos[pozo].acumulado = 0;
        gameState.pozosDinamicos[pozo].total = gameState.pozosDinamicos[pozo].valorBase;
        gameState.pozosDinamicos[pozo].fichas = Math.floor(gameState.pozosDinamicos[pozo].total / VALOR_FICHA);
        console.log('🎰 POKINO reseteado a', gameState.pozosDinamicos[pozo].fichas, 'fichas');
      }
      
      gameState.banco.totalPagado += premioTotal;
      
      // ✅ CORRECCIÓN CRÍTICA: Emitir actualizaciones DESPUÉS de actualizar billetera y pozos
      io.emit('updateCartones', gameState.cartones);
      io.emit('updateJugadores', gameState.jugadores);  // ← Esto actualiza las billeteras
      io.emit('updatePozosDinamicos', gameState.pozosDinamicos);  // ← Esto actualiza los pozos
      io.emit('updateBanco', gameState.banco);
      io.emit('updateEstadisticas', gameState.estadisticas);
      
      console.log('✅ Emisiones enviadas: updateJugadores, updatePozosDinamicos');
      
      io.emit('premioConfirmado', {
        jugador: ganadores.map(function(g) { return g.nombre; }).join(', '),
        pozo: pozosConfig[pozo].nombre,
        premio: premioPorGanador,
        fichas: fichasPorGanador,
        ganadores: ganadores.length,
        esEspecial: pozo === 'especial'
      });
    } else {
      socket.emit('error', pozosConfig[pozo].nombre + ' no está completo.');
    }
  });

  // ✅ RECLAMAR PREMIO - CON VALIDACIÓN ESPECIAL PARA POKER
  socket.on('reclamarPremio', function(numeroCarton, pozo, email) {
    console.log('🏆 Reclamando premio:', pozo, 'Cartón:', numeroCarton, 'Jugador:', email, 'Partida:', gameState.partidaActual);
    
    const carton = gameState.cartones.find(function(c) { return c.numero === numeroCarton; });
    if (!carton || carton.dueño !== email) {
      socket.emit('error', 'No tienes este cartón.');
      return;
    }
    if (carton.pozos[pozo]) {
      socket.emit('error', 'Este pozo ya fue reclamado.');
      return;
    }
    
    const codigosCantados = gameState.cartasCantadas.map(function(c) { return c.codigo; });
    const ultimaCartaCodigo = gameState.ultimaCarta ? gameState.ultimaCarta.codigo : null;
    
    // ✅ CORRECCIÓN: Validación específica para CENTRO
    if (pozo === 'centro' && gameState.partidaActual !== 6 && codigosCantados.length > 5) {
      socket.emit('error', '❌ El pozo CENTRO se reclama antes de la sexta carta cantada. Llevas ' + codigosCantados.length + ' cartas cantadas. En la Partida 6 (ESPECIAL) esta regla no aplica.');
      return;
    }
    
    // ✅ CORRECCIÓN: POKER no requiere que la última carta esté en las 4 cartas del POKER
    // Si el jugador ya tiene POKINO válido, POKER también debería ser válido
    let valido = false;
    if (pozo === 'poker') {
      // Para POKER, solo verificar que las 4 cartas estén tapadas y cantadas
      // NO requerir que la última carta esté en el POKER
      valido = verificarPozoSinUltimaCarta(carton, pozo, codigosCantados);
    } else {
      valido = verificarPozo(carton, pozo, codigosCantados, ultimaCartaCodigo);
    }
    
    if (valido) {
      io.emit('alertaGanador', {
        carton: numeroCarton,
        pozo: pozosConfig[pozo].nombre,
        jugador: gameState.jugadores[email] ? gameState.jugadores[email].nombre : email,
        email: email,
        premio: gameState.pozosDinamicos[pozo].total,
        fichas: gameState.pozosDinamicos[pozo].fichas,
        mensaje: '🏆 ¡' + (gameState.jugadores[email] ? gameState.jugadores[email].nombre : email) + ' RECLAMA ' + pozosConfig[pozo].nombre + '!',
        esEspecial: pozo === 'especial'
      });
    } else {
      const mensajeError = pozo === 'pokino' ? 'POKINO no está completo. Verifica que las 5 cartas de una línea estén tapadas y que la última carta cantada esté en esa línea.' : pozosConfig[pozo].nombre + ' no está completo.';
      socket.emit('error', mensajeError);
    }
  });    
  
  // ✅ TOGGLE FASE SELECCIÓN
  socket.on('toggleFaseSeleccion', function(email) {
    if (gameState.cantador !== email) {
      socket.emit('error', 'Solo el cantador.');
      return;
    }
    gameState.faseJuego = gameState.faseJuego === 'seleccion' ? 'jugando' : 'seleccion';
    io.emit('updateFaseJuego', gameState.faseJuego);
  });
  
  // ✅ SIGUIENTE PARTIDA - CORREGIDO
  socket.on('siguientePartida', function(email) {
    if (gameState.cantador !== email) {
      socket.emit('error', 'Solo el cantador.');
      return;
    }
    
    if (gameState.partidaActual >= 6) {
      socket.emit('error', 'Partidas completadas. Reinicia el juego.');
      return;
    }
    
    console.log('➡️ Iniciando siguiente partida:', gameState.partidaActual + 1);
    
    gameState.cartasCantadas = [];
    gameState.ultimaCarta = null;
    gameState.juegoIniciado = false;
    gameState.faseJuego = 'seleccion';
    gameState.indiceMazo = 0;
    gameState.mazo = barajarMazo(generarMazo());
    gameState.premiosPendientes = [];
    
    gameState.cartones.forEach(function(carton) {
      carton.tapadas.fill(false);
      Object.keys(carton.pozos).forEach(function(k) { 
        carton.pozos[k] = false; 
      });
    });
    
    if (gameState.partidaActual === 5) {
      Object.keys(gameState.jugadores).forEach(function(email) {
        gameState.jugadores[email].fichasApostadas = 0;
      });
    }
    
    gameState.pozosDinamicos.pokino.acumulado = 0;
    gameState.pozosDinamicos.pokino.total = 0;
    gameState.pozosDinamicos.pokino.fichas = 0;
    
    gameState.partidaActual++;
    
    console.log('✅ Partida', gameState.partidaActual, 'iniciada');
    
    io.emit('gameState', gameState);
    io.emit('updateFaseJuego', 'seleccion');
    io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
    io.emit('updateCartones', gameState.cartones);
    io.emit('updateCartasCantadas', gameState.cartasCantadas);
    io.emit('updateUltimaCarta', null);
    
    io.emit('siguientePartida', { 
      partida: gameState.partidaActual,
      esEspecial: gameState.partidaActual === 6,
      mensaje: '➡️ Partida ' + gameState.partidaActual + ' iniciada. Realicen sus apuestas.'
    });
  });
  
  // ✅ REINICIAR JUEGO - CORREGIDO
  socket.on('reiniciarJuego', function(email) {
    if (gameState.cantador !== email) {
      socket.emit('error', 'Solo el cantador.');
      return;
    }
    
    console.log('🔄 Reiniciando juego completamente');
    
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
    
    Object.keys(gameState.pozosDinamicos).forEach(function(p) {
      gameState.pozosDinamicos[p].acumulado = 0;
      gameState.pozosDinamicos[p].total = 0;
      gameState.pozosDinamicos[p].fichas = 0;
    });
    
    gameState.cartones.forEach(function(c) { 
      c.dueño = null; 
      c.tapadas.fill(false); 
      Object.keys(c.pozos).forEach(function(k) { c.pozos[k] = false; }); 
    });
    
    Object.keys(gameState.jugadores).forEach(function(email) {
      gameState.jugadores[email].fichasApostadas = 0;
    });
    
    io.emit('gameState', gameState);
    io.emit('updateFaseJuego', 'seleccion');
    io.emit('updateCantador', null);
    io.emit('updateCartones', gameState.cartones);
    io.emit('updateBanco', gameState.banco);
    io.emit('updatePozosDinamicos', gameState.pozosDinamicos);
    
    console.log('✅ Juego reiniciado - Partida 1 de 6. Regla del CENTRO restablecida.');
  });
  
  // ✅ SOLICITUD DE CAMBIO
  socket.on('solicitarCambio', function(email, mensaje) {
    const solicitud = {
      id: Date.now(),
      email: email,
      nombre: gameState.jugadores[email] ? gameState.jugadores[email].nombre : email,
      mensaje: mensaje,
      timestamp: Date.now()
    };
    gameState.solicitudes.push(solicitud);
    io.emit('updateSolicitudes', gameState.solicitudes);
  });
  
  socket.on('responderSolicitud', function(solicitudId, emailCantador, aprobar) {
    if (gameState.cantador !== emailCantador) {
      socket.emit('error', 'Solo el cantador.');
      return;
    }
    
    const index = gameState.solicitudes.findIndex(function(s) { return s.id === solicitudId; });
    if (index !== -1) {
      const solicitud = gameState.solicitudes[index];
      if (aprobar) {
        gameState.faseJuego = 'seleccion';
        io.emit('updateFaseJuego', 'seleccion');
      }
      gameState.solicitudes.splice(index, 1);
      io.emit('updateSolicitudes', gameState.solicitudes);
      
      const jugadorSocket = io.sockets.sockets.get(gameState.jugadores[solicitud.email] ? gameState.jugadores[solicitud.email].socketId : null);
      if (jugadorSocket) {
        jugadorSocket.emit('solicitudRespondida', { aprobada: aprobar });
      }
    }
  });
  
  // ✅ DESCONECTAR
  socket.on('disconnect', function() {
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
          
          io.emit('updateCantador', null);
          io.emit('updateJugadores', gameState.jugadores);
          io.emit('cantadorDesconectado', {
            mensaje: '⚠️ El cantador se desconectó.',
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
// 🚀 INICIAR SERVIDOR
// ============================================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', function() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🎪 BINGO POKER - SABADITO ALEGRE - SERVIDOR ACTIVO      ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log('║ 📡 Puerto:', PORT);
  console.log('║ 🌐 URL: https://sabaditos-alegres2-1.onrender.com');
  console.log('║  🎴 13 cartones oficiales');
  console.log('║  🏆 6 Pozos dinámicos');
  console.log('║  💰 VALOR FICHA: $50 COP');
  console.log('╚═══════════════════════════════════════════════════════════╝');
});

process.on('uncaughtException', function(err) {
  console.error('❌ Error no capturado:', err);
});

process.on('unhandledRejection', function(reason, promise) {
  console.error('❌ Promesa rechazada:', reason);
});
