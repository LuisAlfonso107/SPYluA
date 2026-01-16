// src/layouts/MainLayout.tsx - Layout principal cyberpunk premium
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, 
  User, 
  MessageSquare, 
  Users, 
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Globe,
  QrCode,
  Scan
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'Nuevo mensaje de Neo', unread: true },
    { id: 2, text: 'Evento hackathon mañana', unread: true },
    { id: 3, text: 'Actualización del sistema', unread: false }
  ]);
  
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Perfil', href: '/profile', icon: User },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Conexiones', href: '/connections', icon: Users },
    { name: 'Eventos', href: '/events', icon: Calendar },
    { name: 'QR Scanner', href: '/qr-scanner', icon: Scan },
    { name: 'Global Network', href: '/network', icon: Globe },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'cyberpunk': return '👾';
      case 'dark': return '🌙';
      case 'matrix': return '📟';
      case 'neon': return '💡';
      default: return '🎨';
    }
  };

  // Efecto para cerrar menú móvil al cambiar ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-dark text-white font-rajdhani">
      {/* Efecto de partículas en fondo */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
      </div>

      {/* Navbar superior */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-xl border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <Link to="/" className="ml-2 lg:ml-0 flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-primary/30 blur-lg rounded-lg" />
                </div>
                <span className="text-xl font-orbitron font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SPYlUA
                </span>
                <span className="hidden lg:inline text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-bold">
                  v2.0
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === item.href
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'hover:bg-primary/10 hover:text-primary/80'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors relative group"
                title={`Tema: ${theme}`}
              >
                <span className="text-xl">{getThemeIcon()}</span>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-dark-gray border border-primary/30 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Cambiar tema
                </div>
              </button>

              {/* Notifications */}
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors relative">
                  <Bell size={22} />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-80 bg-dark-gray border border-primary/30 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4 border-b border-primary/20">
                    <h3 className="font-orbitron font-bold">Notificaciones</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors ${
                          notification.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <p className="text-sm">{notification.text}</p>
                        {notification.unread && (
                          <div className="mt-2 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border-2 border-primary/50"
                    />
                    <div className="hidden lg:block text-left">
                      <p className="font-bold text-sm">{user.username}</p>
                      <p className="text-xs text-primary">Online</p>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-dark-gray border border-primary/30 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-4 border-b border-primary/20">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-12 h-12 rounded-full border-2 border-primary"
                        />
                        <div>
                          <p className="font-bold">{user.username}</p>
                          <p className="text-sm text-primary">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <User size={18} />
                        <span>Mi Perfil</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <Settings size={18} />
                        <span>Configuración</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors w-full"
                      >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-medium"
                  >
                    Ingresar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity font-medium"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl">
          <div className="pt-20 px-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 p-4 rounded-lg font-medium transition-all ${
                    location.pathname === item.href
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <item.icon size={22} />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-red-500/20 text-red-400 w-full"
                >
                  <LogOut size={22} />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-dark/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                <span className="font-orbitron font-bold text-lg">SPYlUA</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Red social cyberpunk · Conectando hackers desde 2026
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-gray-400 hover:text-primary transition-colors">
                <QrCode size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Globe size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Zap size={20} />
              </button>
              <div className="text-sm text-gray-500">
                v2.0 · {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Sonner Toaster personalizado */}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        theme="dark"
        toastOptions={{
          classNames: {
            toast: 'bg-dark-gray border border-primary/30 font-rajdhani',
            title: 'font-orbitron',
            description: 'text-gray-300',
            success: 'border-green-500/30',
            error: 'border-red-500/30',
            warning: 'border-yellow-500/30',
            info: 'border-blue-500/30',
          },
        }}
      />

      {/* Scan Lines Effect */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark/50" />
        <div className="absolute inset-0 opacity-[0.03]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="h-px w-full bg-primary absolute"
              style={{
                top: `${i * 2}%`,
                animation: `scan ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Glitch Effect ocasional */}
      <div className="fixed inset-0 pointer-events-none z-30 opacity-0 hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      </div>
    </div>
  );
};

export default MainLayout;