// src/contexts/ThemeContext.tsx - Sistema de temas cyberpunk premium
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// SOLO 3 TEMAS: cyberpunk, dark, neon - SIN matrix
type Theme = 'cyberpunk' | 'dark' | 'neon';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  themes: Theme[]; // Array de temas disponibles
  getThemeIcon: () => string;
  getThemeName: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Array de temas disponibles - SIN matrix
  const availableThemes: Theme[] = ['cyberpunk', 'dark', 'neon'];
  
  const [theme, setTheme] = useState<Theme>(() => {
    // Recuperar tema guardado o usar cyberpunk por defecto
    const saved = localStorage.getItem('cyberpunk-theme');
    return (saved as Theme && availableThemes.includes(saved as Theme)) 
      ? (saved as Theme) 
      : 'cyberpunk';
  });

  useEffect(() => {
    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cyberpunk-theme', theme);

    // Remover todas las clases de tema previas
    availableThemes.forEach(t => {
      document.documentElement.classList.remove(`theme-${t}`);
    });
    
    // Añadir clase del tema actual
    document.documentElement.classList.add(`theme-${theme}`);

    // Estilos dinámicos basados en tema - SIN colores verdes matrix
    const style = document.documentElement.style;
    
    switch (theme) {
      case 'cyberpunk':
        // Tema principal: Cyan + Morado + Verde neón
        style.setProperty('--primary', '#00FFFF');
        style.setProperty('--secondary', '#9C27B0');
        style.setProperty('--accent', '#00FF9D');
        style.setProperty('--primary-rgb', '0, 255, 255');
        style.setProperty('--secondary-rgb', '156, 39, 176');
        style.setProperty('--accent-rgb', '0, 255, 157');
        break;
        
      case 'dark':
        // Tema oscuro: Azul + Púrpura + Esmeralda
        style.setProperty('--primary', '#3B82F6');
        style.setProperty('--secondary', '#8B5CF6');
        style.setProperty('--accent', '#10B981');
        style.setProperty('--primary-rgb', '59, 130, 246');
        style.setProperty('--secondary-rgb', '139, 92, 246');
        style.setProperty('--accent-rgb', '16, 185, 129');
        break;
        
      case 'neon':
        // Tema neón: Rosa + Amarillo + Cyan
        style.setProperty('--primary', '#FF00FF');
        style.setProperty('--secondary', '#FFFF00');
        style.setProperty('--accent', '#00FFFF');
        style.setProperty('--primary-rgb', '255, 0, 255');
        style.setProperty('--secondary-rgb', '255, 255, 0');
        style.setProperty('--accent-rgb', '0, 255, 255');
        break;
        
      // NO HAY CASE 'matrix' - ELIMINADO PERMANENTEMENTE
    }

    // También actualizar meta theme-color para móviles
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', 
        theme === 'cyberpunk' ? '#0A0A0A' :
        theme === 'dark' ? '#111827' :
        '#1A0033' // neon
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    const currentIndex = availableThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setTheme(availableThemes[nextIndex]);
  };

  const getThemeIcon = (): string => {
    switch (theme) {
      case 'cyberpunk': return '👾';
      case 'dark': return '🌙';
      case 'neon': return '💡';
      default: return '🎨';
    }
  };

  const getThemeName = (): string => {
    switch (theme) {
      case 'cyberpunk': return 'Cyberpunk';
      case 'dark': return 'Dark Mode';
      case 'neon': return 'Neon Lights';
      default: return 'Cyberpunk';
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDarkMode: theme !== 'neon',
    toggleTheme,
    themes: availableThemes,
    getThemeIcon,
    getThemeName
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};