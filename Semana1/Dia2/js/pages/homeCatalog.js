/**
 * SOLO GELATOS - Página Principal del Catálogo (Home)
 * Buscador dinámico (jQuery + jQuery UI Autocomplete), Banner principal,
 * Categorías con iconos creativos, Productos destacados y Promociones del menú.
 */
(function (window, $) {
  'use strict';

  var searchTimer = null;

  var HOME_CATEGORIES = [
    { id: 'helados', label: 'Helados', icon: 'bi-cone-striped', tint: 'tint-pink' },
    { id: 'milkshakes', label: 'Milkshakes', icon: 'bi-cup-straw', tint: 'tint-teal' },
    { id: 'copas', label: 'Copas', icon: 'bi-trophy', tint: 'tint-pink' },
    { id: 'postres', label: 'Postres', icon: 'bi-cake2', tint: 'tint-peach' },
    { id: 'cafes', label: 'Cafés', icon: 'bi-cup-hot', tint: 'tint-peach' },
    { id: 'frappes', label: 'Frappés', icon: 'bi-snow2', tint: 'tint-teal' },
    { id: 'especiales', label: 'Especiales', icon: 'bi-stars', tint: 'tint-pink' },
    { id: 'todos', label: 'Todos', icon: 'bi-grid-fill', tint: 'tint-teal' }
  ];

  function render(catalog, searchQuery) {
    searchQuery = (searchQuery || '').trim();
    var products = catalog.products || [];
    var categories = catalog.categories || [];
    var esc = window.SGComponents.esc;

    // Resultados de búsqueda dinámica si el usuario escribe
    var filteredProducts = products;
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      filteredProducts = products.filter(function (p) {
        return p.name.toLowerCase().indexOf(q) !== -1 ||
          p.description.toLowerCase().indexOf(q) !== -1 ||
          p.category.toLowerCase().indexOf(q) !== -1 ||
          (p.presentation || '').toLowerCase().indexOf(q) !== -1;
      });
    }

    var featured = products.filter(function (p) { return p.featured; });
    if (featured.length === 0) featured = products.slice(0, 8);

    var catGridHtml = HOME_CATEGORIES.map(function (c) {
      return (
        '<button type="button" class="sg-cat-item" data-sg-home-cat="' + c.id + '">' +
        '  <div class="sg-cat-icon ' + c.tint + '"><i class="bi ' + c.icon + '"></i></div>' +
        '  <span class="sg-cat-label">' + c.label + '</span>' +
        '</button>'
      );
    }).join('');

    var html =
      '<div class="container py-3 sg-page-section">' +
      '  <!-- Buscador dinámico + acceso rápido a filtros -->' +
      '  <div class="sg-search-wrap mb-3">' +
      '    <div class="sg-search-box">' +
      '      <i class="bi bi-search sg-search-icon"></i>' +
      '      <input type="search" id="sg-home-search" class="sg-search-input" placeholder="Buscar helados, milkshakes, copas, frappés..." value="' + esc(searchQuery) + '" autocomplete="off">' +
            (searchQuery ? '<button type="button" id="sg-home-search-clear" class="sg-search-clear" aria-label="Limpiar búsqueda"><i class="bi bi-x-circle-fill"></i></button>' : '') +
      '    </div>' +
      '    <button type="button" class="sg-filter-trigger" data-sg-nav="filters">' +
      '      <i class="bi bi-sliders2 text-raspberry"></i>' +
      '      <span class="d-none d-sm-inline">Filtros</span>' +
      '    </button>' +
      '  </div>';

    if (searchQuery) {
      html +=
        '<section class="mb-4">' +
        '  <div class="d-flex align-items-center justify-content-between mb-3">' +
        '    <h2 class="h5 fw-bold mb-0">Resultados para "' + esc(searchQuery) + '" <span class="badge rounded-pill bg-turquoise ms-1">' + filteredProducts.length + '</span></h2>' +
        '    <button type="button" class="btn btn-sm btn-link text-raspberry text-decoration-none fw-semibold" id="sg-search-reset-link">Ver inicio</button>' +
        '  </div>' +
        (filteredProducts.length
          ? '<div class="row g-3">' + filteredProducts.map(function (p) { return window.SGComponents.renderProductCard(p, categories); }).join('') + '</div>'
          : '<div class="sg-card p-4 text-center"><i class="bi bi-search fs-1 text-pastel-pink"></i><p class="mt-2 mb-1 fw-bold">No encontramos coincidencias</p><p class="small text-muted mb-3">Prueba buscando "chocolate", "cookie", "kilo" o explora nuestras categorías.</p><button type="button" class="btn btn-sg-teal btn-sm" data-sg-nav="categories">Explorar categorías</button></div>'
        ) +
        '</section>';
    } else {
      html +=
        '  <!-- Banner Principal -->' +
        '  <section class="sg-hero-banner mb-4">' +
        '    <div class="sg-hero-content">' +
        '      <span class="sg-hero-badge"><i class="bi bi-stars"></i> Heladería Artesanal</span>' +
        '      <h1 class="sg-hero-title sg-script">El sabor que te hace feliz</h1>' +
        '      <p class="sg-hero-sub">Helados en cono y canasta de galleta, copas especiales, milkshakes y pastelería helada.</p>' +
        '      <div class="d-flex flex-wrap gap-2">' +
        '        <button type="button" class="btn btn-sg-primary" data-sg-nav="categories">Ver productos <i class="bi bi-arrow-right ms-1"></i></button>' +
        '        <button type="button" class="btn btn-sg-secondary" data-sg-open-cat="kilo">Por Kilo</button>' +
        '      </div>' +
        '    </div>' +
        '    <div class="sg-hero-media">' +
        '      <img src="assets/images/hero/hero-banner.jpg" alt="Helados en conos y copas Solo Gelatos" fetchpriority="high" decoding="async">' +
        '    </div>' +
        '  </section>' +

        '  <!-- Categorías con iconos creativos -->' +
        '  <section class="mb-4">' +
        '    <div class="d-flex align-items-center justify-content-between mb-2">' +
        '      <h2 class="h6 fw-bold mb-0">Categorías</h2>' +
        '      <button type="button" class="btn btn-link btn-sm text-raspberry text-decoration-none fw-semibold p-0" data-sg-nav="categories">Ver todas <i class="bi bi-chevron-right"></i></button>' +
        '    </div>' +
        '    <div class="sg-cat-grid">' + catGridHtml + '</div>' +
        '  </section>' +

        '  <!-- Productos Destacados -->' +
        '  <section class="mb-4">' +
        '    <div class="d-flex align-items-center justify-content-between mb-3">' +
        '      <div>' +
        '        <h2 class="h5 fw-bold mb-0">Productos destacados</h2>' +
        '        <small class="text-muted">Los favoritos de Solo Gelatos</small>' +
        '      </div>' +
        '      <button type="button" class="btn btn-link btn-sm text-raspberry text-decoration-none fw-semibold p-0" data-sg-nav="filters">Explorar todo <i class="bi bi-chevron-right"></i></button>' +
        '    </div>' +
        '    <div class="row g-3">' +
              featured.map(function (p) { return window.SGComponents.renderProductCard(p, categories); }).join('') +
        '    </div>' +
        '  </section>' +

        '  <!-- Promociones del Menú Original -->' +
        '  <section class="mb-3">' +
        '    <h2 class="h5 fw-bold mb-3">Promociones de temporada</h2>' +
        '    <div class="row g-3">' +
        '      <div class="col-12 col-md-6">' +
        '        <div class="sg-card p-3 d-flex align-items-center gap-3 h-100" style="cursor:pointer" data-sg-open-product="sg-promo-frio">' +
        '          <img src="assets/images/products/promo-frio.jpg" alt="Promo Frío" loading="lazy" decoding="async" class="rounded-3 flex-shrink-0" style="width:96px;height:82px;object-fit:cover;">' +
        '          <div class="flex-grow-1">' +
        '            <span class="badge rounded-pill bg-turquoise mb-1">PROMO FRÍO</span>' +
        '            <h3 class="h6 fw-bold mb-1">Sándwich de Jamón y Queso + Chocolate Caliente</h3>' +
        '            <div class="d-flex align-items-center justify-content-between">' +
        '              <span class="sg-price">Bs. 30</span>' +
        '              <span class="small text-raspberry fw-semibold">Ver detalle <i class="bi bi-arrow-right"></i></span>' +
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '      </div>' +
        '      <div class="col-12 col-md-6">' +
        '        <div class="sg-card p-3 d-flex align-items-center gap-3 h-100" style="cursor:pointer" data-sg-open-product="sg-frappe-pie-limon">' +
        '          <img src="assets/images/products/frappe-pie-limon.jpg" alt="Frappé de Pie de Limón" loading="lazy" decoding="async" class="rounded-3 flex-shrink-0" style="width:96px;height:82px;object-fit:cover;">' +
        '          <div class="flex-grow-1">' +
        '            <span class="badge rounded-pill bg-raspberry mb-1">PROMO 2 x Bs. 40</span>' +
        '            <h3 class="h6 fw-bold mb-1">Frappé de Pie de Limón (1 por Bs. 25)</h3>' +
        '            <div class="d-flex align-items-center justify-content-between">' +
        '              <span class="sg-price">Bs. 25</span>' +
        '              <span class="small text-raspberry fw-semibold">Ver detalle <i class="bi bi-arrow-right"></i></span>' +
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </section>';
    }

    html += '</div>';
    return html;
  }

  function bindEvents(catalog, state, rerender) {
    var $input = $('#sg-home-search');
    if ($input.length && $.fn.autocomplete) {
      var names = (catalog.products || []).map(function (p) { return p.name; });
      $input.autocomplete({
        source: names,
        minLength: 1,
        select: function (ev, ui) {
          state.searchQuery = ui.item.value;
          rerender();
        }
      });
    }

    clearTimeout(searchTimer);
    $input.on('input', function () {
      var val = $(this).val();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        state.searchQuery = val;
        rerender(true);
      }, 160);
    });

    $('#sg-home-search-clear, #sg-search-reset-link').on('click', function () {
      state.searchQuery = '';
      rerender();
    });

    $('[data-sg-home-cat]').on('click', function () {
      var cid = $(this).data('sg-home-cat');
      if (cid === 'todos') {
        window.SGApp.navigate('categories', { category: 'todos', subcategory: 'all' });
      } else {
        window.SGApp.navigate('categories', { category: cid, subcategory: 'all' });
      }
    });

    $('[data-sg-open-cat]').on('click', function () {
      var cid = $(this).data('sg-open-cat');
      window.SGApp.navigate('categories', { category: cid, subcategory: 'all' });
    });
  }

  window.SGHomeCatalog = {
    render: render,
    bindEvents: bindEvents,
    cancelPendingSearch: function () { clearTimeout(searchTimer); }
  };
})(window, window.jQuery);
