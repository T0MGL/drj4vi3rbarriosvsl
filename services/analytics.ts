/**
 * Analytics Service - Tracking de conversiones optimizado para Meta Pixel
 *
 * Envía eventos de conversión a:
 * - Meta Pixel (Facebook Ads) - Optimizado para conversiones
 * - Google Analytics 4 (si está configurado)
 */

// Tipos para los eventos
interface ConversionEvent {
  event_name: string;
  procedure?: string;
  budget?: string;
  source?: string;
  location?: string;
  timestamp: string;
}

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
      content_type: 'video',
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
 * Trackea una conversión de formulario completado
 * Este es el evento MÁS IMPORTANTE para Meta Ads - optimiza hacia este evento
 */
export const trackFormConversion = (data: {
  procedure: string;
  budget: string;
  source: string;
  location: string;
}): void => {
  const event: ConversionEvent = {
    event_name: 'lead_form_submitted',
    procedure: data.procedure,
    budget: data.budget,
    source: data.source,
    location: data.location,
    timestamp: new Date().toISOString(),
  };

  // 1. Meta Pixel - Evento LEAD optimizado
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: data.procedure,
      content_category: 'Consultation Request',
      value: getBudgetValue(data.budget),
      currency: 'PYG',
      // Parámetros adicionales para mejor segmentación
      status: 'completed',
      predicted_ltv: getBudgetValue(data.budget),
    });

    // Evento personalizado adicional para tracking interno
    window.fbq('trackCustom', 'ConsultationRequested', {
      procedure: data.procedure,
      budget_range: data.budget,
      source: data.source,
      location: data.location,
    });
  }

  // 2. Google Analytics 4 (si está configurado)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'form',
      event_label: data.procedure,
      value: getBudgetValue(data.budget),
      currency: 'PYG',
      // Custom dimensions
      procedure_type: data.procedure,
      budget_range: data.budget,
      lead_source: data.source,
      lead_location: data.location,
    });

    // Evento de conversión específico para Google Ads (si se configura)
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Reemplazar cuando se configure Google Ads
      value: getBudgetValue(data.budget),
      currency: 'PYG',
    });
  }

  // 3. Log para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] ✅ CONVERSIÓN COMPLETA:', event);
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

/**
 * Convierte el rango de presupuesto a un valor numérico para analytics
 */
const getBudgetValue = (budget: string): number => {
  const budgetMap: Record<string, number> = {
    '8.000.000 - 15.000.000': 11500000,
    '15.000.000 - 25.000.000': 20000000,
    '25.000.000 - 35.000.000': 30000000,
    '35.000.000 - 45.000.000': 40000000,
    '45.000.000 o más': 50000000,
  };
  return budgetMap[budget] || 0;
};
