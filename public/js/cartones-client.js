// ============================================================================
// 🎴 CARTONES - LÓGICA DEL CLIENTE
// ============================================================================

const cartones = {
  renderizarGrid: () => {
    const grid = document.getElementById('gridCartones');
    const cartones = app.gameState?.cartones || [];

    if (!grid || cartones.length === 0) {
      if (grid) grid.innerHTML = '<p>Cargando cartones...</p>';
      return;
    }

    grid.innerHTML = cartones.map(carton => {
      const seleccionado = carton.dueño === app.emailActual;
      const bloqueado = carton.dueño && carton.dueño !== app.emailActual;

      const imagenCarton = carton.numero <= 12
        ? `<img src="/img/cartones/carton_${carton.numero}.png" alt="Cartón ${carton.numero}" style="width: 100%; border-radius: 6px; margin-bottom: 8px;">`
        : '';

      return `
        <div class="carton-item ${seleccionado ? 'seleccionado' : ''} ${bloqueado ? 'bloqueado' : ''}"
             onclick="${!bloqueado ? `cartones.seleccionarCarton(${carton.numero})` : ''}">
          ${imagenCarton}
          <strong style="color: #f39c12;">${carton.nombre}</strong>
          <p style="font-size: 0.75em; margin: 4px 0;">
            ${seleccionado ? '✅ Tuyo' : bloqueado ? '🔒 Ocupado' : '📋 Libre'}
          </p>
        </div>
      `;
    }).join('');
  },

  seleccionarCarton: (numero) => {
    const carton = app.gameState?.cartones?.find(c => c.numero === numero);
    if (carton && carton.dueño === app.emailActual) {
      socket.emit('liberarCarton', numero, app.emailActual);
    } else {
      socket.emit('seleccionarCarton', numero, app.emailActual, app.nombreActual);
    }
  },

  renderizarMisCartones: () => {
    const container = document.getElementById('misCartones');
    const cartones = app.gameState?.cartones || [];

    if (!container || cartones.length === 0) {
      if (container) container.innerHTML = '<p>Cargando cartones...</p>';
      return;
    }

    const misCartones = cartones.filter(c => c.dueño === app.emailActual);

    if (!misCartones || misCartones.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 30px; color: #95a5a6;">Selecciona cartones arriba para jugar</p>';
      return;
    }

    container.innerHTML = misCartones.map(carton => {
      if (!carton.cartas || !Array.isArray(carton.cartas) || carton.cartas.length !== 25) {
        return `<div class="carton-bingo-pro"><p style="color: #e74c3c;">Error en cartón ${carton.numero}</p></div>`;
      }

      return `
        <div class="carton-bingo-pro">
          <div class="carton-header-pro">${carton.nombre}</div>
          <div class="carton-info-pro">
            <span>★ Poker: ${carton.valorPoker}</span>
            <span>★ Full: ${carton.valorFull2}+${carton.valorFull3}</span>
          </div>
          <div class="carton-board-pro">
            ${carton.cartas.map((carta, index) => {
              const estaTapada = carton.tapadas && carton.tapadas[index] ? 'tapada' : '';
              const nombreImagen = carta.codigo.replace('1', 'A');
              const paloArchivo = carta.palo === '♠' ? 'p' : carta.palo === '♥' ? 'c' : carta.palo === '♦' ? 'd' : 't';

              return `
                <div class="carta-pro ${estaTapada}" onclick="cartones.taparCarta(${carton.numero}, ${index})">
                  ${estaTapada ? '<span style="color: #f39c12; font-size: 2em;">✓</span>' : ''}
                  <img src="/img/cartas/${nombreImagen}${paloArchivo}.png" 
                       alt="${carta.valor}${carta.palo}" style="width: 100%; height: 100%; object-fit: contain;"/>
                </div>
              `;
            }).join('')}
          </div>
          <div class="botones-pozos">
            ${Object.keys(pozosInfo).map(pozo => `
              <button class="boton-pozo ${carton.pozos && carton.pozos[pozo] ? 'reclamado' : ''}"
                      onclick="premio.reclamar(${carton.numero}, '${pozo}')"
                      ${(carton.pozos && carton.pozos[pozo]) ? 'disabled' : ''}>${pozosInfo[pozo].nombre}</button>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  },

  taparCarta: (numeroCarton, index) => {
    socket.emit('taparCarta', numeroCarton, index, app.emailActual);
  },

  verificarEspecial: () => {
    const cartones = app.gameState?.cartones || [];
    cartones.forEach(carton => {
      if (carton.dueño === app.emailActual) {
        let tapadasCount = carton.tapadas.filter(t => t).length;
        if (tapadasCount === 25) {
          ui.mostrarNotificacion(`🏆 ¡CARTÓN ${carton.nombre} LLENO! (${tapadasCount}/25)`, 'success', true);
        }
      }
    });
  }
};

const pozosInfo = {
  pokino: { nombre: 'POKINO', premio: 50 },
  cuatroEsquinas: { nombre: '4 ESQUINAS', premio: 150 },
  full: { nombre: 'FULL', premio: 200 },
  poker: { nombre: 'POKER', premio: 300 },
  centro: { nombre: 'CENTRO', premio: 250 },
  especial: { nombre: 'ESPECIAL', premio: 500 }
};

// ✅ IMPORTANTE: Hacer cartones global
window.cartones = cartones;
