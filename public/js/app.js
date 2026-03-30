const app = {
  emailActual: '',
  nombreActual: '',
  socketConectado: false,
  registroCompletado: false,
  cargando: true,
  
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
    
    app.actualizarEstadoCarga('Registrando jugador...', 50);
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
  
  marcarRegistroCompletado: function() {
    this.registroCompletado = true;
    this.cargando = false;
    this.actualizarEstadoCarga('¡Listo para jugar!', 100);
    
    setTimeout(function() {
      document.getElementById('loadingBar').classList.remove('active');
    }, 1500);
    
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
  
  actualizarEstadoCarga: function(mensaje, progreso) {
    var textEl = document.getElementById('loadingText');
    var barEl = document.getElementById('loadingProgressBar');
    var hintEl = document.getElementById('loadingHint');
    
    if (textEl) textEl.textContent = mensaje;
    if (barEl) barEl.style.width = progreso + '%';
    
    if (progreso >= 100 && hintEl) {
      hintEl.textContent = 'Iniciando juego...';
    }
  },
  
  mostrarCargando: function() {
    var bar = document.getElementById('loadingBar');
    if (bar) {
      bar.classList.add('active');
      bar.classList.remove('ready');
      this.actualizarEstadoCarga('Conectando al servidor...', 10);
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
  verificarPanelApuestas: function() {
    var panelApuestas = document.getElementById('panelApuestas');
    var detalleCartones = document.getElementById('detalleCartones');
    var detalleApuesta = document.getElementById('detalleApuesta');
    var detalleSaldo = document.getElementById('detalleSaldo');
    var detalleSaldoRestante = document.getElementById('detalleSaldoRestante');
    
    if (!panelApuestas) {
      console.error('❌ No se encontró #panelApuestas');
      return;
    }
    
    // Obtener número de cartones
    var cartonesJugador = 0;
    var saldoActual = 0;
    
    if (this.gameState && this.gameState.jugadores && this.gameState.jugadores[this.emailActual]) {
      cartonesJugador = this.gameState.jugadores[this.emailActual].cartones.length;
      saldoActual = this.gameState.jugadores[this.emailActual].monedas;
    }
    
    console.log('Verificando panel de apuestas. Cartones:', cartonesJugador, 'Saldo:', saldoActual, 'Ya apostó:', this.yaAposto);
    
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
          detalleSaldoRestante.textContent = '⚠️ Saldo después: ' + saldoDespuesDeApuesta + ' fichas (INSUFICIENTE - mín. 18 para siguiente partida)';
          detalleSaldoRestante.style.color = '#e74c3c';
        } else {
          detalleSaldoRestante.textContent = '✅ Saldo después: ' + saldoDespuesDeApuesta + ' fichas ($' + (saldoDespuesDeApuesta * 50) + ' COP)';
          detalleSaldoRestante.style.color = '#27ae60';
        }
      }
      
      console.log('✅ Panel de apuestas visible');
    } else {
      panelApuestas.classList.add('hidden');
      panelApuestas.style.display = 'none';
      console.log('🔒 Panel de apuestas oculto (cartones: ' + cartonesJugador + ', ya apostó: ' + this.yaAposto + ')');
    }
  },
