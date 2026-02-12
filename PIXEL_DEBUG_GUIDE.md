# 🔍 Guía de Debugging - Meta Pixel

## Problema Resuelto

**Issue:** Meta Pixel Helper mostraba "No pixels fired on current page"

**Causa:** El Meta Pixel se carga asíncronamente. Cuando React Router navega a `/gracias`, el código intentaba disparar eventos ANTES de que el pixel estuviera completamente cargado.

**Solución:** Implementado sistema robusto con:
- Verificación de disponibilidad de fbq con retry
- Espera hasta 5 segundos para que el pixel cargue
- Logs extensivos para debugging
- Secuencia de eventos con delays apropiados

---

## Cómo Verificar que Funciona

### 1. Abrir Consola del Navegador

1. Abrir tu sitio: `drjavierbarrios.com`
2. Presionar `F12` o clic derecho → "Inspeccionar"
3. Ir a la pestaña **Console**

### 2. Completar el Formulario

Completa el formulario y envíalo. Al llegar a `/gracias` deberías ver:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ThankYouPage montado - Iniciando tracking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

=== Meta Pixel Debug Info ===
window.fbq disponible: true
window._fbq disponible: true
Tipo de fbq: function
fbq.version: 2.0
fbq.loaded: true
============================

[Pixel] ✅ fbq ya está disponible
✅ Datos de conversión encontrados: {procedure: "...", budget: "...", ...}

[Pixel] 🚀 Iniciando secuencia de 3 eventos

[Pixel] ✅ Evento disparado: track('PageView')
[Pixel] ⏸️ Esperando 300ms antes de Lead
[Pixel] ✅ Evento disparado: track('Lead') {content_name: "...", ...}
[Pixel] ⏸️ Esperando 100ms antes de ConsultationRequested
[Pixel] ✅ Evento disparado: trackCustom('ConsultationRequested') {...}

[Pixel] ✅ Secuencia completada

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Tracking completado en /gracias
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Verificar con Meta Pixel Helper

Instala [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper)

Al llegar a `/gracias`, el icono debe mostrar:

```
✅ PageView (ID: 932741799179706)
✅ Lead (ID: 932741799179706)
   - content_name: "Rinoplastia"
   - value: 11500000
   - currency: PYG
✅ ConsultationRequested (Custom Event)
```

---

## Logs de Error Posibles

### ❌ "fbq no disponible después de 5000ms"

**Causa:** El script de Meta Pixel no se cargó correctamente

**Solución:**
1. Verificar que no haya bloqueadores de ads activos
2. Verificar conexión a internet
3. Revisar que el script esté en `index.html`

### ⚠️ "No hay datos de conversión"

**Causa:** Usuario accedió directamente a `/gracias` sin completar el formulario

**Comportamiento esperado:** Solo se dispara PageView, NO se dispara Lead

### ❌ "Error al disparar Lead"

**Causa:** Error en los parámetros del evento

**Solución:** Revisar console para ver detalles del error

---

## Secuencia de Eventos Correcta

En la página `/gracias`, los eventos se disparan en este orden:

1. **PageView** (delay: 0ms)
   - Meta detecta que estás en `/gracias`
   - El pixel marca la página como vista

2. **Lead** (delay: 300ms después de PageView)
   - Meta registra la conversión
   - Incluye datos del procedimiento, presupuesto, etc.

3. **ConsultationRequested** (delay: 100ms después de Lead)
   - Evento personalizado para analytics interno
   - Incluye todos los datos del formulario

**Total:** ~400ms para disparar todos los eventos

---

## Verificación en Meta Events Manager

1. Ir a [Meta Events Manager](https://business.facebook.com/events_manager2/)
2. Seleccionar Pixel ID: **932741799179706**
3. Ir a **Test Events** (modo debugging)
4. Completar formulario
5. Verificar que aparezcan los 3 eventos

---

## Ambiente de Desarrollo vs Producción

### Development (localhost)

**Pixel funciona:** ✅ Sí  
**Logs visibles:** ✅ Sí (todos los console.log)  
**Meta recibe eventos:** ✅ Sí

### Production (drjavierbarrios.com)

**Pixel funciona:** ✅ Sí  
**Logs visibles:** ⚠️ Algunos (logs de error siempre visibles)  
**Meta recibe eventos:** ✅ Sí

---

## Troubleshooting

### El pixel no carga en absoluto

1. **Verificar bloqueadores:**
   - Desactivar AdBlock
   - Desactivar Privacy Badger
   - Desactivar Brave Shields

2. **Verificar network:**
   - Abrir DevTools → Network
   - Buscar: `fbevents.js`
   - Debe mostrar status 200

3. **Verificar script en HTML:**
   ```bash
   curl https://drjavierbarrios.com/ | grep "fbq"
   ```
   Debe mostrar el script de Meta Pixel

### Los eventos se disparan pero Meta no los muestra

1. **Esperar 5-10 minutos:** Los eventos pueden tardar en aparecer
2. **Verificar ID del pixel:** Debe ser `932741799179706`
3. **Revisar Test Events:** Usar el modo de prueba en Events Manager

### Solo aparece PageView, no Lead

1. **Verificar console:** Debe mostrar "Datos de conversión encontrados"
2. **Si dice "No hay datos de conversión":** Usuario no completó formulario
3. **Verificar router state:** Los datos pasan vía `navigate('/gracias', {state: {...}})`

---

## Comandos Útiles de Debugging

### En Console del navegador:

```javascript
// Verificar si fbq está disponible
typeof window.fbq

// Ver versión del pixel
window.fbq.version

// Ver si está cargado
window.fbq.loaded

// Disparar evento de prueba
window.fbq('track', 'PageView')

// Ver queue de eventos
window.fbq.queue
```

---

**Última actualización:** 2026-02-12  
**Versión:** 2.0.0 - Sistema robusto con retry y debugging
