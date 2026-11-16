/* SOLO GELATOS - caché offline-first para la aplicación cliente. */
'use strict';

var CACHE_PREFIX = 'solo-gelatos-';
var CACHE_VERSION = 'v1';
var APP_CACHE = CACHE_PREFIX + CACHE_VERSION;
var RUNTIME_CACHE = CACHE_PREFIX + 'runtime-' + CACHE_VERSION;
var CORE_ASSETS = [
  './index.html', './manifest.json',
  './css/tokens.css', './css/themes.css', './css/client.css',
  './js/modules/theme.js', './js/modules/storage.js', './js/modules/eventLog.js',
  './js/modules/toast.js', './js/modules/cart.js', './js/modules/components.js',
  './js/pages/splashWelcome.js', './js/pages/homeCatalog.js', './js/pages/categoriesPage.js',
  './js/pages/filtersPage.js', './js/pages/productDetail.js', './js/pages/cartCheckout.js',
  './js/pages/ordersProfile.js', './js/app.js',
  './api/apiDataFallback.js', './api/apiService.js',
  './assets/data/catalog.json', './assets/data/admin-seed.json',
  './assets/brand/logo-badge.png', './assets/brand/logo-solo-gelatos.png',
  './assets/brand/logo-solo-gelatos-dark.png', './assets/images/hero/hero-banner.jpg',
  './assets/images/hero/splash-cone.jpg',
  './assets/images/products/promo-frio.jpg', './assets/images/products/frappe-pie-limon.jpg',
  './admin.html', './css/admin.css', './js/admin-app.js',
  './js/admin/adminAuth.js', './js/admin/adminDashboard.js',
  './js/admin/adminEventLog.js', './js/admin/adminCrud.js'
];
var CDN_ASSETS = [
  'https://code.jquery.com/jquery-3.7.1.min.js',
  'https://code.jquery.com/ui/1.13.3/jquery-ui.min.js',
  'https://code.jquery.com/ui/1.13.3/themes/base/jquery-ui.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(APP_CACHE).then(function (cache) {
    return cache.addAll(CORE_ASSETS).then(function () {
      return Promise.all(CDN_ASSETS.map(function (url) {
        return cache.add(url).catch(function () { return null; });
      })).then(function () {
        return cache.match('./assets/data/catalog.json').then(function (response) {
          return response ? response.json() : null;
        }).then(function (catalog) {
          if (!catalog) return;
          var paths = (catalog.products || []).map(function (product) { return product.image; })
            .concat((catalog.categories || []).map(function (category) { return category.image; }))
            .filter(function (path, index, all) { return path && all.indexOf(path) === index; });
          var scopeUrl = self.registration.scope;
          return Promise.all(paths.map(function (path) {
            var imageUrl = new URL(path, scopeUrl);
            if (imageUrl.origin !== self.location.origin) return null;
            return cache.add(imageUrl.href).catch(function () { return null; });
          }));
        });
      });
    });
  }).then(function () {
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key.indexOf(CACHE_PREFIX) === 0 && key !== APP_CACHE && key !== RUNTIME_CACHE;
    }).map(function (key) { return caches.delete(key); }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  var sameOrigin = url.origin === self.location.origin;
  var isNavigation = request.mode === 'navigate';
  var isData = sameOrigin && /\.(json)(\?|$)/i.test(url.pathname);

  if (isNavigation) {
    var offlinePage = url.pathname.toLowerCase().endsWith('/admin.html') ? './admin.html' : './index.html';
    event.respondWith(fetch(request).then(function (response) {
      if (response.ok) {
        var copy = response.clone();
        caches.open(APP_CACHE).then(function (cache) { cache.put('./index.html', copy); });
      }
      return response;
    }).catch(function () {
      return caches.match(offlinePage).then(function (cached) {
        return cached || caches.match('./index.html');
      });
    }));
    return;
  }

  if (isData) {
    event.respondWith(fetch(request).then(function (response) {
      if (response.ok) {
        var copy = response.clone();
        caches.open(RUNTIME_CACHE).then(function (cache) { cache.put(request, copy); });
      }
      return response;
    }).catch(function () {
      return caches.match(request, { ignoreSearch: true }).then(function (cached) {
        return cached || new Response('{}', { status: 503, headers: { 'Content-Type': 'application/json' } });
      });
    }));
    return;
  }

  if (!sameOrigin) {
    event.respondWith(caches.match(request).then(function (cached) {
      return cached || fetch(request).then(function (response) {
        if (response && (response.ok || response.type === 'opaque')) {
          var copy = response.clone();
          caches.open(RUNTIME_CACHE).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      });
    }));
    return;
  }

  event.respondWith(caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (response) {
      if (response.ok) {
        var copy = response.clone();
        caches.open(RUNTIME_CACHE).then(function (cache) { cache.put(request, copy); });
      }
      return response;
    });
  }));
});
