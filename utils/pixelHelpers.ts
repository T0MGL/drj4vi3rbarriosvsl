/**
 * Helpers para Meta Pixel - Manejo robusto de timing y disponibilidad
 *
 * PROBLEMA RESUELTO:
 * El Meta Pixel se carga asíncronamente, lo que puede causar que no esté
 * disponible inmediatamente cuando React Router navega a una nueva ruta.
 *
 * Este helper espera hasta que fbq esté completamente cargado antes de
 * intentar disparar eventos.
 */

/**
 * Espera a que Meta Pixel (fbq) esté disponible
 * @param timeout Tiempo máximo de espera en ms (default: 5000ms)
 * @param interval Intervalo de verificación en ms (default: 100ms)
 * @returns Promise que se resuelve cuando fbq está disponible
 */
export const waitForFbq = (timeout = 5000, interval = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    // Si no estamos en el navegador, resolver false
    if (typeof window === 'undefined') {
      console.warn('[Pixel] No estamos en navegador, fbq no disponible');
      resolve(false);
      return;
    }

    // Si fbq ya está disponible, resolver inmediatamente
    if (window.fbq && typeof window.fbq === 'function') {
      console.log('[Pixel] ✅ fbq ya está disponible');
      resolve(true);
      return;
    }

    console.log('[Pixel] ⏳ Esperando a que fbq esté disponible...');

    let elapsed = 0;
    const checkInterval = setInterval(() => {
      elapsed += interval;

      // Verificar si fbq está disponible
      if (window.fbq && typeof window.fbq === 'function') {
        console.log(`[Pixel] ✅ fbq disponible después de ${elapsed}ms`);
        clearInterval(checkInterval);
        resolve(true);
        return;
      }

      // Si se agotó el tiempo, resolver false
      if (elapsed >= timeout) {
        console.error(`[Pixel] ❌ Timeout: fbq no disponible después de ${timeout}ms`);
        clearInterval(checkInterval);
        resolve(false);
      }
    }, interval);
  });
};

/**
 * Dispara un evento de Meta Pixel de forma segura
 * Espera a que fbq esté disponible antes de disparar
 *
 * @param eventType Tipo de evento ('track' o 'trackCustom')
 * @param eventName Nombre del evento
 * @param parameters Parámetros del evento
 */
export const safeTrackPixelEvent = async (
  eventType: 'track' | 'trackCustom',
  eventName: string,
  parameters?: Record<string, unknown>
): Promise<boolean> => {
  // Esperar a que fbq esté disponible
  const fbqAvailable = await waitForFbq();

  if (!fbqAvailable) {
    console.error(`[Pixel] ❌ No se pudo disparar ${eventName} - fbq no disponible`);
    return false;
  }

  try {
    // Disparar el evento
    if (parameters) {
      window.fbq!(eventType, eventName, parameters);
    } else {
      window.fbq!(eventType, eventName);
    }

    console.log(`[Pixel] ✅ Evento disparado: ${eventType}('${eventName}')`, parameters || '');
    return true;
  } catch (error) {
    console.error(`[Pixel] ❌ Error al disparar ${eventName}:`, error);
    return false;
  }
};

/**
 * Dispara múltiples eventos en secuencia
 * Útil para disparar PageView seguido de Lead
 *
 * @param events Array de eventos a disparar
 */
export const trackPixelSequence = async (
  events: Array<{
    type: 'track' | 'trackCustom';
    name: string;
    params?: Record<string, unknown>;
    delay?: number; // Delay antes de este evento en ms
  }>
): Promise<void> => {
  console.log(`[Pixel] 🚀 Iniciando secuencia de ${events.length} eventos`);

  for (const event of events) {
    // Aplicar delay si está especificado
    if (event.delay) {
      console.log(`[Pixel] ⏸️ Esperando ${event.delay}ms antes de ${event.name}`);
      await new Promise(resolve => setTimeout(resolve, event.delay));
    }

    // Disparar el evento
    await safeTrackPixelEvent(event.type, event.name, event.params);
  }

  console.log('[Pixel] ✅ Secuencia completada');
};

/**
 * Verifica si Meta Pixel está instalado y funcionando
 * Útil para debugging
 */
export const debugPixelStatus = (): void => {
  console.log('=== Meta Pixel Debug Info ===');
  console.log('window.fbq disponible:', typeof window !== 'undefined' && !!window.fbq);
  console.log('window._fbq disponible:', typeof window !== 'undefined' && !!(window as any)._fbq);

  if (typeof window !== 'undefined' && window.fbq) {
    console.log('Tipo de fbq:', typeof window.fbq);
    console.log('fbq.version:', (window.fbq as any).version);
    console.log('fbq.loaded:', (window.fbq as any).loaded);
  }
  console.log('============================');
};
