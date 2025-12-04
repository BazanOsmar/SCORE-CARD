import React, { useState } from 'react';
import { KGI, Status, KPI } from '../types';
import { calculateCompliance, formatNumber, getStatus, getStatusColor } from '../utils/helpers';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

interface Props {
  title: string;
  data: KGI[];
  icon: React.ReactNode;
  headerColor: string;
  onKPIClick: (kpi: KPI) => void;
}

export const PerspectiveCard: React.FC<Props> = ({ title, data, icon, headerColor, onKPIClick }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  // Calculate Perspective Overview Health
  let totalCompliance = 0;
  let count = 0;
  data.forEach(kgi => {
    kgi.kpis.forEach(kpi => {
      totalCompliance += calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
      count++;
    });
  });
  const avgCompliance = count > 0 ? totalCompliance / count : 0;
  const healthColor = avgCompliance >= 0.95 ? 'text-green-500' : avgCompliance >= 0.85 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className={`px-5 py-4 border-b border-gray-100 flex items-center justify-between ${headerColor} bg-opacity-5`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white shadow-sm ${headerColor} text-white`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{title}</h3>
            <span className="text-xs text-gray-400">{data.length} Objetivos Estratégicos</span>
          </div>
        </div>
        <div className="text-right">
             <div className={`text-xl font-bold ${healthColor}`}>{(avgCompliance * 100).toFixed(0)}%</div>
             <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Salud</div>
        </div>
      </div>

      {/* Card Content - Compact Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 font-medium">
             <tr>
                 <th className="px-4 py-2 w-1/3">Objetivo / Indicador</th>
                 <th className="px-2 py-2 text-center">Meta</th>
                 <th className="px-2 py-2 text-center">Valor Real</th>
                 <th className="px-2 py-2 text-center">Estado</th>
                 <th className="px-4 py-2 text-right">Responsable</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map(kgi => {
              const isExpanded = expandedRows.has(kgi.id);

              // Calculate Parent KGI Status based on weighted children
              let kgiWeightedCompliance = 0;
              let kgiTotalWeight = 0;
              
              kgi.kpis.forEach(k => {
                  const comp = calculateCompliance(k.actual, k.target, k.isInverse);
                  kgiWeightedCompliance += comp * k.weight;
                  kgiTotalWeight += k.weight;
              });

              // Fallback to simple average if weights are 0 or missing
              const kgiAvg = kgiTotalWeight > 0 
                ? kgiWeightedCompliance / kgiTotalWeight 
                : (kgi.kpis.reduce((acc, k) => acc + calculateCompliance(k.actual, k.target, k.isInverse), 0) / (kgi.kpis.length || 1));
              
              const kgiStatus = getStatus(kgiAvg);
              
              let dotColor = 'bg-gray-300';
              if (kgiStatus === Status.OPTIMAL) dotColor = 'bg-green-500 shadow-sm shadow-green-200';
              if (kgiStatus === Status.WARNING) dotColor = 'bg-yellow-400 shadow-sm shadow-yellow-200';
              if (kgiStatus === Status.CRITICAL) dotColor = 'bg-red-500 shadow-sm shadow-red-200';

              return (
                <React.Fragment key={kgi.id}>
                  {/* Parent KGI Row */}
                  <tr 
                    onClick={() => toggleRow(kgi.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors group bg-white z-10 relative"
                  >
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-2">
                            <button className="text-gray-300 group-hover:text-platzi-blue transition-colors">
                                {isExpanded ? <ChevronUpIcon className="w-3 h-3"/> : <ChevronDownIcon className="w-3 h-3"/>}
                            </button>
                            <span className="font-medium text-gray-800 text-sm">{kgi.name}</span>
                       </div>
                    </td>
                    <td className="px-2 py-3 text-center text-xs text-gray-300">-</td>
                    <td className="px-2 py-3 text-center text-xs text-gray-300">-</td>
                    <td className="px-2 py-3 text-center">
                        <div className="group/tooltip relative inline-flex items-center justify-center">
                            <span className={`inline-block w-3 h-3 rounded-full ${dotColor}`}></span>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-semibold text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                {kgiStatus} ({(kgiAvg * 100).toFixed(0)}%)
                                <div className="absolute top-100 left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500 font-medium">
                        {kgi.owner}
                    </td>
                  </tr>

                  {/* Child KPI Rows */}
                  {isExpanded && kgi.kpis.map(kpi => {
                    const compliance = calculateCompliance(kpi.actual, kpi.target, kpi.isInverse);
                    const status = getStatus(compliance);
                    const statusColor = getStatusColor(status);
                    
                    return (
                        <tr 
                            key={kpi.id} 
                            className="bg-slate-50/50 hover:bg-slate-100 cursor-pointer transition-colors border-l-2 border-transparent hover:border-l-platzi-blue"
                            onClick={(e) => {
                                e.stopPropagation();
                                onKPIClick(kpi);
                            }}
                        >
                            <td className="px-4 py-2 pl-9">
                                <span className="text-xs text-gray-600 font-medium block truncate max-w-[180px]" title={kpi.name}>
                                    {kpi.name}
                                </span>
                            </td>
                            <td className="px-2 py-2 text-center text-[10px] font-mono text-gray-400">
                                {formatNumber(kpi.target, kpi.measure)}
                            </td>
                            <td className="px-2 py-2 text-center text-[10px] font-mono font-bold text-gray-700">
                                {formatNumber(kpi.actual, kpi.measure)}
                            </td>
                            <td className="px-2 py-2 text-center">
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${statusColor}`}>
                                    {status}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-right">
                                {/* Empty cell for Owner (inherited from parent) */}
                            </td>
                        </tr>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};