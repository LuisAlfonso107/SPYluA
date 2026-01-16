import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { Toaster } from 'sonner';

// SOLO cargar lo que hemos migrado realmente
const Landing = lazy(() => import('../src/pages/Landing'));
const Dashboard = lazy(() => import('../src/pages/Dashboard'));

// Componente de carga cyberpunk
const LoadingScreen = () => (
  <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8">
    <div className="relative mb-8">
      {/* Logo animado */}
      <div className="w-24 h-24 relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <div className="absolute inset-4 rounded-full border-4 border-secondary border-b-transparent animate-spin" style={{ animationDirection: 'reverse' }} />
        <div className="absolute inset-8 rounded-full border-4 border-accent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
      
      {/* Texto con efecto glitch */}
      <div className="text-center mt-6">
        <div className="relative">
          <h1 className="text-3xl font-orbitron text-primary">SPYlUA</h1>
          <div className="absolute top-0 left-0 text-cyan-400 opacity-70" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
            SPYlUA
          </div>
          <div className="absolute top-0 left-0 text-purple-500 opacity-70" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}>
            SPYlUA
          </div>
        </div>
        <p className="text-gray-500 mt-2 font-rajdhani">Inicializando sistema...</p>
      </div>
    </div>
    
    {/* Barra de progreso */}
    <div className="w-64 h-1 bg-dark-gray rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent animate-progress" />
    </div>
    
    <style>{`
      @keyframes progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-progress {
        animation: progress 2s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// Página de error/placeholder simple
const ComingSoon = ({ pageName = "Página" }) => (
  <div className="min-h-screen bg-dark flex items-center justify-center p-8">
    <div className="text-center max-w-md">
      <div className="mb-6">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-3xl font-orbitron text-primary mb-2">{pageName}</h1>
        <p className="text-gray-400 mb-6">Esta página está en desarrollo</p>
      </div>
      
      <div className="space-y-4">
        <a 
          href="/" 
          className="block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Ir a Landing
        </a>
        <a 
          href="/dashboard" 
          className="block px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
        >
          Ir al Dashboard
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-dark-gray rounded-lg border border-primary/20">
        <p className="text-sm text-gray-500">
          <span className="text-primary font-semibold">Migración en progreso:</span> 
          <br />Landing ✓ | Dashboard ✓ | Más páginas próximamente
        </p>
      </div>
    </div>
  </div>
);

// App principal simplificada
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* ✅ RUTAS MIGRADAS */}
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* ⚠️ RUTAS NO MIGRADAS - Redirigen al dashboard */}
              <Route path="/login" element={<ComingSoon pageName="Login" />} />
              <Route path="/register" element={<ComingSoon pageName="Registro" />} />
              <Route path="/profile" element={<ComingSoon pageName="Perfil" />} />
              <Route path="/chat" element={<ComingSoon pageName="Chat" />} />
              <Route path="/connections" element={<ComingSoon pageName="Conexiones" />} />
              <Route path="/events" element={<ComingSoon pageName="Eventos" />} />
              <Route path="/messages" element={<ComingSoon pageName="Mensajes" />} />
              <Route path="/qrcode" element={<ComingSoon pageName="QR Code" />} />
              <Route path="/settings" element={<ComingSoon pageName="Configuración" />} />
              
              {/* 🔄 RUTA 404 - Redirige al landing */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </Suspense>
          
          {/* Toaster global minimalista */}
          <Toaster 
            position="bottom-right"
            theme="dark"
            toastOptions={{
              className: 'bg-dark-gray border border-primary/30 font-rajdhani',
              duration: 4000,
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;