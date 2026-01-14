
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
  "8.000.000 - 15.000.000",
  "15.000.000 - 25.000.000",
  "25.000.000 - 35.000.000",
  "35.000.000 - 45.000.000",
  "45.000.000 o más"
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