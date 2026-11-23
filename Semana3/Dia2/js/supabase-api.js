// Semana 3 - Backend Supabase Multi-Tenant y Offline-First
const SUPABASE_URL = 'https://bmcdlimkoxnlyqeyksdk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ci-J9b7yQEoYOqxbm3IDMA_DrOTWRr-';
const PROYECTO_ACTUAL = 'solo_gelatos';
const CLAVE_SESION = `sesionActiva_${PROYECTO_ACTUAL}`;
const CLAVE_COLA = `colaSincronizacion_${PROYECTO_ACTUAL}`;
const TABLAS_OFICIALES = [
  'cuentas',
  'pedidos',
  'reservas',
  'productos_extra',
  'consultas',
  'promociones',
  'actividad_clientes'
];

const CUENTAS_DEMO = [
  { id: 'demo-cli', proyecto: PROYECTO_ACTUAL, nombre: 'Camila Rojas', correo: 'cliente@sologelatos.bo', password: '1234', rol: 'cliente' },
  { id: 'demo-enc', proyecto: PROYECTO_ACTUAL, nombre: 'Mateo Paredes', correo: 'encargado@sologelatos.bo', password: '1234', rol: 'encargado' },
  { id: 'demo-adm', proyecto: PROYECTO_ACTUAL, nombre: 'Administrador', correo: 'admin@sologelatos.bo', password: '1234', rol: 'admin' }
];

const PROMO_INICIAL = [
  {
    id: 'promo-local-1',
    proyecto: PROYECTO_ACTUAL,
    titulo: '2x1 en Copas Artesanales de Fruta',
    descripcion: 'Válido hoy en pedidos web y retiro en sucursal Central.',
    descuento: '20% OFF',
    activa: true
  }
];

const MEMORIA_RESPALDO = { session: {}, local: {} };

function obtenerStorageSeguro(tipo) {
  try {
    const st = tipo === 'session' ? window.sessionStorage : window.localStorage;
    const prueba = '__sg_test__';
    st.setItem(prueba, '1');
    st.removeItem(prueba);
    return st;
  } catch (_) {
    const mem = tipo === 'session' ? MEMORIA_RESPALDO.session : MEMORIA_RESPALDO.local;
    return {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v); },
      removeItem: (k) => { delete mem[k]; }
    };
  }
}

function leerJson(tipoStorage, clave, respaldo) {
  try {
    const raw = obtenerStorageSeguro(tipoStorage).getItem(clave);
    return raw ? JSON.parse(raw) : respaldo;
  } catch (_) {
    return respaldo;
  }
}

function guardarJson(tipoStorage, clave, valor) {
  try {
    obtenerStorageSeguro(tipoStorage).setItem(clave, JSON.stringify(valor));
    return true;
  } catch (_) {
    return false;
  }
}

