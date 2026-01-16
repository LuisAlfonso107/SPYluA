import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitAngle?: number;
  isOrbiting?: boolean;
  orbitCenterX?: number;
  orbitCenterY?: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  intensity?: 'low' | 'medium' | 'high';
  colors?: string[];
  interactive?: boolean;
  orbitCenters?: Array<{ x: number; y: number }>;
  className?: string;
}

export default function ParticleBackground({
  particleCount = 80,
  intensity = 'medium',
  colors = ['#00FFFF', '#9C27B0', '#00FF9D', '#FF00FF', '#FFFF00'],
  interactive = true,
  orbitCenters = [],
  className = ''
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 });

  const intensities = {
    low: { speed: 0.3, size: 1.5, connections: false },
    medium: { speed: 0.5, size: 2, connections: true },
    high: { speed: 0.8, size: 2.5, connections: true }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Create particles
    const createParticles = () => {
      const particles: Particle[] = [];
      const { size: baseSize } = intensities[intensity];
      
      for (let i = 0; i < particleCount; i++) {
        const isOrbiting = Math.random() > 0.7 && orbitCenters.length > 0;
        const orbitCenter = isOrbiting 
          ? orbitCenters[Math.floor(Math.random() * orbitCenters.length)]
          : { x: canvas.width / 2, y: canvas.height / 2 };

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * baseSize + 1,
          speedX: (Math.random() - 0.5) * intensities[intensity].speed,
          speedY: (Math.random() - 0.5) * intensities[intensity].speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.3,
          isOrbiting,
          orbitRadius: Math.random() * 150 + 50,
          orbitSpeed: Math.random() * 0.02 + 0.01,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitCenterX: orbitCenter.x,
          orbitCenterY: orbitCenter.y
        });
      }
      
      particlesRef.current = particles;
    };

    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        // Update position
        if (p.isOrbiting && p.orbitCenterX && p.orbitCenterY && p.orbitRadius && p.orbitAngle && p.orbitSpeed) {
          p.orbitAngle += p.orbitSpeed;
          p.x = p.orbitCenterX + Math.cos(p.orbitAngle) * p.orbitRadius;
          p.y = p.orbitCenterY + Math.sin(p.orbitAngle) * p.orbitRadius;
        } else {
          p.x += p.speedX;
          p.y += p.speedY;

          // Bounce off edges
          if (p.x <= 0 || p.x >= canvas.width) p.speedX *= -1;
          if (p.y <= 0 || p.y >= canvas.height) p.speedY *= -1;
        }

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRef.current.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
            
            p.x -= Math.cos(angle) * force * 2;
            p.y -= Math.sin(angle) * force * 2;
          }
        }

        // Draw particle with glow
        drawParticleWithGlow(ctx, p);
      });

      // Draw connections between particles
      if (intensities[intensity].connections) {
        drawConnections(ctx);
      }

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    // Draw particle with glow effect
    const drawParticleWithGlow = (ctx: CanvasRenderingContext2D, p: Particle) => {
      // Outer glow
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 3
      );
      gradient.addColorStop(0, p.color + '80');
      gradient.addColorStop(1, p.color + '00');
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.fill();

      // Inner glow
      const innerGradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 1.5
      );
      innerGradient.addColorStop(0, p.color + 'FF');
      innerGradient.addColorStop(1, p.color + '80');
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = innerGradient;
      ctx.globalAlpha = p.opacity * 0.8;
      ctx.fill();

      // Solid core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Reset alpha
      ctx.globalAlpha = 1;
    };

    // Draw connections between particles
    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      const particles = particlesRef.current;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            // Calculate line width and opacity based on distance
            const lineWidth = Math.max(0.3, (120 - distance) / 120 * 1.5);
            const opacity = Math.max(0.05, (120 - distance) / 120 * 0.3);
            
            // Create gradient for connection line
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, p1.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, p2.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = opacity;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    // Initialize
    setCanvasSize();
    createParticles();
    drawParticles();

    // Event listeners
    window.addEventListener('resize', setCanvasSize);
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, intensity, colors, interactive, orbitCenters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`fixed inset-0 pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Overlay gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.8) 70%, rgba(10, 10, 10, 1) 100%)'
        }}
      />
    </motion.div>
  );
}