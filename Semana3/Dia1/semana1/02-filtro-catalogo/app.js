// Semana 1 - Filtro Catalogo
function filtrarCatalogo(categoriaSeleccionada) {
  const listaTarjetas = document.querySelectorAll('.card');
  listaTarjetas.forEach((tarjetaActual) => {
    const categoriaTarjeta = tarjetaActual.dataset.categoria;
    tarjetaActual.style.display = (categoriaSeleccionada === 'todos' || categoriaTarjeta === categoriaSeleccionada) ? 'block' : 'none';
  });
}

document.querySelectorAll('[data-filtro]').forEach((boton) => {
  boton.addEventListener('click', () => {
    document.querySelectorAll('[data-filtro]').forEach((b) => b.classList.remove('activo'));
    boton.classList.add('activo');
    filtrarCatalogo(boton.dataset.filtro);
  });
});
