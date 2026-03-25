// ============================================================================
// 🏆 POZOS - LÓGICA DEL CLIENTE
// ============================================================================

const pozos = {
  renderizar: () => {
    const pozos = app.gameState?.pozosDinamicos;
    if (!pozos) return;

    Object.keys(pozos).forEach(pozo => {
      const elemento = document.getElementById(`pozo-${pozo}`);
      if (elemento) {
        const pozoData = pozos[pozo];
        const premioEl = elemento.querySelector('.pozo-premio');
        const fichasEl = elemento.querySelector('.pozo-fichas');

        if (premioEl) {
          premioEl.textContent = `$${pozoData.total} (${pozoData.fichas} fichas)`;
        }
        if (fichasEl) {
          fichasEl.textContent = `${pozoData.fichas} ficha${pozoData.fichas > 1 ? 's' : ''}`;
        }

        if (pozoData.acumulado > 0) {
          elemento.classList.add('acumulado');
        } else {
          elemento.classList.remove('acumulado');
        }
      }
    });
  }
};

// ✅ IMPORTANTE: Hacer pozos global
window.pozos = pozos;
