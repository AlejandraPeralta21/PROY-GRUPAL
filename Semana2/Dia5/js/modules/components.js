/**
 * SOLO GELATOS - Componentes Compartidos de Interfaz (Header, Drawer, BottomNav, Cards)
 */
(function (window) {
  'use strict';

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safeImageUrl(value) {
    var url = String(value || '').trim();
    if (!url) return '';
    var isHttp = /^https?:\/\//i.test(url);
    var isRelative = !/^[a-z][a-z0-9+.-]*:/i.test(url) && url.slice(0, 2) !== '//';
    return (isHttp || isRelative) ? esc(url) : '';
  }

  function formatBs(num) {
    return 'Bs. ' + Number(num || 0).toFixed(0);
  }

  function renderLogoImg(className, alt) {
    alt = alt || 'Solo Gelatos';
    return (
      '<img src="assets/brand/logo-solo-gelatos.png" alt="' + esc(alt) + '" class="logo-theme-light ' + esc(className) + '">' +
      '<img src="assets/brand/logo-solo-gelatos-dark.png" alt="' + esc(alt) + '" class="logo-theme-dark ' + esc(className) + '">'
    );
  }

  function renderHeader(activeRoute) {
    var count = window.SGCart.getItemCount();
    var isDark = window.SGTheme.getTheme() === 'dark';
    var navItems = [
      { route: 'home', label: 'Inicio' },
      { route: 'categories', label: 'Categorías' },
      { route: 'filters', label: 'Filtros' },
      { route: 'orders', label: 'Pedidos' },
      { route: 'profile', label: 'Perfil' }
    ];

    var navHtml = navItems.map(function (it) {
      return '<button type="button" class="sg-desktop-nav-link ' + (activeRoute === it.route ? 'active' : '') + '" data-sg-nav="' + it.route + '">' + it.label + '</button>';
    }).join('');

    return (
      '<header class="sg-header">' +
      '  <div class="container d-flex align-items-center justify-content-between gap-2">' +
      '    <div class="d-flex align-items-center gap-2">' +
      '      <button type="button" class="sg-icon-btn" data-bs-toggle="offcanvas" data-bs-target="#sgSideDrawer" aria-label="Abrir menú">' +
      '        <i class="bi bi-list"></i>' +
      '      </button>' +
      '      <a class="sg-header-brand" data-sg-nav="home" title="Solo Gelatos - Inicio">' +
              renderLogoImg('', 'Solo Gelatos') +
      '      </a>' +
      '    </div>' +
      '    <nav class="sg-desktop-nav" aria-label="Navegación principal">' +
            navHtml +
      '      <a href="admin.html" class="sg-desktop-nav-link text-decoration-none"><i class="bi bi-shield-lock me-1"></i>Admin</a>' +
      '    </nav>' +
      '    <div class="d-flex align-items-center gap-2">' +
      '      <span id="sg-network-status" class="sg-network-status" role="status" aria-live="polite"></span>' +
      '      <button type="button" class="sg-theme-pill" data-sg-theme-toggle aria-label="Cambiar tema">' +
      '        <i class="sg-theme-icon bi ' + (isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill') + '"></i>' +
      '        <span class="sg-theme-label d-none d-sm-inline">' + (isDark ? 'Modo Claro' : 'Modo Oscuro') + '</span>' +
      '      </button>' +
      '      <button type="button" id="sg-header-cart-btn" class="sg-icon-btn" data-sg-nav="cart" aria-label="Ver carrito">' +
      '        <i class="bi bi-bag-heart"></i>' +
      '        <span id="sg-cart-badge" class="sg-cart-badge ' + (count === 0 ? 'd-none' : '') + '">' + count + '</span>' +
      '      </button>' +
      '    </div>' +
      '  </div>' +
      '</header>'
    );
  }

  function renderBottomNav(activeRoute) {
    var items = [
      { route: 'home', icon: 'bi-house-door-fill', label: 'Inicio' },
      { route: 'categories', icon: 'bi-grid-fill', label: 'Categorías' },
      { route: 'orders', icon: 'bi-receipt-cutoff', label: 'Pedidos' },
      { route: 'profile', icon: 'bi-person-fill', label: 'Perfil' }
    ];
    return (
      '<nav class="sg-bottom-nav" aria-label="Navegación móvil">' +
        items.map(function (it) {
          var isAct = activeRoute === it.route;
          return (
            '<button type="button" class="sg-bottom-nav-item ' + (isAct ? 'active' : '') + '" data-sg-nav="' + it.route + '">' +
            '  <i class="bi ' + it.icon + '"></i>' +
            '  <span>' + it.label + '</span>' +
            '</button>'
          );
        }).join('') +
      '</nav>'
    );
  }

  function renderSideDrawer() {
    var isDark = window.SGTheme.getTheme() === 'dark';
    return (
      '<div class="offcanvas offcanvas-start" tabindex="-1" id="sgSideDrawer" aria-labelledby="sgSideDrawerLabel">' +
      '  <div class="offcanvas-header border-bottom">' +
      '    <div class="d-flex align-items-center gap-2" id="sgSideDrawerLabel">' +
            renderLogoImg('', 'Solo Gelatos') +
      '      <div><div class="fw-bold sg-display">SOLO GELATOS</div><small class="text-turquoise">El sabor que te hace feliz</small></div>' +
      '    </div>' +
      '    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>' +
      '  </div>' +
      '  <div class="offcanvas-body d-flex flex-column justify-content-between">' +
      '    <div class="list-group list-group-flush gap-1">' +
      '      <button class="list-group-item list-group-item-action bg-transparent border-0 rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-body" data-sg-nav="home" data-bs-dismiss="offcanvas"><i class="bi bi-house-door text-raspberry fs-5"></i>Inicio</button>' +
      '      <button class="list-group-item list-group-item-action bg-transparent border-0 rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-body" data-sg-nav="categories" data-bs-dismiss="offcanvas"><i class="bi bi-grid text-turquoise fs-5"></i>Categorías y Subcategorías</button>' +
      '      <button class="list-group-item list-group-item-action bg-transparent border-0 rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-body" data-sg-nav="filters" data-bs-dismiss="offcanvas"><i class="bi bi-sliders text-raspberry fs-5"></i>Filtros de Productos</button>' +
      '      <button class="list-group-item list-group-item-action bg-transparent border-0 rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-body" data-sg-nav="cart" data-bs-dismiss="offcanvas"><i class="bi bi-bag-heart text-turquoise fs-5"></i>Mi Carrito</button>' +
      '      <button class="list-group-item list-group-item-action bg-transparent border-0 rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-body" data-sg-nav="orders" data-bs-dismiss="offcanvas"><i class="bi bi-receipt text-raspberry fs-5"></i>Mis Pedidos</button>' +
      '      <button class="list-group-item list-group-item-action bg-transparent border-0 rounded-3 py-2 px-3 d-flex align-items-center gap-3 text-body" data-sg-nav="profile" data-bs-dismiss="offcanvas"><i class="bi bi-person-circle text-turquoise fs-5"></i>Mi Perfil</button>' +
      '      <hr class="my-2 opacity-25">' +
      '      <a href="admin.html" class="list-group-item list-group-item-action bg-transparent border-0 rounded-3 py-2 px-3 d-flex align-items-center gap-3 fw-semibold text-raspberry"><i class="bi bi-shield-lock-fill fs-5"></i>Panel Administrativo</a>' +
      '    </div>' +
      '    <div class="pt-3 border-top">' +
      '      <div class="d-flex align-items-center justify-content-between mb-3">' +
      '        <span class="small fw-semibold">Apariencia</span>' +
      '        <button type="button" class="sg-theme-pill" data-sg-theme-toggle>' +
      '          <i class="sg-theme-icon bi ' + (isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill') + '"></i>' +
      '          <span class="sg-theme-label">' + (isDark ? 'Modo Claro' : 'Modo Oscuro') + '</span>' +
      '        </button>' +
      '      </div>' +
      '      <div class="small text-muted d-flex flex-column gap-1">' +
      '        <span><i class="bi bi-instagram text-raspberry me-2"></i>@solo.gelatos</span>' +
      '        <span><i class="bi bi-facebook text-turquoise me-2"></i>Solo Gelatos</span>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function renderProductCard(product, categories) {
    var catObj = (categories || []).find(function (c) { return c.id === product.category; });
    var catName = catObj ? catObj.shortName || catObj.name : product.category;
    var fav = window.SGCart.isFavorite(product.id);
    return (
      '<div class="col-6 col-md-4 col-lg-3">' +
      '  <article class="sg-product-card" data-product-id="' + esc(product.id) + '">' +
      '    <div class="sg-product-thumb" data-sg-open-product="' + esc(product.id) + '">' +
      '      <img src="' + safeImageUrl(product.image) + '" alt="' + esc(product.name) + '" loading="lazy" decoding="async">' +
            (product.popular ? '<span class="sg-product-badge-pop"><i class="bi bi-star-fill me-1"></i>Popular</span>' : '') +
      '      <button type="button" class="sg-fav-float-btn" data-sg-fav="' + esc(product.id) + '" aria-label="Favorito">' +
      '        <i class="bi ' + (fav ? 'bi-heart-fill' : 'bi-heart') + '"></i>' +
      '      </button>' +
      '    </div>' +
      '    <div class="sg-product-body">' +
      '      <div class="sg-product-sub">' + esc(catName) + '</div>' +
      '      <h3 class="sg-product-title" data-sg-open-product="' + esc(product.id) + '">' + esc(product.name) + '</h3>' +
      '      <p class="sg-product-desc">' + esc(product.description) + '</p>' +
      '      <div class="sg-product-footer">' +
      '        <span class="sg-price">' + formatBs(product.price) + '</span>' +
      '        <button type="button" class="sg-add-circle-btn" data-sg-quick-add="' + esc(product.id) + '" aria-label="Agregar al carrito">' +
      '          <i class="bi bi-plus-lg"></i>' +
      '        </button>' +
      '      </div>' +
      '    </div>' +
      '  </article>' +
      '</div>'
    );
  }

  window.SGComponents = {
    esc: esc,
    safeImageUrl: safeImageUrl,
    formatBs: formatBs,
    renderLogoImg: renderLogoImg,
    renderHeader: renderHeader,
    renderBottomNav: renderBottomNav,
    renderSideDrawer: renderSideDrawer,
    renderProductCard: renderProductCard
  };
})(window);
