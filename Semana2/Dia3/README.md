# SOLO GELATOS — Aplicación Web Completa

**"El sabor que te hace feliz"**

Aplicación web comercial responsiva (mobile-first) para la heladería **SOLO GELATOS**, desarrollada de forma modular con **HTML5, CSS3, JavaScript, Bootstrap 5, jQuery 3.x, jQuery UI, Chart.js, AJAX/JSON, LocalStorage e IndexedDB**.

## Estructura del Proyecto

- `index.html` — Aplicación cliente (Splash animado, Bienvenida, Catálogo, Categorías/Subcategorías, Buscador, Filtros, Detalle, Carrito, Checkout con validaciones, Confirmación, Pedidos y Perfil).
- `admin.html` — Módulo privado e independiente del Panel Administrativo (Login, Dashboard con Chart.js, 16 secciones CRUD y Bitácora de eventos en tiempo real).
- `css/` — `tokens.css`, `themes.css` (Modo Claro y Modo Oscuro), `client.css`, `admin.css`.
- `js/modules/` — `theme.js`, `storage.js` (IndexedDB + LocalStorage + BroadcastChannel), `eventLog.js`, `toast.js`, `cart.js`, `components.js`.
- `js/pages/` — `splashWelcome.js`, `homeCatalog.js`, `categoriesPage.js`, `filtersPage.js`, `productDetail.js`, `cartCheckout.js`, `ordersProfile.js`.
- `js/admin/` — `adminAuth.js`, `adminDashboard.js`, `adminEventLog.js`, `adminCrud.js`.
- `api/` — `apiService.js` (consumo AJAX/JSON + interfaz preparada para backend REST) y `apiDataFallback.js`.
- `assets/` — Logotipo oficial en `assets/brand/`, fotografías gastronómicas únicas por producto en `assets/images/products/` y datos semilla en `assets/data/`.

## Acceso de Demostración al Panel Administrativo

Abrir `admin.html` (o ingresar desde **Perfil → Ir al Panel Administrativo**):
- **Administrador:** `admin@sologelatos.bo` / `Gelatos2026!`
- **Cajero:** `caja@sologelatos.bo` / `Caja2026!`
*(También dispone de botones de acceso rápido de demostración en el login).*
