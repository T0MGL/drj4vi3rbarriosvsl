# 📊 Meta Pixel - Configuración Completa

## ✅ Estado Actual: COMPLETAMENTE IMPLEMENTADO

El Meta Pixel está **100% funcional y optimizado** para conversiones en tu sitio web.

---

## 🎯 Eventos de Conversión Implementados

### 1. **PageView** (Automático)
- **Cuándo se dispara:** Al cargar cualquier página
- **Propósito:** Medir alcance y audiencia total
- **Ubicación:** `index.html:58` (pixel base)

### 2. **ViewContent** 🎥
- **Cuándo se dispara:** Cuando el usuario reproduce el video VSL
- **Propósito:** Medir engagement con el contenido principal
- **Ubicación:** `LandingPage.tsx:144-155` + `analytics.ts:32-50`
- **Parámetros:**
  - `content_name`: "Video Presentación Dr. Javier Barrios"
  - `content_type`: "video"
  - `content_category`: "VSL"

### 3. **InitiateCheckout** 📋
- **Cuándo se dispara:** Cuando el usuario abre el formulario de consulta
- **Propósito:** Medir intención de conversión (inicio del funnel)
- **Ubicación:** `LandingPage.tsx:97` + `analytics.ts:52-71`
- **Parámetros:**
  - `content_name`: "Formulario de Consulta"
  - `content_category`: "Lead Form"

### 4. **Lead** 🎉 (EVENTO PRINCIPAL)
- **Cuándo se dispara:** Cuando el usuario completa el formulario
- **Propósito:** **CONVERSIÓN PRINCIPAL** - optimiza campañas hacia este evento
- **Ubicación:** `ConsultationForm.tsx:212-217` + `analytics.ts:78-109`
- **Parámetros optimizados:**
  - `content_name`: Procedimiento seleccionado
  - `content_category`: "Consultation Request"
  - `value`: Valor del presupuesto (en PYG)
  - `currency`: "PYG"
  - `status`: "completed"
  - `predicted_ltv`: Valor de vida del cliente estimado

### 5. **ConsultationRequested** (Evento Personalizado)
- **Cuándo se dispara:** Junto con el evento Lead
- **Propósito:** Tracking interno con datos adicionales
- **Parámetros:**
  - `procedure`: Procedimiento seleccionado
  - `budget_range`: Rango de presupuesto
  - `source`: Fuente de referencia
  - `location`: Ubicación del cliente

### 6. **FormStarted** (Evento Personalizado)
- **Cuándo se dispara:** Cuando el usuario completa el primer paso del formulario
- **Propósito:** Medir abandono temprano del formulario

### 7. **FormStepCompleted** (Evento Personalizado)
- **Cuándo se dispara:** En cada paso del formulario (5 pasos totales)
- **Propósito:** Análisis detallado del funnel, identificar dónde abandonan

---

## 🔧 Configuración en Vercel

### Opción 1: Usando el ID hardcodeado (RECOMENDADO - YA ESTÁ LISTO)
El pixel ya está activo con el ID: **932741799179706**

No necesitas configurar nada en Vercel. ✅

### Opción 2: Usando variables de entorno (para múltiples entornos)
Si quieres diferentes IDs para desarrollo/producción:

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega:
   ```
   Nombre: NEXT_PUBLIC_META_PIXEL_ID
   Valor: 932741799179706
   ```
4. Selecciona los entornos: Production, Preview, Development
5. Guarda y redeploy

---

## 🧪 Cómo Verificar que Funciona

### Método 1: Meta Pixel Helper (Chrome Extension)
1. Instala la extensión: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Ve a tu sitio web: https://drjavierbarrios.com
3. Haz clic en el ícono de la extensión
4. Deberías ver:
   - ✅ Pixel detectado: 932741799179706
   - ✅ PageView disparado automáticamente

5. Reproduce el video → Verifica evento **ViewContent**
6. Abre el formulario → Verifica evento **InitiateCheckout**
7. Completa el formulario → Verifica evento **Lead**

