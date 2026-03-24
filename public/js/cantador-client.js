// ============================================================================
// 🎤 CANTADOR - LÓGICA DEL CLIENTE
// ============================================================================

const cantador = {
  establecerse: () => {
    socket.emit('establecerCantador', app.emailActual);
  },

  cantarCarta: () => {
    socket.emit('cantarCartaAleatoria', app.emailActual);
  },

  iniciarJuego: () => {
    socket.emit('iniciarJuego', app.emailActual);
  },

  toggleFase: () => {
    socket.emit('toggleFaseSeleccion', app.emailActual);
  },

  siguientePartida: () => {
    socket.emit('siguientePartida', app.emailActual);
  },

  reiniciarJuego: () => {
    if (confirm('¿Reiniciar todo el juego?')) {
      socket.emit('reiniciarJuego', app.emailActual);
    }
  },

  verificarEstadoApuestas: () => {
    socket.emit('solicitarEstadoApuestas', app.emailActual);
  },

  agregarMonedas: () => {
    const emailJugador = document.getElementById('selectJugadorMonedas').value;
    const cantidad = parseInt(document.getElementById('cantidadMonedas').value);
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      ui.mostrarNotificacion('Ingresa cantidad válida (1-100)', 'error');
      return;
    }
    socket.emit('agregarMonedas', emailJugador, cantidad, app.emailActual);
    document.getElementById('cantidadMonedas').value = '';
  }
};