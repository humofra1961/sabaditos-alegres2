<<<<<<< HEAD
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
=======
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
      
      // ✅ IMPORTANTE: Renderizar cartones cuando llega gameState
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
      
      // ✅ CORRECCIÓN: Llamar al módulo window.cartones
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
      
      // ✅ IMPORTANTE: Actualizar UI de pozos
      if (window.pozos) {
        window.pozos.renderizar();
      }
      
      // ✅ IMPORTANTE: Actualizar display de cada pozo en el HTML
      if (pozos) {
        Object.keys(pozos).forEach(function(pozo) {
          const pozoEl = document.getElementById('pozo-' + pozo);
          if (pozoEl) {
            const premioEl = pozoEl.querySelector('.pozo-premio');
            const fichasEl = pozoEl.querySelector('.pozo-fichas');
            if (premioEl) premioEl.textContent = '$' + pozos[pozo].total + ' (' + pozos[pozo].fichas + ' fichas)';
            if (fichasEl) fichasEl.textContent = pozos[pozo].fichas + ' ficha' + (pozos[pozo].fichas > 1 ? 's' : '');
          }
        });
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
>>>>>>> c3b6ca6cedb4a7dd4701c052655ac1ebd2af6f45
