// Semana 1 - Menu Hamburguesa
const botonHamburguesa = document.getElementById('burguerBtn');
const menuNavegacion = document.getElementById('navMenu');
botonHamburguesa.addEventListener('click', () => {
  menuNavegacion.classList.toggle('show');
});
