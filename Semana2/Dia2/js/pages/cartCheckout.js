/**
 * SOLO GELATOS - Carrito de Compras, Formulario de Pedido con Validaciones y Confirmación
 */
(function (window, $) {
  'use strict';

  function renderCart(catalog) {
    var totals = window.SGCart.computeTotals(catalog.brand);
    var esc = window.SGComponents.esc;
    var formatBs = window.SGComponents.formatBs;

    if (!totals.items.length) {
      return (
        '<div class="container py-5 sg-page-section">' +
        '  <div class="sg-card p-5 text-center mx-auto" style="max-width:480px">' +
        '    <i class="bi bi-bag-heart fs-1 text-raspberry"></i>' +
        '    <h1 class="h5 fw-bold mt-3">Tu carrito está vacío</h1>' +
        '    <p class="small text-muted mb-4">Agrega helados artesanales, milkshakes, copas especiales o postres para empezar tu pedido.</p>' +
        '    <button type="button" class="btn btn-sg-primary" data-sg-nav="categories">Explorar menú</button>' +
        '  </div>' +
        '</div>'
      );
    }

    var itemsHtml = totals.items.map(function (it) {
      var details = [];
      if (it.size) details.push(it.size);
      if (it.flavors && it.flavors.length) details.push('Sabores: ' + it.flavors.join(', '));
      if (it.extras && it.extras.length) details.push('Extras: ' + it.extras.map(function (e) { return e.name; }).join(', '));

      return (
        '<div class="sg-card p-3 mb-3">' +
        '  <div class="d-flex gap-3 align-items-start">' +
        '    <img src="' + window.SGComponents.safeImageUrl(it.image) + '" alt="' + esc(it.name) + '" class="rounded-3 flex-shrink-0" style="width:78px;height:78px;object-fit:cover;">' +
        '    <div class="flex-grow-1 min-w-0">' +
        '      <div class="d-flex justify-content-between align-items-start gap-2">' +
        '        <h3 class="h6 fw-bold mb-1">' + esc(it.name) + '</h3>' +
        '        <button type="button" class="btn btn-sm btn-link text-danger p-0" data-sg-cart-remove="' + esc(it.uid) + '" aria-label="Eliminar"><i class="bi bi-trash"></i></button>' +
        '      </div>' +
        '      <div class="small text-secondary mb-1">' + esc(details.join(' · ')) + '</div>' +
               (it.notes ? '<div class="small text-turquoise fst-italic mb-2"><i class="bi bi-chat-left-text me-1"></i>' + esc(it.notes) + '</div>' : '') +
        '      <div class="d-flex justify-content-between align-items-center mt-2">' +
        '        <span class="sg-price">' + formatBs(it.unitPrice * it.qty) + '</span>' +
        '        <div class="sg-qty-stepper">' +
        '          <button type="button" data-sg-cart-qty="-1" data-uid="' + esc(it.uid) + '">−</button>' +
        '          <span class="fw-bold px-2 small">' + it.qty + '</span>' +
        '          <button type="button" data-sg-cart-qty="1" data-uid="' + esc(it.uid) + '">+</button>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="container py-3 sg-page-section">' +
      '  <div class="d-flex align-items-center justify-content-between mb-3">' +
      '    <div class="d-flex align-items-center gap-2">' +
      '      <button type="button" class="sg-icon-btn" data-sg-nav="home" aria-label="Volver"><i class="bi bi-chevron-left"></i></button>' +
      '      <div>' +
      '        <h1 class="h5 fw-bold mb-0">Mi carrito</h1>' +
      '        <small class="text-muted">' + totals.itemCount + ' productos seleccionados</small>' +
      '      </div>' +
      '    </div>' +
      '    <button type="button" id="sg-cart-clear-btn" class="btn btn-sm btn-outline-danger rounded-pill"><i class="bi bi-trash me-1"></i>Vaciar</button>' +
      '  </div>' +

      '  <div class="row g-4">' +
      '    <div class="col-12 col-lg-7">' + itemsHtml + '</div>' +
      '    <div class="col-12 col-lg-5">' +
      '      <div class="sg-card p-3 p-md-4">' +
      '        <h2 class="h6 fw-bold mb-3">Modalidad de entrega</h2>' +
      '        <div class="d-grid gap-2 mb-3">' +
      '          <label class="sg-payment-option ' + (totals.deliveryMode === 'delivery' ? 'active' : '') + '">' +
      '            <span class="d-flex align-items-center gap-2 small fw-semibold">' +
      '              <input type="radio" name="sgDeliveryMode" class="form-check-input mt-0" value="delivery" ' + (totals.deliveryMode === 'delivery' ? 'checked' : '') + '>' +
      '              <span><i class="bi bi-bicycle text-raspberry me-1"></i>Envío a domicilio</span>' +
      '            </span>' +
      '            <span class="small fw-bold">' + (totals.subtotal >= totals.freeShippingThreshold ? 'Gratis' : formatBs(5)) + '</span>' +
      '          </label>' +
      '          <label class="sg-payment-option ' + (totals.deliveryMode === 'pickup' ? 'active' : '') + '">' +
      '            <span class="d-flex align-items-center gap-2 small fw-semibold">' +
      '              <input type="radio" name="sgDeliveryMode" class="form-check-input mt-0" value="pickup" ' + (totals.deliveryMode === 'pickup' ? 'checked' : '') + '>' +
      '              <span><i class="bi bi-shop text-turquoise me-1"></i>Recoger en sucursal</span>' +
      '            </span>' +
      '            <span class="small fw-bold text-turquoise">Gratis</span>' +
      '          </label>' +
      '        </div>' +

      '        <div class="border-top pt-3 d-flex flex-column gap-2">' +
      '          <div class="d-flex justify-content-between small"><span class="text-secondary">Subtotal</span><span class="fw-semibold">' + formatBs(totals.subtotal) + '</span></div>' +
      '          <div class="d-flex justify-content-between small"><span class="text-secondary">Costo de envío</span><span class="fw-semibold">' + (totals.shipping === 0 ? 'Gratis (Bs. 0)' : formatBs(totals.shipping)) + '</span></div>' +
                (totals.deliveryMode === 'delivery' && totals.shipping > 0
                  ? '<div class="small text-turquoise"><i class="bi bi-info-circle me-1"></i>Envío gratis en pedidos desde ' + formatBs(totals.freeShippingThreshold) + '</div>'
                  : '') +
      '          <div class="d-flex justify-content-between fs-5 fw-bold border-top pt-2 mt-1">' +
      '            <span>Total</span><span class="text-raspberry">' + formatBs(totals.total) + '</span>' +
      '          </div>' +
      '        </div>' +

      '        <div class="d-grid gap-2 mt-4">' +
      '          <button type="button" class="btn btn-sg-primary py-2" data-sg-nav="checkout">Finalizar pedido <i class="bi bi-arrow-right ms-1"></i></button>' +
      '          <button type="button" class="btn btn-sg-secondary py-2" data-sg-nav="home">Continuar comprando</button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindCartEvents(rerender) {
    $('[data-sg-cart-qty]').on('click', function () {
      var delta = Number($(this).data('sg-cart-qty'));
      var uid = $(this).data('uid');
      window.SGCart.updateQty(uid, delta);
      rerender();
    });

    $('[data-sg-cart-remove]').on('click', function () {
      var uid = $(this).data('sg-cart-remove');
      window.SGCart.removeItem(uid);
      window.SGToast.show('Producto eliminado del carrito', 'teal');
      rerender();
    });

    $('#sg-cart-clear-btn').on('click', function () {
      window.SGCart.clearCart();
      window.SGToast.show('Carrito vaciado', 'teal');
      rerender();
    });

    $('input[name="sgDeliveryMode"]').on('change', function () {
      window.SGCart.setDeliveryMode($(this).val());
      rerender();
    });
  }

  function renderCheckout(catalog) {
    var totals = window.SGCart.computeTotals(catalog.brand);
    var profile = window.SGCart.getProfile();
    var esc = window.SGComponents.esc;
    var formatBs = window.SGComponents.formatBs;

    if (!totals.items.length) {
      return renderCart(catalog);
    }

    var payments = [
      { id: 'Efectivo', icon: 'bi-cash-stack', desc: 'Pago contra entrega o en caja' },
      { id: 'Tarjeta', icon: 'bi-credit-card-2-front', desc: 'Débito / Crédito (POS portátil)' },
      { id: 'QR', icon: 'bi-qr-code-scan', desc: 'Transferencia QR Simple Bolivia' },
      { id: 'Transferencia', icon: 'bi-bank', desc: 'Depósito o transferencia bancaria' }
    ];

    return (
      '<div class="container py-3 sg-page-section">' +
      '  <div class="d-flex align-items-center gap-2 mb-3">' +
      '    <button type="button" class="sg-icon-btn" data-sg-nav="cart" aria-label="Volver al carrito"><i class="bi bi-chevron-left"></i></button>' +
      '    <div>' +
      '      <h1 class="h5 fw-bold mb-0">Finalizar pedido</h1>' +
      '      <small class="text-muted">Completa tus datos para confirmar la entrega</small>' +
      '    </div>' +
      '  </div>' +

      '  <form id="sg-checkout-form" novalidate>' +
      '    <div class="row g-4">' +
      '      <div class="col-12 col-lg-7">' +
      '        <div class="sg-card p-3 p-md-4 mb-3">' +
      '          <h2 class="h6 fw-bold mb-3"><i class="bi bi-person-lines-fill text-raspberry me-2"></i>Datos de contacto y entrega</h2>' +

      '          <div class="mb-3">' +
      '            <label for="chk-name" class="form-label small fw-semibold">Nombre completo <span class="text-danger">*</span></label>' +
      '            <input type="text" id="chk-name" class="form-control rounded-3" placeholder="Ej: Sofía Vargas Mendoza" value="' + esc(profile.name) + '" required>' +
      '            <div class="invalid-feedback" id="err-chk-name">Ingresa tu nombre completo (mínimo 3 letras, solo letras y espacios).</div>' +
      '            <div class="valid-feedback">Nombre válido.</div>' +
      '          </div>' +

      '          <div class="mb-3">' +
      '            <label for="chk-phone" class="form-label small fw-semibold">Número de teléfono <span class="text-danger">*</span></label>' +
      '            <input type="tel" id="chk-phone" class="form-control rounded-3" placeholder="Ej: 71045520 o +591 71045520" value="' + esc(profile.phone) + '" required>' +
      '            <div class="invalid-feedback" id="err-chk-phone">Ingresa un número de teléfono válido (ej: 71045520 o +591 7XXXXXXX).</div>' +
      '            <div class="valid-feedback">Teléfono válido.</div>' +
      '          </div>' +

      '          <div class="mb-3">' +
      '            <label for="chk-address" class="form-label small fw-semibold">Dirección de entrega <span class="text-danger">*</span></label>' +
      '            <input type="text" id="chk-address" class="form-control rounded-3" placeholder="Ej: Av. San Martín #450, Barrio Equipetrol" value="' + esc(profile.address) + '" required>' +
      '            <div class="invalid-feedback" id="err-chk-address">Ingresa una dirección de entrega clara (mínimo 8 caracteres).</div>' +
      '            <div class="valid-feedback">Dirección válida.</div>' +
      '          </div>' +

      '          <div class="mb-3">' +
      '            <label for="chk-reference" class="form-label small fw-semibold">Referencia de ubicación</label>' +
      '            <input type="text" id="chk-reference" class="form-control rounded-3" placeholder="Ej: Portón blanco frente al parque, timbre 2" value="' + esc(profile.reference) + '">' +
      '            <div class="valid-feedback">Referencia registrada.</div>' +
      '          </div>' +

      '          <div class="mb-0">' +
      '            <label for="chk-notes" class="form-label small fw-semibold">Observaciones del pedido</label>' +
      '            <textarea id="chk-notes" class="form-control rounded-3" rows="2" placeholder="Indicaciones adicionales para tu entrega o presentación..."></textarea>' +
      '          </div>' +
      '        </div>' +

      '        <div class="sg-card p-3 p-md-4">' +
      '          <h2 class="h6 fw-bold mb-3"><i class="bi bi-wallet2 text-turquoise me-2"></i>Método de pago <span class="text-danger">*</span></h2>' +
      '          <div class="d-grid gap-2" id="sg-payment-group">' +
                   payments.map(function (pm) {
                     return (
                       '<label class="sg-payment-option">' +
                       '  <span class="d-flex align-items-center gap-3">' +
                       '    <input type="radio" name="chkPayment" value="' + esc(pm.id) + '" class="form-check-input mt-0">' +
                       '    <i class="bi ' + pm.icon + ' fs-5 text-raspberry"></i>' +
                       '    <span><strong class="d-block small">' + esc(pm.id) + '</strong><small class="text-muted">' + esc(pm.desc) + '</small></span>' +
                       '  </span>' +
                       '</label>'
                     );
                   }).join('') +
      '          </div>' +
      '          <div class="text-danger small mt-2 d-none" id="err-chk-payment"><i class="bi bi-exclamation-circle me-1"></i>Debes seleccionar un método de pago.</div>' +
      '        </div>' +
      '      </div>' +

      '      <div class="col-12 col-lg-5">' +
      '        <div class="sg-card p-3 p-md-4">' +
      '          <h2 class="h6 fw-bold mb-3">Resumen de tu compra</h2>' +
      '          <div class="d-flex flex-column gap-2 mb-3">' +
                   totals.items.map(function (it) {
                     return (
                       '<div class="d-flex justify-content-between small">' +
                       '  <span>' + it.qty + 'x ' + esc(it.name) + '</span>' +
                       '  <span class="fw-semibold">' + formatBs(it.unitPrice * it.qty) + '</span>' +
                       '</div>'
                     );
                   }).join('') +
      '          </div>' +
      '          <div class="border-top pt-2 d-flex flex-column gap-1 mb-3">' +
      '            <div class="d-flex justify-content-between small text-secondary"><span>Subtotal</span><span>' + formatBs(totals.subtotal) + '</span></div>' +
      '            <div class="d-flex justify-content-between small text-secondary"><span>Envío (' + (totals.deliveryMode === 'pickup' ? 'Retiro en tienda' : 'Delivery') + ')</span><span>' + formatBs(totals.shipping) + '</span></div>' +
      '            <div class="d-flex justify-content-between fs-5 fw-bold pt-2 border-top"><span>Total a pagar</span><span class="text-raspberry">' + formatBs(totals.total) + '</span></div>' +
      '          </div>' +

      '          <div class="form-check mb-3">' +
      '            <input class="form-check-input" type="checkbox" id="chk-terms" required>' +
      '            <label class="form-check-label small" for="chk-terms">Confirmo que los datos de entrega son correctos y acepto los términos del pedido.</label>' +
      '            <div class="invalid-feedback">Debes confirmar los datos para continuar.</div>' +
      '          </div>' +

      '          <button type="submit" class="btn btn-sg-primary w-100 py-2">' +
      '            <i class="bi bi-check2-circle me-2"></i>Realizar pedido' +
      '          </button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </form>' +
      '</div>'
    );
  }

  function validateField($el, validatorFn) {
    var val = ($el.val() || '').trim();
    var ok = validatorFn(val);
    $el.removeClass('is-valid is-invalid').addClass(ok ? 'is-valid' : 'is-invalid');
    return ok;
  }

  function validateName(val) {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'\s]{3,70}$/.test(val) && val.replace(/\s+/g, '').length >= 3;
  }

  function validatePhone(val) {
    var clean = val.replace(/[\s\-()]/g, '');
    return /^(\+?591)?[67]\d{7}$/.test(clean) || /^(\+?591)?[234]\d{6,7}$/.test(clean);
  }

  function validateAddress(val) {
    return val.length >= 8;
  }

  function bindCheckoutEvents(catalog, onOrderConfirmed) {
    var $name = $('#chk-name');
    var $phone = $('#chk-phone');
    var $address = $('#chk-address');
    var $ref = $('#chk-reference');
    var $terms = $('#chk-terms');

    $name.on('input blur', function () { validateField($name, validateName); });
    $phone.on('input blur', function () { validateField($phone, validatePhone); });
    $address.on('input blur', function () { validateField($address, validateAddress); });
    $ref.on('input', function () {
      if ($(this).val().trim().length >= 3) $(this).addClass('is-valid');
      else $(this).removeClass('is-valid');
    });

    $('input[name="chkPayment"]').on('change', function () {
      $('#sg-payment-group .sg-payment-option').removeClass('active');
      $(this).closest('.sg-payment-option').addClass('active');
      $('#err-chk-payment').addClass('d-none');
    });

    $terms.on('change', function () {
      $terms.removeClass('is-invalid is-valid').addClass($terms.is(':checked') ? 'is-valid' : 'is-invalid');
    });

    $('#sg-checkout-form').on('submit', function (ev) {
      ev.preventDefault();

      var okName = validateField($name, validateName);
      var okPhone = validateField($phone, validatePhone);
      var okAddr = validateField($address, validateAddress);
      var payment = $('input[name="chkPayment"]:checked').val();
      var okPay = Boolean(payment);
      var okTerms = $terms.is(':checked');

      if (!okPay) {
        $('#err-chk-payment').removeClass('d-none');
      }
      $terms.removeClass('is-invalid is-valid').addClass(okTerms ? 'is-valid' : 'is-invalid');

      if (!okName || !okPhone || !okAddr || !okPay || !okTerms) {
        window.SGToast.show('Revisa los campos marcados antes de enviar tu pedido.', 'danger');
        var firstErr = document.querySelector('#sg-checkout-form .is-invalid');
        if (firstErr) firstErr.focus();
        return;
      }

      var totals = window.SGCart.computeTotals(catalog.brand);
      var customerData = {
        name: $name.val().trim(),
        phone: $phone.val().trim(),
        address: $address.val().trim(),
        reference: $ref.val().trim()
      };

      // Guardar perfil del cliente automáticamente
      window.SGCart.saveProfile(customerData);

      var now = new Date();
      var pad = function (n) { return n < 10 ? '0' + n : String(n); };
      var dateStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
      var timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
      var orderId = 'SG2026-' + String(Math.floor(100 + Math.random() * 900));

      var newOrder = {
        id: orderId,
        date: dateStr,
        time: timeStr,
        customer: customerData,
        paymentMethod: payment,
        deliveryMode: totals.deliveryMode,
        shippingFee: totals.shipping,
        subtotal: totals.subtotal,
        total: totals.total,
        notes: $('#chk-notes').val().trim(),
        status: 'En preparación',
        branch: 'Sucursal Centro',
        items: totals.items.map(function (it) {
          return {
            productId: it.productId,
            name: it.name,
            size: it.size,
            qty: it.qty,
            unitPrice: it.unitPrice,
            flavors: it.flavors || [],
            extras: it.extras || []
          };
        })
      };

      // Persistir pedido + venta + cliente + inventario + bitácora en IndexedDB
      Promise.all([
        window.SGApi.getStoreList('orders'),
        window.SGApi.getStoreList('sales'),
        window.SGApi.getStoreList('customers')
      ]).then(function (results) {
        var orders = results[0] || [];
        var sales = results[1] || [];
        var customers = results[2] || [];

        orders.unshift(newOrder);
        sales.unshift({
          id: 'VTA-' + String(Date.now()).slice(-4),
          date: dateStr,
          time: timeStr,
          customer: customerData.name,
          method: payment,
          total: totals.total,
          branch: 'Sucursal Centro',
          cashier: 'Catálogo Web',
          summary: 'Pedido #' + orderId
        });

        var existingCust = customers.find(function (c) { return c.phone === customerData.phone; });
        if (existingCust) {
          existingCust.ordersCount = (existingCust.ordersCount || 0) + 1;
          existingCust.totalSpent = (existingCust.totalSpent || 0) + totals.total;
          existingCust.lastOrder = dateStr;
        } else {
          customers.unshift({
            id: 'cli-' + Date.now(),
            name: customerData.name,
            phone: customerData.phone,
            address: customerData.address,
            ordersCount: 1,
            totalSpent: totals.total,
            lastOrder: dateStr
          });
        }

        return Promise.all([
          window.SGApi.saveStoreList('orders', orders),
          window.SGApi.saveStoreList('sales', sales),
          window.SGApi.saveStoreList('customers', customers),
          window.SGEventLog.record('VENTA', 'Cliente realizó pedido #' + orderId + ' por Bs. ' + totals.total + ' (' + payment + ')', { user: customerData.name })
        ]);
      }).then(function () {
        window.SGCart.clearCart();
        onOrderConfirmed(newOrder);
      });
    });
  }

  function renderConfirmation(order) {
    var esc = window.SGComponents.esc;
    var formatBs = window.SGComponents.formatBs;
    if (!order) {
      return '<div class="container py-5 text-center"><button type="button" class="btn btn-sg-primary" data-sg-nav="home">Volver al inicio</button></div>';
    }

    return (
      '<div class="container py-4 sg-page-section">' +
      '  <div class="sg-card p-4 p-md-5 mx-auto text-center position-relative overflow-hidden" style="max-width:560px">' +
      '    <div class="sg-confirm-check mb-3"><i class="bi bi-check-lg"></i></div>' +
      '    <h1 class="h4 fw-bold mb-1">¡Pedido confirmado!</h1>' +
      '    <p class="text-secondary mb-2">' + (navigator.onLine === false
        ? 'Tu pedido quedó guardado en este dispositivo; la tienda aún no lo recibió porque estás sin conexión.'
        : 'Tu pedido quedó guardado en este dispositivo.') + '</p>' +
      '    <div class="badge rounded-pill bg-turquoise px-3 py-2 fs-6 mb-4">Número de pedido: #' + esc(order.id) + '</div>' +

      '    <div class="text-start border rounded-4 p-3 mb-4" style="background:var(--sg-bg-secondary)">' +
      '      <div class="small fw-bold text-uppercase text-muted mb-2">Resumen de tu compra</div>' +
             (order.items || []).map(function (it) {
               return '<div class="d-flex justify-content-between small mb-1"><span>' + it.qty + 'x ' + esc(it.name) + ' (' + esc(it.size) + ')</span><span class="fw-semibold">' + formatBs(it.unitPrice * it.qty) + '</span></div>';
             }).join('') +
      '      <hr class="my-2">' +
      '      <div class="d-flex justify-content-between small"><span>Envío</span><span>' + formatBs(order.shippingFee) + '</span></div>' +
      '      <div class="d-flex justify-content-between fw-bold fs-6 mt-1"><span>Total</span><span class="text-raspberry">' + formatBs(order.total) + '</span></div>' +
      '      <div class="small text-secondary mt-2"><i class="bi bi-geo-alt me-1 text-raspberry"></i>' + esc(order.customer.address) + ' · Pago: <strong>' + esc(order.paymentMethod) + '</strong></div>' +
      '    </div>' +

      '    <img src="assets/images/hero/splash-cone.jpg" alt="Gracias por tu preferencia" class="rounded-circle shadow-sm mb-2" style="width:86px;height:86px;object-fit:cover;">' +
      '    <p class="sg-script fs-4 text-turquoise mb-4">¡Gracias por tu preferencia!</p>' +

      '    <div class="d-flex flex-wrap justify-content-center gap-2">' +
      '      <button type="button" class="btn btn-sg-primary px-4" data-sg-nav="orders"><i class="bi bi-receipt me-1"></i>Ver mis pedidos</button>' +
      '      <button type="button" class="btn btn-sg-secondary px-4" data-sg-nav="home">Volver al catálogo</button>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  window.SGCartCheckout = {
    renderCart: renderCart,
    bindCartEvents: bindCartEvents,
    renderCheckout: renderCheckout,
    bindCheckoutEvents: bindCheckoutEvents,
    renderConfirmation: renderConfirmation
  };
})(window, window.jQuery);
