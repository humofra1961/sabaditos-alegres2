let socket;

const socketClient = {
  conectar: function() {
    console.log('Conectando a Socket.io...');
    
    socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000,
      forceNew: false
    });
    
    socket.on('connect', function() {
      console.log('✅ Socket conectado:', socket.id);
      if (window.ui) window.ui.actualizarEstadoConexion(true);
      if (window.app) {
        window.app.socketConectado = true;
        window.app.actualizarEstadoCarga('✅ Conectado. Esperando registro...', 30);
      }
      
      if (window.app && window.app.emailActual && window.app.nombreActual) {
        console.log('Re-registrando jugador:', window.app.emailActual);
        socket.emit('registerPlayer', window.app.emailActual, window.app.nombreActual);
      }
    });
    
    socket.on('connect_error', function(error) {
      console.error('❌ Error de conexión:', error);
      if (window.ui) window.ui.actualizarEstadoConexion(false);
      if (window.app) {
        window.app.actualizarEstadoCarga('❌ Error de conexión. Reintentando...', 10);
      }
    });
    
    socket.on('disconnect', function() {
      console.log('❌ Socket desconectado - reconectando...');
      if (window.ui) window.ui.actualizarEstadoConexion(false);
      if (window.app) {
        window.app.socketConectado = false;
        window.app.actualizarEstadoCarga('⚠️ Reconectando...', 20);
      }
    });
    
    socket.on('reconnect', function(attemptNumber) {
      console.log('✅ Reconectado después de ' + attemptNumber + ' intentos');
      if (window.ui) window.ui.mostrarNotificacion('✅ Reconectado al servidor', 'success');
      if (window.app) {
        window.app.actualizarEstadoCarga('✅ Reconectado. Registrando...', 40);
      }
    });
    
    socketClient.registrarEventos();
  },
  
  registrarEventos: function() {
    socket.on('gameState', function(state) {
      console.log('📊 Recibiendo gameState:', state);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState = state;
    });
    
    socket.on('registroNuevo', function(data) {
      console.log('✅ Registro nuevo:', data);
      if (window.app) window.app.marcarRegistroCompletado();
    });
    
    socket.on('reconexionExitosa', function(data) {
      console.log('✅ Reconexión exitosa:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.mensaje, 'success');
      if (window.app) {
        window.app.marcarRegistroCompletado();
      }
    });
    
    socket.on('updateJugadores', function(jugadores) {
      console.log('👥 Actualizando jugadores:', jugadores);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.jugadores = jugadores || {};
      if (window.ui) window.ui.renderizarJugadores();
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
    // ✅ IMPORTANTE: Verificar panel de apuestas después de actualizar cartones
      setTimeout(function() {
        if (window.app && window.app.verificarPanelApuestas) {
          console.log('🎰 Llamando a verificarPanelApuestas desde socket-client.js');
          window.app.verificarPanelApuestas();
        }
      }, 500);
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
      if (window.pozos) window.pozos.renderizar();
    });
    
    socket.on('updateBanco', function(banco) {
      console.log('🏦 Actualizando banco:', banco);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.banco = banco || { totalRecaudado: 0, totalPagado: 0 };
      if (window.ui) window.ui.actualizarBanco(banco);
    });
    
    socket.on('fichasCompradas', function(data) {
      console.log('✅ Fichas compradas:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.jugador + ' compró ' + data.fichas + ' fichas', 'success');
    });
    
    socket.on('monedasAgregadas', function(data) {
      console.log('💰 Monedas agregadas:', data);
      if (window.ui) window.ui.mostrarNotificacion('💰 ' + data.cantidad + ' fichas agregadas a ' + data.jugador, 'success');
    });
    
    socket.on('error', function(mensaje) {
      console.error('❌ Error del servidor:', mensaje);
      if (window.ui) window.ui.mostrarNotificacion('❌ ' + mensaje, 'error');
    });
  }
};

window.socketClient = socketClient;
