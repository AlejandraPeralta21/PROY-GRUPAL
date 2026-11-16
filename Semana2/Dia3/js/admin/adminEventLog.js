/**
 * SOLO GELATOS - Módulo de Bitácora de Eventos en Tiempo Real (Admin)
 * Muestra eventos en vivo sin recargar la página y permite filtrar por fecha, tipo, usuario y sucursal.
 */
(function (window, $) {
  'use strict';

  var filterState = {
    date: '',
    type: 'all',
    user: 'all',
    branch: 'all'
  };

  function getUnique(events, field) {
    var map = {};
    (events || []).forEach(function (e) {
      if (e[field]) map[e[field]] = true;
    });
    return Object.keys(map).sort();
  }

  function applyEventFilters(events) {
    return (events || []).filter(function (e) {
      if (filterState.date && e.date !== filterState.date) return false;
      if (filterState.type !== 'all' && e.type !== filterState.type) return false;
      if (filterState.user !== 'all' && e.user !== filterState.user) return false;
      if (filterState.branch !== 'all' && e.branch !== filterState.branch) return false;
      return true;
    });
  }

  function render(events) {
    events = events || [];
    var esc = window.SGComponents.esc;
    var today = new Date().toISOString().slice(0, 10);
    var todayCount = events.filter(function (e) { return e.date === today; }).length;
    var uniqueUsers = getUnique(events, 'user');
    var uniqueBranches = getUnique(events, 'branch');
    var types = ['POS', 'VENTA', 'ADMIN', 'CAJA', 'CLIENTE', 'AUTH'];
    var filtered = applyEventFilters(events);

    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">' +
      '    <div>' +
      '      <h2 class="h5 fw-bold mb-0">Bitácora de Eventos</h2>' +
      '      <small class="text-muted">Auditoría en tiempo real sin información confidencial</small>' +
      '    </div>' +
      '    <span class="sg-live-pill"><span class="sg-live-dot"></span>En vivo</span>' +
      '  </div>' +

      '  <!-- Estadísticas rápidas -->' +
      '  <div class="row g-3 mb-3">' +
      '    <div class="col-4"><div class="sg-kpi-card text-center"><div class="small text-muted">Total eventos</div><div class="sg-kpi-value text-turquoise">' + events.length + '</div></div></div>' +
      '    <div class="col-4"><div class="sg-kpi-card text-center"><div class="small text-muted">Hoy</div><div class="sg-kpi-value text-raspberry">' + todayCount + '</div></div></div>' +
      '    <div class="col-4"><div class="sg-kpi-card text-center"><div class="small text-muted">Usuarios</div><div class="sg-kpi-value">' + uniqueUsers.length + '</div></div></div>' +
      '  </div>' +

      '  <!-- Filtros -->' +
      '  <div class="sg-card p-3 mb-3">' +
      '    <div class="row g-2 align-items-end">' +
      '      <div class="col-6 col-md-3">' +
      '        <label class="form-label small fw-semibold mb-1" for="ev-flt-date">Fecha</label>' +
      '        <input type="date" id="ev-flt-date" class="form-control form-control-sm" value="' + esc(filterState.date) + '">' +
      '      </div>' +
      '      <div class="col-6 col-md-3">' +
      '        <label class="form-label small fw-semibold mb-1" for="ev-flt-type">Tipo de evento</label>' +
      '        <select id="ev-flt-type" class="form-select form-select-sm">' +
      '          <option value="all">Todos</option>' +
                 types.map(function (t) { return '<option value="' + t + '" ' + (filterState.type === t ? 'selected' : '') + '>' + t + '</option>'; }).join('') +
      '        </select>' +
      '      </div>' +
      '      <div class="col-6 col-md-2">' +
      '        <label class="form-label small fw-semibold mb-1" for="ev-flt-user">Usuario</label>' +
      '        <select id="ev-flt-user" class="form-select form-select-sm">' +
      '          <option value="all">Todos</option>' +
                 uniqueUsers.map(function (u) { return '<option value="' + esc(u) + '" ' + (filterState.user === u ? 'selected' : '') + '>' + esc(u) + '</option>'; }).join('') +
      '        </select>' +
      '      </div>' +
      '      <div class="col-6 col-md-2">' +
      '        <label class="form-label small fw-semibold mb-1" for="ev-flt-branch">Sucursal</label>' +
      '        <select id="ev-flt-branch" class="form-select form-select-sm">' +
      '          <option value="all">Todas</option>' +
                 uniqueBranches.map(function (b) { return '<option value="' + esc(b) + '" ' + (filterState.branch === b ? 'selected' : '') + '>' + esc(b) + '</option>'; }).join('') +
      '        </select>' +
      '      </div>' +
      '      <div class="col-12 col-md-2 d-grid">' +
      '        <button type="button" id="ev-flt-clear" class="btn btn-sm btn-sg-secondary">Limpiar</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <!-- Feed de eventos en tiempo real -->' +
      '  <div id="sg-events-feed">' +
      (filtered.length
        ? filtered.map(function (ev) {
            return (
              '<div class="sg-event-row">' +
              '  <div class="d-flex flex-column gap-1">' +
              '    <div class="d-flex align-items-center gap-2 flex-wrap">' +
              '      <span class="sg-event-time">' + esc(ev.date) + ' · ' + esc(ev.time) + '</span>' +
              '      <span class="small fw-bold">' + esc(ev.description) + '</span>' +
              '    </div>' +
              '    <div class="small text-muted">' +
              '      <span class="me-2"><i class="bi bi-person me-1"></i>' + esc(ev.user) + '</span>' +
              '      <span class="me-2"><i class="bi bi-shop me-1"></i>' + esc(ev.branch || 'Sucursal Centro') + '</span>' +
              '      <span class="opacity-75">ID: ' + esc(ev.id) + '</span>' +
              '    </div>' +
              '  </div>' +
              '  <span class="sg-event-badge badge-' + esc(ev.type) + '">' + esc(ev.type) + '</span>' +
              '</div>'
            );
          }).join('')
        : '<div class="sg-card p-4 text-center text-muted">No hay eventos que coincidan con los filtros seleccionados.</div>') +
      '  </div>' +
      '</div>'
    );
  }

  function bindEvents(rerender) {
    $('#ev-flt-date').on('change', function () { filterState.date = $(this).val(); rerender(); });
    $('#ev-flt-type').on('change', function () { filterState.type = $(this).val(); rerender(); });
    $('#ev-flt-user').on('change', function () { filterState.user = $(this).val(); rerender(); });
    $('#ev-flt-branch').on('change', function () { filterState.branch = $(this).val(); rerender(); });
    $('#ev-flt-clear').on('click', function () {
      filterState = { date: '', type: 'all', user: 'all', branch: 'all' };
      rerender();
    });
  }

  window.SGAdminEventLog = {
    render: render,
    bindEvents: bindEvents
  };
})(window, window.jQuery);
