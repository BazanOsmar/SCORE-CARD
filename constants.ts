import { KGI, Perspective } from './types';

export const INITIAL_DATA: KGI[] = [
  // --- FINANCIERA (Mixed Performance) ---
  {
    id: 'f1',
    name: 'Crecimiento Exponencial (Hypergrowth)',
    perspective: Perspective.FINANCIAL,
    owner: 'CRO',
    kpis: [
      { id: 'f1-main', name: 'Crecimiento de ARR (Anual)', measure: '%', target: 0.40, actual: 0.35, isInverse: false, weight: 0.4 }, // Warning (87%)
      { id: 'f1-1', name: 'MRR de Nuevas Ventas', measure: 'USD', target: 500000, actual: 410000, isInverse: false, weight: 0.2 }, // Critical (82%)
      { id: 'f1-2', name: 'MRR de Expansión (Upsell)', measure: 'USD', target: 200000, actual: 215000, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'f1-3', name: 'Ticket Promedio (ARPU)', measure: 'USD', target: 35, actual: 31, isInverse: false, weight: 0.2 }, // Warning
    ]
  },
  {
    id: 'f2',
    name: 'Eficiencia de Capital',
    perspective: Perspective.FINANCIAL,
    owner: 'CFO',
    kpis: [
      { id: 'f2-main', name: 'Ratio LTV / CAC', measure: 'x', target: 3.0, actual: 2.6, isInverse: false, weight: 0.4 }, // Warning (86%)
      { id: 'f2-1', name: 'Costo de Adquisición (CAC)', measure: 'USD', target: 150, actual: 165, isInverse: true, weight: 0.2 }, // Warning (90%)
      { id: 'f2-2', name: 'Valor de Vida (LTV)', measure: 'USD', target: 450, actual: 429, isInverse: false, weight: 0.2 }, // Optimal (95%)
      { id: 'f2-3', name: 'Payback Period', measure: 'days', target: 180, actual: 210, isInverse: true, weight: 0.2 }, // Critical (85%)
    ]
  },
  {
    id: 'f3',
    name: 'Minimizar Fuga de Ingresos',
    perspective: Perspective.FINANCIAL,
    owner: 'VP Sales',
    kpis: [
      { id: 'f3-main', name: 'Revenue Churn Rate', measure: '%', target: 0.05, actual: 0.058, isInverse: true, weight: 0.4 }, // Warning
      { id: 'f3-1', name: 'Churn Voluntario', measure: '%', target: 0.03, actual: 0.038, isInverse: true, weight: 0.2 }, // Critical
      { id: 'f3-2', name: 'Churn Involuntario', measure: '%', target: 0.015, actual: 0.012, isInverse: true, weight: 0.2 }, // Optimal
      { id: 'f3-3', name: 'Tasa de Downgrade', measure: '%', target: 0.01, actual: 0.008, isInverse: true, weight: 0.2 }, // Optimal
    ]
  },

  // --- CLIENTES (Generally Good, some warnings) ---
  {
    id: 'c1',
    name: 'Impacto Profesional (Outcome)',
    perspective: Perspective.CUSTOMER,
    owner: 'VP Education',
    kpis: [
      { id: 'c1-main', name: '% Mejora Laboral', measure: '%', target: 0.60, actual: 0.59, isInverse: false, weight: 0.4 }, // Optimal
      { id: 'c1-1', name: '% Aumento Salarial Reportado', measure: '%', target: 0.30, actual: 0.24, isInverse: false, weight: 0.2 }, // Critical (80%)
      { id: 'c1-2', name: 'Estudiantes que lanzan empresa', measure: '%', target: 0.05, actual: 0.052, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'c1-3', name: 'Nuevos empleos conseguidos', measure: '#', target: 1000, actual: 950, isInverse: false, weight: 0.2 }, // Optimal (95%)
    ]
  },
  {
    id: 'c2',
    name: 'Retención de Estudiantes',
    perspective: Perspective.CUSTOMER,
    owner: 'VP Growth',
    kpis: [
      { id: 'c2-main', name: 'Tasa de Renovación Anual', measure: '%', target: 0.75, actual: 0.68, isInverse: false, weight: 0.4 }, // Critical (90%)
      { id: 'c2-1', name: 'Activos > 12 meses', measure: '%', target: 0.40, actual: 0.42, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'c2-2', name: 'Tasa de Reactivación (Win-back)', measure: '%', target: 0.10, actual: 0.06, isInverse: false, weight: 0.2 }, // Critical
      { id: 'c2-3', name: 'Finalización de Rutas', measure: '%', target: 0.50, actual: 0.49, isInverse: false, weight: 0.2 }, // Optimal
    ]
  },
  {
    id: 'c3',
    name: 'Engagement de Comunidad',
    perspective: Perspective.CUSTOMER,
    owner: 'Community Mgr',
    kpis: [
      { id: 'c3-main', name: 'DAU / MAU Ratio (Stickiness)', measure: '%', target: 0.20, actual: 0.23, isInverse: false, weight: 0.4 }, // Optimal
      { id: 'c3-1', name: 'Participación en Platzi Live', measure: '#', target: 5000, actual: 5800, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'c3-2', name: 'Proyectos subidos', measure: '#', target: 2000, actual: 1600, isInverse: false, weight: 0.2 }, // Critical
      { id: 'c3-3', name: 'Interacciones en Foros', measure: '#', target: 15000, actual: 14800, isInverse: false, weight: 0.2 }, // Optimal (98%)
    ]
  },

  // --- PROCESOS INTERNOS (Struggling with Efficiency) ---
  {
    id: 'p1',
    name: 'Velocidad de Producción',
    perspective: Perspective.INTERNAL,
    owner: 'Content Director',
    kpis: [
      { id: 'p1-main', name: 'Cursos Lanzados / Semana', measure: '#', target: 10, actual: 12, isInverse: false, weight: 0.4 }, // Optimal
      { id: 'p1-1', name: 'Tiempo Post-producción', measure: 'days', target: 10, actual: 14, isInverse: true, weight: 0.2 }, // Critical (71%)
      { id: 'p1-2', name: 'Lanzados en fecha', measure: '%', target: 0.90, actual: 0.82, isInverse: false, weight: 0.2 }, // Critical
      { id: 'p1-3', name: 'Costo por minuto', measure: 'USD', target: 50, actual: 48, isInverse: true, weight: 0.2 }, // Optimal
    ]
  },
  {
    id: 'p2',
    name: 'Frescura del Contenido',
    perspective: Perspective.INTERNAL,
    owner: 'Curriculum Lead',
    kpis: [
      { id: 'p2-main', name: '% Cursos Obsoletos (>2 años)', measure: '%', target: 0.10, actual: 0.13, isInverse: true, weight: 0.4 }, // Warning (76%)
      { id: 'p2-1', name: 'Cursos actualizados (Mes)', measure: '#', target: 20, actual: 16, isInverse: false, weight: 0.2 }, // Critical
      { id: 'p2-2', name: 'Cursos Deprecados', measure: '#', target: 5, actual: 5, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'p2-3', name: 'Auditorías realizadas', measure: '#', target: 10, actual: 8, isInverse: false, weight: 0.2 }, // Critical
    ]
  },
  {
    id: 'p3',
    name: 'Calidad de Streaming',
    perspective: Perspective.INTERNAL,
    owner: 'CTO',
    kpis: [
      { id: 'p3-main', name: 'Tasa de Buffering/Errores', measure: '%', target: 0.005, actual: 0.006, isInverse: true, weight: 0.4 }, // Warning
      { id: 'p3-1', name: 'Uptime Plataforma', measure: '%', target: 0.9999, actual: 0.9999, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'p3-2', name: 'Latencia en Vivo', measure: 'ms', target: 2000, actual: 2300, isInverse: true, weight: 0.2 }, // Warning
      { id: 'p3-3', name: 'Velocidad de carga (LCP)', measure: 's', target: 2.5, actual: 2.1, isInverse: true, weight: 0.2 }, // Optimal
    ]
  },

  // --- APRENDIZAJE Y CRECIMIENTO (Mixed) ---
  {
    id: 'a1',
    name: 'Cultura "Dogfooding"',
    perspective: Perspective.LEARNING,
    owner: 'VP People',
    kpis: [
      { id: 'a1-main', name: '% Staff activo aprendiendo', measure: '%', target: 0.90, actual: 0.84, isInverse: false, weight: 0.4 }, // Warning
      { id: 'a1-1', name: 'Cursos terminados/empl/mes', measure: '#', target: 1, actual: 1.2, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'a1-2', name: 'Ranking Interno (Puntos)', measure: '#', target: 1000, actual: 920, isInverse: false, weight: 0.2 }, // Warning
      { id: 'a1-3', name: 'Feedback de producto', measure: '#', target: 50, actual: 70, isInverse: false, weight: 0.2 }, // Optimal
    ]
  },
  {
    id: 'a2',
    name: 'Excelencia Docente',
    perspective: Perspective.LEARNING,
    owner: 'Dean of Faculty',
    kpis: [
      { id: 'a2-main', name: 'NPS de Profesores', measure: '#', target: 70, actual: 64, isInverse: false, weight: 0.4 }, // Warning
      { id: 'a2-1', name: 'Retención Top Teachers', measure: '%', target: 0.95, actual: 0.93, isInverse: false, weight: 0.2 }, // Warning
      { id: 'a2-2', name: 'Calif. Promedio Cursos', measure: 'stars', target: 4.8, actual: 4.9, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'a2-3', name: 'Tiempo pago instructores', measure: 'days', target: 30, actual: 28, isInverse: true, weight: 0.2 }, // Optimal
    ]
  },
  {
    id: 'a3',
    name: 'Innovación Pedagógica',
    perspective: Perspective.LEARNING,
    owner: 'Head of R&D',
    kpis: [
      { id: 'a3-main', name: '% Cursos nuevos formatos', measure: '%', target: 0.15, actual: 0.09, isInverse: false, weight: 0.4 }, // Critical
      { id: 'a3-1', name: 'Adopción Labs/Retos', measure: '%', target: 0.40, actual: 0.25, isInverse: false, weight: 0.2 }, // Critical
      { id: 'a3-2', name: 'Uso de AI en evaluaciones', measure: '%', target: 0.20, actual: 0.55, isInverse: false, weight: 0.2 }, // Optimal
      { id: 'a3-3', name: 'Éxito Cohortes en Vivo', measure: '%', target: 0.80, actual: 0.78, isInverse: false, weight: 0.2 }, // Warning
    ]
  }
];