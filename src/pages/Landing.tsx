import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight, 
  Smartphone, 
  QrCode, 
  Lock, 
  Download, 
  Wifi,
  Eye,
  MessageSquare,
  Globe,
  CheckCircle,
  Star,
  Target,
  Sparkles,
  Rocket,
  Cpu,
  ShieldCheck,
  Clock,
  Bell,
 Calendar,
} from 'lucide-react';

// Importar componentes cyberpunk
import ParticleBackground from '../components/cyberpunk/ParticleBackground';
import ScanLines from '../components/cyberpunk/ScanLines';
import GlitchText from '../components/cyberpunk/GlitchText';
import CyberButton from '../components/cyberpunk/CyberButton';
import CyberCard from '../components/cyberpunk/CyberCard';
import Logo from '../components/cyberpunk/Logo';
import Radar from '../components/cyberpunk/Radar';
import BlurredImage from '../components/cyberpunk/BlurredImage';

// Importar contextos y servicios
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Landing() {
  const { isAuthenticated, login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isRevealed, setIsRevealed] = useState(false);
  const [radarUsers, setRadarUsers] = useState<any[]>([]);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [stats, setStats] = useState({
    activeUsers: 52789,
    connections: 213456,
    satisfaction: 99,
    eventsCreated: 15632
  });

  // Simular usuarios para el radar
  useEffect(() => {
    const mockUsers = [
      { id: '1', username: 'Neo', status: 'online', distance: 120, direction: 45, signalStrength: 85 },
      { id: '2', username: 'Trinity', status: 'busy', distance: 250, direction: 120, signalStrength: 60 },
      { id: '3', username: 'Morpheus', status: 'online', distance: 80, direction: 270, signalStrength: 95 },
      { id: '4', username: 'Cypher', status: 'offline', distance: 400, direction: 180, signalStrength: 25 },
      { id: '5', username: 'Oracle', status: 'away', distance: 320, direction: 315, signalStrength: 70 },
      { id: '6', username: 'Switch', status: 'online', distance: 180, direction: 90, signalStrength: 75 },
    ];
    setRadarUsers(mockUsers);

    // PWA Installation Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Animar stats
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
        connections: prev.connections + Math.floor(Math.random() * 50)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleInstallPWA = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success('¡App instalada!', {
            description: 'SPYlUA ha sido añadida a tu dispositivo.',
            icon: '📱'
          });
        }
        setInstallPrompt(null);
      });
    } else {
      toast.info('Para instalar la app:', {
        description: 'Usa el menú de tu navegador → "Instalar app" o "Añadir a pantalla de inicio"',
        icon: '📲',
        duration: 5000
      });
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: MapPin,
      title: 'Detección en Tiempo Real',
      description: 'Localiza usuarios cercanos con precisión milimétrica. Conecta en el metro, cafés o eventos.',
      color: 'cyan',
      gradient: 'from-primary to-cyan-300'
    },
    {
      icon: Eye,
      title: 'Foto con Reveal Control',
      description: 'Perfiles protegidos hasta conexión mutua. Tú decides cuándo revelar tu identidad.',
      color: 'purple',
      gradient: 'from-secondary to-purple-300'
    },
    {
      icon: Users,
      title: 'Red Social Segura',
      description: 'Comparte redes sociales solo con conexiones verificadas. Control total sobre tu información.',
      color: 'cyan',
      gradient: 'from-primary to-cyan-300'
    },
    {
      icon: ShieldCheck,
      title: 'Modo Invisible Premium',
      description: 'Navega anónimamente cuando quieras. Tu privacidad es nuestra prioridad.',
      color: 'purple',
      gradient: 'from-secondary to-purple-300'
    },
    {
      icon: MessageSquare,
      title: 'Chat Encriptado',
      description: 'Mensajes seguros con cifrado de extremo a extremo. Tu comunicación es privada.',
      color: 'cyan',
      gradient: 'from-primary to-cyan-300'
    },
    {
      icon: Globe,
      title: 'Red Global',
      description: 'Conecta con personas en cualquier ciudad del mundo. La distancia ya no es un límite.',
      color: 'purple',
      gradient: 'from-secondary to-purple-300'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Desarrollador en Silicon Valley',
      text: 'SPYlUA revolucionó cómo conecto en conferencias. Las conexiones más valiosas de mi carrera vinieron de aquí.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      rating: 5
    },
    {
      name: 'Maya Rodriguez',
      role: 'Diseñadora UX en Madrid',
      text: 'La privacidad controlada me dio confianza para conectar de verdad. ¡He hecho amigos increíbles!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
      rating: 5
    },
    {
      name: 'Kenji Tanaka',
      role: 'Startup Founder en Tokio',
      text: 'El radar en tiempo real es mágico. Encontré a mi cofundador en un café gracias a SPYlUA.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kenji',
      rating: 5
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Descarga & Registro',
      description: 'Instala la app y crea tu perfil en menos de 2 minutos.',
      icon: Download
    },
    {
      step: 2,
      title: 'Activa el Radar',
      description: 'Habilita la detección y encuentra usuarios cercanos.',
      icon: Target
    },
    {
      step: 3,
      title: 'Envía Conexiones',
      description: 'Selecciona personas interesantes y envía solicitudes.',
      icon: Users
    },
    {
      step: 4,
      title: 'Conecta & Colabora',
      description: 'Comparte redes y comienza a colaborar en tiempo real.',
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      {/* Background Effects */}
      <ParticleBackground 
        particleCount={80}
        intensity="medium"
        interactive={true}
        className="opacity-40"
      />
      
      <ScanLines 
        intensity="subtle"
        speed="normal"
        color="cyan"
        opacity={0.02}
        flicker={true}
      />

      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" animated={true} className="hover:scale-105 transition-transform" />
            <span className="hidden sm:inline text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-orbitron font-bold">
              v2.0
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {installPrompt && (
              <CyberButton 
                variant="ghost" 
                size="sm"
                icon={Download}
                onClick={handleInstallPWA}
                className="hidden sm:flex"
              >
                Instalar App
              </CyberButton>
            )}
            
            {isAuthenticated ? (
              <Link to="/dashboard">
                <CyberButton variant="primary" size="sm" icon={Rocket}>
                  Ir al Dashboard
                </CyberButton>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <CyberButton variant="outline" size="sm">
                    Iniciar Sesión
                  </CyberButton>
                </Link>
                <Link to="/register">
                  <CyberButton variant="primary" size="sm" pulse>
                    Crear Cuenta
                  </CyberButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-20 px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-orbitron text-primary">
                  PLATFORM LAUNCH 2026
                </span>
              </motion.div>

              {/* Main Heading */}
              <GlitchText 
                text="SPYlUA" 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4"
                intensity="medium"
              />
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-rajdhani font-bold leading-tight">
                Conecta con el{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                  futuro de las redes sociales
                </span>
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                La primera red social que combina interacciones del mundo real con tecnología 
                cyberpunk. Encuentra, conecta y colabora con personas que realmente importan.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <CyberButton
                  variant="primary"
                  size="lg"
                  icon={Rocket}
                  onClick={handleGetStarted}
                  pulse={!isAuthenticated}
                  className="min-w-[200px]"
                >
                  {isAuthenticated ? 'Ir al Dashboard' : 'Comenzar Gratis'}
                </CyberButton>
                
                <CyberButton
                  variant="outline"
                  size="lg"
                  icon={Download}
                  onClick={handleInstallPWA}
                >
                  Descargar App
                </CyberButton>
              </div>

              {/* Live Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-primary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { value: stats.activeUsers.toLocaleString(), label: 'Usuarios Activos', icon: Users },
                  { value: stats.connections.toLocaleString(), label: 'Conexiones', icon: CheckCircle },
                  { value: `${stats.satisfaction}%`, label: 'Satisfacción', icon: Star },
                  { value: stats.eventsCreated.toLocaleString(), label: 'Eventos', icon: Calendar }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <stat.icon className="w-4 h-4 text-primary" />
                      <p className="text-2xl font-orbitron font-bold text-gradient">
                        {stat.value}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative flex flex-col items-center">
                {/* Radar Demo */}
                <div className="relative mb-12">
                  <Radar 
                    nearbyUsers={radarUsers}
                    onUserSelect={(user) => {
                      toast.info(`Usuario detectado: ${user.username}`, {
                        description: 'Preparando conexión...',
                        icon: '👤'
                      });
                    }}
                    size={380}
                    radius={500}
                    showLabels={true}
                    interactive={true}
                    scanningSpeed="normal"
                    className="mx-auto"
                  />
                  
                  {/* Animated rings */}
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-8 rounded-full border border-primary/20 pointer-events-none"
                  />
                  <motion.div
                    animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-16 rounded-full border border-secondary/10 pointer-events-none"
                  />
                </div>

                {/* Blurred Image Demo */}
                <div className="text-center space-y-4">
                  <p className="text-gray-400 text-sm font-rajdhani">DEMO INTERACTIVO</p>
                  <div className="flex flex-col items-center gap-4">
                    <BlurredImage 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk"
                      isRevealed={isRevealed}
                      size="lg"
                      onReveal={() => setIsRevealed(true)}
                      onClick={() => setIsRevealed(!isRevealed)}
                    />
                    <CyberButton
                      variant="outline"
                      size="sm"
                      icon={isRevealed ? Eye : Lock}
                      onClick={() => setIsRevealed(!isRevealed)}
                    >
                      {isRevealed ? 'Ocultar Perfil' : 'Revelar Perfil'}
                    </CyberButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-transparent via-dark/50 to-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
              <Cpu className="w-4 h-4 text-secondary" />
              <span className="text-sm font-orbitron text-secondary">TECHNOLOGY</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Características{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Premium
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Diseñado para la próxima generación de conexiones sociales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard 
                  className="p-6 h-full hover:scale-[1.02] transition-transform duration-300"
                  glowColor={feature.color}
                  hoverable={true}
                >
                  <div className={`
                    w-14 h-14 rounded-xl mb-5 flex items-center justify-center
                    bg-gradient-to-br ${feature.gradient} bg-opacity-20
                  `}>
                    <feature.icon className={`w-7 h-7 ${feature.color === 'cyan' ? 'text-primary' : 'text-secondary'}`} />
                  </div>
                  
                  <h3 className="text-xl font-orbitron font-bold mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <span className="text-xs text-primary/70 font-orbitron">
                      FEATURE #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comienza en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                4 Pasos
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center z-10">
                  <span className="text-dark font-orbitron font-bold text-lg">{step.step}</span>
                </div>
                
                <CyberCard className="p-6 pt-10 h-full">
                  <step.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-orbitron font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-dark to-dark/80">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Lo que dicen nuestros{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                usuarios
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <CyberCard className="p-6 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-primary/50"
                    />
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 italic mb-4">"{testimonial.text}"</p>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-20 px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <CyberCard 
              className="p-8 md:p-12 relative overflow-hidden"
              glowColor="mixed"
            >
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-24 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 blur-3xl"
              />

              <div className="relative z-10">
                <Zap className="w-16 h-16 mx-auto mb-6 text-primary" />
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ¿Listo para el{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient">
                    futuro de las conexiones?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Únete a miles de personas que ya están transformando cómo se conectan en el mundo real.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CyberButton
                    variant="primary"
                    size="lg"
                    icon={Rocket}
                    onClick={handleGetStarted}
                    className="min-w-[200px]"
                    pulse
                  >
                    {isAuthenticated ? 'Continuar en Dashboard' : 'Comenzar Gratis'}
                  </CyberButton>
                  
                  <CyberButton
                    variant="outline"
                    size="lg"
                    icon={Download}
                    onClick={handleInstallPWA}
                  >
                    Instalar App
                  </CyberButton>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  No se requiere tarjeta de crédito • 30 días premium gratis • Cancelación en cualquier momento
                </p>
              </div>
            </CyberCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 border-t border-primary/20 bg-dark/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Logo size="md" animated={false} />
              <div>
                <p className="text-sm text-gray-400">© 2026 SPYlUA Cyberpunk Network</p>
                <p className="text-xs text-gray-600">v2.0 • Production Ready • Made with ❤️ for the future</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <Link to="/terms" className="hover:text-primary transition-colors">
                Términos
              </Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contacto
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                GitHub
              </a>
              <Link to="/docs" className="hover:text-primary transition-colors">
                Documentación
              </Link>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="mt-8 pt-8 border-t border-primary/10 text-center">
            <p className="text-xs text-gray-600">
              Built with: React 18 • TypeScript • Vite • Tailwind CSS • Framer Motion • IndexedDB • PWA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}