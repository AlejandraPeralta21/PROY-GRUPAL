/**
 * SOLO GELATOS - Pantalla de Filtros Avanzados de Productos
 * Filtra por Categoría, Subcategoría, Sabor, Presentación, Precio Min/Max (jQuery UI Slider) y Populares.
 */
(function (window, $) {
  'use strict';

  function defaultFilters() {
    return {
      category: 'all',
      subcategory: 'all',
      flavor: 'all',
      presentation: 'all',
      minPrice: 10,
      maxPrice: 120,
      onlyPopular: false
    };
  }

  function applyFiltersToProducts(catalog, f) {
    var list = catalog.products || [];
    return list.filter(function (p) {
      if (f.category !== 'all') {
        var matchesCat = p.category === f.category || (Array.isArray(p.extraCategories) && p.extraCategories.indexOf(f.category) !== -1);
        if (!matchesCat) return false;
      }
      if (f.subcategory !== 'all') {
        var matchesSub = p.subcategory === f.subcategory || p.extraSubcategory === f.subcategory;
        if (!matchesSub) return false;
      }
      if (f.flavor !== 'all') {
        var flavMatch = (Array.isArray(p.defaultFlavors) && p.defaultFlavors.indexOf(f.flavor) !== -1) ||
          p.name.toLowerCase().indexOf(f.flavor.replace('-', ' ')) !== -1 ||
          (p.flavorSlots && p.flavorSlots > 0);
        if (!flavMatch) return false;
      }
      if (f.presentation !== 'all' && p.presentation !== f.presentation) {
        return false;
      }
      if (Number(p.price) < Number(f.minPrice) || Number(p.price) > Number(f.maxPrice)) {
        return false;
      }
      if (f.onlyPopular && !p.popular) {
        return false;
      }
      return true;
    });
  }

  function getUniquePresentations(products) {
    var map = {};
    (products || []).forEach(function (p) {
      if (p.presentation) map[p.presentation] = true;
    });
    return Object.keys(map);
  }

  function render(catalog, filters) {
    var f = Object.assign(defaultFilters(), filters || {});
    var esc = window.SGComponents.esc;
    var categories = catalog.categories || [];
    var flavors = catalog.flavors || [];
    var presentations = getUniquePresentations(catalog.products);
    var results = applyFiltersToProducts(catalog, f);

    // Subcategorías disponibles según categoría elegida
    var subOptions = [];
    if (f.category === 'all') {
      categories.forEach(function (c) {
        (c.subcategories || []).forEach(function (s) {
          subOptions.push({ id: s.id, name: c.shortName + ' · ' + s.name });
        });
      });
    } else {
      var catObj = categories.find(function (c) { return c.id === f.category; });
      subOptions = catObj ? (catObj.subcategories || []) : [];
    }

    return (
      '<div class="container py-3 sg-page-section">' +
      '  <div class="d-flex align-items-center justify-content-between mb-3">' +
      '    <div class="d-flex align-items-center gap-2">' +
      '      <button type="button" class="sg-icon-btn" data-sg-nav="home" aria-label="Volver"><i class="bi bi-chevron-left"></i></button>' +
      '      <div>' +
      '        <h1 class="h5 fw-bold mb-0">Filtros de Productos</h1>' +
      '        <small class="text-muted">Personaliza tu búsqueda por sabor, presentación y precio</small>' +
      '      </div>' +
      '    </div>' +
      '    <span class="badge rounded-pill bg-raspberry px-3 py-2">' + results.length + ' encontrados</span>' +
      '  </div>' +

      '  <div class="row g-3">' +
      '    <!-- Panel de filtros -->' +
      '    <div class="col-12 col-lg-4">' +
      '      <div class="sg-card p-3 p-md-4">' +
      '        <h2 class="h6 fw-bold mb-3"><i class="bi bi-funnel-fill text-raspberry me-2"></i>Criterios de filtrado</h2>' +

      '        <div class="mb-3">' +
      '          <label for="flt-category" class="form-label small fw-semibold">Categoría</label>' +
      '          <select id="flt-category" class="form-select rounded-3">' +
      '            <option value="all">Todas las categorías</option>' +
                   categories.map(function (c) {
                     return '<option value="' + esc(c.id) + '" ' + (f.category === c.id ? 'selected' : '') + '>' + esc(c.name) + '</option>';
                   }).join('') +
      '          </select>' +
      '        </div>' +

      '        <div class="mb-3">' +
      '          <label for="flt-subcategory" class="form-label small fw-semibold">Subcategoría</label>' +
      '          <select id="flt-subcategory" class="form-select rounded-3">' +
      '            <option value="all">Todas las subcategorías</option>' +
                   subOptions.map(function (s) {
                     return '<option value="' + esc(s.id) + '" ' + (f.subcategory === s.id ? 'selected' : '') + '>' + esc(s.name) + '</option>';
                   }).join('') +
      '          </select>' +
      '        </div>' +

      '        <div class="mb-3">' +
      '          <label for="flt-flavor" class="form-label small fw-semibold">Sabor</label>' +
      '          <select id="flt-flavor" class="form-select rounded-3">' +
      '            <option value="all">Cualquier sabor</option>' +
                   flavors.map(function (fl) {
                     return '<option value="' + esc(fl.id) + '" ' + (f.flavor === fl.id ? 'selected' : '') + '>' + esc(fl.name) + '</option>';
                   }).join('') +
      '          </select>' +
      '        </div>' +

      '        <div class="mb-3">' +
      '          <label for="flt-presentation" class="form-label small fw-semibold">Tipo de presentación</label>' +
      '          <select id="flt-presentation" class="form-select rounded-3">' +
      '            <option value="all">Todas las presentaciones</option>' +
                   presentations.map(function (pr) {
                     return '<option value="' + esc(pr) + '" ' + (f.presentation === pr ? 'selected' : '') + '>' + esc(pr) + '</option>';
                   }).join('') +
      '          </select>' +
      '        </div>' +

      '        <div class="mb-3">' +
      '          <div class="d-flex justify-content-between align-items-center mb-2">' +
      '            <label class="form-label small fw-semibold mb-0">Rango de precio (Bs.)</label>' +
      '            <span class="small fw-bold text-raspberry" id="flt-price-label">Bs. ' + f.minPrice + ' - Bs. ' + f.maxPrice + '</span>' +
      '          </div>' +
      '          <div id="sg-price-slider" class="my-3"></div>' +
      '          <div class="row g-2">' +
      '            <div class="col-6">' +
      '              <div class="input-group input-group-sm">' +
      '                <span class="input-group-text">Mín</span>' +
      '                <input type="number" id="flt-min-price" class="form-control" min="0" max="200" value="' + f.minPrice + '">' +
      '              </div>' +
      '            </div>' +
      '            <div class="col-6">' +
      '              <div class="input-group input-group-sm">' +
      '                <span class="input-group-text">Máx</span>' +
      '                <input type="number" id="flt-max-price" class="form-control" min="0" max="200" value="' + f.maxPrice + '">' +
      '              </div>' +
      '            </div>' +
      '          </div>' +
      '        </div>' +

      '        <div class="form-check form-switch mb-4">' +
      '          <input class="form-check-input" type="checkbox" id="flt-popular" ' + (f.onlyPopular ? 'checked' : '') + '>' +
      '          <label class="form-check-label small fw-semibold" for="flt-popular">Solo productos más populares</label>' +
      '        </div>' +

      '        <div class="d-grid gap-2">' +
      '          <button type="button" id="btn-apply-filters" class="btn btn-sg-primary"><i class="bi bi-check2-circle me-1"></i>Aplicar filtros</button>' +
      '          <button type="button" id="btn-clear-filters" class="btn btn-sg-secondary"><i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar filtros</button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +

      '    <!-- Resultados filtrados -->' +
      '    <div class="col-12 col-lg-8">' +
      (results.length
        ? '<div class="row g-3">' + results.map(function (p) { return window.SGComponents.renderProductCard(p, categories); }).join('') + '</div>'
        : '<div class="sg-card p-5 text-center"><i class="bi bi-emoji-smile fs-1 text-turquoise"></i><h3 class="h6 fw-bold mt-2">Sin resultados con esos filtros</h3><p class="small text-muted mb-3">Ajusta el rango de precios o limpia los filtros para ver más delicias.</p><button type="button" id="btn-clear-filters-empty" class="btn btn-sg-teal btn-sm">Limpiar filtros</button></div>') +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindEvents(catalog, state, rerender) {
    var f = state.filters || defaultFilters();

    if ($.fn.slider && $('#sg-price-slider').length) {
      $('#sg-price-slider').slider({
        range: true,
        min: 10,
        max: 120,
        values: [Number(f.minPrice), Number(f.maxPrice)],
        slide: function (ev, ui) {
          $('#flt-min-price').val(ui.values[0]);
          $('#flt-max-price').val(ui.values[1]);
          $('#flt-price-label').text('Bs. ' + ui.values[0] + ' - Bs. ' + ui.values[1]);
        }
      });
    }

    // Actualizar subcategorías al cambiar categoría sin perder otros campos
    $('#flt-category').on('change', function () {
      state.filters = {
        category: $(this).val(),
        subcategory: 'all',
        flavor: $('#flt-flavor').val(),
        presentation: $('#flt-presentation').val(),
        minPrice: Number($('#flt-min-price').val()) || 10,
        maxPrice: Number($('#flt-max-price').val()) || 120,
        onlyPopular: $('#flt-popular').is(':checked')
      };
      rerender();
    });

    $('#btn-apply-filters').on('click', function () {
      var minVal = Math.max(0, Number($('#flt-min-price').val()) || 0);
      var maxVal = Math.max(minVal, Number($('#flt-max-price').val()) || 120);
      state.filters = {
        category: $('#flt-category').val(),
        subcategory: $('#flt-subcategory').val(),
        flavor: $('#flt-flavor').val(),
        presentation: $('#flt-presentation').val(),
        minPrice: minVal,
        maxPrice: maxVal,
        onlyPopular: $('#flt-popular').is(':checked')
      };
      if (window.SGEventLog) {
        window.SGEventLog.record('CLIENTE', 'Cliente aplicó filtros de catálogo (' + state.filters.category + ', Bs.' + minVal + '-' + maxVal + ')');
      }
      rerender();
    });

    $('#btn-clear-filters, #btn-clear-filters-empty').on('click', function () {
      state.filters = defaultFilters();
      rerender();
    });
  }

  window.SGFiltersPage = {
    defaultFilters: defaultFilters,
    render: render,
    bindEvents: bindEvents
  };
})(window, window.jQuery);
