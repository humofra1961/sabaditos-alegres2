// ============================================================================
// 🎴 CARTONES - LÓGICA DEL CLIENTE
// ============================================================================

const cartones = {
  renderizarGrid: function() {
    console.log('🎴 renderizarGrid llamado');
    const grid = document.getElementById('gridCartones');
    const cartones = window.app.gameState ? window.app.gameState.cartones : [];
    console.log('🎴 Cartones a renderizar:', cartones.length);
    
    if (!grid) {
      console.error('❌ No se encontró #gridCartones');
      return;
    }
    
    if (!cartones || cartones.length === 0) {
      grid.innerHTML = '<p>Cargando cartones...</p>';
      return;
    }
    
    grid.innerHTML = cartones.map(function(carton) {
      const seleccionado = carton.dueño === window.app.emailActual;
      const bloqueado = carton.dueño && carton.dueño !== window.app.emailActual;
      
      const imagenCarton = carton.numero <= 12
        ? '<img src="/img/cartones/carton_' + carton.numero + '.png" alt="Cartón ' + carton.numero + '" style="width: 100%; border-radius: 6px; margin-bottom: 8px;">'
        : '';
      
      return '<div class="carton-item ' + (seleccionado ? 'seleccionado' : '') + ' ' + (bloqueado ? 'bloqueado' : '') + '" ' +
             'onclick="window.cartones.seleccionarCarton(' + carton.numero + ')">' +
             imagenCarton +
             '<strong style="color: #f39c12;">' + carton.nombre + '</strong>' +
             '<p style="font-size: 0.75em; margin: 4px 0;">' +
             (seleccionado ? '✅ Tuyo' : bloqueado ? '🔒 Ocupado' : '📋 Libre') +
             '</p></div>';
    }).join('');
    
    console.log('✅ Grid de cartones renderizado');
  },
  
  seleccionarCarton: function(numero) {
    console.log('🎴 Seleccionando cartón:', numero);
    const carton = window.app.gameState ? window.app.gameState.cartones.find(function(c) { return c.numero === numero; }) : null;
    if (carton && carton.dueño === window.app.emailActual) {
      socket.emit('liberarCarton', numero, window.app.emailActual);
    } else {
      socket.emit('seleccionarCarton', numero, window.app.emailActual, window.app.nombreActual);
    }
  },
  
  renderizarMisCartones: function() {
    console.log('🎴 renderizarMisCartones llamado');
    const container = document.getElementById('misCartones');
    const cartones = window.app.gameState ? window.app.gameState.cartones : [];
    const misCartones = cartones ? cartones.filter(function(c) { return c.dueño === window.app.emailActual; }) : [];
    
    if (!container) {
      console.error('❌ No se encontró #misCartones');
      return;
    }
    
    if (!misCartones || misCartones.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 30px; color: #95a5a6;">Selecciona cartones arriba para jugar</p>';
      return;
    }
    
    container.innerHTML = misCartones.map(function(carton) {
      if (!carton.cartas || !Array.isArray(carton.cartas) || carton.cartas.length !== 25) {
        return '<div class="carton-bingo-pro"><p style="color: #e74c3c;">Error en cartón ' + carton.numero + '</p></div>';
      }
      
      return '<div class="carton-bingo-pro">' +
             '<div class="carton-header-pro">' + carton.nombre + '</div>' +
             '<div class="carton-info-pro">' +
             '<span>★ Poker: ' + carton.valorPoker + '</span>' +
             '<span>★ Full: ' + carton.valorFull2 + '+' + carton.valorFull3 + '</span>' +
             '</div>' +
             '<div class="carton-board-pro">' +
             carton.cartas.map(function(carta, index) {
               const estaTapada = carton.tapadas && carton.tapadas[index];
               const nombreImagen = carta.codigo.replace('A', '1');
               const paloArchivo = carta.palo === '♠' ? 'p' : carta.palo === '♥' ? 'c' : carta.palo === '♦' ? 'd' : 't';
               
               return '<div class="carta-pro ' + (estaTapada ? 'tapada' : '') + '" onclick="window.cartones.taparCarta(' + carton.numero + ', ' + index + ')">' +
                      (estaTapada ? '<span style="color: #f39c12; font-size: 2em;">✓</span>' : '') +
                      '<img src="/img/cartas/' + nombreImagen + paloArchivo + '.png" alt="' + carta.valor + carta.palo + '" style="width: 100%; height: 100%; object-fit: contain;"/>' +
                      '</div>';
             }).join('') +
             '</div>' +
             '<div class="botones-pozos">' +
             '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'pokino\')">POKINO</button>' +
             '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'cuatroEsquinas\')">4 ESQ</button>' +
             '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'full\')">FULL</button>' +
             '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'poker\')">POKER</button>' +
             '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'centro\')">CENTRO</button>' +
             '<button class="boton-pozo" onclick="window.premio.reclamar(' + carton.numero + ', \'especial\')">ESPECIAL</button>' +
             '</div>' +
             '</div>';
    }).join('');
    
    console.log('✅ Mis cartones renderizados:', misCartones.length);
  },
  
  taparCarta: function(numeroCarton, index) {
    socket.emit('taparCarta', numeroCarton, index, window.app.emailActual);
  },
  
  verificarEspecial: function() {
    const cartones = window.app.gameState ? window.app.gameState.cartones : [];
    cartones.forEach(function(carton) {
      if (carton.dueño === window.app.emailActual) {
        const tapadasCount = carton.tapadas ? carton.tapadas.filter(function(t) { return t; }).length : 0;
        if (tapadasCount === 25) {
          if (window.ui) window.ui.mostrarNotificacion('🏆 ¡CARTÓN ' + carton.nombre + ' LLENO! (' + tapadasCount + '/25)', 'success', true);
        }
      }
    });
  }
};

window.cartones = cartones;
