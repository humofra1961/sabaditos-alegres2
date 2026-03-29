// ============================================================================
// 👤 JUGADOR - LÓGICA DEL CLIENTE (APUESTAS DINÁMICAS)
// ============================================================================

const jugador = {
  comprarFichas: function() {
    const cantidadInput = document.getElementById('cantidadFichasComprar');
    const cantidad = parseInt(cantidadInput ? cantidadInput.value : 0);
    
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      if (window.ui) window.ui.mostrarNotificacion('Ingresa cantidad válida (1-100)', 'error');
      return;
    }
    
    console.log('💰 Comprando ' + cantidad + ' fichas...');
    socket.emit('comprarFichas', window.app.emailActual, cantidad);
    if (cantidadInput) cantidadInput.value = '';
  },
  
  apostarEnPozos: function() {
    console.log('🎰 Intentando apostar...');
    
    // Verificar si ya apostó
    if (window.app.yaAposto) {
      if (window.ui) window.ui.mostrarNotificacion('❌ Ya apostaste en esta partida', 'error');
      return;
    }
    
    // Verificar cartones seleccionados
    const cartonesJugador = window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual] 
      ? window.app.gameState.jugadores[window.app.emailActual].cartones.length 
      : 0;
    
    if (cartonesJugador === 0) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ Debes seleccionar al menos 1 cartón antes de apostar', 'error');
      return;
    }
    
    // Calcular apuesta dinámica
    const fichasRequeridas = cartonesJugador * 6;
    const saldoActual = window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual]
      ? window.app.gameState.jugadores[window.app.emailActual].monedas
      : 0;
    
    const saldoDespuesDeApuesta = saldoActual - fichasRequeridas;
    
    // Validar saldo mínimo después de apostar
    if (saldoDespuesDeApuesta < 18) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ Saldo insuficiente. Después de apostar ' + fichasRequeridas + ' fichas, te quedarían ' + saldoDespuesDeApuesta + ' fichas. Necesitas mantener al menos 18 fichas para la siguiente partida.', 'error');
      return;
    }
    
    // Confirmación al jugador
    const confirmar = confirm('¿Confirmar apuesta de ' + fichasRequeridas + ' fichas (' + cartonesJugador + ' cartones × 6)?\n\nSaldo actual: ' + saldoActual + ' fichas\nSaldo después: ' + saldoDespuesDeApuesta + ' fichas\n\nEsto se descontará de tu billetera.');
    
    if (confirmar) {
      console.log('✅ Apuesta confirmada: ' + fichasRequeridas + ' fichas');
      socket.emit('apostarEnPozos', window.app.emailActual);
      window.app.yaAposto = true;
    } else {
      console.log('❌ Apuesta cancelada por el jugador');
    }
  }
};

window.jugador = jugador;
