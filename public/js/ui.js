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

    // ============================================================================
  // MOSTRAR ESTADO DE APUESTAS (VERIFICACIÓN DEL CANTADOR)
  // ============================================================================

  mostrarEstadoApuestas: function(data) {
    console.log('📋 Estado de apuestas:', data);
    
    const panel = document.getElementById('panelVerificacionApuestas');
    const lista = document.getElementById('listaVerificacionApuestas');
    const mensaje = document.getElementById('mensajeValidacion');
    
    if (!panel || !lista) {
      console.error('❌ No se encontraron elementos de verificación');
      this.crearPanelVerificacion();
      return;
    }
    panel.style.display = 'block';
    
    // Encabezado con resumen
    let html = '<div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-bottom: 15px;">';
    html += '<h4 style="margin: 0 0 10px 0; color: #f39c12;">📊 RESUMEN DE LA PARTIDA</h4>';
    html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
    html += '<div>👥 Jugadores: ' + (data.totalJugadores || 0) + '</div>';
    html += '<div>🎴 Total Cartones: ' + (data.totalCartones || 0) + '</div>';
    html += '<div>💰 Fichas en Pozos: ' + (data.totalFichasApostadas || 0) + ' / ' + (data.totalFichasDeberianApostar || 0) + '</div>';
    html += '<div>💵 Valor Pozos: $' + ((data.totalFichasApostadas || 0) * 50) + ' / $' + ((data.totalFichasDeberianApostar || 0) * 50) + ' COP</div>';
    html += '</div>';
    html += '</div>';
    
    if (data.todosListos) {
      // ✅ TODOS LISTOS
      html += '<div style="background: linear-gradient(135deg, #27ae60, #219a52); padding: 20px; border-radius: 10px; text-align: center;">';
      html += '<h3 style="margin: 0; color: white;">✅ ¡TODOS LISTOS PARA JUGAR!</h3>';
      html += '<p style="margin: 10px 0 0 0; color: white; font-size: 1.1em;">' + data.resumen + '</p>';
      html += '<p style="margin: 10px 0 0 0; color: #fff; font-size: 0.9em;">El cantador puede iniciar la partida</p>';
      html += '</div>';
      
      if (mensaje) {
        mensaje.innerHTML = '<span style="color: #27ae60; font-weight: bold; font-size: 1.2em;">✅ Todos los ' + (data.listos || []).length + ' jugadores están listos</span>';
      }
    } else {
      // ❌ FALTAN REQUISITOS
      html += '<div style="background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 15px; border-radius: 10px; margin-bottom: 15px;">';
      html += '<h4 style="margin: 0 0 10px 0; color: white;">❌ FALTAN REQUISITOS</h4>';
      html += '<p style="margin: 0; color: #fff;">' + (data.noListos || []).length + ' de ' + (data.totalJugadores || 0) + ' jugadores NO están listos</p>';
      html += '</div>';
      
      // Lista de jugadores NO listos con detalle
      html += '<div style="margin-bottom: 15px;">';
      html += '<h4 style="color: #e74c3c; margin-bottom: 10px;">⚠️ Jugadores que deben completar requisitos:</h4>';
      (data.noListos || []).forEach(function(j) {
        const nivelColor = j.nivel === 1 ? '#e74c3c' : j.nivel === 2 ? '#f39c12' : '#e67e22';
        const nivelIcono = j.nivel === 1 ? '💰' : j.nivel === 2 ? '🎴' : '🎰';
        
        html += '<div style="background: rgba(231, 76, 60, 0.2); border-left: 4px solid ' + nivelColor + '; padding: 15px; margin-bottom: 10px; border-radius: 5px;">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">';
        html += '<strong style="color: ' + nivelColor + '; font-size: 1.1em;">' + nivelIcono + ' ' + j.nombre + '</strong>';
        html += '<span style="background: ' + nivelColor + '; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.8em;">Nivel ' + j.nivel + '</span>';
        html += '</div>';
        html += '<div style="color: #fff; margin-bottom: 5px;">' + j.razon + '</div>';
        html += '<div style="font-size: 0.85em; color: #bdc3c7;">';
        html += '💰 Fichas: ' + j.monedas + ' | ';
        html += '🎴 Cartones: ' + j.cartones + ' | ';
        html += '🎰 Apuesta: ' + j.fichasApostadas + ' / ' + j.fichasDeberianApostar + ' fichas';
        html += '</div>';
        
        // Mensaje específico según nivel
        if (j.nivel === 1) {
          html += '<div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.3); border-radius: 5px; font-size: 0.85em; color: #ffcccc;">';
          html += '⚠️ Este jugador debe COMPRAR al menos 40 fichas antes de apostar';
          html += '</div>';
        } else if (j.nivel === 2) {
          html += '<div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 28, 0.3); border-radius: 5px; font-size: 0.85em; color: #ffe6cc;">';
          html += '⚠️ Este jugador debe SELECCIONAR al menos 1 cartón';
          html += '</div>';
        } else if (j.nivel === 3) {
          html += '<div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.3); border-radius: 5px; font-size: 0.85em; color: #ffe6cc;">';
          html += '⚠️ Este jugador tiene ' + j.cartones + ' cartón(es) → debe apostar ' + j.fichasDeberianApostar + ' fichas (6 × ' + j.cartones + ')';
          html += '</div>';
        }
        
        html += '</div>';
      });
      html += '</div>';
      
      // Lista de jugadores listos
      if (data.listos && data.listos.length > 0) {
        html += '<div>';
        html += '<h4 style="color: #27ae60; margin-bottom: 10px;">✅ Jugadores Listos:</h4>';
        (data.listos || []).forEach(function(j) {
          html += '<div style="background: rgba(39, 174, 96, 0.2); border-left: 4px solid #27ae60; padding: 10px; margin-bottom: 8px; border-radius: 5px;">';
          html += '<strong style="color: #27ae60;">' + j.nombre + '</strong> - ';
          html += '🎴 ' + j.cartones + ' cartón(es) - ';
          html += '🎰 ' + j.fichasApostadas + ' fichas apostadas';
          html += '</div>';
        });
        html += '</div>';
      }
    }
    
    lista.innerHTML = html;
    
    if (mensaje) {
      if (!data.todosListos) {
        mensaje.innerHTML = '<span style="color: #e74c3c; font-weight: bold;">❌ ' + (data.noListos || []).length + ' jugadores NO están listos</span>';
      }
    }
    
    // Actualizar botón Iniciar
    const btnIniciar = document.getElementById('btnIniciarJuego');
    if (btnIniciar) {
      if (data.todosListos) {
        btnIniciar.disabled = false;
        btnIniciar.style.opacity = '1';
        btnIniciar.style.background = 'linear-gradient(135deg, #27ae60, #219a52)';
        btnIniciar.textContent = '▶️ Iniciar Partida';
      } else {
        btnIniciar.disabled = true;
        btnIniciar.style.opacity = '0.5';
        btnIniciar.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        btnIniciar.textContent = '⛔ Esperando jugadores...';
      }
    }
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
