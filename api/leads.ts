import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!;
const CRM_PASSWORD = process.env.CRM_PASSWORD!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar autenticación para GET (lectura de datos)
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${CRM_PASSWORD}`) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${Date.now()}`);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
  }

  // POST - crear o actualizar lead
  if (req.method === 'POST') {
    const { action, password } = req.body;

    // Para acciones de update, verificar contraseña
    if (action === 'update') {
      if (password !== CRM_PASSWORD) {
        return res.status(401).json({ error: 'No autorizado' });
      }
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(req.body),
      });

      // Google Scripts redirige, pero los datos llegan
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Error al enviar datos' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
