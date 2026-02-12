# 🚀 Checklist de Deployment - Production Ready

## ✅ COMPLETADO - Listo para Producción

### 🎯 Conversión de Meta Ads

- ✅ **Conversión se dispara AL LLEGAR a `/gracias`** (no al enviar formulario)
- ✅ Datos del formulario pasan vía router state
- ✅ Meta Pixel correctamente configurado (ID: 932741799179706)
- ✅ Eventos de tracking implementados (PageView, Lead, InitiateCheckout)

### 🔧 Configuración Técnica

- ✅ React Router Dom instalado y configurado
- ✅ SPA routing configurado en vercel.json
- ✅ Build exitoso sin errores
- ✅ TypeScript sin errores de compilación
- ✅ Headers de seguridad configurados

### 📁 Archivos Críticos

- ✅ `/components/ThankYouPage.tsx` - Página de conversión
- ✅ `/components/ConsultationForm.tsx` - Formulario con redirección
- ✅ `/App.tsx` - Router configurado
- ✅ `/vercel.json` - Configuración de Vercel
- ✅ `/services/analytics.ts` - Tracking de Meta Pixel
- ✅ `/api/leads.ts` - API de Google Sheets
- ✅ `/api/auth.ts` - Autenticación CRM

### 🔐 Variables de Entorno Requeridas

Configurar en Vercel Dashboard (Settings → Environment Variables):

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
CRM_PASSWORD=tu_password_secreto_aqui
```

### 🌐 URLs Finales

- **Landing:** `https://drjavierbarrios.com/`
- **Conversión:** `https://drjavierbarrios.com/gracias`
- **CRM:** `https://drjavierbarrios.com/crm`

## 📊 Pasos Post-Deployment

### 1. Verificar Rutas (Inmediatamente después del deploy)

```bash
✓ curl -I https://drjavierbarrios.com/
✓ curl -I https://drjavierbarrios.com/gracias
✓ curl -I https://drjavierbarrios.com/crm
```

Todas deben retornar **200 OK**

### 2. Verificar Meta Pixel (Chrome DevTools)

1. Abrir https://drjavierbarrios.com/
2. F12 → Console
3. Escribir: `fbq` (debe mostrar función fbq)
4. Completar formulario de prueba
5. Al llegar a `/gracias`, verificar en Console:
   ```
   [Analytics] ✅ CONVERSIÓN COMPLETA: {...}
   🎯 CONVERSIÓN DISPARADA EN /gracias: {...}
   ```

### 3. Verificar con Meta Pixel Helper

1. Instalar: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper)
2. Visitar landing
3. Completar formulario
4. En `/gracias` debe mostrar:
   - ✅ PageView
   - ✅ Lead (con datos del formulario)
   - ✅ ConsultationRequested

### 4. Configurar Conversión en Meta Ads Manager

1. Ir a [Meta Events Manager](https://business.facebook.com/events_manager2/)
2. Seleccionar Pixel: **932741799179706**
3. Ir a **Conversiones personalizadas** → **Crear conversión personalizada**
4. Configurar:
   - Nombre: `Lead Formulario Completado`
   - URL contiene: `/gracias`
   - Evento: `Lead`
   - ✅ Activar

5. En tus campañas:
   - Objetivo: Generación de Leads
   - Evento de conversión: `Lead`
   - Optimizar para: `Lead`

### 5. Test de Conversión Completo

**Flujo esperado:**

1. ✅ Entrar a landing → `PageView` disparado
2. ✅ Ver video → `ViewContent` disparado
3. ✅ Abrir formulario → `InitiateCheckout` disparado
4. ✅ Completar pasos → `FormStepCompleted` disparado
5. ✅ Enviar formulario → Redirección a `/gracias`
6. ✅ Llegar a `/gracias` → **`Lead` disparado** 🎯
7. ✅ Datos guardados en Google Sheets

### 6. Verificar Google Sheets

1. Abrir tu Google Sheet del CRM
2. Verificar que aparezca el lead de prueba con:
   - Fecha y hora
   - Nombre completo
   - WhatsApp (con ' al inicio)
   - Email
   - Ubicación
   - Procedimiento(s)
   - Presupuesto
   - Fuente
   - Motivación

### 7. Monitoreo Continuo

**Primeras 24 horas:**
- Revisar Meta Events Manager cada 2-4 horas
- Verificar que los leads lleguen al CRM
- Comparar cantidad de eventos `Lead` vs leads en Google Sheets

**Primera semana:**
- Monitorear discrepancia de conversiones
- Ajustar pujas si es necesario
- Verificar calidad de leads

## 🔴 Red Flags - Revisar si ocurre

❌ **Evento Lead se dispara en `/` en lugar de `/gracias`**
→ Verificar que trackFormConversion esté en ThankYouPage.tsx, NO en ConsultationForm.tsx

❌ **404 al acceder a `/gracias` directamente**
→ Verificar que vercel.json esté deployado correctamente

❌ **Conversiones en Meta pero no llegan leads al CRM**
→ Verificar variables de entorno en Vercel
→ Revisar logs de `/api/leads`

❌ **Leads llegan al CRM pero no se registran en Meta**
→ Verificar que Meta Pixel Helper muestre eventos
→ Revisar ID del pixel en index.html

## ✅ Success Metrics

**Después de deployment exitoso:**

- ✅ Conversiones de Meta = Leads en CRM (± 5%)
- ✅ Tasa de conversión realista (2-8% típicamente)
- ✅ No hay leads "fantasma" en Meta
- ✅ Todos los datos del formulario llegan completos al CRM

## 📞 Contactos de Emergencia

Si algo falla:
1. Revisar Vercel Logs: https://vercel.com/dashboard
2. Meta Events Manager → Test Events
3. Google Apps Script → Logs

---

**Fecha de deployment:** 2026-02-12  
**Versión:** 1.0.0 - Conversión optimizada  
**Desarrollado por:** Claude Code  
**Cliente:** Dr. Javier Barrios - Cirugía Plástica
