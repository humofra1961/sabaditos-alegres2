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
      ui.mostrarNotificacion('Ingresa correo y nombre', 'error');
      return;
    }
    verificarPanelApuestas: function() {
      // Mostrar panel de apuestas si no ha apostado y está en fase de selección
      const panelApuestas = document.getElementById('panelApuestas');
      if (panelApuestas && window.app.gameState && window.app.gameState.faseJuego === 'seleccion') {
        if (!window.app.yaAposto) {
          panelApuestas.classList.remove('hidden');
        }
      }
    }    
    app.emailActual = email;
    app.nombreActual = nombre;
    
    socket.emit('registerPlayer', email, nombre);
    
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('jugadorNombre').textContent = nombre;
    
    console.log('👤 Sesión iniciada:', email);
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
    ui.mostrarNotificacion('🔗 Enlace copiado', 'success');
  }
};

// ✅ IMPORTANTE: Hacer app global
window.app = app;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, inicializando app...');
  socketClient.conectar();
  ui.inicializarModales();
});
