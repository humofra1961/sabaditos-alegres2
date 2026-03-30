const jugador = {
  comprarFichas: function() {
    var cantidadInput = document.getElementById('cantidadFichasComprar');
    var cantidad = parseInt(cantidadInput ? cantidadInput.value : 0);
    
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
    
    if (window.app.yaAposto) {
      if (window.ui) window.ui.mostrarNotificacion('❌ Ya apostaste en esta partida', 'error');
      return;
    }
    
    var cartonesJugador = 0;
    var saldoActual = 0;
    
    if (window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual]) {
      cartonesJugador = window.app.gameState.jugadores[window.app.emailActual].cartones.length;
      saldoActual = window.app.gameState.jugadores[window.app.emailActual].monedas;
    }
    
    if (cartonesJugador === 0) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ Selecciona al menos 1 cartón antes de apostar', 'error');
      return;
    }
    
    var fichasRequeridas = cartonesJugador * 6;
    var saldoDespuesDeApuesta = saldoActual - fichasRequeridas;
    
    if (saldoDespuesDeApuesta < 18) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ Saldo insuficiente. Después de apostar te quedarían ' + saldoDespuesDeApuesta + ' fichas. Necesitas mantener al menos 18 fichas para la siguiente partida.', 'error');
      return;
    }
    
    var confirmar = confirm('¿Confirmar apuesta de ' + fichasRequeridas + ' fichas (' + cartonesJugador + ' cartones)?\n\nSaldo actual: ' + saldoActual + ' fichas\nSaldo después: ' + saldoDespuesDeApuesta + ' fichas');
    
    if (confirmar) {
      console.log('✅ Apuesta confirmada: ' + fichasRequeridas + ' fichas');
      socket.emit('apostarEnPozos', window.app.emailActual);
      window.app.yaAposto = true;
      
      setTimeout(function() {
        var panelApuestas = document.getElementById('panelApuestas');
        if (panelApuestas) {
          panelApuestas.style.display = 'none';
        }
      }, 1000);
    }
  }
};

window.jugador = jugador;
