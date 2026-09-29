import React, { createContext, useContext, useState, useEffect } from 'react';

export type TextSize = 'normal' | 'large' | 'extra_large';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reduceAnimation: boolean;
  toggleReduceAnimation: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('neuronest_theme') as 'light' | 'dark') || 'light';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('neuronest_text_size') as TextSize) || 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('neuronest_high_contrast') === 'true';
  });

  const [reduceAnimation, setReduceAnimationState] = useState<boolean>(() => {
    return localStorage.getItem('neuronest_reduce_anim') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('neuronest_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-large', 'text-xlarge');
    if (textSize === 'large') root.classList.add('text-large');
    if (textSize === 'extra_large') root.classList.add('text-xlarge');
    localStorage.setItem('neuronest_text_size', textSize);
  }, [textSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('neuronest_high_contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (reduceAnimation) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    localStorage.setItem('neuronest_reduce_anim', String(reduceAnimation));
  }, [reduceAnimation]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  const setTextSize = (s: TextSize) => {
    setTextSizeState(s);
  };

  const toggleHighContrast = () => {
    setHighContrastState((prev) => !prev);
  };

  const toggleReduceAnimation = () => {
    setReduceAnimationState((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        textSize,
        setTextSize,
        highContrast,
        toggleHighContrast,
        reduceAnimation,
        toggleReduceAnimation,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
