// Semana 2 - Tree Shaking y Reservas Anti-XSS
const formReserva = document.getElementById('formReserva');
const resCliente = document.getElementById('resCliente');
const resDetalle = document.getElementById('resDetalle');
const colaReservas = document.getElementById('colaReservas');

formReserva.addEventListener('submit', (e) => {
  e.preventDefault();
  const cliente = resCliente.value.trim();
  const detalle = resDetalle.value.trim();
  if (!cliente || !detalle) return;
  const item = document.createElement('li');
  item.textContent = `[${new Date().toLocaleTimeString()}] ${cliente} — ${detalle}`;
  colaReservas.prepend(item);
  formReserva.reset();
});
