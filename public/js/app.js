// ===================================================================
// 🚀 APLICACIÓN PRINCIPAL - INICIALIZACIÓN
// ============================================================================

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

  // ✅ Inicializar actualización de modales en tiempo real
  if (window.ui && window.ui.inicializarActualizacionModales) {
    window.ui.inicializarActualizacionModales();
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
    var fichasApostadas = 0;
    
    if (this.gameState && this.gameState.jugadores && this.gameState.jugadores[this.emailActual]) {
      cartonesJugador = this.gameState.jugadores[this.emailActual].cartones.length;
      saldoActual = this.gameState.jugadores[this.emailActual].monedas;
      fichasApostadas = this.gameState.jugadores[this.emailActual].fichasApostadas || 0;
    }
    
    console.log('  Cartones:', cartonesJugador);
    console.log('  Saldo:', saldoActual);
    console.log('  Apostadas:', fichasApostadas);
    console.log('  Ya apostó:', this.yaAposto);
    console.log('  Partida:', this.gameState ? this.gameState.partidaActual : 0);
    
    if (fichasApostadas > 0 && this.gameState && fichasApostadas >= (cartonesJugador * 6)) {
      panelApuestas.style.display = 'none';
      console.log('🔒 Panel oculto - apuesta ya realizada en esta partida');
      return;
    }
    
    if (cartonesJugador > 0 && fichasApostadas === 0) {
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
      console.log('🔒 PANEL DE APUESTAS OCULTO');
    }
  },
  
  marcarRegistroCompletado: function() {
    this.registroCompletado = true;
    console.log('✅ Registro completado');
  },
  
  resetearParaNuevaPartida: function() {
    console.log('🔄 Resetear para nueva partida');
    this.yaAposto = false;
    // ✅ Mostrar panel de apuestas después de 1.5 segundos
    setTimeout(function() {
      if (window.app && window.app.verificarPanelApuestas) {
        console.log('🎰 Llamando verificarPanelApuestas desde resetearParaNuevaPartida');
        window.app.verificarPanelApuestas();
      }
    }, 1500);
  },
  
  // ✅ NUEVA FUNCIÓN: Manejar reconexión automática
  manejarReconexion: function() {
    console.log('🔄 Intentando reconectar...');
    
    // Mostrar indicador visual
    const estadoEl = document.getElementById('estadoConexion');
    if (estadoEl) {
      estadoEl.className = 'status reconnecting';
      estadoEl.innerHTML = '🔄 Reconectando...';
      estadoEl.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
    }
    
    // Intentar reconectar después de 2 segundos
    setTimeout(function() {
      if (window.socketClient) {
        window.socketClient.conectar();
      }
    }, 2000);
  }
};

window.app = app;

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 App cargada');
  if (window.socketClient) {
    window.socketClient.conectar();
  }
});
