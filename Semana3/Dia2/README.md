# SOLO GELATOS

Demo frontend de una heladería artesanal: HTML, CSS, JavaScript y jQuery. Abre `index.html` en el navegador (o las vistas en `pages/`).

## Diseño

- Paleta **crema + berry** con acentos menta, tipografía *Cormorant Garamond* para títulos e *Inter* para texto.
- Iconografía **SVG lineal** en todo el sistema: menú hamburguesa, navegación, encabezado, barra inferior, categorías y acciones. Sin emojis.
- Tema claro/oscuro conmutables desde el encabezado; se guarda la preferencia en `localStorage`.
- Diseño responsive con menú lateral deslizante y barra inferior en móvil.

## Catálogo

- **8 categorías** (Helados, Frappés, Cafés, Repostería, Milkshakes, Waffles, Jugos y Promociones).
- **27 productos** disponibles en el punto de venta, con búsqueda y filtros por categoría.

## Eventos

- Catálogo de 6 tipos de eventos (cumpleaños, bodas, corporativos, baby shower, graduaciones y pedidos especiales).
- Desde cada tarjeta del catálogo, o desde **Nuevo evento**, se abre un formulario para crear el evento (tipo, nombre, cliente, fecha, invitados, paquete y estado).
- Los eventos se guardan en `localStorage`, aparecen en la vista **Eventos** y en el resumen del **Inicio**.
- Se puede eliminar un evento; cada alta/baja queda registrada en la **Bitácora de eventos**.

## Operaciones

- El POS calcula el carrito, registra pagos por **efectivo, QR, tarjeta o billetera móvil**, guarda el historial y descuenta existencias de productos terminados.
- La caja permite apertura y cierre de turno, fondo inicial y comparación entre efectivo esperado y contado.
- El inventario permite crear y editar artículos, ajustar existencias y consultar movimientos. Las compras recibidas suman stock.
- Proveedores permiten alta, edición y eliminación. Valida nombres sin números, celulares de 8 dígitos y teléfonos fijos opcionales de 8 dígitos que comienzan con 2.
- La bitácora registra las operaciones y permite exportarlas a CSV.
- Los registros se guardan en el almacenamiento local del navegador (`localStorage`); no se sincronizan entre dispositivos ni con un servidor.
- El encabezado utiliza el logotipo original de `images/logo.png`.

## Aplicación instalable (PWA)

- Incluye manifiesto, iconos de instalación y service worker con caché de archivos del sitio y recursos remotos visitados.
- Para probarla en Windows, ejecuta `iniciar-pwa.bat` y abre `http://localhost:8080`. Mantén abierta la ventana del servidor.
- En Chrome o Edge, usa **Instalar app** cuando aparezca en el encabezado. La instalación no está disponible al abrir `index.html` directamente como archivo.
- Abre la aplicación con conexión y recárgala una vez para que el service worker guarde también las fuentes y fotos que se hayan visitado.

## Estructura

```
index.html          Inicio (y plantilla de las vistas en pages/)
css/
  temas.css         Variables de paleta claro/oscuro
  estilos.css       Componentes y diseño
  animaciones.css   Animaciones de entrada
  responsive.css    Media queries
js/
  iconos.js         Iconos SVG reutilizables
  categorias.js     Catálogo, POS y carrito
  main.js           Vistas y datos de demostración
  temas.js          Conmutador de tema
  menu.js           Menú hamburguesa
  navegacion.js     Navegación, eventos y bitácora
  chrome.js         Iconos del encabezado y barra inferior
images/
  logo.svg          Logotipo vectorial nuevo
  logo.png          Logotipo original (conservado)
```
