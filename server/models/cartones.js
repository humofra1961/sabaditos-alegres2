// ============================================================================
// 🎴 MATRICES DE LOS 12 CARTONES OFICIALES
// ============================================================================
// Datos extraídos del Excel template del usuario
// Usa "1" para Ases (coherente con las imágenes PNG: 1p.png, 1c.png, etc.)
// ============================================================================

const distribucionesCartones = [
  // Cartón 1 - Poker: A (Fila 3), Full: Q+5 (Fila 4)
  { numero: 1, nombre: 'Cartón A', poker: '1', full2: 'Q', full3: '5', pokerFila: 3, fullFila: 4, cartas: ['8c', 'jt', '2d', '9c', '8d', '6c', 'kc', '3p', 'kt', '3d', '7c', '1p', '1c', '1t', '1d', '5c', 'qc', '5d', '5p', 'qd', '4c', '10c', '4p', '4d', '6d'] },
  
  // Cartón 2 - Poker: 3 (Fila 3), Full: 5+J (Fila 5)
  { numero: 2, nombre: 'Cartón 3', poker: '3', full2: '5', full3: 'J', pokerFila: 3, fullFila: 5, cartas: ['1p', '10c', '7d', '8d', '1c', '2p', '6c', '6d', '9d', '2t', '3t', '3c', '3d', '8t', '3p', '7c', '4c', '4d', '10t', '4t', 'jp', 'jc', '5d', 'jt', '5p'] },
  
  // Cartón 3 - Poker: 4 (Fila 1), Full: A+9 (Fila 2)
  { numero: 3, nombre: 'Cartón 4', poker: '4', full2: '1', full3: '9', pokerFila: 1, fullFila: 2, cartas: ['4c', '7c', '4t', '4d', '4p', '1c', '9t', '9c', '9d', '1p', '2d', '8c', '8t', '8d', '3p', '3c', '10p', '10d', '5d', '5p', '5t', 'jt', 'qc', 'qd', '2p'] },
  
  // Cartón 4 - Poker: 5 (Fila 3), Full: 9+7 (Fila 1)
  { numero: 4, nombre: 'Cartón 5', poker: '5', full2: '9', full3: '7', pokerFila: 3, fullFila: 1, cartas: ['9p', '7c', '7d', '7p', '9c', '4d', '9d', '4c', '4p', '10c', '5c', '5d', '5t', '5p', 'kc', '6d', '6p', '3t', 'qp', 'qc', '1t', '8p', '6c', 'jp', 'jc'] },
  
  // Cartón 5 - Poker: 6 (Fila 3), Full: 2+8 (Fila 5)
  { numero: 5, nombre: 'Cartón 6', poker: '6', full2: '2', full3: '8', pokerFila: 3, fullFila: 5, cartas: ['9t', '4c', '5d', '5c', 'qt', '10d', '9p', '4p', '9c', '4t', '6d', 'jd', '6p', '6c', '6t', '7d', 'kp', '3t', '7c', '7t', '8t', '8d', '2c', '8c', '2t'] },
  
  // Cartón 6 - Poker: 7 (Fila 3), Full: A+6 (Fila 4)
  { numero: 6, nombre: 'Cartón 7', poker: '7', full2: '1', full3: '6', pokerFila: 3, fullFila: 4, cartas: ['8p', '8d', '9d', 'jt', '4d', '5p', '4p', 'jd', '4t', '5d', '7p', '7t', '7d', 'kp', '7c', '6p', '6d', '1d', '1c', '6c', '9p', '5t', '3d', '3c', '3p'] },
  
  // Cartón 7 - Poker: 8 (Fila 3), Full: 7+10 (Fila 4)
  { numero: 7, nombre: 'Cartón 8', poker: '8', full2: '7', full3: '10', pokerFila: 3, fullFila: 4, cartas: ['kc', '4p', '7c', 'kp', '4c', 'jc', '5d', '9c', 'jd', 'jp', '8c', '8d', '8t', '9d', '8p', '10c', '7d', '10p', '10t', '7t', '1c', '6d', '6p', 'qc', '10d'] },
  
  // Cartón 8 - Poker: 9 (Fila 3), Full: 8+5 (Fila 4)
  { numero: 8, nombre: 'Cartón 9', poker: '9', full2: '8', full3: '5', pokerFila: 3, fullFila: 4, cartas: ['1c', '8p', 'jd', '2p', 'jt', '3p', '6d', '10d', '3c', '3t', '9c', '9p', '9d', '6c', '9t', '5t', '5d', '8d', '5p', '8t', 'kd', '7p', '7c', '4p', '4t'] },
  
  // Cartón 9 - Poker: 10 (Fila 2), Full: 4+9 (Fila 3)
  { numero: 9, nombre: 'Cartón 10', poker: '10', full2: '4', full3: '9', pokerFila: 2, fullFila: 3, cartas: ['qp', '3d', 'qt', '3p', '8d', '10p', '2d', '10c', '10t', '10d', '9p', '4t', '9c', '4p', '9d', '7p', '5p', 'jt', '7t', '7d', '2p', '1c', 'kt', '1d', '6d'] },
  
  // Cartón 10 - Poker: J (Fila 2), Full: Q+6 (Fila 4)
  { numero: 10, nombre: 'Cartón J', poker: 'J', full2: 'Q', full3: '6', pokerFila: 2, fullFila: 4, cartas: ['5p', '5d', '10p', '8c', '1c', 'jp', '3p', 'jd', 'jc', 'jt', '4p', '7t', 'kt', '7c', 'kc', 'qp', '6d', 'qt', '6c', '6t', '9p', '4t', '9d', '9c', '2c'] },
  
  // Cartón 11 - Poker: Q (Fila 3), Full: 5+J (Fila 4)
  { numero: 11, nombre: 'Cartón Q', poker: 'Q', full2: '5', full3: 'J', pokerFila: 3, fullFila: 4, cartas: ['1c', '8t', '4t', '7c', '7d', 'kt', '10t', '10c', '6d', '10d', 'qc', 'qt', 'qp', '9c', 'qd', 'jc', 'jt', '5p', '5t', 'jd', '10p', '9t', '9p', '8c', '5d'] },
  
  // Cartón 12 - Poker: K (Fila 2), Full: Q+9 (Fila 4)
  { numero: 12, nombre: 'Cartón K', poker: 'K', full2: 'Q', full3: '9', pokerFila: 2, fullFila: 4, cartas: ['1c', '8c', '8d', '9t', '4p', 'kt', 'kc', '5d', 'kd', 'kp', 'kd', '10c', '6d', '6c', '10p', 'qc', '9p', '9d', 'qt', '9c', 'jc', '2c', '7d', '1t', 'jt'] },
  
  // Cartón 13 - Generado por código (complemento)
  { numero: 13, nombre: 'Cartón Complemento', poker: 'J', full2: 'Q', full3: 'K', pokerFila: 3, fullFila: 4, cartas: ['jp', 'qc', 'kd', '1t', '2p', '3c', '4d', '5t', '6p', '7c', '8d', '9t', '10p', 'jc', 'qd', 'kp', '1c', '2d', '3t', '4p', '5c', '6d', '7t', '8p', '9c'] }
];

