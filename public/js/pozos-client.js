// ============================================================================
// 🏆 POZOS - RENDERIZADO VISUAL PARA CANTADOR Y JUGADORES
// ============================================================================

const pozos = {
  renderizar: function() {
    console.log('🏆 Renderizando pozos...');
    const pozosData = window.app.gameState ? window.app.gameState.pozosDinamicos : {};
    
    if (!pozosData || Object.keys(pozosData).length === 0) {
      console.log('⚠️ No hay datos de pozos');
      return;
    }
    
    // ✅ Actualizar cada pozo en el HTML
    const pozosNombres = {
      pokino: 'POKINO',
      cuatroEsquinas: '4 ESQUINAS',
      full: 'FULL',
      poker: 'POKER',
      centro: 'CENTRO',
      especial: 'ESPECIAL'
    };
    
    Object.keys(pozosData).forEach(function(pozo) {
      const pozoEl = document.getElementById('pozo-' + pozo);
      if (pozoEl) {
        const pozoData = pozosData[pozo];
        const premioEl = pozoEl.querySelector('.pozo-premio');
        const fichasEl = pozoEl.querySelector('.pozo-fichas');
        const nombreEl = pozoEl.querySelector('.pozo-nombre');
        
        if (nombreEl) nombreEl.textContent = pozosNombres[pozo] || pozo;
        if (premioEl) premioEl.textContent = '$' + (pozoData.total || 0) + ' COP';
        if (fichasEl) fichasEl.textContent = (pozoData.fichas || 0) + ' fichas';
        
        // ✅ Marcar si está acumulado
        if (pozoData.acumulado > 0) {
          pozoEl.classList.add('acumulado');
        } else {
          pozoEl.classList.remove('acumulado');
        }
      }
    });
    
    console.log('✅ Pozos renderizados');
  }
};

window.pozos = pozos;
