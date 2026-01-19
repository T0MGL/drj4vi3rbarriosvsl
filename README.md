# Dr. Javier Barrios - Landing Page y CRM

Aplicación web para la práctica de cirugía plástica del Dr. Javier Barrios. Incluye landing page de captura de leads y panel CRM para gestión de prospectos.

## Comandos

```bash
npm install       # Instalar dependencias
npm run dev       # Servidor de desarrollo (puerto 3000)
npm run build     # Build de producción
npm run preview   # Vista previa del build
```

## Despliegue

La aplicación está configurada para desplegarse en **Vercel**.

### Variables de Entorno Requeridas

Configurar en Vercel > Settings > Environment Variables:

- `GOOGLE_SCRIPT_URL` - URL del Google Apps Script
- `CRM_PASSWORD` - Contraseña de acceso al CRM

## Estructura

- `/` - Vista Linktree con enlaces sociales
- `/landing` - Página de marketing con formulario
- `/crm` - Dashboard de gestión de leads (protegido)
