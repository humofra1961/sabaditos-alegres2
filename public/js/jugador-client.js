// ============================================================================
// 👤 JUGADOR - LÓGICA DEL CLIENTE
// ============================================================================

const jugador = {
  comprarFichas: function() {
    const cantidadInput = document.getElementById('cantidadFichasComprar');
    const cantidad = parseInt(cantidadInput ? cantidadInput.value : 0);
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      if (window.ui) window.ui.mostrarNotificacion('Ingresa cantidad válida (1-100)', 'error');
      return;
    }
    socket.emit('comprarFichas', window.app.emailActual, cantidad);
    if (cantidadInput) cantidadInput.value = '';
  },
  
  apostarEnPozos: function() {
    if (window.app.yaAposto) {
      if (window.ui) window.ui.mostrarNotificacion('❌ Ya apostaste en esta partida', 'error');
      return;
    }
    socket.emit('apostarEnPozos', window.app.emailActual);
    window.app.yaAposto = true;
    if (window.ui) window.ui.mostrarNotificacion('✅ Apuesta realizada - 6 fichas', 'success');
    
    // Ocultar panel de apuestas después de apostar
    const panelApuestas = document.getElementById('panelApuestas');
    if (panelApuestas) panelApuestas.classList.add('hidden');
  }
};

window.jugador = jugador;
