import React, { useState } from 'react';
import { Student } from '../types/student';
import {
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Users,
  Award,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  School,
  Building2,
  CalendarCheck
} from 'lucide-react';

interface UniversityAnalyticsViewProps {
  students: Student[];
}

export const UniversityAnalyticsView: React.FC<UniversityAnalyticsViewProps> = ({ students }) => {
  const [selectedCohortYear, setSelectedCohortYear] = useState('2026');

  // Macro metrics
  const totalEnrolled = 1248;
  const currentRetentionRate = 94.8;
  const projectedGraduationRate = 92.4;
  const dropoutVulnerabilityRate = 2.1;
  const activeInterventionsCount = 28;
  const interventionRecoverySuccess = 86.4;

  const departmentData = [
    {
      name: "Computer Science",
      enrolled: 420,
      avgCgpa: 7.82,
      attendanceRate: 84.5,
      retentionRate: 96.2,
      dropoutRiskCount: 3,
      placementReady: 82
    },
    {
      name: "Information Technology",
      enrolled: 310,
      avgCgpa: 7.41,
      attendanceRate: 81.2,
      retentionRate: 94.8,
      dropoutRiskCount: 5,
      placementReady: 74
    },
    {
      name: "AI & Data Science",
      enrolled: 280,
      avgCgpa: 7.95,
      attendanceRate: 86.8,
      retentionRate: 97.1,
      dropoutRiskCount: 2,
      placementReady: 88
    },
    {
      name: "Electronics & Comm",
      enrolled: 238,
      avgCgpa: 7.15,
      attendanceRate: 77.4,
      retentionRate: 91.5,
      dropoutRiskCount: 8,
      placementReady: 66
    }
  ];

  const cohortData = [
    { cohortYear: "Class of 2024 (Alumni)", startCount: 320, graduated: 304, gradRate: 95.0, status: "Conferred" },
    { cohortYear: "Class of 2025 (Final Year)", startCount: 340, activeCount: 322, gradRate: 94.7, status: "On Track" },
    { cohortYear: "Class of 2026 (Third Year)", startCount: 360, activeCount: 342, gradRate: 95.0, status: "Active Cohort" },
    { cohortYear: "Class of 2027 (Second Year)", startCount: 380, activeCount: 358, gradRate: 94.2, status: "Active Cohort" }
  ];

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* University Admin Header Banner */}
      <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-indigo-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)]">
        <div className="rounded-[22px] backdrop-blur-2xl bg-gradient-to-r from-[#031d14]/90 via-slate-900/80 to-[#031d14]/90 border border-emerald-500/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <School className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                University Executive & Dean Intelligence
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Institutional Retention, Graduation & Cohort Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Longitudinal tracking of academic health, attrition mitigation, department benchmarks, and intervention return on investment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCohortYear}
              onChange={e => setSelectedCohortYear(e.target.value)}
              className="bg-black/50 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
            >
              <option value="2026">Cohort: 2026 Academic Year</option>
              <option value="2025">Cohort: 2025 Academic Year</option>
              <option value="2024">Cohort: 2024 Academic Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Macro University Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Enrollment */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrollment</span>
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalEnrolled.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2% YoY
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Across 4 Engineering Departments</p>
        </div>

        {/* Retention Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Annual Retention Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{currentRetentionRate}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+1.8% vs State Benchmark</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-400" style={{ width: `${currentRetentionRate}%` }} />
          </div>
        </div>

        {/* Graduation Rate Forecast */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Projected Graduation</span>
            <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{projectedGraduationRate}%</span>
            <span className="text-xs text-indigo-300 font-semibold">On-Time 4-Year</span>
          </div>
          <p className="text-[11px] text-slate-400">Backlog recovery programs protecting 92 students</p>
        </div>

        {/* Intervention Recovery Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Intervention Success Rate</span>
            <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-300">{interventionRecoverySuccess}%</span>
            <span className="text-xs text-slate-400">{activeInterventionsCount} active</span>
          </div>
          <p className="text-[11px] text-slate-400">Students recovering attendance past 75% cutoff</p>
        </div>
      </div>

      {/* Department Comparison Table */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Department-Wise Performance & Vulnerability Comparison</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-department comparison of GPA, attendance health, dropout vulnerability, and placement readiness
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 text-slate-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Enrollment</th>
                <th className="py-3 px-4">Mean CGPA</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Retention %</th>
                <th className="py-3 px-4">At-Risk Count</th>
                <th className="py-3 px-4">Placement Fit %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {departmentData.map((dept, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{dept.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{dept.enrolled}</td>
                  <td className="py-3 px-4 font-bold text-emerald-300">{dept.avgCgpa}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${dept.attendanceRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {dept.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">{dept.retentionRate}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      dept.dropoutRiskCount <= 3
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {dept.dropoutRiskCount} Students
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{dept.placementReady}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Longitudinal Analysis Table */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Longitudinal Cohort Progression & Degree Completion Velocity</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cohortData.map((cohort, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">{cohort.cohortYear}</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-bold">
                  {cohort.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Starting Matriculation: <strong className="text-white">{cohort.startCount}</strong> students
              </div>
              <div className="text-xs text-slate-400">
                Retained / Graduated: <strong className="text-emerald-400">{cohort.graduated || cohort.activeCount}</strong> students
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Completion Rate:</span>
                <span className="font-black text-emerald-300">{cohort.gradRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
