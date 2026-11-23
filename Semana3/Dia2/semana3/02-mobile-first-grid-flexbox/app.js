// Semana 3 - Flexbox Responsivo Vertical y Horizontal
document.querySelectorAll('.dock-link').forEach((enlace) => {
  enlace.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.dock-link').forEach((x) => x.classList.remove('activo'));
    enlace.classList.add('activo');
  });
});
