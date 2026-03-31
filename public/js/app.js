const app = {
  emailActual: '',
  nombreActual: '',
  gameState: {},
  yaAposto: false,
  socketConectado: false,
  registroCompletado: false,
  
  iniciarSesion: function() {
    var email = document.getElementById('emailInput').value.trim();
    var nombre = document.getElementById('nombreInput').value.trim();
    
    if (!email || !nombre) {
      alert('Ingresa correo y nombre');
      return;
    }
    
    app.emailActual = email;
    app.nombreActual = nombre;
    socket.emit('registerPlayer', email, nombre);
    
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('jugadorNombre').textContent = nombre;
    
    console.log('✅ Sesión iniciada:', email);
  },
  
  cerrarSesion: function() {
    location.reload();
  },
  
  invitarWhatsApp: function() {
    window.open('https://wa.me/?text=' + encodeURIComponent(window.location.href), '_blank');
  },
  
  invitarEmail: function() {
    window.open('mailto:?subject=Sabadito&body=' + encodeURIComponent(window.location.href), '_blank');
  },
  
  copiarEnlace: function() {
    navigator.clipboard.writeText(window.location.href);
    alert('Copiado');
  },
  
  verificarPanelApuestas: function() {
    console.log('🎰 VERIFICANDO PANEL DE APUESTAS...');
    
    var panelApuestas = document.getElementById('panelApuestas');
    if (!panelApuestas) {
      console.error('❌ ERROR: NO existe #panelApuestas en el HTML');
      return;
    }
    
    var cartonesJugador = 0;
    var saldoActual = 0;
    
    if (this.gameState && this.gameState.jugadores && this.gameState.jugadores[this.emailActual]) {
      cartonesJugador = this.gameState.jugadores[this.emailActual].cartones.length;
      saldoActual = this.gameState.jugadores[this.emailActual].monedas;
    }
    
    console.log('  Cartones:', cartonesJugador);
    console.log('  Saldo:', saldoActual);
    console.log('  Ya apostó:', this.yaAposto);
    
    if (cartonesJugador > 0 && !this.yaAposto) {
      var fichasRequeridas = cartonesJugador * 6;
      var saldoDespues = saldoActual - fichasRequeridas;
      
      document.getElementById('detalleCartones').textContent = '🎴 Cartones: ' + cartonesJugador;
      document.getElementById('detalleApuesta').textContent = '🎰 Apuesta: ' + fichasRequeridas + ' fichas ($' + (fichasRequeridas * 50) + ' COP)';
      document.getElementById('detalleSaldo').textContent = '💰 Saldo actual: ' + saldoActual + ' fichas';
      document.getElementById('detalleSaldoRestante').textContent = saldoDespues >= 18 ? '✅ Saldo después: ' + saldoDespues + ' fichas' : '⚠️ Saldo insuficiente: ' + saldoDespues + ' fichas';
      
      panelApuestas.style.display = 'block';
      console.log('✅ PANEL DE APUESTAS MOSTRADO');
    } else {
      panelApuestas.style.display = 'none';
      console.log('🔒 PANEL DE APUESTAS OCULTO (cartones=' + cartonesJugador + ', yaApostó=' + this.yaAposto + ')');
    }
  },
  resetearParaNuevaPartida: function() {
    console.log('🔄 Resetear para nueva partida');
    this.yaAposto = false;
    
  // ✅ Mostrar panel de apuestas de nuevo
    setTimeout(function() {
      if (window.app && window.app.verificarPanelApuestas) {
        window.app.verificarPanelApuestas();
      }
    }, 1000);
  }  
  marcarRegistroCompletado: function() {
    this.registroCompletado = true;
    console.log('✅ Registro completado');
  }
};

window.app = app;

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 App cargada');
  if (window.socketClient) {
    window.socketClient.conectar();
  }
});
