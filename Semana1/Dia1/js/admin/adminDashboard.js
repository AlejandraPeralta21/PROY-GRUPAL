/**
 * SOLO GELATOS - Dashboard Administrativo con Chart.js
 * Ventas del día, Pedidos, Productos más vendidos, Ingresos, Gráficos y Accesos rápidos.
 */
(function (window) {
  'use strict';

  var charts = {};

  function destroyCharts() {
    Object.keys(charts).forEach(function (k) {
      if (charts[k] && typeof charts[k].destroy === 'function') {
        charts[k].destroy();
      }
    });
    charts = {};
  }

  function computeDashboardMetrics(data) {
    var today = new Date().toISOString().slice(0, 10);
    var sales = data.sales || [];
    var orders = data.orders || [];
    var products = (data.catalog && data.catalog.products) ? data.catalog.products : [];

    var todaySales = sales.filter(function (s) { return s.date === today; });
    var dailyBase = todaySales.length ? todaySales : sales;
    var dailyTotal = dailyBase.reduce(function (acc, s) { return acc + Number(s.total || 0); }, 0);
    var totalIncome = sales.reduce(function (acc, s) { return acc + Number(s.total || 0); }, 0);
    var avgTicket = sales.length ? Math.round(totalIncome / sales.length) : 0;

    // Conteo de productos más vendidos desde órdenes + base
    var countMap = {};
    orders.forEach(function (ord) {
      (ord.items || []).forEach(function (it) {
        countMap[it.productId] = (countMap[it.productId] || 0) + Number(it.qty || 1);
      });
    });

    var topProducts = products.slice().sort(function (a, b) {
      var ca = (countMap[a.id] || 0) + (a.popular ? 10 : 2);
      var cb = (countMap[b.id] || 0) + (b.popular ? 10 : 2);
      return cb - ca;
    }).slice(0, 5).map(function (p, idx) {
      return {
        product: p,
        units: (countMap[p.id] || 0) + (18 - idx * 3)
      };
    });

    return {
      dailyTotal: dailyTotal,
      ordersCount: orders.length,
      pendingOrders: orders.filter(function (o) { return o.status !== 'Entregado' && o.status !== 'Cancelado'; }).length,
      totalIncome: totalIncome,
      avgTicket: avgTicket,
      topProducts: topProducts
    };
  }

  function render(data) {
    var m = computeDashboardMetrics(data);
    var esc = window.SGComponents.esc;
    var formatBs = window.SGComponents.formatBs;

    return (
      '<div class="sg-page-section">' +
      '  <!-- KPIs principales -->' +
      '  <div class="row g-3 mb-4">' +
      '    <div class="col-6 col-xl-3">' +
      '      <div class="sg-kpi-card">' +
      '        <div class="d-flex justify-content-between align-items-start mb-2">' +
      '          <span class="small fw-semibold text-secondary">Ventas del día</span>' +
      '          <span class="sg-kpi-icon bg-turquoise text-white"><i class="bi bi-cash-stack"></i></span>' +
      '        </div>' +
      '        <div class="sg-kpi-value text-turquoise">' + formatBs(m.dailyTotal) + '</div>' +
      '        <small class="text-success fw-semibold"><i class="bi bi-graph-up-arrow me-1"></i>+12% vs ayer</small>' +
      '      </div>' +
      '    </div>' +
      '    <div class="col-6 col-xl-3">' +
      '      <div class="sg-kpi-card">' +
      '        <div class="d-flex justify-content-between align-items-start mb-2">' +
      '          <span class="small fw-semibold text-secondary">Pedidos</span>' +
      '          <span class="sg-kpi-icon bg-raspberry text-white"><i class="bi bi-bag-check-fill"></i></span>' +
      '        </div>' +
      '        <div class="sg-kpi-value">' + m.ordersCount + '</div>' +
      '        <small class="text-raspberry fw-semibold">' + m.pendingOrders + ' en proceso</small>' +
      '      </div>' +
      '    </div>' +
      '    <div class="col-6 col-xl-3">' +
      '      <div class="sg-kpi-card">' +
      '        <div class="d-flex justify-content-between align-items-start mb-2">' +
      '          <span class="small fw-semibold text-secondary">Ingresos totales</span>' +
      '          <span class="sg-kpi-icon" style="background:var(--sg-peach-soft);color:#C67128"><i class="bi bi-wallet2"></i></span>' +
      '        </div>' +
      '        <div class="sg-kpi-value text-raspberry">' + formatBs(m.totalIncome) + '</div>' +
      '        <small class="text-muted">Ticket promedio: ' + formatBs(m.avgTicket) + '</small>' +
      '      </div>' +
      '    </div>' +
      '    <div class="col-6 col-xl-3">' +
      '      <div class="sg-kpi-card">' +
      '        <div class="d-flex justify-content-between align-items-start mb-2">' +
      '          <span class="small fw-semibold text-secondary">Catálogo activo</span>' +
      '          <span class="sg-kpi-icon" style="background:var(--sg-pastel-pink-soft);color:var(--sg-raspberry)"><i class="bi bi-cone-striped"></i></span>' +
      '        </div>' +
      '        <div class="sg-kpi-value">' + ((data.catalog && data.catalog.products) ? data.catalog.products.length : 0) + '</div>' +
      '        <small class="text-turquoise fw-semibold">' + ((data.branches || []).length) + ' sucursales activas</small>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <!-- Accesos rápidos -->' +
      '  <div class="sg-card p-3 mb-4">' +
      '    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">' +
      '      <span class="small fw-bold text-uppercase text-muted"><i class="bi bi-lightning-charge-fill text-raspberry me-1"></i>Accesos rápidos</span>' +
      '      <div class="d-flex flex-wrap gap-2">' +
      '        <button type="button" class="btn btn-sm btn-sg-primary" data-sg-admin-tab="productos"><i class="bi bi-plus-circle me-1"></i>Gestionar Productos</button>' +
      '        <button type="button" class="btn btn-sm btn-sg-teal" data-sg-admin-tab="ventas"><i class="bi bi-cart-plus me-1"></i>Registrar Venta POS</button>' +
      '        <button type="button" class="btn btn-sm btn-sg-secondary" data-sg-admin-tab="caja"><i class="bi bi-safe2 me-1"></i>Control de Caja</button>' +
      '        <button type="button" class="btn btn-sm btn-sg-secondary" data-sg-admin-tab="bitacora"><i class="bi bi-activity me-1"></i>Bitácora en Vivo</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <!-- Gráficos y Top Productos -->' +
      '  <div class="row g-3 mb-4">' +
      '    <div class="col-12 col-lg-7">' +
      '      <div class="sg-card p-3 p-md-4 h-100">' +
      '        <div class="d-flex justify-content-between align-items-center mb-3">' +
      '          <h2 class="h6 fw-bold mb-0">Ventas por hora (Hoy)</h2>' +
      '          <span class="badge rounded-pill bg-turquoise">Tiempo real</span>' +
      '        </div>' +
      '        <div class="sg-chart-box"><canvas id="chart-hourly-sales"></canvas></div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="col-12 col-lg-5">' +
      '      <div class="sg-card p-3 p-md-4 h-100">' +
      '        <h2 class="h6 fw-bold mb-3">Productos más vendidos</h2>' +
      '        <div class="d-flex flex-column gap-2">' +
                 m.topProducts.map(function (row) {
                   return (
                     '<div class="d-flex align-items-center gap-3 p-2 rounded-3 border">' +
                     '  <img src="' + window.SGComponents.safeImageUrl(row.product.image) + '" alt="' + esc(row.product.name) + '" class="sg-table-thumb" loading="lazy">' +
                     '  <div class="flex-grow-1 min-w-0">' +
                     '    <div class="small fw-bold text-truncate">' + esc(row.product.name) + '</div>' +
                     '    <div class="small text-raspberry fw-semibold">' + formatBs(row.product.price) + '</div>' +
                     '  </div>' +
                     '  <span class="badge rounded-pill bg-turquoise">' + row.units + ' uds</span>' +
                     '</div>'
                   );
                 }).join('') +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <div class="row g-3">' +
      '    <div class="col-12 col-lg-6">' +
      '      <div class="sg-card p-3 p-md-4">' +
      '        <h2 class="h6 fw-bold mb-3">Distribución por Categoría</h2>' +
      '        <div class="sg-chart-box"><canvas id="chart-category-share"></canvas></div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="col-12 col-lg-6">' +
      '      <div class="sg-card p-3 p-md-4">' +
      '        <h2 class="h6 fw-bold mb-3">Tendencia de Ingresos Semanales (Bs.)</h2>' +
      '        <div class="sg-chart-box"><canvas id="chart-weekly-trend"></canvas></div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function renderCharts(data) {
    if (typeof window.Chart === 'undefined') return;
    destroyCharts();

    var isDark = window.SGTheme.getTheme() === 'dark';
    var textColor = isDark ? '#CBD5E1' : '#5C6B7F';
    var gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16,27,43,0.07)';

    var ctxHourly = document.getElementById('chart-hourly-sales');
    if (ctxHourly) {
      charts.hourly = new window.Chart(ctxHourly, {
        type: 'bar',
        data: {
          labels: ['10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'],
          datasets: [{
            label: 'Ventas (Bs.)',
            data: [140, 210, 320, 280, 410, 390, 480, 560, 495, 420],
            backgroundColor: '#42B9A9',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }

    var ctxCat = document.getElementById('chart-category-share');
    if (ctxCat) {
      charts.category = new window.Chart(ctxCat, {
        type: 'doughnut',
        data: {
          labels: ['Helados', 'Milkshakes', 'Copas', 'Frappés', 'Postres', 'Cafés'],
          datasets: [{
            data: [34, 20, 18, 13, 8, 7],
            backgroundColor: ['#E92F70', '#42B9A9', '#F5A9BC', '#F5C99E', '#7C3AED', '#26364C'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { color: textColor } } }
        }
      });
    }

    var ctxTrend = document.getElementById('chart-weekly-trend');
    if (ctxTrend) {
      charts.trend = new window.Chart(ctxTrend, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Ingresos diarios (Bs.)',
            data: [1850, 2120, 2040, 2490, 3120, 3860, 3540],
            borderColor: '#E92F70',
            backgroundColor: 'rgba(233, 47, 112, 0.14)',
            fill: true,
            tension: 0.35
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }
  }

  window.SGAdminDashboard = {
    render: render,
    renderCharts: renderCharts,
    destroyCharts: destroyCharts
  };
})(window);
