// ============================================================================
// 🎨 UI - RENDERIZADO DE INTERFAZ
// ============================================================================

const ui = {
  
  // ============================================================================
  // ESTADO DE CONEXIÓN
  // ============================================================================
  
  actualizarEstadoConexion: function(conectado) {
    const estadoEl = document.getElementById('estadoConexion');
    if (estadoEl) {
      estadoEl.className = 'status ' + (conectado ? 'connected' : 'disconnected');
      estadoEl.innerHTML = conectado ? '✅ Conectado' : '❌ Desconectado';
      estadoEl.style.background = conectado ? 'linear-gradient(135deg, #27ae60, #219a52)' : 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }
  },

  // ============================================================================
  // RENDERIZADO GENERAL
  // ============================================================================

  renderizarTodo: function() {
    this.renderizarJugadores();
    this.renderizarCartasPorPintas();
    this.renderizarUltimaCarta(window.app.gameState ? window.app.gameState.ultimaCarta : null);
    this.actualizarFaseJuego(window.app.gameState ? window.app.gameState.faseJuego : 'seleccion');
    this.actualizarPanelCantador(window.app.gameState ? window.app.gameState.cantador : null);
    this.actualizarBanco(window.app.gameState ? window.app.gameState.banco : null);
    this.actualizarMonedas(window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual] ? window.app.gameState.jugadores[window.app.emailActual].monedas : 0);
  },

  // ============================================================================
  // JUGADORES
  // ============================================================================

  renderizarJugadores: function() {
    const lista = document.getElementById('listaJugadores');
    const contador = document.getElementById('contadorJugadores');
    if (!lista) return;

    const jugadores = window.app.gameState ? window.app.gameState.jugadores : {};
    const cantador = window.app.gameState ? window.app.gameState.cantador : null;
    
    lista.innerHTML = Object.entries(jugadores).map(function(entry) {
      const email = entry[0];
      const datos = entry[1];
      const esCantador = cantador === email;
      return '<div class="jugador-item ' + (esCantador ? 'cantador' : '') + '">' +
             '<span>' + datos.nombre + (esCantador ? ' 🎤' : '') + '</span>' +
             '<span style="color: #f39c12;">' + (datos.monedas || 0) + ' 💰</span>' +
             '</div>';
    }).join('');

    if (contador) contador.textContent = Object.keys(jugadores).length;
  },

  actualizarSelectJugadores: function() {
    const select = document.getElementById('selectJugadorMonedas');
    if (!select) return;

    const jugadores = window.app.gameState ? window.app.gameState.jugadores : {};
    select.innerHTML = Object.entries(jugadores).map(function(entry) {
      const email = entry[0];
      const datos = entry[1];
      return '<option value="' + email + '">' + datos.nombre + ' (' + (datos.monedas || 0) + ' 💰)</option>';
    }).join('');
  },

  actualizarMonedas: function(monedas) {
    const monedasEl = document.getElementById('misMonedas');
    const valorEl = document.getElementById('misMonedasValor');
    if (monedasEl) monedasEl.textContent = monedas || 0;
    if (valorEl) valorEl.textContent = (monedas || 0) * 50;
  },

  // ============================================================================
  // CARTAS CANTADAS
  // ============================================================================

  renderizarCartasPorPintas: function() {
    const container = document.getElementById('cartasPorPintas');
    if (!container) return;

    const cartas = window.app.gameState ? window.app.gameState.cartasCantadas : [];
    const porPintas = { '♠': [], '♥': [], '♦': [], '♣': [] };
    const colores = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' };

    cartas.forEach(function(carta) {
      if (carta && carta.palo) {
        if (!porPintas[carta.palo]) porPintas[carta.palo] = [];
        porPintas[carta.palo].push(carta);
      }
    });

    container.innerHTML = Object.entries(porPintas).map(function(entry) {
      const palo = entry[0];
      const cartasPalo = entry[1];
      return '<div class="pinta-grupo">' +
             '<div class="pinta-titulo" style="color: ' + colores[palo] + '">' + palo + ' (' + cartasPalo.length + ')</div>' +
             '<div class="cartas-cantadas-grid">' +
             cartasPalo.map(function(carta) {
               return '<div class="carta-cantada" style="color: ' + colores[carta.palo] + '">' +
                      '<div style="font-weight: bold;">' + carta.valor + '</div>' +
                      '<div style="font-size: 1.2em;">' + carta.palo + '</div>' +
                      '</div>';
             }).join('') +
             '</div></div>';
    }).join('');
  },

  renderizarUltimaCarta: function(carta) {
    const display = document.getElementById('ultimaCartaDisplay');
    if (!display) return;

    if (carta) {
      display.innerHTML = '<span style="color: ' + (carta.color || '#000') + '">' + carta.valor + carta.palo + '</span>';
    } else {
      display.textContent = '-';
    }
  },

  // ============================================================================
  // FASE DEL JUEGO
  // ============================================================================

  actualizarFaseJuego: function(fase) {
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

  // ============================================================================
  // PANEL DEL CANTADOR
  // ============================================================================

  actualizarPanelCantador: function(email) {
    const panel = document.getElementById('panelCantador');
    const panelFijo = document.getElementById('panelCantadorFijo');
    const btnSerCantador = document.getElementById('btnSerCantador');

    if (panel) {
      if (email === window.app.emailActual) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }
    
    if (panelFijo) {
      if (email === window.app.emailActual) {
        panelFijo.classList.remove('hidden');
      } else {
        panelFijo.classList.add('hidden');
      }
    }
    
    if (btnSerCantador) {
      btnSerCantador.style.display = email ? 'none' : 'inline-block';
    }
  },

  // ============================================================================
  // BANCO
  // ============================================================================

  actualizarBanco: function(banco) {
    if (!banco) return;
    const recaudadoEl = document.getElementById('bancoRecaudado');
    const pagadoEl = document.getElementById('bancoPagado');
    if (recaudadoEl) recaudadoEl.textContent = banco.totalRecaudado || 0;
    if (pagadoEl) pagadoEl.textContent = banco.totalPagado || 0;
  },

  // ============================================================================
  // VALIDACIÓN DE APUESTAS
  // ============================================================================

  mostrarValidacionFallida: function(data) {
    this.mostrarNotificacion(data.mensaje, 'error', true);

    const panel = document.getElementById('panelVerificacionApuestas');
    const lista = document.getElementById('listaVerificacionApuestas');
    const mensaje = document.getElementById('mensajeValidacion');

    if (panel && lista && mensaje) {
      panel.style.display = 'block';
      lista.innerHTML = (data.jugadoresNoListos || []).map(function(j) {
        return '<div class="verificacion-item nolisto">' +
               '<strong>❌ ' + j.nombre + '</strong><br>' +
               '<span style="font-size: 0.75em;">' + j.razon + '</span>' +
               '</div>';
      }).join('');

      mensaje.innerHTML = '<span style="color: #e74c3c;">' + (data.jugadoresNoListos || []).length + ' de ' + (data.totalJugadores || 0) + ' jugadores NO están listos</span>';
    }

    const btnIniciar = document.getElementById('btnIniciarJuego');
    if (btnIniciar) {
      btnIniciar.disabled = true;
      btnIniciar.style.opacity = '0.5';
      btnIniciar.textContent = '⛔ Esperando apuestas...';
    }
  },

  mostrarEstadoApuestas: function(data) {
    const panel = document.getElementById('panelVerificacionApuestas');
    const lista = document.getElementById('listaVerificacionApuestas');

    if (panel && lista) {
      panel.style.display = 'block';

      if (data.todosListos) {
        lista.innerHTML = (data.listos || []).map(function(j) {
          return '<div class="verificacion-item listo">' +
                 '<strong>✅ ' + j.nombre + '</strong><br>' +
                 '<span style="font-size: 0.75em;">💰 ' + j.monedas + ' fichas | 🎰 ' + j.apostado + ' fichas apostadas</span>' +
                 '</div>';
        }).join('');

        if (document.getElementById('mensajeValidacion')) {
          document.getElementById('mensajeValidacion').innerHTML = '<span style="color: #27ae60;">✅ Todos los ' + (data.listos || []).length + ' jugadores están listos</span>';
        }
      } else {
        lista.innerHTML = '<div><strong style="color: #27ae60;">Listos:</strong> ' + (data.listos || []).map(function(j) { return j.nombre; }).join(', ') + '</div>' +
                          '<div><strong style="color: #e74c3c;">No Listos:</strong> ' + (data.noListos || []).map(function(j) { return j.nombre; }).join(', ') + '</div>';
      }
    }
  },

  mostrarJuegoIniciado: function(data) {
    const btnIniciar = document.getElementById('btnIniciarJuego');
    if (btnIniciar) {
      btnIniciar.disabled = false;
      btnIniciar.style.opacity = '1';
      btnIniciar.textContent = '▶️ Iniciar';
    }

    const panel = document.getElementById('panelVerificacionApuestas');
    if (panel) panel.style.display = 'none';

    this.mostrarNotificacion(data.mensaje, 'success');
  },

  // ============================================================================
  // NOTIFICACIONES
  // ============================================================================

  mostrarNotificacion: function(mensaje, tipo, especial) {
    const notif = document.createElement('div');
    notif.className = 'notificacion ' + (especial ? 'especial' : '');
    notif.style.cssText = 'position: fixed; top: 18px; right: 18px; padding: 14px 20px; border-radius: 10px; background: ' + (tipo === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #27ae60, #219a52)') + '; color: #fff; z-index: 2000; animation: slideIn 0.3s ease;';
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    setTimeout(function() { notif.remove(); }, 5000);
  },

  // ============================================================================
  // MODALES
  // ============================================================================

  mostrarModalSolicitud: function() {
    document.getElementById('modalSolicitud').classList.add('active');
  },

  cerrarModalSolicitud: function() {
    document.getElementById('modalSolicitud').classList.remove('active');
    document.getElementById('mensajeSolicitud').value = '';
  },

  enviarSolicitud: function() {
    const mensaje = document.getElementById('mensajeSolicitud').value.trim();
    if (!mensaje) {
      this.mostrarNotificacion('Escribe un motivo', 'error');
      return;
    }
    if (window.socket) window.socket.emit('solicitarCambio', window.app.emailActual, mensaje);
    this.cerrarModalSolicitud();
    this.mostrarNotificacion('✅ Solicitud enviada', 'success');
  },

  cerrarModalReporte: function() {
    document.getElementById('modalReporte').classList.remove('active');
  },

  cerrarModalBalance: function() {
    document.getElementById('modalBalance').classList.remove('active');
  },

  inicializarModales: function() {
    window.onclick = function(event) {
      if (event.target.id === 'modalSolicitud') ui.cerrarModalSolicitud();
      if (event.target.id === 'modalReporte') ui.cerrarModalReporte();
      if (event.target.id === 'modalBalance') ui.cerrarModalBalance();
    };
  },

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================

  renderizarEstadisticas: function() {
    const container = document.getElementById('estadisticas');
    if (!container) return;

    const stats = window.app.gameState && window.app.gameState.estadisticas && window.app.gameState.estadisticas[window.app.emailActual] ? window.app.gameState.estadisticas[window.app.emailActual] : {};
    container.innerHTML = '<div class="stats-row"><span>Partidas Jugadas:</span><span>' + ((stats.ganadas || 0) + (stats.perdidas || 0)) + '</span></div>' +
                          '<div class="stats-row"><span>Partidas Ganadas:</span><span style="color: #27ae60;">' + (stats.ganadas || 0) + '</span></div>' +
                          '<div class="stats-row"><span>Pozos Ganados:</span><span style="color: #f39c12;">' + ((stats.pozosGanados || []).length) + '</span></div>';
  },

  // ============================================================================
  // 🎤 PANEL CANTADOR ARRASTRABLE
  // ============================================================================

  panelCantadorDraggable: function() {
    const panel = document.getElementById('panelCantadorFijo');
    const header = document.getElementById('panelCantadorHeader');
    
    if (!panel || !header) {
      console.log('⚠️ Panel o header no encontrados');
      return;
    }
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialBottom = 0;
    
    header.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialBottom = window.innerHeight - rect.bottom;
      
      panel.style.transition = 'none';
      header.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newLeft = initialLeft + deltaX;
      let newBottom = initialBottom - deltaY;
      
      const panelRect = panel.getBoundingClientRect();
      const maxX = window.innerWidth - panelRect.width;
      const maxY = window.innerHeight - panelRect.height;
      
      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newBottom = Math.max(0, Math.min(newBottom, maxY));
      
      panel.style.left = newLeft + 'px';
      panel.style.bottom = newBottom + 'px';
      panel.style.right = 'auto';
    });
    
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        panel.style.transition = 'box-shadow 0.3s ease';
        header.style.cursor = 'grab';
      }
    });
    
    console.log('✅ Panel del Cantador ahora es arrastrable');
  },
  
  togglePanelCantador: function() {
    const panel = document.getElementById('panelCantadorFijo');
    if (panel) {
      panel.classList.toggle('minimizado');
      console.log('🎤 Panel minimizado/maximizado');
    }
  }
  
};

window.ui = ui;
