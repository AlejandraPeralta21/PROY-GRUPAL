/**
 * SOLO GELATOS - Pantalla de Carga Animada (Splash) y Pantalla de Bienvenida
 */
(function (window, $) {
  'use strict';

  function renderDecoStage() {
    return (
      '<div class="sg-blob sg-blob-pink-tl"></div>' +
      '<div class="sg-blob sg-blob-teal-tr"></div>' +
      '<div class="sg-blob sg-blob-pink-br"></div>' +
      '<div class="sg-blob sg-blob-teal-bl"></div>' +
      '<div class="sg-sparkle-layer" aria-hidden="true">' +
      '  <i class="bi bi-heart-fill sg-deco sg-deco-heart" style="top:14%; left:14%; font-size:1.1rem; animation-delay:0s"></i>' +
      '  <i class="bi bi-stars sg-deco sg-deco-star" style="top:18%; right:16%; font-size:1.25rem; animation-delay:0.4s"></i>' +
      '  <i class="bi bi-star-fill sg-deco sg-deco-spark" style="top:42%; left:9%; font-size:0.85rem; animation-delay:0.8s"></i>' +
      '  <i class="bi bi-heart sg-deco sg-deco-heart" style="top:48%; right:11%; font-size:1rem; animation-delay:1.1s"></i>' +
      '  <i class="bi bi-stars sg-deco sg-deco-star" style="bottom:20%; left:18%; font-size:1.15rem; animation-delay:0.6s"></i>' +
      '  <i class="bi bi-heart-fill sg-deco sg-deco-heart" style="bottom:16%; right:18%; font-size:0.95rem; animation-delay:1.3s"></i>' +
      '</div>'
    );
  }

  function showSplash(onFinished) {
    var $stage = $('#sg-stage-root');
    $stage.html(
      '<div class="sg-fullscreen-stage" id="sg-splash-stage">' +
        renderDecoStage() +
      '  <div class="sg-stage-card">' +
      '    <div class="sg-splash-logo">' + window.SGComponents.renderLogoImg('w-100 h-auto', 'SOLO GELATOS') + '</div>' +
      '    <div class="sg-splash-cone-wrap">' +
      '      <img src="assets/images/hero/splash-cone.jpg" alt="Cono artesanal Solo Gelatos" class="sg-splash-cone-img">' +
      '    </div>' +
      '    <div class="sg-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
      '      <div class="sg-progress-fill" id="sg-splash-bar"></div>' +
      '    </div>' +
      '    <p class="mb-0 fw-semibold text-secondary small" id="sg-splash-text">Preparando algo delicioso...</p>' +
      '    <button type="button" class="btn btn-link btn-sm text-muted text-decoration-none mt-1" id="sg-splash-skip">Saltar introducción</button>' +
      '  </div>' +
      '</div>'
    );

    var progress = 0;
    var done = false;
    var messages = [
      { at: 0, text: 'Preparando algo delicioso...' },
      { at: 45, text: 'Enfriando los sabores artesanales...' },
      { at: 80, text: '¡Casi listo para disfrutar!' }
    ];

    function finishSplash() {
      if (done) return;
      done = true;
      clearInterval(timer);
      $('#sg-splash-stage').addClass('is-leaving');
      setTimeout(function () {
        if (typeof onFinished === 'function') onFinished();
      }, 360);
    }

    var timer = setInterval(function () {
      progress += 4;
      if (progress > 100) progress = 100;
      $('#sg-splash-bar').css('width', progress + '%');
      $('.sg-progress-track').attr('aria-valuenow', progress);
      messages.forEach(function (m) {
        if (progress >= m.at) $('#sg-splash-text').text(m.text);
      });
      if (progress >= 100) {
        setTimeout(finishSplash, 220);
      }
    }, 55); // ~1.4s elegante y ágil

    $('#sg-splash-skip').on('click', finishSplash);
  }

  function showWelcome(onStart) {
    var $stage = $('#sg-stage-root');
    $stage.html(
      '<div class="sg-fullscreen-stage" id="sg-welcome-stage">' +
        renderDecoStage() +
      '  <div class="sg-stage-card">' +
      '    <div style="width:128px">' + window.SGComponents.renderLogoImg('w-100 h-auto', 'SOLO GELATOS') + '</div>' +
      '    <div class="mt-1">' +
      '      <div class="text-secondary fw-semibold small mb-1">Bienvenido a</div>' +
      '      <h1 class="sg-welcome-title sg-script">Solo Gelatos</h1>' +
      '      <p class="mb-1 mt-2 fw-semibold text-body">Helados, milkshakes, copas y mucho más...</p>' +
      '      <p class="small text-turquoise fw-semibold mb-0">¡Todo lo que te hace feliz!</p>' +
      '    </div>' +
      '    <div class="sg-splash-cone-wrap my-1">' +
      '      <img src="assets/images/hero/splash-cone.jpg" alt="Helado artesanal en cono" class="sg-splash-cone-img">' +
      '    </div>' +
      '    <button type="button" id="sg-welcome-start-btn" class="btn btn-sg-primary px-5 py-2 fs-6">' +
      '      Comenzar <i class="bi bi-arrow-right ms-2"></i>' +
      '    </button>' +
      '    <div class="sg-welcome-dots" aria-hidden="true">' +
      '      <span></span><span class="active"></span><span></span>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );

    $('#sg-welcome-start-btn').on('click', function () {
      $('#sg-welcome-stage').addClass('is-leaving');
      setTimeout(function () {
        $stage.empty();
        if (typeof onStart === 'function') onStart();
      }, 360);
    });
  }

  window.SGSplashWelcome = {
    showSplash: showSplash,
    showWelcome: showWelcome
  };
})(window, window.jQuery);
