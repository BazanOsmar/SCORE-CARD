import { KPI, KGI, Status, DashboardStats, Perspective, PerspectiveAnalysis, RemediationPlan } from '../types';

export const formatNumber = (value: number, measure: string): string => {
  if (measure === '%') return `${(value * 100).toFixed(1)}%`;
  if (measure === 'USD') return `$${value.toLocaleString()}`;
  if (measure === 'TIME') return `${value}h`;
  if (measure === 'x') return `${value.toFixed(1)}x`;
  if (measure === 'days') return `${value.toFixed(0)}d`;
  if (measure === 'ms') return `${value.toFixed(0)}ms`;
  if (measure === 's') return `${value.toFixed(1)}s`;
  if (measure === 'stars') return `${value.toFixed(1)}★`;
  return value.toLocaleString();
};

export const calculateCompliance = (actual: number, target: number, isInverse: boolean): number => {
  if (target === 0) return actual === 0 ? 1.5 : 0;
  let compliance = (actual / target);
  
  if (isInverse) {
    // For inverse metrics (e.g., Churn), actual < target is better.
    if (actual === 0) return 1.5; // Perfect score
    compliance = target / actual;
  }
  
  return compliance;
};

export const getStatus = (compliance: number): Status => {
  if (compliance >= 0.95) return Status.OPTIMAL;
  if (compliance >= 0.85) return Status.WARNING;
  return Status.CRITICAL;
};

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case Status.OPTIMAL: return 'text-green-700 bg-green-100 border-green-200';
    case Status.WARNING: return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    case Status.CRITICAL: return 'text-red-700 bg-red-100 border-red-200';
    default: return 'text-gray-700 bg-gray-100';
  }
};

export const getProgressColor = (status: Status): string => {
  switch (status) {
    case Status.OPTIMAL: return 'bg-green-500';
    case Status.WARNING: return 'bg-yellow-500';
    case Status.CRITICAL: return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

// Generates simulated sparkline data (6 data points ending near current value)
const generateSparklineSeries = (currentValue: number, volatility: number = 0.1): { value: number }[] => {
    const data = [];
    // Start 5 steps back
    let prev = currentValue * (1 - (Math.random() * volatility * 2) + volatility); 
    
    for(let i=0; i<5; i++) {
        // Random walk
        const change = (Math.random() - 0.45) * volatility * currentValue;
        let val = prev + change;
        if (val < 0) val = 0;
        data.push({ value: val });
        prev = val;
    }
    // Ensure the last point connects smoothly to current but let's stick to the generated trend for history
    // actually, let's make the last point the current value for consistency
    data.push({ value: currentValue });
    return data;
};

export const calculateGlobalStats = (kgis: KGI[]): DashboardStats => {
  let totalKpis = 0;
  let totalWeightedCompliance = 0;
  let totalWeight = 0;
  let criticalCount = 0;

  kgis.forEach(kgi => {
    kgi.kpis.forEach(kpi => {
      totalKpis++;
      const compliance = calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
      const status = getStatus(compliance);
      
      if (status === Status.CRITICAL) criticalCount++;
      
      // Normalized weight calculation
      totalWeightedCompliance += compliance * kpi.weight;
      totalWeight += kpi.weight;
    });
  });

  const globalCompliance = totalWeight > 0 ? (totalWeightedCompliance / totalWeight) : 0;
  const globalCompliancePercent = parseFloat((globalCompliance * 100).toFixed(1));

  // Generate Mock Trend Data
  const totalHistory = generateSparklineSeries(totalKpis, 0.05);
  const complianceHistory = generateSparklineSeries(globalCompliancePercent, 0.05);
  const criticalHistory = generateSparklineSeries(criticalCount, 0.4);

  // Calculate Month-over-Month (Last vs 2nd Last)
  const totalMoM = totalHistory[5].value - totalHistory[4].value;
  const complianceMoM = complianceHistory[5].value - complianceHistory[4].value;
  const criticalMoM = criticalHistory[5].value - criticalHistory[4].value;

  return {
    totalIndicators: {
        value: totalKpis,
        subtext: "Monitorizados activamente",
        trendData: totalHistory,
        mom: totalMoM,
        isInverse: false
    },
    globalCompliance: {
        value: globalCompliancePercent + "%",
        subtext: "Promedio ponderado",
        trendData: complianceHistory,
        mom: complianceMoM,
        isInverse: false
    },
    criticalCount: {
        value: criticalCount,
        subtext: "Requieren atención",
        trendData: criticalHistory,
        mom: criticalMoM,
        isInverse: true // Less is better for critical count
    },
    lastUpdated: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    })
  };
};

