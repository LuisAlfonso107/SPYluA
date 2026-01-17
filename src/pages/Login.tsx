import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import ParticleBackground from '../components/cyberpunk/ParticleBackground';
import ScanLines from '../components/cyberpunk/ScanLines';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Fondo con partículas */}
      <ParticleBackground />
      <ScanLines />

      {/* Modal abierto por defecto */}
      <LoginModal
        isOpen={true}
        onClose={() => navigate('/')}
        onSuccess={() => navigate('/dashboard')}
        onSwitchToRegister={() => navigate('/register')}
      />
    </div>
  );
}
