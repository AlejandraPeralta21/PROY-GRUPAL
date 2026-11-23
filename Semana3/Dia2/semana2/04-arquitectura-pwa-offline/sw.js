// Semana 2 - Arquitectura PWA Offline-First
const NOMBRE_CACHE = 'solo-gelatos-s2-v13';
const ARCHIVOS = ['./index.html', './styles.css', './app.js', './manifest.json'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(NOMBRE_CACHE).then((c) => c.addAll(ARCHIVOS)));
});
self.addEventListener('fetch', (eventoPeticion) => {
  if (eventoPeticion.request.url.includes('supabase.co')) return;
  eventoPeticion.respondWith(caches.match(eventoPeticion.request).then((r) => r || fetch(eventoPeticion.request)));
});