// Generates simulated historical data for KPI Detail Modal
export const generateMockHistory = (kpi: KPI) => {
  // Adjusted months to end in December as requested
  const months = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  // Create a trend. If status is good, trend up. If bad, trend unstable.
  
  return months.map((month, index) => {
    // Random variation around the actual value to simulate history
    // We make the last month equal to the actual value
    let value;
    if (index === months.length - 1) {
      value = kpi.actual;
    } else {
      const variance = (Math.random() - 0.5) * 0.2; // +/- 10% variance
      // If we are far back in time, we might be lower or higher depending on "trend"
      // Simulating a slight improvement over time
      const timeFactor = 1 - ((months.length - 1 - index) * 0.05); 
      value = kpi.actual * timeFactor * (1 + variance);
    }

    return {
      name: month,
      value: Math.max(0, value), // No negative numbers usually
      target: kpi.target
    };
  });
};

// Calculates advanced stats (MoM, YoY, vs Avg, Anomaly, Risk)
export const calculateAdvancedStats = (kpi: KPI) => {
    // 1. Generate a virtual 13-month history to support YoY comparison
    // Index 12 = Current (Dec)
    // Index 11 = Prev (Nov)
    // Index 0 = Same Month Last Year (Dec prev year)
    
    const points: number[] = [];
    let currentCursor = kpi.actual;
    points[12] = currentCursor;

    // Simulate backwards
    for (let i = 11; i >= 0; i--) {
        // Random volatility for realistic data
        const volatility = 0.15; // 15% volatility
        const change = (Math.random() - 0.5) * 2 * volatility; // -15% to +15%
        
        // Reverse calculation: Previous = Current / (1 + change)
        let prev = currentCursor / (1 + change);
        
        // Add a slight trend bias depending on compliance
        // If compliance is bad, maybe trend was better before (it dropped)
        const compliance = calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
        if (compliance < 0.9) {
             prev = prev * 1.01; // Was slightly higher before
        }

        if (prev < 0) prev = 0;
        points[i] = prev;
        currentCursor = prev;
    }

    const current = points[12];
    const prevMonth = points[11];
    const lastYear = points[0];

    // 2. Statistics
    
    // MoM
    const mom = prevMonth !== 0 ? (current - prevMonth) / prevMonth : 0;
    
    // YoY
    const yoy = lastYear !== 0 ? (current - lastYear) / lastYear : 0;

    // Average (Last 12 months excluding current for baseline)
    const historyWindow = points.slice(0, 12); 
    const avg = historyWindow.reduce((a, b) => a + b, 0) / historyWindow.length;
    const vsAvg = avg !== 0 ? (current - avg) / avg : 0;

    // Anomaly Detection (Standard Deviation / Z-Score)
    const variance = historyWindow.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / historyWindow.length;
    const stdDev = Math.sqrt(variance);
    const diff = Math.abs(current - avg);
    
    // If deviation is > 1.5 sigma, we consider it an anomaly worth highlighting
    const isAnomaly = stdDev > 0 && diff > (1.5 * stdDev);

    // 3. Risk Calculation (Probability of NOT meeting target)
    // Logic: Distance to Target + Momentum
    let riskProbability = 0;
    
    const distanceToTarget = kpi.isInverse ? (current - kpi.target) : (kpi.target - current);
    const gapPercent = kpi.target !== 0 ? distanceToTarget / kpi.target : 0;
    
    // Momentum: Are we moving in the right direction?
    // If Inverse: Negative MoM is good (Momentum > 0). Positive MoM is bad.
    // If Normal: Positive MoM is good.
    const momentum = kpi.isInverse ? -mom : mom;

    if (gapPercent <= 0) {
        // We are currently beating the target
        // Base risk low (volatility based)
        riskProbability = 10; 
        if (momentum < -0.05) riskProbability += 15; // But trending wrong way
    } else {
        // We are missing target
        // Base risk is proportional to gap. e.g. 20% gap => 60% risk
        riskProbability = 30 + (gapPercent * 150);
        
        // Adjust by momentum
        if (momentum > 0.02) riskProbability -= 20; // Improving fast, risk lowers
        else if (momentum < 0) riskProbability += 10; // Worsening, risk increases
    }

    // Clamp between 5% and 95%
    riskProbability = Math.max(5, Math.min(95, riskProbability));

    return {
        mom,
        yoy,
        vsAvg,
        isAnomaly,
        stdDev,
        avg,
        riskProbability
    };
};

