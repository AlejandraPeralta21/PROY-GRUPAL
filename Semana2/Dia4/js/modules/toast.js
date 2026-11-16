/**
 * SOLO GELATOS - Módulo de Notificaciones Toast y Microinteracciones
 */
(function (window, $) {
  'use strict';

  function show(message, variant) {
    variant = variant || 'pink';
    var $container = $('#sg-toast-container');
    if (!$container.length) {
      $container = $('<div id="sg-toast-container" class="sg-toast-container" aria-live="polite"></div>');
      $('body').append($container);
    }

    var iconMap = {
      pink: 'bi-heart-fill text-raspberry',
      teal: 'bi-stars text-turquoise',
      success: 'bi-check-circle-fill text-success',
      danger: 'bi-exclamation-triangle-fill text-danger'
    };
    var cls = variant === 'teal' ? 'toast-teal' : (variant === 'success' ? 'toast-success' : (variant === 'danger' ? 'toast-danger' : ''));
    var $item = $('<div class="sg-toast-item ' + cls + '"><i class="bi ' + (iconMap[variant] || iconMap.pink) + '"></i><span></span></div>');
    $item.find('span').text(message);
    $item.hide().appendTo($container).slideDown(220);

    setTimeout(function () {
      $item.fadeOut(240, function () { $(this).remove(); });
    }, 3000);
  }

  function flyToCart(originEl) {
    if (!originEl) return;
    var cartEl = document.getElementById('sg-header-cart-btn');
    if (!cartEl) return;

    var startRect = originEl.getBoundingClientRect();
    var endRect = cartEl.getBoundingClientRect();

    var dot = document.createElement('div');
    dot.className = 'sg-fly-dot';
    var icon = document.createElement('i');
    icon.className = 'bi bi-bag-heart-fill';
    icon.setAttribute('aria-hidden', 'true');
    dot.appendChild(icon);
    dot.style.left = (startRect.left + startRect.width / 2 - 12) + 'px';
    dot.style.top = (startRect.top + startRect.height / 2 - 12) + 'px';
    document.body.appendChild(dot);

    requestAnimationFrame(function () {
      var dx = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
      var dy = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);
      dot.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(0.4)';
      dot.style.opacity = '0.2';
    });

    setTimeout(function () {
      if (dot.parentNode) dot.parentNode.removeChild(dot);
      var badge = document.getElementById('sg-cart-badge');
      if (badge) {
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
      }
    }, 520);
  }

  window.SGToast = {
    show: show,
    flyToCart: flyToCart
  };
})(window, window.jQuery);
