import React, { useMemo, useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { KGI, PerspectiveAnalysis, Status } from '../types';
import { analyzeStrategicPerspectives } from '../utils/helpers';
import { PerspectiveDetailModal } from './PerspectiveDetailModal';

interface Props {
  data: KGI[];
}

export const ChartsSection: React.FC<Props> = ({ data }) => {
  const [selectedPerspective, setSelectedPerspective] = useState<PerspectiveAnalysis | null>(null);

  // Analyze Data using helper
  const analysis = useMemo(() => analyzeStrategicPerspectives(data), [data]);
  
  // Find Priority Perspective
  const priorityPerspective = analysis.find(a => a.isPriority);

  // Prepare Radar Data
  const radarData = analysis.map(a => ({
    subject: a.name.split(' ')[0], // Short name
    fullSubject: a.name,
    A: a.score, // Current Score
    fullMark: 100,
  }));

  return (
    <div className="mb-12">
       {/* Modal for Drill-down */}
       <PerspectiveDetailModal 
          perspective={selectedPerspective} 
          onClose={() => setSelectedPerspective(null)} 
       />

       {/* Priority Banner */}
       {priorityPerspective && (
          <div className="bg-gradient-to-r from-red-50 to-white border-l-4 border-red-500 p-4 mb-8 rounded-r-xl shadow-sm flex items-center justify-between">
              <div>
                  <h3 className="text-red-800 font-bold text-sm uppercase tracking-wider mb-1">Perspectiva Prioritaria del Mes</h3>
                  <p className="text-gray-700 font-medium">
                      Atención requerida en <span className="font-bold text-gray-900">{priorityPerspective.name}</span> debido a alto riesgo acumulado.
                  </p>
              </div>
              <button 
                onClick={() => setSelectedPerspective(priorityPerspective)}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors shadow-sm"
              >
                  Ver Plan de Acción
              </button>
          </div>
       )}

       <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
          Panel de Priorización Estratégica
       </h2>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Radar Chart */}
          <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative">
              <h3 className="absolute top-6 left-6 font-bold text-gray-700 text-sm uppercase">Balance Estratégico</h3>
              <div className="w-full h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                          <PolarGrid gridType="polygon" />
                          <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }} 
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                              name="Cumplimiento"
                              dataKey="A"
                              stroke="#2563eb"
                              strokeWidth={3}
                              fill="#3b82f6"
                              fillOpacity={0.3}
                          />
                      </RadarChart>
                  </ResponsiveContainer>
              </div>
              <div className="text-center text-xs text-gray-400 mt-[-20px]">
                  Área cubierta = Balance General
              </div>
          </div>

          {/* Right Column: Perspective Cards Grid */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.map(persp => (
                  <div 
                    key={persp.id}
                    onClick={() => setSelectedPerspective(persp)}
                    className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group ${persp.isPriority ? 'ring-2 ring-red-100' : ''}`}
                  >
                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity"></div>

                      <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-gray-700 text-sm uppercase truncate max-w-[70%]">{persp.name}</h4>
                          <div className={`flex items-center text-xs font-bold ${persp.trend === 'up' ? 'text-green-500' : persp.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                              {persp.trend === 'up' ? '▲' : persp.trend === 'down' ? '▼' : '▬'}
                              <span className="ml-1">Trend</span>
                          </div>
                      </div>

                      <div className="flex items-end justify-between mb-4">
                          <div>
                              <div className="text-4xl font-bold text-gray-800">{persp.score.toFixed(0)}%</div>
                              <div className="text-xs text-gray-400 mt-1 font-mono">Meta: 100%</div>
                          </div>
                          {/* Mini Sparkline */}
                          <div className="w-24 h-10">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={persp.history}>
                                      <Line type="monotone" dataKey="value" stroke={persp.score > 80 ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      {/* Status Counters */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-1.5" title="Óptimo">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="text-xs font-bold text-gray-600">{persp.statusCounts[Status.OPTIMAL]}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Alerta">
                              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                              <span className="text-xs font-bold text-gray-600">{persp.statusCounts[Status.WARNING]}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Crítico">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              <span className="text-xs font-bold text-gray-600">{persp.statusCounts[Status.CRITICAL]}</span>
                          </div>
                          
                          {/* Tooltip Icon */}
                          <div className="ml-auto group/tooltip relative">
                              <svg className="w-4 h-4 text-gray-300 hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none z-10">
                                  Este porcentaje representa el cumplimiento ponderado según la importancia estratégica de los KPIs de esta perspectiva.
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
       </div>

       {/* Risk Ranking Table */}
       <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Ranking de Riesgo por Perspectiva</h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase bg-white">
                      <th className="px-6 py-3 font-medium">Perspectiva</th>
                      <th className="px-6 py-3 font-medium text-center">Riesgo Macro (0-3)</th>
                      <th className="px-6 py-3 font-medium text-center">Brecha</th>
                      <th className="px-6 py-3 font-medium text-center">Tendencia</th>
                      <th className="px-6 py-3 text-right">Acción</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                  {[...analysis].sort((a, b) => b.riskScore - a.riskScore).map(persp => (
                      <tr key={persp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                             {persp.isPriority && <span className="text-red-500 animate-pulse">●</span>}
                             {persp.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                  {persp.riskScore.toFixed(2)}
                              </div>
                          </td>
                          <td className="px-6 py-4 text-center text-red-500 font-bold">
                              -{persp.gap.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 text-center">
                              {persp.trend === 'up' ? (
                                  <span className="text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded">Mejorando</span>
                              ) : persp.trend === 'down' ? (
                                  <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded">Empeorando</span>
                              ) : (
                                  <span className="text-gray-400 font-bold text-xs bg-gray-50 px-2 py-1 rounded">Estable</span>
                              )}
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setSelectedPerspective(persp)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline"
                              >
                                  Analizar
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
       </div>
    </div>
  );
};