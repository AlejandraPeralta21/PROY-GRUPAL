// Semana 2 - Responsividad Critica 4 Puntos Moviles y Login
const formLogin = document.getElementById('formLogin');
const selRol = document.getElementById('selRol');
const vistaCliente = document.getElementById('vistaCliente');
const vistaOperativa = document.getElementById('vistaOperativa');

function aplicarRol(rol) {
  sessionStorage.setItem('sesionActiva_solo_gelatos_demo', rol);
  vistaCliente.hidden = rol !== 'cliente';
  vistaOperativa.hidden = rol === 'cliente';
}

formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  aplicarRol(selRol.value);
});
aplicarRol(sessionStorage.getItem('sesionActiva_solo_gelatos_demo') || 'cliente');
