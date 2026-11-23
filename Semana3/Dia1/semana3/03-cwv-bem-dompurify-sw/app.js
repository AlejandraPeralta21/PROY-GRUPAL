// Semana 3 - Core Web Vitals BEM DOMPurify y Service Worker
document.getElementById('btnSanitizar').addEventListener('click', () => {
  const crudo = document.getElementById('entradaHtml').value;
  const limpio = window.DOMPurify ? window.DOMPurify.sanitize(crudo) : crudo;
  document.getElementById('salidaSegura').innerHTML = limpio;
});
