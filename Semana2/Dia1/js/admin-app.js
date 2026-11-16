/**
 * SOLO GELATOS - Controlador Principal del Panel Administrativo
 * Gestiona las 16 secciones del panel, autenticación, cambio de tema y sincronización en vivo.
 */
(function (window, $) {
  'use strict';

  var NAV_ITEMS = [
    { group: 'Principal' },
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'bitacora', label: 'Bitácora de eventos', icon: 'bi-activity' },
    { group: 'Catálogo e Inventario' },
    { id: 'productos', label: 'Productos', icon: 'bi-cone-striped' },
    { id: 'categorias', label: 'Categorías', icon: 'bi-grid' },
    { id: 'inventario', label: 'Inventario', icon: 'bi-boxes' },
    { id: 'ingredientes', label: 'Ingredientes', icon: 'bi-egg-fried' },
    { id: 'proveedores', label: 'Proveedores', icon: 'bi-truck' },
    { id: 'compras', label: 'Compras', icon: 'bi-bag-plus' },
    { group: 'Operaciones y Ventas' },
    { id: 'ventas', label: 'Ventas', icon: 'bi-receipt' },
    { id: 'pedidos', label: 'Pedidos', icon: 'bi-bicycle' },
    { id: 'caja', label: 'Caja', icon: 'bi-safe2' },
    { id: 'clientes', label: 'Clientes', icon: 'bi-people' },
    { group: 'Administración' },
    { id: 'usuarios', label: 'Usuarios', icon: 'bi-person-badge' },
    { id: 'sucursales', label: 'Sucursales', icon: 'bi-shop' },
    { id: 'reportes', label: 'Reportes', icon: 'bi-bar-chart-line' },
    { id: 'configuracion', label: 'Configuración', icon: 'bi-gear' }
  ];

  var state = {
    session: null,
    activeTab: 'dashboard',
    data: null
  };
  var unsubscribeStorageSync = null;

  function loadAllData() {
    return window.SGApi.ensureAdminSeeded().then(function () {
      return Promise.all([
        window.SGApi.loadCatalog(),
        window.SGApi.getStoreList('branches'),
        window.SGApi.getStoreList('users'),
        window.SGApi.getStoreList('ingredients'),
        window.SGApi.getStoreList('suppliers'),
        window.SGApi.getStoreList('purchases'),
        window.SGApi.getStoreList('customers'),
        window.SGApi.getStoreList('orders'),
        window.SGApi.getStoreList('sales'),
        window.SGApi.getStoreList('cashboxes'),
        window.SGEventLog.getEvents(),
        window.SGApi.getSettings()
      ]).then(function (r) {
        state.data = {
          catalog: r[0],
          branches: r[1],
          users: r[2],
          ingredients: r[3],
          suppliers: r[4],
          purchases: r[5],
          customers: r[6],
          orders: r[7],
          sales: r[8],
          cashboxes: r[9],
          events: r[10],
          settings: r[11]
        };
        return state.data;
      });
    });
  }

  function renderSidebar() {
    var esc = window.SGComponents.esc;
    var s = state.session;
    return (
      '<aside class="sg-admin-sidebar" id="sg-admin-sidebar">' +
      '  <div class="sg-admin-sidebar-brand">' +
      '    <img src="assets/brand/logo-solo-gelatos-dark.png" alt="Solo Gelatos" style="height:40px;width:auto">' +
      '    <div class="min-w-0">' +
      '      <div class="fw-bold small text-white text-truncate">' + esc(s.role) + '</div>' +
      '      <div class="text-turquoise text-truncate" style="font-size:0.74rem">' + esc(s.branch) + '</div>' +
      '    </div>' +
      '  </div>' +
      '  <nav class="sg-admin-nav" aria-label="Menú administrativo">' +
           NAV_ITEMS.map(function (it) {
             if (it.group) return '<div class="sg-admin-nav-group">' + it.group + '</div>';
             return (
               '<button type="button" class="sg-admin-nav-btn ' + (state.activeTab === it.id ? 'active' : '') + '" data-sg-admin-tab="' + it.id + '">' +
               '  <i class="bi ' + it.icon + '"></i><span>' + it.label + '</span>' +
               '</button>'
             );
           }).join('') +
      '  </nav>' +
      '  <div class="p-3 border-top border-secondary border-opacity-25 d-grid gap-2">' +
      '    <a href="index.html#catalog-home" class="btn btn-sm btn-outline-light"><i class="bi bi-shop-window me-1"></i>Ver Catálogo Cliente</a>' +
      '    <button type="button" id="sg-admin-logout" class="btn btn-sm btn-outline-danger"><i class="bi bi-box-arrow-left me-1"></i>Cerrar sesión</button>' +
      '  </div>' +
      '</aside>'
    );
  }

  function renderActiveTab() {
    var d = state.data;
    var tab = state.activeTab;
    var $content = $('#sg-admin-content');
    var reloadAndRender = function (fullReload) {
      if (fullReload) {
        loadAllData().then(renderShell);
      } else {
        renderActiveTab();
      }
    };

    window.SGAdminDashboard.destroyCharts();

    var titleObj = NAV_ITEMS.find(function (i) { return i.id === tab; });
    $('#sg-admin-page-title').text(titleObj ? titleObj.label : 'Dashboard');

    $('.sg-admin-nav-btn').removeClass('active');
    $('.sg-admin-nav-btn[data-sg-admin-tab="' + tab + '"]').addClass('active');

    if (tab === 'dashboard') {
      $content.html(window.SGAdminDashboard.render(d));
      window.SGAdminDashboard.renderCharts(d);
    } else if (tab === 'bitacora') {
      $content.html(window.SGAdminEventLog.render(d.events));
      window.SGAdminEventLog.bindEvents(function () { renderActiveTab(); });
    } else if (tab === 'productos') {
      $content.html(window.SGAdminCrud.renderProductos(d));
      window.SGAdminCrud.bindProductos(d, state.session, reloadAndRender);
    } else if (tab === 'categorias') {
      $content.html(window.SGAdminCrud.renderCategorias(d));
      window.SGAdminCrud.bindCategorias(d, state.session, reloadAndRender);
    } else if (tab === 'inventario') {
      $content.html(window.SGAdminCrud.renderInventario(d));
      window.SGAdminCrud.bindInventario(d, state.session, reloadAndRender);
    } else if (tab === 'ingredientes') {
      $content.html(window.SGAdminCrud.renderIngredientes(d));
      window.SGAdminCrud.bindIngredientes(d, state.session, reloadAndRender);
    } else if (tab === 'proveedores') {
      $content.html(window.SGAdminCrud.renderProveedores(d));
      window.SGAdminCrud.bindProveedores(d, state.session, reloadAndRender);
    } else if (tab === 'compras') {
      $content.html(window.SGAdminCrud.renderCompras(d));
      window.SGAdminCrud.bindCompras(d, state.session, reloadAndRender);
    } else if (tab === 'ventas') {
      $content.html(window.SGAdminCrud.renderVentas(d));
      window.SGAdminCrud.bindVentas(d, state.session, reloadAndRender);
    } else if (tab === 'pedidos') {
      $content.html(window.SGAdminCrud.renderPedidos(d));
      window.SGAdminCrud.bindPedidos(d, state.session);
    } else if (tab === 'clientes') {
      $content.html(window.SGAdminCrud.renderClientes(d));
    } else if (tab === 'usuarios') {
      $content.html(window.SGAdminCrud.renderUsuarios(d));
      window.SGAdminCrud.bindUsuarios(d, state.session, reloadAndRender);
    } else if (tab === 'sucursales') {
      $content.html(window.SGAdminCrud.renderSucursales(d));
      window.SGAdminCrud.bindSucursales(d, state.session, reloadAndRender);
    } else if (tab === 'caja') {
      $content.html(window.SGAdminCrud.renderCaja(d));
      window.SGAdminCrud.bindCaja(d, state.session, reloadAndRender);
    } else if (tab === 'reportes') {
      $content.html(window.SGAdminCrud.renderReportes(d));
      window.SGAdminCrud.bindReportes(d, state.session);
    } else if (tab === 'configuracion') {
      $content.html(window.SGAdminCrud.renderConfiguracion(d));
      window.SGAdminCrud.bindConfiguracion(d, state.session, reloadAndRender);
    }
  }

  function renderShell() {
    var isDark = window.SGTheme.getTheme() === 'dark';
    var esc = window.SGComponents.esc;
    $('#sg-admin-root').html(
      '<div class="sg-admin-shell">' +
      '  <div class="sg-admin-backdrop" id="sg-admin-backdrop"></div>' +
         renderSidebar() +
      '  <div class="sg-admin-main">' +
      '    <header class="sg-admin-topbar">' +
      '      <div class="d-flex align-items-center gap-2">' +
      '        <button type="button" class="sg-icon-btn d-lg-none" id="sg-admin-menu-btn" aria-label="Abrir menú"><i class="bi bi-list"></i></button>' +
      '        <div>' +
      '          <h1 class="h5 fw-bold mb-0" id="sg-admin-page-title">Dashboard</h1>' +
      '          <small class="text-muted d-none d-sm-inline">Sesión: ' + esc(state.session.name) + ' · ' + esc(state.session.branch) + '</small>' +
      '        </div>' +
      '      </div>' +
      '      <div class="d-flex align-items-center gap-2">' +
      '        <button type="button" class="sg-theme-pill" data-sg-theme-toggle>' +
      '          <i class="sg-theme-icon bi ' + (isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill') + '"></i>' +
      '          <span class="sg-theme-label d-none d-sm-inline">' + (isDark ? 'Modo Claro' : 'Modo Oscuro') + '</span>' +
      '        </button>' +
      '      </div>' +
      '    </header>' +
      '    <main class="sg-admin-content" id="sg-admin-content"></main>' +
      '  </div>' +
      '</div>'
    );

    renderActiveTab();
  }

  function showLoginGate() {
    $('#sg-admin-root').html(window.SGAdminAuth.renderLogin());
    window.SGAdminAuth.bindLoginEvents(function (session) {
      state.session = session;
      loadAllData().then(renderShell);
    });
  }

  function bindGlobalAdminEvents() {
    var $doc = $(document);

    $doc.off('.sgAdmin');

    $doc.on('click.sgAdmin', '[data-sg-admin-tab]', function () {
      state.activeTab = $(this).data('sg-admin-tab');
      $('#sg-admin-sidebar').removeClass('open');
      $('#sg-admin-backdrop').removeClass('show');
      renderActiveTab();
    });

    $doc.on('click.sgAdmin', '#sg-admin-menu-btn', function () {
      $('#sg-admin-sidebar').addClass('open');
      $('#sg-admin-backdrop').addClass('show');
    });

    $doc.on('click.sgAdmin', '#sg-admin-backdrop', function () {
      $('#sg-admin-sidebar').removeClass('open');
      $('#sg-admin-backdrop').removeClass('show');
    });

    $doc.on('click.sgAdmin', '#sg-admin-logout', function () {
      window.SGAdminAuth.logout();
      state.session = null;
      showLoginGate();
    });

    $doc.on('click.sgAdmin', '[data-sg-theme-toggle]', function () {
      window.SGTheme.toggleTheme();
    });

    // Re-colorear gráficos de Chart.js al cambiar de tema
    window.addEventListener('sg:theme-changed', function () {
      if (state.session && state.data) {
        if (state.activeTab === 'dashboard') {
          window.SGAdminDashboard.renderCharts(state.data);
        } else if (state.activeTab === 'reportes') {
          window.SGAdminCrud.bindReportes(state.data, state.session);
        }
      }
    });

    // Actualización en vivo de bitácora, pedidos y ventas sin recargar la página
    window.addEventListener('sg:event-logged', function (ev) {
      if (!state.data || !ev.detail) return;
      if (!state.data.events.some(function (e) { return e.id === ev.detail.id; })) {
        state.data.events.unshift(ev.detail);
      }
      if (state.session && state.activeTab === 'bitacora') {
        renderActiveTab();
      }
    });

    if (unsubscribeStorageSync) unsubscribeStorageSync();
    unsubscribeStorageSync = window.SGStorage.onSync(function (msg) {
      if (!state.session || !msg) return;
      loadAllData().then(function () {
        if (msg.store === 'events' && state.activeTab === 'bitacora') renderActiveTab();
        else if (msg.store === 'orders' && (state.activeTab === 'pedidos' || state.activeTab === 'dashboard')) renderActiveTab();
        else if (msg.store === 'sales' && (state.activeTab === 'ventas' || state.activeTab === 'dashboard')) renderActiveTab();
      });
    });
  }

  function init() {
    bindGlobalAdminEvents();
    window.SGApi.ensureAdminSeeded().then(function () {
      var session = window.SGAdminAuth.getSession();
      if (session) {
        state.session = session;
        loadAllData().then(renderShell);
      } else {
        showLoginGate();
      }
    });
  }

  $(document).ready(init);
})(window, window.jQuery);
