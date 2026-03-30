const jugador = {
  comprarFichas: function() {
    console.log('🔘 Botón Comprar clickeado');
    
    var cantidadInput = document.getElementById('cantidadFichasComprar');
    console.log('Input:', cantidadInput);
    
    if (!cantidadInput) {
      alert('Error: No se encontró el campo de cantidad');
      return;
    }
    
    var cantidad = parseInt(cantidadInput.value);
    console.log('Cantidad a comprar:', cantidad);
    
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      alert('Ingresa cantidad válida (1-100)');
      return;
    }
    
    console.log('Enviando compra:', window.app.emailActual, cantidad);
    socket.emit('comprarFichas', window.app.emailActual, cantidad);
    cantidadInput.value = '';
  },
  
  apostarEnPozos: function() {
    console.log('🎰 Intentando apostar...');
    
    if (window.app.yaAposto) {
      alert('Ya apostaste en esta partida');
      return;
    }
    
    var cartonesJugador = 0;
    var saldoActual = 0;
    
    if (window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual]) {
      cartonesJugador = window.app.gameState.jugadores[window.app.emailActual].cartones.length;
      saldoActual = window.app.gameState.jugadores[window.app.emailActual].monedas;
    }
    
    if (cartonesJugador === 0) {
      alert('Selecciona al menos 1 cartón antes de apostar');
      return;
    }
    
    var fichasRequeridas = cartonesJugador * 6;
    var saldoDespues = saldoActual - fichasRequeridas;
    
    if (saldoDespues < 18) {
      alert('Saldo insuficiente. Después de apostar te quedarían ' + saldoDespues + ' fichas. Necesitas 18 mínimo.');
      return;
    }
    
    var confirmar = confirm('¿Confirmar apuesta de ' + fichasRequeridas + ' fichas (' + cartonesJugador + ' cartones)?');
    
    if (confirmar) {
      console.log('✅ Apuesta confirmada:', fichasRequeridas, 'fichas');
      socket.emit('apostarEnPozos', window.app.emailActual);
      window.app.yaAposto = true;
      
      setTimeout(function() {
        var panel = document.getElementById('panelApuestas');
        if (panel) panel.style.display = 'none';
      }, 1000);
    }
  }
};

window.jugador = jugador;
