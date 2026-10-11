import React from 'react';
import { DashboardOverviewData } from '../types/student';
import { Layers, ShieldCheck, AlertOctagon, TrendingDown, CheckCircle2 } from 'lucide-react';

interface RiskHeatmapProps {
  overview: DashboardOverviewData;
  onFilterDepartment?: (dept: string) => void;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ overview, onFilterDepartment }) => {
  const { totalStudents, riskDistribution, departmentStats } = overview;

  const criticalPct = Math.round((riskDistribution.critical / (totalStudents || 1)) * 100);
  const moderatePct = Math.round((riskDistribution.moderate / (totalStudents || 1)) * 100);
  const lowPct = Math.round((riskDistribution.low / (totalStudents || 1)) * 100);
  const exemplaryPct = Math.round((riskDistribution.exemplary / (totalStudents || 1)) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Risk Distribution Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Institutional Risk Stratification</h3>
          </div>
          <span className="text-xs text-slate-400">Total: {totalStudents}</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3.5 w-full bg-slate-800 rounded-full flex overflow-hidden mb-4 border border-slate-700/60">
          <div style={{ width: `${criticalPct}%` }} className="bg-rose-500 transition-all" title={`Critical: ${riskDistribution.critical}`} />
          <div style={{ width: `${moderatePct}%` }} className="bg-amber-500 transition-all" title={`Moderate: ${riskDistribution.moderate}`} />
          <div style={{ width: `${lowPct}%` }} className="bg-cyan-500 transition-all" title={`Low: ${riskDistribution.low}`} />
          <div style={{ width: `${exemplaryPct}%` }} className="bg-emerald-500 transition-all" title={`Exemplary: ${riskDistribution.exemplary}`} />
        </div>

        {/* Legend / Stats */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-rose-950/30 border border-rose-900/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300 font-medium">Critical Risk (&gt;70)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <span>{riskDistribution.critical} students</span>
              <span className="text-slate-500">({criticalPct}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300 font-medium">Moderate Risk (40-70)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <span>{riskDistribution.moderate} students</span>
              <span className="text-slate-500">({moderatePct}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-950/20 border border-cyan-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300 font-medium">Low Risk (20-40)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <span>{riskDistribution.low} students</span>
              <span className="text-slate-500">({lowPct}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-medium">Exemplary Tier (&lt;20)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span>{riskDistribution.exemplary} students</span>
              <span className="text-slate-500">({exemplaryPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Comparative Analytics */}
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Department Cohort Benchmarking</h3>
          </div>
          <span className="text-xs text-slate-400">Technical Performance Track</span>
        </div>

        <div className="space-y-3">
          {departmentStats.map(dept => {
            return (
              <div
                key={dept.name}
                onClick={() => onFilterDepartment && onFilterDepartment(dept.name)}
                className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {dept.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {dept.totalStudents} students
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-300">
                      Avg CGPA: <strong className="text-white">{dept.avgCgpa}</strong>
                    </span>
                    <span className="text-slate-300">
                      Attendance: <strong className={dept.avgAttendance >= 75 ? 'text-emerald-400' : 'text-amber-400'}>
                        {dept.avgAttendance}%
                      </strong>
                    </span>
                    <span className="text-slate-300">
                      Coding: <strong className="text-indigo-400">{dept.avgByteXl}</strong>
                    </span>
                    {dept.criticalCount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold border border-rose-800 text-[11px]">
                        {dept.criticalCount} At-Risk
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 text-[11px]">
                        Stable
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Attendance Health</span>
                      <span className="font-semibold text-white">{dept.avgAttendance}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${dept.avgAttendance >= 75 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                        style={{ width: `${Math.min(100, dept.avgAttendance)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Technical Coding Index</span>
                      <span className="font-semibold text-indigo-300">{dept.avgByteXl}/100</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${dept.avgByteXl}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Risk Vulnerability</span>
                      <span className={`font-semibold ${dept.riskPercentage > 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {dept.riskPercentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${dept.riskPercentage > 25 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                        style={{ width: `${dept.riskPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
