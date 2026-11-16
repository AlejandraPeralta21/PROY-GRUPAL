/**
 * SOLO GELATOS - Módulo del Carrito, Favoritos y Perfil de Cliente
 */
(function (window) {
  'use strict';

  var DEFAULT_PROFILE = {
    name: '',
    phone: '',
    address: '',
    reference: '',
    email: ''
  };

  function getCart() {
    var list = window.SGStorage.getLS('cart', []);
    return Array.isArray(list) ? list : [];
  }

  function saveCart(items) {
    window.SGStorage.setLS('cart', items);
    window.dispatchEvent(new CustomEvent('sg:cart-updated', { detail: { count: getItemCount(items) } }));
  }

  function getItemCount(items) {
    items = items || getCart();
    return items.reduce(function (sum, it) { return sum + (Number(it.qty) || 1); }, 0);
  }

  function buildSignature(item) {
    return [
      item.productId,
      item.size || '',
      (item.flavors || []).slice().sort().join(','),
      (item.extras || []).map(function (e) { return e.id; }).sort().join(','),
      (item.notes || '').trim()
    ].join('|');
  }

  function addItem(payload) {
    var items = getCart();
    var sig = buildSignature(payload);
    var existing = items.find(function (it) { return it.signature === sig; });
    if (existing) {
      existing.qty += Number(payload.qty) || 1;
    } else {
      items.push({
        uid: 'CI-' + Date.now() + '-' + Math.floor(Math.random() * 999),
        signature: sig,
        productId: payload.productId,
        name: payload.name,
        image: payload.image,
        size: payload.size || 'Estándar',
        unitPrice: Number(payload.unitPrice) || 0,
        qty: Number(payload.qty) || 1,
        flavors: payload.flavors || [],
        extras: payload.extras || [],
        notes: payload.notes || ''
      });
    }
    saveCart(items);
    if (window.SGEventLog) {
      window.SGEventLog.record('POS', 'Cliente agregó al carrito: ' + (payload.qty || 1) + 'x ' + payload.name + ' (' + (payload.size || 'Estándar') + ')');
    }
    return items;
  }

  function updateQty(uid, delta) {
    var items = getCart();
    var idx = items.findIndex(function (it) { return it.uid === uid; });
    if (idx === -1) return items;
    items[idx].qty += delta;
    if (items[idx].qty <= 0) {
      var removed = items.splice(idx, 1)[0];
      if (window.SGEventLog && removed) {
        window.SGEventLog.record('POS', 'Cliente eliminó del carrito: ' + removed.name);
      }
    }
    saveCart(items);
    return items;
  }

  function removeItem(uid) {
    var items = getCart();
    var removed = items.find(function (it) { return it.uid === uid; });
    var next = items.filter(function (it) { return it.uid !== uid; });
    saveCart(next);
    if (window.SGEventLog && removed) {
      window.SGEventLog.record('POS', 'Cliente eliminó del carrito: ' + removed.name);
    }
    return next;
  }

  function clearCart() {
    saveCart([]);
  }

  function getDeliveryMode() {
    return window.SGStorage.getLS('delivery_mode', 'delivery');
  }

  function setDeliveryMode(mode) {
    window.SGStorage.setLS('delivery_mode', mode === 'pickup' ? 'pickup' : 'delivery');
  }

  function computeTotals(brandConfig) {
    var items = getCart();
    var subtotal = items.reduce(function (sum, it) {
      return sum + (Number(it.unitPrice) * Number(it.qty));
    }, 0);
    var mode = getDeliveryMode();
    var baseFee = (brandConfig && typeof brandConfig.shippingFee === 'number') ? brandConfig.shippingFee : 5;
    var freeFrom = (brandConfig && typeof brandConfig.freeShippingThreshold === 'number') ? brandConfig.freeShippingThreshold : 100;

    var shipping = 0;
    if (items.length > 0 && mode === 'delivery') {
      shipping = subtotal >= freeFrom ? 0 : baseFee;
    }

    return {
      items: items,
      itemCount: getItemCount(items),
      subtotal: subtotal,
      shipping: shipping,
      freeShippingThreshold: freeFrom,
      deliveryMode: mode,
      total: subtotal + shipping
    };
  }

  function getFavorites() {
    var favs = window.SGStorage.getLS('favorites', []);
    return Array.isArray(favs) ? favs : [];
  }

  function toggleFavorite(productId, productName) {
    var favs = getFavorites();
    var idx = favs.indexOf(productId);
    var added = false;
    if (idx === -1) {
      favs.push(productId);
      added = true;
    } else {
      favs.splice(idx, 1);
    }
    window.SGStorage.setLS('favorites', favs);
    if (window.SGEventLog && productName) {
      window.SGEventLog.record('CLIENTE', (added ? 'Marcó como favorito: ' : 'Quitó de favoritos: ') + productName);
    }
    return { favorites: favs, added: added };
  }

  function isFavorite(productId) {
    return getFavorites().indexOf(productId) !== -1;
  }

  function getProfile() {
    var p = window.SGStorage.getLS('client_profile', null);
    return Object.assign({}, DEFAULT_PROFILE, p || {});
  }

  function saveProfile(profile) {
    var merged = Object.assign({}, DEFAULT_PROFILE, profile || {});
    window.SGStorage.setLS('client_profile', merged);
    if (window.SGEventLog && merged.name) {
      window.SGEventLog.record('CLIENTE', 'Cliente actualizó su perfil: ' + merged.name, { user: merged.name });
    }
    return merged;
  }

  window.SGCart = {
    getCart: getCart,
    getItemCount: getItemCount,
    addItem: addItem,
    updateQty: updateQty,
    removeItem: removeItem,
    clearCart: clearCart,
    getDeliveryMode: getDeliveryMode,
    setDeliveryMode: setDeliveryMode,
    computeTotals: computeTotals,
    getFavorites: getFavorites,
    toggleFavorite: toggleFavorite,
    isFavorite: isFavorite,
    getProfile: getProfile,
    saveProfile: saveProfile
  };
})(window);
