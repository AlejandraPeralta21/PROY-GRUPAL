// Semana 1 - Validacion Formulario
const formularioContacto = document.getElementById('formularioContacto');
const campoNombre = document.getElementById('campoNombre');
const campoCorreo = document.getElementById('campoCorreo');
const cajaAlerta = document.getElementById('cajaAlerta');
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

formularioContacto.addEventListener('submit', (eventoSubmit) => {
  eventoSubmit.preventDefault();
  const valorNombre = campoNombre.value.trim();
  const valorCorreo = campoCorreo.value.trim();
  cajaAlerta.textContent = '';
  const parrafoAviso = document.createElement('p');
  if (valorNombre === '' || !patronCorreo.test(valorCorreo)) {
    parrafoAviso.className = 'msg-error';
    parrafoAviso.textContent = 'Por favor, ingresa un nombre y un correo válidos.';
  } else {
    parrafoAviso.className = 'msg-exito';
    parrafoAviso.textContent = 'Formulario enviado con éxito.';
    formularioContacto.reset();
  }
  cajaAlerta.appendChild(parrafoAviso);
});
