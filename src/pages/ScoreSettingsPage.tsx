import React from 'react';
import { ScoreWeights } from '../data/studentTypes';
import { DEFAULT_WEIGHTS } from '../lib/scoring';
import {
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  Save
} from 'lucide-react';

interface ScoreSettingsPageProps {
  weights: ScoreWeights;
  onUpdateWeights: (weights: ScoreWeights) => void;
  onResetWeights: () => void;
}

export const ScoreSettingsPage: React.FC<ScoreSettingsPageProps> = ({
  weights,
  onUpdateWeights,
  onResetWeights,
}) => {
  const sumWeights = Object.values(weights).reduce((a, b) => a + b, 0);
  const totalPct = Math.round(sumWeights * 100);
  const isValidTotal = totalPct === 100;

  const handleSliderChange = (key: keyof ScoreWeights, val: number) => {
    onUpdateWeights({
      ...weights,
      [key]: Number((val / 100).toFixed(2)),
    });
  };

  const slidersConfig: Array<{
    key: keyof ScoreWeights;
    title: string;
    description: string;
  }> = [
    {
      key: 'academic',
      title: 'Academic Performance Weight',
      description: 'Weighted combination of CGPA, internal exam marks, and active backlog penalties.',
    },
    {
      key: 'attendance',
      title: 'Classroom Attendance Weight',
      description: 'Biometric physical lecture and laboratory attendance percentage (75% cutoff threshold).',
    },
    {
      key: 'lms',
      title: 'LMS Telemetry Weight',
      description: 'Weekly logins, digital course assignment completions, and video lecture consumption.',
    },
    {
      key: 'placement',
      title: 'Corporate Placement Weight',
      description: 'Aptitude speeds, live coding test benchmarks, and mock interview performance.',
    },
    {
      key: 'engagement',
      title: 'Campus Engagement Weight',
      description: 'Student club activities, hackathon project participation, and external certifications.',
    },
    {
      key: 'skills',
      title: 'Technical & Soft Skills Weight',
      description: 'Lab competencies, technical viva evaluations, and communication assessments.',
    },
    {
      key: 'feedback',
      title: 'Student & Faculty Feedback Weight',
      description: 'Student course satisfaction reviews combined with semester faculty behavioral appraisals.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-['Quicksand']">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-slate-900 dark:text-white">
            Institutional Score Formulation & Weight Customizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Fine-tune weights live with instant automatic recalculation across all 300 student profiles
          </p>
        </div>

        <button
          onClick={onResetWeights}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 hover:border-blue-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-700 dark:text-[#3d63ff]" />
          <span>Reset to University Defaults</span>
        </button>
      </div>

      {/* Formula & Weight Validation Banner */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-700 dark:text-[#3d63ff]" />
            <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
              Active Mathematical Formula
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isValidTotal
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            }`}>
              Total Weight: {totalPct}% {isValidTotal ? '(Valid)' : '(Must equal 100%)'}
            </span>
          </div>
        </div>

        <code className="block p-4 rounded-2xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-mono text-blue-700 dark:text-blue-300 leading-relaxed overflow-x-auto font-semibold">
          SuccessScore = (Academic × {weights.academic}) + (Attendance × {weights.attendance}) + (LMS × {weights.lms}) + (Engagement × {weights.engagement}) + (Placement × {weights.placement}) + (Skills × {weights.skills}) + (Feedback × {weights.feedback})
        </code>
      </div>

      {/* 7 Adjustable Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slidersConfig.map((item) => {
          const currentVal = Math.round(weights[item.key] * 100);
          return (
            <div
              key={item.key}
              className="p-6 rounded-3xl glass-panel space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white font-['Raleway']">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                    {item.description}
                  </p>
                </div>
                <span className="text-xl font-black font-['Raleway'] text-blue-700 dark:text-blue-400 shrink-0 ml-3">
                  {currentVal}%
                </span>
              </div>

              {/* Slider Input */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={currentVal}
                  onChange={(e) => handleSliderChange(item.key, Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-700 dark:accent-[#3d63ff]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span>0%</span>
                  <span>Default: {Math.round(DEFAULT_WEIGHTS[item.key] * 100)}%</span>
                  <span>60%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
