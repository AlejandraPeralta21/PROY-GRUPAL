// Semana 2 - Arquitectura PWA Offline-First
let eventoInstalacion = null;
const btnInstalar = document.getElementById('btnInstalarPWA');
const estadoRed = document.getElementById('estadoRed');
const estadoSw = document.getElementById('estadoSw');

function refrescarRed() {
  estadoRed.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
}
window.addEventListener('online', refrescarRed);
window.addEventListener('offline', refrescarRed);
refrescarRed();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  eventoInstalacion = e;
  btnInstalar.hidden = false;
});

btnInstalar.addEventListener('click', async () => {
  if (!eventoInstalacion) return;
  eventoInstalacion.prompt();
  await eventoInstalacion.userChoice;
  eventoInstalacion = null;
  btnInstalar.hidden = true;
});

if ('serviceWorker' in navigator && (window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => { estadoSw.textContent = 'Service Worker registrado correctamente.'; })
    .catch(() => { estadoSw.textContent = 'Abre desde localhost o HTTPS para registrar el Service Worker.'; });
} else {
  estadoSw.textContent = 'Requiere localhost o HTTPS para activar Service Worker.';
}
