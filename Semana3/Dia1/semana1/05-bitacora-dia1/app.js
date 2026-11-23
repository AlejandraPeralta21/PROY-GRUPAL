// Semana 1 - Bitacora Dia 1
const contenedorLive = document.getElementById('contenedorLive');
const campoChat = document.getElementById('campoChat');
const salidaBitacora = document.getElementById('salidaBitacora');

function registrarEvento(tipoEvento, mensajeEvento) {
  const horaActual = new Date().toLocaleTimeString();
  const filaLog = document.createElement('div');
  filaLog.textContent = `[${horaActual}] ${tipoEvento}: ${mensajeEvento}`;
  salidaBitacora.prepend(filaLog);
}

contenedorLive.addEventListener('click', (eventoClick) => {
  if (eventoClick.target.dataset.prod) {
    registrarEvento('OFERTA_CLICK', `Producto seleccionado: ${eventoClick.target.dataset.prod}`);
  } else if (eventoClick.target.dataset.action === 'like') {
    registrarEvento('LIKE_STREAM', 'El usuario envió un Like.');
  }
});

contenedorLive.addEventListener('dblclick', (eventoDobleClick) => {
  if (eventoDobleClick.target.dataset.action === 'like') {
    registrarEvento('SUPER_LIKE', 'Reacción doble registrada.');
  }
});

campoChat.addEventListener('keyup', (eventoTeclado) => {
  registrarEvento('CHAT_INPUT', `Escribiendo: "${eventoTeclado.target.value}"`);
});
