import React from 'react';
import { DashboardStats, StatMetric } from '../types';
import { ChartPieIcon, AlertCircleIcon } from './Icons';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  stats: DashboardStats;
}

const StatCard = ({ title, metric, colorClass, icon }: { title: string, metric?: StatMetric, colorClass: string, icon: React.ReactNode }) => {
  if (!metric) return null;

  // Determine trend color
  const isPositiveChange = metric.mom >= 0;
  // If isInverse (e.g. Critical Errors), a Positive Change (increase) is BAD.
  const isGood = metric.isInverse ? !isPositiveChange : isPositiveChange;
  
  const trendColor = isGood ? 'text-green-500' : 'text-red-500';
  const trendIcon = isPositiveChange ? '▲' : '▼';
  const lineColor = isGood ? '#22c55e' : '#ef4444'; // green-500 : red-500

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow h-44">
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
      </div>

      {/* Value & MoM */}
      <div className="flex items-end gap-3 mb-2">
         <div className="text-3xl font-bold text-gray-800">{metric.value}</div>
         <div className={`text-xs font-bold ${trendColor} mb-1.5 flex items-center`}>
            <span className="mr-1 text-[8px]">{trendIcon}</span>
            {Math.abs(metric.mom).toFixed(1)}{typeof metric.value === 'string' && metric.value.includes('%') ? '%' : ''} 
            <span className="text-gray-400 font-normal ml-1">vs mes ant.</span>
         </div>
      </div>

      {/* Sparkline & Subtext */}
      <div className="flex items-end justify-between mt-auto">
        <div className="text-xs text-gray-400 max-w-[50%] truncate">{metric.subtext}</div>
        <div className="h-10 w-24 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.trendData}>
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={lineColor} 
                        strokeWidth={2} 
                        dot={false}
                        isAnimationActive={false} // Performance
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Simple Card for Last Updated (No sparkline needed)
const DateCard = ({ date }: { date: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow h-44">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Última Actualización</h3>
            <div className="p-2 rounded-lg text-purple-600 bg-purple-100 bg-opacity-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
        </div>
        <div>
            <div className="text-2xl font-bold text-gray-800">Hoy</div>
            <div className="text-sm text-gray-500 mt-1">{date}</div>
        </div>
        <div className="mt-auto">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-right">Sincronizado</div>
        </div>
    </div>
);

export const DashboardHeader: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Indicadores" 
        metric={stats.totalIndicators}
        colorClass="text-blue-600"
        icon={<ChartPieIcon className="w-6 h-6 text-blue-600" />}
      />
      <StatCard 
        title="Cumplimiento Global" 
        metric={stats.globalCompliance}
        colorClass="text-green-600"
        icon={
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        }
      />
      <StatCard 
        title="En Alerta (Crítico)" 
        metric={stats.criticalCount}
        colorClass="text-red-600"
        icon={<AlertCircleIcon className="w-6 h-6 text-red-600" />}
      />
      <DateCard date={stats.lastUpdated} />
    </div>
  );
};