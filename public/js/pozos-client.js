const pozos = {
  renderizar: function() {
    console.log('🏆 Renderizando pozos...');
    
    var pozosData = window.app.gameState ? window.app.gameState.pozosDinamicos : {};
    
    if (!pozosData || Object.keys(pozosData).length === 0) {
      console.log('⚠️ No hay datos de pozos');
      return;
    }
    
    var pozosNombres = {
      pokino: 'POKINO',
      cuatroEsquinas: '4 ESQUINAS',
      full: 'FULL',
      poker: 'POKER',
      centro: 'CENTRO',
      especial: 'ESPECIAL'
    };
    
    for (var pozo in pozosData) {
      var pozoEl = document.getElementById('pozo-' + pozo);
      if (pozoEl) {
        var pozoData = pozosData[pozo];
        var premioEl = pozoEl.querySelector('.pozo-premio');
        var fichasEl = pozoEl.querySelector('.pozo-fichas');
        var nombreEl = pozoEl.querySelector('.pozo-nombre');
        
        // ✅ CORRECCIÓN: Mostrar valor en COP y fichas correctamente
        if (nombreEl) nombreEl.textContent = pozosNombres[pozo] || pozo;
        if (premioEl) premioEl.textContent = '$' + (pozoData.total || 0) + ' COP';
        if (fichasEl) fichasEl.textContent = (pozoData.fichas || 0) + ' fichas';
        
        console.log('  Pojo', pozo, ':', pozoData.fichas, 'fichas ($' + pozoData.total + ' COP)');
        
        if (pozoData.acumulado > 0) {
          pozoEl.classList.add('acumulado');
        } else {
          pozoEl.classList.remove('acumulado');
        }
      }
    }
    
    console.log('✅ Pozos renderizados');
  }
};

window.pozos = pozos;
