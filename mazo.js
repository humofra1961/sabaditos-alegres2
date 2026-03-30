// ============================================================================
// 🃏 MAZO DE CARTAS - GENERACIÓN Y BARAJADO
// ============================================================================

function generarMazo() {
  const palos = ['p', 'c', 'd', 't'];
  const valores = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const simbolos = { 'p': '♠', 'c': '♥', 'd': '♦', 't': '♣' };
  const colores = { 'p': 'black', 'c': 'red', 'd': 'red', 't': 'black' };
  
  let mazo = [];
  for (let palo of palos) {
    for (let valor of valores) {
      mazo.push({
        palo: simbolos[palo],
        valor: valor,
        color: colores[palo],
        codigo: valor + palo
      });
    }
  }
  return mazo;
}

function barajarMazo(mazo) {
  const mazoBarajado = [...mazo];
  for (let i = mazoBarajado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazoBarajado[i], mazoBarajado[j]] = [mazoBarajado[j], mazoBarajado[i]];
  }
  return mazoBarajado;
}

module.exports = { generarMazo, barajarMazo };