import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Unlock } from 'lucide-react';

interface BlurredImageProps {
  src?: string;
  alt?: string;
  isRevealed?: boolean;
  blurAmount?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLockIcon?: boolean;
  className?: string;
  onClick?: () => void;
  onReveal?: () => void;
}

export default function BlurredImage({ 
  src, 
  alt = 'Profile',
  isRevealed = false, 
  blurAmount = 20,
  size = 'md',
  showLockIcon = true,
  className = '',
  onClick,
  onReveal
}: BlurredImageProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <motion.div
      className={`relative rounded-full overflow-hidden ${sizes[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Dynamic glow ring with theme colors */}
      <div 
        className="absolute -inset-1 rounded-full"
        style={{
          background: isRevealed 
            ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' 
            : 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.3) 0%, rgba(var(--secondary-rgb), 0.3) 100%)',
          filter: 'blur(2px)'
        }}
      />

      {/* Image container with animated border */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-dark/50">
        {src ? (
          <motion.img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            initial={{ filter: `blur(${blurAmount}px)` }}
            animate={{ 
              filter: isRevealed ? 'blur(0px)' : `blur(${blurAmount}px)` 
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-gray to-dark flex items-center justify-center">
            <Eye className={`${iconSizes[size]} text-primary/50`} />
          </div>
        )}

        {/* Lock overlay with reveal button */}
        {!isRevealed && showLockIcon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-dark/40 backdrop-blur-sm"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReveal?.();
              }}
              className="group p-2 rounded-full bg-dark/60 hover:bg-primary/20 transition-colors"
            >
              <Lock className={`${iconSizes[size]} text-primary group-hover:text-secondary transition-colors`} />
            </button>
          </motion.div>
        )}

        {/* Revealed indicator */}
        {isRevealed && (
          <div className="absolute top-1 right-1">
            <Unlock className="w-3 h-3 text-green-400" />
          </div>
        )}
      </div>

      {/* Orbiting ring when revealed */}
      {isRevealed && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-1 h-1 rounded-full"
            style={{ 
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary), 0 0 20px var(--primary)' 
            }}
          />
        </motion.div>
      )}

      {/* Pulsing effect when interactive */}
      {onClick && !isRevealed && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}