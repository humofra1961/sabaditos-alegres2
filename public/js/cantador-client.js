// ============================================================================
// 🎤 CANTADOR - LÓGICA DEL CLIENTE
// ============================================================================

const cantador = {
  establecerse: function() {
    console.log('🎤 Estableciéndose como cantador...');
    socket.emit('establecerCantador', window.app.emailActual);
  },
  
  cantarCarta: function() {
    // ✅ Verificar si el botón está deshabilitado
    const btn = document.getElementById('btnCantar');
    if (btn && btn.disabled) {
      console.log('❌ Botón Cantar deshabilitado');
      return;
    }
    console.log('🃏 Cantando carta...');
    socket.emit('cantarCartaAleatoria', window.app.emailActual);
  },
  
  iniciarJuego: function() {
    console.log('▶️ Iniciando juego...');
    socket.emit('iniciarJuego', window.app.emailActual);
  },
  
  toggleFase: function() {
    console.log('🔄 Cambiando fase...');
    socket.emit('toggleFaseSeleccion', window.app.emailActual);
  },
  
  siguientePartida: function() {
    console.log('➡️ Siguiente partida...');
    socket.emit('siguientePartida', window.app.emailActual);
  },
  
  reiniciarJuego: function() {
    console.log('🔄 Reiniciando juego...');
    if (confirm('¿Estás seguro de reiniciar todo el juego?')) {
      socket.emit('reiniciarJuego', window.app.emailActual);
    }
  },
  
  verificarEstadoApuestas: function() {
    console.log('📋 Verificando estado de apuestas...');
    socket.emit('solicitarEstadoApuestas', window.app.emailActual);
  },
  
  agregarMonedas: function() {
    const emailJugador = document.getElementById('selectJugadorMonedas').value;
    const cantidadInput = document.getElementById('cantidadMonedas');
    const cantidad = parseInt(cantidadInput ? cantidadInput.value : 0);
    
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      if (window.ui) window.ui.mostrarNotificacion('Ingresa cantidad válida (1-100)', 'error');
      return;
    }
    
    console.log('💰 Agregando ' + cantidad + ' fichas a ' + emailJugador);
    socket.emit('agregarMonedas', emailJugador, cantidad, window.app.emailActual);
    if (cantidadInput) cantidadInput.value = '';
  }
};

window.cantador = cantador;
