import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Compass } from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Smart Campus Overview & Executive KPIs',
    tabTarget: 'overview',
    description:
      'The Overview page provides academic deans and HODs with high-level campus telemetry: average Student Success Score, at-risk student percentages, score histograms, and departmental risk heatmaps.',
    highlight: 'Observe the top 10 most improved vs declining students to immediately spot anomalies.',
  },
  {
    step: 2,
    title: 'Unified Student Directory & Explainable Profiles',
    tabTarget: 'students',
    description:
      'Search, filter, and sort 300 student profiles. Click on any student row to open their 360° profile drawer containing competency radar charts, subject breakdown, and explainability waterfalls.',
    highlight: 'Plain-English automated diagnostics explain exactly why risk was triggered.',
  },
  {
    step: 3,
    title: 'k=5 Multi-Factor Student Segmentation',
    tabTarget: 'segments',
    description:
      'Students are clustered into 5 distinct behavioral segments (e.g., High academic but low placement, Disengaged and at risk) with a two-dimensional scatter plot comparing Academic vs Placement readiness.',
    highlight: 'Each segment has tailored recommendations for remedial classes or placement drives.',
  },
  {
    step: 4,
    title: 'Targeted Interventions & Remedial Tracking',
    tabTarget: 'interventions',
    description:
      'Translate risk predictions into immediate faculty actions: assign mentor meetings, code camp modules, or academic contracts with pending/in-progress status tracking.',
    highlight: 'Faculty can bulk-assign interventions to all high-risk students in one click.',
  },
  {
    step: 5,
    title: 'Data Integration Pipeline & Score Customizer',
    tabTarget: 'integration',
    description:
      'View how 7 disparate raw sources (ERP, Attendance, LMS, Hackathons, Placements, Skills, Feedback) are merged with automated deduplication, median imputation, and outlier capping.',
    highlight: 'Adjust indicator weights in real-time under Score Settings to match your university curriculum.',
  },
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      onNavigateTab(TOUR_STEPS[nextIdx].tabTarget);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      onNavigateTab(TOUR_STEPS[prevIdx].tabTarget);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-[#0c1626] rounded-3xl border border-slate-200 dark:border-white/10 p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl text-slate-900 dark:text-slate-100 font-['Quicksand'] safe-bottom">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-[#3d63ff]">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-[#3d63ff]">
                  Guided Presentation Tour
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                  Step {currentStep.step} of 5
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-['Raleway'] mt-0.5 text-slate-900 dark:text-white leading-snug">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white touch-target flex items-center justify-center cursor-pointer"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-[#3d63ff]/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-700 dark:text-[#3d63ff] shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-700 dark:text-[#3d63ff]">Evaluator Focus:</strong> {currentStep.highlight}
            </div>
          </div>
        </div>

        {/* Progress Bar & Buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStepIdx
                    ? 'w-6 bg-[#3d63ff]'
                    : idx < currentStepIdx
                    ? 'bg-blue-300 dark:bg-blue-800'
                    : 'bg-slate-200 dark:bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIdx > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-full bg-[#3d63ff] hover:bg-[#3252db] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentStepIdx === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