function headersSupabase(prefer) {
  const h = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

function claveCacheTabla(tabla) {
  return `sg_cache_${PROYECTO_ACTUAL}_${tabla}`;
}

function leerCacheTabla(tabla) {
  const defecto = tabla === 'promociones' ? PROMO_INICIAL : (tabla === 'cuentas' ? CUENTAS_DEMO : []);
  return leerJson('local', claveCacheTabla(tabla), defecto);
}

function guardarCacheTabla(tabla, lista) {
  guardarJson('local', claveCacheTabla(tabla), lista);
}

function getSesion() {
  const activa = leerJson('session', CLAVE_SESION, null);
  if (activa && activa.rol) return activa;
  return { nombre: 'Invitado', correo: 'invitado@sologelatos.bo', rol: 'cliente', invitado: true };
}

function setSesion(usuario) {
  const limpio = {
    nombre: String(usuario.nombre || 'Usuario').trim(),
    correo: String(usuario.correo || '').trim().toLowerCase(),
    rol: ['cliente', 'encargado', 'admin'].includes(usuario.rol) ? usuario.rol : 'cliente',
    invitado: Boolean(usuario.invitado)
  };
  guardarJson('session', CLAVE_SESION, limpio);
  return limpio;
}

function cerrarSesion() {
  try { obtenerStorageSeguro('session').removeItem(CLAVE_SESION); } catch (_) {}
  return getSesion();
}

function getCola() {
  return leerJson('local', CLAVE_COLA, []);
}

function encolarOperacion(operacion) {
  const cola = getCola();
  cola.push({ ...operacion, timestamp: Date.now() });
  guardarJson('local', CLAVE_COLA, cola);
  actualizarEstadoConexion();
}

async function consultarTabla(tabla) {
  const locales = leerCacheTabla(tabla);
  if (!navigator.onLine) return locales;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 3500) : null;
  try {
    const url = `${SUPABASE_URL}/rest/v1/${tabla}?proyecto=eq.${encodeURIComponent(PROYECTO_ACTUAL)}&order=id.desc`;
    const res = await fetch(url, {
      method: 'GET',
      headers: headersSupabase(),
      signal: controller ? controller.signal : undefined
    });
    if (timer) clearTimeout(timer);
    if (!res.ok) return locales;
    const remotos = await res.json();
    if (Array.isArray(remotos)) {
      if (remotos.length > 0) {
        guardarCacheTabla(tabla, remotos);
        return remotos;
      }
      return locales;
    }
    return locales;
  } catch (_) {
    if (timer) clearTimeout(timer);
    return locales;
  }
}

