import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../components/auth/RegisterModal';
import ParticleBackground from '../components/cyberpunk/ParticleBackground';
import ScanLines from '../components/cyberpunk/ScanLines';

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Fondo con partículas */}
      <ParticleBackground />
      <ScanLines />

      {/* Modal abierto por defecto */}
      <RegisterModal
        isOpen={true}
        onClose={() => navigate('/')}
        onSuccess={() => navigate('/dashboard')}
        onSwitchToLogin={() => navigate('/login')}
      />
    </div>
  );
}
