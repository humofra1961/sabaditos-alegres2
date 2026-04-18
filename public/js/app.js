(function() {
  const app = {
    emailActual: '',
    nombreActual: '',
    gameState: {},
    yaAposto: false,
    socketConectado: false,
    registroCompletado: false,
    
    iniciarSesion: function() {
      const email = document.getElementById('emailInput').value.trim();
      const nombre = document.getElementById('nombreInput').value.trim();
      
      if (!email || !nombre) {
        alert('Ingresa correo y nombre');
        return;
      }
      
      this.emailActual = email;
      this.nombreActual = nombre;
      
      // ✅ Escuchar respuesta del servidor antes de mostrar juego
      socket.once('registerPlayerResponse', (success, data) => {
        if (!success) {
          alert('❌ Error en registro: ' + (data || 'Inténtalo de nuevo'));
          document.getElementById('loginSection').classList.remove('hidden');
          return;
        }
        
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('gameSection').classList.remove('hidden');
        document.getElementById('jugadorNombre').textContent = nombre;
        
        this.marcarRegistroCompletado();
        console.log('✅ Sesión iniciada:', email);
      });
      
      socket.emit('registerPlayer', email, nombre);
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
      navigator.clipboard.writeText(window.location.href).then(() => alert('✅ Copiado'));
    },
    
    verificarPanelApuestas: function() {
      console.log('🎰 VERIFICANDO PANEL DE APUESTAS...');
      
      const panelApuestas = document.getElementById('panelApuestas');
      if (!panelApuestas) {
        console.error('❌ ERROR: NO existe #panelApuestas en el HTML');
        return;
      }
      
      // ✅ Validación null-safe
      if (!this.gameState?.jugadores?.[this.emailActual]) {
        console.log('⏳ Esperando gameState...');
        panelApuestas.style.display = 'none';
        return;
      }
      
      const jugador = this.gameState.jugadores[this.emailActual];
      const cartonesJugador = jugador.cartones?.length || 0;
      const saldoActual = jugador.monedas || 0;
      const fichasApostadas = jugador.fichasApostadas || 0;
      
      console.log('  Cartones:', cartonesJugador);
      console.log('  Saldo:', saldoActual);
      console.log('  Apostadas:', fichasApostadas);
      console.log('  Ya apostó:', this.yaAposto);
      console.log('  Partida:', this.gameState.partidaActual || 0);
      
      if (fichasApostadas > 0 && fichasApostadas >= (cartonesJugador * 6)) {
        panelApuestas.style.display = 'none';
        console.log('🔒 Panel oculto - apuesta ya realizada');
        return;
      }
      
      if (cartonesJugador > 0 && fichasApostadas === 0) {
        const fichasRequeridas = cartonesJugador * 6;
        const saldoDespues = saldoActual - fichasRequeridas;
        
        document.getElementById('detalleCartones').textContent = '🎴 Cartones: ' + cartonesJugador;
        document.getElementById('detalleApuesta').textContent = '🎰 Apuesta: ' + fichasRequeridas + ' fichas ($' + (fichasRequeridas * 50) + ' COP)';
        document.getElementById('detalleSaldo').textContent = '💰 Saldo actual: ' + saldoActual + ' fichas';
        document.getElementById('detalleSaldoRestante').textContent = saldoDespues >= 18 
          ? '✅ Saldo después: ' + saldoDespues + ' fichas' 
          : '⚠️ Saldo insuficiente: ' + saldoDespues + ' fichas';
        
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
      setTimeout(() => {
        this.verificarPanelApuestas();
      }, 1500);
    },
    
    manejarReconexion: function() {
      console.log('🔄 Intentando reconectar...');
      
      const estadoEl = document.getElementById('estadoConexion');
      if (estadoEl) {
        estadoEl.className = 'status reconnecting';
        estadoEl.innerHTML = '🔄 Reconectando...';
        estadoEl.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
      }
      
      setTimeout(() => {
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
})();
