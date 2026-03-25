// ============================================================================
// 🎨 UI - RENDERIZADO DE INTERFAZ
// ============================================================================

const ui = {
  actualizarEstadoConexion: (conectado) => {
    const estadoEl = document.getElementById('estadoConexion');
    if (estadoEl) {
      estadoEl.className = `status ${conectado ? 'connected' : 'disconnected'}`;
      estadoEl.innerHTML = conectado ? '✅ Conectado' : '❌ Desconectado';
      estadoEl.style.background = conectado ? '#27ae60' : '#e74c3c';
    }
  },

  renderizarTodo: () => {
    ui.renderizarJugadores();
    ui.renderizarCartasPorPintas();
    ui.renderizarUltimaCarta(app.gameState?.ultimaCarta);
    ui.actualizarFaseJuego(app.gameState?.faseJuego);
    ui.actualizarPanelCantador(app.gameState?.cantador);
    ui.actualizarBanco(app.gameState?.banco);
    ui.actualizarMonedas(app.gameState?.jugadores?.[app.emailActual]?.monedas || 0);
  },

  renderizarJugadores: () => {
    const lista = document.getElementById('listaJugadores');
    const contador = document.getElementById('contadorJugadores');
    if (!lista) return;

    const jugadores = app.gameState?.jugadores || {};
    lista.innerHTML = Object.entries(jugadores).map(([email, datos]) => `
      <div class="jugador-item ${app.gameState?.cantador === email ? 'cantador' : ''}">
        <span>${datos.nombre} ${app.gameState?.cantador === email ? '🎤' : ''}</span>
        <span style="color: #f39c12;">${datos.monedas || 0} 💰</span>
      </div>
    `).join('');

    if (contador) contador.textContent = Object.keys(jugadores).length;
  },

  actualizarSelectJugadores: () => {
    const select = document.getElementById('selectJugadorMonedas');
    if (!select) return;

    const jugadores = app.gameState?.jugadores || {};
    select.innerHTML = Object.entries(jugadores).map(([email, datos]) =>
      `<option value="${email}">${datos.nombre} (${datos.monedas || 0} 💰)</option>`
    ).join('');
  },

  actualizarMonedas: (monedas) => {
    const monedasEl = document.getElementById('misMonedas');
    const valorEl = document.getElementById('misMonedasValor');
    if (monedasEl) monedasEl.textContent = monedas;
    if (valorEl) valorEl.textContent = monedas * 50;
  },

  renderizarCartasPorPintas: () => {
    const container = document.getElementById('cartasPorPintas');
    if (!container) return;

    const cartas = app.gameState?.cartasCantadas || [];
    const porPintas = { '♠': [], '♥': [], '♦': [], '♣': [] };
    const colores = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' };

    cartas.forEach(carta => {
      if (carta && carta.palo) {
        porPintas[carta.palo].push(carta);
      }
    });

    container.innerHTML = Object.entries(porPintas).map(([palo, cartasPalo]) => `
      <div class="pinta-grupo">
        <div class="pinta-titulo" style="color: ${colores[palo]}">${palo} (${cartasPalo.length})</div>
        <div class="cartas-cantadas-grid">
          ${cartasPalo.map(carta => `
            <div class="carta-cantada" style="color: ${colores[carta.palo]}">
              <div style="font-weight: bold;">${carta.valor}</div>
              <div style="font-size: 1.2em;">${carta.palo}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  renderizarUltimaCarta: (carta) => {
    const display = document.getElementById('ultimaCartaDisplay');
    if (!display) return;

    if (carta) {
      display.innerHTML = `<span style="color: ${carta.color || '#000'}">${carta.valor}${carta.palo}</span>`;
    } else {
      display.textContent = '-';
    }
  },

  actualizarFaseJuego: (fase) => {
    const indicator = document.getElementById('faseJuego');
    const seleccion = document.getElementById('seleccionCartones');
    if (!indicator) return;

    if (fase === 'seleccion') {
      indicator.className = 'fase-indicator fase-seleccion';
      indicator.textContent = 'Fase: Selección';
      if (seleccion) seleccion.classList.remove('hidden');
    } else {
      indicator.className = 'fase-indicator fase-jugando';
      indicator.textContent = 'Fase: Jugando';
      if (seleccion) seleccion.classList.add('hidden');
    }
  },

  actualizarPanelCantador: (email) => {
    const panel = document.getElementById('panelCantador');
    const panelFijo = document.getElementById('panelCantadorFijo');
    const btnSerCantador = document.getElementById('btnSerCantador');

    if (panel) panel.classList.toggle('hidden', email !== app.emailActual);
    if (panelFijo) panelFijo.classList.toggle('hidden', email !== app.emailActual);
    if (btnSerCantador) btnSerCantador.style.display = email ? 'none' : 'inline-block';
  },

  actualizarBanco: (banco) => {
    if (!banco) return;
    const recaudadoEl = document.getElementById('bancoRecaudado');
    const pagadoEl = document.getElementById('bancoPagado');
    if (recaudadoEl) recaudadoEl.textContent = banco.totalRecaudado;
    if (pagadoEl) pagadoEl.textContent = banco.totalPagado;
  },

  mostrarValidacionFallida: (data) => {
    ui.mostrarNotificacion(data.mensaje, 'error', true);

    const panel = document.getElementById('panelVerificacionApuestas');
    const lista = document.getElementById('listaVerificacionApuestas');
    const mensaje = document.getElementById('mensajeValidacion');

    if (panel && lista && mensaje) {
      panel.style.display = 'block';
      lista.innerHTML = data.jugadoresNoListos.map(j => `
        <div class="verificacion-item nolisto">
          <strong>❌ ${j.nombre}</strong><br>
          <span style="font-size: 0.75em;">${j.razon}</span>
        </div>
      `).join('');

      mensaje.innerHTML = `<span style="color: #e74c3c;">${data.jugadoresNoListos.length} de ${data.totalJugadores} jugadores NO están listos</span>`;
    }

    const btnIniciar = document.getElementById('btnIniciarJuego');
    if (btnIniciar) {
      btnIniciar.disabled = true;
      btnIniciar.style.opacity = '0.5';
      btnIniciar.textContent = '⛔ Esperando apuestas...';
    }
  },

  mostrarEstadoApuestas: (data) => {
    const panel = document.getElementById('panelVerificacionApuestas');
    const lista = document.getElementById('listaVerificacionApuestas');

    if (panel && lista) {
      panel.style.display = 'block';

      if (data.todosListos) {
        lista.innerHTML = data.listos.map(j => `
          <div class="verificacion-item listo">
            <strong>✅ ${j.nombre}</strong><br>
            <span style="font-size: 0.75em;">💰 ${j.monedas} fichas | 🎰 ${j.apostado} fichas apostadas</span>
          </div>
        `).join('');

        document.getElementById('mensajeValidacion').innerHTML = `<span style="color: #27ae60;">✅ Todos los ${data.listos.length} jugadores están listos</span>`;
      } else {
        lista.innerHTML = `
          <div><strong style="color: #27ae60;">Listos:</strong> ${data.listos.map(j => j.nombre).join(', ')}</div>
          <div><strong style="color: #e74c3c;">No Listos:</strong> ${data.noListos.map(j => j.nombre).join(', ')}</div>
        `;
      }
    }
  },

  mostrarJuegoIniciado: (data) => {
    const btnIniciar = document.getElementById('btnIniciarJuego');
    if (btnIniciar) {
      btnIniciar.disabled = false;
      btnIniciar.style.opacity = '1';
      btnIniciar.textContent = '▶️ Iniciar';
    }

    const panel = document.getElementById('panelVerificacionApuestas');
    if (panel) panel.style.display = 'none';

    ui.mostrarNotificacion(data.mensaje, 'success');
  },

  mostrarNotificacion: (mensaje, tipo = 'success', especial = false) => {
    const notif = document.createElement('div');
    notif.className = `notificacion ${especial ? 'especial' : ''}`;
    notif.style.cssText = `
      position: fixed;
      top: 18px;
      right: 18px;
      padding: 14px 20px;
      border-radius: 10px;
      background: ${tipo === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #27ae60, #219a52)'};
      color: #fff;
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 5000);
  },

  mostrarModalSolicitud: () => {
    document.getElementById('modalSolicitud').classList.add('active');
  },

  cerrarModalSolicitud: () => {
    document.getElementById('modalSolicitud').classList.remove('active');
    document.getElementById('mensajeSolicitud').value = '';
  },

  enviarSolicitud: () => {
    const mensaje = document.getElementById('mensajeSolicitud').value.trim();
    if (!mensaje) {
      ui.mostrarNotificacion('Escribe un motivo', 'error');
      return;
    }
    socket.emit('solicitarCambio', app.emailActual, mensaje);
    ui.cerrarModalSolicitud();
    ui.mostrarNotificacion('✅ Solicitud enviada', 'success');
  },

  cerrarModalReporte: () => {
    document.getElementById('modalReporte').classList.remove('active');
  },

  cerrarModalBalance: () => {
    document.getElementById('modalBalance').classList.remove('active');
  },

  inicializarModales: () => {
    window.onclick = (event) => {
      if (event.target.id === 'modalSolicitud') ui.cerrarModalSolicitud();
      if (event.target.id === 'modalReporte') ui.cerrarModalReporte();
      if (event.target.id === 'modalBalance') ui.cerrarModalBalance();
    };
  },

  renderizarEstadisticas: () => {
    const container = document.getElementById('estadisticas');
    if (!container) return;

    const stats = app.gameState?.estadisticas?.[app.emailActual] || {};
    container.innerHTML = `
      <div class="stats-row"><span>Partidas Jugadas:</span><span>${stats.ganadas + stats.perdidas || 0}</span></div>
      <div class="stats-row"><span>Partidas Ganadas:</span><span style="color: #27ae60;">${stats.ganadas || 0}</span></div>
      <div class="stats-row"><span>Pozos Ganados:</span><span style="color: #f39c12;">${(stats.pozosGanados || []).length}</span></div>
    `;
  }
};

// ✅ IMPORTANTE: Hacer ui global
window.ui = ui;
