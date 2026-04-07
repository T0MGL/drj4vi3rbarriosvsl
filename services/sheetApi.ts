import { LeadData, Lead } from '../types';

// API base - usa rutas de Vercel en producción
const API_BASE = '/api';

// Helper para enviar datos al servidor
const postToApi = async (payload: object, token?: string): Promise<boolean> => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}/leads`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        return response.ok;
    } catch (error) {
        console.error('Error enviando datos:', error);
        return false;
    }
};

export const submitLead = async (data: LeadData): Promise<boolean> => {
    try {
        // Procesar múltiples procedimientos
        let proceduresArray = [...(data.procedures || [])];

        // Si incluye "Otro procedimiento", reemplazarlo con el texto especificado
        const otroIndex = proceduresArray.indexOf('Otro procedimiento');
        if (otroIndex !== -1 && data.otherProcedure) {
            proceduresArray[otroIndex] = data.otherProcedure;
        } else if (otroIndex !== -1) {
            proceduresArray[otroIndex] = 'Otro';
        }

        // Unir procedimientos con coma para enviar al CRM/Google Sheet
        const finalProcedure = proceduresArray.length > 0
            ? proceduresArray.join(', ')
            : 'No especificado';

        // Formatear el número de WhatsApp para evitar que Google Sheets lo interprete como fórmula
        // Agregamos un apóstrofe al inicio para forzar formato texto
        const formattedWhatsapp = data.whatsapp ? `'${data.whatsapp}` : '';

        const payload = {
            action: 'create',
            id: Math.random().toString(36).substr(2, 9),
            Fecha: new Date().toLocaleString('es-PY'),
            Nombre: data.fullName,
            Whatsapp: formattedWhatsapp,
            Email: data.email,
            Ubicacion: data.location,
            Procedimiento: finalProcedure,
            Presupuesto: data.budget || '',
            Fuente: data.source,
            Motivacion: data.motivation,
            // Estados CRM
            contacted: false,
            converted: false,
            lost: false
        };

        return await postToApi(payload);
    } catch (error) {
        console.error('Error preparando lead:', error);
        return false;
    }
};

export const authenticateCRM = async (password: string): Promise<string | null> => {
    try {
        const response = await fetch(`${API_BASE}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.token;
        }
        return null;
    } catch (error) {
        console.error('Error de autenticación:', error);
        return null;
    }
};

export const getLeads = async (token: string): Promise<Lead[]> => {
    try {
        const response = await fetch(`${API_BASE}/leads`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) return [];

        // Lookup tolerante: matchea claves sin distinguir mayusculas, acentos ni espacios
        const normalizeKey = (k: string) =>
            k.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

        const pick = (item: Record<string, any>, candidates: string[]): string => {
            const normalizedItem: Record<string, any> = {};
            for (const key of Object.keys(item)) {
                normalizedItem[normalizeKey(key)] = item[key];
            }
            for (const candidate of candidates) {
                const value = normalizedItem[normalizeKey(candidate)];
                if (value !== undefined && value !== null && String(value).trim() !== '') {
                    return String(value);
                }
            }
            return '';
        };

        const pickBool = (item: Record<string, any>, candidates: string[]): boolean => {
            const raw = pick(item, candidates).toLowerCase().trim();
            return raw === 'true' || raw === 'si' || raw === 'sí' || raw === '1' || raw === 'yes';
        };

        return data.map((item: any) => ({
            id: pick(item, ['id', 'ID']) || Math.random().toString(36),
            date: pick(item, ['date', 'Fecha', 'fecha']) || new Date().toISOString(),
            name: pick(item, ['name', 'Nombre', 'nombre', 'fullName']) || 'Sin nombre',
            phone: pick(item, ['phone', 'Whatsapp', 'whatsapp', 'telefono', 'Telefono']).replace(/^'/, ''),
            email: pick(item, ['email', 'Email', 'correo', 'Correo']),
            location: pick(item, [
                'location', 'Ubicacion', 'ubicacion', 'Ubicación',
                'ciudad', 'Ciudad', 'city', 'City',
                'pais', 'Pais', 'país', 'País',
                'ciudadpais', 'CiudadPais', 'Ciudad / País', 'Ciudad/Pais'
            ]),
            procedure: pick(item, ['procedure', 'Procedimiento', 'procedimiento', 'procedimientos']),
            budget: pick(item, ['budget', 'Presupuesto', 'presupuesto']),
            source: pick(item, ['source', 'Fuente', 'fuente']),
            motivation: pick(item, ['motivation', 'Motivacion', 'motivacion', 'Motivación']),
            contacted: pickBool(item, ['contacted', 'Contactado', 'contactado']),
            converted: pickBool(item, ['converted', 'Convertido', 'convertido']),
            lost: pickBool(item, ['lost', 'Perdido', 'perdido'])
        })).reverse();

    } catch (error) {
        console.error('Error obteniendo leads:', error);
        return [];
    }
};

// --- FUNCIONES CRM ---

export const toggleLeadContacted = async (id: string, currentValue: boolean, token: string): Promise<boolean> => {
    return await postToApi({
        action: 'update',
        id,
        field: 'contacted',
        value: !currentValue,
        password: token
    });
};

export const toggleLeadConversion = async (id: string, currentValue: boolean, token: string): Promise<boolean> => {
    return await postToApi({
        action: 'update',
        id,
        field: 'converted',
        value: !currentValue,
        password: token
    });
};

export const toggleLeadLost = async (id: string, currentValue: boolean, token: string): Promise<boolean> => {
    return await postToApi({
        action: 'update',
        id,
        field: 'lost',
        value: !currentValue,
        password: token
    });
};
