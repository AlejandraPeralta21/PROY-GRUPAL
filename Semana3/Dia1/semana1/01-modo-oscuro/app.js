// Semana 1 - Modo Oscuro
const botonTema = document.getElementById('themeBtn');
const cuerpoDocumento = document.body;
botonTema.addEventListener('click', () => {
  cuerpoDocumento.classList.toggle('dark-mode');
});
