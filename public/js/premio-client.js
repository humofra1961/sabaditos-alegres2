const premio = {
  reclamar: function(numeroCarton, pozo) {
    console.log('🏆 Reclamando premio:', pozo, 'Cartón:', numeroCarton);
    socket.emit('reclamarPremio', numeroCarton, pozo, window.app.emailActual);
  },
  
  // ✅ CORREGIDO: Reclamar múltiples premios con confirmación individual
  reclamarMultiple: function(combinacion, numeroCarton) {
    console.log('🏆 Reclamando combinación:', combinacion, 'Cartón:', numeroCarton);
    
    if (!numeroCarton) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ No se encontró el cartón', 'error');
      return;
    }
    
    // Dividir la combinación (ej: "pokino-4esquinas" → ["pokino", "4esquinas"])
    var pozos = combinacion.split('-');
    
    // ✅ CORRECCIÓN: Reclamar cada pozo con 1 segundo de delay para que el cantador pueda confirmar cada uno
    for (var k = 0; k < pozos.length; k++) {
      setTimeout(function(pozo) {
        console.log('🏆 Reclamando pozo:', pozo);
        socket.emit('reclamarPremio', numeroCarton, pozo, window.app.emailActual);
      }.bind(this, pozos[k]), k * 3000); // 1.5 segundos entre cada reclamo
    }
    
    if (window.ui) {
      window.ui.mostrarNotificacion('🏆 Reclamando ' + pozos.length + ' premios. El cantador debe confirmar cada uno.', 'success');
    }
  },
  
  confirmar: function() {
    console.log('✅ Confirmando premio');
    if (window.app.premioPendiente) {
      socket.emit('confirmarPremio', 
        window.app.premioPendiente.carton, 
        window.app.premioPendiente.pozo, 
        window.app.premioPendiente.email, 
        window.app.emailActual
      );
      
      // ✅ CERRAR POPUP DESPUÉS DE CONFIRMAR
      setTimeout(function() {
        var alerta = document.getElementById('alertaGanador');
        if (alerta) {
          alerta.classList.add('hidden');
          alerta.style.display = 'none';
        }
        window.app.premioPendiente = null;
      }, 1000);
    }
  },
  
  rechazar: function() {
    console.log('❌ Rechazando premio');
    var alerta = document.getElementById('alertaGanador');
    if (alerta) {
      alerta.classList.add('hidden');
      alerta.style.display = 'none';
    }
    window.app.premioPendiente = null;
    if (window.ui) window.ui.mostrarNotificacion('❌ Premio rechazado', 'error');
  },
  
  mostrarAlerta: function(data) {
    console.log('🏆 Mostrando alerta de ganador:', data);
    
    if (window.app.gameState && window.app.gameState.cantador === window.app.emailActual) {
      window.app.premioPendiente = data;
      
      var mensajeEl = document.getElementById('mensajeGanador');
      if (mensajeEl) {
        mensajeEl.textContent = data.mensaje;
      }
      
      var alerta = document.getElementById('alertaGanador');
      if (alerta) {
        alerta.classList.remove('hidden');
        alerta.style.display = 'block';
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
