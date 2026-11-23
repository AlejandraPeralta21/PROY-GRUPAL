// Semana 2 - Calculador Modal 30s y Toast
let temporizadorModal = null;
let segundosRestantes = 30;
const OPCIONES_CAPA2 = {
  Helados: ['Artesanales', 'Helados de fruta', 'Sin azúcar', 'Veganos'],
  Frappés: ['Chocolate', 'Oreo', 'Caramelo', 'Té matcha'],
  Cafés: ['Espresso', 'Cappuccino', 'Latte', 'Cafés fríos'],
  Repostería: ['Tortas', 'Cheesecakes', 'Brownies', 'Flan casero']
};

$(function () {
  $('#hrs').on('input', function () {
    $('#total').text((Number($(this).val()) || 1) * 40);
  });

  $('#btnModal').on('click', function () {
    clearInterval(temporizadorModal);
    segundosRestantes = 30;
    $('#contadorModal').text('00:30');
    $('#modalConfirmacion').css('display', 'flex').hide().fadeIn('fast');
    temporizadorModal = setInterval(function () {
      segundosRestantes -= 1;
      $('#contadorModal').text(`00:${String(segundosRestantes).padStart(2, '0')}`);
      if (segundosRestantes <= 0) {
        clearInterval(temporizadorModal);
        $('#modalConfirmacion').fadeOut('fast');
        $('#toastAlerta').text('Tarifa Flash Expirada').slideDown('fast').delay(3000).fadeOut('slow');
      }
    }, 1000);
  });

  $('#btnCerrarModal').on('click', function () {
    clearInterval(temporizadorModal);
    $('#modalConfirmacion').fadeOut('fast');
  });

  // Semana 2 - Filtro de 3 Capas
  $('#capa1').off('change').on('change', function () {
    const areaSeleccionada = $(this).val();
    const $selectorCapa2 = $('#capa2');
    $selectorCapa2.empty().append($('<option>').val('').text('-- Seleccione opción --'));
    const lista = OPCIONES_CAPA2[areaSeleccionada] || [];
    lista.forEach((op) => $selectorCapa2.append($('<option>').val(op).text(op)));
    $selectorCapa2.prop('disabled', !lista.length);
  });

  $('#capa2').off('change').on('change', function () {
    const opcionElegida = $(this).find('option:selected').text();
    $('#resultadoFiltro').text($(this).val() ? `Capa 3: ${opcionElegida}` : 'Seleccione las capas anteriores...');
  });
});
