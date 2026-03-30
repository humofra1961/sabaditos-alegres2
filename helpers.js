// ============================================================================
// 🛠️ FUNCIONES AUXILIARES
// ============================================================================

function formatearMoneda(valor) {
  return `$${valor.toLocaleString('es-CO')} COP`;
}

function obtenerFechaActual() {
  return new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

module.exports = { formatearMoneda, obtenerFechaActual, validarEmail };