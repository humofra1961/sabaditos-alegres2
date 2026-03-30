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
    
    if (!this.socketConectado) {
      alert('⚠️ Conectando al servidor... espera a que la barra esté en verde');
      return;
    }
    
    app.emailActual = email;
    app.nombreActual = nombre;
    socket.emit('registerPlayer', email, nombre);
    
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('jugadorNombre').textContent = nombre;
    
    console.log('Sesión iniciada:', email);
    
    setTimeout(function() {
      app.verificarPanelApuestas();
    }, 2000);
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
    console.log('🎰 Verificando panel de apuestas...');
    
    var panelApuestas = document.getElementById('panelApuestas');
    if (!panelApuestas) {
      console.error('❌ NO se encontró el elemento #panelApuestas en el HTML');
      return;
    }
    
    var detalleCartones = document.getElementById('detalleCartones');
    var detalleApuesta = document.getElementById('detalleApuesta');
    var detalleSaldo = document.getElementById('detalleSaldo');
    var detalleSaldoRestante = document.getElementById('detalleSaldoRestante');
    
    var cartonesJugador = 0;
    var saldoActual = 0;
    
    if (this.gameState && this.gameState.jugadores && this.gameState.jugadores[this.emailActual]) {
      cartonesJugador = this.gameState.jugadores[this.emailActual].cartones.length;
      saldoActual = this.gameState.jugadores[this.emailActual].monedas;
    }
    
    console.log('  Cartones:', cartonesJugador);
    console.log('  Saldo:', saldoActual);
    console.log('  Ya apostó:', this.yaAposto);
    console.log('  Fase:', this.gameState ? this.gameState.faseJuego : 'sin gameState');
    
    if (cartonesJugador > 0 && !this.yaAposto && this.gameState && this.gameState.faseJuego === 'seleccion') {
      var fichasRequeridas = cartonesJugador * 6;
      var saldoDespuesDeApuesta = saldoActual - fichasRequeridas;
      var valorEnPesos = fichasRequeridas * 50;
      
      panelApuestas.classList.remove('hidden');
      panelApuestas.style.display = 'block';
      
      if (detalleCartones) {
        detalleCartones.textContent = '🎴 Cartones seleccionados: ' + cartonesJugador + ' (máx 3)';
      }
      if (detalleApuesta) {
        detalleApuesta.textContent = '🎰 Apuesta: ' + cartonesJugador + ' cartón(es) × 6 fichas = ' + fichasRequeridas + ' fichas ($' + valorEnPesos + ' COP)';
      }
      if (detalleSaldo) {
        detalleSaldo.textContent = '💰 Saldo actual: ' + saldoActual + ' fichas ($' + (saldoActual * 50) + ' COP)';
      }
      if (detalleSaldoRestante) {
        if (saldoDespuesDeApuesta < 18) {
          detalleSaldoRestante.textContent = '⚠️ Saldo después: ' + saldoDespuesDeApuesta + ' fichas (INSUFICIENTE - mín. 18)';
          detalleSaldoRestante.style.color = '#e74c3c';
        } else {
          detalleSaldoRestante.textContent = '✅ Saldo después: ' + saldoDespuesDeApuesta + ' fichas ($' + (saldoDespuesDeApuesta * 50) + ' COP)';
          detalleSaldoRestante.style.color = '#27ae60';
        }
      }
      
      console.log('✅ Panel de apuestas MOSTRADO');
    } else {
      panelApuestas.classList.add('hidden');
      panelApuestas.style.display = 'none';
      console.log('🔒 Panel de apuestas OCULTO');
    }
  },
  
  marcarRegistroCompletado: function() {
    this.registroCompletado = true;
    console.log('✅ Registro completado');
  },
  
  verificarPuedeJugar: function() {
    if (!this.socketConectado) {
      alert('⚠️ Sin conexión al servidor. Espera...');
      return false;
    }
    if (!this.registroCompletado) {
      alert('⚠️ Registrando jugador... espera a que la barra esté en verde');
      return false;
    }
    return true;
  },
  
  mostrarCargando: function() {
    var bar = document.getElementById('loadingBar');
    if (bar) {
      bar.classList.add('active');
      bar.classList.remove('ready');
    }
  },
  
  ocultarCargando: function() {
    var bar = document.getElementById('loadingBar');
    if (bar) {
      bar.classList.remove('active');
    }
  }
};

window.app = app;

document.addEventListener('DOMContentLoaded', function() {
  console.log('App cargada');
  if (window.app) {
    window.app.mostrarCargando();
  }
  if (window.socketClient) {
    window.socketClient.conectar();
  }
});
