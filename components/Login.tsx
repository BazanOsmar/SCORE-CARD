import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular un pequeño delay de red para realismo
    setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
            onLogin();
        } else {
            setError('Credenciales incorrectas.');
            setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Sección Izquierda - Visual & Branding (Oculto en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121f3d] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#98ca3f] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#1c3643] opacity-40 blur-3xl"></div>
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#98ca3f] rounded-lg flex items-center justify-center text-[#121f3d] font-bold text-2xl shadow-lg shadow-green-900/20">
                P
            </div>
            <span className="text-2xl font-bold tracking-tight">Platzi Scorecard</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-6">
                Toma decisiones basadas en <span className="text-[#98ca3f]">datos reales.</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
                Visualiza el rendimiento estratégico de tu organización con la metodología Balanced Scorecard. Finanzas, Clientes, Procesos y Aprendizaje en un solo lugar.
            </p>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-sm text-gray-400 font-medium">
            "Never Stop Learning"
        </div>
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          
          {/* Mobile Logo (Visible solo en móvil) */}
          <div className="lg:hidden flex justify-center mb-8">
             <div className="w-12 h-12 bg-[#98ca3f] rounded-xl flex items-center justify-center text-[#121f3d] font-bold text-3xl">
                P
             </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2>
            <p className="text-gray-500 mt-2">Ingresa tus credenciales para acceder al dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-100 flex items-center animate-pulse">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#98ca3f] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="ej. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#98ca3f] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#98ca3f] hover:bg-[#86b535] text-[#121f3d] font-bold py-3.5 rounded-lg shadow-lg shadow-green-500/30 transition-all duration-200 transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-[#121f3d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validando...
                  </span>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};