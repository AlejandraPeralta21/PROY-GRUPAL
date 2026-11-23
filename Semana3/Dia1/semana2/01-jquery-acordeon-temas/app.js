// Semana 2 - jQuery Acordeon y Temas
$(function () {
  $('.accordion-btn').off('click').on('click', function () {
    $(this).next('.accordion-panel').slideToggle('fast');
  });

  $('#btnTemaJq').off('click').on('click', function () {
    $('body').toggleClass('dark-mode');
  });

  $('#btnAnimarTotal').off('click').on('click', function () {
    $('#totalMonto').animate({ opacity: 0.3 }, 120).animate({ opacity: 1 }, 180);
  });

  $('.filtro').off('click').on('click', function () {
    const cat = $(this).data('cat');
    $('#listaJq .item').each(function () {
      const coincide = cat === 'todos' || $(this).data('cat') === cat;
      if (coincide) $(this).fadeIn('fast');
      else $(this).fadeOut('fast');
    });
  });

  $('#buscadorJq').off('keyup').on('keyup', function () {
    const q = $(this).val().toLowerCase();
    $('#listaJq .item').each(function () {
      const visible = $(this).text().toLowerCase().includes(q);
      if (visible) $(this).fadeIn('fast');
      else $(this).fadeOut('fast');
    });
  });
});
