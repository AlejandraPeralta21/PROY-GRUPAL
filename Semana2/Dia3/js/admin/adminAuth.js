/**
 * SOLO GELATOS - Autenticación Privada del Panel Administrativo
 * No registra contraseñas ni datos confidenciales en la bitácora.
 */
(function (window, $) {
  'use strict';

  var SESSION_KEY = 'admin_session';

  function getSession() {
    return window.SGStorage.getLS(SESSION_KEY, null);
  }

  function logout() {
    var s = getSession();
    if (s && window.SGEventLog) {
      window.SGEventLog.record('AUTH', 'Usuario cerró sesión en el panel administrativo', {
        user: s.name,
        branch: s.branch
      });
    }
    window.SGStorage.setLS(SESSION_KEY, null);
  }

  function renderLogin() {
    var isDark = window.SGTheme.getTheme() === 'dark';
    return (
      '<div class="sg-admin-login-wrap">' +
      '  <div class="sg-blob sg-blob-pink-tl"></div>' +
      '  <div class="sg-blob sg-blob-teal-tr"></div>' +
      '  <div class="sg-blob sg-blob-pink-br"></div>' +
      '  <div class="sg-blob sg-blob-teal-bl"></div>' +

      '  <div class="sg-admin-login-card">' +
      '    <div class="d-flex justify-content-between align-items-center mb-3">' +
      '      <a href="index.html#catalog-home" class="small text-decoration-none text-turquoise fw-semibold"><i class="bi bi-arrow-left me-1"></i>Catálogo</a>' +
      '      <button type="button" class="sg-theme-pill" data-sg-theme-toggle>' +
      '        <i class="sg-theme-icon bi ' + (isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill') + '"></i>' +
      '        <span class="sg-theme-label">' + (isDark ? 'Modo Claro' : 'Modo Oscuro') + '</span>' +
      '      </button>' +
      '    </div>' +

      '    <div class="text-center mb-4">' +
      '      <div class="mx-auto mb-2" style="width:110px">' + window.SGComponents.renderLogoImg('w-100 h-auto', 'Solo Gelatos') + '</div>' +
      '      <h1 class="h5 fw-bold mb-1">Panel Administrativo</h1>' +
      '      <p class="small text-muted mb-0">Módulo privado de gestión, ventas y bitácora</p>' +
      '    </div>' +

      '    <form id="sg-admin-login-form" novalidate>' +
      '      <div class="mb-3">' +
      '        <label for="adm-email" class="form-label small fw-semibold">Correo corporativo</label>' +
      '        <input type="email" id="adm-email" class="form-control rounded-3" placeholder="admin@sologelatos.bo" required>' +
      '        <div class="invalid-feedback">Ingresa un correo válido.</div>' +
      '      </div>' +
      '      <div class="mb-3">' +
      '        <label for="adm-pass" class="form-label small fw-semibold">Contraseña</label>' +
      '        <input type="password" id="adm-pass" class="form-control rounded-3" placeholder="••••••••" required>' +
      '        <div class="invalid-feedback">Ingresa tu contraseña.</div>' +
      '      </div>' +
      '      <div id="adm-login-error" class="alert alert-danger py-2 small d-none" role="alert"></div>' +
      '      <button type="submit" class="btn btn-sg-primary w-100 py-2 mb-3"><i class="bi bi-shield-lock-fill me-2"></i>Iniciar sesión</button>' +
      '    </form>' +

      '    <div class="border-top pt-3">' +
      '      <div class="small text-muted text-center mb-2">Acceso rápido de demostración</div>' +
      '      <div class="d-flex gap-2">' +
      '        <button type="button" class="btn btn-sm btn-sg-teal flex-grow-1" id="adm-demo-admin"><i class="bi bi-person-badge me-1"></i>Admin</button>' +
      '        <button type="button" class="btn btn-sm btn-sg-secondary flex-grow-1" id="adm-demo-cashier"><i class="bi bi-cash-coin me-1"></i>Cajero</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindLoginEvents(onSuccess) {
    function attemptLogin(email, pass) {
      $('#adm-login-error').addClass('d-none');
      window.SGApi.getStoreList('users').then(function (users) {
        var found = (users || []).find(function (u) {
          return u.email.toLowerCase() === email.toLowerCase() && u.demoPin === pass && u.status === 'Activo';
        });

        if (!found) {
          $('#adm-login-error').text('Credenciales incorrectas o usuario inactivo.').removeClass('d-none');
          return;
        }

        var safeSession = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
          branch: found.branch,
          loginAt: new Date().toISOString()
        };
        window.SGStorage.setLS(SESSION_KEY, safeSession);
        window.SGEventLog.record('AUTH', 'Usuario inició sesión como ' + found.role, {
          user: found.name,
          branch: found.branch
        }).then(function () {
          onSuccess(safeSession);
        });
      });
    }

    $('#sg-admin-login-form').on('submit', function (ev) {
      ev.preventDefault();
      var $em = $('#adm-email');
      var $pw = $('#adm-pass');
      var email = ($em.val() || '').trim();
      var pass = $pw.val() || '';

      $em.toggleClass('is-invalid', !email || email.indexOf('@') === -1);
      $pw.toggleClass('is-invalid', !pass);
      if (!email || email.indexOf('@') === -1 || !pass) return;

      attemptLogin(email, pass);
    });

    $('#adm-demo-admin').on('click', function () {
      $('#adm-email').val('admin@sologelatos.bo');
      $('#adm-pass').val('Gelatos2026!');
      attemptLogin('admin@sologelatos.bo', 'Gelatos2026!');
    });

    $('#adm-demo-cashier').on('click', function () {
      $('#adm-email').val('caja@sologelatos.bo');
      $('#adm-pass').val('Caja2026!');
      attemptLogin('caja@sologelatos.bo', 'Caja2026!');
    });
  }

  window.SGAdminAuth = {
    getSession: getSession,
    logout: logout,
    renderLogin: renderLogin,
    bindLoginEvents: bindLoginEvents
  };
})(window, window.jQuery);
