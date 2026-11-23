// Semana 1 - Bitacora Dia 2
const selectorVariante = document.getElementById('selectorVariante');
const formularioOrden = document.getElementById('formularioOrden');
const campoUsuario = document.getElementById('campoUsuario');
const salidaBitacora = document.getElementById('salidaBitacora');

function registrarEvento(tipoEvento, mensajeEvento) {
  const horaActual = new Date().toLocaleTimeString();
  const filaLog = document.createElement('div');
  filaLog.textContent = `[${horaActual}] ${tipoEvento}: ${mensajeEvento}`;
  salidaBitacora.prepend(filaLog);
}

selectorVariante.addEventListener('change', (eventoCambio) => {
  registrarEvento('CAMBIO_VARIANTE', `Variante elegida: ${eventoCambio.target.value}`);
});

formularioOrden.addEventListener('submit', (eventoEnvio) => {
  eventoEnvio.preventDefault();
  registrarEvento('COMPRA_EXITOSA', `Pedido de ${campoUsuario.value.trim()} (${selectorVariante.value})`);
  formularioOrden.reset();
});
