import React from 'react';
import { PerspectiveAnalysis, Status } from '../types';
import { formatNumber, calculateCompliance, getStatusColor, getStatus } from '../utils/helpers';

interface Props {
  perspective: PerspectiveAnalysis | null;
  onClose: () => void;
}

export const PerspectiveDetailModal: React.FC<Props> = ({ perspective, onClose }) => {
  if (!perspective) return null;

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
                <h2 className="text-2xl font-bold text-gray-800">{perspective.name}</h2>
                {perspective.isPriority && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-red-600 border border-red-200">
                        Prioridad del Mes
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-500">Drill-down estratégico y plan de mitigación</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
            
            {/* Top Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white border p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-bold">Cumplimiento Ponderado</div>
                    <div className="text-3xl font-bold text-gray-800">{perspective.score.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400 mt-1">Meta: 100%</div>
                </div>
                <div className="bg-white border p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-bold">Brecha (Gap)</div>
                    <div className="text-3xl font-bold text-red-600">-{perspective.gap.toFixed(1)} pts</div>
                    <div className="text-xs text-gray-400 mt-1">Déficit actual</div>
                </div>
                <div className="bg-white border p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-bold">Nivel de Riesgo</div>
                    <div className="text-3xl font-bold text-gray-800">{(perspective.riskScore * 33).toFixed(0)}/100</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${Math.min(perspective.riskScore * 33, 100)}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Risky KPIs List */}
            <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">KPIs Generadores de Riesgo (Alerta / Crítico)</h3>
                {perspective.riskyKPIs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 italic bg-gray-50 rounded-xl">
                        No hay KPIs en riesgo en esta perspectiva. ¡Excelente trabajo!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-2">KPI</th>
                                    <th className="px-4 py-2 text-center">Meta</th>
                                    <th className="px-4 py-2 text-center">Actual</th>
                                    <th className="px-4 py-2 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {perspective.riskyKPIs.map(kpi => {
                                    const comp = calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
                                    const status = getStatusColor(getStatus(comp));
                                    return (
                                        <tr key={kpi.id}>
                                            <td className="px-4 py-3 font-medium text-gray-700">{kpi.name}</td>
                                            <td className="px-4 py-3 text-center font-mono text-gray-500">{formatNumber(kpi.target, kpi.measure)}</td>
                                            <td className="px-4 py-3 text-center font-mono font-bold text-gray-800">{formatNumber(kpi.actual, kpi.measure)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-xs border ${status}`}>
                                                    {(comp * 100).toFixed(0)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Action Plan Table */}
            <div>
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Plan de Acción y Mitigación</h3>
                {perspective.remediation.length === 0 ? (
                    <p className="text-sm text-gray-400">No se requieren acciones correctivas inmediatas.</p>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-yellow-100 text-yellow-800 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Causa Probable</th>
                                    <th className="px-4 py-3">Acción Correctiva</th>
                                    <th className="px-4 py-3">Responsable</th>
                                    <th className="px-4 py-3 text-right">Deadline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-yellow-200/50">
                                {perspective.remediation.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-3 text-gray-700">{item.cause}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{item.action}</td>
                                        <td className="px-4 py-3 text-gray-600">{item.owner}</td>
                                        <td className="px-4 py-3 text-right text-gray-600 font-mono">{item.deadline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};