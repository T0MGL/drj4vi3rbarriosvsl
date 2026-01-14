/**
 * Analytics Service - Tracking de conversiones
 *
 * Envía eventos de conversión a Google Analytics 4 (si está configurado)
 * y almacena métricas localmente para el CRM.
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

// Declaración de gtag para TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Trackea una conversión de formulario completado
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

  // 1. Enviar a Google Analytics 4 (si está configurado)
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

  // 2. Enviar a Facebook Pixel (si está configurado)
  if (typeof window !== 'undefined' && (window as unknown as { fbq?: Function }).fbq) {
    (window as unknown as { fbq: Function }).fbq('track', 'Lead', {
      content_name: data.procedure,
      content_category: 'Consultation Request',
      value: getBudgetValue(data.budget),
      currency: 'PYG',
    });
  }

  // 3. Log para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Conversion tracked:', event);
  }
};

/**
 * Trackea el inicio del formulario (para medir abandono)
 */
export const trackFormStart = (): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      event_category: 'form',
      event_label: 'consultation_form_started',
    });
  }
};

/**
 * Trackea cada paso del formulario (para análisis de funnel)
 */
export const trackFormStep = (step: number, stepName: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_step_completed', {
      event_category: 'form',
      event_label: stepName,
      value: step,
    });
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
