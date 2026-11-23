// Semana 2 - Fetch Lazy Loading y Bubbling
const RESPALDO_LOCAL = [
  { nombre: 'Helado Frutilla', categoria: 'Helados', precio: 25, imagen: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=720&q=82' },
  { nombre: 'Frappé Chocolate', categoria: 'Frappés', precio: 28, imagen: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=720&q=82' },
  { nombre: 'Cappuccino', categoria: 'Cafés', precio: 18, imagen: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=720&q=82' },
  { nombre: 'Waffle con Frutas', categoria: 'Waffles', precio: 32, imagen: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=720&q=82' }
];

function abrirLightboxImagen(srcImagen, tituloImagen) {
  if (!srcImagen) return;
  const visorLightbox = document.getElementById('lightboxImagenVisor');
  const fotoAmpliada = document.getElementById('lightboxImagenFoto');
  const etiquetaTitulo = document.getElementById('lightboxImagenTitulo');
  if (!visorLightbox || !fotoAmpliada) return;
  fotoAmpliada.setAttribute('src', srcImagen);
  fotoAmpliada.setAttribute('alt', tituloImagen || 'Vista ampliada');
  if (etiquetaTitulo) etiquetaTitulo.textContent = tituloImagen || '';
  visorLightbox.classList.add('activo');
}

function cerrarLightboxImagen() {
  const visorLightbox = document.getElementById('lightboxImagenVisor');
  if (visorLightbox) visorLightbox.classList.remove('activo');
}

document.addEventListener('click', (eventoClick) => {
  const imagenTocada = eventoClick.target.closest('img');
  if (imagenTocada && !imagenTocada.closest('#lightboxImagenVisor') && imagenTocada.getAttribute('src')) {
    const origenFoto = imagenTocada.getAttribute('src');
    const textoFoto = imagenTocada.getAttribute('alt') || imagenTocada.closest('article')?.querySelector('h3, h4')?.textContent || '';
    abrirLightboxImagen(origenFoto, textoFoto);
  }
});

document.addEventListener('keydown', (eventoTecla) => {
  if (eventoTecla.key === 'Escape') cerrarLightboxImagen();
});

async function cargarProductos() {
  let datos = RESPALDO_LOCAL;
  try {
    const res = await fetch('./data.json');
    if (res.ok) datos = await res.json();
  } catch (_) {}

  const cont = document.getElementById('catalogoFetch');
  cont.textContent = '';
  datos.forEach((p) => {
    const art = document.createElement('article');
    art.className = 'card';
    const img = document.createElement('img');
    img.src = p.imagen;
    img.alt = `${p.nombre} artesanal`;
    img.loading = 'lazy';
    const body = document.createElement('div');
    body.className = 'card-body';
    const h3 = document.createElement('h3');
    h3.textContent = p.nombre;
    const pPrecio = document.createElement('p');
    pPrecio.textContent = `${p.categoria} · ${p.precio} Bs`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-elegir';
    btn.textContent = 'Seleccionar';
    body.append(h3, pPrecio, btn);
    art.append(img, body);
    cont.appendChild(art);
  });

  $('#catalogoFetch').off('click', '.btn-elegir').on('click', '.btn-elegir', function () {
    const nombre = $(this).closest('article').find('h3').text();
    $(this).text(`Elegido: ${nombre}`);
  });
}

document.getElementById('btnCerrarVisor').addEventListener('click', cerrarLightboxImagen);
cargarProductos();
