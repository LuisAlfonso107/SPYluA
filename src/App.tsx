import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

// Layout principal
import MainLayout from './layouts/MainLayout';

// ✅ Componentes que SÍ tenemos migrados
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Importar CyberCard para ComingSoon
import CyberCard from './components/cyberpunk/CyberCard';

// ✅ LoadingScreen CORREGIDA (sin <style>)
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
    <div className="relative mb-8">
      {/* Logo animado */}
      <div className="w-24 h-24 relative">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
        <div 
          className="absolute inset-4 rounded-full border-4 border-purple-500 border-b-transparent animate-spin" 
          style={{ animationDirection: 'reverse' as const }} 
        />
        <div 
          className="absolute inset-8 rounded-full border-4 border-green-500 border-l-transparent animate-spin" 
          style={{ animationDuration: '1.5s' }} 
        />
      </div>
      
      {/* Texto */}
      <div className="text-center mt-6">
        <div className="relative">
          <h1 className="text-3xl font-bold text-white font-orbitron">SPYluA</h1>
          <div 
            className="absolute top-0 left-0 text-cyan-400 opacity-70" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
          >
            SPYluA
          </div>
          <div 
            className="absolute top-0 left-0 text-purple-500 opacity-70" 
            style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
          >
            SPYluA
          </div>
        </div>
        <p className="text-gray-400 mt-2 font-rajdhani">Inicializando sistema cyberpunk...</p>
      </div>
    </div>
    
    {/* Barra de progreso simplificada */}
    <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 w-1/3 animate-pulse" />
    </div>
  </div>
);

// Componente de páginas en desarrollo
const ComingSoon = ({ pageName = "Página" }) => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
    <CyberCard className="max-w-md p-8 text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-white font-orbitron mb-2">{pageName}</h1>
        <p className="text-gray-400 mb-6">En desarrollo - Próximamente</p>
      </div>
      
      <div className="space-y-3">
        <a 
          href="/dashboard" 
          className="block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity font-orbitron"
        >
          IR AL DASHBOARD
        </a>
        <a 
          href="/" 
          className="block px-6 py-3 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-colors font-orbitron"
        >
          VOLVER AL INICIO
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20">
        <p className="text-sm text-gray-500">
          <span className="text-cyan-400 font-semibold">Migración completada:</span> 
          <br />✓ Landing | ✓ Dashboard
        </p>
      </div>
    </CyberCard>
  </div>
);

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para rutas de autenticación
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// App principal
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* ✅ RUTAS PÚBLICAS */}
              <Route path="/" element={<Landing />} />
              
              {/* ✅ RUTAS AUTH */}
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              
              <Route path="/register" element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              } />
              
              {/* ✅ RUTAS PROTEGIDAS CON LAYOUT */}
              <Route element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ComingSoon pageName="Perfil" />} />
                <Route path="/chat" element={<ComingSoon pageName="Chat" />} />
                <Route path="/connections" element={<ComingSoon pageName="Conexiones" />} />
              </Route>
              
              {/* 🔄 RUTA 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          
          {/* Toaster */}
          <Toaster 
            position="bottom-right"
            theme="dark"
            toastOptions={{
              className: 'bg-gray-900 border border-cyan-500/30 font-rajdhani',
              duration: 4000,
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;