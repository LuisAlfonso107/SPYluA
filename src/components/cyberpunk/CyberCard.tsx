import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CyberCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  glowColor?: 'cyan' | 'purple' | 'mixed' | 'neon' | 'matrix';
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

export default function CyberCard({ 
  children, 
  className = '', 
  hoverable = true,
  glowColor = 'cyan',
  onClick,
  padding = 'md',
  border = true,
  header,
  footer,
  ...motionProps
}: CyberCardProps) {
  const glowColors = {
    cyan: 'rgba(0, 255, 255, 0.15)',
    purple: 'rgba(156, 39, 176, 0.15)',
    mixed: 'rgba(0, 255, 255, 0.1), rgba(156, 39, 176, 0.1)',
    neon: 'rgba(255, 0, 255, 0.15), rgba(0, 255, 255, 0.15)',
    matrix: 'rgba(0, 255, 65, 0.15)'
  };

  const borderColors = {
    cyan: 'border-primary/30 hover:border-primary/60',
    purple: 'border-secondary/30 hover:border-secondary/60',
    mixed: 'border-primary/20 hover:border-secondary/40',
    neon: 'border-pink-500/30 hover:border-cyan-400/60',
    matrix: 'border-green-500/30 hover:border-green-400/60'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.01, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      className={`
        relative overflow-hidden rounded-xl
        bg-dark/50 backdrop-blur-lg
        ${border ? `border ${borderColors[glowColor]}` : ''}
        transition-all duration-300
        ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
        ${className}
      `}
      style={{
        boxShadow: hoverable ? `0 10px 40px ${glowColors[glowColor]}` : 'none',
      }}
      {...motionProps}
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            var(--primary) 0%, 
            transparent 30%, 
            var(--secondary) 70%, 
            transparent 100%)`,
          animation: 'gradient-shift 8s ease infinite'
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Corner accents with animation */}
      <div className="absolute top-0 left-0 w-6 h-6">
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-primary to-transparent"
          animate={{ height: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      
      <div className="absolute top-0 right-0 w-6 h-6">
        <motion.div
          className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-secondary to-transparent"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-secondary to-transparent"
          animate={{ height: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 w-6 h-6">
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary to-transparent"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-full w-0.5 bg-gradient-to-t from-secondary to-transparent"
          animate={{ height: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      
      <div className="absolute bottom-0 right-0 w-6 h-6">
        <motion.div
          className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-primary to-transparent"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-primary to-transparent"
          animate={{ height: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Header section */}
      {header && (
        <div className="relative z-10 border-b border-primary/20 pb-4 mb-4">
          {header}
        </div>
      )}

      {/* Main content */}
      <div className={`relative z-10 ${paddingClasses[padding]}`}>
        {children}
      </div>

      {/* Footer section */}
      {footer && (
        <div className="relative z-10 border-t border-primary/20 pt-4 mt-4">
          {footer}
        </div>
      )}

      {/* Hover glow effect */}
      {hoverable && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${glowColors[glowColor]} 0%, transparent 70%)`,
              filter: 'blur(20px)'
            }}
          />
        </div>
      )}
    </motion.div>
  );
}