import React, { useEffect } from 'react';
import {
  Palette,
  Check,
  Sun,
  Moon,
  Sparkles,
  X,
  RotateCcw,
  Sliders,
  Layers,
  Eye,
  CheckCircle2,
  Atom
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { THEME_PRESETS, ThemePreset, AccentColor, SurfaceMode } from '../types/theme';

export const ThemeSelectorModal: React.FC = () => {
  const {
    theme,
    setTheme,
    accent,
    setAccent,
    surfaceMode,
    setSurfaceMode,
    currentThemeConfig,
    isThemeModalOpen,
    setIsThemeModalOpen,
    resetThemeDefaults
  } = useTheme();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsThemeModalOpen(false);
    };
    if (isThemeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isThemeModalOpen, setIsThemeModalOpen]);

  if (!isThemeModalOpen) return null;

  const accentOptions: { id: AccentColor; name: string; hex: string; bgClass: string; ringColor: string }[] = [
    { id: 'cyan', name: 'Electric Cyan', hex: '#06b6d4', bgClass: 'bg-cyan-500', ringColor: 'ring-cyan-400' },
    { id: 'emerald', name: 'Neon Emerald', hex: '#10b981', bgClass: 'bg-emerald-500', ringColor: 'ring-emerald-400' },
    { id: 'indigo', name: 'Royal Indigo', hex: '#6366f1', bgClass: 'bg-indigo-500', ringColor: 'ring-indigo-400' },
    { id: 'amber', name: 'Radiant Amber', hex: '#f59e0b', bgClass: 'bg-amber-500', ringColor: 'ring-amber-400' },
    { id: 'rose', name: 'Sunset Rose', hex: '#f43f5e', bgClass: 'bg-rose-500', ringColor: 'ring-rose-400' },
    { id: 'violet', name: 'Ultra Violet', hex: '#a855f7', bgClass: 'bg-purple-500', ringColor: 'ring-purple-400' },
  ];

  const surfaceOptions: { id: SurfaceMode; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'dark',
      name: 'Deep Cyber Glass',
      icon: <Moon className="w-4 h-4 text-cyan-400" />,
      desc: 'Translucent glass with atmospheric ambient light glows'
    },
    {
      id: 'amoled',
      name: 'AMOLED True Black',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      desc: 'Absolute #000000 black canvas with intense neon specular edges'
    },
    {
      id: 'light',
      name: 'Arctic Daylight',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      desc: 'Crisp high-contrast daylight with frosted white cards & ink text'
    }
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsThemeModalOpen(false);
      }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] max-w-3xl w-full my-auto animate-fadeIn">
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 p-5 sm:p-6 text-slate-100 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/20">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Theme & Color Studio
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                    Live Reactive
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize platform visual branding, ambient light glows, 3D viewport colors, and surface contrast.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsThemeModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/5"
              aria-label="Close theme modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Visual Theme Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Select Theme Atmosphere</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Current: <strong className="text-white">{currentThemeConfig.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(THEME_PRESETS).map((preset) => {
                const isSelected = theme === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setTheme(preset.id)}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-cyan-400/50'
                        : 'bg-slate-900/40 border-white/10 hover:border-white/30 hover:bg-slate-900/70'
                    }`}
                  >
                    {/* Color Swatches Bar */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                          style={{
                            backgroundColor: `#${preset.threeJs.dirLight1.toString(16).padStart(6, '0')}`
                          }}
                        />
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                          style={{
                            backgroundColor: `#${preset.threeJs.dirLight2.toString(16).padStart(6, '0')}`
                          }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{
                            backgroundColor: `#${preset.threeJs.gridPrimary.toString(16).padStart(6, '0')}`
                          }}
                        />
                      </div>

                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {preset.tagline}
                      </p>
                    </div>

                    {/* Gradient accent indicator line */}
                    <div
                      className={`h-1 w-full rounded-full mt-3 bg-gradient-to-r ${preset.accentGradient}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Accent Highlight Color */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>2. Fine-Tune Brand Accent Color</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Affects active tabs, glows, and action buttons
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {accentOptions.map((acc) => {
                const isSelected = accent === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setAccent(acc.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-2 ' + acc.ringColor
                        : 'bg-slate-900/40 border-white/10 text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full ${acc.bgClass} shadow-sm border border-white/20`}
                    />
                    <span className="text-xs font-bold">{acc.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-white ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Surface Mode */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Surface Glass Mode</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {surfaceOptions.map((surf) => {
                const isSelected = surfaceMode === surf.id;
                return (
                  <button
                    key={surf.id}
                    onClick={() => setSurfaceMode(surf.id)}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900/90 border-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/50'
                        : 'bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                          {surf.icon}
                        </div>
                        <span className="text-xs font-extrabold text-white">{surf.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {surf.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, #${currentThemeConfig.threeJs.dirLight1.toString(16).padStart(6, '0')}, #${currentThemeConfig.threeJs.dirLight2.toString(16).padStart(6, '0')})`
                }}
              >
                <Atom className="w-5 h-5 text-white animate-spin" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Active Atmosphere Preview</span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentThemeConfig.name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="capitalize text-cyan-300 font-semibold">{accent} Accent</span>
                  <span className="text-slate-500">•</span>
                  <span className="capitalize text-slate-300">{surfaceMode} Surface</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetThemeDefaults}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset to default obsidian theme"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save & Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
