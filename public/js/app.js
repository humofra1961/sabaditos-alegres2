// ============================================================================
// 🚀 APLICACIÓN PRINCIPAL - INICIALIZACIÓN
// ============================================================================

const app = {
  emailActual: '',
  nombreActual: '',
  gameState: {
    jugadores: {},
    cartones: [],
    cartasCantadas: [],
    cantador: null,
    faseJuego: 'seleccion',
    partidaActual: 1,
    banco: { totalRecaudado: 0, totalPagado: 0 },
    pozosDinamicos: {},
    estadisticas: {}
  },
  yaAposto: false,
  premioPendiente: null,
  
  iniciarSesion: function() {
    const email = document.getElementById('emailInput').value.trim();
    const nombre = document.getElementById('nombreInput').value.trim();
    
    if (!email || !nombre) {
      if (window.ui) window.ui.mostrarNotificacion('Ingresa correo y nombre', 'error');
      return;
    }
    
    app.emailActual = email;
    app.nombreActual = nombre;
    
    socket.emit('registerPlayer', email, nombre);
    
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('jugadorNombre').textContent = nombre;
    
    console.log('👤 Sesión iniciada:', email);
    
    setTimeout(function() {
      app.verificarPanelApuestas();
    }, 1000);
  },
  
  cerrarSesion: function() {
    location.reload();
  },
  
  invitarWhatsApp: function() {
    const url = window.location.href;
    const mensaje = '🎊 ¡SABADITO ALEGRE EN LÍNEA! 🎊%0A%0A🌐 URL: ' + url + '%0A%0A¡Únete al juego!';
    window.open('https://wa.me/?text=' + mensaje, '_blank');
  },
  
  invitarEmail: function() {
    const url = window.location.href;
    window.open('mailto:?subject=Sabadito Alegre&body=Únete: ' + url, '_blank');
  },
  
  copiarEnlace: function() {
    navigator.clipboard.writeText(window.location.href);
    if (window.ui) window.ui.mostrarNotificacion('🔗 Enlace copiado', 'success');
  },
  
  verificarPanelApuestas: function() {
    const panelApuestas = document.getElementById('panelApuestas');
    if (panelApuestas && app.gameState && app.gameState.faseJuego === 'seleccion') {
      if (!app.yaAposto) {
        panelApuestas.classList.remove('hidden');
        console.log('✅ Panel de apuestas visible');
      } else {
        panelApuestas.classList.add('hidden');
        console.log('🔒 Panel de apuestas oculto (ya apostó)');
      }
    }
  }
};
  manejarReconexion: function(datos) {
    console.log('🔄 Manejando reconexión...', datos);
    
    // Mostrar notificación de recuperación
    if (window.ui && datos.estadoRecuperado) {
      window.ui.mostrarNotificacion('✅ Estado recuperado: ' + datos.estadoRecuperado, 'success', true);
    }
    
    // Restaurar estado de apuesta
    if (datos.fichasApostadas && datos.fichasApostadas >= 6) {
      app.yaAposto = true;
      console.log('✅ Apuesta restaurada: ' + datos.fichasApostadas + ' fichas');
    }
    
    // Si era cantador, mostrar panel
    if (datos.esCantador && window.ui) {
      setTimeout(function() {
        window.ui.actualizarPanelCantador(app.emailActual);
      }, 500);
    }
  }
window.app = app;

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, inicializando app...');
  if (window.socketClient) window.socketClient.conectar();
  if (window.ui) {
    window.ui.inicializarModales();
    window.ui.panelCantadorDraggable();
  }
});
