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
        const finalProcedure = data.procedure === 'Otro procedimiento'
          ? (data.otherProcedure || 'Otro')
          : (data.procedure || 'No especificado');

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

        return data.map((item: any) => ({
            id: item.id || Math.random().toString(36),
            date: item.date || item.Fecha || new Date().toISOString(),
            name: item.name || item.Nombre || 'Sin nombre',
            phone: item.phone || item.Whatsapp || '',
            email: item.email || item.Email || '',
            location: item.location || item.Ubicacion || '',
            procedure: item.procedure || item.Procedimiento || '',
            budget: item.budget || item.Presupuesto || '',
            source: item.source || item.Fuente || '',
            motivation: item.motivation || item.Motivacion || '',
            contacted: String(item.contacted).toLowerCase() === 'true',
            converted: String(item.converted).toLowerCase() === 'true',
            lost: String(item.lost).toLowerCase() === 'true'
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
