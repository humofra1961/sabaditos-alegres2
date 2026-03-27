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
  
<<<<<<< HEAD
  iniciarSesion: () => {
=======
  iniciarSesion: function() {
>>>>>>> c3b6ca6cedb4a7dd4701c052655ac1ebd2af6f45
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
    
    // ✅ Verificar panel de apuestas después de iniciar sesión
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
<<<<<<< HEAD
    ui.mostrarNotificacion('🔗 Enlace copiado', 'success');
=======
    if (window.ui) window.ui.mostrarNotificacion('🔗 Enlace copiado', 'success');
  },
  
  verificarPanelApuestas: function() {
    // Mostrar panel de apuestas si no ha apostado y está en fase de selección
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
>>>>>>> c3b6ca6cedb4a7dd4701c052655ac1ebd2af6f45
  }
};

// ✅ IMPORTANTE: Hacer app global
window.app = app;

// Inicializar cuando el DOM esté listo
<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM cargado, inicializando app...');
  socketClient.conectar();
  ui.inicializarModales();
});
=======
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, inicializando app...');
  if (window.socketClient) window.socketClient.conectar();
  if (window.ui) window.ui.inicializarModales();
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, inicializando app...');
  if (window.socketClient) window.socketClient.conectar();
  if (window.ui) {
    window.ui.inicializarModales();
    window.ui.panelCantadorDraggable();
  }
});
>>>>>>> c3b6ca6cedb4a7dd4701c052655ac1ebd2af6f45
