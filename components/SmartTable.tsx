import React, { useState } from 'react';
import { KGI, Perspective, Status, KPI } from '../types';
import { calculateCompliance, formatNumber, getProgressColor, getStatus, getStatusColor } from '../utils/helpers';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

interface Props {
  data: KGI[];
}

export const SmartTable: React.FC<Props> = ({ data }) => {
  const [filterPerspective, setFilterPerspective] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(data.map(d => d.id))); // Default all open

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  // Filter Logic
  const filteredData = data.filter(kgi => {
    const matchesPersp = filterPerspective === 'all' || kgi.perspective === filterPerspective;
    
    // Status filter is trickier for Parent (KGI). We show KGI if ANY of its children match the status
    // OR if we are showing all.
    let matchesStatus = filterStatus === 'all';
    if (!matchesStatus) {
       matchesStatus = kgi.kpis.some(kpi => {
         const s = getStatus(calculateCompliance(kpi.actual, kpi.target, kpi.isInverse));
         return s === filterStatus;
       });
    }

    return matchesPersp && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Filters Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Detalle de Indicadores</h2>
        
        <div className="flex gap-3">
          <select 
            className="text-sm border-gray-300 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            value={filterPerspective}
            onChange={(e) => setFilterPerspective(e.target.value)}
          >
            <option value="all">Todas las Perspectivas</option>
            {Object.values(Perspective).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select 
            className="text-sm border-gray-300 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los Estatus</option>
            {Object.values(Status).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4">Indicador Clave (KGI) / KPI</th>
              <th className="px-6 py-4 text-center">Meta</th>
              <th className="px-6 py-4 text-center">Actual</th>
              <th className="px-6 py-4 text-center">Cumplimiento</th>
              <th className="px-6 py-4 text-center">Estatus</th>
              <th className="px-6 py-4 text-right">Responsable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map(kgi => {
              const isExpanded = expandedRows.has(kgi.id);
              return (
                <React.Fragment key={kgi.id}>
                  {/* Parent Row (KGI) */}
                  <tr 
                    onClick={() => toggleRow(kgi.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors bg-white group"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      <button className="text-gray-400 group-hover:text-blue-500 transition-colors">
                        {isExpanded ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                      </button>
                      <div>
                        {kgi.name}
                        <span className="block text-xs font-normal text-gray-400 mt-0.5">{kgi.perspective}</span>
                      </div>
                    </td>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden max-w-[200px] mx-auto">
                        <div className="h-full bg-gray-300 w-full opacity-50"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-medium text-gray-500">{kgi.owner}</td>
                  </tr>

                  {/* Child Rows (KPIs) - Accordion Content */}
                  {isExpanded && kgi.kpis.map(kpi => {
                    const compliance = calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
                    const status = getStatus(compliance);
                    const statusColor = getStatusColor(status);
                    const progressColor = getProgressColor(status);
                    
                    // Filter child rows based on status filter if active
                    if (filterStatus !== 'all' && status !== filterStatus) return null;

                    return (
                      <tr key={kpi.id} className="bg-slate-50/50 border-l-4 border-l-transparent hover:border-l-blue-500 transition-all">
                        <td className="px-6 py-3 pl-12 text-gray-600 border-t border-gray-100 border-dashed">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${progressColor}`}></div>
                             {kpi.name}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center font-mono text-xs border-t border-gray-100 border-dashed">
                          {formatNumber(kpi.target, kpi.measure)}
                        </td>
                        <td className="px-6 py-3 text-center font-mono text-xs font-medium text-gray-800 border-t border-gray-100 border-dashed">
                          {formatNumber(kpi.actual, kpi.measure)}
                        </td>
                        <td className="px-6 py-3 text-center border-t border-gray-100 border-dashed">
                           <div className="flex items-center justify-center gap-2">
                             <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full ${progressColor}`} 
                                 style={{ width: `${Math.min(compliance * 100, 100)}%` }}
                               ></div>
                             </div>
                             <span className="text-xs font-semibold w-10 text-right">{(compliance * 100).toFixed(0)}%</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-center border-t border-gray-100 border-dashed">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-3 border-t border-gray-100 border-dashed"></td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
            
            {filteredData.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                        No se encontraron indicadores con los filtros seleccionados.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
