/**
 * SOLO GELATOS - Módulo de Tema Claro / Oscuro
 * Gestiona el cambio instantáneo, persistencia en localStorage y sincronización entre páginas.
 */
(function (window) {
  'use strict';

  var THEME_KEY = 'solo_gelatos_theme';

  function getTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return 'light';
  }

  function applyTheme(theme, silent) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}

    // Actualizar meta theme-color
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', next === 'dark' ? '#101B2B' : '#E92F70');
    }

    // Sincronizar todos los botones e iconos sol/luna en la UI
    updateThemeButtons(next);

    if (!silent) {
      window.dispatchEvent(new CustomEvent('sg:theme-changed', { detail: { theme: next } }));
    }
    return next;
  }

  function toggleTheme() {
    var current = getTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, false);
    if (window.SGEventLog && typeof window.SGEventLog.record === 'function') {
      window.SGEventLog.record('CLIENTE', 'Tema visual cambiado a modo ' + (next === 'dark' ? 'oscuro' : 'claro'));
    }
    return next;
  }

  function updateThemeButtons(theme) {
    var isDark = theme === 'dark';
    var buttons = document.querySelectorAll('[data-sg-theme-toggle]');
    buttons.forEach(function (btn) {
      var icon = btn.querySelector('.sg-theme-icon');
      var label = btn.querySelector('.sg-theme-label');
      if (icon) {
        icon.className = 'sg-theme-icon bi ' + (isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill');
      }
      if (label) {
        label.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
      }
      btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    });

    var switches = document.querySelectorAll('[data-sg-theme-switch]');
    switches.forEach(function (sw) {
      sw.checked = isDark;
    });
  }

  // Escuchar cambios de tema desde otra pestaña (ej. cliente <-> admin)
  window.addEventListener('storage', function (ev) {
    if (ev.key === THEME_KEY && (ev.newValue === 'dark' || ev.newValue === 'light')) {
      applyTheme(ev.newValue, false);
    }
  });

  // Aplicar tema inicial inmediatamente
  applyTheme(getTheme(), true);

  window.SGTheme = {
    getTheme: getTheme,
    applyTheme: applyTheme,
    toggleTheme: toggleTheme,
    updateThemeButtons: updateThemeButtons
  };
})(window);
