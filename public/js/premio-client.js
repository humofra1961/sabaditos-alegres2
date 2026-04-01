const premio = {
  reclamar: function(numeroCarton, pozo) {
    console.log('🏆 Reclamando premio:', pozo, 'Cartón:', numeroCarton);
    socket.emit('reclamarPremio', numeroCarton, pozo, window.app.emailActual);
  },
  
  // ✅ NUEVA FUNCIÓN: Reclamar múltiples premios simultáneamente
  reclamarMultiple: function(combinacion) {
    console.log('🏆 Reclamando combinación:', combinacion);
    
    // Obtener el cartón seleccionado
    var cartones = window.app.gameState ? window.app.gameState.cartones : [];
    var cartonSeleccionado = null;
    
    for (var i = 0; i < cartones.length; i++) {
      if (cartones[i].dueño === window.app.emailActual && cartones[i].tapadas) {
        var tapadasCount = 0;
        for (var j = 0; j < cartones[i].tapadas.length; j++) {
          if (cartones[i].tapadas[j]) tapadasCount++;
        }
        if (tapadasCount >= 5) {
          cartonSeleccionado = cartones[i];
          break;
        }
      }
    }
    
    if (!cartonSeleccionado) {
      if (window.ui) window.ui.mostrarNotificacion('⚠️ Selecciona un cartón con al menos 5 cartas tapadas', 'error');
      return;
    }
    
    // Dividir la combinación (ej: "pokino-poker" → ["pokino", "poker"])
    var pozos = combinacion.split('-');
    
    // Reclamar cada pozo de la combinación
    for (var k = 0; k < pozos.length; k++) {
      setTimeout(function(pozo) {
        socket.emit('reclamarPremio', cartonSeleccionado.numero, pozo, window.app.emailActual);
      }.bind(this, pozos[k]), k * 500); // 500ms de delay entre cada reclamo
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
