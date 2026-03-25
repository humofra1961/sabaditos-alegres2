// ============================================================================
// 🏆 PREMIO - RECLAMAR Y CONFIRMAR
// ============================================================================

const premio = {
  reclamar: (numeroCarton, pozo) => {
    socket.emit('reclamarPremio', numeroCarton, pozo, app.emailActual);
  },

  confirmar: () => {
    if (app.premioPendiente) {
      const pozoKey = Object.keys(pozosInfo).find(k => pozosInfo[k].nombre === app.premioPendiente.pozo);
      socket.emit('confirmarPremio', app.premioPendiente.carton, pozoKey, app.premioPendiente.email, app.emailActual);
    }
  },

  rechazar: () => {
    document.getElementById('alertaGanador').classList.add('hidden');
    app.premioPendiente = null;
    ui.mostrarNotificacion('❌ Premio rechazado', 'error');
  },

  mostrarAlerta: (data) => {
    if (app.gameState?.cantador === app.emailActual) {
      app.premioPendiente = data;
      document.getElementById('mensajeGanador').textContent = data.mensaje;
      const alerta = document.getElementById('alertaGanador');
      if (alerta) {
        alerta.classList.remove('hidden');
        if (data.esEspecial) {
          alerta.classList.add('especial');
        } else {
          alerta.classList.remove('especial');
        }
      }
    }
    ui.mostrarNotificacion(data.mensaje, 'success');
  }
};

app.premioPendiente = null;

// ✅ IMPORTANTE: Hacer premio global
window.premio = premio;
