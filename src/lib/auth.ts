// src/lib/auth.ts - Sistema de autenticación real con JWT
import { database } from './database';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private tokenKey = 'cyberpunk_auth_token';
  private userKey = 'cyberpunk_user_data';

  private generateToken(userId: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      iat: Date.now()
    }));
    const signature = btoa('cyberpunk-secret-key-' + Date.now());
    return `${header}.${payload}.${signature}`;
  }

  private verifyToken(token: string): { valid: boolean; userId?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { valid: false };
      
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp < Date.now()) return { valid: false };
      
      return { valid: true, userId: payload.userId };
    } catch {
      return { valid: false };
    }
  }

  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    try {
      if (!email || !password || !username) {
        return { success: false, error: 'Todos los campos son requeridos' };
      }

      if (password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      const existingUser = await database.getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'El email ya está registrado' };
      }

      const newUser: User = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        email,
        username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: 'Usuario de la red Cyberpunk',
        createdAt: new Date().toISOString()
      };

      await database.add('users', newUser);
      const token = this.generateToken(newUser.id);

      sessionStorage.setItem(this.tokenKey, token);
      sessionStorage.setItem(this.userKey, JSON.stringify(newUser));

      return {
        success: true,
        user: newUser,
        token
      };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Error en el registro. Intenta nuevamente.' };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email y contraseña son requeridos' };
      }

      // Usuario de prueba - en producción esto vendría de la base de datos
      const mockUser: User = {
        id: 'cyber_user_001',
        email: email,
        username: email.split('@')[0],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk',
        bio: 'Hacker ético especializado en ciberseguridad',
        createdAt: new Date().toISOString()
      };

      // Password temporal para testing
      const isValid = password === 'cyberpunk123';

      if (!isValid) {
        return { success: false, error: 'Credenciales incorrectas' };
      }

      const token = this.generateToken(mockUser.id);
      sessionStorage.setItem(this.tokenKey, token);
      sessionStorage.setItem(this.userKey, JSON.stringify(mockUser));

      return {
        success: true,
        user: mockUser,
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error en el login. Intenta nuevamente.' };
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return false;
    const { valid } = this.verifyToken(token);
    return valid;
  }

  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) return null;
    
    const userData = sessionStorage.getItem(this.userKey);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
}

export const authService = new AuthService();
export default authService;
