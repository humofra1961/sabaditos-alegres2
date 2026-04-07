let socket;

const socketClient = {
  conectar: function() {
    console.log('🔌 Conectando a Socket.io...');
    
    socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 100,
      timeout: 120000
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
    // ✅ GAME STATE - CON RESET DE yaAposto
    socket.on('gameState', function(state) {
      console.log('📊 Recibiendo gameState:', state);
      
      // ✅ CORRECCIÓN CRÍTICA: Resetear yaAposto cuando se recibe gameState
      if (window.app) {
        // Si la partida es 1, resetear yaAposto (nuevo juego o reinicio)
        if (state.partidaActual === 1) {
          window.app.yaAposto = false;
          console.log('🔄 Resetear yaAposto a false (partida 1)');
        }
        // También resetear si fichasApostadas del jugador actual es 0
        if (window.app.emailActual && state.jugadores && state.jugadores[window.app.emailActual]) {
          if (state.jugadores[window.app.emailActual].fichasApostadas === 0) {
            window.app.yaAposto = false;
            console.log('🔄 Resetear yaAposto a false (fichasApostadas = 0)');
          }
        }
      }
      
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState = state;
      
      setTimeout(function() {
        if (window.cartones && window.cartones.renderizarGrid) {
          console.log('🎴 Llamando renderizarGrid desde gameState');
          window.cartones.renderizarGrid();
        }
      }, 500);
    });
    
    // ✅ ACTUALIZAR JUGADORES - CON BILLETERA INMEDIATA
    socket.on('updateJugadores', function(jugadores) {
      console.log('👥 Actualizando jugadores:', jugadores);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.jugadores = jugadores || {};
      
      if (window.ui) {
        window.ui.renderizarJugadores();
        
        // ✅ ACTUALIZAR BILLETERA DEL JUGADOR ACTUAL
        if (window.app.emailActual && jugadores[window.app.emailActual]) {
          const monedas = jugadores[window.app.emailActual].monedas;
          console.log('💰 ACTUALIZANDO BILLETERA:', monedas, 'fichas ($' + (monedas * 50) + ' COP)');
          window.ui.actualizarMonedas(monedas);
        }
      }
    });
    
    // ✅ ACTUALIZAR POZOS - CON RENDERIZADO INMEDIATO
    socket.on('updatePozosDinamicos', function(pozos) {
      console.log('🏆 Actualizando pozos:', pozos);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.pozosDinamicos = pozos || {};
      
      if (window.pozos) {
        console.log('🎰 Llamando pozo.renderizar()');
        window.pozos.renderizar();
      }
    });
    
    // ✅ ACTUALIZAR CARTONES
    socket.on('updateCartones', function(cartones) {
      console.log('🎴 Actualizando cartones:', cartones);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cartones = cartones || [];
      if (window.cartones) {
        window.cartones.renderizarGrid();
        window.cartones.renderizarMisCartones();
      }
    });
    
    // ✅ ACTUALIZAR CARTAS CANTADAS
    socket.on('updateCartasCantadas', function(cartas) {
      console.log('🃏 Actualizando cartas cantadas:', cartas);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cartasCantadas = cartas || [];
      if (window.ui) window.ui.renderizarCartasPorPintas();
    });
    
    // ✅ ACTUALIZAR ÚLTIMA CARTA
    socket.on('updateUltimaCarta', function(carta) {
      console.log('🎴 Última carta:', carta);
      if (window.ui) window.ui.renderizarUltimaCarta(carta);
    });
    
    // ✅ ACTUALIZAR FASE DEL JUEGO
    socket.on('updateFaseJuego', function(fase) {
      console.log('🔄 Fase del juego:', fase);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.faseJuego = fase || 'seleccion';
      if (window.ui) window.ui.actualizarFaseJuego(fase);
    });
    
    // ✅ ACTUALIZAR CANTADOR
    socket.on('updateCantador', function(email) {
      console.log('🎤 Cantador:', email);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.cantador = email;
      if (window.ui) window.ui.actualizarPanelCantador(email);
    });
    
    // ✅ ACTUALIZAR BANCO
    socket.on('updateBanco', function(banco) {
      console.log('🏦 Actualizando banco:', banco);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.banco = banco || { totalRecaudado: 0, totalPagado: 0 };
      if (window.ui) window.ui.actualizarBanco(banco);
    });
    
    // ✅ ACTUALIZAR ESTADÍSTICAS
    socket.on('updateEstadisticas', function(estadisticas) {
      console.log('📊 Actualizando estadísticas:', estadisticas);
      if (!window.app.gameState) window.app.gameState = {};
      window.app.gameState.estadisticas = estadisticas || {};
      if (window.ui) window.ui.renderizarEstadisticas();
    });
    
    // ✅ REGISTRO NUEVO
    socket.on('registroNuevo', function(data) {
      console.log('✅ Registro nuevo:', data);
      if (window.app) window.app.marcarRegistroCompletado();
    });
    
    // ✅ RECONEXIÓN EXITOSA
    socket.on('reconexionExitosa', function(data) {
      console.log('✅ Reconexión exitosa:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.mensaje, 'success');
      if (window.app) window.app.marcarRegistroCompletado();
    });
    
    // ✅ FICHAS COMPRADAS
    socket.on('fichasCompradas', function(data) {
      console.log('✅ Fichas compradas:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.jugador + ' compró ' + data.fichas + ' fichas', 'success');
    });
    
    // ✅ MONEDAS AGREGADAS
    socket.on('monedasAgregadas', function(data) {
      console.log('💰 Monedas agregadas:', data);
      if (window.ui) window.ui.mostrarNotificacion('💰 ' + data.cantidad + ' fichas agregadas a ' + data.jugador, 'success');
    });
    
    // ✅ APUESTA REALIZADA
    socket.on('apuestaRealizada', function(data) {
      console.log('🎰 Apuesta realizada:', data);
      if (window.ui) window.ui.mostrarNotificacion('✅ ' + data.mensaje, 'success');
    });
    
    // ✅ SIGUIENTE PARTIDA
    socket.on('siguientePartida', function(data) {
      console.log('➡️ Siguiente partida:', data);
      if (window.ui) window.ui.mostrarNotificacion(data.mensaje, 'success');
      
      // ✅ Resetear estado de apuesta para la nueva partida
      if (window.app && window.app.resetearParaNuevaPartida) {
        console.log('🔄 Llamando resetearParaNuevaPartida');
        window.app.resetearParaNuevaPartida();
      }
    });
    
    // ✅ VALIDACIÓN FALLIDA
    socket.on('validacionFallida', function(data) {
      console.log('⚠️ Validación fallida:', data);
      if (window.ui) window.ui.mostrarValidacionFallida(data);
    });
    
    // ✅ ESTADO DE APUESTAS
    socket.on('estadoApuestas', function(data) {
      console.log('📋 Estado de apuestas:', data);
      if (window.ui) window.ui.mostrarEstadoApuestas(data);
    });
    
    // ✅ JUEGO INICIADO
    socket.on('juegoIniciado', function(data) {
      console.log('🎮 Juego iniciado:', data);
      if (window.ui) window.ui.mostrarNotificacion(data.mensaje, 'success');
    });
    
    // ✅ ALERTA DE GANADOR
    socket.on('alertaGanador', function(data) {
      console.log('🏆 Alerta de ganador:', data);
      if (window.premio) window.premio.mostrarAlerta(data);
    });
    
    // ✅ PREMIO CONFIRMADO
    socket.on('premioConfirmado', function(data) {
      console.log('✅ Premio confirmado:', data);
      if (window.ui) {
        window.ui.mostrarNotificacion(
          '✅ ' + data.jugador + ' ganó ' + data.pozo + ': ' + data.fichas + ' fichas ($' + data.premio + ' COP)',
          'success'
        );
      }
    });
    
    // ✅ ERROR DEL SERVIDOR
    socket.on('error', function(mensaje) {
      console.error('❌ Error del servidor:', mensaje);
      if (window.ui) window.ui.mostrarNotificacion('❌ ' + mensaje, 'error');
    });
  }
};

window.socketClient = socketClient;
