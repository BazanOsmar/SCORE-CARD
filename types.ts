export enum Perspective {
  FINANCIAL = 'Financiera',
  CUSTOMER = 'Clientes',
  INTERNAL = 'Procesos Internos',
  LEARNING = 'Aprendizaje y Crecimiento',
}

export enum Status {
  OPTIMAL = 'Óptimo',
  WARNING = 'Alerta',
  CRITICAL = 'Crítico',
}

export interface KPI {
  id: string;
  name: string;
  measure: string; // e.g., 'USD', '%', '#'
  target: number;
  actual: number;
  isInverse: boolean; // true if lower is better (e.g., Churn, Cost)
  weight: number; // Importance weight 0-1
}

export interface KGI {
  id: string;
  name: string;
  perspective: Perspective;
  owner: string;
  kpis: KPI[];
}

export interface StatMetric {
  value: string | number;
  subtext?: string;
  trendData: { value: number }[];
  mom: number; // Month over Month change
  isInverse: boolean; // For coloring the change (true = lower is better)
}

export interface DashboardStats {
  totalIndicators: StatMetric;
  globalCompliance: StatMetric;
  criticalCount: StatMetric;
  lastUpdated: string;
}

// New Types for Strategic Prioritization
export interface RemediationPlan {
  cause: string;
  action: string;
  owner: string;
  deadline: string;
}

export interface PerspectiveAnalysis {
  id: string; // Perspective Enum Key
  name: string; // Enum Value
  score: number; // Weighted Compliance %
  target: number; // Usually 100% or weighted target
  gap: number; // Absolute gap
  gapPercent: number; // Relative gap
  trend: 'up' | 'down' | 'stable';
  trendValue: number; // Slope or diff
  history: { value: number }[]; // Sparkline data
  statusCounts: {
    [Status.OPTIMAL]: number;
    [Status.WARNING]: number;
    [Status.CRITICAL]: number;
  };
  riskScore: number; // Calculated risk factor
  isPriority: boolean; // "Perspectiva Prioritaria"
  riskyKPIs: KPI[]; // List of KPIs causing the risk
  remediation: RemediationPlan[]; // Mock action plan
}