/**
 * SOLO GELATOS - Vista Dedicada de Categorías y Subcategorías
 * Mantiene el catálogo ordenado por categoría y subcategoría (sin amontonar productos).
 */
(function (window, $) {
  'use strict';

  function getProductsForCategory(catalog, catId, subId) {
    var all = catalog.products || [];
    if (catId === 'todos') return all;

    var byCat = all.filter(function (p) {
      if (p.category === catId) return true;
      if (Array.isArray(p.extraCategories) && p.extraCategories.indexOf(catId) !== -1) return true;
      return false;
    });

    if (!subId || subId === 'all') return byCat;

    return byCat.filter(function (p) {
      return p.subcategory === subId || p.extraSubcategory === subId;
    });
  }

  function render(catalog, selectedCat, selectedSub) {
    selectedCat = selectedCat || 'todos';
    selectedSub = selectedSub || 'all';

    var categories = catalog.categories || [];
    var esc = window.SGComponents.esc;
    var activeCatObj = categories.find(function (c) { return c.id === selectedCat; });

    var tabsHtml =
      '<button type="button" class="sg-pill-tab ' + (selectedCat === 'todos' ? 'active' : '') + '" data-sg-cat-tab="todos">Todos</button>' +
      categories.map(function (c) {
        return '<button type="button" class="sg-pill-tab ' + (selectedCat === c.id ? 'active' : '') + '" data-sg-cat-tab="' + esc(c.id) + '">' + esc(c.shortName || c.name) + '</button>';
      }).join('');

    var html =
      '<div class="container py-3 sg-page-section">' +
      '  <div class="d-flex align-items-center justify-content-between mb-3">' +
      '    <div class="d-flex align-items-center gap-2">' +
      '      <button type="button" class="sg-icon-btn" data-sg-nav="home" aria-label="Volver"><i class="bi bi-chevron-left"></i></button>' +
      '      <div>' +
      '        <h1 class="h5 fw-bold mb-0">Categorías</h1>' +
      '        <small class="text-muted">Explora nuestras líneas y subcategorías</small>' +
      '      </div>' +
      '    </div>' +
      '    <button type="button" class="sg-icon-btn" data-sg-nav="filters" aria-label="Filtros"><i class="bi bi-sliders2"></i></button>' +
      '  </div>' +
      '  <div class="sg-scroll-pills mb-3">' + tabsHtml + '</div>';

    if (selectedCat === 'todos') {
      // Vista limpia de tarjetas de categorías (similar al diseño de referencia)
      html +=
        '<div class="row g-3">' +
        categories.map(function (c) {
          var count = getProductsForCategory(catalog, c.id, 'all').length;
          var tintClass = c.tint === 'teal' ? 'tint-teal' : (c.tint === 'peach' ? 'tint-peach' : 'tint-pink');
          return (
            '<div class="col-12 col-md-6">' +
            '  <div class="sg-cat-list-card ' + tintClass + '" data-sg-cat-tab="' + esc(c.id) + '">' +
            '    <img src="' + window.SGComponents.safeImageUrl(c.image) + '" alt="' + esc(c.name) + '" loading="lazy" decoding="async">' +
            '    <div class="flex-grow-1 min-w-0">' +
            '      <div class="d-flex align-items-center gap-2">' +
            '        <h2 class="h6 fw-bold mb-0">' + esc(c.name) + '</h2>' +
            '        <span class="badge rounded-pill bg-raspberry">' + count + '</span>' +
            '      </div>' +
            '      <p class="small text-secondary mb-1 text-truncate">' + esc(c.description) + '</p>' +
            '      <div class="small text-turquoise fw-semibold">' + (c.subcategories ? c.subcategories.length + ' subcategorías' : '') + '</div>' +
            '    </div>' +
            '    <i class="bi bi-chevron-right text-muted fs-5"></i>' +
            '  </div>' +
            '</div>'
          );
        }).join('') +
        '</div>';
    } else if (activeCatObj) {
      var subs = activeCatObj.subcategories || [];
      var subPills =
        '<button type="button" class="sg-pill-tab sub-pill ' + (selectedSub === 'all' ? 'active' : '') + '" data-sg-sub-tab="all">Todas las opciones</button>' +
        subs.map(function (s) {
          return '<button type="button" class="sg-pill-tab sub-pill ' + (selectedSub === s.id ? 'active' : '') + '" data-sg-sub-tab="' + esc(s.id) + '">' + esc(s.name) + '</button>';
        }).join('');

      var items = getProductsForCategory(catalog, selectedCat, selectedSub);

      html +=
        '<div class="sg-card p-3 mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">' +
        '  <div>' +
        '    <h2 class="h5 fw-bold mb-0 text-raspberry"><i class="bi ' + esc(activeCatObj.icon) + ' me-2"></i>' + esc(activeCatObj.name) + '</h2>' +
        '    <small class="text-muted">' + esc(activeCatObj.description) + '</small>' +
        '  </div>' +
        '  <span class="badge rounded-pill bg-turquoise px-3 py-2">' + items.length + ' productos</span>' +
        '</div>' +
        '<div class="mb-3">' +
        '  <div class="small fw-bold text-secondary mb-1">Subcategorías</div>' +
        '  <div class="sg-scroll-pills">' + subPills + '</div>' +
        '</div>' +
        (items.length
          ? '<div class="row g-3">' + items.map(function (p) { return window.SGComponents.renderProductCard(p, categories); }).join('') + '</div>'
          : '<div class="sg-card p-4 text-center"><p class="mb-2 fw-semibold">No hay productos registrados en esta subcategoría.</p><button type="button" class="btn btn-sg-teal btn-sm" data-sg-sub-tab="all">Ver toda la categoría</button></div>');
    }

    html += '</div>';
    return html;
  }

  function bindEvents(state, rerender) {
    $('[data-sg-cat-tab]').on('click', function () {
      state.selectedCat = $(this).data('sg-cat-tab');
      state.selectedSub = 'all';
      rerender();
    });

    $('[data-sg-sub-tab]').on('click', function () {
      state.selectedSub = $(this).data('sg-sub-tab');
      rerender();
    });
  }

  window.SGCategoriesPage = {
    render: render,
    bindEvents: bindEvents
  };
})(window, window.jQuery);
