import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorPalette = 'soft' | 'vibrant';
type Theme = 'light' | 'dark';

interface SettingsContextType {
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorPalette, setColorPalette] = useState<ColorPalette>(() => {
    const saved = localStorage.getItem('colorPalette');
    return (saved as ColorPalette) || 'soft';
  });

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved === null ? true : saved === 'true';
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved === null ? true : saved === 'true';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('colorPalette', colorPalette);
    document.documentElement.setAttribute('data-palette', colorPalette);
  }, [colorPalette]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('animationsEnabled', String(animationsEnabled));
    document.documentElement.setAttribute('data-animations', String(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', String(soundEnabled));
  }, [soundEnabled]);

  return (
    <SettingsContext.Provider
      value={{
        colorPalette,
        setColorPalette,
        animationsEnabled,
        setAnimationsEnabled,
        soundEnabled,
        setSoundEnabled,
        theme,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
