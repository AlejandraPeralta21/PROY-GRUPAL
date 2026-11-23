// Semana 3 - Componentes Encapsulados
const salida = document.getElementById('estadoSimulacion');
document.querySelectorAll('.card-item__btn-simular').forEach((btn) => {
  btn.addEventListener('click', () => {
    salida.textContent = `Componente verificado: ${btn.dataset.prod} listo para pedido.`;
  });
});
