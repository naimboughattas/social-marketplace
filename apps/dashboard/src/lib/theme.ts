import { createContext, useContext } from 'react';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
}

export interface Translation {
  [key: string]: string;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  translations: Translation;
  setTranslations: (translations: Translation) => void;
  language: string;
  setLanguage: (language: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const defaultTheme: Theme = {
  primaryColor: '#9333ea',
  secondaryColor: '#4f46e5',
  accentColor: '#ec4899',
  fontFamily: 'Inter',
  borderRadius: '0.5rem',
  buttonStyle: 'rounded'
};