/**
 * SOLO GELATOS - Pantalla de Detalle de Producto
 * Fotografía grande, opciones de tamaño, selección dinámica de sabores,
 * complementos opcionales, observaciones y actualización automática del carrito.
 */
(function (window, $) {
  'use strict';

  function render(catalog, productId, draftState) {
    var product = (catalog.products || []).find(function (p) { return p.id === productId; });
    if (!product) {
      return (
        '<div class="container py-5 text-center">' +
        '  <p class="fw-bold">Producto no encontrado.</p>' +
        '  <button type="button" class="btn btn-sg-primary" data-sg-nav="home">Volver al inicio</button>' +
        '</div>'
      );
    }

    var esc = window.SGComponents.esc;
    var formatBs = window.SGComponents.formatBs;
    var catObj = (catalog.categories || []).find(function (c) { return c.id === product.category; });
    var sizes = (product.sizes && product.sizes.length) ? product.sizes : [{ label: 'Estándar', price: product.price }];
    var flavors = catalog.flavors || [];
    var extras = catalog.extras || [];
    var fav = window.SGCart.isFavorite(product.id);

    var selectedSizeIdx = draftState.sizeIdx || 0;
    if (selectedSizeIdx >= sizes.length) selectedSizeIdx = 0;
    var selectedFlavors = draftState.flavors || (product.defaultFlavors ? product.defaultFlavors.slice() : []);
    var selectedExtras = draftState.extras || [];
    var qty = draftState.qty || 1;
    var notes = draftState.notes || '';

    var extrasTotal = selectedExtras.reduce(function (s, eid) {
      var ex = extras.find(function (e) { return e.id === eid; });
      return s + (ex ? Number(ex.price) : 0);
    }, 0);
    var unitPrice = Number(sizes[selectedSizeIdx].price) + extrasTotal;
    var totalPrice = unitPrice * qty;

    var sizesHtml = sizes.map(function (sz, idx) {
      return (
        '<div class="col">' +
        '  <div class="sg-size-option ' + (idx === selectedSizeIdx ? 'active' : '') + '" data-sg-size-idx="' + idx + '">' +
        '    <div class="small fw-bold">' + esc(sz.label) + '</div>' +
        '    <div class="small fw-bold text-raspberry mt-1">' + formatBs(sz.price) + '</div>' +
        '  </div>' +
        '</div>'
      );
    }).join('');

    var flavorSectionHtml = '';
    if (product.flavorSlots && product.flavorSlots > 0) {
      flavorSectionHtml =
        '<div class="mb-4">' +
        '  <div class="d-flex justify-content-between align-items-center mb-2">' +
        '    <h2 class="h6 fw-bold mb-0">Elige tus sabores (' + selectedFlavors.length + '/' + product.flavorSlots + ')</h2>' +
        '    <small class="text-turquoise fw-semibold">Máx. ' + product.flavorSlots + '</small>' +
        '  </div>' +
        '  <div class="d-flex flex-wrap gap-2">' +
             flavors.map(function (fl) {
               var isSel = selectedFlavors.indexOf(fl.id) !== -1;
               return (
                 '<button type="button" class="sg-flavor-chip ' + (isSel ? 'selected' : '') + '" data-sg-flavor-id="' + esc(fl.id) + '">' +
                 '  <span class="sg-flavor-dot" style="background:' + esc(fl.color) + '"></span>' +
                 '  <span>' + esc(fl.name) + '</span>' +
                 (isSel ? '<i class="bi bi-check2-circle"></i>' : '') +
                 '</button>'
               );
             }).join('') +
        '  </div>' +
        '</div>';
    }

    var extrasHtml =
      '<div class="mb-4">' +
      '  <h2 class="h6 fw-bold mb-2">Complementos y toppings opcionales</h2>' +
      '  <div class="row g-2">' +
           extras.map(function (ex) {
             var checked = selectedExtras.indexOf(ex.id) !== -1;
             return (
               '<div class="col-12 col-sm-6">' +
               '  <label class="sg-payment-option py-2 px-3 ' + (checked ? 'active' : '') + '">' +
               '    <span class="d-flex align-items-center gap-2 small fw-semibold">' +
               '      <input type="checkbox" class="form-check-input mt-0 sg-extra-check" value="' + esc(ex.id) + '" ' + (checked ? 'checked' : '') + '>' +
               '      <span>' + esc(ex.name) + '</span>' +
               '    </span>' +
               '    <span class="small fw-bold text-raspberry">+' + formatBs(ex.price) + '</span>' +
               '  </label>' +
               '</div>'
             );
           }).join('') +
      '  </div>' +
      '</div>';

    return (
      '<div class="container py-3 sg-page-section">' +
      '  <div class="row g-4 justify-content-center">' +
      '    <div class="col-12 col-lg-5">' +
      '      <div class="sg-detail-hero">' +
      '        <img src="' + window.SGComponents.safeImageUrl(product.image) + '" alt="' + esc(product.name) + '">' +
      '        <button type="button" class="sg-icon-btn position-absolute top-0 start-0 m-3" id="sg-detail-back" aria-label="Volver"><i class="bi bi-chevron-left"></i></button>' +
      '        <button type="button" class="sg-icon-btn position-absolute top-0 end-0 m-3 text-raspberry" data-sg-fav="' + esc(product.id) + '" aria-label="Favorito">' +
      '          <i class="bi ' + (fav ? 'bi-heart-fill' : 'bi-heart') + '"></i>' +
      '        </button>' +
      '      </div>' +
      '    </div>' +

      '    <div class="col-12 col-lg-7">' +
      '      <div class="sg-card p-3 p-md-4">' +
      '        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">' +
      '          <span class="badge rounded-pill bg-turquoise">' + esc(catObj ? catObj.name : product.category) + '</span>' +
      '          <span class="badge rounded-pill border text-secondary">' + esc(product.presentation || 'Artesanal') + '</span>' +
                (product.popular ? '<span class="badge rounded-pill bg-raspberry"><i class="bi bi-star-fill me-1"></i>Más Popular</span>' : '') +
      '        </div>' +

      '        <h1 class="h4 fw-bold mb-1">' + esc(product.name) + '</h1>' +
      '        <div class="fs-4 fw-bold text-raspberry mb-2" id="sg-detail-unit-price">' + formatBs(unitPrice) + '</div>' +
      '        <p class="text-secondary mb-4">' + esc(product.description) + '</p>' +

      '        <div class="mb-4">' +
      '          <h2 class="h6 fw-bold mb-2">Tamaño o presentación</h2>' +
      '          <div class="row g-2 row-cols-2 row-cols-sm-3">' + sizesHtml + '</div>' +
      '        </div>' +

               flavorSectionHtml +
               extrasHtml +

      '        <div class="mb-4">' +
      '          <label for="sg-detail-notes" class="form-label h6 fw-bold">Observaciones del pedido</label>' +
      '          <textarea id="sg-detail-notes" class="form-control rounded-3" rows="2" placeholder="Ej: Sin maní, jalea extra aparte, cono bien crocante...">' + esc(notes) + '</textarea>' +
      '        </div>' +

      '        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 border-top">' +
      '          <div class="d-flex align-items-center gap-3">' +
      '            <span class="small fw-bold text-secondary">Cantidad</span>' +
      '            <div class="sg-qty-stepper">' +
      '              <button type="button" id="sg-detail-minus" aria-label="Disminuir">−</button>' +
      '              <span class="fw-bold px-2" id="sg-detail-qty">' + qty + '</span>' +
      '              <button type="button" id="sg-detail-plus" aria-label="Aumentar">+</button>' +
      '            </div>' +
      '          </div>' +
      '          <button type="button" id="sg-detail-add-btn" class="btn btn-sg-primary flex-grow-1 flex-sm-grow-0 px-4 py-2">' +
      '            <i class="bi bi-bag-plus-fill me-2"></i>Agregar al carrito · ' + formatBs(totalPrice) +
      '          </button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindEvents(catalog, productId, draftState, rerender) {
    var product = (catalog.products || []).find(function (p) { return p.id === productId; });
    if (!product) return;

    var sizes = (product.sizes && product.sizes.length) ? product.sizes : [{ label: 'Estándar', price: product.price }];

    $('#sg-detail-back').on('click', function () {
      window.SGApp.goBack();
    });

    $('[data-sg-size-idx]').on('click', function () {
      draftState.sizeIdx = Number($(this).data('sg-size-idx'));
      draftState.notes = $('#sg-detail-notes').val();
      rerender();
    });

    $('[data-sg-flavor-id]').on('click', function () {
      var fid = $(this).data('sg-flavor-id');
      var maxSlots = product.flavorSlots || 1;
      draftState.flavors = draftState.flavors || (product.defaultFlavors ? product.defaultFlavors.slice() : []);
      var idx = draftState.flavors.indexOf(fid);
      if (idx !== -1) {
        draftState.flavors.splice(idx, 1);
      } else {
        if (draftState.flavors.length >= maxSlots) {
          draftState.flavors.shift();
        }
        draftState.flavors.push(fid);
      }
      draftState.notes = $('#sg-detail-notes').val();
      rerender();
    });

    $('.sg-extra-check').on('change', function () {
      var eid = $(this).val();
      draftState.extras = draftState.extras || [];
      if ($(this).is(':checked')) {
        if (draftState.extras.indexOf(eid) === -1) draftState.extras.push(eid);
      } else {
        draftState.extras = draftState.extras.filter(function (x) { return x !== eid; });
      }
      draftState.notes = $('#sg-detail-notes').val();
      rerender();
    });

    $('#sg-detail-minus').on('click', function () {
      if ((draftState.qty || 1) > 1) {
        draftState.qty = (draftState.qty || 1) - 1;
        draftState.notes = $('#sg-detail-notes').val();
        rerender();
      }
    });

    $('#sg-detail-plus').on('click', function () {
      draftState.qty = (draftState.qty || 1) + 1;
      draftState.notes = $('#sg-detail-notes').val();
      rerender();
    });

    $('#sg-detail-add-btn').on('click', function () {
      var sIdx = draftState.sizeIdx || 0;
      if (sIdx >= sizes.length) sIdx = 0;
      var chosenSize = sizes[sIdx];

      var selectedFlavorNames = (draftState.flavors || []).map(function (fid) {
        var fObj = (catalog.flavors || []).find(function (fl) { return fl.id === fid; });
        return fObj ? fObj.name : fid;
      });

      var selectedExtraObjs = (draftState.extras || []).map(function (eid) {
        return (catalog.extras || []).find(function (ex) { return ex.id === eid; });
      }).filter(Boolean);

      var extrasSum = selectedExtraObjs.reduce(function (s, e) { return s + Number(e.price); }, 0);
      var unitPrice = Number(chosenSize.price) + extrasSum;

      window.SGCart.addItem({
        productId: product.id,
        name: product.name,
        image: product.image,
        size: chosenSize.label,
        unitPrice: unitPrice,
        qty: draftState.qty || 1,
        flavors: selectedFlavorNames,
        extras: selectedExtraObjs,
        notes: $('#sg-detail-notes').val().trim()
      });

      window.SGToast.flyToCart(this);
      window.SGToast.show('¡' + product.name + ' agregado al carrito!', 'pink');
    });
  }

  window.SGProductDetail = {
    render: render,
    bindEvents: bindEvents
  };
})(window, window.jQuery);
