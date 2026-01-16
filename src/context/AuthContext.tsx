// src/contexts/AuthContext.tsx - Contexto de autenticación premium
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, AuthResponse } from '../lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación al cargar
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          
          // Simular carga de datos adicionales
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        toast.error('Error de sesión');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result: AuthResponse = await authService.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        toast.success('¡Bienvenido de nuevo, hacker!', {
          icon: '👾',
          description: 'Acceso concedido al sistema'
        });
        return true;
      } else {
        toast.error('Acceso denegado', {
          description: result.error || 'Credenciales incorrectas',
          icon: '🔒'
        });
        return false;
      }
    } catch (error) {
      toast.error('Error crítico', {
        description: 'Fallo en el sistema de autenticación',
        icon: '💥'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result: AuthResponse = await authService.register(email, password, username);
      
      if (result.success && result.user) {
        setUser(result.user);
        toast.success('¡Registro exitoso!', {
          icon: '🎉',
          description: 'Bienvenido a la red cyberpunk'
        });
        return true;
      } else {
        toast.error('Registro fallido', {
          description: result.error || 'Error en el registro',
          icon: '❌'
        });
        return false;
      }
    } catch (error) {
      toast.error('Error en el registro', {
        description: 'Intenta nuevamente más tarde',
        icon: '💥'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast('Sesión cerrada', {
      description: 'Has salido del sistema de manera segura',
      icon: '👋',
      action: {
        label: 'Volver a entrar',
        onClick: () => window.location.reload()
      }
    });
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // En una app real, aquí actualizarías en el backend
      sessionStorage.setItem('cyberpunk_user_data', JSON.stringify(updatedUser));
      
      toast.success('Perfil actualizado', {
        icon: '✨',
        description: 'Cambios guardados exitosamente'
      });
    } catch (error) {
      toast.error('Error al actualizar', {
        description: 'No se pudieron guardar los cambios'
      });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};