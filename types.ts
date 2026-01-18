
export interface LeadData {
  fullName: string;
  email: string;
  whatsapp: string;
  location: string;
  procedure: string;
  otherProcedure: string;
  budget: string;
  source: string;
  motivation: string;
}

// Interfaz que mapea exactamente lo que viene del Google Sheet
export interface Lead {
  id: string;
  date: string;
  name: string;      
  phone: string;     
  email: string;
  location: string;
  procedure: string;
  budget: string;
  source: string;
  motivation: string;
  status?: string;
  
  // Nuevos campos para el CRM
  contacted?: boolean;
  converted?: boolean;
  lost?: boolean;
}

export const PROCEDURES = [
  "Lipoescultura",
  "Abdominoplastia",
  "Aumento Mamario",
  "Mastopexia",
  "Blefaroplastia",
  "Rinoplastia",
  "Otro procedimiento"
];

export const BUDGET_RANGES = [
  "Menos de 10.000.000 Gs",
  "Entre 10.000.000 y 20.000.000 Gs",
  "Entre 20.000.000 y 30.000.000 Gs",
  "Más de 30.000.000 Gs"
];

export const SOURCES = [
  "Recomendación de amigos o familiares",
  "Recomendación de otro médico",
  "Instagram",
  "Facebook",
  "Tiktok",
  "Búsqueda por Google",
  "Otro"
];