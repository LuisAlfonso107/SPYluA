import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  RefreshCw, 
  Eye, 
  Radio, 
  ChevronRight, 
  Loader2, 
  Calendar,
  Zap,
  Shield,
  Cpu,
  Network,
  Activity,
  TrendingUp,
  QrCode,
  Globe,
  Lock,
  Unlock,
  Wifi,
  Satellite,
  Target,
  Sparkles,
  BarChart3,
  DownloadCloud
} from 'lucide-react';

// Componentes Cyberpunk
import ParticleBackground from '../components/cyberpunk/ParticleBackground';
import ScanLines from '../components/cyberpunk/ScanLines';
import Logo from '../components/cyberpunk/Logo';
import CyberCard from '../components/cyberpunk/CyberCard';
import CyberButton from '../components/cyberpunk/CyberButton';
import Radar from '../components/cyberpunk/Radar';
import GlitchText from '../components/cyberpunk/GlitchText';
import BlurredImage from '../components/cyberpunk/BlurredImage';

// Contextos y servicios
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

// Placeholders para componentes que migraremos después
const NotificationBell = () => (
  <div className="relative">
    <Bell className="w-5 h-5 text-primary" />
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
  </div>
);

const ProfileCard = ({ user, compact = false }: any) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-gray/50 border border-primary/20">
    <BlurredImage src={user?.avatar} size="sm" />
    <div className="flex-1">
      <h4 className="font-semibold text-white">{user?.name || 'Usuario'}</h4>
      <p className="text-xs text-primary">Online • 150m</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, getThemeIcon } = useTheme();
  const navigate = useNavigate();
  
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'connections' | 'activity'>('radar');

  // Datos simulados premium
  const [dashboardStats, setDashboardStats] = useState({
    nearbyUsers: 24,
    connections: 127,
    pendingRequests: 8,
    unreadMessages: 13,
    eventsToday: 3,
    networkStrength: 92,
    dataUsage: '4.7GB',
    privacyScore: 98
  });

  const [nearbyUsers, setNearbyUsers] = useState([
    { id: '1', name: 'Neo', status: 'online', distance: 120, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neo' },
    { id: '2', name: 'Trinity', status: 'busy', distance: 250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trinity' },
    { id: '3', name: 'Morpheus', status: 'online', distance: 80, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=morpheus' },
    { id: '4', name: 'Oracle', status: 'away', distance: 320, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oracle' },
    { id: '5', name: 'Switch', status: 'online', distance: 180, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=switch' },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, user: 'Neo', action: 'conexión aceptada', time: '2 min', icon: Users },
    { id: 2, user: 'Trinity', action: 'mensaje enviado', time: '15 min', icon: MessageSquare },
    { id: 3, user: 'Morpheus', action: 'evento creado', time: '1 hora', icon: Calendar },
    { id: 4, user: 'Oracle', action: 'perfil visto', time: '3 horas', icon: Eye },
  ]);

  // Simular geolocalización
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
    }, 1000);

    // Simular actualización de stats
    const statsInterval = setInterval(() => {
      setDashboardStats(prev => ({
        ...prev,
        nearbyUsers: prev.nearbyUsers + Math.floor(Math.random() * 3) - 1,
        unreadMessages: Math.max(0, prev.unreadMessages + Math.floor(Math.random() * 3) - 1)
      }));
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(statsInterval);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info('Actualizando datos del radar', {
      icon: '🔄',
      description: 'Buscando usuarios cercanos...'
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Radar actualizado', {
        icon: '✅',
        description: `${dashboardStats.nearbyUsers} usuarios detectados`
      });
    }, 1500);
  };

  const handleVisibilityToggle = () => {
    setIsVisible(!isVisible);
    toast[isVisible ? 'warning' : 'success'](
      isVisible ? 'Modo invisible activado' : 'Modo visible activado',
      {
        icon: isVisible ? '👻' : '👁️',
        description: isVisible 
          ? 'Ya no aparecerás en el radar de otros' 
          : 'Ahora eres visible para usuarios cercanos'
      }
    );
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    toast.info(`Usuario detectado: ${user.name}`, {
      description: 'Preparando opciones de conexión...',
      icon: '👤'
    });
  };

  const quickActions = [
    { icon: MessageSquare, label: 'Chat', count: dashboardStats.unreadMessages, color: 'primary', path: '/chat' },
    { icon: Users, label: 'Conexiones', count: dashboardStats.pendingRequests, color: 'secondary', path: '/connections' },
    { icon: Calendar, label: 'Eventos', count: dashboardStats.eventsToday, color: 'accent', path: '/events' },
    { icon: QrCode, label: 'QR Code', color: 'neon', path: '/qrcode' },
    { icon: Globe, label: 'Red', color: 'cyan', path: '/network' },
    { icon: BarChart3, label: 'Stats', color: 'purple', path: '/analytics' },
  ];

  const systemMetrics = [
    { label: 'CPU Usage', value: '42%', icon: Cpu, color: 'text-cyan-400' },
    { label: 'Memory', value: '3.2/8GB', icon: Activity, color: 'text-purple-400' },
    { label: 'Network', value: `${dashboardStats.networkStrength}%`, icon: Network, color: 'text-green-400' },
    { label: 'Storage', value: dashboardStats.dataUsage, icon: DownloadCloud, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-dark text-white overflow-hidden">
      {/* Background Effects */}
      <ParticleBackground 
        particleCount={50}
        intensity="medium"
        interactive={true}
        className="opacity-30"
      />
      
      <ScanLines 
        intensity="subtle"
        opacity={0.02}
        flicker={true}
        staticNoise={true}
      />

      {/* Header */}
      <header className="relative z-50 px-4 sm:px-6 py-4 border-b border-primary/20 bg-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" animated={true} className="hover:scale-105 transition-transform" />
            <div className="hidden md:block">
              <h1 className="text-lg font-orbitron font-bold text-gradient">DASHBOARD</h1>
              <p className="text-xs text-primary/70">Sistema de control principal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors relative group"
              title={`Tema: ${theme}`}
            >
              <span className="text-xl">{getThemeIcon()}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors relative">
                <Bell className="w-5 h-5 text-primary" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <BlurredImage 
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk'}
                  size="sm"
                  isRevealed={true}
                />
                <div className="hidden md:block text-left">
                  <p className="font-bold text-sm">{user?.username || 'Cyber User'}</p>
                  <p className="text-xs text-primary">Online • Lvl 42</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-40 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <GlitchText 
                text={`Bienvenido, ${user?.username || 'Hacker'}`}
                as="h1"
                className="text-3xl md:text-4xl mb-2"
                intensity="low"
              />
              <p className="text-gray-400">
                Sistema de control y monitoreo cyberpunk • {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <CyberButton
                variant={isVisible ? 'primary' : 'outline'}
                size="sm"
                icon={isVisible ? Eye : Lock}
                onClick={handleVisibilityToggle}
              >
                {isVisible ? 'Visible' : 'Invisible'}
              </CyberButton>
              
              <CyberButton
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={handleRefresh}
                loading={isRefreshing}
              >
                Actualizar
              </CyberButton>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <CyberCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Usuarios Cercanos</p>
                  <p className="text-2xl font-orbitron text-primary">{dashboardStats.nearbyUsers}</p>
                </div>
                <Radio className="w-8 h-8 text-primary/50" />
              </div>
              <div className="mt-2 h-1 bg-dark-gray rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-cyan-300 rounded-full"
                  style={{ width: `${(dashboardStats.nearbyUsers / 30) * 100}%` }}
                />
              </div>
            </CyberCard>

            <CyberCard className="p-4" glowColor="purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conexiones</p>
                  <p className="text-2xl font-orbitron text-secondary">{dashboardStats.connections}</p>
                </div>
                <Users className="w-8 h-8 text-secondary/50" />
              </div>
              <div className="mt-2 h-1 bg-dark-gray rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-secondary to-purple-300 rounded-full"
                  style={{ width: `${(dashboardStats.connections / 150) * 100}%` }}
                />
              </div>
            </CyberCard>

            <CyberCard className="p-4" glowColor="cyan">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Mensajes</p>
                  <p className="text-2xl font-orbitron text-accent">{dashboardStats.unreadMessages}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-accent/50" />
              </div>
              <div className="mt-2 h-1 bg-dark-gray rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-green-400 rounded-full"
                  style={{ width: `${(dashboardStats.unreadMessages / 20) * 100}%` }}
                />
              </div>
            </CyberCard>

            <CyberCard className="p-4" glowColor="mixed">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Privacidad</p>
                  <p className="text-2xl font-orbitron text-white">{dashboardStats.privacyScore}%</p>
                </div>
                <Shield className="w-8 h-8 text-white/50" />
              </div>
              <div className="mt-2 h-1 bg-dark-gray rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{ width: `${dashboardStats.privacyScore}%` }}
                />
              </div>
            </CyberCard>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Radar & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Radar Section */}
            <CyberCard className="p-6" glowColor="cyan">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-orbitron text-primary mb-2">RADAR ACTIVO</h2>
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-400">
                      {location ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Obteniendo ubicación...'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CyberButton
                    variant="outline"
                    size="sm"
                    icon={Target}
                    onClick={() => navigate('/network')}
                  >
                    Ver Mapa
                  </CyberButton>
                </div>
              </div>

              <div className="flex justify-center py-6">
                <Radar 
                  nearbyUsers={nearbyUsers}
                  onUserSelect={handleUserSelect}
                  size={320}
                  radius={500}
                  showLabels={true}
                  interactive={true}
                  scanningSpeed="normal"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-dark/50 border border-primary/10">
                    <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                    <p className="text-xs text-gray-400">{metric.label}</p>
                    <p className="text-lg font-orbitron font-bold">{metric.value}</p>
                  </div>
                ))}
              </div>
            </CyberCard>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                ACCIONES RÁPIDAS
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.path}>
                    <CyberCard 
                      className="p-4 cursor-pointer hover:scale-105 transition-transform"
                      hoverable={true}
                      glowColor={action.color as any}
                    >
                      <div className="text-center relative">
                        <action.icon className={`w-6 h-6 mx-auto mb-2 ${
                          action.color === 'primary' ? 'text-primary' :
                          action.color === 'secondary' ? 'text-secondary' :
                          action.color === 'accent' ? 'text-accent' :
                          'text-white'
                        }`} />
                        <p className="text-xs font-medium">{action.label}</p>
                        {action.count > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs font-bold flex items-center justify-center">
                            {action.count}
                          </span>
                        )}
                      </div>
                    </CyberCard>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Connections */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <CyberCard className="p-6" glowColor="purple">
              <h3 className="text-lg font-orbitron text-secondary mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                ACTIVIDAD RECIENTE
              </h3>
              
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-dark/30 hover:bg-dark/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <activity.icon className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 text-center text-primary text-sm hover:underline">
                Ver toda la actividad →
              </button>
            </CyberCard>

            {/* Nearby Users */}
            <CyberCard className="p-6" glowColor="cyan">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-orbitron text-primary flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-primary" />
                  USUARIOS CERCANOS
                </h3>
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                  {nearbyUsers.length} detectados
                </span>
              </div>

              <div className="space-y-3">
                {nearbyUsers.slice(0, 4).map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-dark/30 cursor-pointer hover:bg-dark/50 transition-all"
                    onClick={() => handleUserSelect(user)}
                  >
                    <BlurredImage 
                      src={user.avatar}
                      size="sm"
                      isRevealed={false}
                      onReveal={() => toast.info(`Solicitud enviada a ${user.name}`)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{user.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          user.status === 'online' ? 'bg-green-500/20 text-green-400' :
                          user.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{user.distance}m • </span>
                        <span className="text-primary">Solicitar conexión</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/connections')}
                className="w-full mt-4 text-center text-primary text-sm hover:underline flex items-center justify-center gap-1"
              >
                Ver todas las conexiones <ChevronRight className="w-3 h-3" />
              </button>
            </CyberCard>

            {/* Privacy Status */}
            <CyberCard className="p-6" glowColor="mixed">
              <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-white" />
                ESTADO DE PRIVACIDAD
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Anonimato</span>
                    <span className="text-primary">Alto</span>
                  </div>
                  <div className="h-2 bg-dark-gray rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-cyan-300 rounded-full w-4/5" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Encriptación</span>
                    <span className="text-secondary">Máxima</span>
                  </div>
                  <div className="h-2 bg-dark-gray rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-purple-300 rounded-full w-full" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Rastreo</span>
                    <span className="text-accent">Bloqueado</span>
                  </div>
                  <div className="h-2 bg-dark-gray rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-green-400 rounded-full w-3/4" />
                  </div>
                </div>
              </div>

              <CyberButton
                variant="outline"
                size="sm"
                fullWidth
                className="mt-4"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4" />
                Configurar Privacidad
              </CyberButton>
            </CyberCard>
          </div>
        </div>
      </main>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <CyberCard className="p-6" glowColor="mixed">
                <div className="text-center">
                  <BlurredImage 
                    src={selectedUser.avatar}
                    size="xl"
                    isRevealed={true}
                    className="mx-auto mb-4"
                  />
                  
                  <h3 className="text-2xl font-orbitron text-white mb-2">{selectedUser.name}</h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-primary">{selectedUser.status} • {selectedUser.distance}m</span>
                  </div>

                  <p className="text-gray-400 mb-6">
                    Usuario detectado en tu área. Puedes solicitar conexión para iniciar comunicación.
                  </p>

                  <div className="flex gap-3">
                    <CyberButton
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        toast.success(`Solicitud enviada a ${selectedUser.name}`, {
                          icon: '✅',
                          description: 'Esperando aceptación...'
                        });
                        setSelectedUser(null);
                      }}
                    >
                      <Users className="w-4 h-4" />
                      Solicitar Conexión
                    </CyberButton>
                    
                    <CyberButton
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                    >
                      Cancelar
                    </CyberButton>
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl"
        onClick={() => navigate('/scan')}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>

      {/* Footer */}
      <footer className="relative z-30 px-4 py-4 border-t border-primary/20 mt-8 bg-dark/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>SPYlUA Dashboard v2.0</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Sistema operativo: {isVisible ? 'VISIBLE' : 'INVISIBLE'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Latencia: 42ms</span>
            <span>•</span>
            <span>Uptime: 99.8%</span>
            <span>•</span>
            <span className="text-primary">Sistema: NOMINAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}