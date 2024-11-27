import { ReactNode, useState, useEffect } from 'react';
import { ThemeContext, Theme, Translation, defaultTheme } from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  const [translations, setTranslations] = useState<Translation>(() => {
    const saved = localStorage.getItem('translations');
    return saved ? JSON.parse(saved) : {};
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
    
    // Apply theme to root element
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--border-radius', theme.borderRadius);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('translations', JSON.stringify(translations));
  }, [translations]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      translations,
      setTranslations,
      language,
      setLanguage
    }}>
      {children}
    </ThemeContext.Provider>
  );
}