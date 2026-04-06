const premio = {
  reclamar: function(numeroCarton, pozo) {
    console.log('🏆 Reclamando premio:', pozo, 'Cartón:', numeroCarton);
    // ✅ CORRECCIÓN: Enviar nombre del pozo en minúsculas
    const pozoNormalizado = pozo.toLowerCase();
    socket.emit('reclamarPremio', numeroCarton, pozoNormalizado, window.app.emailActual);
  },
  
  reclamarMultiple: function(combinacion, numeroCarton) {
    console.log('🏆 Reclamando combinación:', combinacion, 'Cartón:', numeroCarton);
    
    if (!numeroCarton) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ No se encontró el cartón', 'error');
      return;
    }
    
    // Dividir la combinación (ej: "pokino-full" → ["pokino", "full"])
    var pozos = combinacion.split('-');
    
    // Reclamar cada pozo con delay
    for (var k = 0; k < pozos.length; k++) {
      setTimeout(function(pozo) {
        console.log('🏆 Reclamando pozo:', pozo);
        // ✅ CORRECCIÓN: Enviar nombre del pozo en minúsculas
        const pozoNormalizado = pozo.toLowerCase();
        socket.emit('reclamarPremio', numeroCarton, pozoNormalizado, window.app.emailActual);
      }.bind(this, pozos[k]), k * 1500); // 1.5 segundos entre cada reclamo
    }
    
    if (window.ui) {
      window.ui.mostrarNotificacion('🏆 Reclamando ' + pozos.length + ' premios. Espera entre cada uno.', 'success');
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
      
      // ✅ CERRAR POPUP INMEDIATAMENTE
      var alerta = document.getElementById('alertaGanador');
      if (alerta) {
        alerta.classList.add('hidden');
        alerta.style.display = 'none';
      }
      
      // ✅ MOSTRAR MENSAJE DE ÉXITO
      if (window.ui) {
        window.ui.mostrarNotificacion('✅ Premio confirmado. Revisa tu billetera.', 'success');
      }
      
      window.app.premioPendiente = null;
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
