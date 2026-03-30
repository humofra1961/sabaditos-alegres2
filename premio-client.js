// ============================================================================
// 🏆 PREMIO - RECLAMAR Y CONFIRMAR
// ============================================================================

const premio = {
  reclamar: function(numeroCarton, pozo) {
    console.log('🏆 Reclamando premio:', pozo, 'Cartón:', numeroCarton);
    socket.emit('reclamarPremio', numeroCarton, pozo, window.app.emailActual);
  },
  
  confirmar: function() {
    console.log('✅ Confirmando premio');
    if (window.app.premioPendiente) {
      const pozoKey = Object.keys(window.pozosInfo).find(function(k) { 
        return window.pozosInfo[k].nombre === window.app.premioPendiente.pozo; 
      });
      socket.emit('confirmarPremio', 
        window.app.premioPendiente.carton, 
        pozoKey, 
        window.app.premioPendiente.email, 
        window.app.emailActual
      );
    }
  },
  
  rechazar: function() {
    console.log('❌ Rechazando premio');
    document.getElementById('alertaGanador').classList.add('hidden');
    window.app.premioPendiente = null;
    if (window.ui) window.ui.mostrarNotificacion('❌ Premio rechazado', 'error');
  },
  
  mostrarAlerta: function(data) {
    console.log('🏆 Mostrando alerta de ganador:', data);
    
    if (window.app.gameState && window.app.gameState.cantador === window.app.emailActual) {
      window.app.premioPendiente = data;
      
      const mensajeEl = document.getElementById('mensajeGanador');
      if (mensajeEl) {
        mensajeEl.textContent = data.mensaje;
      }
      
      const alerta = document.getElementById('alertaGanador');
      if (alerta) {
        alerta.classList.remove('hidden');
        if (data.esEspecial) {
          alerta.classList.add('especial');
        } else {
          alerta.classList.remove('especial');
        }
      }
      
      console.log('✅ Alerta de ganador mostrada al cantador');
    }
    
    if (window.ui) {
      window.ui.mostrarNotificacion(data.mensaje, 'success');
    }
  }
};

window.pozosInfo = {
  pokino: { nombre: 'POKINO', premio: 50 },
  cuatroEsquinas: { nombre: '4 ESQUINAS', premio: 150 },
  full: { nombre: 'FULL', premio: 200 },
  poker: { nombre: 'POKER', premio: 300 },
  centro: { nombre: 'CENTRO', premio: 250 },
  especial: { nombre: 'ESPECIAL', premio: 500 }
};

window.premio = premio;
