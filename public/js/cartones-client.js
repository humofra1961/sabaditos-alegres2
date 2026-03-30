const cartones = {
  renderizarGrid: function() {
    console.log('🎴 Renderizando grid de cartones...');
    var grid = document.getElementById('gridCartones');
    var cartones = window.app.gameState ? window.app.gameState.cartones : [];
    
    if (!grid) {
      console.error('❌ No se encontró #gridCartones');
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
      
      html += '<div class="carton-item ' + (seleccionado ? 'seleccionado' : '') + ' ' + (bloqueado ? 'bloqueado' : '') + '" onclick="window.cartones.seleccionarCarton(' + carton.numero + ')">';
      html += '<strong style="color: #f39c12;">' + carton.nombre + '</strong>';
      html += '<p style="font-size: 0.75em; margin: 4px 0;">' + (seleccionado ? '✅ Tuyo' : bloqueado ? '🔒 Ocupado' : '📋 Libre') + '</p>';
      html += '</div>';
    }
    
    grid.innerHTML = html;
    console.log('✅ Grid de cartones renderizado');
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
      console.log('🎰 LLAMANDO A verificarPanelApuestas DESPUÉS DE SELECCIONAR');
      if (window.app && window.app.verificarPanelApuestas) {
        window.app.verificarPanelApuestas();
      }
    }, 1500);
  },
  
  renderizarMisCartones: function() {
    console.log('🎴 Renderizando mis cartones...');
    var container = document.getElementById('misCartones');
    var cartones = window.app.gameState ? window.app.gameState.cartones : [];
    
    if (!container) {
      console.error('❌ No se encontró #misCartones');
      return;
    }
    
    var misCartones = [];
    for (var i = 0; i < cartones.length; i++) {
      if (cartones[i].dueño === window.app.emailActual) {
        misCartones.push(cartones[i]);
      }
    }
    
    if (misCartones.length === 0) {
      container.innerHTML = '<p>Selecciona cartones arriba</p>';
      return;
    }
    
    var html = '';
    for (var j = 0; j < misCartones.length; j++) {
      var carton = misCartones[j];
      html += '<div class="carton-bingo-pro">';
      html += '<div class="carton-header-pro">' + carton.nombre + '</div>';
      html += '<p>Poker: ' + carton.valorPoker + ' | Full: ' + carton.valorFull2 + '+' + carton.valorFull3 + '</p>';
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
