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
  
  iniciarSesion: () => {
    const email = document.getElementById('emailInput').value.trim();
    const nombre = document.getElementById('nombreInput').value.trim();
    
    if (!email || !nombre) {
      ui.mostrarNotificacion('Ingresa correo y nombre', 'error');
      return;
    }
    
    app.emailActual = email;
    app.nombreActual = nombre;
    
    socket.emit('registerPlayer', email, nombre);
    
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('jugadorNombre').textContent = nombre;
    
    console.log('👤 Sesión iniciada:', email);
  },
  
  cerrarSesion: () => {
    location.reload();
  },
  
  invitarWhatsApp: () => {
    const url = window.location.href;
    const mensaje = `🎊 ¡SABADITO ALEGRE EN LÍNEA! 🎊%0A%0A🌐 URL: ${url}%0A%0A¡Únete al juego!`;
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  },
  
  invitarEmail: () => {
    const url = window.location.href;
    window.open(`mailto:?subject=Sabadito Alegre&body=Únete: ${url}`, '_blank');
  },
  
  copiarEnlace: () => {
    navigator.clipboard.writeText(window.location.href);
    ui.mostrarNotificacion('🔗 Enlace copiado', 'success');
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM cargado, inicializando app...');
  socketClient.conectar();
  ui.inicializarModales();
});
