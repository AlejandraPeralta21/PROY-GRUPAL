/**
 * SOLO GELATOS - Capa de Datos & Consumo AJAX / JSON
 * Consume assets/data/catalog.json y assets/data/admin-seed.json mediante jQuery $.ajax,
 * sincronizando con IndexedDB (SGStorage) y preparando rutas limpias para una futura API REST.
 */
(function (window, $) {
  'use strict';

  var ENDPOINTS = {
    catalog: 'assets/data/catalog.json',
    adminSeed: 'assets/data/admin-seed.json',
    restBase: '/api/v1' // Preparado para integración futura con backend Node/PHP/Laravel
  };

  function ajaxJson(url) {
    return new Promise(function (resolve, reject) {
      if (window.location.protocol === 'file:') {
        // En protocolo file:// los navegadores bloquean XHR/AJAX local por CORS;
        // se usa la semilla JSON equivalente sin romper la experiencia.
        reject(new Error('file-protocol'));
        return;
      }
      $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        cache: false,
        timeout: 4000
      })
        .done(function (data) { resolve(data); })
        .fail(function (jqXHR, textStatus) { reject(new Error(textStatus || 'ajax-error')); });
    });
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadCatalog() {
    return window.SGStorage.getItem('catalog', 'data', null).then(function (cached) {
      if (cached && Array.isArray(cached.products) && cached.products.length > 0) {
        return cached;
      }
      return ajaxJson(ENDPOINTS.catalog)
        .catch(function () {
          return clone(window.SG_FALLBACK_CATALOG);
        })
        .then(function (data) {
          return window.SGStorage.setItem('catalog', 'data', data).then(function () {
            return data;
          });
        });
    });
  }

  function saveCatalog(catalogData) {
    return window.SGStorage.setItem('catalog', 'data', catalogData);
  }

  function ensureAdminSeeded() {
    return window.SGStorage.getItem('settings', 'initialized', false).then(function (isInit) {
      if (isInit) return true;
      return ajaxJson(ENDPOINTS.adminSeed)
        .catch(function () {
          return clone(window.SG_FALLBACK_ADMIN_SEED);
        })
        .then(function (seed) {
          return Promise.all([
            window.SGStorage.setItem('branches', 'list', seed.branches || []),
            window.SGStorage.setItem('users', 'list', seed.users || []),
            window.SGStorage.setItem('ingredients', 'list', seed.ingredients || []),
            window.SGStorage.setItem('suppliers', 'list', seed.suppliers || []),
            window.SGStorage.setItem('purchases', 'list', seed.purchases || []),
            window.SGStorage.setItem('customers', 'list', seed.customers || []),
            window.SGStorage.setItem('orders', 'list', seed.orders || []),
            window.SGStorage.setItem('sales', 'list', seed.sales || []),
            window.SGStorage.setItem('cashboxes', 'list', seed.cashboxes || []),
            window.SGStorage.setItem('events', 'list', seed.events || []),
            window.SGStorage.setItem('settings', 'config', seed.settings || {}),
            window.SGStorage.setItem('settings', 'initialized', true)
          ]).then(function () {
            return true;
          });
        });
    });
  }

  function getStoreList(storeName) {
    return ensureAdminSeeded().then(function () {
      return window.SGStorage.getItem(storeName, 'list', []);
    });
  }

  function saveStoreList(storeName, list) {
    return window.SGStorage.setItem(storeName, 'list', list);
  }

  function getSettings() {
    return ensureAdminSeeded().then(function () {
      return window.SGStorage.getItem('settings', 'config', {});
    });
  }

  function saveSettings(cfg) {
    return window.SGStorage.setItem('settings', 'config', cfg);
  }

  function resetDemoData() {
    return window.SGStorage.clearAll().then(function () {
      return Promise.all([loadCatalog(), ensureAdminSeeded()]);
    });
  }

  window.SGApi = {
    ENDPOINTS: ENDPOINTS,
    loadCatalog: loadCatalog,
    saveCatalog: saveCatalog,
    ensureAdminSeeded: ensureAdminSeeded,
    getStoreList: getStoreList,
    saveStoreList: saveStoreList,
    getSettings: getSettings,
    saveSettings: saveSettings,
    resetDemoData: resetDemoData
  };
})(window, window.jQuery);
