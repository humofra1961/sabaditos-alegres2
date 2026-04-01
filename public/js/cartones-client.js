const cartones = {
  renderizarGrid: function() {
    console.log('🎴 renderizarGrid llamado');
    
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
      
      // ✅ IMAGEN DEL CARTÓN
      var imagenCarton = '<img src="/img/cartones/carton_' + carton.numero + '.png" alt="' + carton.nombre + '" style="width: 100%; border-radius: 6px; margin-bottom: 8px;">';
      
      html += '<div class="carton-item ' + (seleccionado ? 'seleccionado' : '') + ' ' + (bloqueado ? 'bloqueado' : '') + '" onclick="window.cartones.seleccionarCarton(' + carton.numero + ')">';
      html += imagenCarton;
      html += '<strong style="color: #f39c12;">' + carton.nombre + '</strong>';
      html += '<p style="font-size: 0.75em; margin: 4px 0;">' + (seleccionado ? '✅ Tuyo' : bloqueado ? '🔒 Ocupado' : '📋 Libre') + '</p>';
      html += '</div>';
    }
    
    grid.innerHTML = html;
    console.log('✅ Grid de cartones renderizado con', cartones.length, 'cartones');
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
    }, 1000);
  },
  
  renderizarMisCartones: function() {
    console.log('🎴 renderizarMisCartones llamado');
    
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
      container.innerHTML = '<p style="text-align: center; padding: 30px; color: #95a5a6;">Selecciona cartones arriba para jugar</p>';
      return;
    }
    
    var html = '';
    for (var j = 0; j < misCartones.length; j++) {
      var carton = misCartones[j];
      
      if (!carton.cartas || !Array.isArray(carton.cartas) || carton.cartas.length !== 25) {
        html += '<div class="carton-bingo-pro"><p style="color: #e74c3c;">Error en cartón ' + carton.numero + '</p></div>';
        continue;
      }
      
      html += '<div class="carton-bingo-pro">';
      html += '<div class="carton-header-pro">' + carton.nombre + '</div>';
      html += '<div class="carton-info-pro">';
      html += '<span>★ Poker: ' + carton.valorPoker + '</span>';
      html += '<span>★ Full: ' + carton.valorFull2 + '+' + carton.valorFull3 + '</span>';
      html += '</div>';
      html += '<div class="carton-board-pro">';
      
      for (var k = 0; k < carton.cartas.length; k++) {
        var carta = carton.cartas[k];
        var estaTapada = carton.tapadas && carton.tapadas[k];
        
        // ✅ MAPEO CORRECTO DE CARTAS A IMÁGENES
        var nombreImagen = carta.valor;
        if (carta.valor === 'A' || carta.valor === '1') {
          nombreImagen = '1';
        }
        
        var paloArchivo = 't';
        if (carta.palo === '♠') paloArchivo = 'p';
        else if (carta.palo === '♥') paloArchivo = 'c';
        else if (carta.palo === '♦') paloArchivo = 'd';
        else if (carta.palo === '♣') paloArchivo = 't';
        
        html += '<div class="carta-pro ' + (estaTapada ? 'tapada' : '') + '" onclick="window.cartones.taparCarta(' + carton.numero + ', ' + k + ')">';
        if (estaTapada) {
          html += '<span style="color: #f39c12; font-size: 2em;">✓</span>';
        } else {
          html += '<img src="/img/cartas/' + nombreImagen + paloArchivo + '.png" alt="' + carta.valor + carta.palo + '" style="width: 100%; height: 100%; object-fit: contain;">';
        }
        html += '</div>';
      }
      
      html += '</div>';
      html += '<div class="botones-pozos">';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('pokino')">POKINO</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('pokino-poker')">POKINO+POKER</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('pokino-full')">POKINO+FULL</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('cuatroEsquinas')">4 ESQ</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('pokino-4esquinas')">POKINO+4 ESQ</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('full')">FULL</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('poker')">POKER</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('centro')">CENTRO</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('pokino-centro')">POKINO+CENTRO</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamarMultiple('especial')">ESPECIAL</button>';
      
      /*html += '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'pokino\')">POKINO</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'cuatroEsquinas\')">4 ESQ</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'full\')">FULL</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'poker\')">POKER</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'centro\')">CENTRO</button>';
      html += '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'especial\')">ESPECIAL</button>';**/
      html += '</div>';
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
          if (window.ui) window.ui.mostrarNotificacion('¡CARTÓN ' + cartones[i].nombre + ' LLENO! (' + tapadasCount + '/25)', 'success', true);
        }
      }
    }
  }
};

window.cartones = cartones;