### Método 2: Events Manager en Meta Business Suite
1. Ve a [Meta Business Suite](https://business.facebook.com)
2. Menú > Todos los eventos > Conjuntos de datos
3. Selecciona tu pixel: 932741799179706
4. Ve a la pestaña "Test Events" o "Eventos de prueba"
5. Navega por tu sitio y verás los eventos en tiempo real

### Método 3: Consola del Navegador (Modo Desarrollo)
1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Deberías ver logs de analytics:
   ```
   [Analytics] Video view tracked
   [Analytics] Form initiated tracked
   [Analytics] ✅ CONVERSIÓN COMPLETA: {...}
   ```

---

## 📈 Configuración de Campañas en Meta Ads

### Paso 1: Verificar el Pixel
1. Meta Business Suite > Configuración de eventos
2. Verifica que el pixel esté "Activo" y recibiendo eventos
3. Espera al menos **20 conversiones** antes de optimizar campañas

### Paso 2: Crear Audiencias Personalizadas
Puedes crear audiencias basadas en:
- **Visitantes del video**: `ViewContent` en últimos 7/14/30 días
- **Usuarios que iniciaron formulario**: `InitiateCheckout` últimos 7 días
- **Leads completados**: `Lead` últimos 30/60/90 días

### Paso 3: Configurar Optimización de Campaña
En tu campaña de Meta Ads:
1. Objetivo: **Generación de Clientes Potenciales**
2. Evento de conversión: **Lead** (el más importante)
3. Estrategia de oferta: Optimizar para conversiones
4. Ventana de atribución: 7 días de clic, 1 día de visualización

### Paso 4: Crear Audiencias Similares (Lookalike)
Una vez tengas 50+ conversiones:
1. Crea audiencia similar basada en evento **Lead**
2. Usa 1%-3% del país objetivo (Paraguay)
3. Meta encontrará personas similares a tus mejores clientes

---

## 🎨 Funnel de Conversión Completo

```
1. Usuario visita la página
   ↓
   📊 PageView (Meta registra visita)

2. Usuario reproduce el video
   ↓
   🎥 ViewContent (Meta detecta interés)

3. Usuario abre el formulario
   ↓
   📋 InitiateCheckout (Meta detecta intención)

4. Usuario completa paso 1
   ↓
   📝 FormStarted (tracking interno)

5. Usuario completa cada paso
   ↓
   ⬆️ FormStepCompleted (análisis de abandono)

6. Usuario envía el formulario
   ↓
   🎉 Lead + ConsultationRequested (CONVERSIÓN!)
```

---

## 🔍 Troubleshooting

### "No veo eventos en Meta Events Manager"
1. Verifica que el pixel esté instalado con Meta Pixel Helper
2. Limpia caché del navegador
3. Espera 10-15 minutos (puede haber delay)
4. Verifica que no haya AdBlockers activos

### "Los eventos se disparan múltiples veces"
- Esto es normal en desarrollo (React StrictMode)
- En producción cada evento se dispara una sola vez
- Verificar con `hasTrackedView` flag en el código

### "El valor de conversión no aparece"
- Verifica que el usuario haya seleccionado un presupuesto
- El valor se calcula automáticamente en `getBudgetValue()`
- Revisa la consola en modo desarrollo

---

## 📊 Métricas Clave a Monitorear

### En Meta Ads Manager:
- **CTR** (Click-Through Rate): >1.5% es bueno
- **Costo por Lead**: Benchmark para tu industria
- **Tasa de conversión del sitio**: % de visitantes que completan formulario
- **ROAS** (Return on Ad Spend): Una vez que tengas datos de ventas reales

### En Meta Events Manager:
- **Total de eventos Lead**: Conversiones totales
- **Tasa de eventos InitiateCheckout → Lead**: % que completa el formulario
- **Tasa de eventos ViewContent → Lead**: % que convierte después de ver video

---

## ✅ Checklist de Implementación Completa

- [x] Meta Pixel instalado en `index.html`
- [x] Evento PageView automático
- [x] Evento ViewContent en reproducción de video
- [x] Evento InitiateCheckout al abrir formulario
- [x] Evento Lead al completar formulario
- [x] Eventos personalizados (FormStarted, FormStepCompleted)
- [x] Parámetros de conversión optimizados (value, currency, etc.)
- [x] Tracking de abandono del funnel
- [x] Compatibilidad con Google Analytics 4
- [x] Logs de debug en modo desarrollo
- [x] Documentación completa

---

## 🚀 Próximos Pasos Recomendados

1. **Verificar eventos** con Meta Pixel Helper (HOY)
2. **Monitorear** eventos en Meta Events Manager por 7 días
3. **Crear audiencias personalizadas** cuando tengas 20+ eventos
4. **Crear audiencias similares** cuando tengas 50+ conversiones
5. **Optimizar campañas** hacia el evento Lead
6. **Configurar conversiones personalizadas** en Meta Ads si es necesario
7. **A/B testing** de diferentes creatividades y copys

---

## 📞 Soporte

Si tienes dudas sobre:
- **Implementación técnica**: Revisa este documento o el código en `services/analytics.ts`
- **Configuración de Meta Ads**: [Meta Business Help Center](https://www.facebook.com/business/help)
- **Optimización de campañas**: Consulta con tu especialista en Meta Ads

---

**Última actualización:** 2026-02-08
**Estado:** ✅ Producción - Completamente funcional
**Pixel ID:** 932741799179706
