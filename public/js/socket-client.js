// ============================================================================
// 🔌 CLIENTE SOCKET.IO - CONEXIÓN Y EVENTOS
// ============================================================================

const socketClient = {
  conectar: () => {
    socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket conectado:', socket.id);
      ui.actualizarEstadoConexion(true);
    });
    
    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
      ui.actualizarEstadoConexion(false);
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Socket desconectado');
      ui.actualizarEstadoConexion(false);
    });
    
    // Registrar todos los event listeners
    socketClient.registrarEventos();
  },
  
  registrarEventos: () => {
    socket.on('gameState', (state) => {
      app.gameState = state;
      ui.renderizarTodo();
    });
    
    socket.on('updateJugadores', (jugadores) => {
      app.gameState.jugadores = jugadores;
      ui.renderizarJugadores();
      ui.actualizarSelectJugadores();
      if (jugadores[app.emailActual]) {
        ui.actualizarMonedas(jugadores[app.emailActual].monedas);
      }
    });
    
    socket.on('updateCartones', (cartones) => {
      app.gameState.cartones = cartones;
      cartones.renderizarGrid();
      cartones.renderizarMisCartones();
    });
    
    socket.on('updateCartasCantadas', (cartas) => {
      app.gameState.cartasCantadas = cartas;
      ui.renderizarCartasPorPintas();
      document.getElementById('contadorCartas').textContent = cartas.length;
    });
    
    socket.on('updateUltimaCarta', (carta) => {
      ui.renderizarUltimaCarta(carta);
    });
    
    socket.on('updateFaseJuego', (fase) => {
      app.gameState.faseJuego = fase;
      ui.actualizarFaseJuego(fase);
    });
    
    socket.on('updateCantador', (email) => {
      app.gameState.cantador = email;
      ui.actualizarPanelCantador(email);
    });
    
    socket.on('updatePozosDinamicos', (pozos) => {
      app.gameState.pozosDinamicos = pozos;
      pozos.renderizar();
    });
    
    socket.on('updateBanco', (banco) => {
      app.gameState.banco = banco;
      ui.actualizarBanco(banco);
    });
    
    socket.on('validacionFallida', (data) => {
      ui.mostrarValidacionFallida(data);
    });
    
    socket.on('estadoApuestas', (data) => {
      ui.mostrarEstadoApuestas(data);
    });
    
    socket.on('juegoIniciado', (data) => {
      ui.mostrarJuegoIniciado(data);
    });
    
    socket.on('alertaGanador', (data) => {
      premio.mostrarAlerta(data);
    });
    
    socket.on('premioConfirmado', (data) => {
      ui.mostrarNotificacion(`✅ ${data.jugador} ganó ${data.pozo}`, 'success');
    });
    
    socket.on('error', (mensaje) => {
      ui.mostrarNotificacion('❌ ' + mensaje, 'error');
    });
  }
};

let socket;