const MOCK_CAUSES: Record<string, string[]> = {
  'Financiera': ['Aumento inesperado en costos de servidor', 'Tasa de cambio desfavorable', 'Baja estacional en ventas B2B'],
  'Clientes': ['Problemas de UX en el checkout', 'Competencia lanzó promociones agresivas', 'Saturación en canales de soporte'],
  'Procesos Internos': ['Cuello de botella en post-producción', 'Deuda técnica acumulada', 'Falta de personal en QA'],
  'Aprendizaje y Crecimiento': ['Fatiga del equipo post-lanzamiento', 'Baja adopción de nuevas herramientas', 'Presupuesto de capacitación congelado']
};

const MOCK_ACTIONS: Record<string, string[]> = {
  'Financiera': ['Renegociar contratos con proveedores cloud', 'Lanzar campaña de reactivación de churn', 'Optimizar spend en Paid Media'],
  'Clientes': ['Implementar chat en vivo 24/7', 'Lanzar programa de lealtad v2', 'Rediseñar flujo de onboarding'],
  'Procesos Internos': ['Automatizar pipelines de video', 'Sprint exclusivo de refactorización', 'Contratar 2 editores freelance'],
  'Aprendizaje y Crecimiento': ['Hackathon interno de bienestar', 'Taller de IA para docentes', 'Bono por certificación técnica']
};

export const analyzeStrategicPerspectives = (data: KGI[]): PerspectiveAnalysis[] => {
  const perspectives = Object.values(Perspective);
  const analysis: PerspectiveAnalysis[] = [];

  perspectives.forEach(perspName => {
    // Filter KGIs for this perspective
    const kgis = data.filter(d => d.perspective === perspName);
    
    let totalScore = 0;
    let totalCount = 0;
    let criticalCount = 0;
    let warningCount = 0;
    let optimalCount = 0;
    const riskyKPIs: KPI[] = [];

    // Aggregate Data
    kgis.forEach(kgi => {
      kgi.kpis.forEach(kpi => {
        const compliance = calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
        const status = getStatus(compliance);

        totalScore += compliance; // Simple average for perspective level summary for now, could be weighted
        totalCount++;

        if (status === Status.CRITICAL) {
           criticalCount++;
           riskyKPIs.push(kpi);
        } else if (status === Status.WARNING) {
           warningCount++;
           riskyKPIs.push(kpi);
        } else {
           optimalCount++;
        }
      });
    });

    const avgScore = totalCount > 0 ? (totalScore / totalCount) : 0;
    const avgScorePercent = avgScore * 100;

    // Simulate Trend (History)
    const history = generateSparklineSeries(avgScorePercent, 0.08);
    // Compare last two points
    const current = history[history.length - 1].value;
    const prev = history[history.length - 2].value;
    const trend = current > prev ? 'up' : current < prev ? 'down' : 'stable';
    const trendValue = current - prev;

    // Risk Score Calculation
    // Weighted risk: Critical * 3, Warning * 1. Normalized by total count.
    // + Gap factor (100 - score)
    const riskFactor = totalCount > 0 ? ((criticalCount * 3) + (warningCount * 1)) / totalCount : 0;
    const gapFactor = Math.max(0, 100 - avgScorePercent) / 100; 
    const riskScore = (riskFactor * 0.7) + (gapFactor * 0.3); // 0 to ~3

    // Mock Remediation Plan
    const remediation: RemediationPlan[] = [];
    if (riskyKPIs.length > 0) {
        const causes = MOCK_CAUSES[perspName] || [];
        const actions = MOCK_ACTIONS[perspName] || [];
        
        remediation.push({
            cause: causes[Math.floor(Math.random() * causes.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            owner: kgis[0]?.owner || 'Director',
            deadline: '15 días'
        });
        if (riskyKPIs.length > 2) {
             remediation.push({
                cause: causes[(Math.floor(Math.random() * causes.length) + 1) % causes.length],
                action: actions[(Math.floor(Math.random() * actions.length) + 1) % actions.length],
                owner: 'Comité Ejecutivo',
                deadline: '30 días'
            });
        }
    }

    analysis.push({
        id: perspName,
        name: perspName,
        score: avgScorePercent,
        target: 100, // Normalized target
        gap: 100 - avgScorePercent,
        gapPercent: (100 - avgScorePercent) / 100,
        trend,
        trendValue,
        history,
        statusCounts: {
            [Status.OPTIMAL]: optimalCount,
            [Status.WARNING]: warningCount,
            [Status.CRITICAL]: criticalCount
        },
        riskScore,
        isPriority: false, // Calculated later
        riskyKPIs,
        remediation
    });
  });

  // Determine Priority Perspective
  // Max Risk Score
  const maxRisk = Math.max(...analysis.map(a => a.riskScore));
  analysis.forEach(a => {
      if (a.riskScore === maxRisk && maxRisk > 0) {
          a.isPriority = true;
      }
  });

  return analysis;
};