// Semana 3 - Core Web Vitals BEM DOMPurify y Service Worker
const NOMBRE_CACHE = 'solo-gelatos-s3-cwv-v13';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(NOMBRE_CACHE).then((c) => c.addAll(['./index.html', './styles.css', './app.js'])));
});
self.addEventListener('fetch', (eventoPeticion) => {
  if (eventoPeticion.request.url.includes('supabase.co')) return;
  eventoPeticion.respondWith(caches.match(eventoPeticion.request).then((r) => r || fetch(eventoPeticion.request)));
});
