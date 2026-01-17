import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import CyberButton from '../cyberpunk/CyberButton';
import CyberCard from '../cyberpunk/CyberCard';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin
}) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Username validation
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Only letters, numbers, and underscores allowed';
    }
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Must include uppercase, lowercase, and number';
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const success = await register(email, password, username);
      
      if (success) {
        toast.success('Registration successful!', {
          icon: '🎉',
          description: 'Welcome to the cyber network'
        });
        
        onSuccess?.();
        handleClose();
      } else {
        toast.error('Registration failed', {
          icon: '❌',
          description: 'Username or email may already exist'
        });
      }
    } catch (error) {
      toast.error('System error', {
        icon: '💥',
        description: 'Unable to process registration'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Number', met: /\d/.test(password) },
  ];

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
            <CyberCard className="p-6" glowColor="purple">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <UserPlus className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-orbitron text-white">NEW ACCESS REQUEST</h2>
                    <p className="text-sm text-gray-400">Join the cyber network</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full px-4 py-3 bg-dark-gray border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all ${
                        errors.username 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-secondary/30 focus:border-secondary'
                      }`}
                      placeholder="cyber_hacker"
                      disabled={isLoading}
                    />
                    {errors.username && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.username}
                    </p>
                  )}
                </div>

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
                      className={`w-full px-4 py-3 bg-dark-gray border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all ${
                        errors.email 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-secondary/30 focus:border-secondary'
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
                      className={`w-full px-4 py-3 bg-dark-gray border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all pr-12 ${
                        errors.password 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-secondary/30 focus:border-secondary'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-secondary/10 rounded transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-400' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-dark-gray border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all ${
                        errors.confirmPassword 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-secondary/30 focus:border-secondary'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <CyberButton
                  type="submit"
                  variant="secondary"
                  loading={isLoading}
                  icon={UserPlus}
                  fullWidth
                >
                  {isLoading ? 'CREATING ACCOUNT...' : 'REQUEST ACCESS'}
                </CyberButton>

                {/* Login Link */}
                {onSwitchToLogin && (
                  <div className="text-center pt-4 border-t border-secondary/20">
                    <p className="text-gray-400 text-sm">
                      Already have access?{' '}
                      <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-secondary hover:underline font-medium"
                      >
                        Login to system
                      </button>
                    </p>
                  </div>
                )}
              </form>

              {/* Terms Notice */}
              <div className="mt-6 p-4 bg-dark/30 rounded-lg border border-secondary/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Registration Terms</p>
                    <p className="text-xs text-gray-500 mt-1">
                      By requesting access, you agree to our terms of service. All accounts require 
                      manual approval by system administrators. Approval may take 24-48 hours.
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

export default RegisterModal;