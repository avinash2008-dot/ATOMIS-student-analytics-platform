import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ThemePreset,
  AccentColor,
  SurfaceMode,
  Structure3DType,
  ThemeConfig,
  THEME_PRESETS,
  STRUCTURE_CATALOG
} from '../types/theme';

interface ThemeContextType {
  theme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  surfaceMode: SurfaceMode;
  setSurfaceMode: (mode: SurfaceMode) => void;
  structureType: Structure3DType;
  setStructureType: (type: Structure3DType) => void;
  currentThemeConfig: ThemeConfig;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  isStructureModalOpen: boolean;
  setIsStructureModalOpen: (open: boolean) => void;
  resetThemeDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_THEME_KEY = 'kpmg_student_theme_preset';
const STORAGE_ACCENT_KEY = 'kpmg_student_accent_color';
const STORAGE_SURFACE_KEY = 'kpmg_student_surface_mode';
const STORAGE_STRUCTURE_KEY = 'kpmg_student_3d_structure';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY) as ThemePreset | null;
    return saved && THEME_PRESETS[saved] && saved !== 'obsidian' ? saved : 'emerald';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem(STORAGE_ACCENT_KEY) as AccentColor | null;
    return saved && saved !== 'cyan' ? saved : 'emerald';
  });

  const [surfaceMode, setSurfaceModeState] = useState<SurfaceMode>(() => {
    const saved = localStorage.getItem(STORAGE_SURFACE_KEY) as SurfaceMode | null;
    return saved || 'dark';
  });

  const [structureType, setStructureTypeState] = useState<Structure3DType>(() => {
    const saved = localStorage.getItem(STORAGE_STRUCTURE_KEY);
    return saved && saved !== 'scatter' && STRUCTURE_CATALOG.some(s => s.id === saved)
      ? (saved as Structure3DType)
      : 'atom';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);

  const setTheme = (newTheme: ThemePreset) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_THEME_KEY, newTheme);
    const config = THEME_PRESETS[newTheme];
    if (config) {
      setAccentState(config.primaryAccent);
      localStorage.setItem(STORAGE_ACCENT_KEY, config.primaryAccent);
      setSurfaceModeState(config.defaultSurface);
      localStorage.setItem(STORAGE_SURFACE_KEY, config.defaultSurface);
    }
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem(STORAGE_ACCENT_KEY, newAccent);
  };

  const setSurfaceMode = (newSurface: SurfaceMode) => {
    setSurfaceModeState(newSurface);
    localStorage.setItem(STORAGE_SURFACE_KEY, newSurface);
  };

  const setStructureType = (newStructure: Structure3DType) => {
    setStructureTypeState(newStructure);
    localStorage.setItem(STORAGE_STRUCTURE_KEY, newStructure);
  };

  const resetThemeDefaults = () => {
    setTheme('emerald');
    setAccent('emerald');
    setSurfaceMode('dark');
    setStructureType('atom');
  };

  const currentThemeConfig = THEME_PRESETS[theme] || THEME_PRESETS.obsidian;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccent,
        surfaceMode,
        setSurfaceMode,
        structureType,
        setStructureType,
        currentThemeConfig,
        isThemeModalOpen,
        setIsThemeModalOpen,
        isStructureModalOpen,
        setIsStructureModalOpen,
        resetThemeDefaults,
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
