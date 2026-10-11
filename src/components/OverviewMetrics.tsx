import React from 'react';
import {
  Users,
  AlertTriangle,
  CalendarCheck,
  Code2,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Send
} from 'lucide-react';
import { DashboardOverviewData } from '../types/student';
import { TiltCard } from './3d/TiltCard';

interface OverviewMetricsProps {
  overview: DashboardOverviewData;
  onSelectStudent: (studentId: string) => void;
  onOpenSimulatorForStudent?: (studentId: string) => void;
  onOpenAlertForStudent?: (studentId: string) => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  overview,
  onSelectStudent,
  onOpenSimulatorForStudent,
  onOpenAlertForStudent
}) => {
  return (
    <div className="space-y-4">
      {/* 3D Neo-Spatial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Students */}
        <TiltCard glowColor="indigo" className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cohort Size</span>
            <div className="p-2 bg-indigo-950/80 border border-indigo-700/50 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{overview.totalStudents}</div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span>4 Engineering Departments</span>
          </div>
        </TiltCard>

        {/* Critical Risk Students */}
        <TiltCard glowColor="rose" className="bg-slate-900/40 backdrop-blur-2xl border border-rose-500/25 p-4 shadow-[0_0_25px_rgba(244,63,94,0.1)]">
          <div className="flex items-center justify-between text-rose-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Risk Alert</span>
            <div className="p-2 bg-rose-950/90 border border-rose-700/50 rounded-xl text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400 flex items-baseline gap-2 tracking-tight">
            <span>{overview.riskDistribution.critical}</span>
            <span className="text-xs font-normal text-slate-400">
              ({Math.round((overview.riskDistribution.critical / (overview.totalStudents || 1)) * 100)}%)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-rose-300/90 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span>Requires 48hr intervention</span>
          </div>
        </TiltCard>

        {/* Institutional Attendance */}
        <TiltCard glowColor="cyan" className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Attendance</span>
            <div className="p-2 bg-cyan-950/80 border border-cyan-700/50 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {overview.averages.attendance}%
          </div>
          <div className="mt-1 text-[11px] flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] ${overview.averages.attendance >= 75 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-slate-400">75% university rule</span>
          </div>
        </TiltCard>

        {/* Coding Benchmark */}
        <TiltCard glowColor="indigo" className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Coding Score</span>
            <div className="p-2 bg-indigo-950/80 border border-indigo-700/50 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-300 flex items-baseline gap-1 tracking-tight">
            <span>{overview.averages.byteXlScore}</span>
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-400" />
            <span>Coding Proficiency Index</span>
          </div>
        </TiltCard>

        {/* KPMG Placement Ready */}
        <TiltCard glowColor="emerald" className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">KPMG Placement</span>
            <div className="p-2 bg-emerald-950/80 border border-emerald-700/50 rounded-xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-300 tracking-tight">
            {overview.placementStats.eligibilityRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {overview.placementStats.eligible} of {overview.totalStudents} Drive Ready
          </div>
        </TiltCard>
      </div>

      {/* Urgent Early-Warning Ticker */}
      {overview.recentAlerts.length > 0 && (
        <div className="rounded-3xl p-1 bg-gradient-to-r from-rose-500/20 via-white/10 to-indigo-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)]">
          <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/60 border border-rose-500/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300">
                  Early-Warning Diagnostic Triggers (Active Alerts)
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {overview.activeInterventionsCount} active interventions in motion
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {overview.recentAlerts.map(alert => (
                <div
                  key={alert.studentId}
                  className="group bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-xl border border-white/10 hover:border-rose-500/50 rounded-xl p-3.5 transition-all flex flex-col justify-between gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                >
                <div onClick={() => onSelectStudent(alert.studentId)} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {alert.name}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                      {alert.riskScore} Risk
                    </span>
                  </div>
                  <p className="text-xs text-rose-300/90 line-clamp-1 mt-0.5">
                    {alert.primaryFactor}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    <span>Att: <strong className="text-rose-400">{alert.attendance}%</strong></span>
                    <span>•</span>
                    <span>Backlogs: <strong className="text-white">{alert.backlogs}</strong></span>
                    {alert.streak >= 3 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">{alert.streak}d absent</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Action buttons on card */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <button
                    onClick={() => onSelectStudent(alert.studentId)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>AI 360°</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {onOpenSimulatorForStudent && (
                      <button
                        onClick={() => onOpenSimulatorForStudent(alert.studentId)}
                        className="px-2 py-0.8 rounded bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 cursor-pointer"
                        title="Simulate What-If Recovery"
                      >
                        Simulate
                      </button>
                    )}
                    {onOpenAlertForStudent && (
                      <button
                        onClick={() => onOpenAlertForStudent(alert.studentId)}
                        className="px-2 py-0.8 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 cursor-pointer"
                        title="Dispatch WhatsApp Alert"
                      >
                        Alert
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
