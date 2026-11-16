/**
 * SOLO GELATOS - Controlador Principal y Enrutador de la Aplicación Cliente
 */
(function (window, $) {
  'use strict';

  var state = {
    route: 'home',
    history: [],
    catalog: null,
    orders: [],
    searchQuery: '',
    selectedCat: 'todos',
    selectedSub: 'all',
    selectedProductId: null,
    productDraft: {},
    filters: null,
    lastOrder: null
  };
  var unsubscribeStorageSync = null;

  function renderChrome() {
    var activeNav = state.route;
    if (activeNav === 'product' || activeNav === 'filters' || activeNav === 'cart' || activeNav === 'checkout' || activeNav === 'confirmation') {
      activeNav = state.route === 'cart' || state.route === 'checkout' ? 'orders' : 'home';
    }
    $('#sg-header-root').html(window.SGComponents.renderHeader(activeNav));
    updateNetworkStatus();
    $('#sg-bottom-nav-root').html(window.SGComponents.renderBottomNav(activeNav));
    if (!$('#sgSideDrawer').length) {
      $('#sg-drawer-root').html(window.SGComponents.renderSideDrawer());
    }
    window.SGTheme.updateThemeButtons(window.SGTheme.getTheme());
  }

  function updateNetworkStatus() {
    var online = navigator.onLine !== false;
    var $status = $('#sg-network-status');
    $status.toggleClass('is-offline', !online)
      .text(online ? 'En línea' : 'Sin conexión')
      .attr('aria-label', online ? 'Con conexión a internet' : 'Sin conexión; la app conserva los datos localmente');
  }

  function updateCartBadge() {
    var count = window.SGCart.getItemCount();
    var $badge = $('#sg-cart-badge');
    $badge.text(count);
    if (count > 0) $badge.removeClass('d-none');
    else $badge.addClass('d-none');
  }

  function renderRoute(preserveFocus) {
    if (!state.catalog) return;
    renderChrome();

    var $main = $('#sg-page-root');
    var focusId = preserveFocus ? (document.activeElement && document.activeElement.id) : null;
    var caretPos = preserveFocus && document.activeElement && typeof document.activeElement.selectionStart === 'number'
      ? document.activeElement.selectionStart : null;

    if (state.route === 'home') {
      $main.html(window.SGHomeCatalog.render(state.catalog, state.searchQuery));
      window.SGHomeCatalog.bindEvents(state.catalog, state, function (keepFocus) { renderRoute(keepFocus); });
      if (focusId === 'sg-home-search') {
        var el = document.getElementById('sg-home-search');
        if (el) {
          el.focus();
          if (caretPos !== null && el.setSelectionRange) {
            try { el.setSelectionRange(caretPos, caretPos); } catch (e) {}
          }
        }
      }
    } else if (state.route === 'categories') {
      $main.html(window.SGCategoriesPage.render(state.catalog, state.selectedCat, state.selectedSub));
      window.SGCategoriesPage.bindEvents(state, function () { renderRoute(false); });
    } else if (state.route === 'filters') {
      $main.html(window.SGFiltersPage.render(state.catalog, state.filters));
      window.SGFiltersPage.bindEvents(state.catalog, state, function () { renderRoute(false); });
    } else if (state.route === 'product') {
      $main.html(window.SGProductDetail.render(state.catalog, state.selectedProductId, state.productDraft));
      window.SGProductDetail.bindEvents(state.catalog, state.selectedProductId, state.productDraft, function () { renderRoute(false); });
    } else if (state.route === 'cart') {
      $main.html(window.SGCartCheckout.renderCart(state.catalog));
      window.SGCartCheckout.bindCartEvents(function () { renderRoute(false); });
    } else if (state.route === 'checkout') {
      $main.html(window.SGCartCheckout.renderCheckout(state.catalog));
      window.SGCartCheckout.bindCheckoutEvents(state.catalog, function (confirmedOrder) {
        state.lastOrder = confirmedOrder;
        window.SGApi.getStoreList('orders').then(function (orders) {
          state.orders = orders;
          navigate('confirmation');
        });
      });
    } else if (state.route === 'confirmation') {
      $main.html(window.SGCartCheckout.renderConfirmation(state.lastOrder));
    } else if (state.route === 'orders') {
      window.SGApi.getStoreList('orders').then(function (orders) {
        state.orders = orders;
        $main.html(window.SGOrdersProfile.renderOrders(orders));
      });
    } else if (state.route === 'profile') {
      $main.html(window.SGOrdersProfile.renderProfile(state.catalog));
      window.SGOrdersProfile.bindProfileEvents(function () { renderRoute(false); });
    }

    if (!preserveFocus) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function navigate(route, params) {
    if (window.SGHomeCatalog && window.SGHomeCatalog.cancelPendingSearch) {
      window.SGHomeCatalog.cancelPendingSearch();
    }
    params = params || {};
    if (state.route && state.route !== route) {
      state.history.push({ route: state.route, selectedCat: state.selectedCat, selectedSub: state.selectedSub });
      if (state.history.length > 20) state.history.shift();
    }
    state.route = route;

    if (typeof params.category !== 'undefined') state.selectedCat = params.category;
    if (typeof params.subcategory !== 'undefined') state.selectedSub = params.subcategory;
    if (typeof params.productId !== 'undefined') {
      state.selectedProductId = params.productId;
      state.productDraft = { sizeIdx: 0, qty: 1, extras: [], notes: '' };
      var prod = (state.catalog.products || []).find(function (p) { return p.id === params.productId; });
      if (prod) {
        state.productDraft.flavors = prod.defaultFlavors ? prod.defaultFlavors.slice() : [];
        window.SGEventLog.record('POS', 'Cliente seleccionó el producto: ' + prod.name);
      }
    }
    renderRoute(false);
  }

  function goBack() {
    var prev = state.history.pop();
    if (prev) {
      state.route = prev.route;
      state.selectedCat = prev.selectedCat;
      state.selectedSub = prev.selectedSub;
    } else {
      state.route = 'home';
    }
    renderRoute(false);
  }

  function bindGlobalEvents() {
    var $doc = $(document);

    $doc.off('.sgApp');

    $doc.on('click.sgApp', '[data-sg-nav]', function (ev) {
      ev.preventDefault();
      var target = $(this).data('sg-nav');
      navigate(target);
    });

    $doc.on('click.sgApp', '[data-sg-open-product]', function (ev) {
      ev.stopPropagation();
      var pid = $(this).data('sg-open-product');
      navigate('product', { productId: pid });
    });

    $doc.on('click.sgApp', '[data-sg-quick-add]', function (ev) {
      ev.stopPropagation();
      var pid = $(this).data('sg-quick-add');
      var prod = (state.catalog.products || []).find(function (p) { return p.id === pid; });
      if (!prod) return;

      var defaultSize = (prod.sizes && prod.sizes[0]) ? prod.sizes[0] : { label: 'Estándar', price: prod.price };
      var flavorNames = (prod.defaultFlavors || []).map(function (fid) {
        var f = (state.catalog.flavors || []).find(function (fl) { return fl.id === fid; });
        return f ? f.name : fid;
      });

      window.SGCart.addItem({
        productId: prod.id,
        name: prod.name,
        image: prod.image,
        size: defaultSize.label,
        unitPrice: defaultSize.price,
        qty: 1,
        flavors: flavorNames,
        extras: [],
        notes: ''
      });
      window.SGToast.flyToCart(this);
      window.SGToast.show('¡' + prod.name + ' agregado al carrito!', 'pink');
    });

    $doc.on('click.sgApp', '[data-sg-fav]', function (ev) {
      ev.stopPropagation();
      var pid = $(this).data('sg-fav');
      var prod = (state.catalog.products || []).find(function (p) { return p.id === pid; });
      var res = window.SGCart.toggleFavorite(pid, prod ? prod.name : pid);
      var $icon = $(this).find('i');
      $icon.toggleClass('bi-heart-fill', res.added).toggleClass('bi-heart', !res.added);
      window.SGToast.show(res.added ? 'Añadido a tus favoritos' : 'Quitado de favoritos', 'teal');
    });

    $doc.on('click.sgApp', '[data-sg-theme-toggle]', function () {
      window.SGTheme.toggleTheme();
    });

    window.removeEventListener('online', updateNetworkStatus);
    window.removeEventListener('offline', updateNetworkStatus);
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    window.removeEventListener('sg:cart-updated', updateCartBadge);
    window.addEventListener('sg:cart-updated', updateCartBadge);

    // Sincronizar cambios realizados desde el Panel Administrativo en tiempo real
    if (unsubscribeStorageSync) unsubscribeStorageSync();
    unsubscribeStorageSync = window.SGStorage.onSync(function (msg) {
      if (!msg) return;
      if (msg.store === 'catalog') {
        window.SGApi.loadCatalog().then(function (cat) {
          state.catalog = cat;
          if ($('#sg-stage-root').is(':empty')) {
            renderRoute(false);
          }
        });
      } else if (msg.store === 'orders' && state.route === 'orders') {
        renderRoute(false);
      }
    });
  }

  function init() {
    state.filters = window.SGFiltersPage.defaultFilters();
    bindGlobalEvents();

    // Cargar catálogo & semilla administrativa mediante AJAX/JSON + IndexedDB
    Promise.all([
      window.SGApi.loadCatalog(),
      window.SGApi.ensureAdminSeeded()
    ]).then(function (res) {
      state.catalog = res[0];

      // Si llega explícitamente desde admin con #catalog-home, omitir splash si desea; si no, mostrar flujo completo
      if (window.location.hash === '#catalog-home') {
        window.location.hash = '';
        renderRoute(false);
        return;
      }

      window.SGSplashWelcome.showSplash(function () {
        window.SGSplashWelcome.showWelcome(function () {
          renderRoute(false);
        });
      });
    });
  }

  window.SGApp = {
    navigate: navigate,
    goBack: goBack,
    renderRoute: renderRoute
  };

  $(document).ready(init);
})(window, window.jQuery);
