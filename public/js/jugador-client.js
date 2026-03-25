// ============================================================================
// 👤 JUGADOR - LÓGICA DEL CLIENTE
// ============================================================================

const jugador = {
  comprarFichas: () => {
    const cantidad = parseInt(document.getElementById('cantidadFichasComprar').value);
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      ui.mostrarNotificacion('Ingresa cantidad válida (1-100)', 'error');
      return;
    }
    socket.emit('comprarFichas', app.emailActual, cantidad);
    document.getElementById('cantidadFichasComprar').value = '';
  },

  apostarEnPozos: () => {
    if (app.yaAposto) {
      ui.mostrarNotificacion('❌ Ya apostaste en esta partida', 'error');
      return;
    }
    socket.emit('apostarEnPozos', app.emailActual);
    app.yaAposto = true;
    ui.mostrarNotificacion('✅ Apuesta realizada - 6 fichas', 'success');
  }
};

app.yaAposto = false;

// ✅ IMPORTANTE: Hacer jugador global
window.jugador = jugador;
