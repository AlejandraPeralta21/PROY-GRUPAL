/**
 * SOLO GELATOS - Semilla de respaldo para entorno local file://
 * Sincronizada automáticamente desde assets/data/catalog.json y assets/data/admin-seed.json
 */
(function (window) {
  'use strict';
  window.SG_FALLBACK_CATALOG = {
  "brand": {
    "name": "SOLO GELATOS",
    "tagline": "El sabor que te hace feliz",
    "subtitle": "Helados, milkshakes, copas y mucho más...",
    "currency": "Bs.",
    "instagram": "@solo.gelatos",
    "facebook": "Solo Gelatos",
    "shippingFee": 5,
    "freeShippingThreshold": 100
  },
  "flavors": [
    { "id": "chocolate", "name": "Chocolate Belga", "color": "#5B3221" },
    { "id": "vainilla", "name": "Vainilla Cremosa", "color": "#F3E1B6" },
    { "id": "frutilla", "name": "Frutilla Natural", "color": "#E95A85" },
    { "id": "oreo", "name": "Oreo Cookies & Cream", "color": "#434A54" },
    { "id": "blue-ice", "name": "Blue Ice", "color": "#2CA7DF" },
    { "id": "pistacho", "name": "Pistacho Artesanal", "color": "#9AC478" },
    { "id": "grosella", "name": "Grosella", "color": "#D42A5E" },
    { "id": "crema-americana", "name": "Crema Americana", "color": "#FFF3D6" },
    { "id": "dulce-leche", "name": "Dulce de Leche", "color": "#C68346" },
    { "id": "mango-maracuya", "name": "Mango Maracuyá", "color": "#F6AD3C" },
    { "id": "limon", "name": "Pie de Limón", "color": "#C8DF6C" },
    { "id": "frutos-rojos", "name": "Frutos Rojos", "color": "#9B2354" }
  ],
  "extras": [
    { "id": "crema-batida", "name": "Crema batida extra", "price": 4 },
    { "id": "chispas-chocolate", "name": "Chispas de chocolate", "price": 3 },
    { "id": "galleta-lunita", "name": "Galleta lunita", "price": 3 },
    { "id": "habanito", "name": "Barquillo habanito", "price": 3 },
    { "id": "almendras", "name": "Almendras picadas", "price": 5 },
    { "id": "jalea-extra", "name": "Jalea de frutilla o caramelo", "price": 4 },
    { "id": "canasta-extra", "name": "Servir en canasta de galleta", "price": 5 }
  ],
  "categories": [
    {
      "id": "helados",
      "name": "Helados",
      "shortName": "Helados",
      "description": "Sabores clásicos y especiales en cono, vasito o canasta",
      "icon": "bi-cone-striped",
      "tint": "pink",
      "image": "assets/images/products/helado-triple.jpg",
      "subcategories": [
        { "id": "helado-simple", "name": "Helado simple" },
        { "id": "helado-doble", "name": "Helado doble" },
        { "id": "helado-triple", "name": "Helado triple" },
        { "id": "helados-en-cono", "name": "Helados en cono" },
        { "id": "helados-en-canasta", "name": "Helados en canasta de galleta" },
        { "id": "sabores-especiales", "name": "Sabores especiales" },
        { "id": "helados-por-kilo", "name": "Helados por kilo" }
      ]
    },
    {
      "id": "milkshakes",
      "name": "Milkshakes",
      "shortName": "Milkshakes",
      "description": "Cremosos batidos con crema batida y barquillo habanito",
      "icon": "bi-cup-straw",
      "tint": "teal",
      "image": "assets/images/products/milkshake-chocolate.jpg",
      "subcategories": [
        { "id": "chocolate", "name": "Chocolate" },
        { "id": "vainilla", "name": "Vainilla" },
        { "id": "frutilla", "name": "Frutilla" },
        { "id": "oreo", "name": "Oreo" }
      ]
    },
    {
      "id": "kilo",
      "name": "Helados por Kilo",
      "shortName": "Por Kilo",
      "description": "Envases térmicos ideales para disfrutar en casa",
      "icon": "bi-box2-heart",
      "tint": "peach",
      "image": "assets/images/products/kilo-1kg.jpg",
      "subcategories": [
        { "id": "1-kilogramo", "name": "1 kilogramo" },
        { "id": "3-4-kilogramo", "name": "3/4 kilogramo" },
        { "id": "1-2-kilogramo", "name": "1/2 kilogramo" },
        { "id": "1-4-kilogramo", "name": "1/4 kilogramo" }
      ]
    },
    {
      "id": "copas",
      "name": "Helados en Copa",
      "shortName": "Copas",
      "description": "Copas artesanales con jalea, crema batida y toppings",
      "icon": "bi-trophy",
      "tint": "pink",
      "image": "assets/images/products/copa-cookie-monster.jpg",
      "subcategories": [
        { "id": "copa-simple", "name": "Copa simple" },
        { "id": "copa-doble", "name": "Copa doble" },
        { "id": "copa-triple", "name": "Copa triple" },
        { "id": "copa-cookie-monster", "name": "Copa Cookie Monster" }
      ]
    },
    {
      "id": "especiales",
      "name": "Copas Especiales",
      "shortName": "Especiales",
      "description": "Creaciones insignia de la casa y promos de temporada",
      "icon": "bi-stars",
      "tint": "peach",
      "image": "assets/images/products/banana-split.jpg",
      "subcategories": [
        { "id": "copa-de-la-casa", "name": "Copa de la casa" },
        { "id": "copa-cafe-helado", "name": "Copa café helado" },
        { "id": "banana-split", "name": "Banana Split" },
        { "id": "promociones", "name": "Promociones" }
      ]
    },
    {
      "id": "postres",
      "name": "Pastelería a Base de Helado",
      "shortName": "Postres",
      "description": "Tortas heladas, brownies tibios y sándwiches de galleta",
      "icon": "bi-cake2",
      "tint": "pink",
      "image": "assets/images/products/brownie-helado.jpg",
      "subcategories": [
        { "id": "torta-helada", "name": "Porción de torta helada" },
        { "id": "brownie-helado", "name": "Brownie con helado" },
        { "id": "sandwich-helado", "name": "Sándwich de helado" }
      ]
    },
    {
      "id": "cafes",
      "name": "Cafés y Cafés Fríos",
      "shortName": "Cafés",
      "description": "Espresso de especialidad, affogato, latte y cafés fríos",
      "icon": "bi-cup-hot",
      "tint": "peach",
      "image": "assets/images/products/cafe-dalgona.jpg",
      "subcategories": [
        { "id": "espresso", "name": "Espresso" },
        { "id": "americano", "name": "Americano" },
        { "id": "latte", "name": "Latte" },
        { "id": "mocha", "name": "Mocha" },
        { "id": "affogato", "name": "Affogato" },
        { "id": "cafe-helado", "name": "Café helado" },
        { "id": "cafe-dalgona", "name": "Café Dalgona" }
      ]
    },
    {
      "id": "frappes",
      "name": "Frappés",
      "shortName": "Frappés",
      "description": "Frappés frutales y cremosos con crema batida y decoración",
      "icon": "bi-snow2",
      "tint": "teal",
      "image": "assets/images/products/frappe-pie-limon.jpg",
      "subcategories": [
        { "id": "cappuccino-frappe", "name": "Cappuccino frappé" },
        { "id": "frappe-frutillas", "name": "Frappé de frutillas" },
        { "id": "frappe-moras", "name": "Frappé de moras" },
        { "id": "frappe-frutos-rojos", "name": "Frappé de frutos rojos" },
        { "id": "frappe-oreo", "name": "Frappé de Oreo" },
        { "id": "frappe-pie-limon", "name": "Frappé de pie de limón" }
      ]
    }
  ],
  "products": [
    {
      "id": "sg-helado-simple",
      "name": "Helado Simple",
      "category": "helados",
      "subcategory": "helado-simple",
      "price": 19,
      "description": "Una porción generosa de un sabor artesanal a elección en cono de galleta o vasito.",
      "presentation": "Cono de galleta",
      "flavorSlots": 1,
      "defaultFlavors": ["frutilla"],
      "popular": true,
      "featured": true,
      "stock": 45,
      "sizes": [
        { "label": "Cono Clásico", "price": 19 },
        { "label": "Cono Bañado", "price": 22 },
        { "label": "Canasta de Galleta", "price": 24 }
      ],
      "image": "assets/images/products/helado-simple.jpg"
    },
    {
      "id": "sg-helado-doble",
      "name": "Helado Doble",
      "category": "helados",
      "subcategory": "helado-doble",
      "price": 28,
      "description": "Dos porciones cremosas con dos sabores a elección servidas en cono crocante de galleta.",
      "presentation": "Cono de galleta",
      "flavorSlots": 2,
      "defaultFlavors": ["chocolate", "vainilla"],
      "popular": true,
      "featured": true,
      "stock": 38,
      "sizes": [
        { "label": "Cono Doble", "price": 28 },
        { "label": "Canasta de Galleta", "price": 32 },
        { "label": "Vaso Térmico", "price": 28 }
      ],
      "image": "assets/images/products/helado-doble.jpg"
    },
    {
      "id": "sg-helado-triple",
      "name": "Helado Triple",
      "category": "helados",
      "subcategory": "helado-triple",
      "price": 33,
      "description": "Tres porciones abundantes con tres sabores artesanales a elección en waffle crocante.",
      "presentation": "Cono de galleta",
      "flavorSlots": 3,
      "defaultFlavors": ["frutilla", "chocolate", "pistacho"],
      "popular": true,
      "featured": false,
      "stock": 30,
      "sizes": [
        { "label": "Cono Triple", "price": 33 },
        { "label": "Canasta de Galleta", "price": 37 }
      ],
      "image": "assets/images/products/helado-triple.jpg"
    },
    {
      "id": "sg-cono-crocante",
      "name": "Cono Crocante Artesanal",
      "category": "helados",
      "subcategory": "helados-en-cono",
      "price": 23,
      "description": "Cono de galleta recién horneado con borde bañado en chocolate belga y crocante de nuez.",
      "presentation": "Cono de galleta",
      "flavorSlots": 1,
      "defaultFlavors": ["dulce-leche"],
      "popular": false,
      "featured": false,
      "stock": 28,
      "sizes": [
        { "label": "1 Bola", "price": 23 },
        { "label": "2 Bolas", "price": 31 }
      ],
      "image": "assets/images/products/cono-crocante.jpg"
    },
    {
      "id": "sg-canasta-galleta",
      "name": "Helado en Canasta de Galleta",
      "category": "helados",
      "subcategory": "helados-en-canasta",
      "price": 32,
      "description": "Crujiente canasta comestible de galleta waffle con dos porciones de helado, crema batida y jalea.",
      "presentation": "Canasta de galleta",
      "flavorSlots": 2,
      "defaultFlavors": ["vainilla", "chocolate"],
      "popular": true,
      "featured": true,
      "stock": 26,
      "sizes": [
        { "label": "2 Porciones", "price": 32 },
        { "label": "3 Porciones", "price": 38 }
      ],
      "image": "assets/images/products/canasta-galleta.jpg"
    },
    {
      "id": "sg-sabores-especiales",
      "name": "Edición Sabores Especiales",
      "category": "helados",
      "subcategory": "sabores-especiales",
      "price": 25,
      "description": "Selección gourmet: Blue Ice, Pistacho Siciliano, Mango Maracuyá o Frutos Rojos.",
      "presentation": "Canasta de galleta",
      "flavorSlots": 2,
      "defaultFlavors": ["blue-ice", "pistacho"],
      "popular": true,
      "featured": false,
      "stock": 22,
      "sizes": [
        { "label": "En Cono", "price": 25 },
        { "label": "En Canasta", "price": 30 }
      ],
      "image": "assets/images/products/sabores-especiales.jpg"
    },
    {
      "id": "sg-kilo-1",
      "name": "Helado 1 Kilogramo (1 KL)",
      "category": "kilo",
      "subcategory": "1-kilogramo",
      "extraCategories": ["helados"],
      "extraSubcategory": "helados-por-kilo",
      "price": 110,
      "description": "Envase térmico familiar de 1 kilogramo con 4 sabores artesanales a tu elección.",
      "presentation": "Envase térmico",
      "flavorSlots": 4,
      "defaultFlavors": ["chocolate", "vainilla", "frutilla", "dulce-leche"],
      "popular": true,
      "featured": false,
      "stock": 18,
      "sizes": [{ "label": "1 Kilogramo (4 sabores)", "price": 110 }],
      "image": "assets/images/products/kilo-1kg.jpg"
    },
    {
      "id": "sg-kilo-34",
      "name": "Helado 3/4 Kilogramo (3/4 KL)",
      "category": "kilo",
      "subcategory": "3-4-kilogramo",
      "extraCategories": ["helados"],
      "extraSubcategory": "helados-por-kilo",
      "price": 85,
      "description": "Envase térmico de 3/4 kilogramo con 3 sabores artesanales a tu elección.",
      "presentation": "Envase térmico",
      "flavorSlots": 3,
      "defaultFlavors": ["chocolate", "frutilla", "pistacho"],
      "popular": false,
      "featured": false,
      "stock": 20,
      "sizes": [{ "label": "3/4 Kilogramo (3 sabores)", "price": 85 }],
      "image": "assets/images/products/kilo-3-4kg.jpg"
    },
    {
      "id": "sg-kilo-12",
      "name": "Helado 1/2 Kilogramo (1/2 KL)",
      "category": "kilo",
      "subcategory": "1-2-kilogramo",
      "extraCategories": ["helados"],
      "extraSubcategory": "helados-por-kilo",
      "price": 65,
      "description": "Envase térmico de 1/2 kilogramo con hasta 4 sabores artesanales a elección.",
      "presentation": "Envase térmico",
      "flavorSlots": 4,
      "defaultFlavors": ["vainilla", "oreo", "frutilla", "chocolate"],
      "popular": true,
      "featured": false,
      "stock": 24,
      "sizes": [{ "label": "1/2 Kilogramo (4 sabores)", "price": 65 }],
      "image": "assets/images/products/kilo-1-2kg.jpg"
    },
    {
      "id": "sg-kilo-14",
      "name": "Helado 1/4 Kilogramo (1/4 KL)",
      "category": "kilo",
      "subcategory": "1-4-kilogramo",
      "extraCategories": ["helados"],
      "extraSubcategory": "helados-por-kilo",
      "price": 40,
      "description": "Envase térmico personal de 1/4 kilogramo con 2 sabores a tu elección.",
      "presentation": "Envase térmico",
      "flavorSlots": 2,
      "defaultFlavors": ["chocolate", "dulce-leche"],
      "popular": false,
      "featured": false,
      "stock": 30,
      "sizes": [{ "label": "1/4 Kilogramo (2 sabores)", "price": 40 }],
      "image": "assets/images/products/kilo-1-4kg.jpg"
    },
    {
      "id": "sg-milkshake-chocolate",
      "name": "Milkshake de Chocolate",
      "category": "milkshakes",
      "subcategory": "chocolate",
      "price": 31,
      "description": "Helado de chocolate, leche, crema batida, habanito y salsa de chocolate en vaso alto.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["chocolate"],
      "popular": true,
      "featured": true,
      "stock": 34,
      "sizes": [
        { "label": "Regular (400 ml)", "price": 31 },
        { "label": "Grande (550 ml)", "price": 37 }
      ],
      "image": "assets/images/products/milkshake-chocolate.jpg"
    },
    {
      "id": "sg-milkshake-vainilla",
      "name": "Milkshake de Vainilla",
      "category": "milkshakes",
      "subcategory": "vainilla",
      "price": 31,
      "description": "Helado de vainilla, leche, crema batida, habanito y salsa de vainilla.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["vainilla"],
      "popular": false,
      "featured": false,
      "stock": 32,
      "sizes": [
        { "label": "Regular (400 ml)", "price": 31 },
        { "label": "Grande (550 ml)", "price": 37 }
      ],
      "image": "assets/images/products/milkshake-vainilla.jpg"
    },
    {
      "id": "sg-milkshake-frutilla",
      "name": "Milkshake de Frutilla",
      "category": "milkshakes",
      "subcategory": "frutilla",
      "price": 31,
      "description": "Helado de frutilla, leche, crema batida, habanito y salsa de frutilla.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["frutilla"],
      "popular": true,
      "featured": true,
      "stock": 36,
      "sizes": [
        { "label": "Regular (400 ml)", "price": 31 },
        { "label": "Grande (550 ml)", "price": 37 }
      ],
      "image": "assets/images/products/milkshake-frutilla.jpg"
    },
    {
      "id": "sg-milkshake-oreo",
      "name": "Milkshake de Oreo",
      "category": "milkshakes",
      "subcategory": "oreo",
      "price": 34,
      "description": "Helado de Oreo, leche, crema batida, habanito y salsa de chocolate.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["oreo"],
      "popular": true,
      "featured": true,
      "stock": 29,
      "sizes": [
        { "label": "Regular (400 ml)", "price": 34 },
        { "label": "Grande (550 ml)", "price": 40 }
      ],
      "image": "assets/images/products/milkshake-oreo.jpg"
    },
    {
      "id": "sg-copa-simple",
      "name": "Copa Simple",
      "category": "copas",
      "subcategory": "copa-simple",
      "price": 23,
      "description": "Un sabor a elección, jalea a elección, crema batida, galleta lunita y cherry.",
      "presentation": "Copa de cristal",
      "flavorSlots": 1,
      "defaultFlavors": ["chocolate"],
      "popular": false,
      "featured": false,
      "stock": 25,
      "sizes": [{ "label": "Copa Individual", "price": 23 }],
      "image": "assets/images/products/copa-simple.jpg"
    },
    {
      "id": "sg-copa-doble",
      "name": "Copa Doble",
      "category": "copas",
      "subcategory": "copa-doble",
      "price": 32,
      "description": "Dos sabores a elección, jalea a elección, crema batida, galleta lunita y cherry.",
      "presentation": "Copa de cristal",
      "flavorSlots": 2,
      "defaultFlavors": ["frutilla", "vainilla"],
      "popular": true,
      "featured": false,
      "stock": 24,
      "sizes": [{ "label": "Copa Doble", "price": 32 }],
      "image": "assets/images/products/copa-doble.jpg"
    },
    {
      "id": "sg-copa-triple",
      "name": "Copa Triple",
      "category": "copas",
      "subcategory": "copa-triple",
      "price": 37,
      "description": "Tres sabores a elección, jalea a elección, crema batida, galleta lunita y cherry.",
      "presentation": "Copa de cristal",
      "flavorSlots": 3,
      "defaultFlavors": ["chocolate", "frutilla", "vainilla"],
      "popular": true,
      "featured": false,
      "stock": 20,
      "sizes": [{ "label": "Copa Triple", "price": 37 }],
      "image": "assets/images/products/copa-triple.jpg"
    },
    {
      "id": "sg-copa-cookie-monster",
      "name": "Copa Cookie Monster",
      "category": "copas",
      "subcategory": "copa-cookie-monster",
      "price": 35,
      "description": "Dos porciones de helado sabor Blue Ice, galletas Chips Ahoy, jalea Blue Ice y crema batida.",
      "presentation": "Copa de cristal",
      "flavorSlots": 0,
      "defaultFlavors": ["blue-ice"],
      "popular": true,
      "featured": true,
      "stock": 22,
      "sizes": [{ "label": "Copa Clásica", "price": 35 }],
      "image": "assets/images/products/copa-cookie-monster.jpg"
    },
    {
      "id": "sg-copa-casa",
      "name": "Copa de la Casa",
      "category": "especiales",
      "subcategory": "copa-de-la-casa",
      "price": 38,
      "description": "Dos sabores de gelatina, leche condensada, dos porciones de helado a elección, crema batida, jalea de caramelo y frutilla y chispas de chocolate.",
      "presentation": "Copa de cristal",
      "flavorSlots": 2,
      "defaultFlavors": ["vainilla", "frutilla"],
      "popular": true,
      "featured": true,
      "stock": 18,
      "sizes": [{ "label": "Copa Especial", "price": 38 }],
      "image": "assets/images/products/copa-de-la-casa.jpg"
    },
    {
      "id": "sg-copa-cafe-helado",
      "name": "Copa Café Helado",
      "category": "especiales",
      "subcategory": "copa-cafe-helado",
      "price": 38,
      "description": "Café expresso, dos porciones de helado de vainilla, leche fluida, crema batida, habanito y jalea de caramelo.",
      "presentation": "Copa de cristal",
      "flavorSlots": 0,
      "defaultFlavors": ["vainilla"],
      "popular": false,
      "featured": false,
      "stock": 16,
      "sizes": [{ "label": "Copa Especial", "price": 38 }],
      "image": "assets/images/products/copa-cafe-helado.jpg"
    },
    {
      "id": "sg-banana-split",
      "name": "Copa Banana Split",
      "category": "especiales",
      "subcategory": "banana-split",
      "price": 38,
      "description": "Tres porciones de helado (chocolate, vainilla y grosella), banana, crema batida, almendras picadas, jaleas de chocolate, vainilla y frutilla y cherry.",
      "presentation": "Copa de cristal",
      "flavorSlots": 3,
      "defaultFlavors": ["chocolate", "vainilla", "grosella"],
      "popular": true,
      "featured": true,
      "stock": 19,
      "sizes": [{ "label": "Plato Banana Split", "price": 38 }],
      "image": "assets/images/products/banana-split.jpg"
    },
    {
      "id": "sg-promo-frio",
      "name": "Promo Frío: Sándwich + Chocolate Caliente",
      "category": "especiales",
      "subcategory": "promociones",
      "price": 30,
      "description": "Sándwich gratinado de jamón y queso con salsa bechamel + deliciosa taza de chocolate caliente.",
      "presentation": "Combo especial",
      "flavorSlots": 0,
      "defaultFlavors": [],
      "popular": true,
      "featured": false,
      "stock": 25,
      "sizes": [{ "label": "Combo Completo", "price": 30 }],
      "image": "assets/images/products/promo-frio.jpg"
    },
    {
      "id": "sg-espresso",
      "name": "Espresso",
      "category": "cafes",
      "subcategory": "espresso",
      "price": 14,
      "description": "Extracción intensa de café molido al instante con crema dorada y aroma profundo.",
      "presentation": "Taza de cerámica",
      "flavorSlots": 0,
      "defaultFlavors": [],
      "popular": false,
      "featured": false,
      "stock": 50,
      "sizes": [
        { "label": "Simple", "price": 14 },
        { "label": "Doble", "price": 18 }
      ],
      "image": "assets/images/products/cafe-espresso.jpg"
    },
    {
      "id": "sg-americano",
      "name": "Americano",
      "category": "cafes",
      "subcategory": "americano",
      "price": 15,
      "description": "Café espresso equilibrado y aromático diluido en agua caliente.",
      "presentation": "Taza de cerámica",
      "flavorSlots": 0,
      "defaultFlavors": [],
      "popular": false,
      "featured": false,
      "stock": 50,
      "sizes": [
        { "label": "Caliente", "price": 15 },
        { "label": "Con Hielo", "price": 17 }
      ],
      "image": "assets/images/products/cafe-americano.jpg"
    },
    {
      "id": "sg-latte",
      "name": "Latte",
      "category": "cafes",
      "subcategory": "latte",
      "price": 18,
      "description": "Espresso de la casa combinado con leche vaporizada sedosa y arte latte.",
      "presentation": "Taza de cerámica",
      "flavorSlots": 0,
      "defaultFlavors": [],
      "popular": true,
      "featured": false,
      "stock": 40,
      "sizes": [
        { "label": "Caliente", "price": 18 },
        { "label": "Iced Latte", "price": 21 }
      ],
      "image": "assets/images/products/cafe-latte.jpg"
    },
    {
      "id": "sg-mocha",
      "name": "Mocha",
      "category": "cafes",
      "subcategory": "mocha",
      "price": 20,
      "description": "Espresso artesanal fundido con chocolate oscuro, leche cremosa y crema batida.",
      "presentation": "Vaso de cristal",
      "flavorSlots": 0,
      "defaultFlavors": ["chocolate"],
      "popular": false,
      "featured": false,
      "stock": 35,
      "sizes": [
        { "label": "Clásico", "price": 20 },
        { "label": "Con Helado", "price": 26 }
      ],
      "image": "assets/images/products/cafe-mocha.jpg"
    },
    {
      "id": "sg-affogato",
      "name": "Affogato",
      "category": "cafes",
      "subcategory": "affogato",
      "price": 30,
      "description": "Bola generosa de helado de vainilla artesanal bañada en espresso caliente recién extraído.",
      "presentation": "Vaso de cristal",
      "flavorSlots": 1,
      "defaultFlavors": ["vainilla"],
      "popular": true,
      "featured": false,
      "stock": 28,
      "sizes": [{ "label": "Copa Affogato", "price": 30 }],
      "image": "assets/images/products/cafe-affogato.jpg"
    },
    {
      "id": "sg-cafe-helado",
      "name": "Café Helado",
      "category": "cafes",
      "subcategory": "cafe-helado",
      "price": 38,
      "description": "Café frío en vaso de cristal alto con helado de vainilla, crema batida y salsa de caramelo.",
      "presentation": "Vaso de cristal",
      "flavorSlots": 1,
      "defaultFlavors": ["vainilla"],
      "popular": true,
      "featured": false,
      "stock": 22,
      "sizes": [{ "label": "Vaso Alto (450 ml)", "price": 38 }],
      "image": "assets/images/products/cafe-helado.jpg"
    },
    {
      "id": "sg-cafe-dalgona",
      "name": "Café Dalgona",
      "category": "cafes",
      "subcategory": "cafe-dalgona",
      "price": 20,
      "description": "Leche fría en vaso de cristal coronada con crema batida esponjosa de café caramelo.",
      "presentation": "Vaso de cristal",
      "flavorSlots": 0,
      "defaultFlavors": [],
      "popular": false,
      "featured": false,
      "stock": 26,
      "sizes": [{ "label": "Vaso Cristal", "price": 20 }],
      "image": "assets/images/products/cafe-dalgona.jpg"
    },
    {
      "id": "sg-torta-helada",
      "name": "Porción de Torta Helada",
      "category": "postres",
      "subcategory": "torta-helada",
      "price": 28,
      "description": "Bizcocho húmedo de chocolate, capa de helado sabor crema americana y baño de chocolate fundido.",
      "presentation": "Pastelería",
      "flavorSlots": 0,
      "defaultFlavors": ["crema-americana", "chocolate"],
      "popular": true,
      "featured": false,
      "stock": 14,
      "sizes": [
        { "label": "Porción Individual", "price": 28 },
        { "label": "Con Bola Extra", "price": 35 }
      ],
      "image": "assets/images/products/torta-helada.jpg"
    },
    {
      "id": "sg-brownie-helado",
      "name": "Brownie con Helado",
      "category": "postres",
      "subcategory": "brownie-helado",
      "price": 33,
      "description": "Brownie tibio de chocolate artesanal con helado a elección, crema batida y jalea de chocolate.",
      "presentation": "Pastelería",
      "flavorSlots": 1,
      "defaultFlavors": ["vainilla"],
      "popular": true,
      "featured": true,
      "stock": 18,
      "sizes": [
        { "label": "Con 1 Bola", "price": 33 },
        { "label": "Con 2 Bolas", "price": 41 }
      ],
      "image": "assets/images/products/brownie-helado.jpg"
    },
    {
      "id": "sg-sandwich-helado",
      "name": "Sándwich de Helado",
      "category": "postres",
      "subcategory": "sandwich-helado",
      "price": 28,
      "description": "Galletas chips de chocolate de la casa rellenas de helado artesanal, bañadas en chocolate y topping a elección.",
      "presentation": "Pastelería",
      "flavorSlots": 1,
      "defaultFlavors": ["crema-americana"],
      "popular": true,
      "featured": false,
      "stock": 20,
      "sizes": [{ "label": "Unidad", "price": 28 }],
      "image": "assets/images/products/sandwich-helado.jpg"
    },
    {
      "id": "sg-frappe-cappuccino",
      "name": "Cappuccino Frappé",
      "category": "frappes",
      "subcategory": "cappuccino-frappe",
      "price": 28,
      "description": "Granizado cremoso de café cappuccino con crema batida, habanitos y salsa de chocolate.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": [],
      "popular": true,
      "featured": false,
      "stock": 30,
      "sizes": [
        { "label": "Regular", "price": 28 },
        { "label": "Grande", "price": 34 }
      ],
      "image": "assets/images/products/frappe-cappuccino.jpg"
    },
    {
      "id": "sg-frappe-frutillas",
      "name": "Frappé de Frutillas",
      "category": "frappes",
      "subcategory": "frappe-frutillas",
      "price": 28,
      "description": "Frappé refrescante de frutillas seleccionadas coronado con crema batida y jalea roja.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["frutilla"],
      "popular": true,
      "featured": false,
      "stock": 28,
      "sizes": [
        { "label": "Regular", "price": 28 },
        { "label": "Grande", "price": 34 }
      ],
      "image": "assets/images/products/frappe-frutillas.jpg"
    },
    {
      "id": "sg-frappe-moras",
      "name": "Frappé de Moras",
      "category": "frappes",
      "subcategory": "frappe-moras",
      "price": 28,
      "description": "Bebida frappé cremosa de moras silvestres con espiral de crema batida y salsa de mora.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["frutos-rojos"],
      "popular": false,
      "featured": false,
      "stock": 24,
      "sizes": [
        { "label": "Regular", "price": 28 },
        { "label": "Grande", "price": 34 }
      ],
      "image": "assets/images/products/frappe-moras.jpg"
    },
    {
      "id": "sg-frappe-frutos-rojos",
      "name": "Frappé de Frutos Rojos",
      "category": "frappes",
      "subcategory": "frappe-frutos-rojos",
      "price": 28,
      "description": "Mezcla antioxidante de frutillas, moras y frambuesas granizadas con crema batida.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["frutos-rojos"],
      "popular": true,
      "featured": false,
      "stock": 27,
      "sizes": [
        { "label": "Regular", "price": 28 },
        { "label": "Grande", "price": 34 }
      ],
      "image": "assets/images/products/frappe-frutos-rojos.jpg"
    },
    {
      "id": "sg-frappe-oreo",
      "name": "Frappé de Oreo",
      "category": "frappes",
      "subcategory": "frappe-oreo",
      "price": 30,
      "description": "Frappé helado con galletas Oreo molidas, crema batida, salsa de chocolate y galleta entera.",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["oreo"],
      "popular": true,
      "featured": true,
      "stock": 26,
      "sizes": [
        { "label": "Regular", "price": 30 },
        { "label": "Grande", "price": 36 }
      ],
      "image": "assets/images/products/frappe-oreo.jpg"
    },
    {
      "id": "sg-frappe-pie-limon",
      "name": "Frappé de Pie de Limón",
      "category": "frappes",
      "subcategory": "frappe-pie-limon",
      "price": 25,
      "description": "Nuestro frappé estrella de pie de limón con galleta triturada, crema batida y ralladura cítrica. ¡Promo 2 por Bs. 40!",
      "presentation": "Vaso transparente",
      "flavorSlots": 0,
      "defaultFlavors": ["limon"],
      "popular": true,
      "featured": true,
      "stock": 35,
      "sizes": [
        { "label": "1 Unidad", "price": 25 },
        { "label": "Promo 2 Unidades", "price": 40 }
      ],
      "image": "assets/images/products/frappe-pie-limon.jpg"
    }
  ]
}
;
  window.SG_FALLBACK_ADMIN_SEED = {
  "branches": [
    {
      "id": "suc-centro",
      "name": "Sucursal Centro",
      "address": "Calle Sucre #420 esq. Junín",
      "phone": "+591 3 332-4500",
      "manager": "Valentina Sologuren",
      "hours": "10:00 - 22:30",
      "active": true
    },
    {
      "id": "suc-equipetrol",
      "name": "Sucursal Equipetrol",
      "address": "Av. San Martín #1550, Equipetrol",
      "phone": "+591 3 341-8890",
      "manager": "Mateo Mendoza",
      "hours": "11:00 - 23:00",
      "active": true
    },
    {
      "id": "suc-norte",
      "name": "Sucursal Norte",
      "address": "Av. Banzer 4to Anillo #88",
      "phone": "+591 3 345-2110",
      "manager": "Camila Rojas",
      "hours": "11:00 - 22:30",
      "active": true
    }
  ],
  "users": [
    {
      "id": "usr-admin-1",
      "name": "Valentina Sologuren",
      "email": "admin@sologelatos.bo",
      "role": "Administrador",
      "branch": "Sucursal Centro",
      "status": "Activo",
      "demoPin": "Gelatos2026!"
    },
    {
      "id": "usr-caja-1",
      "name": "Carlos Méndez",
      "email": "caja@sologelatos.bo",
      "role": "Cajero",
      "branch": "Sucursal Centro",
      "status": "Activo",
      "demoPin": "Caja2026!"
    },
    {
      "id": "usr-sup-1",
      "name": "Mateo Mendoza",
      "email": "equipetrol@sologelatos.bo",
      "role": "Supervisor",
      "branch": "Sucursal Equipetrol",
      "status": "Activo",
      "demoPin": "Sup2026!"
    },
    {
      "id": "usr-rep-1",
      "name": "Diego Paredes",
      "email": "delivery@sologelatos.bo",
      "role": "Repartidor",
      "branch": "Sucursal Centro",
      "status": "Activo",
      "demoPin": "Rep2026!"
    }
  ],
  "ingredients": [
    { "id": "ing-01", "name": "Base Láctea Artesanal Crema", "unit": "Litros", "stock": 85, "minStock": 25, "cost": 18, "supplier": "Lácteos del Oriente" },
    { "id": "ing-02", "name": "Cacao Belga 70%", "unit": "Kg", "stock": 24, "minStock": 10, "cost": 92, "supplier": "Cacao Boliviano S.R.L." },
    { "id": "ing-03", "name": "Frutilla Fresca Seleccionada", "unit": "Kg", "stock": 32, "minStock": 12, "cost": 26, "supplier": "Frutas Valle Alto" },
    { "id": "ing-04", "name": "Conos Waffle Crocantes", "unit": "Unidades", "stock": 420, "minStock": 100, "cost": 1.8, "supplier": "Galletería Artesanal Cruz" },
    { "id": "ing-05", "name": "Canastas de Galleta Waffle", "unit": "Unidades", "stock": 140, "minStock": 40, "cost": 3.5, "supplier": "Galletería Artesanal Cruz" },
    { "id": "ing-06", "name": "Galletas Oreo / Chips Ahoy", "unit": "Paquetes", "stock": 48, "minStock": 15, "cost": 14, "supplier": "Distribuidora Dulce Sur" },
    { "id": "ing-07", "name": "Crema para Batir Chantilly", "unit": "Litros", "stock": 38, "minStock": 12, "cost": 34, "supplier": "Lácteos del Oriente" },
    { "id": "ing-08", "name": "Café Tostado Especialidad", "unit": "Kg", "stock": 16, "minStock": 5, "cost": 115, "supplier": "Café Yungas Premium" },
    { "id": "ing-09", "name": "Envases Térmicos Solo Gelatos", "unit": "Unidades", "stock": 185, "minStock": 50, "cost": 4.2, "supplier": "Empaques Térmicos Bolivia" },
    { "id": "ing-10", "name": "Leche Condensada & Jaleas", "unit": "Latas", "stock": 11, "minStock": 15, "cost": 16, "supplier": "Distribuidora Dulce Sur" }
  ],
  "suppliers": [
    { "id": "prov-1", "name": "Lácteos del Oriente", "category": "Lácteos y Cremas", "phone": "+591 71024455", "email": "pedidos@lacteosoriente.bo", "city": "Santa Cruz", "status": "Activo" },
    { "id": "prov-2", "name": "Cacao Boliviano S.R.L.", "category": "Chocolatería", "phone": "+591 72198830", "email": "ventas@cacaoboliviano.bo", "city": "La Paz", "status": "Activo" },
    { "id": "prov-3", "name": "Frutas Valle Alto", "category": "Frutas Frescas", "phone": "+591 76451200", "email": "contacto@vallealto.bo", "city": "Cochabamba", "status": "Activo" },
    { "id": "prov-4", "name": "Galletería Artesanal Cruz", "category": "Conos y Canastas", "phone": "+591 78019944", "email": "ventas@galleteriacruz.bo", "city": "Santa Cruz", "status": "Activo" },
    { "id": "prov-5", "name": "Café Yungas Premium", "category": "Café de Altura", "phone": "+591 73901122", "email": "tostaduria@cafeyungas.bo", "city": "La Paz", "status": "Activo" }
  ],
  "purchases": [
    { "id": "cmp-001", "date": "2026-11-10", "supplier": "Lácteos del Oriente", "ingredientId": "ing-01", "ingredientName": "Base Láctea Artesanal Crema", "qty": 40, "total": 720, "branch": "Sucursal Centro", "status": "Recibida" },
    { "id": "cmp-002", "date": "2026-11-11", "supplier": "Galletería Artesanal Cruz", "ingredientId": "ing-04", "ingredientName": "Conos Waffle Crocantes", "qty": 200, "total": 360, "branch": "Sucursal Centro", "status": "Recibida" },
    { "id": "cmp-003", "date": "2026-11-11", "supplier": "Frutas Valle Alto", "ingredientId": "ing-03", "ingredientName": "Frutilla Fresca Seleccionada", "qty": 15, "total": 390, "branch": "Sucursal Equipetrol", "status": "Recibida" }
  ],
  "customers": [
    { "id": "cli-01", "name": "Sofía Vargas", "phone": "+591 71045520", "address": "Av. Busch #320, Barrio Equipetrol", "ordersCount": 7, "totalSpent": 412, "lastOrder": "2026-11-11" },
    { "id": "cli-02", "name": "Andrés Gutiérrez", "phone": "+591 76321890", "address": "Calle Ballivián #118, Centro", "ordersCount": 4, "totalSpent": 225, "lastOrder": "2026-11-11" },
    { "id": "cli-03", "name": "Lucía Fernández", "phone": "+591 69044112", "address": "Condominio Las Palmas, Casa 14", "ordersCount": 9, "totalSpent": 640, "lastOrder": "2026-11-10" },
    { "id": "cli-04", "name": "Mauricio Arce", "phone": "+591 78541209", "address": "Av. Alemana 3er Anillo #910", "ordersCount": 3, "totalSpent": 168, "lastOrder": "2026-11-10" }
  ],
  "orders": [
    {
      "id": "SG2026-001",
      "date": "2026-11-11",
      "time": "14:20:15",
      "customer": { "name": "Sofía Vargas", "phone": "71045520", "address": "Av. Busch #320, Equipetrol", "reference": "Portón crema frente al parque" },
      "paymentMethod": "QR",
      "deliveryMode": "delivery",
      "shippingFee": 5,
      "subtotal": 87,
      "total": 92,
      "status": "Entregado",
      "branch": "Sucursal Centro",
      "items": [
        { "productId": "sg-copa-cookie-monster", "name": "Copa Cookie Monster", "size": "Copa Clásica", "qty": 1, "unitPrice": 35, "flavors": ["Blue Ice"] },
        { "productId": "sg-milkshake-oreo", "name": "Milkshake de Oreo", "size": "Regular", "qty": 1, "unitPrice": 34, "flavors": ["Oreo Cookies & Cream"] },
        { "productId": "sg-helado-simple", "name": "Helado Simple", "size": "Cono Clásico", "qty": 1, "unitPrice": 18, "flavors": ["Frutilla Natural"] }
      ]
    },
    {
      "id": "SG2026-002",
      "date": "2026-11-11",
      "time": "16:05:42",
      "customer": { "name": "Andrés Gutiérrez", "phone": "76321890", "address": "Calle Ballivián #118, Centro", "reference": "Edificio Cristal piso 2" },
      "paymentMethod": "Efectivo",
      "deliveryMode": "delivery",
      "shippingFee": 5,
      "subtotal": 110,
      "total": 115,
      "status": "En camino",
      "branch": "Sucursal Centro",
      "items": [
        { "productId": "sg-kilo-1", "name": "Helado 1 Kilogramo (1 KL)", "size": "1 Kilogramo", "qty": 1, "unitPrice": 110, "flavors": ["Chocolate Belga", "Vainilla Cremosa", "Frutilla Natural", "Pistacho Artesanal"] }
      ]
    },
    {
      "id": "SG2026-003",
      "date": "2026-11-11",
      "time": "17:10:08",
      "customer": { "name": "Lucía Fernández", "phone": "69044112", "address": "Condominio Las Palmas, Casa 14", "reference": "Garita Norte" },
      "paymentMethod": "Tarjeta",
      "deliveryMode": "delivery",
      "shippingFee": 5,
      "subtotal": 66,
      "total": 71,
      "status": "En preparación",
      "branch": "Sucursal Equipetrol",
      "items": [
        { "productId": "sg-banana-split", "name": "Copa Banana Split", "size": "Plato Banana Split", "qty": 1, "unitPrice": 38, "flavors": ["Chocolate Belga", "Vainilla Cremosa", "Grosella"] },
        { "productId": "sg-frappe-torta", "name": "Porción de Torta Helada", "size": "Porción Individual", "qty": 1, "unitPrice": 28, "flavors": ["Crema Americana"] }
      ]
    }
  ],
  "sales": [
    { "id": "VTA-101", "date": "2026-11-11", "time": "10:45:12", "customer": "Cliente Mostrador", "method": "Efectivo", "total": 56, "branch": "Sucursal Centro", "cashier": "Carlos Méndez", "summary": "2x Helado Doble" },
    { "id": "VTA-102", "date": "2026-11-11", "time": "12:18:30", "customer": "Lucía Fernández", "method": "QR", "total": 76, "branch": "Sucursal Equipetrol", "cashier": "Mateo Mendoza", "summary": "2x Copa de la Casa" },
    { "id": "VTA-103", "date": "2026-11-11", "time": "14:20:15", "customer": "Sofía Vargas", "method": "QR", "total": 92, "branch": "Sucursal Centro", "cashier": "Carlos Méndez", "summary": "Pedido #SG2026-001" },
    { "id": "VTA-104", "date": "2026-11-11", "time": "15:40:00", "customer": "Mauricio Arce", "method": "Tarjeta", "total": 68, "branch": "Sucursal Centro", "cashier": "Carlos Méndez", "summary": "2x Milkshake de Oreo" },
    { "id": "VTA-105", "date": "2026-11-11", "time": "16:30:22", "customer": "Cliente Mostrador", "method": "Transferencia", "total": 110, "branch": "Sucursal Norte", "cashier": "Camila Rojas", "summary": "1x Helado 1 Kilogramo" },
    { "id": "VTA-106", "date": "2026-11-11", "time": "17:12:44", "customer": "Cliente Mostrador", "method": "QR", "total": 40, "branch": "Sucursal Centro", "cashier": "Carlos Méndez", "summary": "Promo 2x Frappé Pie de Limón" }
  ],
  "cashboxes": [
    {
      "id": "CAJA-20261111-01",
      "branch": "Sucursal Centro",
      "cashier": "Carlos Méndez",
      "openedAt": "2026-11-11 09:30:00",
      "closedAt": null,
      "openingAmount": 500,
      "cashSales": 286,
      "qrCardSales": 524,
      "status": "Abierta"
    },
    {
      "id": "CAJA-20261110-01",
      "branch": "Sucursal Centro",
      "cashier": "Carlos Méndez",
      "openedAt": "2026-11-10 09:30:00",
      "closedAt": "2026-11-10 22:15:00",
      "openingAmount": 500,
      "cashSales": 1120,
      "qrCardSales": 1640,
      "closingDeclared": 1620,
      "status": "Cerrada"
    }
  ],
  "events": [
    {
      "id": "EVT-9001",
      "type": "CAJA",
      "description": "Cajero abrió caja con fondo inicial de Bs. 500",
      "user": "Carlos Méndez",
      "date": "2026-11-11",
      "time": "09:30:00",
      "branch": "Sucursal Centro"
    },
    {
      "id": "EVT-9002",
      "type": "AUTH",
      "description": "Usuario inició sesión en el panel administrativo",
      "user": "Valentina Sologuren",
      "date": "2026-11-11",
      "time": "09:42:18",
      "branch": "Sucursal Centro"
    },
    {
      "id": "EVT-9003",
      "type": "ADMIN",
      "description": "Administrador actualizó stock de Conos Waffle Crocantes (+200 uds)",
      "user": "Valentina Sologuren",
      "date": "2026-11-11",
      "time": "11:15:04",
      "branch": "Sucursal Centro"
    },
    {
      "id": "EVT-9004",
      "type": "POS",
      "description": "Cliente seleccionó producto: Copa Cookie Monster",
      "user": "Sofía Vargas",
      "date": "2026-11-11",
      "time": "14:18:10",
      "branch": "Sucursal Centro"
    },
    {
      "id": "EVT-9005",
      "type": "VENTA",
      "description": "Se registró venta #SG2026-001 por Bs. 92 (Pago QR)",
      "user": "Carlos Méndez",
      "date": "2026-11-11",
      "time": "14:20:15",
      "branch": "Sucursal Centro"
    },
    {
      "id": "EVT-9006",
      "type": "CLIENTE",
      "description": "Cliente realizó pedido #SG2026-002 (Helado 1 Kilogramo)",
      "user": "Andrés Gutiérrez",
      "date": "2026-11-11",
      "time": "16:05:42",
      "branch": "Sucursal Centro"
    }
  ],
  "settings": {
    "storeName": "SOLO GELATOS",
    "slogan": "El sabor que te hace feliz",
    "defaultBranch": "Sucursal Centro",
    "currency": "Bs.",
    "shippingFee": 5,
    "freeShippingFrom": 100,
    "taxRate": 0,
    "apiMode": "demo-json-indexeddb",
    "apiBaseUrl": "https://api.sologelatos.bo/v1 (Preparado para integración REST)"
  }
}
;
})(window);
