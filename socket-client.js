// ============================================================================
// 🔌 CLIENTE SOCKET.IO - CONEXIÓN Y EVENTOS
// ============================================================================

let socket;

const socketClient = {
  conectar: () => {
    console.log('🔌 Conectando a Socket.io...');
    
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
      console.log('📊 Recibiendo gameState:', state);
      if (!app.gameState) app.gameState = {};
      app.gameState = state;
      ui.renderizarTodo();
    });
    
    socket.on('updateJugadores', (jugadores) => {
      console.log('👥 Actualizando jugadores:', jugadores);
      if (!app.gameState) app.gameState = {};
      app.gameState.jugadores = jugadores || {};
      ui.renderizarJugadores();
      ui.actualizarSelectJugadores();
      if (jugadores && jugadores[app.emailActual]) {
        ui.actualizarMonedas(jugadores[app.emailActual].monedas);
      }
    });
    
    socket.on('updateCartones', (cartones) => {
      console.log('🎴 Actualizando cartones:', cartones);
      if (!app.gameState) app.gameState = {};
      app.gameState.cartones = cartones || [];
      if (typeof cartones !== 'undefined') {
        cartones.renderizarGrid();
        cartones.renderizarMisCartones();
      }
    });
    
    socket.on('updateCartasCantadas', (cartas) => {
      console.log('🃏 Actualizando cartas cantadas:', cartas);
      if (!app.gameState) app.gameState = {};
      app.gameState.cartasCantadas = cartas || [];
      ui.renderizarCartasPorPintas();
      const contadorEl = document.getElementById('contadorCartas');
      if (contadorEl) contadorEl.textContent = (cartas || []).length;
    });
    
    socket.on('updateUltimaCarta', (carta) => {
      console.log('🎴 Última carta:', carta);
      ui.renderizarUltimaCarta(carta);
    });
    
    socket.on('updateFaseJuego', (fase) => {
      console.log('🔄 Fase del juego:', fase);
      if (!app.gameState) app.gameState = {};
      app.gameState.faseJuego = fase || 'seleccion';
      ui.actualizarFaseJuego(fase);
    });
    
    socket.on('updateCantador', (email) => {
      console.log('🎤 Cantador:', email);
      if (!app.gameState) app.gameState = {};
      app.gameState.cantador = email;
      ui.actualizarPanelCantador(email);
    });
    
    socket.on('updatePozosDinamicos', (pozos) => {
      console.log('🏆 Actualizando pozos:', pozos);
      if (!app.gameState) app.gameState = {};
      app.gameState.pozosDinamicos = pozos || {};
      if (typeof pozos !== 'undefined') {
        pozos.renderizar();
      }
    });
    
    socket.on('updateBanco', (banco) => {
      console.log('🏦 Actualizando banco:', banco);
      if (!app.gameState) app.gameState = {};
      app.gameState.banco = banco || { totalRecaudado: 0, totalPagado: 0 };
      ui.actualizarBanco(banco);
    });
    
    socket.on('updateEstadisticas', (estadisticas) => {
      console.log('📊 Actualizando estadísticas:', estadisticas);
      if (!app.gameState) app.gameState = {};
      app.gameState.estadisticas = estadisticas || {};
      ui.renderizarEstadisticas();
    });
    
    socket.on('validacionFallida', (data) => {
      console.log('⚠️ Validación fallida:', data);
      ui.mostrarValidacionFallida(data);
    });
    
    socket.on('estadoApuestas', (data) => {
      console.log('📋 Estado de apuestas:', data);
      ui.mostrarEstadoApuestas(data);
    });
    
    socket.on('juegoIniciado', (data) => {
      console.log('🎮 Juego iniciado:', data);
      ui.mostrarJuegoIniciado(data);
    });
    
    socket.on('alertaGanador', (data) => {
      console.log('🏆 Alerta de ganador:', data);
      premio.mostrarAlerta(data);
    });
    
    socket.on('premioConfirmado', (data) => {
      console.log('✅ Premio confirmado:', data);
      ui.mostrarNotificacion(`✅ ${data.jugador} ganó ${data.pozo}`, 'success');
    });
    
    socket.on('premioRechazado', (data) => {
      console.log('❌ Premio rechazado:', data);
      ui.mostrarNotificacion(data.mensaje, 'error');
    });
    
    socket.on('monedasAgregadas', (data) => {
      console.log('💰 Monedas agregadas:', data);
      ui.mostrarNotificacion(`💰 ${data.cantidad} fichas agregadas a ${data.jugador}`, 'success');
    });
    
    socket.on('fichasCompradas', (data) => {
      console.log('✅ Fichas compradas:', data);
      ui.mostrarNotificacion(`✅ ${data.jugador} compró ${data.fichas} fichas`, 'success');
    });
    
    socket.on('error', (mensaje) => {
      console.error('❌ Error del servidor:', mensaje);
      ui.mostrarNotificacion('❌ ' + mensaje, 'error');
    });
    
    socket.on('reconexionExitosa', (data) => {
      console.log('✅ Reconexión exitosa:', data);
      ui.mostrarNotificacion('✅ ' + data.mensaje, 'success');
    });
    
    socket.on('mazoAgotado', (data) => {
      console.log('⚠️ Mazo agotado:', data);
      ui.mostrarNotificacion(data.mensaje, 'error');
    });
    
    socket.on('reporteFinalGenerado', (reporte) => {
      console.log('📊 Reporte generado:', reporte);
      banco.mostrarReporte(reporte);
    });
  }
};