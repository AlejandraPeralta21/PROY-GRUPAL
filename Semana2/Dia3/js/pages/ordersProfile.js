/**
 * SOLO GELATOS - Historial de Pedidos y Perfil del Cliente
 */
(function (window, $) {
  'use strict';

  function renderOrders(orders) {
    var esc = window.SGComponents.esc;
    var formatBs = window.SGComponents.formatBs;

    var badgeMap = {
      'Entregado': 'bg-success',
      'En camino': 'bg-turquoise',
      'En preparación': 'bg-raspberry',
      'Cancelado': 'bg-danger'
    };

    return (
      '<div class="container py-3 sg-page-section">' +
      '  <div class="d-flex align-items-center justify-content-between mb-3">' +
      '    <div>' +
      '      <h1 class="h5 fw-bold mb-0">Mis Pedidos</h1>' +
      '      <small class="text-muted">Seguimiento en tiempo real de tus órdenes</small>' +
      '    </div>' +
      '    <button type="button" class="btn btn-sg-primary btn-sm" data-sg-nav="categories"><i class="bi bi-plus-lg me-1"></i>Nuevo pedido</button>' +
      '  </div>' +
      (orders && orders.length
        ? '<div class="row g-3">' + orders.map(function (ord) {
            var badge = badgeMap[ord.status] || 'bg-secondary';
            return (
              '<div class="col-12 col-md-6">' +
              '  <div class="sg-card p-3 h-100 d-flex flex-column">' +
              '    <div class="d-flex justify-content-between align-items-center mb-2">' +
              '      <span class="fw-bold text-raspberry">#' + esc(ord.id) + '</span>' +
              '      <span class="badge rounded-pill ' + badge + '">' + esc(ord.status) + '</span>' +
              '    </div>' +
              '    <div class="small text-muted mb-2"><i class="bi bi-calendar3 me-1"></i>' + esc(ord.date) + ' · ' + esc(ord.time) + ' · ' + esc(ord.paymentMethod) + '</div>' +
              '    <div class="small mb-2 flex-grow-1">' +
                     (ord.items || []).map(function (it) {
                       return '<div>' + it.qty + 'x <strong>' + esc(it.name) + '</strong> <span class="text-muted">(' + esc(it.size) + ')</span></div>';
                     }).join('') +
              '    </div>' +
              '    <div class="d-flex justify-content-between align-items-center border-top pt-2 mt-2">' +
              '      <span class="sg-price">' + formatBs(ord.total) + '</span>' +
              '      <span class="small text-secondary"><i class="bi bi-shop me-1"></i>' + esc(ord.branch || 'Sucursal Centro') + '</span>' +
              '    </div>' +
              '  </div>' +
              '</div>'
            );
          }).join('') + '</div>'
        : '<div class="sg-card p-5 text-center"><i class="bi bi-receipt fs-1 text-turquoise"></i><p class="fw-bold mt-2 mb-1">Aún no realizaste pedidos</p><p class="small text-muted mb-3">Explora nuestros helados y copas para hacer tu primer pedido.</p><button type="button" class="btn btn-sg-primary btn-sm" data-sg-nav="home">Ir al catálogo</button></div>') +
      '</div>'
    );
  }

  function renderProfile(catalog) {
    var profile = window.SGCart.getProfile();
    var favIds = window.SGCart.getFavorites();
    var favProducts = (catalog.products || []).filter(function (p) { return favIds.indexOf(p.id) !== -1; });
    var isDark = window.SGTheme.getTheme() === 'dark';
    var esc = window.SGComponents.esc;

    return (
      '<div class="container py-3 sg-page-section">' +
      '  <div class="row g-4">' +
      '    <div class="col-12 col-lg-6">' +
      '      <div class="sg-card p-3 p-md-4">' +
      '        <div class="d-flex align-items-center gap-3 mb-4">' +
      '          <div class="rounded-circle bg-raspberry text-white d-flex align-items-center justify-content-center fw-bold fs-4" style="width:58px;height:58px">' +
                   esc((profile.name || 'SG').slice(0, 2).toUpperCase()) +
      '          </div>' +
      '          <div>' +
      '            <h1 class="h5 fw-bold mb-0">' + esc(profile.name || 'Cliente Solo Gelatos') + '</h1>' +
      '            <small class="text-turquoise fw-semibold"><i class="bi bi-patch-check-fill me-1"></i>Perfil de cliente</small>' +
      '          </div>' +
      '        </div>' +

      '        <form id="sg-profile-form">' +
      '          <div class="mb-3">' +
      '            <label class="form-label small fw-semibold" for="prof-name">Nombre completo</label>' +
      '            <input type="text" id="prof-name" class="form-control rounded-3" value="' + esc(profile.name) + '" placeholder="Tu nombre">' +
      '          </div>' +
      '          <div class="mb-3">' +
      '            <label class="form-label small fw-semibold" for="prof-phone">Teléfono</label>' +
      '            <input type="tel" id="prof-phone" class="form-control rounded-3" value="' + esc(profile.phone) + '" placeholder="+591 7XXXXXXX">' +
      '          </div>' +
      '          <div class="mb-3">' +
      '            <label class="form-label small fw-semibold" for="prof-address">Dirección predeterminada</label>' +
      '            <input type="text" id="prof-address" class="form-control rounded-3" value="' + esc(profile.address) + '" placeholder="Tu dirección">' +
      '          </div>' +
      '          <div class="mb-3">' +
      '            <label class="form-label small fw-semibold" for="prof-reference">Referencia</label>' +
      '            <input type="text" id="prof-reference" class="form-control rounded-3" value="' + esc(profile.reference) + '" placeholder="Referencia de ubicación">' +
      '          </div>' +
      '          <button type="submit" class="btn btn-sg-primary w-100"><i class="bi bi-save me-2"></i>Guardar mis datos</button>' +
      '        </form>' +
      '      </div>' +
      '    </div>' +

      '    <div class="col-12 col-lg-6">' +
      '      <div class="sg-card p-3 p-md-4 mb-3">' +
      '        <h2 class="h6 fw-bold mb-3">Apariencia de la aplicación</h2>' +
      '        <div class="d-flex align-items-center justify-content-between p-3 rounded-4 border" style="background:var(--sg-bg-secondary)">' +
      '          <div class="d-flex align-items-center gap-2"><i class="bi bi-sun-fill text-warning fs-5"></i><span class="small fw-bold">Modo Claro</span></div>' +
      '          <div class="form-check form-switch m-0">' +
      '            <input class="form-check-input" type="checkbox" role="switch" id="prof-theme-switch" data-sg-theme-switch style="width:3rem;height:1.5rem;cursor:pointer" ' + (isDark ? 'checked' : '') + '>' +
      '          </div>' +
      '          <div class="d-flex align-items-center gap-2"><i class="bi bi-moon-stars-fill text-turquoise fs-5"></i><span class="small fw-bold">Modo Oscuro</span></div>' +
      '        </div>' +
      '      </div>' +

      '      <div class="sg-card p-3 p-md-4 mb-3">' +
      '        <div class="d-flex align-items-center justify-content-between mb-2">' +
      '          <h2 class="h6 fw-bold mb-0"><i class="bi bi-heart-fill text-raspberry me-2"></i>Mis Favoritos</h2>' +
      '          <span class="badge rounded-pill bg-raspberry">' + favProducts.length + '</span>' +
      '        </div>' +
               (favProducts.length
                 ? '<div class="d-flex flex-column gap-2">' + favProducts.map(function (p) {
                     return (
                       '<div class="d-flex align-items-center gap-2 p-2 rounded-3 border" style="cursor:pointer" data-sg-open-product="' + esc(p.id) + '">' +
                       '  <img src="' + window.SGComponents.safeImageUrl(p.image) + '" alt="' + esc(p.name) + '" class="rounded-2" style="width:46px;height:46px;object-fit:cover">' +
                       '  <div class="flex-grow-1 min-w-0"><div class="small fw-bold text-truncate">' + esc(p.name) + '</div><div class="small text-raspberry fw-bold">' + window.SGComponents.formatBs(p.price) + '</div></div>' +
                       '  <i class="bi bi-chevron-right text-muted"></i>' +
                       '</div>'
                     );
                   }).join('') + '</div>'
                 : '<p class="small text-muted mb-0">Toca el corazón en cualquier producto para guardarlo aquí.</p>') +
      '      </div>' +

      '      <div class="sg-card p-3 p-md-4 border-0" style="background:linear-gradient(135deg, var(--sg-night-blue), var(--sg-card-dark)); color:#fff">' +
      '        <h2 class="h6 fw-bold text-white mb-1"><i class="bi bi-shield-lock-fill text-turquoise me-2"></i>Administración Solo Gelatos</h2>' +
      '        <p class="small text-light opacity-75 mb-3">Acceso privado para gestión de productos, inventario, caja, reportes y bitácora de eventos en vivo.</p>' +
      '        <a href="admin.html" class="btn btn-sg-teal btn-sm"><i class="bi bi-box-arrow-in-right me-1"></i>Ir al Panel Administrativo</a>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindProfileEvents(rerender) {
    $('#sg-profile-form').on('submit', function (ev) {
      ev.preventDefault();
      window.SGCart.saveProfile({
        name: $('#prof-name').val().trim(),
        phone: $('#prof-phone').val().trim(),
        address: $('#prof-address').val().trim(),
        reference: $('#prof-reference').val().trim()
      });
      window.SGToast.show('Datos de perfil guardados correctamente', 'success');
      rerender();
    });

    $('#prof-theme-switch').on('change', function () {
      window.SGTheme.applyTheme($(this).is(':checked') ? 'dark' : 'light', false);
    });
  }

  window.SGOrdersProfile = {
    renderOrders: renderOrders,
    renderProfile: renderProfile,
    bindProfileEvents: bindProfileEvents
  };
})(window, window.jQuery);
