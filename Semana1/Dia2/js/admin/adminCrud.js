/**
 * SOLO GELATOS - Módulos CRUD y Operativos del Panel Administrativo
 * Cubre: Productos, Categorías, Inventario, Ingredientes, Proveedores, Compras,
 * Ventas, Pedidos, Clientes, Usuarios, Sucursales, Caja, Reportes y Configuración.
 */
(function (window, $) {
  'use strict';

  var reportChart = null;

  function esc(v) { return window.SGComponents.esc(v); }
  function bs(v) { return window.SGComponents.formatBs(v); }

  function stampNow() {
    var d = new Date();
    var p = function (n) { return n < 10 ? '0' + n : String(n); };
    return {
      date: d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()),
      time: p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
    };
  }

  function openModal(title, bodyHtml, onSubmit) {
    $('#sg-admin-modal-title').text(title);
    $('#sg-admin-modal-body').html(bodyHtml);
    var modalEl = document.getElementById('sgAdminModal');
    var modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    $('#sg-admin-modal-form').off('submit').on('submit', function (ev) {
      ev.preventDefault();
      if (onSubmit(modal) !== false) modal.hide();
    });
    modal.show();
  }

  /* ------------------------------------------------------------------------
     1. PRODUCTOS
     ------------------------------------------------------------------------ */
  function renderProductos(data) {
    var products = (data.catalog && data.catalog.products) ? data.catalog.products : [];
    var cats = (data.catalog && data.catalog.categories) ? data.catalog.categories : [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">' +
      '    <div><h2 class="h5 fw-bold mb-0">Productos del Catálogo</h2><small class="text-muted">Los cambios se reflejan en el catálogo del cliente</small></div>' +
      '    <button type="button" class="btn btn-sg-primary btn-sm" id="adm-new-product"><i class="bi bi-plus-lg me-1"></i>Nuevo Producto</button>' +
      '  </div>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Popular</th><th class="text-end">Acciones</th></tr></thead>' +
      '      <tbody>' +
             products.map(function (p) {
               var cat = cats.find(function (c) { return c.id === p.category; });
               return (
                 '<tr>' +
                 '  <td><div class="d-flex align-items-center gap-2"><img src="' + window.SGComponents.safeImageUrl(p.image) + '" alt="" class="sg-table-thumb" loading="lazy"><div><div class="fw-bold small">' + esc(p.name) + '</div><div class="small text-muted">' + esc(p.presentation || '') + '</div></div></div></td>' +
                 '  <td><span class="badge rounded-pill bg-turquoise">' + esc(cat ? cat.shortName : p.category) + '</span></td>' +
                 '  <td class="fw-bold text-raspberry">' + bs(p.price) + '</td>' +
                 '  <td>' + (p.stock || 0) + '</td>' +
                 '  <td>' + (p.popular ? '<i class="bi bi-star-fill text-warning"></i>' : '<i class="bi bi-star text-muted"></i>') + '</td>' +
                 '  <td class="text-end">' +
                 '    <button type="button" class="btn btn-sm btn-outline-primary me-1" data-adm-edit-prod="' + esc(p.id) + '" title="Editar"><i class="bi bi-pencil"></i></button>' +
                 '    <button type="button" class="btn btn-sm btn-outline-danger" data-adm-del-prod="' + esc(p.id) + '" title="Eliminar"><i class="bi bi-trash"></i></button>' +
                 '  </td>' +
                 '</tr>'
               );
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindProductos(data, session, rerender) {
    var cats = data.catalog.categories || [];
    $('#adm-new-product').on('click', function () {
      var html =
        '<div class="mb-3"><label class="form-label small fw-semibold">Nombre del producto *</label><input type="text" id="mp-name" class="form-control" required placeholder="Ej: Copa Tropical"></div>' +
        '<div class="row g-2 mb-3">' +
        '  <div class="col-6"><label class="form-label small fw-semibold">Categoría</label><select id="mp-cat" class="form-select">' +
             cats.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>'; }).join('') +
        '  </select></div>' +
        '  <div class="col-6"><label class="form-label small fw-semibold">Precio (Bs.) *</label><input type="number" id="mp-price" class="form-control" min="1" value="28" required></div>' +
        '</div>' +
        '<div class="row g-2 mb-3">' +
        '  <div class="col-6"><label class="form-label small fw-semibold">Stock inicial</label><input type="number" id="mp-stock" class="form-control" min="0" value="25"></div>' +
        '  <div class="col-6"><label class="form-label small fw-semibold">Presentación</label><input type="text" id="mp-pres" class="form-control" value="Copa de cristal"></div>' +
        '</div>' +
        '<div class="mb-3"><label class="form-label small fw-semibold">Descripción *</label><textarea id="mp-desc" class="form-control" rows="2" required>Deliciosa creación artesanal de Solo Gelatos.</textarea></div>' +
        '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="mp-pop" checked><label class="form-check-label small" for="mp-pop">Marcar como producto popular</label></div>';

      openModal('Crear Nuevo Producto', html, function () {
        var name = $('#mp-name').val().trim();
        var price = Number($('#mp-price').val());
        var catId = $('#mp-cat').val();
        var catObj = cats.find(function (c) { return c.id === catId; });
        var subId = (catObj && catObj.subcategories && catObj.subcategories[0]) ? catObj.subcategories[0].id : catId;
        var newProd = {
          id: 'sg-' + Date.now(),
          name: name,
          category: catId,
          subcategory: subId,
          price: price,
          description: $('#mp-desc').val().trim(),
          presentation: $('#mp-pres').val().trim() || 'Artesanal',
          flavorSlots: catId === 'helados' || catId === 'copas' ? 2 : 0,
          defaultFlavors: ['vainilla'],
          popular: $('#mp-pop').is(':checked'),
          featured: true,
          stock: Number($('#mp-stock').val()) || 20,
          sizes: [{ label: 'Estándar', price: price }],
          image: (catObj && catObj.image) ? catObj.image : 'assets/images/products/helado-triple.jpg'
        };
        data.catalog.products.unshift(newProd);
        window.SGApi.saveCatalog(data.catalog).then(function () {
          return window.SGEventLog.record('ADMIN', 'Administrador creó producto: ' + name + ' (Bs. ' + price + ')', { user: session.name, branch: session.branch });
        }).then(function () {
          window.SGToast.show('Producto creado y sincronizado con el catálogo', 'success');
          rerender();
        });
      });
    });

    $('[data-adm-edit-prod]').on('click', function () {
      var pid = $(this).data('adm-edit-prod');
      var prod = data.catalog.products.find(function (p) { return p.id === pid; });
      if (!prod) return;
      var oldPrice = prod.price;
      var html =
        '<div class="mb-3"><label class="form-label small fw-semibold">Nombre *</label><input type="text" id="ep-name" class="form-control" value="' + esc(prod.name) + '" required></div>' +
        '<div class="row g-2 mb-3">' +
        '  <div class="col-6"><label class="form-label small fw-semibold">Precio (Bs.) *</label><input type="number" id="ep-price" class="form-control" min="1" value="' + prod.price + '" required></div>' +
        '  <div class="col-6"><label class="form-label small fw-semibold">Stock</label><input type="number" id="ep-stock" class="form-control" min="0" value="' + (prod.stock || 0) + '"></div>' +
        '</div>' +
        '<div class="mb-3"><label class="form-label small fw-semibold">Descripción</label><textarea id="ep-desc" class="form-control" rows="2">' + esc(prod.description) + '</textarea></div>' +
        '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="ep-pop" ' + (prod.popular ? 'checked' : '') + '><label class="form-check-label small" for="ep-pop">Producto popular</label></div>';

      openModal('Editar Producto', html, function () {
        var newPrice = Number($('#ep-price').val());
        prod.name = $('#ep-name').val().trim();
        prod.price = newPrice;
        prod.stock = Number($('#ep-stock').val()) || 0;
        prod.description = $('#ep-desc').val().trim();
        prod.popular = $('#ep-pop').is(':checked');
        if (prod.sizes && prod.sizes[0]) prod.sizes[0].price = newPrice;

        var msg = oldPrice !== newPrice
          ? 'Administrador modificó precio de ' + prod.name + ': Bs. ' + oldPrice + ' → Bs. ' + newPrice
          : 'Administrador actualizó producto: ' + prod.name;

        window.SGApi.saveCatalog(data.catalog).then(function () {
          return window.SGEventLog.record('ADMIN', msg, { user: session.name, branch: session.branch });
        }).then(function () {
          window.SGToast.show('Producto actualizado', 'success');
          rerender();
        });
      });
    });

    $('[data-adm-del-prod]').on('click', function () {
      var pid = $(this).data('adm-del-prod');
      var prod = data.catalog.products.find(function (p) { return p.id === pid; });
      if (!prod) return;
      data.catalog.products = data.catalog.products.filter(function (p) { return p.id !== pid; });
      window.SGApi.saveCatalog(data.catalog).then(function () {
        return window.SGEventLog.record('ADMIN', 'Administrador eliminó producto: ' + prod.name, { user: session.name, branch: session.branch });
      }).then(function () {
        window.SGToast.show('Producto eliminado', 'teal');
        rerender();
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. CATEGORÍAS
     ------------------------------------------------------------------------ */
  function renderCategorias(data) {
    var cats = data.catalog.categories || [];
    var products = data.catalog.products || [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex justify-content-between align-items-center mb-3">' +
      '    <div><h2 class="h5 fw-bold mb-0">Categorías y Subcategorías</h2><small class="text-muted">Estructura organizativa del menú</small></div>' +
      '    <button type="button" class="btn btn-sg-primary btn-sm" id="adm-new-cat"><i class="bi bi-plus-lg me-1"></i>Nueva Categoría</button>' +
      '  </div>' +
      '  <div class="row g-3">' +
           cats.map(function (c) {
             var count = products.filter(function (p) { return p.category === c.id; }).length;
             return (
               '<div class="col-12 col-md-6">' +
               '  <div class="sg-card p-3 h-100">' +
               '    <div class="d-flex align-items-center gap-3 mb-2">' +
               '      <img src="' + window.SGComponents.safeImageUrl(c.image) + '" class="sg-table-thumb" alt="" loading="lazy">' +
               '      <div class="flex-grow-1"><h3 class="h6 fw-bold mb-0">' + esc(c.name) + '</h3><small class="text-muted">' + esc(c.description) + '</small></div>' +
               '      <span class="badge rounded-pill bg-raspberry">' + count + '</span>' +
               '    </div>' +
               '    <div class="d-flex flex-wrap gap-1">' +
                      (c.subcategories || []).map(function (s) {
                        return '<span class="badge rounded-pill border text-secondary">' + esc(s.name) + '</span>';
                      }).join('') +
               '    </div>' +
               '  </div>' +
               '</div>'
             );
           }).join('') +
      '  </div>' +
      '</div>'
    );
  }

  function bindCategorias(data, session, rerender) {
    $('#adm-new-cat').on('click', function () {
      var html =
        '<div class="mb-3"><label class="form-label small fw-semibold">Nombre de categoría *</label><input type="text" id="mc-name" class="form-control" required placeholder="Ej: Waffles Artesanales"></div>' +
        '<div class="mb-3"><label class="form-label small fw-semibold">Descripción</label><input type="text" id="mc-desc" class="form-control" value="Nueva línea de especialidad"></div>' +
        '<div class="mb-0"><label class="form-label small fw-semibold">Subcategorías (separadas por coma)</label><input type="text" id="mc-subs" class="form-control" value="Clásico, Especial"></div>';
      openModal('Nueva Categoría', html, function () {
        var name = $('#mc-name').val().trim();
        var id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        var subs = ($('#mc-subs').val() || '').split(',').map(function (s) {
          var t = s.trim();
          return t ? { id: t.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: t } : null;
        }).filter(Boolean);
        data.catalog.categories.push({
          id: id,
          name: name,
          shortName: name,
          description: $('#mc-desc').val().trim(),
          icon: 'bi-stars',
          tint: 'pink',
          image: 'assets/images/products/canasta-galleta.jpg',
          subcategories: subs
        });
        window.SGApi.saveCatalog(data.catalog).then(function () {
          return window.SGEventLog.record('ADMIN', 'Administrador creó categoría: ' + name, { user: session.name, branch: session.branch });
        }).then(function () {
          window.SGToast.show('Categoría agregada', 'success');
          rerender();
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. INVENTARIO DE PRODUCTOS
     ------------------------------------------------------------------------ */
  function renderInventario(data) {
    var products = data.catalog.products || [];
    return (
      '<div class="sg-page-section">' +
      '  <h2 class="h5 fw-bold mb-3">Inventario de Productos Terminados</h2>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Producto</th><th>Stock Actual</th><th>Estado</th><th class="text-end">Ajuste Rápido</th></tr></thead>' +
      '      <tbody>' +
             products.map(function (p) {
               var st = Number(p.stock || 0);
               var badge = st <= 10 ? '<span class="badge bg-danger">Stock bajo</span>' : '<span class="badge bg-success">Disponible</span>';
               return (
                 '<tr>' +
                 '  <td class="fw-semibold small">' + esc(p.name) + '</td>' +
                 '  <td class="fw-bold">' + st + ' uds</td>' +
                 '  <td>' + badge + '</td>' +
                 '  <td class="text-end">' +
                 '    <button class="btn btn-sm btn-outline-danger me-1" data-inv-adj="-5" data-id="' + esc(p.id) + '">-5</button>' +
                 '    <button class="btn btn-sm btn-outline-success" data-inv-adj="10" data-id="' + esc(p.id) + '">+10</button>' +
                 '  </td>' +
                 '</tr>'
               );
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindInventario(data, session, rerender) {
    $('[data-inv-adj]').on('click', function () {
      var pid = $(this).data('id');
      var delta = Number($(this).data('inv-adj'));
      var prod = data.catalog.products.find(function (p) { return p.id === pid; });
      if (!prod) return;
      prod.stock = Math.max(0, Number(prod.stock || 0) + delta);
      window.SGApi.saveCatalog(data.catalog).then(function () {
        return window.SGEventLog.record('ADMIN', 'Administrador actualizó inventario de ' + prod.name + ' (' + (delta > 0 ? '+' : '') + delta + ' → ' + prod.stock + ')', { user: session.name, branch: session.branch });
      }).then(rerender);
    });
  }

  /* ------------------------------------------------------------------------
     4. INGREDIENTES
     ------------------------------------------------------------------------ */
  function renderIngredientes(data) {
    var list = data.ingredients || [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex justify-content-between align-items-center mb-3">' +
      '    <h2 class="h5 fw-bold mb-0">Ingredientes e Insumos</h2>' +
      '    <button class="btn btn-sg-primary btn-sm" id="adm-new-ing"><i class="bi bi-plus-lg me-1"></i>Nuevo Ingrediente</button>' +
      '  </div>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Ingrediente</th><th>Stock</th><th>Mínimo</th><th>Costo Unit.</th><th>Proveedor</th><th>Estado</th></tr></thead>' +
      '      <tbody>' +
             list.map(function (ing) {
               var low = Number(ing.stock) <= Number(ing.minStock);
               return (
                 '<tr>' +
                 '  <td class="fw-bold small">' + esc(ing.name) + '</td>' +
                 '  <td>' + ing.stock + ' ' + esc(ing.unit) + '</td>' +
                 '  <td class="text-muted">' + ing.minStock + '</td>' +
                 '  <td class="text-raspberry fw-semibold">' + bs(ing.cost) + '</td>' +
                 '  <td class="small">' + esc(ing.supplier) + '</td>' +
                 '  <td>' + (low ? '<span class="badge bg-warning text-dark">Reabastecer</span>' : '<span class="badge bg-success">Óptimo</span>') + '</td>' +
                 '</tr>'
               );
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindIngredientes(data, session, rerender) {
    $('#adm-new-ing').on('click', function () {
      var html =
        '<div class="mb-3"><label class="form-label small fw-semibold">Nombre *</label><input id="mi-name" class="form-control" required></div>' +
        '<div class="row g-2 mb-3">' +
        '  <div class="col-4"><label class="form-label small fw-semibold">Unidad</label><input id="mi-unit" class="form-control" value="Kg"></div>' +
        '  <div class="col-4"><label class="form-label small fw-semibold">Stock</label><input id="mi-stock" type="number" class="form-control" value="20"></div>' +
        '  <div class="col-4"><label class="form-label small fw-semibold">Costo (Bs.)</label><input id="mi-cost" type="number" class="form-control" value="30"></div>' +
        '</div>' +
        '<div class="mb-0"><label class="form-label small fw-semibold">Proveedor</label><input id="mi-sup" class="form-control" value="Lácteos del Oriente"></div>';
      openModal('Agregar Ingrediente', html, function () {
        var name = $('#mi-name').val().trim();
        data.ingredients.unshift({
          id: 'ing-' + Date.now(),
          name: name,
          unit: $('#mi-unit').val().trim() || 'Kg',
          stock: Number($('#mi-stock').val()) || 0,
          minStock: 10,
          cost: Number($('#mi-cost').val()) || 0,
          supplier: $('#mi-sup').val().trim()
        });
        window.SGApi.saveStoreList('ingredients', data.ingredients).then(function () {
          return window.SGEventLog.record('ADMIN', 'Administrador registró ingrediente: ' + name, { user: session.name, branch: session.branch });
        }).then(rerender);
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. PROVEEDORES
     ------------------------------------------------------------------------ */
  function renderProveedores(data) {
    var list = data.suppliers || [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex justify-content-between align-items-center mb-3">' +
      '    <h2 class="h5 fw-bold mb-0">Proveedores</h2>' +
      '    <button class="btn btn-sg-primary btn-sm" id="adm-new-sup"><i class="bi bi-plus-lg me-1"></i>Nuevo Proveedor</button>' +
      '  </div>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Empresa</th><th>Rubro</th><th>Teléfono</th><th>Correo</th><th>Ciudad</th><th>Estado</th></tr></thead>' +
      '      <tbody>' +
             list.map(function (s) {
               return '<tr><td class="fw-bold small">' + esc(s.name) + '</td><td>' + esc(s.category) + '</td><td class="small">' + esc(s.phone) + '</td><td class="small">' + esc(s.email) + '</td><td>' + esc(s.city) + '</td><td><span class="badge bg-success">' + esc(s.status) + '</span></td></tr>';
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindProveedores(data, session, rerender) {
    $('#adm-new-sup').on('click', function () {
      var html =
        '<div class="mb-2"><label class="form-label small fw-semibold">Empresa *</label><input id="ms-name" class="form-control" required></div>' +
        '<div class="mb-2"><label class="form-label small fw-semibold">Rubro</label><input id="ms-cat" class="form-control" value="Insumos de Heladería"></div>' +
        '<div class="row g-2"><div class="col-6"><label class="form-label small fw-semibold">Teléfono</label><input id="ms-tel" class="form-control" value="+591 71000000"></div>' +
        '<div class="col-6"><label class="form-label small fw-semibold">Ciudad</label><input id="ms-city" class="form-control" value="Santa Cruz"></div></div>';
      openModal('Nuevo Proveedor', html, function () {
        var name = $('#ms-name').val().trim();
        data.suppliers.unshift({
          id: 'prov-' + Date.now(),
          name: name,
          category: $('#ms-cat').val().trim(),
          phone: $('#ms-tel').val().trim(),
          email: 'contacto@proveedor.bo',
          city: $('#ms-city').val().trim(),
          status: 'Activo'
        });
        window.SGApi.saveStoreList('suppliers', data.suppliers).then(function () {
          return window.SGEventLog.record('ADMIN', 'Administrador agregó proveedor: ' + name, { user: session.name, branch: session.branch });
        }).then(rerender);
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. COMPRAS (Reabastece ingredientes automáticamente)
     ------------------------------------------------------------------------ */
  function renderCompras(data) {
    var list = data.purchases || [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex justify-content-between align-items-center mb-3">' +
      '    <h2 class="h5 fw-bold mb-0">Compras e Ingresos de Insumos</h2>' +
      '    <button class="btn btn-sg-primary btn-sm" id="adm-new-buy"><i class="bi bi-cart-plus me-1"></i>Registrar Compra</button>' +
      '  </div>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>ID</th><th>Fecha</th><th>Proveedor</th><th>Insumo</th><th>Cantidad</th><th>Total</th><th>Sucursal</th></tr></thead>' +
      '      <tbody>' +
             list.map(function (c) {
               return '<tr><td class="fw-bold small">' + esc(c.id) + '</td><td class="small">' + esc(c.date) + '</td><td>' + esc(c.supplier) + '</td><td>' + esc(c.ingredientName) + '</td><td>' + c.qty + '</td><td class="fw-bold text-raspberry">' + bs(c.total) + '</td><td class="small">' + esc(c.branch) + '</td></tr>';
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindCompras(data, session, rerender) {
    $('#adm-new-buy').on('click', function () {
      var ings = data.ingredients || [];
      var sups = data.suppliers || [];
      var html =
        '<div class="mb-2"><label class="form-label small fw-semibold">Proveedor</label><select id="mb-sup" class="form-select">' +
        sups.map(function (s) { return '<option value="' + esc(s.name) + '">' + esc(s.name) + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="mb-2"><label class="form-label small fw-semibold">Ingrediente</label><select id="mb-ing" class="form-select">' +
        ings.map(function (i) { return '<option value="' + esc(i.id) + '">' + esc(i.name) + ' (' + esc(i.unit) + ')</option>'; }).join('') +
        '</select></div>' +
        '<div class="row g-2"><div class="col-6"><label class="form-label small fw-semibold">Cantidad</label><input type="number" id="mb-qty" class="form-control" min="1" value="15"></div>' +
        '<div class="col-6"><label class="form-label small fw-semibold">Total (Bs.)</label><input type="number" id="mb-tot" class="form-control" min="1" value="350"></div></div>';
      openModal('Registrar Compra de Insumos', html, function () {
        var ingId = $('#mb-ing').val();
        var ing = ings.find(function (i) { return i.id === ingId; });
        var qty = Number($('#mb-qty').val()) || 1;
        var total = Number($('#mb-tot').val()) || 0;
        var st = stampNow();
        if (ing) ing.stock = Number(ing.stock || 0) + qty;
        data.purchases.unshift({
          id: 'cmp-' + String(Date.now()).slice(-4),
          date: st.date,
          supplier: $('#mb-sup').val(),
          ingredientId: ingId,
          ingredientName: ing ? ing.name : 'Insumo',
          qty: qty,
          total: total,
          branch: session.branch,
          status: 'Recibida'
        });
        Promise.all([
          window.SGApi.saveStoreList('purchases', data.purchases),
          window.SGApi.saveStoreList('ingredients', data.ingredients),
          window.SGEventLog.record('ADMIN', 'Compra registrada: +' + qty + ' de ' + (ing ? ing.name : 'insumo') + ' (Bs. ' + total + ')', { user: session.name, branch: session.branch })
        ]).then(rerender);
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. VENTAS (POS & Historial)
     ------------------------------------------------------------------------ */
  function renderVentas(data) {
    var sales = data.sales || [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex justify-content-between align-items-center mb-3">' +
      '    <h2 class="h5 fw-bold mb-0">Registro de Ventas</h2>' +
      '    <button class="btn btn-sg-primary btn-sm" id="adm-new-sale"><i class="bi bi-plus-circle me-1"></i>Registrar Venta POS</button>' +
      '  </div>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>ID</th><th>Fecha y Hora</th><th>Cliente</th><th>Detalle</th><th>Pago</th><th>Sucursal</th><th>Total</th></tr></thead>' +
      '      <tbody>' +
             sales.map(function (v) {
               return '<tr><td class="fw-bold small">' + esc(v.id) + '</td><td class="small">' + esc(v.date) + ' ' + esc(v.time) + '</td><td>' + esc(v.customer) + '</td><td class="small">' + esc(v.summary) + '</td><td><span class="badge bg-turquoise">' + esc(v.method) + '</span></td><td class="small">' + esc(v.branch) + '</td><td class="fw-bold text-raspberry">' + bs(v.total) + '</td></tr>';
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindVentas(data, session, rerender) {
    $('#adm-new-sale').on('click', function () {
      var products = data.catalog.products || [];
      var html =
        '<div class="mb-2"><label class="form-label small fw-semibold">Producto principal</label><select id="mv-prod" class="form-select">' +
        products.map(function (p) { return '<option value="' + esc(p.id) + '" data-price="' + p.price + '">' + esc(p.name) + ' (' + bs(p.price) + ')</option>'; }).join('') +
        '</select></div>' +
        '<div class="row g-2 mb-2"><div class="col-6"><label class="form-label small fw-semibold">Cantidad</label><input type="number" id="mv-qty" class="form-control" min="1" value="1"></div>' +
        '<div class="col-6"><label class="form-label small fw-semibold">Método de pago</label><select id="mv-pay" class="form-select"><option>Efectivo</option><option>QR</option><option>Tarjeta</option><option>Transferencia</option></select></div></div>' +
        '<div class="mb-0"><label class="form-label small fw-semibold">Cliente</label><input type="text" id="mv-cli" class="form-control" value="Cliente Mostrador"></div>';

      openModal('Registrar Venta Rápida POS', html, function () {
        var pid = $('#mv-prod').val();
        var prod = products.find(function (p) { return p.id === pid; });
        var qty = Number($('#mv-qty').val()) || 1;
        var total = prod ? (Number(prod.price) * qty) : 0;
        var pay = $('#mv-pay').val();
        var st = stampNow();
        var saleId = 'VTA-' + String(Date.now()).slice(-4);

        data.sales.unshift({
          id: saleId,
          date: st.date,
          time: st.time,
          customer: $('#mv-cli').val().trim() || 'Cliente Mostrador',
          method: pay,
          total: total,
          branch: session.branch,
          cashier: session.name,
          summary: qty + 'x ' + (prod ? prod.name : 'Producto')
        });

        // Actualizar caja abierta si existe
        var openBox = (data.cashboxes || []).find(function (c) { return c.status === 'Abierta'; });
        if (openBox) {
          if (pay === 'Efectivo') openBox.cashSales = Number(openBox.cashSales || 0) + total;
          else openBox.qrCardSales = Number(openBox.qrCardSales || 0) + total;
        }

        Promise.all([
          window.SGApi.saveStoreList('sales', data.sales),
          window.SGApi.saveStoreList('cashboxes', data.cashboxes),
          window.SGEventLog.record('VENTA', 'Se registró venta POS ' + saleId + ' por ' + bs(total) + ' (' + pay + ')', { user: session.name, branch: session.branch })
        ]).then(function () {
          window.SGToast.show('Venta registrada en caja y bitácora', 'success');
          rerender();
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. PEDIDOS
     ------------------------------------------------------------------------ */
  function renderPedidos(data) {
    var orders = data.orders || [];
    var statuses = ['En preparación', 'En camino', 'Entregado', 'Cancelado'];
    return (
      '<div class="sg-page-section">' +
      '  <h2 class="h5 fw-bold mb-3">Gestión de Pedidos de Clientes</h2>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Pedido</th><th>Cliente</th><th>Entrega</th><th>Items</th><th>Total</th><th>Pago</th><th>Estado</th></tr></thead>' +
      '      <tbody>' +
             orders.map(function (o) {
               return (
                 '<tr>' +
                 '  <td class="fw-bold text-raspberry">#' + esc(o.id) + '<div class="small text-muted fw-normal">' + esc(o.date) + '</div></td>' +
                 '  <td><div class="fw-semibold small">' + esc(o.customer.name) + '</div><div class="small text-muted">' + esc(o.customer.phone) + '</div></td>' +
                 '  <td class="small">' + esc(o.customer.address) + '</td>' +
                 '  <td class="small">' + (o.items || []).map(function (i) { return i.qty + 'x ' + esc(i.name); }).join('<br>') + '</td>' +
                 '  <td class="fw-bold">' + bs(o.total) + '</td>' +
                 '  <td><span class="badge bg-turquoise">' + esc(o.paymentMethod) + '</span></td>' +
                 '  <td><select class="form-select form-select-sm sg-order-status" data-order-id="' + esc(o.id) + '">' +
                      statuses.map(function (st) { return '<option value="' + st + '" ' + (o.status === st ? 'selected' : '') + '>' + st + '</option>'; }).join('') +
                 '  </select></td>' +
                 '</tr>'
               );
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindPedidos(data, session) {
    $('.sg-order-status').on('change', function () {
      var oid = $(this).data('order-id');
      var nextStatus = $(this).val();
      var ord = data.orders.find(function (o) { return o.id === oid; });
      if (!ord) return;
      ord.status = nextStatus;
      window.SGApi.saveStoreList('orders', data.orders).then(function () {
        return window.SGEventLog.record('POS', 'Pedido #' + oid + ' actualizado a estado: ' + nextStatus, { user: session.name, branch: session.branch });
      }).then(function () {
        window.SGToast.show('Estado del pedido #' + oid + ' actualizado', 'success');
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. CLIENTES, USUARIOS, SUCURSALES (Tablas limpias y CRUD)
     ------------------------------------------------------------------------ */
  function renderClientes(data) {
    var list = data.customers || [];
    return (
      '<div class="sg-page-section">' +
      '  <h2 class="h5 fw-bold mb-3">Directorio de Clientes</h2>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Cliente</th><th>Teléfono</th><th>Dirección</th><th>Pedidos</th><th>Total Comprado</th><th>Último Pedido</th></tr></thead>' +
      '      <tbody>' +
             list.map(function (c) {
               return '<tr><td class="fw-bold small">' + esc(c.name) + '</td><td class="small">' + esc(c.phone) + '</td><td class="small">' + esc(c.address) + '</td><td><span class="badge rounded-pill bg-turquoise">' + c.ordersCount + '</span></td><td class="fw-bold text-raspberry">' + bs(c.totalSpent) + '</td><td class="small text-muted">' + esc(c.lastOrder) + '</td></tr>';
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function renderUsuarios(data) {
    var list = data.users || [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex justify-content-between align-items-center mb-3">' +
      '    <div><h2 class="h5 fw-bold mb-0">Usuarios del Sistema</h2><small class="text-muted">Las credenciales confidenciales están protegidas y nunca se muestran en bitácoras</small></div>' +
      '    <button class="btn btn-sg-primary btn-sm" id="adm-new-usr"><i class="bi bi-person-plus me-1"></i>Nuevo Usuario</button>' +
      '  </div>' +
      '  <div class="sg-card p-3 table-responsive">' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Sucursal</th><th>Estado</th></tr></thead>' +
      '      <tbody>' +
             list.map(function (u) {
               return '<tr><td class="fw-bold small">' + esc(u.name) + '</td><td class="small">' + esc(u.email) + '</td><td><span class="badge bg-raspberry">' + esc(u.role) + '</span></td><td class="small">' + esc(u.branch) + '</td><td><span class="badge bg-success">' + esc(u.status) + '</span></td></tr>';
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindUsuarios(data, session, rerender) {
    $('#adm-new-usr').on('click', function () {
      var html =
        '<div class="mb-2"><label class="form-label small fw-semibold">Nombre completo *</label><input id="mu-name" class="form-control" required></div>' +
        '<div class="mb-2"><label class="form-label small fw-semibold">Correo corporativo *</label><input type="email" id="mu-email" class="form-control" required></div>' +
        '<div class="row g-2"><div class="col-6"><label class="form-label small fw-semibold">Rol</label><select id="mu-role" class="form-select"><option>Cajero</option><option>Administrador</option><option>Supervisor</option><option>Repartidor</option></select></div>' +
        '<div class="col-6"><label class="form-label small fw-semibold">Sucursal</label><select id="mu-branch" class="form-select">' + (data.branches || []).map(function (b) { return '<option>' + esc(b.name) + '</option>'; }).join('') + '</select></div></div>';
      openModal('Registrar Nuevo Usuario', html, function () {
        var name = $('#mu-name').val().trim();
        var role = $('#mu-role').val();
        data.users.push({
          id: 'usr-' + Date.now(),
          name: name,
          email: $('#mu-email').val().trim(),
          role: role,
          branch: $('#mu-branch').val(),
          status: 'Activo',
          demoPin: 'Gelatos2026!'
        });
        window.SGApi.saveStoreList('users', data.users).then(function () {
          return window.SGEventLog.record('ADMIN', 'Administrador creó usuario ' + name + ' (Rol: ' + role + ')', { user: session.name, branch: session.branch });
        }).then(rerender);
      });
    });
  }

  function renderSucursales(data) {
    var list = data.branches || [];
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex justify-content-between align-items-center mb-3">' +
      '    <h2 class="h5 fw-bold mb-0">Sucursales Solo Gelatos</h2>' +
      '    <button class="btn btn-sg-primary btn-sm" id="adm-new-branch"><i class="bi bi-shop me-1"></i>Nueva Sucursal</button>' +
      '  </div>' +
      '  <div class="row g-3">' +
           list.map(function (b) {
             return (
               '<div class="col-12 col-md-4">' +
               '  <div class="sg-card p-3 h-100">' +
               '    <div class="d-flex justify-content-between align-items-center mb-2">' +
               '      <h3 class="h6 fw-bold mb-0 text-raspberry">' + esc(b.name) + '</h3>' +
               '      <span class="badge ' + (b.active ? 'bg-success' : 'bg-secondary') + '">' + (b.active ? 'Abierta' : 'Inactiva') + '</span>' +
               '    </div>' +
               '    <div class="small text-secondary mb-1"><i class="bi bi-geo-alt me-1 text-turquoise"></i>' + esc(b.address) + '</div>' +
               '    <div class="small text-secondary mb-1"><i class="bi bi-telephone me-1 text-turquoise"></i>' + esc(b.phone) + '</div>' +
               '    <div class="small text-secondary"><i class="bi bi-clock me-1 text-turquoise"></i>' + esc(b.hours) + ' · Enc: ' + esc(b.manager) + '</div>' +
               '  </div>' +
               '</div>'
             );
           }).join('') +
      '  </div>' +
      '</div>'
    );
  }

  function bindSucursales(data, session, rerender) {
    $('#adm-new-branch').on('click', function () {
      var html =
        '<div class="mb-2"><label class="form-label small fw-semibold">Nombre de sucursal *</label><input id="mb-name" class="form-control" required placeholder="Ej: Sucursal Urbarí"></div>' +
        '<div class="mb-2"><label class="form-label small fw-semibold">Dirección *</label><input id="mb-addr" class="form-control" required></div>' +
        '<div class="mb-0"><label class="form-label small fw-semibold">Encargado</label><input id="mb-mgr" class="form-control" value="' + esc(session.name) + '"></div>';
      openModal('Nueva Sucursal', html, function () {
        var name = $('#mb-name').val().trim();
        data.branches.push({
          id: 'suc-' + Date.now(),
          name: name,
          address: $('#mb-addr').val().trim(),
          phone: '+591 3 340-0000',
          manager: $('#mb-mgr').val().trim(),
          hours: '10:30 - 22:30',
          active: true
        });
        window.SGApi.saveStoreList('branches', data.branches).then(function () {
          return window.SGEventLog.record('ADMIN', 'Administrador registró sucursal: ' + name, { user: session.name, branch: name });
        }).then(rerender);
      });
    });
  }

  /* ------------------------------------------------------------------------
     10. CAJA (Apertura, Arqueo y Cierre en Vivo)
     ------------------------------------------------------------------------ */
  function renderCaja(data) {
    var boxes = data.cashboxes || [];
    var openBox = boxes.find(function (c) { return c.status === 'Abierta'; });
    var expectedCash = openBox ? Number(openBox.openingAmount) + Number(openBox.cashSales) : 0;

    return (
      '<div class="sg-page-section">' +
      '  <h2 class="h5 fw-bold mb-3">Control de Caja</h2>' +
      (openBox
        ? '<div class="sg-card p-3 p-md-4 mb-4 border-start border-4 border-success">' +
          '  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">' +
          '    <div><span class="badge bg-success mb-1">Caja Abierta</span><h3 class="h6 fw-bold mb-0">' + esc(openBox.id) + ' · ' + esc(openBox.branch) + '</h3><small class="text-muted">Cajero: ' + esc(openBox.cashier) + ' · Apertura: ' + esc(openBox.openedAt) + '</small></div>' +
          '    <button type="button" class="btn btn-sg-primary btn-sm" id="adm-close-box" data-box-id="' + esc(openBox.id) + '"><i class="bi bi-lock-fill me-1"></i>Cerrar Caja</button>' +
          '  </div>' +
          '  <div class="row g-3">' +
          '    <div class="col-6 col-md-3"><div class="p-2 rounded-3 border"><small class="text-muted d-block">Fondo inicial</small><strong class="fs-6">' + bs(openBox.openingAmount) + '</strong></div></div>' +
          '    <div class="col-6 col-md-3"><div class="p-2 rounded-3 border"><small class="text-muted d-block">Ventas Efectivo</small><strong class="fs-6 text-turquoise">' + bs(openBox.cashSales) + '</strong></div></div>' +
          '    <div class="col-6 col-md-3"><div class="p-2 rounded-3 border"><small class="text-muted d-block">Ventas QR/Tarjeta</small><strong class="fs-6 text-raspberry">' + bs(openBox.qrCardSales) + '</strong></div></div>' +
          '    <div class="col-6 col-md-3"><div class="p-2 rounded-3 border"><small class="text-muted d-block">Efectivo esperado</small><strong class="fs-6">' + bs(expectedCash) + '</strong></div></div>' +
          '  </div>' +
          '</div>'
        : '<div class="sg-card p-4 mb-4 text-center">' +
          '  <i class="bi bi-safe fs-1 text-turquoise"></i>' +
          '  <h3 class="h6 fw-bold mt-2">No hay una caja abierta actualmente</h3>' +
          '  <p class="small text-muted mb-3">Abre un turno de caja para registrar ventas y controlar efectivo.</p>' +
          '  <button type="button" class="btn btn-sg-primary" id="adm-open-box"><i class="bi bi-unlock-fill me-1"></i>Abrir Caja</button>' +
          '</div>') +

      '  <div class="sg-card p-3 table-responsive">' +
      '    <h3 class="h6 fw-bold mb-3">Historial de Cajas</h3>' +
      '    <table class="table table-hover align-middle mb-0">' +
      '      <thead><tr><th>Turno</th><th>Cajero</th><th>Sucursal</th><th>Apertura</th><th>Cierre</th><th>Efectivo</th><th>QR/Tarjeta</th><th>Estado</th></tr></thead>' +
      '      <tbody>' +
             boxes.map(function (b) {
               return '<tr><td class="fw-bold small">' + esc(b.id) + '</td><td class="small">' + esc(b.cashier) + '</td><td class="small">' + esc(b.branch) + '</td><td class="small">' + esc(b.openedAt) + '</td><td class="small">' + esc(b.closedAt || 'En curso') + '</td><td>' + bs(b.cashSales) + '</td><td>' + bs(b.qrCardSales) + '</td><td><span class="badge ' + (b.status === 'Abierta' ? 'bg-success' : 'bg-secondary') + '">' + esc(b.status) + '</span></td></tr>';
             }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindCaja(data, session, rerender) {
    $('#adm-open-box').on('click', function () {
      var html = '<div class="mb-0"><label class="form-label small fw-semibold">Fondo inicial en efectivo (Bs.)</label><input type="number" id="mc-float" class="form-control" min="0" value="500" required></div>';
      openModal('Abrir Turno de Caja', html, function () {
        var st = stampNow();
        var amt = Number($('#mc-float').val()) || 0;
        var box = {
          id: 'CAJA-' + st.date.replace(/-/g, '') + '-' + Math.floor(10 + Math.random() * 89),
          branch: session.branch,
          cashier: session.name,
          openedAt: st.date + ' ' + st.time,
          closedAt: null,
          openingAmount: amt,
          cashSales: 0,
          qrCardSales: 0,
          status: 'Abierta'
        };
        data.cashboxes.unshift(box);
        Promise.all([
          window.SGApi.saveStoreList('cashboxes', data.cashboxes),
          window.SGEventLog.record('CAJA', 'Cajero abrió caja ' + box.id + ' con fondo inicial de ' + bs(amt), { user: session.name, branch: session.branch })
        ]).then(rerender);
      });
    });

    $('#adm-close-box').on('click', function () {
      var boxId = $(this).data('box-id');
      var box = data.cashboxes.find(function (b) { return b.id === boxId; });
      if (!box) return;
      var expected = Number(box.openingAmount) + Number(box.cashSales);
      var html =
        '<p class="small text-secondary">Efectivo esperado en caja: <strong>' + bs(expected) + '</strong></p>' +
        '<div class="mb-0"><label class="form-label small fw-semibold">Efectivo contado al cierre (Bs.)</label><input type="number" id="mc-close-amt" class="form-control" value="' + expected + '" required></div>';
      openModal('Cerrar Caja ' + box.id, html, function () {
        var declared = Number($('#mc-close-amt').val()) || 0;
        var st = stampNow();
        box.closedAt = st.date + ' ' + st.time;
        box.closingDeclared = declared;
        box.status = 'Cerrada';
        var diff = declared - expected;
        Promise.all([
          window.SGApi.saveStoreList('cashboxes', data.cashboxes),
          window.SGEventLog.record('CAJA', 'Cajero cerró caja ' + box.id + ' (Declarado: ' + bs(declared) + ', Diferencia: ' + bs(diff) + ')', { user: session.name, branch: session.branch })
        ]).then(rerender);
      });
    });
  }

  /* ------------------------------------------------------------------------
     11. REPORTES & EXPORTACIÓN
     ------------------------------------------------------------------------ */
  function renderReportes(data) {
    var sales = data.sales || [];
    var totalRevenue = sales.reduce(function (s, v) { return s + Number(v.total || 0); }, 0);
    return (
      '<div class="sg-page-section">' +
      '  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">' +
      '    <h2 class="h5 fw-bold mb-0">Reportes Comerciales</h2>' +
      '    <div class="d-flex gap-2">' +
      '      <button type="button" class="btn btn-sm btn-sg-teal" id="rep-export-csv"><i class="bi bi-filetype-csv me-1"></i>Exportar CSV</button>' +
      '      <button type="button" class="btn btn-sm btn-sg-secondary" id="rep-export-json"><i class="bi bi-filetype-json me-1"></i>Exportar JSON</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="row g-3">' +
      '    <div class="col-12 col-lg-6">' +
      '      <div class="sg-card p-3 p-md-4">' +
      '        <h3 class="h6 fw-bold mb-3">Ingresos por Método de Pago</h3>' +
      '        <div class="sg-chart-box"><canvas id="chart-rep-methods"></canvas></div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="col-12 col-lg-6">' +
      '      <div class="sg-card p-3 p-md-4 h-100">' +
      '        <h3 class="h6 fw-bold mb-3">Resumen Ejecutivo</h3>' +
      '        <ul class="list-group list-group-flush">' +
      '          <li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>Total ventas acumuladas</span><strong class="text-raspberry">' + bs(totalRevenue) + '</strong></li>' +
      '          <li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>Transacciones registradas</span><strong>' + sales.length + '</strong></li>' +
      '          <li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>Pedidos de clientes</span><strong>' + (data.orders || []).length + '</strong></li>' +
      '          <li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>Eventos auditados en bitácora</span><strong>' + (data.events || []).length + '</strong></li>' +
      '        </ul>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindReportes(data, session) {
    if (reportChart) { reportChart.destroy(); reportChart = null; }
    var sales = data.sales || [];
    var byMethod = { Efectivo: 0, QR: 0, Tarjeta: 0, Transferencia: 0 };
    sales.forEach(function (s) {
      byMethod[s.method] = (byMethod[s.method] || 0) + Number(s.total || 0);
    });

    var ctx = document.getElementById('chart-rep-methods');
    if (ctx && typeof window.Chart !== 'undefined') {
      var isDark = window.SGTheme.getTheme() === 'dark';
      reportChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(byMethod),
          datasets: [{
            label: 'Ingresos (Bs.)',
            data: Object.values(byMethod),
            backgroundColor: ['#42B9A9', '#E92F70', '#F5A9BC', '#F5C99E'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: isDark ? '#CBD5E1' : '#5C6B7F' } },
            y: { ticks: { color: isDark ? '#CBD5E1' : '#5C6B7F' } }
          }
        }
      });
    }

    function downloadFile(filename, content, mime) {
      var blob = new Blob([content], { type: mime });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    $('#rep-export-csv').on('click', function () {
      var rows = [['ID', 'Fecha', 'Hora', 'Cliente', 'Metodo', 'Sucursal', 'Total']];
      sales.forEach(function (s) {
        rows.push([s.id, s.date, s.time, '"' + (s.customer || '') + '"', s.method, '"' + (s.branch || '') + '"', s.total]);
      });
      var csv = rows.map(function (r) { return r.join(','); }).join('\n');
      downloadFile('reporte-ventas-solo-gelatos.csv', csv, 'text/csv;charset=utf-8');
      window.SGEventLog.record('ADMIN', 'Administrador exportó reporte de ventas CSV', { user: session.name, branch: session.branch });
    });

    $('#rep-export-json').on('click', function () {
      downloadFile('reporte-solo-gelatos.json', JSON.stringify({ sales: sales, orders: data.orders }, null, 2), 'application/json');
      window.SGEventLog.record('ADMIN', 'Administrador exportó reporte JSON', { user: session.name, branch: session.branch });
    });
  }

  /* ------------------------------------------------------------------------
     12. CONFIGURACIÓN
     ------------------------------------------------------------------------ */
  function renderConfiguracion(data) {
    var cfg = data.settings || {};
    return (
      '<div class="sg-page-section">' +
      '  <h2 class="h5 fw-bold mb-3">Configuración del Sistema</h2>' +
      '  <div class="row g-3">' +
      '    <div class="col-12 col-lg-7">' +
      '      <form id="adm-config-form" class="sg-card p-3 p-md-4">' +
      '        <div class="mb-3"><label class="form-label small fw-semibold">Nombre comercial</label><input id="cfg-name" class="form-control" value="' + esc(cfg.storeName || 'SOLO GELATOS') + '"></div>' +
      '        <div class="mb-3"><label class="form-label small fw-semibold">Eslogan</label><input id="cfg-slogan" class="form-control" value="' + esc(cfg.slogan || 'El sabor que te hace feliz') + '"></div>' +
      '        <div class="row g-2 mb-3">' +
      '          <div class="col-6"><label class="form-label small fw-semibold">Costo envío (Bs.)</label><input type="number" id="cfg-ship" class="form-control" value="' + (cfg.shippingFee || 5) + '"></div>' +
      '          <div class="col-6"><label class="form-label small fw-semibold">Envío gratis desde (Bs.)</label><input type="number" id="cfg-free" class="form-control" value="' + (cfg.freeShippingFrom || 100) + '"></div>' +
      '        </div>' +
      '        <div class="mb-3"><label class="form-label small fw-semibold">Endpoint API Backend (Preparado)</label><input id="cfg-api" class="form-control" value="' + esc(cfg.apiBaseUrl || '') + '" readonly></div>' +
      '        <button type="submit" class="btn btn-sg-primary"><i class="bi bi-save me-1"></i>Guardar configuración</button>' +
      '      </form>' +
      '    </div>' +
      '    <div class="col-12 col-lg-5">' +
      '      <div class="sg-card p-3 p-md-4 mb-3">' +
      '        <h3 class="h6 fw-bold text-turquoise mb-2"><i class="bi bi-database-check me-2"></i>Modo de Almacenamiento</h3>' +
      '        <p class="small text-secondary mb-2">Esta aplicación opera con datos de demostración estructurados en <code>assets/data/*.json</code> consumidos vía <strong>AJAX (jQuery)</strong> y persistidos localmente en <strong>IndexedDB + LocalStorage</strong>.</p>' +
      '        <span class="badge rounded-pill bg-turquoise">Listo para integración REST API</span>' +
      '      </div>' +
      '      <div class="sg-card p-3 p-md-4 border-danger">' +
      '        <h3 class="h6 fw-bold text-danger mb-2">Restablecer datos de demostración</h3>' +
      '        <p class="small text-muted mb-3">Restaura catálogo, pedidos, caja y bitácora a su estado inicial de fábrica.</p>' +
      '        <button type="button" id="adm-reset-demo" class="btn btn-outline-danger btn-sm"><i class="bi bi-arrow-counterclockwise me-1"></i>Restablecer Demo</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function bindConfiguracion(data, session, rerender) {
    $('#adm-config-form').on('submit', function (ev) {
      ev.preventDefault();
      data.settings.storeName = $('#cfg-name').val().trim();
      data.settings.slogan = $('#cfg-slogan').val().trim();
      data.settings.shippingFee = Number($('#cfg-ship').val()) || 5;
      data.settings.freeShippingFrom = Number($('#cfg-free').val()) || 100;

      if (data.catalog && data.catalog.brand) {
        data.catalog.brand.shippingFee = data.settings.shippingFee;
        data.catalog.brand.freeShippingThreshold = data.settings.freeShippingFrom;
      }

      Promise.all([
        window.SGApi.saveSettings(data.settings),
        window.SGApi.saveCatalog(data.catalog),
        window.SGEventLog.record('ADMIN', 'Administrador actualizó configuración del sistema', { user: session.name, branch: session.branch })
      ]).then(function () {
        window.SGToast.show('Configuración guardada', 'success');
      });
    });

    $('#adm-reset-demo').on('click', function () {
      window.SGApi.resetDemoData().then(function () {
        window.SGToast.show('Datos de demostración restablecidos', 'teal');
        rerender(true);
      });
    });
  }

  window.SGAdminCrud = {
    renderProductos: renderProductos,
    bindProductos: bindProductos,
    renderCategorias: renderCategorias,
    bindCategorias: bindCategorias,
    renderInventario: renderInventario,
    bindInventario: bindInventario,
    renderIngredientes: renderIngredientes,
    bindIngredientes: bindIngredientes,
    renderProveedores: renderProveedores,
    bindProveedores: bindProveedores,
    renderCompras: renderCompras,
    bindCompras: bindCompras,
    renderVentas: renderVentas,
    bindVentas: bindVentas,
    renderPedidos: renderPedidos,
    bindPedidos: bindPedidos,
    renderClientes: renderClientes,
    renderUsuarios: renderUsuarios,
    bindUsuarios: bindUsuarios,
    renderSucursales: renderSucursales,
    bindSucursales: bindSucursales,
    renderCaja: renderCaja,
    bindCaja: bindCaja,
    renderReportes: renderReportes,
    bindReportes: bindReportes,
    renderConfiguracion: renderConfiguracion,
    bindConfiguracion: bindConfiguracion
  };
})(window, window.jQuery);
