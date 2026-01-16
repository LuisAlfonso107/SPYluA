import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showIcon?: boolean;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  onClick?: () => void;
}

export default function Logo({ 
  size = 'md', 
  animated = true,
  showIcon = true,
  variant = 'full',
  className = '',
  onClick
}: LogoProps) {
  const sizes = {
    sm: { text: 'text-2xl', icon: 'w-6 h-6' },
    md: { text: 'text-4xl', icon: 'w-8 h-8' },
    lg: { text: 'text-6xl', icon: 'w-12 h-12' },
    xl: { text: 'text-8xl', icon: 'w-16 h-16' }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const logoText = "SPYlUA";
  const letters = logoText.split('');

  return (
    <motion.div
      className={`relative inline-flex items-center gap-3 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon version */}
      {variant === 'icon' && (
        <motion.div
          className="relative"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 1 }}
        >
          <div className={`${sizes[size].icon} relative`}>
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute inset-1 rounded-full border border-secondary"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Inner icon */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Cpu className="w-1/2 h-1/2 text-white" />
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-primary/20 blur-lg rounded-full -z-10" />
          </div>
        </motion.div>
      )}

      {/* Text version or full version */}
      {(variant === 'text' || variant === 'full') && (
        <div className="relative">
          <div className={`${sizes[size].text} font-orbitron font-black tracking-wider flex items-center`}>
            {/* Animated letters */}
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="relative"
                style={{ 
                  backgroundImage: index < 3 
                    ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                    : 'linear-gradient(135deg, var(--secondary), var(--primary))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {letter}
                {/* Individual letter glow */}
                <span 
                  className="absolute inset-0 blur-sm opacity-50 -z-10"
                  style={{
                    backgroundImage: index < 3 
                      ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                      : 'linear-gradient(135deg, var(--secondary), var(--primary))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                />
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          {variant === 'full' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 left-0 right-0 text-center"
            >
              <span className="text-xs font-rajdhani tracking-widest text-primary/70">
                CYBER NETWORK
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Icon beside text (for full version) */}
      {variant === 'full' && showIcon && (
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <Zap className={`${sizes[size].icon} text-primary`} />
          {/* Spark effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div 
              className="absolute top-0 left-1/2 w-0.5 h-2 bg-primary"
              style={{ transform: 'translateX(-50%)' }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Animated dot */}
      {animated && (
        <motion.span
          className="absolute -right-1 -top-1 w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: 'var(--primary)',
            boxShadow: '0 0 10px var(--primary), 0 0 20px var(--primary)' 
          }}
          animate={{
            opacity: [1, 0.3, 1],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Grid background effect */}
      <div 
        className="absolute inset-0 -z-20 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 95%, var(--primary) 100%),
            linear-gradient(0deg, transparent 95%, var(--secondary) 100%)
          `,
          backgroundSize: '20px 20px'
        }}
      />
    </motion.div>
  );
}