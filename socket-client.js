// ============================================================================
// 🔌 CLIENTE SOCKET.IO - CONEXIÓN Y EVENTOS
// ============================================================================

let socket;

const socketClient = {
  conectar: function() {
    console.log('🔌 Conectando a Socket.io...');
    
    socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000
    });
    
    socket.on('connect', function() {
      console.log('✅ Socket conectado:', socket.id);
      if (window.ui) window.ui.actualizarEstadoConexion(true);
    });
    
    socket.on('connect_error', function(error) {
      console.error('❌ Error de conexión:', error);
      if (window.ui) window.ui.actualizarEstadoConexion(false);
    });
    
    socket.on('disconnect', function() {
      console.log('❌ Socket desconectado');
      if (window.ui) window.ui.actualizarEstadoConexion(false);
    });
    
    socketClient.registrarEventos();
  },
  
  registrarEventos: function() {
    socket.on('gameState', function(state) {
      console.log('📊 Recibiendo gameState:', state);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState = state;
      
      if (state.cartones && state.cartones.length > 0) {
        console.log('🎴 Cartones recibidos:', state.cartones.length);
        if (window.cartones) {
          window.cartones.renderizarGrid();
          window.cartones.renderizarMisCartones();
        }
      }
      
      if (window.ui) window.ui.renderizarTodo();
    });
    
    socket.on('updateJugadores', function(jugadores) {
      console.log('👥 Actualizando jugadores:', jugadores);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.jugadores = jugadores || {};
      if (window.ui) {
        window.ui.renderizarJugadores();
        window.ui.actualizarSelectJugadores();
      }
      if (jugadores && jugadores[window.app.emailActual]) {
        if (window.ui) window.ui.actualizarMonedas(jugadores[window.app.emailActual].monedas);
      }
    });
    
    socket.on('updateCartones', function(cartones) {
      console.log('🎴 Actualizando cartones:', cartones);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cartones = cartones || [];
      
      if (window.cartones && Array.isArray(cartones)) {
        console.log('🎴 Renderizando grid de cartones...');
        window.cartones.renderizarGrid();
        window.cartones.renderizarMisCartones();
      }
    });
    
    socket.on('updateCartasCantadas', function(cartas) {
      console.log('🃏 Actualizando cartas cantadas:', cartas);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cartasCantadas = cartas || [];
      if (window.ui) window.ui.renderizarCartasPorPintas();
      const contadorEl = document.getElementById('contadorCartas');
      if (contadorEl) contadorEl.textContent = (cartas || []).length;
    });
    
    socket.on('updateUltimaCarta', function(carta) {
      console.log('🎴 Última carta:', carta);
      if (window.ui) window.ui.renderizarUltimaCarta(carta);
    });
    
    socket.on('updateFaseJuego', function(fase) {
      console.log('🔄 Fase del juego:', fase);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.faseJuego = fase || 'seleccion';
      if (window.ui) window.ui.actualizarFaseJuego(fase);
    });
    
    socket.on('updateCantador', function(email) {
      console.log('🎤 Cantador:', email);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cantador = email;
      if (window.ui) window.ui.actualizarPanelCantador(email);
    });
    
    socket.on('updatePozosDinamicos', function(pozos) {
      console.log('🏆 Actualizando pozos:', pozos);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.pozosDinamicos = pozos || {};
      if (window.pozos) window.pozos.renderizar();
    });
    
    socket.on('updateBanco', function(banco) {
      console.log('🏦 Actualizando banco:', banco);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.banco = banco || { totalRecaudado: 0, totalPagado: 0 };
      if (window.ui) window.ui.actualizarBanco(banco);
    });
    
    socket.on('updateEstadisticas', function(estadisticas) {
      console.log('📊 Actualizando estadísticas:', estadisticas);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.estadisticas = estadisticas || {};
      if (window.ui) window.ui.renderizarEstadisticas();
    });
    
    socket.on('validacionFallida', function(data) {
      console.log('⚠️ Validación fallida:', data);
      if (window.ui) window.ui.mostrarValidacionFallida(data);
    });
    
    socket.on('estadoApuestas', function(data) {
      console.log('📋 Estado de apuestas:', data);
      if (window.ui) window.ui.mostrarEstadoApuestas(data);
    });
    
    socket.on('juegoIniciado', function(data) {
      console.log('🎮 Juego iniciado:', data);
      if (window.ui) window.ui.mostrarJuegoIniciado(data);
    });
    
    socket.on('alertaGanador', function(data) {
      console.log('🏆 Alerta de ganador:', data);
      if (window.premio) window.premio.mostrarAlerta(data);
    });
    
    socket.on('premioConfirmado', function(data) {
      console.log('✅ Premio confirmado:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.jugador + ' ganó ' + data.pozo, 'success');
    });
    
    socket.on('error', function(mensaje) {
      console.error('❌ Error del servidor:', mensaje);
      if (window.ui) window.ui.mostrarNotificacion('❌ ' + mensaje, 'error');
    });
    
    socket.on('fichasCompradas', function(data) {
      console.log('✅ Fichas compradas:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.jugador + ' compró ' + data.fichas + ' fichas', 'success');
    });
    
    socket.on('monedasAgregadas', function(data) {
      console.log('💰 Monedas agregadas:', data);
      if (window.ui) window.ui.mostrarNotificacion('💰 ' + data.cantidad + ' fichas agregadas a ' + data.jugador, 'success');
    });
  }
};

window.socketClient = socketClient;
