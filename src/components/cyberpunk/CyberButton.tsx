import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CyberButtonProps extends MotionProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
  fullWidth?: boolean;
}

export default function CyberButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  pulse = false,
  fullWidth = false,
  ...motionProps
}: CyberButtonProps) {
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-primary via-primary/90 to-primary/80',
      hover: 'hover:from-primary/90 hover:via-primary/80 hover:to-primary/70',
      text: 'text-dark font-bold',
      shadow: 'shadow-lg shadow-primary/30',
      glow: 'shadow-glow-primary'
    },
    secondary: {
      bg: 'bg-gradient-to-r from-secondary via-purple-500 to-secondary/80',
      hover: 'hover:from-secondary/90 hover:via-purple-600 hover:to-secondary/70',
      text: 'text-white font-bold',
      shadow: 'shadow-lg shadow-secondary/30',
      glow: 'shadow-glow-secondary'
    },
    outline: {
      bg: 'bg-transparent border-2',
      hover: 'hover:bg-primary/10 hover:border-primary/70',
      text: 'text-primary',
      shadow: 'shadow-lg shadow-primary/10',
      glow: ''
    },
    ghost: {
      bg: 'bg-transparent',
      hover: 'hover:bg-primary/10',
      text: 'text-primary',
      shadow: '',
      glow: ''
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-600 via-red-500 to-red-600',
      hover: 'hover:from-red-500 hover:via-red-400 hover:to-red-500',
      text: 'text-white font-bold',
      shadow: 'shadow-lg shadow-red-500/30',
      glow: 'shadow-glow-danger'
    },
    success: {
      bg: 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-600',
      hover: 'hover:from-green-500 hover:via-emerald-400 hover:to-green-500',
      text: 'text-white font-bold',
      shadow: 'shadow-lg shadow-green-500/30',
      glow: 'shadow-glow-success'
    }
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        relative overflow-hidden font-orbitron tracking-wider uppercase
        ${currentVariant.bg} ${currentVariant.hover}
        ${currentVariant.text} ${currentVariant.shadow}
        ${pulse ? 'animate-pulse-glow' : ''}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
      style={{
        borderColor: variant === 'outline' ? 'var(--primary)' : 'transparent',
        textShadow: variant === 'outline' || variant === 'ghost' ? '0 0 10px currentColor' : 'none'
      }}
      {...motionProps}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)'
          }}
        />
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {Icon && iconPosition === 'left' && (
          <Icon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        )}
      </span>

      {/* Corner accents with animation */}
      <span className="absolute top-0 left-0 w-2 h-2">
        <span className="absolute top-0 left-0 w-full h-0.5 bg-current opacity-70" />
        <span className="absolute top-0 left-0 h-full w-0.5 bg-current opacity-70" />
      </span>
      <span className="absolute top-0 right-0 w-2 h-2">
        <span className="absolute top-0 right-0 w-full h-0.5 bg-current opacity-70" />
        <span className="absolute top-0 right-0 h-full w-0.5 bg-current opacity-70" />
      </span>
      <span className="absolute bottom-0 left-0 w-2 h-2">
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current opacity-70" />
        <span className="absolute bottom-0 left-0 h-full w-0.5 bg-current opacity-70" />
      </span>
      <span className="absolute bottom-0 right-0 w-2 h-2">
        <span className="absolute bottom-0 right-0 w-full h-0.5 bg-current opacity-70" />
        <span className="absolute bottom-0 right-0 h-full w-0.5 bg-current opacity-70" />
      </span>

      {/* Ripple effect on click */}
      {!disabled && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            whileTap={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </motion.button>
  );
}