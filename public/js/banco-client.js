// ============================================================================
// 🏦 BANCO - REPORTES Y BALANCE
// ============================================================================

const banco = {
  generarReporteFinal: () => {
    socket.emit('generarReporteFinal', app.emailActual);
  },

  verBalancePersonal: () => {
    const jugador = app.gameState?.jugadores?.[app.emailActual];
    if (!jugador) return;

    const contenido = document.getElementById('balanceContenido');
    if (!contenido) return;

    const totalInvertido = jugador.fichasCompradas * 50;
    const totalGanado = jugador.fichasGanadas * 50;
    const balance = totalGanado - totalInvertido;

    contenido.innerHTML = `
      <div><strong>👤 Jugador:</strong> ${jugador.nombre}</div>
      <div><strong>📧 Email:</strong> ${app.emailActual}</div>
      <hr style="margin: 10px 0; border-color: rgba(255,255,255,0.2);">
      <div>Fichas Compradas: ${jugador.fichasCompradas}</div>
      <div>Valor Invertido: <span style="color: #e74c3c;">$${totalInvertido} COP</span></div>
      <div>Fichas Ganadas: ${jugador.fichasGanadas}</div>
      <div>Valor Ganado: <span style="color: #27ae60;">$${totalGanado} COP</span></div>
      <div>Fichas Actuales: ${jugador.monedas}</div>
      <div>Balance Final: <span class="${balance >= 0 ? 'balance-positivo' : 'balance-negativo'}">$${balance} COP</span></div>
      <hr style="margin: 10px 0; border-color: rgba(255,255,255,0.2);">
      <div><strong>💵 Para Cambiar:</strong> <span style="color: #f39c12;">$${jugador.monedas * 50} COP</span></div>
    `;

    document.getElementById('modalBalance').classList.add('active');
  },

  imprimirReporte: () => {
    const contenido = document.getElementById('reporteContenido').innerHTML;
    const ventana = window.open('', '_blank');
    ventana.document.write(`
      <html>
      <head><title>Reporte Sabadito Alegre</title></head>
      <body style="font-family: Arial; padding: 20px; background: #1a1a2e; color: #fff;">
        <h2 style="color: #f39c12;">🏦 Reporte Final del Banco</h2>
        ${contenido}
        <script>window.print();<\/script>
      </body>
      </html>
    `);
    ventana.document.close();
  }
};