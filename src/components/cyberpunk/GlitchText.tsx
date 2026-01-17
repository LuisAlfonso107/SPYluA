import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  intensity?: 'low' | 'medium' | 'high';
  animateOnHover?: boolean;
  children?: ReactNode;
}

export default function GlitchText({ 
  text, 
  className = '', 
  as: Tag = 'h1',
  intensity = 'medium',
  animateOnHover = false,
  children
}: GlitchTextProps) {
  const intensities = {
    low: { duration: 3, glitch1: 2, glitch2: 2 },
    medium: { duration: 2, glitch1: 4, glitch2: 4 },
    high: { duration: 1, glitch1: 8, glitch2: 8 }
  };

  const { duration, glitch1, glitch2 } = intensities[intensity];

  return (
    <motion.div 
      className={`relative inline-block ${className}`}
      whileHover={animateOnHover ? { scale: 1.02 } : {}}
    >
      {/* Main text */}
      <Tag className="relative z-10 text-white font-black tracking-wider">
        {children || text}
      </Tag>
      
      {/* Glitch layers */}
      <Tag 
        className="absolute top-0 left-0 text-primary opacity-70 z-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          animation: `glitch1 ${duration}s infinite`
        }}
        aria-hidden="true"
      >
        {text}
      </Tag>
      
      <Tag 
        className="absolute top-0 left-0 text-secondary opacity-70 z-0"
        style={{
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          animation: `glitch2 ${duration}s infinite`
        }}
        aria-hidden="true"
      >
        {text}
      </Tag>

      {/* Additional glitch layers for high intensity */}
      {intensity === 'high' && (
        <>
          <Tag 
            className="absolute top-0 left-0 text-accent opacity-50 z-0"
            style={{
              clipPath: 'polygon(0 30%, 100% 30%, 100% 70%, 0 70%)',
              animation: `glitch3 ${duration * 1.5}s infinite`
            }}
            aria-hidden="true"
          >
            {text}
          </Tag>
        </>
      )}

      {/* Scan line effect */}
      <div 
        className="absolute top-0 left-0 w-full h-0.5 bg-primary/50 z-10"
        style={{
          animation: `scanline ${duration * 2}s linear infinite`
        }}
      />

      <style>{`
        @keyframes glitch1 {
          0%, 90%, 100% { 
            transform: translate(-${glitch1}px, 0); 
            opacity: 0.7;
          }
          92% { 
            transform: translate(${glitch1 * 2}px, -1px); 
            opacity: 0.9;
          }
          94% { 
            transform: translate(-${glitch1}px, 1px); 
            opacity: 0.5;
          }
          96% { 
            transform: translate(${glitch1}px, 0); 
            opacity: 0.8;
          }
        }
        
        @keyframes glitch2 {
          0%, 90%, 100% { 
            transform: translate(${glitch2}px, 0); 
            opacity: 0.7;
          }
          91% { 
            transform: translate(-${glitch2 * 2}px, 1px); 
            opacity: 0.9;
          }
          93% { 
            transform: translate(${glitch1}px, -1px); 
            opacity: 0.5;
          }
          95% { 
            transform: translate(-${glitch1}px, 0); 
            opacity: 0.8;
          }
        }
        
        @keyframes glitch3 {
          0%, 50%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.3;
          }
          25% { 
            transform: translate(${glitch1}px, ${glitch1}px); 
            opacity: 0.6;
          }
          75% { 
            transform: translate(-${glitch1}px, -${glitch1}px); 
            opacity: 0.6;
          }
        }
        
        @keyframes scanline {
          0% { 
            transform: translateY(0); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(100%); 
            opacity: 0.2;
          }
          100% { 
            transform: translateY(0); 
            opacity: 0.8;
          }
        }
      `}</style>
    </motion.div>
  );
}