// ===================================================================
// 🎨 UI - RENDERIZADO DE INTERFAZ
// ============================================================================

const ui = {
  
  actualizarEstadoConexion: function(conectado) {
    const estadoEl = document.getElementById('estadoConexion');
    if (estadoEl) {
      estadoEl.className = 'status ' + (conectado ? 'connected' : 'disconnected');
      estadoEl.innerHTML = conectado ? '✅ Conectado' : '❌ Desconectado';
      estadoEl.style.background = conectado ? 'linear-gradient(135deg, #27ae60, #219a52)' : 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }
  },

  renderizarTodo: function() {
    this.renderizarJugadores();
    this.renderizarCartasPorPintas();
    this.renderizarUltimaCarta(window.app.gameState ? window.app.gameState.ultimaCarta : null);
    this.actualizarFaseJuego(window.app.gameState ? window.app.gameState.faseJuego : 'seleccion');
    this.actualizarPanelCantador(window.app.gameState ? window.app.gameState.cantador : null);
    this.actualizarBanco(window.app.gameState ? window.app.gameState.banco : null);
    this.actualizarMonedas(window.app.gameState && window.app.gameState.jugadores && window.app.gameState.jugadores[window.app.emailActual] ? window.app.gameState.jugadores[window.app.emailActual].monedas : 0);
  },

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
    
    if (window.app.emailActual && jugadores[window.app.emailActual]) {
      ui.actualizarMonedas(jugadores[window.app.emailActual].monedas);
    }
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
    this.actualizarHeaderMovil();

    const monedasEl = document.getElementById('misMonedas');
    const valorEl = document.getElementById('misMonedasValor');
    
    if (monedasEl) monedasEl.textContent = monedas || 0;
    if (valorEl) valorEl.textContent = (monedas || 0) * 50;
    
    const fichasHeader = document.querySelector('.fichas-header');
    if (fichasHeader) {
      fichasHeader.innerHTML = '💰 Fichas: ' + (monedas || 0) + ' ($' + ((monedas || 0) * 50) + ' COP)';
    }
    
    const fichasDisplay = document.getElementById('fichasDisplay');
    if (fichasDisplay) {
      fichasDisplay.textContent = '💰 Fichas: ' + (monedas || 0) + ' ($' + ((monedas || 0) * 50) + ' COP)';
    }
    
    console.log('💰 Billetera actualizada:', monedas, 'fichas ($' + ((monedas || 0) * 50) + ' COP)');
  },
  
  renderizarCartasPorPintas: function() {
    const container = document.getElementById('cartasPorPintas');
    if (!container) return;
  
    const cartas = window.app.gameState ? window.app.gameState.cartasCantadas : [];
    const porPintas = { '♠': [], '♥': [], '♦': [], '♣': [] };
    const colores = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' };
    
    const contadorEl = document.getElementById('contadorCartas');
    if (contadorEl) {
      contadorEl.textContent = cartas.length;
    }
    
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
  
  actualizarFaseJuego: function(fase) {
    this.actualizarHeaderMovil();
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
    
    const partidaEl = document.getElementById('partidaActual');
    if (partidaEl && window.app.gameState) {
      partidaEl.textContent = window.app.gameState.partidaActual || 1;
    }
  },
  
  mostrarJuegoIniciado: function(data) {
    console.log('🎮 Juego iniciado:', data);
    if (window.ui) window.ui.mostrarNotificacion(data.mensaje, 'success');
  },
  
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

  actualizarBanco: function(banco) {
    if (!banco) return;
    const recaudadoEl = document.getElementById('bancoRecaudado');
    const pagadoEl = document.getElementById('bancoPagado');
    if (recaudadoEl) recaudadoEl.textContent = banco.totalRecaudado || 0;
    if (pagadoEl) pagadoEl.textContent = banco.totalPagado || 0;
  },

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
  
  crearPanelVerificacion: function() {
    console.log('🔨 Creando panel de verificación...');
    
    const overlay = document.createElement('div');
    overlay.id = 'panelVerificacionOverlay';
    overlay.className = 'panel-verificacion-overlay';
    overlay.onclick = function() {
      document.getElementById('panelVerificacionApuestas').style.display = 'none';
    };
    document.body.appendChild(overlay);
    
    const panel = document.createElement('div');
    panel.id = 'panelVerificacionApuestas';
    panel.className = 'panel-verificacion-apuestas';
    panel.innerHTML = 
      '<div class="panel-verificacion-header">' +
        '<h3>📋 Verificación de Apuestas</h3>' +
        '<button class="btn-cerrar-panel" onclick="document.getElementById(\'panelVerificacionApuestas\').style.display=\'none\'; document.getElementById(\'panelVerificacionOverlay\').style.display=\'none\';">✕</button>' +
      '</div>' +
      '<div id="mensajeValidacion" class="mensaje-validacion"></div>' +
      '<div id="listaVerificacionApuestas" class="lista-verificacion"></div>';
    
    document.body.appendChild(panel);
    
    console.log('✅ Panel de verificación creado');
  },
  
  mostrarEstadoApuestas: function(data) {
    console.log('📋 Estado de apuestas:', data);
    
    const panel = document.getElementById('panelVerificacionApuestas');
    const lista = document.getElementById('listaVerificacionApuestas');
    const mensaje = document.getElementById('mensajeValidacion');
    const overlay = document.getElementById('panelVerificacionOverlay');
    
    if (!panel || !lista) {
      console.error('❌ No se encontraron elementos de verificación');
      alert('Error: Panel de verificación no encontrado. Recarga la página.');
      return;
    }
    
    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.style.display = 'block';
      console.log('✅ Overlay mostrado');
    }
    
    panel.classList.remove('hidden');
    panel.style.display = 'block';
    
    console.log('✅ Panel de verificación mostrado');
    
    let html = '<div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-bottom: 15px;">';
    html += '<h4 style="margin: 0 0 10px 0; color: #f39c12;">📊 RESUMEN DE LA PARTIDA</h4>';
    html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
    html += '<div style="color: white;">👥 Jugadores: ' + (data.totalJugadores || 0) + '</div>';
    html += '<div style="color: white;">🎴 Total Cartones: ' + (data.totalCartones || 0) + '</div>';
    html += '<div style="color: white;">💰 Fichas en Pozos: ' + (data.totalFichasApostadas || 0) + ' / ' + (data.totalFichasDeberianApostar || 0) + '</div>';
    html += '<div style="color: white;">💵 Valor Pozos: $' + ((data.totalFichasApostadas || 0) * 50) + ' / $' + ((data.totalFichasDeberianApostar || 0) * 50) + ' COP</div>';
    html += '</div>';
    html += '</div>';
    
    if (data.todosListos) {
      html += '<div style="background: linear-gradient(135deg, #27ae60, #219a52); padding: 20px; border-radius: 10px; text-align: center;">';
      html += '<h3 style="margin: 0; color: white;">✅ ¡TODOS LISTOS PARA JUGAR!</h3>';
      html += '<p style="margin: 10px 0 0 0; color: white; font-size: 1.1em;">' + data.resumen + '</p>';
      html += '<p style="margin: 10px 0 0 0; color: #fff; font-size: 0.9em;">El cantador puede iniciar la partida</p>';
      html += '</div>';
      
      if (mensaje) {
        mensaje.innerHTML = '<span style="color: #27ae60; font-weight: bold; font-size: 1.2em;">✅ Todos los ' + (data.listos || []).length + ' jugadores están listos</span>';
      }
    } else {
      html += '<div style="background: linear-gradient(135deg, #e74c3c, #c0392b); padding: 15px; border-radius: 10px; margin-bottom: 15px;">';
      html += '<h4 style="margin: 0 0 10px 0; color: white;">❌ FALTAN REQUISITOS</h4>';
      html += '<p style="margin: 0; color: #fff;">' + (data.noListos || []).length + ' de ' + (data.totalJugadores || 0) + ' jugadores NO están listos</p>';
      html += '</div>';
      
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
  
  cerrarPanelVerificacion: function() {
    console.log('🔒 Cerrando panel de verificación...');
    
    const panel = document.getElementById('panelVerificacionApuestas');
    const overlay = document.getElementById('panelVerificacionOverlay');
    
    if (panel) {
      panel.classList.add('hidden');
      panel.style.display = 'none';
      console.log('✅ Panel ocultado');
    }
    
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
      console.log('✅ Overlay ocultado');
    }
  },
  
  mostrarNotificacion: function(mensaje, tipo, especial) {
    const notif = document.createElement('div');
    notif.className = 'notificacion ' + (especial ? 'especial' : '');
    notif.style.cssText = 'position: fixed; top: 18px; right: 18px; padding: 14px 20px; border-radius: 10px; background: ' + (tipo === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #27ae60, #219a52)') + '; color: #fff; z-index: 2000; animation: slideIn 0.3s ease;';
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    setTimeout(function() { notif.remove(); }, 5000);
  },

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

  renderizarEstadisticas: function() {
    const container = document.getElementById('estadisticas');
    if (!container) return;

    const stats = window.app.gameState && window.app.gameState.estadisticas && window.app.gameState.estadisticas[window.app.emailActual] ? window.app.gameState.estadisticas[window.app.emailActual] : {};
    container.innerHTML = '<div class="stats-row"><span>Partidas Jugadas:</span><span>' + ((stats.ganadas || 0) + (stats.perdidas || 0)) + '</span></div>' +
                          '<div class="stats-row"><span>Partidas Ganadas:</span><span style="color: #27ae60;">' + (stats.ganadas || 0) + '</span></div>' +
                          '<div class="stats-row"><span>Pozos Ganados:</span><span style="color: #f39c12;">' + ((stats.pozosGanados || []).length) + '</span></div>';
  },

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
  },
  
  // ============================================================================
  // 📱 NAVEGACIÓN MÓVIL OPTIMIZADA
  // ============================================================================

  mostrarSeccion: function(seccion) {
    console.log('📱 Mostrando sección:', seccion);
    
    // Caso especial: Apostar
    if (seccion === 'apostar') {
      this.mostrarPanelApuestasModal();
      return;
    }
    
    const modal = document.getElementById('modalSeccion');
    const titulo = document.getElementById('modalTitulo');
    const contenido = document.getElementById('modalContenido');
    
    if (!modal || !titulo || !contenido) return;
    
    this.actualizarHeaderMovil();
    
    switch(seccion) {
      case 'misCartones':
        titulo.textContent = '🎴 Mis Cartones';
        contenido.innerHTML = this.obtenerContenidoMisCartones();
        break;
        
      case 'pozos':
        titulo.textContent = '🏆 Los 6 Pozos';
        contenido.innerHTML = this.obtenerContenidoPozos();
        break;
        
      case 'cartasCantadas':
        titulo.textContent = '🃏 Cartas Cantadas';
        contenido.innerHTML = this.obtenerContenidoCartasCantadas();
        break;
        
      case 'billetera':
        titulo.textContent = '💰 Mi Billetera';
        contenido.innerHTML = this.obtenerContenidoBilletera();
        break;
        
      case 'estadisticas':
        titulo.textContent = '📊 Mis Estadísticas';
        contenido.innerHTML = this.obtenerContenidoEstadisticas();
        break;
    }
    
    modal.classList.remove('hidden');
  },

  cerrarSeccion: function() {
    const modal = document.getElementById('modalSeccion');
    if (modal) {
      modal.classList.add('hidden');
    }
  },

  actualizarHeaderMovil: function() {
    const headerMonedas = document.getElementById('headerMonedas');
    const headerPartida = document.getElementById('headerPartida');
    const headerCartones = document.getElementById('headerCartones');
    
    if (window.app.gameState && window.app.gameState.jugadores && window.app.emailActual) {
      const jugador = window.app.gameState.jugadores[window.app.emailActual];
      
      if (headerMonedas) {
        headerMonedas.textContent = jugador.monedas || 0;
      }
      
      if (headerCartones) {
        headerCartones.textContent = (jugador.cartones || []).length;
      }
    }
    
    if (window.app.gameState && headerPartida) {
      headerPartida.textContent = (window.app.gameState.partidaActual || 1) + '/6';
    }
  },

  // ✅ OBTENER CONTENIDO MIS CARTONES - CON CARTAS CANTADAS Y ÚLTIMA CARTA
  obtenerContenidoMisCartones: function() {
    console.log('🎴 [DEBUG] obtenerContenidoMisCartones iniciado');
    
    let html = '';
    
    // ✅ 1. ÚLTIMA CARTA CANTADA (SIEMPRE VISIBLE)
    if (window.app.gameState && window.app.gameState.ultimaCarta) {
      const uc = window.app.gameState.ultimaCarta;
      const colorTexto = uc.color === 'red' ? '#e74c3c' : '#2c3e50';
      html += `
        <div style="background: linear-gradient(135deg, #f39c12, #e67e22); padding: 15px; margin: 10px 0; border-radius: 10px; text-align: center; border: 3px solid #fff;">
          <h4 style="margin: 0 0 8px 0; font-size: 1em; color: #fff;">🃏 Última Carta Cantada</h4>
          <div style="font-size: 3em; font-weight: bold; margin: 5px 0; color: ${colorTexto}; background: rgba(255,255,255,0.95); border-radius: 8px; padding: 10px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            ${uc.valor}${uc.palo}
          </div>
          <p style="margin: 5px 0; font-size: 0.85em; color: #fff;">Total cantadas: <strong>${window.app.gameState.cartasCantadas ? window.app.gameState.cartasCantadas.length : 0}</strong></p>
        </div>
      `;
      console.log('🎴 [DEBUG] Última carta agregada:', uc.codigo);
    } else {
      html += `
        <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; text-align: center;">
          <h4 style="margin: 0 0 8px 0; font-size: 1em; color: #fff;">🃏 Última Carta Cantada</h4>
          <p style="font-size: 2em; color: #95a5a6;">-</p>
          <p style="margin: 5px 0; font-size: 0.85em; color: #95a5a6;">Total cantadas: <strong>0</strong></p>
        </div>
      `;
    }
    
    // ✅ 2. CARTAS CANTADAS RECIENTES (ÚLTIMAS 10)
    if (window.app.gameState && window.app.gameState.cartasCantadas && window.app.gameState.cartasCantadas.length > 0) {
      const cartasCantadas = window.app.gameState.cartasCantadas;
      const ultimasCartas = cartasCantadas.slice(-10); // Últimas 10 cartas
      
      html += `
        <div style="background: rgba(255,255,255,0.1); padding: 12px; margin: 10px 0; border-radius: 10px;">
          <h4 style="margin: 0 0 10px 0; font-size: 0.95em; color: #fff; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 8px;">
            📋 Últimas Cartas Cantadas (${ultimasCartas.length})
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
            ${ultimasCartas.map(carta => {
              const cartaColor = carta.color === 'red' ? '#e74c3c' : '#2c3e50';
              return `
                <span style="
                  background: rgba(255,255,255,0.95);
                  color: ${cartaColor};
                  padding: 5px 8px;
                  border-radius: 5px;
                  font-weight: bold;
                  font-size: 0.85em;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                ">
                  ${carta.valor}${carta.palo}
                </span>
              `;
            }).join('')}
          </div>
        </div>
      `;
      console.log('🎴 [DEBUG] Cartas cantadas agregadas:', ultimasCartas.length);
    }
    
    // ✅ 3. VALIDAR DATOS DE CARTONES
    if (!window.app.gameState || !window.app.gameState.cartones) {
      console.log('🎴 [DEBUG] No hay gameState o cartones');
      html += '<p style="text-align: center; padding: 15px; color: #fff;">⏳ Cargando cartones...</p>';
      return html;
    }
    
    const misCartones = window.app.gameState.cartones.filter(c => c.dueño === window.app.emailActual);
    console.log('🎴 [DEBUG] Mis cartones:', misCartones.length, 'de', window.app.gameState.cartones.length);
    
    if (misCartones.length === 0) {
      html += `
        <div style="background: rgba(255,255,255,0.1); padding: 20px; margin: 10px 0; border-radius: 10px; text-align: center;">
          <p style="font-size: 1.1em; margin: 10px 0; color: #fff;">🎴 Sin cartones</p>
          <p style="font-size: 0.85em; color: #95a5a6;">Selecciona un cartón abajo</p>
        </div>
      `;
      return html;
    }
    
    html += `<h4 style="margin: 20px 0 10px 0; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 10px; color: #fff;">📋 Tus Cartones (${misCartones.length})</h4>`;
    
    // ✅ 4. MOSTRAR CADA CARTÓN CON GRID VISUAL
    misCartones.forEach((carton, idx) => {
      console.log(`🎴 [DEBUG] Procesando cartón ${idx+1}:`, carton.numero, carton.nombre);
      console.log('  - carton.cartas:', carton.cartas ? carton.cartas.length : 'NO EXISTE');
      console.log('  - carton.tapadas:', carton.tapadas ? carton.tapadas.length : 'NO EXISTE');
      
      // Información básica
      html += `
        <div style="background: linear-gradient(135deg, #3498db, #2980b9); padding: 15px; margin: 15px 0; border-radius: 10px;">
          <h4 style="margin: 0 0 15px 0; text-align: center; color: #fff; font-size: 1.2em;">
            ${carton.nombre}
          </h4>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85em; margin-bottom: 15px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
            <div style="color: #fff;"><strong>Número:</strong> ${carton.numero}</div>
            <div style="color: #fff;"><strong>Poker:</strong> ${carton.valorPoker || 'N/A'}</div>
            <div style="color: #fff;"><strong>Full:</strong> ${carton.valorFull2 || 'N/A'} + ${carton.valorFull3 || 'N/A'}</div>
            <div style="color: #fff;"><strong>Fila Poker:</strong> ${carton.pokerFila || 'N/A'}</div>
          </div>
      `;
      
      // ✅ GRID VISUAL 5x5 - CON VALIDACIÓN EXTRA
      if (carton.cartas && Array.isArray(carton.cartas) && carton.cartas.length === 25) {
        console.log('🎴 [DEBUG] Generando grid 5x5...');
        
        html += `<h5 style="color: #fff; margin: 15px 0 10px 0; text-align: center; font-size: 1em;">🎴 Cartón</h5>`;
        html += `<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin: 10px 0;">`;
        
        for (let i = 0; i < 25; i++) {
          const carta = carton.cartas[i];
          const estaTapada = carton.tapadas && Array.isArray(carton.tapadas) && carton.tapadas[i] === true;
          const color = carta && carta.color === 'red' ? '#e74c3c' : '#2c3e50';
          const fondo = estaTapada ? 'rgba(243, 156, 18, 0.9)' : 'rgba(255,255,255,0.95)';
          const borde = estaTapada ? '#f39c12' : '#bdc3c7';
          const texto = estaTapada ? '#fff' : color;
          const contenido = estaTapada ? '✓' : (carta ? carta.valor + carta.palo : '?');
          
          html += `
            <div style="
              background: ${fondo};
              border: 2px solid ${borde};
              border-radius: 5px;
              padding: 5px 2px;
              text-align: center;
              font-size: 0.75em;
              font-weight: bold;
              color: ${texto};
              min-height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s;
            " onclick="ui.taparCartaDesdeModal(${carton.numero}, ${i})"
            title="${carta ? carta.codigo : 'N/A'} - Toca para ${estaTapada ? 'destapar' : 'tapar'}"
            >
            ${contenido}
            </div>
          `;
        }
        
        html += `</div>`;
        html += `<p style="text-align: center; color: #fff; font-size: 0.8em; margin: 10px 0 0 0; opacity: 0.9;">💡 Toca una carta</p>`;
        console.log('🎴 [DEBUG] Grid 5x5 generado');
      } else {
        console.log('🎴 [DEBUG] ERROR: carton.cartas no es válido');
        html += `<p style="color: #fff; text-align: center; padding: 10px;">⚠️ Error al cargar el cartón</p>`;
      }
      
      html += `</div>`; // Cierra el div del cartón
    });
    
    console.log('🎴 [DEBUG] Contenido generado, longitud:', html.length);
    return html;
  },

  // ✅ TAPAR CARTA DESDE MODAL - VERSIÓN MÓVIL COMPATIBLE
  taparCartaDesdeModal: function(numeroCarton, index) {
    console.log('👆 [DEBUG] taparCartaDesdeModal - Cartón:', numeroCarton, 'Índice:', index);
    
    if (!window.app.emailActual) {
      alert('Debes iniciar sesión primero');
      return;
    }
    
    // ✅ Emitir evento para tapar/destapar
    socket.emit('taparCarta', numeroCarton, index, window.app.emailActual);
    
    // ✅ Recargar modal DESPUÉS de que el servidor confirme el cambio
    // Usamos un listener temporal para asegurar que se actualice con los datos reales
    const onCartonUpdated = function() {
      const modal = document.getElementById('modalSeccion');
      const contenido = document.getElementById('modalContenido');
      if (modal && contenido && window.app.emailActual && !modal.classList.contains('hidden')) {
        contenido.innerHTML = ui.obtenerContenidoMisCartones();
      }
      // Remover el listener después de ejecutar
      socket.off('updateCartones', onCartonUpdated);
    };
    
    socket.on('updateCartones', onCartonUpdated);
    
    // Fallback: si no llega updateCartones en 500ms, recargar igual
    setTimeout(() => {
      socket.off('updateCartones', onCartonUpdated);
      const modal = document.getElementById('modalSeccion');
      const contenido = document.getElementById('modalContenido');
      if (modal && contenido && window.app.emailActual && !modal.classList.contains('hidden')) {
        contenido.innerHTML = ui.obtenerContenidoMisCartones();
      }
    }, 500);
  },    

  obtenerContenidoPozos: function() {
    if (!window.app.gameState || !window.app.gameState.pozosDinamicos) {
      return '<p>No hay información de pozos</p>';
    }
    
    const pozos = window.app.gameState.pozosDinamicos;
    const nombresPozos = {
      pokino: 'POKINO',
      cuatroEsquinas: '4 ESQUINAS',
      full: 'FULL',
      poker: 'POKER',
      centro: 'CENTRO',
      especial: 'ESPECIAL'
    };
    
    return Object.keys(pozos).map(key => `
      <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px;">
        <h4 style="margin: 0 0 10px 0; color: #f39c12;">${nombresPozos[key] || key}</h4>
        <p style="margin: 5px 0;">💰 $${pozos[key].total || 0} COP</p>
        <p style="margin: 5px 0;">🎰 ${pozos[key].fichas || 0} fichas</p>
      </div>
    `).join('');
  },

  obtenerContenidoCartasCantadas: function() {
    console.log('🃏 [DEBUG] obtenerContenidoCartasCantadas iniciado');
    
    if (!window.app.gameState || !window.app.gameState.cartasCantadas) {
      return '<p style="text-align: center; padding: 20px; color: #fff;">⏳ No hay cartas cantadas aún</p>';
    }
    
    const cartas = window.app.gameState.cartasCantadas;
    const ultimaCarta = window.app.gameState.ultimaCarta;
    
    let html = '';
    
    // ✅ 1. ÚLTIMA CARTA CANTADA (DESTACADA)
    if (ultimaCarta) {
      const colorTexto = ultimaCarta.color === 'red' ? '#e74c3c' : '#2c3e50';
      html += `
        <div style="background: linear-gradient(135deg, #f39c12, #e67e22); padding: 20px; margin: 10px 0; border-radius: 10px; text-align: center; border: 3px solid #fff;">
          <h4 style="margin: 0 0 10px 0; font-size: 1.1em; color: #fff;">🃏 Última Carta Cantada</h4>
          <div style="font-size: 4em; font-weight: bold; margin: 10px 0; color: ${colorTexto}; background: rgba(255,255,255,0.95); border-radius: 10px; padding: 15px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            ${ultimaCarta.valor}${ultimaCarta.palo}
          </div>
          <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #fff;">Total cantadas: <strong>${cartas.length}</strong> de 52</p>
        </div>
      `;
      console.log('🃏 [DEBUG] Última carta:', ultimaCarta.codigo);
    }
    
    // ✅ 2. TOTAL DE CARTAS
    html += `<h4 style="margin: 20px 0 10px 0; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 10px; color: #fff;">📋 Todas las Cartas (${cartas.length})</h4>`;
    
    // ✅ 3. AGRUPAR POR PALOS
    const porPalo = { '♠': [], '♥': [], '♦': [], '♣': [] };
    const colores = { '♠': '#2c3e50', '♥': '#e74c3c', '♦': '#e74c3c', '♣': '#2c3e50' };
    const iconos = { '♠': '♠', '♥': '♥', '♦': '♦', '♣': '' };
    
    cartas.forEach(carta => {
      if (carta && carta.palo && porPalo[carta.palo]) {
        porPalo[carta.palo].push(carta);
      }
    });
    
    // ✅ 4. MOSTRAR CADA PALO
    Object.keys(porPalo).forEach(palo => {
      if (porPalo[palo].length > 0) {
        const color = colores[palo];
        const icono = iconos[palo];
        
        html += `
          <div style="background: rgba(255,255,255,0.1); padding: 12px; margin: 10px 0; border-radius: 10px; border-left: 4px solid ${color};">
            <h5 style="color: ${color}; margin: 0 0 10px 0; font-size: 1em; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3em;">${icono}</span>
              <span>${palo} (${porPalo[palo].length})</span>
            </h5>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${porPalo[palo].map(carta => {
                const cartaColor = carta.color === 'red' ? '#e74c3c' : '#2c3e50';
                return `
                  <span style="
                    background: rgba(255,255,255,0.95);
                    color: ${cartaColor};
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 0.9em;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                  ">
                    ${carta.valor}${carta.palo}
                  </span>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }
    });
    
    console.log('🃏 [DEBUG] Contenido generado, total cartas:', cartas.length);
    return html;
  },  

  obtenerContenidoEstadisticas: function() {
    if (!window.app.gameState || !window.app.gameState.estadisticas || !window.app.emailActual) {
      return '<p>No hay estadísticas disponibles</p>';
    }
    
    const stats = window.app.gameState.estadisticas[window.app.emailActual];
    
    if (!stats) {
      return '<p>Aún no tienes estadísticas</p>';
    }
    
    return `
      <div style="background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px;">
        <h4 style="margin: 0 0 15px 0;">📊 Tus Estadísticas</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5em; font-weight: bold; color: #3498db;">${(stats.ganadas || 0) + (stats.perdidas || 0)}</div>
            <div style="font-size: 0.8em;">Partidas</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5em; font-weight: bold; color: #27ae60;">${stats.ganadas || 0}</div>
            <div style="font-size: 0.8em;">Ganadas</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5em; font-weight: bold; color: #f39c12;">${(stats.pozosGanados || []).length}</div>
            <div style="font-size: 0.8em;">Pozos</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5em; font-weight: bold; color: #9b59b6;">${stats.fichasGanadas || 0}</div>
            <div style="font-size: 0.8em;">Fichas</div>
          </div>
        </div>
      </div>
    `;
  },

  mostrarPanelCantador: function() {
    const panel = document.getElementById('panelCantadorFijo');
    if (panel) {
      panel.classList.remove('hidden');
      panel.style.display = 'block';
    }
  },

  // ✅ NUEVA FUNCIÓN: Mostrar panel de apuestas en modal
  mostrarPanelApuestasModal: function() {
    console.log('🎰 Mostrando panel de apuestas en modal');
    
    const modal = document.getElementById('modalSeccion');
    const titulo = document.getElementById('modalTitulo');
    const contenido = document.getElementById('modalContenido');
    
    if (!modal || !titulo || !contenido) return;
    
    titulo.textContent = '🎰 Haz tu Apuesta';
    
    // Obtener el panel de apuestas original
    const panelOriginal = document.getElementById('panelApuestas');
    if (panelOriginal) {
      // Clonar el contenido
      contenido.innerHTML = panelOriginal.innerHTML;
      
      // Mostrar el modal
      modal.classList.remove('hidden');
      
      // Si el panel original está oculto, mostrar el modal
      if (panelOriginal.style.display === 'none') {
        // Verificar si puede apostar
        this.verificarPanelApuestas();
      }
    } else {
      contenido.innerHTML = '<p style="text-align: center; padding: 20px;">⚠️ El panel de apuestas no está disponible.<br><br>Por favor, selecciona al menos 1 cartón primero.</p>';
      modal.classList.remove('hidden');
    }
  },

  // ✅ ACTUALIZAR MODALES CUANDO LLEGA NUEVA CARTA O SE ACTUALIZAN CARTONES
  inicializarActualizacionModales: function() {
    console.log('🔄 [DEBUG] Inicializando actualización de modales');
    
    // Escuchar cuando llega una nueva carta cantada
    socket.on('updateUltimaCarta', function(carta) {
      console.log('🃏 [DEBUG] Nueva última carta en modal:', carta ? carta.codigo : 'null');
      
      // Si el modal está abierto, actualizarlo según la sección
      const modal = document.getElementById('modalSeccion');
      const titulo = document.getElementById('modalTitulo');
      const contenido = document.getElementById('modalContenido');
      
      if (modal && !modal.classList.contains('hidden') && titulo && contenido) {
        if (titulo.textContent.includes('Cartas Cantadas')) {
          console.log('🔄 [DEBUG] Actualizando modal Cartas Cantadas');
          contenido.innerHTML = ui.obtenerContenidoCartasCantadas();
        } else if (titulo.textContent.includes('Mis Cartones')) {
          console.log('🔄 [DEBUG] Actualizando modal Mis Cartones');
          contenido.innerHTML = ui.obtenerContenidoMisCartones();
        }
      }
    });
    
    // Escuchar cuando se actualizan cartones (para tapar cartas)
    socket.on('updateCartones', function(cartones) {
      console.log('🎴 [DEBUG] Cartones actualizados, verificando modales');
      
      const modal = document.getElementById('modalSeccion');
      const titulo = document.getElementById('modalTitulo');
      const contenido = document.getElementById('modalContenido');
      
      if (modal && !modal.classList.contains('hidden') && titulo && contenido) {
        if (titulo.textContent.includes('Mis Cartones')) {
          console.log('🔄 [DEBUG] Actualizando Mis Cartones con nuevos estados');
          contenido.innerHTML = ui.obtenerContenidoMisCartones();
        }
      }
    });
  }
  
};  // ← CIERRA EL OBJETO ui AQUÍ

window.ui = ui;
