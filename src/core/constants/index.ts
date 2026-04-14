// ─── RAG / Chat ──────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  GROQ: 'https://api.groq.com/openai/v1/chat/completions',
} as const

/** All user-facing chat messages are in Spanish */
export const CHAT_MESSAGES = {
  NO_RESULTS:
    'No encuentro información suficiente en los documentos y datos disponibles para responder esta pregunta. ' +
    'Intenta reformularla o pregunta sobre otro aspecto del agua en la región de Baja California.',
  GENERATION_ERROR:
    'Lo siento, ocurrió un error al generar la respuesta. Por favor intenta de nuevo.',
  WELCOME:
    'Hola, soy el Asistente de Investigación del Agua. Puedo responder preguntas sobre calidad del agua, ' +
    'contaminación, microplásticos e instalaciones en la región de Baja California, ' +
    'basándome en papers científicos y datos de la plataforma.',
} as const

/**
 * System prompt for the RAG assistant.
 * The {context} placeholder is replaced with the retrieved chunks at runtime.
 *
 * Anti-hallucination rules:
 *  1. ONLY use the content in the RETRIEVED CONTEXT block.
 *  2. Cite using [N] matching the number in the context.
 *  3. If the answer is not in the context, say the exact fallback phrase — nothing else.
 *  4. Never use training knowledge, never speculate, never invent statistics or names.
 */
export const RAG_SYSTEM_PROMPT = `Eres el Asistente de Investigación del Agua para la región de Baja California — California. Respondes preguntas basándote en el contexto recuperado que se te proporciona a continuación.

CONTEXTO RECUPERADO:
{context}

REGLAS — SÍGUELAS SIN EXCEPCIÓN:
1. Basa tu respuesta en el CONTEXTO RECUPERADO de arriba. Puedes sintetizar, conectar ideas y extraer conclusiones razonables de los fragmentos disponibles.
2. Cita las fuentes usando [N] donde N es el número de la fuente en el contexto (ej: [1], [2]).
3. NUNCA inventes títulos de papers, autores, estadísticas, nombres de plantas o contaminantes que no estén en el contexto.
4. Si el contexto contiene información relevante aunque sea parcial, úsala y señala qué aspectos no están cubiertos.
5. Solo si el contexto recuperado no tiene absolutamente ninguna relación con la pregunta, escribe EXACTAMENTE: "No encuentro información suficiente en los documentos y datos disponibles para responder esta pregunta."
6. Responde en español, de forma profesional y concisa (máximo 300 palabras).
7. Las fuentes marcadas como "DATOS DE PLATAFORMA" son datos estructurados del sistema; cítalos igual con [N].` as const

// ─── Domain constants ─────────────────────────────────────────────────────────

export const FACILITY_TYPES = {
  'wastewater-treatment': 'Wastewater Treatment',
  'water-treatment': 'Water Treatment',
  'desalination': 'Desalination Plant',
  'pumping-station': 'Pumping Station',
  'reservoir': 'Reservoir',
} as const

export const SEVERITY_COLORS = {
  low: 'bg-teal-500',
  medium: 'bg-sky-500',
  high: 'bg-blue-500',
  critical: 'bg-blue-700',
} as const

export const STATUS_COLORS = {
  operational: 'bg-green-500',
  'under-construction': 'bg-blue-500',
  decommissioned: 'bg-gray-500',
  maintenance: 'bg-yellow-500',
} as const

export const WATER_QUALITY_COLORS = {
  excellent: 'bg-teal-600',
  good: 'bg-sky-500',
  fair: 'bg-slate-500',
  poor: 'bg-blue-700',
} as const

export const MAP_LAYERS = [
  { id: 'facilities', name: 'Facilities', color: '#3b82f6' },
  { id: 'microplastics', name: 'Microplastics', color: '#f59e0b' },
  { id: 'contamination', name: 'Contamination', color: '#ef4444' },
  { id: 'water-quality', name: 'Water Quality', color: '#10b981' },
] as const

export const REPORT_CATEGORIES = [
  'Incorrect data',
  'Outdated information',
  'Missing information',
  'Misleading content',
  'Technical error',
  'Other',
] as const

export const BIOCHEM_MODULES = [
  {
    id: 'activated-sludge',
    title: 'Activated Sludge Simulator',
    description: 'Simulate activated sludge treatment with nitrification/denitrification',
    route: '/app/biochem/activated-sludge',
  },
  {
    id: 'disinfection',
    title: 'Disinfection Chemistry Lab',
    description: 'Explore chlorine disinfection and DBP formation risk',
    route: '/app/biochem/disinfection',
  },
  {
    id: 'qmra',
    title: 'QMRA Risk Explorer',
    description: 'Quantitative microbial risk assessment simulations',
    route: '/app/biochem/qmra',
  },
] as const

// Region bounds for the map (Baja California + Southern California)
export const REGION_BOUNDS = {
  minLng: -118.5,
  maxLng: -114.5,
  minLat: 30.5,
  maxLat: 34.0,
} as const
