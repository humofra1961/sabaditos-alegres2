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
