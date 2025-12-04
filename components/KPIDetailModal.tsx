import React, { useMemo } from 'react';
import { KPI } from '../types';
import { generateMockHistory, formatNumber, calculateCompliance, getStatus, getStatusColor, calculateAdvancedStats } from '../utils/helpers';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell
} from 'recharts';
import { ArrowUpTrayIcon } from './Icons';

interface Props {
  kpi: KPI | null;
  onClose: () => void;
}

const VariationCard = ({ title, value, isInverse, label }: { title: string, value: number, isInverse: boolean, label: string }) => {
    const isPositive = value >= 0;
    // Good logic: 
    // If NOT Inverse (Revenue): Positive is Good (Green)
    // If Inverse (Cost): Positive is Bad (Red)
    const isGood = isInverse ? !isPositive : isPositive;
    
    const colorClass = isGood ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100';
    const arrow = isPositive ? '▲' : '▼';

    return (
        <div className={`p-4 rounded-xl border ${colorClass} bg-opacity-50`}>
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">{title}</div>
            <div className="flex items-end gap-2">
                <span className={`text-xl font-bold ${isGood ? 'text-green-700' : 'text-red-700'}`}>
                    {arrow} {Math.abs(value * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-gray-400 mb-1">{label}</span>
            </div>
        </div>
    );
};

export const KPIDetailModal: React.FC<Props> = ({ kpi, onClose }) => {
  // Memoize random calculations to prevent flickering on re-renders if parent changes
  const advancedStats = useMemo(() => kpi ? calculateAdvancedStats(kpi) : null, [kpi]);

  if (!kpi || !advancedStats) return null;

  const historyData = generateMockHistory(kpi);
  const compliance = calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
  const status = getStatus(compliance);
  const statusColorClass = getStatusColor(status);

  // Risk Color Logic
  const risk = advancedStats.riskProbability;
  let riskColorClass = '';
  let riskTextColor = '';
  let riskLabel = '';
  let riskBarColor = '';

  if (risk < 20) {
      riskColorClass = 'bg-green-50 border-green-200';
      riskTextColor = 'text-green-700';
      riskBarColor = 'bg-green-500';
      riskLabel = 'Baja Probabilidad';
  } else if (risk <= 50) {
      riskColorClass = 'bg-yellow-50 border-yellow-200';
      riskTextColor = 'text-yellow-700';
      riskBarColor = 'bg-yellow-500';
      riskLabel = 'Riesgo Medio';
  } else {
      riskColorClass = 'bg-red-50 border-red-200';
      riskTextColor = 'text-red-700';
      riskBarColor = 'bg-red-500';
      riskLabel = 'Alta Probabilidad';
  }

  // Data for Comparison Chart
  const comparisonData = [
    { name: 'Meta', value: kpi.target },
    { name: 'Actual', value: kpi.actual }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-platzi-dark bg-opacity-70 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColorClass}`}>
                {status}
              </span>
              <span className="text-sm text-gray-500 font-mono">ID: {kpi.id}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{kpi.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Análisis detallado de rendimiento y variaciones</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          <div className={`grid grid-cols-1 ${advancedStats.isAnomaly ? 'md:grid-cols-2' : ''} gap-6 mb-6`}>
             {/* Anomaly Banner - Only render if true */}
             {advancedStats.isAnomaly && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-orange-800">Anomalía Estadística</h4>
                        <p className="text-xs text-orange-700 mt-1">
                            Desviación significativa ({advancedStats.vsAvg > 0 ? '+' : ''}{(advancedStats.vsAvg * 100).toFixed(1)}%) vs histórico.
                        </p>
                    </div>
                </div>
             )}

             {/* Risk Probability Card - Expands if no anomaly */}
             <div className={`border p-4 rounded-xl shadow-sm flex flex-col justify-between ${riskColorClass}`}>
                <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${riskTextColor}`}>Probabilidad de NO Cumplir Meta</h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded bg-white ${riskTextColor}`}>{riskLabel}</span>
                </div>
                <div>
                    <div className="flex items-end justify-between mb-1">
                        <span className={`text-3xl font-bold ${riskTextColor}`}>{risk.toFixed(0)}%</span>
                        <span className={`text-xs ${riskTextColor} opacity-80 mb-1`}>Proyección Estadística</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                        <div className={`h-2 rounded-full ${riskBarColor}`} style={{ width: `${risk}%` }}></div>
                    </div>
                </div>
             </div>
          </div>

          {/* Top Cards (Values) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="text-xs text-blue-600 font-bold uppercase mb-1 tracking-wider">Valor Actual</div>
              <div className="text-3xl font-bold text-blue-900">{formatNumber(kpi.actual, kpi.measure)}</div>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <div className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-wider">Meta Sugerida</div>
              <div className="text-3xl font-bold text-gray-700">{formatNumber(kpi.target, kpi.measure)}</div>
            </div>
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
              <div className="text-xs text-purple-600 font-bold uppercase mb-1 tracking-wider">Cumplimiento</div>
              <div className="text-3xl font-bold text-purple-900">{(compliance * 100).toFixed(1)}%</div>
            </div>
          </div>

          {/* Advanced Stats (Variations) */}
          <div className="mb-8">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                Análisis de Variación
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VariationCard 
                    title="vs Mes Anterior" 
                    value={advancedStats.mom} 
                    isInverse={kpi.isInverse} 
                    label="MoM"
                />
                <VariationCard 
                    title="vs Año Pasado" 
                    value={advancedStats.yoy} 
                    isInverse={kpi.isInverse} 
                    label="YoY"
                />
                <VariationCard 
                    title="vs Promedio Histórico" 
                    value={advancedStats.vsAvg} 
                    isInverse={kpi.isInverse} 
                    label="Media (12m)"
                />
             </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Tendencia (Últimos 6 Meses)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => formatNumber(value, kpi.measure)}
                    />
                    <ReferenceLine y={kpi.target} label="Meta" stroke="#ef4444" strokeDasharray="3 3" />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#98ca3f" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#121f3d', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Actual vs Meta
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={60} tick={{fontWeight: 'bold', fill: '#4b5563'}} />
                     <RechartsTooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => formatNumber(value, kpi.measure)}
                     />
                     <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={40}>
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#9ca3af' : '#121f3d'} />
                        ))}
                     </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};