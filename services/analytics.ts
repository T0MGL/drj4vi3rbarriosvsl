/**
 * Analytics Service - Tracking de conversiones optimizado para Meta Pixel
 *
 * Envía eventos de conversión a:
 * - Meta Pixel (Facebook Ads) - Optimizado para conversiones
 * - Google Analytics 4 (si está configurado)
 */

// Declaración de gtag y fbq para TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
    fbq?: (
      command: 'track' | 'trackCustom',
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Trackea cuando el usuario ve el video VSL (Video Sales Letter)
 * Importante para medir engagement y optimizar campañas de Meta
 */
export const trackVideoView = (): void => {
  // Meta Pixel - ViewContent es clave para optimización del algoritmo
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: 'Video Presentación Dr. Javier Barrios',
      content_type: 'product', // Meta Pixel requiere 'product' o 'product_group'
      content_category: 'VSL',
    });
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_start', {
      event_category: 'engagement',
      event_label: 'VSL',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Video view tracked');
  }
};

/**
 * Trackea cuando el usuario abre el formulario
 * Meta lo usa para calcular la tasa de conversión del funnel
 */
export const trackFormInitiated = (): void => {
  // Meta Pixel - InitiateCheckout indica intención de conversión
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: 'Formulario de Consulta',
      content_category: 'Lead Form',
    });
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      event_category: 'form',
      event_label: 'consultation_form_opened',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Form initiated tracked');
  }
};

/**
 * Trackea el inicio del formulario (primer paso completado)
 * Útil para medir abandono en el funnel
 */
export const trackFormStart = (): void => {
  // Meta Pixel - Evento personalizado
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'FormStarted', {
      form_name: 'Consultation Form',
      step: 1,
    });
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_start', {
      event_category: 'form',
      event_label: 'consultation_form_started',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Form started');
  }
};

/**
 * Trackea cada paso del formulario (para análisis de funnel)
 * Meta usa esto para entender dónde abandonan los usuarios
 */
export const trackFormStep = (step: number, stepName: string): void => {
  // Meta Pixel - Evento personalizado para cada paso
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'FormStepCompleted', {
      step_number: step,
      step_name: stepName,
      form_name: 'Consultation Form',
    });
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_step_completed', {
      event_category: 'form',
      event_label: stepName,
      value: step,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Form step ${step} (${stepName}) completed`);
  }
};

