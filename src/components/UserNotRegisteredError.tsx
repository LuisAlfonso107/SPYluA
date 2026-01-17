import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, LogOut, UserX, AlertTriangle, Lock, Key, RefreshCw } from 'lucide-react';
import CyberButton from './cyberpunk/CyberButton';
import CyberCard from './cyberpunk/CyberCard';
import GlitchText from './cyberpunk/GlitchText';
import { useNavigate } from 'react-router-dom';

interface UserNotRegisteredErrorProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  onLogout?: () => void;
  showContactAdmin?: boolean;
}

const UserNotRegisteredError: React.FC<UserNotRegisteredErrorProps> = ({
  title = "ACCESS RESTRICTED",
  message = "Your credentials don't have permission to access this system. This could be due to account restrictions, maintenance, or security protocols.",
  showRetry = true,
  onRetry,
  onLogout,
  showContactAdmin = true
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  const troubleshootingSteps = [
    {
      icon: UserX,
      title: "Account Status",
      description: "Your account may be pending approval or temporarily suspended"
    },
    {
      icon: Lock,
      title: "Permissions",
      description: "Required access levels haven't been granted to your account"
    },
    {
      icon: Key,
      title: "Authentication",
      description: "Session may have expired or credentials need revalidation"
    }
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CyberCard className="p-8 border-red-500/30" glowColor="mixed">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500/30">
                <ShieldAlert className="w-10 h-10 text-red-400" />
              </div>
              
              <GlitchText 
                text={title}
                as="h1"
                className="text-3xl md:text-4xl mb-4"
                intensity="medium"
              />
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {message}
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-orbitron text-red-400">SECURITY ALERT: UNAUTHORIZED ACCESS</span>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="mb-8">
              <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                POSSIBLE CAUSES
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {troubleshootingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-4 rounded-lg bg-dark/50 border border-primary/10 hover:border-primary/30 transition-colors">
                      <step.icon className="w-8 h-8 text-primary mb-3" />
                      <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {showRetry && (
                <CyberButton
                  variant="outline"
                  icon={RefreshCw}
                  onClick={handleRetry}
                  fullWidth
                >
                  Retry Authentication
                </CyberButton>
              )}
              
              <CyberButton
                variant="secondary"
                icon={LogOut}
                onClick={handleLogout}
                fullWidth
              >
                Return to Login
              </CyberButton>
            </div>

            {/* Admin Contact */}
            {showContactAdmin && (
              <div className="mt-8 pt-6 border-t border-primary/20">
                <p className="text-sm text-gray-400 text-center">
                  If you believe this is an error, contact the system administrator with your user ID: 
                  <span className="text-primary font-mono ml-2">USER_{Date.now().toString(36).toUpperCase()}</span>
                </p>
              </div>
            )}
          </CyberCard>

          {/* System Status */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span>System Status: RESTRICTED ACCESS</span>
              <span className="text-gray-600">•</span>
              <span>Timestamp: {new Date().toISOString().split('T')[0]} {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;