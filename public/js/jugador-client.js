const jugador = {
  comprarFichas: function() {
    // Validar que puede jugar
    if (window.app && window.app.verificarPuedeJugar) {
      if (!window.app.verificarPuedeJugar()) {
        return;
      }
    }
    
    var cantidadInput = document.getElementById('cantidadFichasComprar');
    var cantidad = parseInt(cantidadInput ? cantidadInput.value : 0);
    
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      if (window.ui) window.ui.mostrarNotificacion('Ingresa cantidad válida (1-100)', 'error');
      return;
    }
    
    console.log('Comprando ' + cantidad + ' fichas...');
    socket.emit('comprarFichas', window.app.emailActual, cantidad);
    if (cantidadInput) cantidadInput.value = '';
  },
  
  apostarEnPozos: function() {
    // Validar que puede jugar
    if (window.app && window.app.verificarPuedeJugar) {
      if (!window.app.verificarPuedeJugar()) {
        return;
      }
    }
    
    console.log('Intentando apostar...');
    
    if (window.app.yaAposto) {
      if (window.ui) window.ui.mostrarNotificacion('❌ Ya apostaste en esta partida', 'error');
      return;
    }
    
    // Obtener número de cartones
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
    
    // Calcular apuesta dinámica
    var fichasRequeridas = cartonesJugador * 6;
    var saldoDespuesDeApuesta = saldoActual - fichasRequeridas;
    
    // Validar saldo mínimo después de apostar (18 fichas)
    if (saldoDespuesDeApuesta < 18) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ Saldo insuficiente. Después de apostar te quedarían ' + saldoDespuesDeApuesta + ' fichas. Necesitas mantener al menos 18 fichas para la siguiente partida. Compra más fichas.', 'error');
      return;
    }
    
    // Confirmación al jugador con TODA la información
    var mensajeConfirmacion = '¿Confirmar apuesta para esta partida?\n\n' +
                              '🎴 Cartones: ' + cartonesJugador + '\n' +
                              '🎰 Apuesta: ' + fichasRequeridas + ' fichas ($' + (fichasRequeridas * 50) + ' COP)\n' +
                              '💰 Saldo actual: ' + saldoActual + ' fichas\n' +
                              '✅ Saldo después: ' + saldoDespuesDeApuesta + ' fichas\n\n' +
                              'Las fichas se distribuirán en los 6 pozos.';
    
    var confirmar = confirm(mensajeConfirmacion);
    
    if (confirmar) {
      console.log('Apuesta confirmada: ' + fichasRequeridas + ' fichas');
      socket.emit('apostarEnPozos', window.app.emailActual);
      window.app.yaAposto = true;
      
      // Ocultar panel después de apostar
      setTimeout(function() {
        var panelApuestas = document.getElementById('panelApuestas');
        if (panelApuestas) {
          panelApuestas.classList.add('hidden');
        }
      }, 1000);
    } else {
      console.log('Apuesta cancelada por el jugador');
    }
  }
};

window.jugador = jugador;
