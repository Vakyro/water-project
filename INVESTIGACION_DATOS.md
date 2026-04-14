# Guía de Investigación de Datos

> Todo lo que está en esta guía debe investigarse **por cada ciudad**.
> Ciudades actuales: Tijuana, Rosarito, Ensenada, Mexicali, Tecate, San Diego, Carlsbad, Imperial Beach.

---

## 1. Información General de la Ciudad

| Campo | Descripción | Fuente sugerida |
|---|---|---|
| Población | Número de habitantes (año más reciente) | INEGI / US Census Bureau |
| Descripción | 1–2 párrafos sobre el contexto hídrico de la ciudad | Literatura local / informes municipales |
| Coordenadas | Latitud y longitud del centroide urbano | Google Maps / OpenStreetMap |

---

## 2. Estaciones de Monitoreo de Calidad del Agua

> Se pueden tener múltiples estaciones por ciudad. Por cada una:

| Campo | Unidad / Valores | Fuente sugerida |
|---|---|---|
| Nombre del punto | — | EPA Water Quality Portal / CONAGUA |
| Coordenadas exactas | Lat, Lon | Mismo reporte de monitoreo |
| pH | 0–14 | EPA / CONAGUA / CESPT |
| Oxígeno disuelto | mg/L | Idem |
| Turbidez | NTU | Idem |
| Temperatura del agua | °C | Idem |
| Salinidad | ppt | Idem |
| Conductividad | μS/cm | Idem |
| Calificación general | excellent / good / fair / poor | Derivado de los valores anteriores |
| Fecha de última actualización | YYYY-MM-DD | Mismo reporte |

---

## 3. Contaminación y Contaminantes

> Puede haber múltiples sitios de contaminación por ciudad. Por cada sitio:

| Campo | Unidad / Valores | Fuente sugerida |
|---|---|---|
| Coordenadas del sitio | Lat, Lon | Reportes EPA / SEMARNAT |
| Severidad del sitio | low / medium / high / critical | Derivado de excedancias |
| Descripción del evento | Texto breve | Noticias / informes de agencias |
| Fecha de detección | YYYY-MM-DD | Idem |

**Por cada contaminante detectado en el sitio:**

| Campo | Unidad / Valores | Fuente sugerida |
|---|---|---|
| Nombre del contaminante | e.g. Coliformes fecales, Plomo, Nitratos | EPA / CONAGUA |
| Nivel medido | e.g. 450 CFU/100mL | Reportes de laboratorio |
| Límite máximo permitido | Misma unidad | NOM-127 / Safe Drinking Water Act |
| ¿Excede el límite? | Sí / No | Comparación directa |

---

## 4. Instalaciones de Tratamiento de Agua

> Puede haber múltiples instalaciones por ciudad. Por cada una:

| Campo | Unidad / Valores | Fuente sugerida |
|---|---|---|
| Nombre oficial | — | CESPT / EPAS / Municipal utility |
| Tipo | wastewater-treatment / water-treatment / desalination / pumping-station / reservoir | — |
| Estado operativo | operational / maintenance / offline | Informes municipales |
| Coordenadas | Lat, Lon | Google Maps / informes |
| Capacidad de diseño | m³/día o MGD | Ficha técnica de la planta |
| Descripción | Qué trata y para quién | Sitio web municipal / CESPT |
| Flujo diario actual | m³/día o MGD | Informes de operación |
| Nivel de tratamiento | primary / secondary / tertiary | Ficha técnica |
| Consumo energético | kWh/m³ | Informes de eficiencia |
| Última inspección | YYYY-MM-DD | CONAGUA / EPA |
| Población servida | Número de personas | Informes municipales |
| Año de construcción | YYYY | Registros históricos |
| Carga actual (% de capacidad) | 0–100 % | Derivado de flujo / capacidad |
| Eficiencia de tratamiento | 0–100 % | Informes técnicos |

---

## 5. Microplásticos

> Puede haber múltiples estudios / puntos de muestreo por ciudad. Por cada uno:

| Campo | Unidad / Valores | Fuente sugerida |
|---|---|---|
| Título del estudio | — | Google Scholar / ResearchGate |
| Autores | Apellidos, año | Idem |
| Área afectada | Nombre del cuerpo de agua o zona | Idem |
| Tipo de muestra | Agua superficial / sedimento / biota | Idem |
| Concentración de microplásticos | partículas/L o partículas/kg | Idem |
| Tipos de partículas | e.g. fibras, fragmentos, pellets | Idem |
| Profundidad de muestreo | metros | Idem |
| Número de muestras | entero | Idem |
| Severidad | low / medium / high / critical | Derivado de concentración |
| Fuente principal | e.g. escorrentía urbana, industria textil | Idem |
| Fecha de detección / publicación | YYYY-MM-DD | Idem |
| Rango de tamaño | e.g. 0.1–5 mm | Idem |
| Tipos de polímeros identificados | e.g. PE, PP, PET | Idem |
| Resumen del abstract | 2–3 oraciones | Idem |
| Metodología breve | e.g. FTIR, microscopía visual | Idem |

---

## 6. Resúmenes del Perfil de Ciudad

> Estos son textos de síntesis que aparecen en la página de cada ciudad. Se derivan de la investigación anterior pero requieren redacción propia:

| Campo | Descripción |
|---|---|
| Resumen de calidad del agua | Párrafo general sobre el estado del agua en la ciudad |
| pH promedio | Promedio de las estaciones de monitoreo |
| Salinidad promedio | Promedio de las estaciones |
| Calificación general | excellent / good / fair / poor (síntesis) |
| Número de estaciones de monitoreo | Conteo |
| Resumen de microplásticos | Párrafo general sobre presencia y tendencia |
| Concentración promedio de microplásticos | partículas/L |
| Número de hotspots | Conteo de zonas críticas |
| Tendencia | increasing / decreasing / stable |
| Resumen de contaminación | Párrafo general sobre principales amenazas |
| Contaminantes principales | Lista de 3–5 nombres |
| Nivel de riesgo | low / medium / high / critical |
| Áreas afectadas | Lista de zonas o colonias |

---

## Notas de Investigación

- **Prioridad alta**: Tijuana, San Diego e Imperial Beach — tienen más datos públicos disponibles (IBWC, EPA Region 9, CESPT).
- **Prioridad media**: Ensenada, Mexicali — datos disponibles en CONAGUA y SEMARNAT.
- **Prioridad baja**: Rosarito, Tecate, Carlsbad — pueden completarse con datos de ciudades vecinas + literatura regional.
- Para contaminantes, usa como referencia: **NOM-127-SSA1-2021** (México) y **Safe Drinking Water Act MCLs** (EUA).
- Para microplásticos, busca en: **ScienceDirect**, **Google Scholar** con términos `"microplastics" + nombre de ciudad` o nombre del cuerpo de agua.
- Los datos de **IBWC/CILA** son especialmente útiles para el Río Tijuana y zonas fronterizas.
