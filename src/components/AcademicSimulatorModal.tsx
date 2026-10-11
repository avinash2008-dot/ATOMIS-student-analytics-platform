import React, { useState } from 'react';
import { Student } from '../types/student';
import { api, SimulationResult } from '../services/api';
import {
  X,
  Sliders,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AcademicSimulatorModalProps {
  student: Student;
  onClose: () => void;
}

export const AcademicSimulatorModal: React.FC<AcademicSimulatorModalProps> = ({ student, onClose }) => {
  const [extraClasses, setExtraClasses] = useState<number>(14);
  const [clearedBacklogs, setClearedBacklogs] = useState<number>(Math.min(student.activeBacklogs, 2));
  const [internalMarksTarget, setInternalMarksTarget] = useState<number>(78);
  const [byteXlHoursPerWeek, setByteXlHoursPerWeek] = useState<number>(8);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateTrajectory(student.id, {
        additionalAttendanceClasses: extraClasses,
        clearedBacklogsTarget: clearedBacklogs,
        targetInternalMarks: internalMarksTarget,
        byteXlPracticeHoursPerWeek: byteXlHoursPerWeek
      });
      if (res.success) {
        setSimulationResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)] w-full max-w-3xl my-auto"
      >
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Sliders className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Predictive What-If Academic Scenario Forecaster</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Simulation Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Simulating future trajectory for: <strong className="text-white">{student.name}</strong> ({student.rollNo})
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Baseline status */}
            <div className="p-3 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/10 grid grid-cols-4 gap-2 text-center shadow-md">
            <div>
              <span className="text-slate-400 text-[11px]">Current Attendance</span>
              <div className={`font-black text-sm ${student.overallAttendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {student.overallAttendance}%
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Active Backlogs</span>
              <div className="font-black text-sm text-white">{student.activeBacklogs}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Current CGPA</span>
              <div className="font-black text-sm text-cyan-400">{student.cgpa.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Risk Score</span>
              <div className="font-black text-sm text-rose-400">{student.riskScore}/100</div>
            </div>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-900/40 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Adjust Prospective Intervention Variables
            </h4>

            {/* Extra Attendance Classes Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Attend Consecutive Additional Classes without Absence:</span>
                <span className="text-cyan-400 font-bold">+{extraClasses} Classes</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={extraClasses}
                onChange={e => setExtraClasses(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>+2 classes (minimal effort)</span>
                <span>+30 classes (perfect attendance)</span>
              </div>
            </div>

            {/* Backlog Clearance Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Target Remedial Backlog Subjects to Clear:</span>
                <span className="text-indigo-400 font-bold">{clearedBacklogs} of {student.activeBacklogs} Backlogs</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(1, student.activeBacklogs)}
                value={clearedBacklogs}
                onChange={e => setClearedBacklogs(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Internal Marks Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Target Internal Test Average:</span>
                <span className="text-emerald-400 font-bold">{internalMarksTarget}% Marks</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={internalMarksTarget}
                onChange={e => setInternalMarksTarget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Dedicated Coding Practice Hours Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Dedicated Coding Practice Hours / Week:</span>
                <span className="text-purple-400 font-bold">{byteXlHoursPerWeek} hrs/week</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                value={byteXlHoursPerWeek}
                onChange={e => setByteXlHoursPerWeek(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isSimulating ? 'Simulating Neural Trajectory...' : 'Run Scenario Simulation'}</span>
            </button>
          </div>

          {/* Simulation Output Dashboard */}
          {simulationResult && (
            <div className="p-4 bg-slate-950 border border-emerald-900/60 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Projected Semester-End Forecast
                </span>
                <span className="text-[11px] font-semibold text-slate-300">
                  Risk Reduction: <strong className="text-emerald-400">-{simulationResult.riskDelta} Points</strong>
                </span>
              </div>

              {/* Projected Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Projected Attendance</span>
                  <div className="text-base font-black text-emerald-400 mt-0.5">
                    {simulationResult.projectedAttendance}%
                  </div>
                  <span className="text-[10px] text-emerald-300/80">+{simulationResult.attendanceDelta}% gain</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Remaining Backlogs</span>
                  <div className="text-base font-black text-white mt-0.5">
                    {simulationResult.remainingBacklogs}
                  </div>
                  <span className="text-[10px] text-slate-400">Cleared: {clearedBacklogs}</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Projected CGPA</span>
                  <div className="text-base font-black text-cyan-400 mt-0.5">
                    {simulationResult.projectedCgpa}
                  </div>
                  <span className="text-[10px] text-cyan-300/80">SGPA boost</span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">KPMG Placement</span>
                  <div className={`text-base font-black mt-0.5 ${
                    simulationResult.kpmgEligibility === 'Eligible' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {simulationResult.kpmgEligibility}
                  </div>
                  <span className="text-[10px] text-slate-400">Cutoff compliant</span>
                </div>
              </div>

              {/* AI Advice */}
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-200">
                <strong>Forecasting Engine Prognosis: </strong> {simulationResult.advice}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
