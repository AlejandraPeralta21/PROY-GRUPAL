/**
 * SOLO GELATOS - Módulo de Bitácora de Eventos en Tiempo Real
 * Registra acciones importantes del cliente y del panel administrativo.
 * Nunca almacena contraseñas ni datos confidenciales.
 */
(function (window) {
  'use strict';

  var SENSITIVE_PATTERN = /(password|contraseñ|clave|pin|secret|token|cvv|tarjeta\s*\d{4})/gi;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function nowParts() {
    var d = new Date();
    var date = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    var time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    return { date: date, time: time };
  }

  function sanitizeText(text) {
    if (!text) return '';
    return String(text).replace(SENSITIVE_PATTERN, '[PROTEGIDO]').trim();
  }

  function resolveCurrentUser(explicitUser) {
    if (explicitUser) return sanitizeText(explicitUser);
    try {
      var session = window.SGStorage.getLS('admin_session', null);
      if (session && session.name) return session.name;
      var profile = window.SGStorage.getLS('client_profile', null);
      if (profile && profile.name) return profile.name;
    } catch (e) {}
    return 'Cliente Invitado';
  }

  function getEvents() {
    return window.SGStorage.getItem('events', 'list', []).then(function (list) {
      return Array.isArray(list) ? list : [];
    });
  }

  function record(type, description, options) {
    options = options || {};
    var stamp = nowParts();
    var entry = {
      id: 'EVT-' + Math.floor(1000 + Math.random() * 9000) + '-' + String(Date.now()).slice(-4),
      type: (type || 'POS').toUpperCase(),
      description: sanitizeText(description),
      user: resolveCurrentUser(options.user),
      date: options.date || stamp.date,
      time: options.time || stamp.time,
      branch: options.branch || 'Sucursal Centro'
    };

    return getEvents().then(function (list) {
      list.unshift(entry);
      if (list.length > 250) list = list.slice(0, 250);
      return window.SGStorage.setItem('events', 'list', list).then(function () {
        window.dispatchEvent(new CustomEvent('sg:event-logged', { detail: entry }));
        return entry;
      });
    });
  }

  window.SGEventLog = {
    getEvents: getEvents,
    record: record
  };
})(window);
