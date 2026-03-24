// ============================================================================
// ✅ VALIDACIÓN DE POZOS - CON FILAS CONFIGURABLES
// ============================================================================

function verificarPozo(carton, pozo, codigosCantados) {
  const verificarCartas = (indices) => {
    for (let i of indices) {
      if (!carton.tapadas[i]) {
        console.log(`❌ Carta ${i} no está tapada`);
        return false;
      }
      const carta = carton.cartas[i];
      console.log(`🔍 Verificando carta ${i}: código='${carta.codigo}', enMazo=${codigosCantados.includes(carta.codigo)}`);
      if (!codigosCantados.includes(carta.codigo)) {
        console.log(`❌ Carta ${carta.codigo} NO está en cartas cantadas`);
        return false;
      }
    }
    return true;
  };

  if (pozo === 'especial') return verificarCartas(Array.from({length: 25}, (_, i) => i));
  if (pozo === 'centro') return verificarCartas([12]);
  if (pozo === 'cuatroEsquinas') return verificarCartas([0, 4, 20, 24]);
  
  if (pozo === 'pokino') {
    const lineas = [
      [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
      [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
      [0,6,12,18,24], [4,8,12,16,20]
    ];
    return lineas.some(linea => verificarCartas(linea));
  }
  
  if (pozo === 'poker') {
    const fila = carton.pokerFila || 3;
    let indices = [];
    if (fila === 1) indices = [0, 1, 2, 3];
    else if (fila === 2) indices = [5, 6, 7, 8];
    else if (fila === 3) indices = [10, 11, 12, 13];
    else if (fila === 4) indices = [15, 16, 17, 18];
    else indices = [10, 11, 12, 13];
    return verificarCartas(indices);
  }
  
  if (pozo === 'full') {
    const fila = carton.fullFila || 4;
    let indices = [];
    if (fila === 1) indices = [0, 1, 2, 3, 4];
    else if (fila === 2) indices = [5, 6, 7, 8, 9];
    else if (fila === 3) indices = [10, 11, 12, 13, 14];
    else if (fila === 4) indices = [15, 16, 17, 18, 19];
    else if (fila === 5) indices = [20, 21, 22, 23, 24];
    else indices = [15, 16, 17, 18, 19];
    return verificarCartas(indices);
  }
  
  return false;
}

module.exports = { verificarPozo };