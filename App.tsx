import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { INITIAL_DATA } from './constants';
import { KGI, DashboardStats, Perspective, KPI } from './types';
import { calculateGlobalStats } from './utils/helpers';
import { DashboardHeader } from './components/DashboardHeader';
import { ChartsSection } from './components/ChartsSection';
import { PerspectiveCard } from './components/PerspectiveCard';
import { ArrowUpTrayIcon, BanknotesIcon, UserGroupIcon, CpuChipIcon, LightBulbIcon } from './components/Icons';
import { Login } from './components/Login';
import { KPIDetailModal } from './components/KPIDetailModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<KGI[]>(INITIAL_DATA);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  
  // Initialize with empty/safe default values matching the new StatMetric structure
  const [stats, setStats] = useState<DashboardStats>({
    totalIndicators: { value: 0, trendData: [], mom: 0, isInverse: false },
    globalCompliance: { value: '0%', trendData: [], mom: 0, isInverse: false },
    criticalCount: { value: 0, trendData: [], mom: 0, isInverse: true },
    lastUpdated: '-'
  });

  // Calculate stats whenever data changes
  useEffect(() => {
    const newStats = calculateGlobalStats(data);
    setStats(newStats);
  }, [data]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      
      console.log("Uploaded Data:", jsonData);
      alert("La funcionalidad de carga está simulada para esta demostración. Se ha leído el archivo en consola.");
    };
    reader.readAsBinaryString(file);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Filter data for each perspective
  const financialData = data.filter(d => d.perspective === Perspective.FINANCIAL);
  const customerData = data.filter(d => d.perspective === Perspective.CUSTOMER);
  const internalData = data.filter(d => d.perspective === Perspective.INTERNAL);
  const learningData = data.filter(d => d.perspective === Perspective.LEARNING);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Navigation / Brand - Platzi Style */}
      <nav className="bg-platzi-dark border-b border-platzi-blue sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-8 h-8 bg-platzi-green rounded-lg flex items-center justify-center text-platzi-dark font-bold text-lg">
                    P
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Platzi <span className="text-platzi-green">Scorecard</span></h1>
                    <p className="text-xs text-gray-400 -mt-1">Balanced Scorecard System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <label className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white hover:bg-platzi-blue transition-colors group border border-platzi-blue">
                  <ArrowUpTrayIcon className="h-5 w-5 mr-2 text-platzi-green" />
                  Cargar Excel
                  <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
               </label>
               <button 
                onClick={() => setIsAuthenticated(false)}
                className="text-sm text-gray-300 hover:text-white transition-colors"
               >
                 Salir
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Stats */}
        <DashboardHeader stats={stats} />

        {/* Charts Section */}
        <ChartsSection data={data} />

        {/* 2x2 Perspective Grid */}
        <div className="mt-8">
           <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-platzi-green rounded-full mr-3"></span>
              Perspectivas Estratégicas
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Financiera */}
              <div className="h-[500px]">
                 <PerspectiveCard 
                    title="Financiera" 
                    data={financialData}
                    headerColor="bg-emerald-600"
                    icon={<BanknotesIcon className="w-5 h-5" />}
                    onKPIClick={setSelectedKPI}
                 />
              </div>

              {/* Clientes */}
              <div className="h-[500px]">
                 <PerspectiveCard 
                    title="Clientes" 
                    data={customerData}
                    headerColor="bg-blue-600"
                    icon={<UserGroupIcon className="w-5 h-5" />}
                    onKPIClick={setSelectedKPI}
                 />
              </div>

              {/* Procesos Internos */}
              <div className="h-[500px]">
                 <PerspectiveCard 
                    title="Procesos Internos" 
                    data={internalData}
                    headerColor="bg-gray-700"
                    icon={<CpuChipIcon className="w-5 h-5" />}
                    onKPIClick={setSelectedKPI}
                 />
              </div>

              {/* Aprendizaje y Crecimiento */}
              <div className="h-[500px]">
                 <PerspectiveCard 
                    title="Aprendizaje y Crecimiento" 
                    data={learningData}
                    headerColor="bg-platzi-green"
                    icon={<LightBulbIcon className="w-5 h-5" />}
                    onKPIClick={setSelectedKPI}
                 />
              </div>

           </div>
        </div>

      </main>
      
      <footer className="border-t border-gray-200 bg-white mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Platzi Simulation Platform. Confidential Data.
          </div>
      </footer>

      {/* KPI Detail Modal */}
      <KPIDetailModal kpi={selectedKPI} onClose={() => setSelectedKPI(null)} />
    </div>
  );
}