import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Wifi, Signal, Target, Scan } from 'lucide-react';

interface RadarUser {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  distance: number;
  direction: number; // in degrees
  signalStrength: number; // 0-100
}

interface RadarProps {
  nearbyUsers?: RadarUser[];
  onUserSelect?: (user: RadarUser) => void;
  radius?: number; // in meters
  size?: number; // in pixels
  showLabels?: boolean;
  interactive?: boolean;
  scanningSpeed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export default function Radar({
  nearbyUsers = [],
  onUserSelect,
  radius = 500,
  size = 300,
  showLabels = true,
  interactive = true,
  scanningSpeed = 'normal',
  className = ''
}: RadarProps) {
  const [sweepAngle, setSweepAngle] = useState(0);
  const [detectedUsers, setDetectedUsers] = useState<RadarUser[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const radarRef = useRef<HTMLDivElement>(null);

  const scanSpeeds = {
    slow: 40,
    normal: 30,
    fast: 20
  };

  // Calculate position based on direction and distance
  const calculatePosition = (user: RadarUser) => {
    const angleRad = (user.direction * Math.PI) / 180;
    const normalizedDistance = Math.min(user.distance / radius, 0.95); // Keep inside radar
    const x = Math.cos(angleRad) * normalizedDistance * (size / 2 - 30);
    const y = Math.sin(angleRad) * normalizedDistance * (size / 2 - 30);
    return { x: x + size / 2, y: y + size / 2 };
  };

  // Check if user is in sweep
  const isUserInSweep = (user: RadarUser) => {
    const angleDiff = Math.abs(user.direction - sweepAngle);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
    return normalizedDiff < 30; // 30 degree detection arc
  };

  // Scan animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isScanning) {
        setSweepAngle(prev => (prev + 1) % 360);
        
        // Detect users in sweep
        const newlyDetected = nearbyUsers.filter(user => 
          isUserInSweep(user) && 
          !detectedUsers.some(detected => detected.id === user.id)
        );
        
        if (newlyDetected.length > 0) {
          setDetectedUsers(prev => [...prev, ...newlyDetected]);
        }
      }
    }, scanSpeeds[scanningSpeed]);

    return () => clearInterval(interval);
  }, [isScanning, scanningSpeed, nearbyUsers, detectedUsers]);

  // Reset detected users when nearby users change
  useEffect(() => {
    setDetectedUsers([]);
  }, [nearbyUsers]);

  const getSignalStrengthColor = (strength: number) => {
    if (strength > 75) return 'bg-green-500';
    if (strength > 50) return 'bg-yellow-500';
    if (strength > 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: RadarUser['status']) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      ref={radarRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer glow ring */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />

      {/* Radar container */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        style={{
          background: 'radial-gradient(circle, rgba(0,20,40,0.9) 0%, rgba(0,10,20,0.95) 100%)'
        }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <circle cx="50%" cy="50%" r="25%" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="5,5" />
          <circle cx="50%" cy="50%" r="50%" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="5,5" />
          <circle cx="50%" cy="50%" r="75%" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="5,5" />
          
          {/* Angle lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="50%"
              y1="50%"
              x2={`${50 + Math.cos(angle * Math.PI / 180) * 50}%`}
              y2={`${50 + Math.sin(angle * Math.PI / 180) * 50}%`}
              stroke="var(--primary)"
              strokeWidth="0.5"
              strokeOpacity="0.5"
            />
          ))}
        </svg>

        {/* Distance rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0.25, 0.5, 0.75].map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border border-primary/20"
              style={{
                width: `${ring * 100}%`,
                height: `${ring * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Sweep line */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-left"
          style={{
            width: size / 2 - 4,
            height: 2,
            background: 'linear-gradient(90deg, rgba(0,255,255,0.8) 0%, transparent 100%)',
            transform: `translate(0, -50%) rotate(${sweepAngle}deg)`,
          }}
        >
          {/* Sweep dot */}
          <div 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary), 0 0 20px var(--primary)'
            }}
          />
        </motion.div>

        {/* Sweep trail */}
        <div
          className="absolute top-1/2 left-1/2 origin-center rounded-full pointer-events-none"
          style={{
            width: size - 8,
            height: size - 8,
            transform: 'translate(-50%, -50%)',
            background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, rgba(0,255,255,0.15) 30deg, transparent 60deg)`
          }}
        />

        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 20px rgba(0,255,255,0.8)' }}
          >
            <Target className="w-2 h-2 text-dark" />
          </motion.div>
        </div>

        {/* User blips */}
        {nearbyUsers.map((user) => {
          const pos = calculatePosition(user);
          const inSweep = isUserInSweep(user);
          const isDetected = detectedUsers.some(d => d.id === user.id);

          return (
            <motion.button
              key={user.id}
              onClick={() => interactive && onUserSelect?.(user)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isDetected ? 1 : 0.5,
                opacity: isDetected ? 1 : 0.3
              }}
              whileHover={interactive ? { scale: 1.3 } : {}}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
              style={{ 
                left: pos.x, 
                top: pos.y,
              }}
              disabled={!interactive}
            >
              {/* User blip */}
              <div className="relative">
                {/* Status ring */}
                <div className={`absolute -inset-1 rounded-full ${getStatusColor(user.status)} opacity-20`} />
                
                {/* Main blip */}
                <div 
                  className={`
                    w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
                    ${inSweep ? 'bg-primary' : 'bg-primary/60'}
                    ${interactive ? 'group-hover:bg-secondary' : ''}
                  `}
                  style={{
                    boxShadow: inSweep 
                      ? '0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(0,255,255,0.4)' 
                      : '0 0 5px rgba(0,255,255,0.4)'
                  }}
                >
                  <User className="w-2.5 h-2.5 text-dark" />
                </div>

                {/* Signal strength indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-0.5">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`w-0.5 h-1 rounded-full ${
                        user.signalStrength >= bar * 33 ? getSignalStrengthColor(user.signalStrength) : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Ping effect when detected */}
                {inSweep && isDetected && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                )}
              </div>

              {/* User label */}
              {showLabels && isDetected && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="px-2 py-1 bg-dark/90 backdrop-blur-sm rounded text-xs border border-primary/30">
                    <span className="text-primary font-bold">{user.username}</span>
                    <span className="text-primary/60 text-xs ml-1">{user.distance}m</span>
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* Scanning indicator */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Scan className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-xs text-primary/80 font-orbitron">
              {isScanning ? 'SCANNING' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Radius label */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3 text-primary/60" />
            <span className="text-xs text-primary/60 font-rajdhani">
              RADIO: {radius}m
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="p-2 rounded-lg bg-dark/50 border border-primary/30 hover:bg-primary/10 transition-colors"
          title={isScanning ? 'Pause scan' : 'Resume scan'}
        >
          <Signal className={`w-4 h-4 ${isScanning ? 'text-primary' : 'text-primary/50'}`} />
        </button>
      </div>
    </motion.div>
  );
}