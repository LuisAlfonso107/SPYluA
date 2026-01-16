import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScanLinesProps {
  intensity?: 'subtle' | 'normal' | 'intense';
  speed?: 'slow' | 'normal' | 'fast';
  color?: 'cyan' | 'purple' | 'mixed' | 'custom';
  customColor?: string;
  opacity?: number;
  staticNoise?: boolean;
  flicker?: boolean;
  className?: string;
  interactive?: boolean;
  enabled?: boolean; // ← NUEVA PROPIEDAD
}

export default function ScanLines({
  intensity = 'subtle',
  speed = 'slow',
  color = 'cyan',
  customColor = '#00FFFF',
  opacity = 0.005, // ← REDUCIDO DRÁSTICAMENTE
  staticNoise = false, // ← DESACTIVADO
  flicker = false, // ← DESACTIVADO
  className = '',
  interactive = false,
  enabled = true // ← POR DEFECTO SÍ, PERO PUEDES PONER false
}: ScanLinesProps) {
  
  // Si no está habilitado, no renderizar nada
  if (!enabled) {
    return null;
  }

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const [scanPosition, setScanPosition] = useState(0);

  const intensities = {
    subtle: { lineHeight: 1, spacing: 6, opacity: opacity * 0.3 }, // ← Más sutil
    normal: { lineHeight: 2, spacing: 4, opacity: opacity },
    intense: { lineHeight: 3, spacing: 3, opacity: opacity * 2 }
  };

  const speeds = {
    slow: 20000,    // ← Más lento
    normal: 15000,
    fast: 10000
  };

  const colors = {
    cyan: '#00FFFF',
    purple: '#9C27B0',
    mixed: 'linear-gradient(180deg, #00FFFF 0%, #9C27B0 100%)',
    custom: customColor
  };

  const { lineHeight, spacing, opacity: lineOpacity } = intensities[intensity];
  const currentColor = colors[color];

  // Si la opacidad es muy baja, no hacer nada
  if (lineOpacity < 0.01) {
    return null;
  }

  // ... resto del código igual ...

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none z-50 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: flickerOpacity * 0.3 }} // ← Reducir más
      transition={{ duration: 0.3 }}
      style={{
        opacity: Math.max(0, getDynamicOpacity() * 0.5) // ← Mitad de opacidad
      }}
    >
      {/* ... resto del JSX ... */}
    </motion.div>
  );
}