async function insertarRegistro(tabla, datos) {
  const registro = { ...datos, proyecto: PROYECTO_ACTUAL };
  const locales = leerCacheTabla(tabla);
  const registroLocal = { id: `loc-${Date.now()}-${Math.floor(Math.random() * 1000)}`, ...registro, creado_en: new Date().toISOString() };
  guardarCacheTabla(tabla, [registroLocal, ...locales]);

  if (!navigator.onLine) {
    encolarOperacion({ metodo: 'POST', tabla, datos: registro });
    return { ok: true, offline: true, data: registroLocal };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabla}`, {
      method: 'POST',
      headers: headersSupabase('return=representation'),
      body: JSON.stringify(registro)
    });
    if (!res.ok) {
      encolarOperacion({ metodo: 'POST', tabla, datos: registro });
      return { ok: true, offline: true, data: registroLocal };
    }
    const creado = await res.json();
    const fila = Array.isArray(creado) && creado[0] ? creado[0] : registroLocal;
    guardarCacheTabla(tabla, [fila, ...locales]);
    return { ok: true, offline: false, data: fila };
  } catch (_) {
    encolarOperacion({ metodo: 'POST', tabla, datos: registro });
    return { ok: true, offline: true, data: registroLocal };
  }
}

async function actualizarRegistro(tabla, id, cambios) {
  const locales = leerCacheTabla(tabla).map((item) => (
    String(item.id) === String(id) ? { ...item, ...cambios } : item
  ));
  guardarCacheTabla(tabla, locales);

  const esLocal = String(id).startsWith('loc-') || String(id).startsWith('promo-local-');
  if (!navigator.onLine || esLocal) {
    if (!esLocal) encolarOperacion({ metodo: 'PATCH', tabla, id, datos: cambios });
    return { ok: true, offline: true };
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/${tabla}?id=eq.${encodeURIComponent(id)}&proyecto=eq.${encodeURIComponent(PROYECTO_ACTUAL)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: headersSupabase('return=representation'),
      body: JSON.stringify(cambios)
    });
    if (!res.ok) {
      encolarOperacion({ metodo: 'PATCH', tabla, id, datos: cambios });
      return { ok: true, offline: true };
    }
    return { ok: true, offline: false };
  } catch (_) {
    encolarOperacion({ metodo: 'PATCH', tabla, id, datos: cambios });
    return { ok: true, offline: true };
  }
}

async function sincronizarCola() {
  if (!navigator.onLine) return 0;
  const cola = getCola();
  if (!cola.length) return 0;
  const pendientes = [];
  let sincronizados = 0;

  for (const op of cola) {
    try {
      const esPatch = op.metodo === 'PATCH' && op.id;
      const url = esPatch
        ? `${SUPABASE_URL}/rest/v1/${op.tabla}?id=eq.${encodeURIComponent(op.id)}&proyecto=eq.${encodeURIComponent(PROYECTO_ACTUAL)}`
        : `${SUPABASE_URL}/rest/v1/${op.tabla}`;
      const res = await fetch(url, {
        method: esPatch ? 'PATCH' : 'POST',
        headers: headersSupabase('return=minimal'),
        body: JSON.stringify(op.datos)
      });
      if (res.ok) sincronizados += 1;
      else pendientes.push(op);
    } catch (_) {
      pendientes.push(op);
    }
  }
  guardarJson('local', CLAVE_COLA, pendientes);
  actualizarEstadoConexion();
  return sincronizados;
}

async function registrarActividad(accion, detalle) {
  const sesion = getSesion();
  return insertarRegistro('actividad_clientes', {
    usuario: sesion.nombre,
    accion: String(accion || 'INTERACCION'),
    detalle: String(detalle || '')
  });
}

async function iniciarSesionCuenta(correo, password) {
  const mail = String(correo || '').trim().toLowerCase();
  const pass = String(password || '').trim();
  const cuentasRemotas = await consultarTabla('cuentas');
  const todas = [...cuentasRemotas, ...CUENTAS_DEMO];
  const encontrada = todas.find((c) => (
    String(c.correo || '').toLowerCase() === mail &&
    String(c.password || c.clave || '') === pass
  ));
  if (!encontrada) return null;
  return setSesion({
    nombre: encontrada.nombre,
    correo: encontrada.correo,
    rol: encontrada.rol,
    invitado: false
  });
}

async function registrarCuenta({ nombre, correo, password, rol }) {
  const nueva = {
    nombre: String(nombre || '').trim(),
    correo: String(correo || '').trim().toLowerCase(),
    password: String(password || '').trim(),
    rol: ['cliente', 'encargado', 'admin'].includes(rol) ? rol : 'cliente'
  };
  await insertarRegistro('cuentas', nueva);
  return setSesion({ ...nueva, invitado: false });
}

function actualizarEstadoConexion() {
  const badge = document.getElementById('badgeConexion');
  if (!badge) return;
  const colaLen = getCola().length;
  if (navigator.onLine) {
    badge.classList.remove('offline');
    badge.textContent = 'ONLINE';
    badge.title = colaLen > 0 ? `En línea (${colaLen} pendientes por sincronizar)` : 'Conectado en línea';
  } else {
    badge.classList.add('offline');
    badge.textContent = 'OFFLINE';
    badge.title = colaLen > 0 ? `Sin conexión (${colaLen} en cola local)` : 'Modo sin conexión';
  }
}

window.addEventListener('online', () => {
  actualizarEstadoConexion();
  sincronizarCola();
});
window.addEventListener('offline', actualizarEstadoConexion);
document.addEventListener('DOMContentLoaded', () => {
  actualizarEstadoConexion();
  if (navigator.onLine) sincronizarCola();
});

window.SupabaseAPI = {
  SUPABASE_URL,
  SUPABASE_KEY,
  PROYECTO_ACTUAL,
  TABLAS_OFICIALES,
  CUENTAS_DEMO,
  getSesion,
  setSesion,
  cerrarSesion,
  getCola,
  encolarOperacion,
  sincronizarCola,
  consultarTabla,
  insertarRegistro,
  actualizarRegistro,
  registrarActividad,
  iniciarSesionCuenta,
  registrarCuenta,
  actualizarEstadoConexion
};
