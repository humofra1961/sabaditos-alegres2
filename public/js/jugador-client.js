const jugador = {
  comprarFichas: function() {
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
    if (window.app && window.app.verificarPuedeJugar) {
      if (!window.app.verificarPuedeJugar()) {
        return;
      }
    }
    
    console.log('Intentando apostar...');
    
    if (window.app.yaAposto) {
      if (window.ui) window.ui.mostrarNotificacion('Ya apostaste en esta partida', 'error');
      return;
    }
    
    var cartonesJugador = 0;
    if (window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual]) {
      cartonesJugador = window.app.gameState.jugadores[window.app.emailActual].cartones.length;
    }
    
    if (cartonesJugador === 0) {
      if (window.ui) window.ui.mostrarNotificacion('Selecciona al menos 1 cartón antes de apostar', 'error');
      return;
    }
    
    var fichasRequeridas = cartonesJugador * 6;
    var saldoActual = 0;
    if (window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual]) {
      saldoActual = window.app.gameState.jugadores[window.app.emailActual].monedas;
    }
    
    var saldoDespuesDeApuesta = saldoActual - fichasRequeridas;
    
    if (saldoDespuesDeApuesta < 18) {
      if (window.ui) window.ui.mostrarNotificacion('Saldo insuficiente. Después de apostar te quedarían ' + saldoDespuesDeApuesta + ' fichas. Necesitas 18 mínimo.', 'error');
      return;
    }
    
    var confirmar = confirm('¿Confirmar apuesta de ' + fichasRequeridas + ' fichas (' + cartonesJugador + ' cartones)?');
    
    if (confirmar) {
      console.log('Apuesta confirmada: ' + fichasRequeridas + ' fichas');
      socket.emit('apostarEnPozos', window.app.emailActual);
      window.app.yaAposto = true;
    }
  }
};

window.jugador = jugador;
