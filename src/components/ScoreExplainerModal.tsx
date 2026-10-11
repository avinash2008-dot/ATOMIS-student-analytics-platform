import React from 'react';
import { X, Calculator, Sliders, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { ScoreWeights } from '../data/studentTypes';

interface ScoreExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: ScoreWeights;
}

export const ScoreExplainerModal: React.FC<ScoreExplainerModalProps> = ({
  isOpen,
  onClose,
  weights,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0c1626] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900 dark:text-slate-100 font-['Quicksand']">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-[#3d63ff]">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Raleway'] text-slate-900 dark:text-white">How the Success Score Works</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Transparent multi-indicator weighting & grading methodology
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Formula Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-[#3d63ff]/20 text-xs sm:text-sm space-y-2">
          <span className="font-bold text-blue-700 dark:text-[#3d63ff] uppercase tracking-wider text-[11px] block">
            Mathematical Formulation:
          </span>
          <code className="block p-3 rounded-xl bg-white/90 dark:bg-black/50 border border-blue-200 dark:border-white/10 text-xs font-mono text-blue-700 dark:text-blue-300 font-bold">
            Success Score = (Academic × {weights.academic}) + (Attendance × {weights.attendance}) + (LMS × {weights.lms}) + (Engagement × {weights.engagement}) + (Placement × {weights.placement}) + (Skills × {weights.skills}) + (Feedback × {weights.feedback})
          </code>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Every raw indicator is normalized on a standardized 0 to 100 benchmark. Active backlogs apply an 8-point penalty per backlog. Attendance below 75% applies a progressive steepness penalty.
          </p>
        </div>

        {/* Weights & Indicators Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
            Active Indicator Weights ({Math.round(Object.values(weights).reduce((a, b) => a + b, 0) * 100)}% Total)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400 block">Academic Performance</span>
              <span className="text-base font-bold text-blue-700 dark:text-[#3d63ff] font-['Raleway']">{Math.round(weights.academic * 100)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400 block">Class Attendance</span>
              <span className="text-base font-bold text-blue-700 dark:text-[#3d63ff] font-['Raleway']">{Math.round(weights.attendance * 100)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400 block">LMS Engagement</span>
              <span className="text-base font-bold text-blue-700 dark:text-[#3d63ff] font-['Raleway']">{Math.round(weights.lms * 100)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400 block">Placement Readiness</span>
              <span className="text-base font-bold text-blue-700 dark:text-[#3d63ff] font-['Raleway']">{Math.round(weights.placement * 100)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400 block">Campus Engagement</span>
              <span className="text-base font-bold text-blue-700 dark:text-[#3d63ff] font-['Raleway']">{Math.round(weights.engagement * 100)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-slate-600 dark:text-slate-400 block">Skills & Feedback</span>
              <span className="text-base font-bold text-blue-700 dark:text-[#3d63ff] font-['Raleway']">{Math.round((weights.skills + weights.feedback) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Score Bands Definition */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
            Score Classification Bands
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 block">80 - 100</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-400">Thriving</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="font-bold text-blue-700 dark:text-blue-300 block">60 - 79</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-400">On Track</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="font-bold text-amber-700 dark:text-amber-300 block">40 - 59</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-400">Needs Attention</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <span className="font-bold text-rose-700 dark:text-rose-300 block">&lt; 40</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-400">Critical Risk</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#3d63ff] hover:bg-[#3252db] text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};
