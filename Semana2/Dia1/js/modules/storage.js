/**
 * SOLO GELATOS - Módulo de Persistencia Dual (IndexedDB + LocalStorage + BroadcastChannel)
 * Almacena catálogo, pedidos, ventas, inventario, sucursales, caja y bitácora en vivo.
 */
(function (window) {
  'use strict';

  var DB_NAME = 'SoloGelatosDB';
  var DB_VERSION = 1;
  var STORES = [
    'catalog',
    'orders',
    'sales',
    'events',
    'inventory',
    'ingredients',
    'suppliers',
    'purchases',
    'customers',
    'users',
    'branches',
    'cashboxes',
    'settings'
  ];

  var dbInstance = null;
  var channel = null;

  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('solo_gelatos_sync');
    }
  } catch (e) {}

  function openDB() {
    if (dbInstance) return Promise.resolve(dbInstance);
    if (!('indexedDB' in window)) {
      return Promise.reject(new Error('IndexedDB no disponible'));
    }

    return new Promise(function (resolve, reject) {
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (ev) {
        var db = ev.target.result;
        STORES.forEach(function (storeName) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: '_key' });
          }
        });
      };
      req.onsuccess = function (ev) {
        dbInstance = ev.target.result;
        resolve(dbInstance);
      };
      req.onerror = function () {
        reject(req.error || new Error('Error abriendo IndexedDB'));
      };
    });
  }

  function lsKey(store, key) {
    return 'sg_db_' + store + '_' + key;
  }

  function setItem(store, key, value) {
    var payload = { _key: key, data: value, updatedAt: Date.now() };
    try {
      localStorage.setItem(lsKey(store, key), JSON.stringify(value));
    } catch (e) {}

    return openDB()
      .then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(store, 'readwrite');
          var objStore = tx.objectStore(store);
          var req = objStore.put(payload);
          req.onsuccess = function () {
            notifySync(store, key);
            resolve(value);
          };
          req.onerror = function () { reject(req.error); };
        });
      })
      .catch(function () {
        notifySync(store, key);
        return value;
      });
  }

  function getItem(store, key, fallbackValue) {
    return openDB()
      .then(function (db) {
        return new Promise(function (resolve) {
          var tx = db.transaction(store, 'readonly');
          var objStore = tx.objectStore(store);
          var req = objStore.get(key);
          req.onsuccess = function () {
            if (req.result && typeof req.result.data !== 'undefined') {
              resolve(req.result.data);
            } else {
              resolve(getLS(store, key, fallbackValue));
            }
          };
          req.onerror = function () {
            resolve(getLS(store, key, fallbackValue));
          };
        });
      })
      .catch(function () {
        return getLS(store, key, fallbackValue);
      });
  }

  function getLS(store, key, fallbackValue) {
    try {
      var raw = localStorage.getItem(lsKey(store, key));
      if (raw !== null) return JSON.parse(raw);
    } catch (e) {}
    return typeof fallbackValue === 'undefined' ? null : fallbackValue;
  }

  function setLS(key, value) {
    try {
      localStorage.setItem('sg_' + key, JSON.stringify(value));
    } catch (e) {}
  }

  function getLSSimple(key, fallbackValue) {
    try {
      var raw = localStorage.getItem('sg_' + key);
      if (raw !== null) return JSON.parse(raw);
    } catch (e) {}
    return typeof fallbackValue === 'undefined' ? null : fallbackValue;
  }

  function notifySync(store, key) {
    var msg = { store: store, key: key, ts: Date.now() };
    if (channel) {
      try { channel.postMessage(msg); } catch (e) {}
    }
    try {
      localStorage.setItem('sg_last_sync', JSON.stringify(msg));
    } catch (e) {}
  }

  function onSync(callback) {
    var channelListener = null;
    var storageListener = null;
    if (channel) {
      channelListener = function (ev) {
        callback(ev.data);
      };
      channel.addEventListener('message', channelListener);
    }
    storageListener = function (ev) {
      if (ev.key === 'sg_last_sync' && ev.newValue) {
        try {
          callback(JSON.parse(ev.newValue));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', storageListener);

    return function unsubscribe() {
      if (channel && channelListener) channel.removeEventListener('message', channelListener);
      if (storageListener) window.removeEventListener('storage', storageListener);
    };
  }

  function clearAll() {
    Object.keys(localStorage).forEach(function (k) {
      if (k.indexOf('sg_') === 0 && k !== 'solo_gelatos_theme') {
        localStorage.removeItem(k);
      }
    });
    return openDB()
      .then(function (db) {
        return Promise.all(STORES.map(function (store) {
          return new Promise(function (resolve) {
            var tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).clear().onsuccess = function () { resolve(); };
            tx.onerror = function () { resolve(); };
          });
        }));
      })
      .catch(function () {});
  }

  window.SGStorage = {
    openDB: openDB,
    setItem: setItem,
    getItem: getItem,
    setLS: setLS,
    getLS: getLSSimple,
    onSync: onSync,
    clearAll: clearAll
  };
})(window);
