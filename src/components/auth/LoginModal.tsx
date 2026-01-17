import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Key, AlertCircle, LogIn } from 'lucide-react';
import CyberButton from '../cyberpunk/CyberButton';
import CyberCard from '../cyberpunk/CyberCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToRegister
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors', {
        icon: '⚠️',
        description: 'Check the form for validation errors'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login successful!', {
          icon: '🎉',
          description: 'Welcome back to the cyber network'
        });
        
        onSuccess?.();
        handleClose();
      } else {
        toast.error('Login failed', {
          icon: '🔒',
          description: 'Invalid credentials or account issue'
        });
      }
    } catch (error) {
      toast.error('System error', {
        icon: '💥',
        description: 'Unable to process login request'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setErrors({});
    onClose();
  };

  const handleForgotPassword = () => {
    toast.info('Password recovery', {
      description: 'Please contact system administrator for password reset',
      icon: '🔑'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <CyberCard className="p-6" glowColor="cyan">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Key className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-orbitron text-white">SYSTEM LOGIN</h2>
                    <p className="text-sm text-gray-400">Access the cyber network</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 bg-dark-gray border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                        errors.email 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-primary/30 focus:border-primary'
                      }`}
                      placeholder="hacker@cyberpunk.net"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-dark-gray border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-12 ${
                        errors.password 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-primary/30 focus:border-primary'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-primary/10 rounded transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <CyberButton
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  icon={LogIn}
                  fullWidth
                >
                  {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
                </CyberButton>

                {/* Register Link */}
                {onSwitchToRegister && (
                  <div className="text-center pt-4 border-t border-primary/20">
                    <p className="text-gray-400 text-sm">
                      Don't have access?{' '}
                      <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-primary hover:underline font-medium"
                      >
                        Request registration
                      </button>
                    </p>
                  </div>
                )}
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-dark/30 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Security Notice</p>
                    <p className="text-xs text-gray-500 mt-1">
                      This system uses end-to-end encryption. All login attempts are logged and monitored.
                    </p>
                  </div>
                </div>
              </div>
            </CyberCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;