function generarCartonesFijos() {
  console.log('🚀 Generando 13 cartones con códigos unificados...');
  
  const cartones = distribucionesCartones.map(dist => {
    const cartas = dist.cartas.map((codigo, index) => {
      const valor = codigo.slice(0, -1);
      const paloCodigo = codigo.slice(-1);
      const palos = { 'p': '♠', 'c': '♥', 'd': '♦', 't': '♣' };
      const colores = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
      const palo = palos[paloCodigo] || '♠';
      
      let tipo = '';
      if (valor === dist.poker) tipo = 'poker';
      else if (valor === dist.full2 || valor === dist.full3) tipo = 'full';
      else if (index === 12) tipo = 'centro';

      return {
        codigo: codigo,
        valor: valor,
        palo: palo,
        color: colores[palo],
        tipo: tipo
      };
    });
    
    return {
      numero: dist.numero,
      nombre: dist.nombre,
      valorPoker: dist.poker,
      valorFull2: dist.full2,
      valorFull3: dist.full3,
      pokerFila: dist.pokerFila,
      fullFila: dist.fullFila,
      dueño: null,
      cartas: cartas,
      tapadas: Array(25).fill(false),
      pozos: { pokino: false, cuatroEsquinas: false, full: false, poker: false, centro: false, especial: false }
    };
  });
  
  console.log(`✅ Generados ${cartones.length} cartones`);
  return cartones;
}

module.exports = { distribucionesCartones, generarCartonesFijos };