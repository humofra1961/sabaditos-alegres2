const cartones = {
  renderizarGrid: function() {
    console.log('🎴 renderizarGrid llamado');
    
    var grid = document.getElementById('gridCartones');
    console.log('Grid element:', grid);
    
    var cartones = window.app.gameState ? window.app.gameState.cartones : [];
    console.log('Cartones recibidos:', cartones ? cartones.length : 0);
    
    if (!grid) {
      console.error('❌ NO se encontró #gridCartones en el HTML');
      return;
    }
    
    if (!cartones || cartones.length === 0) {
      grid.innerHTML = '<p>Cargando cartones...</p>';
      return;
    }
    
    var html = '';
    for (var i = 0; i < cartones.length; i++) {
      var carton = cartones[i];
      var seleccionado = carton.dueño === window.app.emailActual;
      var bloqueado = carton.dueño && carton.dueño !== window.app.emailActual;
      
      html += '<div style="background: linear-gradient(135deg, #2c3e50, #34495e); border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; border: 3px solid ' + (seleccionado ? '#27ae60' : bloqueado ? '#e74c3c' : 'transparent') + '; margin-bottom: 10px;" onclick="window.cartones.seleccionarCarton(' + carton.numero + ')">';
      html += '<strong style="color: #f39c12; font-size: 1.2em;">' + carton.nombre + '</strong>';
      html += '<p style="font-size: 0.9em; margin: 8px 0 0 0; color: ' + (seleccionado ? '#27ae60' : bloqueado ? '#e74c3c' : '#95a5a6') + ';">' + (seleccionado ? '✅ Tuyo' : bloqueado ? '🔒 Ocupado' : '📋 Libre') + '</p>';
      html += '</div>';
    }
    
    grid.innerHTML = html;
    console.log('✅ Grid renderizado con', cartones.length, 'cartones');
  },
  
  seleccionarCarton: function(numero) {
    console.log('🎴 Seleccionando cartón:', numero);
    
    var carton = null;
    if (window.app.gameState && window.app.gameState.cartones) {
      for (var i = 0; i < window.app.gameState.cartones.length; i++) {
        if (window.app.gameState.cartones[i].numero === numero) {
          carton = window.app.gameState.cartones[i];
          break;
        }
      }
    }
    
    if (carton && carton.dueño === window.app.emailActual) {
      socket.emit('liberarCarton', numero, window.app.emailActual);
    } else {
      socket.emit('seleccionarCarton', numero, window.app.emailActual, window.app.nombreActual);
    }
    
    setTimeout(function() {
      console.log('🎰 LLAMANDO verificarPanelApuestas');
      if (window.app && window.app.verificarPanelApuestas) {
        window.app.verificarPanelApuestas();
      }
    }, 1500);
  },
  
  renderizarMisCartones: function() {
    console.log('🎴 renderizarMisCartones llamado');
    
    var container = document.getElementById('misCartones');
    var cartones = window.app.gameState ? window.app.gameState.cartones : [];
    
    if (!container) {
      console.error('❌ NO se encontró #misCartones');
      return;
    }
    
    var misCartones = [];
    for (var i = 0; i < cartones.length; i++) {
      if (cartones[i].dueño === window.app.emailActual) {
        misCartones.push(cartones[i]);
      }
    }
    
    if (misCartones.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 30px; color: #95a5a6;">Selecciona cartones arriba para jugar</p>';
      return;
    }
    
    var html = '';
    for (var j = 0; j < misCartones.length; j++) {
      var carton = misCartones[j];
      html += '<div style="background: linear-gradient(135deg, #3498db, #2980b9); border-radius: 12px; padding: 15px; margin-bottom: 15px;">';
      html += '<div style="color: #f39c12; font-size: 1.3em; font-weight: bold; margin-bottom: 10px;">' + carton.nombre + '</div>';
      html += '<p style="color: #ecf0f1; margin: 5px 0;">★ Poker: ' + carton.valorPoker + '</p>';
      html += '<p style="color: #ecf0f1; margin: 5px 0;">★ Full: ' + carton.valorFull2 + '+' + carton.valorFull3 + '</p>';
      html += '</div>';
    }
    
    container.innerHTML = html;
    console.log('✅ Mis cartones renderizados:', misCartones.length);
  },
  
  taparCarta: function(numeroCarton, index) {
    socket.emit('taparCarta', numeroCarton, index, window.app.emailActual);
  },
  
  verificarEspecial: function() {
    var cartones = window.app.gameState ? window.app.gameState.cartones : [];
    for (var i = 0; i < cartones.length; i++) {
      if (cartones[i].dueño === window.app.emailActual) {
        var tapadasCount = 0;
        if (cartones[i].tapadas) {
          for (var j = 0; j < cartones[i].tapadas.length; j++) {
            if (cartones[i].tapadas[j]) tapadasCount++;
          }
        }
        if (tapadasCount === 25) {
          if (window.ui) window.ui.mostrarNotificacion('¡CARTÓN ' + carton.nombre + ' LLENO! (' + tapadasCount + '/25)', 'success', true);
        }
      }
    }
  }
};

window.cartones = cartones;
