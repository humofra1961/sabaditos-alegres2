let socket;

const socketClient = {
  conectar: function() {
    console.log('🔌 Conectando a Socket.io...');
    
    socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 100,
      timeout: 60000
    });
    
    socket.on('connect', function() {
      console.log('✅ Socket conectado:', socket.id);
      if (window.app) window.app.socketConectado = true;
      if (window.ui) window.ui.actualizarEstadoConexion(true);
    });
    
    socket.on('connect_error', function(error) {
      console.error('❌ Error de conexión:', error);
      if (window.ui) window.ui.actualizarEstadoConexion(false);
    });
    
    socket.on('disconnect', function() {
      console.log('❌ Socket desconectado - reconectando...');
      if (window.app) window.app.socketConectado = false;
      if (window.ui) window.ui.actualizarEstadoConexion(false);
    });
    
    socket.on('reconnect', function(attemptNumber) {
      console.log('✅ Reconectado después de ' + attemptNumber + ' intentos');
      if (window.ui) window.ui.mostrarNotificacion('✅ Reconectado al servidor', 'success');
    });
    
    socketClient.registrarEventos();
  },
  
  registrarEventos: function() {
    socket.on('gameState', function(state) {
      console.log('📊 Recibiendo gameState:', state);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState = state;
      
      setTimeout(function() {
        if (window.cartones && window.cartones.renderizarGrid) {
          console.log('🎴 Llamando renderizarGrid desde gameState');
          window.cartones.renderizarGrid();
        }
      }, 500);
    });
    
    socket.on('updateJugadores', function(jugadores) {
      console.log('👥 Actualizando jugadores:', jugadores);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.jugadores = jugadores || {};
      if (window.ui) {
        window.ui.renderizarJugadores();
        window.ui.actualizarMonedas(jugadores[window.app.emailActual] ? jugadores[window.app.emailActual].monedas : 0);
      }
    });
    
    socket.on('updateCartones', function(cartones) {
      console.log('🎴 Actualizando cartones:', cartones);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cartones = cartones || [];
      if (window.cartones) {
        window.cartones.renderizarGrid();
        window.cartones.renderizarMisCartones();
      }
    });
    
    socket.on('updateCartasCantadas', function(cartas) {
      console.log('🃏 Actualizando cartas cantadas:', cartas);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cartasCantadas = cartas || [];
      if (window.ui) window.ui.renderizarCartasPorPintas();
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
      if (window.pozos) {
        window.pozos.renderizar();
      }
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
    
    socket.on('registroNuevo', function(data) {
      console.log('✅ Registro nuevo:', data);
      if (window.app) window.app.marcarRegistroCompletado();
    });
    
    socket.on('reconexionExitosa', function(data) {
      console.log('✅ Reconexión exitosa:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.mensaje, 'success');
      if (window.app) window.app.marcarRegistroCompletado();
    });
    
    socket.on('fichasCompradas', function(data) {
      console.log('✅ Fichas compradas:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.jugador + ' compró ' + data.fichas + ' fichas', 'success');
    });
    
    socket.on('monedasAgregadas', function(data) {
      console.log('💰 Monedas agregadas:', data);
      if (window.ui) window.ui.mostrarNotificacion('💰 ' + data.cantidad + ' fichas agregadas a ' + data.jugador, 'success');
    });
    
    socket.on('apuestaRealizada', function(data) {
      console.log('🎰 Apuesta realizada:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.mensaje, 'success');
    });
    socket.on('siguientePartida', function(data) {
      console.log('➡️ Siguiente partida:', data);
      if (window.ui) window.ui.mostrarNotificacion(data.mensaje, 'success');
      
      // ✅ CORRECCIÓN: Resetear estado de apuesta para la nueva partida
      if (window.app && window.app.resetearParaNuevaPartida) {
        window.app.resetearParaNuevaPartida();
      }
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
  }
};

window.socketClient = socketClient;
