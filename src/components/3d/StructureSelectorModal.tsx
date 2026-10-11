import React, { useEffect } from 'react';
import {
  Atom,
  Dna,
  Share2,
  CircleDot,
  Activity,
  Compass,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Maximize2,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { STRUCTURE_CATALOG, Structure3DType } from '../../types/theme';

export const StructureSelectorModal: React.FC = () => {
  const {
    structureType,
    setStructureType,
    isStructureModalOpen,
    setIsStructureModalOpen,
  } = useTheme();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsStructureModalOpen(false);
    };
    if (isStructureModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStructureModalOpen, setIsStructureModalOpen]);

  if (!isStructureModalOpen) return null;

  const getIcon = (id: Structure3DType) => {
    switch (id) {
      case 'atom':
        return <Atom className="w-5 h-5 text-emerald-400" />;
      case 'helix':
        return <Dna className="w-5 h-5 text-purple-400" />;
      case 'constellation':
        return <Share2 className="w-5 h-5 text-emerald-400" />;
      case 'orbit':
        return <CircleDot className="w-5 h-5 text-amber-400" />;
      case 'terrain':
        return <Activity className="w-5 h-5 text-rose-400" />;
      case 'radar':
        return <Compass className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsStructureModalOpen(false);
      }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] max-w-4xl w-full my-auto animate-fadeIn">
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 p-5 sm:p-6 text-slate-100 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-white/20">
                <Atom className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    3D Spatial Structure Architecture Gallery
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
                    WebGL 360°
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select how student cohort performance data is mathematically mapped and rendered in the 3D spatial viewport.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsStructureModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/5"
              aria-label="Close 3D structure modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Structures Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STRUCTURE_CATALOG.map((item) => {
              const isSelected = structureType === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setStructureType(item.id)}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/40 border-white/10 hover:border-white/30 hover:bg-slate-900/70 hover:shadow-lg'
                  }`}
                >
                  {/* Top Bar with Icon and Active Pill */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                        {getIcon(item.id)}
                      </div>

                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full border border-cyan-500/50 shadow-sm">
                          <Check className="w-3 h-3" /> Active Structure
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-200">
                          Click to select
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                      {item.tagline}
                    </span>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Math Formula & Recommended Tag */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-slate-300 truncate">
                      {item.mathFormula}
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="text-cyan-400 font-bold">Best for:</span>
                      <span className="truncate">{item.recommendedUse}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStructureType(item.id);
                        setIsStructureModalOpen(false);
                      }}
                      className={`w-full mt-2 py-1.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Currently Displaying</span>
                        </>
                      ) : (
                        <>
                          <span>Apply This 3D Structure</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Selected Structure: <strong className="text-cyan-300 font-bold">
                {STRUCTURE_CATALOG.find(s => s.id === structureType)?.title}
              </strong>
            </div>

            <button
              onClick={() => setIsStructureModalOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & View in 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
