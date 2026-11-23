// Semana 3 - Backend Supabase Multi-Tenant y Offline-First
const SUPABASE_URL = 'https://bmcdlimkoxnlyqeyksdk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ci-J9b7yQEoYOqxbm3IDMA_DrOTWRr-';
const PROYECTO_ACTUAL = 'solo_gelatos';
const CLAVE_COLA = `colaSincronizacion_${PROYECTO_ACTUAL}`;
const salida = document.getElementById('salidaSupa');

document.getElementById('btnConsultarSupa').addEventListener('click', async () => {
  salida.textContent = 'Consultando tabla promociones...';
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/promociones?proyecto=eq.${PROYECTO_ACTUAL}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const datos = res.ok ? await res.json() : [];
    salida.textContent = `Proyecto: ${PROYECTO_ACTUAL} | Registros recibidos: ${Array.isArray(datos) ? datos.length : 0}`;
  } catch (_) {
    salida.textContent = 'Sin conexión: modo respaldo offline activo.';
  }
});

document.getElementById('btnEncolarFifo').addEventListener('click', () => {
  const cola = JSON.parse(localStorage.getItem(CLAVE_COLA) || '[]');
  cola.push({ tabla: 'reservas', proyecto: PROYECTO_ACTUAL, timestamp: Date.now() });
  localStorage.setItem(CLAVE_COLA, JSON.stringify(cola));
  salida.textContent = `Operación agregada a ${CLAVE_COLA}. Total en cola FIFO: ${cola.length}`;
});
