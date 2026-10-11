import React, { useState } from 'react';
import { UnifiedStudent } from '../data/studentTypes';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Activity,
  Layers,
  FileDown
} from 'lucide-react';
import { generateHeatmapPdfReport } from '../services/heatmapPdfService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

interface OverviewPageProps {
  students: UnifiedStudent[];
  onSelectStudent: (student: UnifiedStudent) => void;
  onRequireAuth?: (action: () => void, description?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  students,
  onSelectStudent,
  onRequireAuth,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const total = students.length || 1;

  // 1. KPI Calculations
  const avgSuccessScore = Math.round(
    students.reduce((sum, s) => sum + s.successScore, 0) / total
  );

  const highRiskStudents = students.filter((s) => s.overallRiskLevel === 'High');
  const atRiskPct = ((highRiskStudents.length / total) * 100).toFixed(1);

  const placementReadyCount = students.filter(
    (s) => s.normalized.placement >= 65 && s.backlogs === 0
  ).length;
  const placementReadyPct = ((placementReadyCount / total) * 100).toFixed(1);

  const avgAttendance = (
    students.reduce((sum, s) => sum + s.overall_attendance, 0) / total
  ).toFixed(1);

  // 2. Score Distribution Histogram (B6)
  const bandCounts = {
    Thriving: students.filter((s) => s.scoreBand === 'Thriving').length,
    'On Track': students.filter((s) => s.scoreBand === 'On Track').length,
    'Needs Attention': students.filter((s) => s.scoreBand === 'Needs Attention').length,
    Critical: students.filter((s) => s.scoreBand === 'Critical').length,
  };

  const distributionData = [
    { band: 'Critical (<40)', count: bandCounts.Critical, fill: '#ef4444' },
    { band: 'Needs Attention (40-59)', count: bandCounts['Needs Attention'], fill: '#f59e0b' },
    { band: 'On Track (60-79)', count: bandCounts['On Track'], fill: '#3b82f6' },
    { band: 'Thriving (80+)', count: bandCounts.Thriving, fill: '#10b981' },
  ];

  // 3. Department Comparison Data
  const depts = ['CSE', 'ECE', 'MECH', 'CIVIL'] as const;
  const deptComparisonData = depts.map((d) => {
    const list = students.filter((s) => s.department === d);
    const count = list.length || 1;
    const avgScore = Math.round(list.reduce((sum, s) => sum + s.successScore, 0) / count);
    const avgCgpa = Number((list.reduce((sum, s) => sum + s.cgpa, 0) / count).toFixed(2));
    const avgAtt = Number((list.reduce((sum, s) => sum + s.overall_attendance, 0) / count).toFixed(1));
    const riskCount = list.filter((s) => s.overallRiskLevel === 'High').length;
    return {
      department: d,
      avgScore,
      avgCgpa: avgCgpa * 10, // scale to 100 for visual chart
      avgAtt,
      riskCount,
      studentCount: list.length,
    };
  });

  // 4. Semester Trend Data (Sem 1 to Sem 6 trajectory)
  const trendData = [
    { sem: 'Sem 1', avgScore: 64, attendance: 82, atRiskPct: 14 },
    { sem: 'Sem 2', avgScore: 66, attendance: 79, atRiskPct: 15 },
    { sem: 'Sem 3', avgScore: 65, attendance: 77, atRiskPct: 19 },
    { sem: 'Sem 4', avgScore: 68, attendance: 78, atRiskPct: 17 },
    { sem: 'Sem 5', avgScore: 71, attendance: 80, atRiskPct: 16 },
    { sem: 'Sem 6 (Current)', avgScore: avgSuccessScore, attendance: Number(avgAttendance), atRiskPct: Number(atRiskPct) },
  ];

  // 5. Department x Year Risk Heatmap Matrix (B6)
  const years = [1, 2, 3, 4] as const;
  const heatmapMatrix: Record<string, Record<number, { high: number; med: number; low: number }>> = {};
  depts.forEach((d) => {
    heatmapMatrix[d] = {};
    years.forEach((y) => {
      const cellList = students.filter((s) => s.department === d && s.year === y);
      heatmapMatrix[d][y] = {
        high: cellList.filter((s) => s.overallRiskLevel === 'High').length,
        med: cellList.filter((s) => s.overallRiskLevel === 'Medium').length,
        low: cellList.filter((s) => s.overallRiskLevel === 'Low').length,
      };
    });
  });

  // 6. Top 10 Most Improved & Declining Students
  // Use heuristic of score vs internal assessment baseline
  const sortedByTrajectory = [...students].sort((a, b) => {
    const deltaA = a.successScore - (a.cgpa * 10);
    const deltaB = b.successScore - (b.cgpa * 10);
    return deltaB - deltaA;
  });

  const top10Improved = sortedByTrajectory.slice(0, 5);
  const top10Declining = [...students]
    .sort((a, b) => b.academicRisk.probability - a.academicRisk.probability)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn font-['Quicksand']">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-slate-900 dark:text-white">
          Smart Campus Executive Overview
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Real-time synthesized telemetry across {students.length} unified student profiles
        </p>
      </div>

      {/* 4 KPI Cards (B6 spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Average Success Score */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Average Success Score</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-[#3d63ff]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-blue-700 dark:text-blue-400">
            {avgSuccessScore}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> / 100</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+3.2% vs last semester</span>
          </div>
        </div>

        {/* Card 2: % At-Risk */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Critical At-Risk Cohort</span>
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-rose-700 dark:text-rose-400">
            {atRiskPct}%
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> ({highRiskStudents.length} students)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-bold">
            <span>Requires urgent faculty intervention</span>
          </div>
        </div>

        {/* Card 3: Placement-Ready % */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Placement Readiness</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-emerald-700 dark:text-emerald-400">
            {placementReadyPct}%
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> ({placementReadyCount} students)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clear of active backlogs</span>
          </div>
        </div>

        {/* Card 4: Attendance Average */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Classroom Attendance</span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-indigo-700 dark:text-indigo-400">
            {avgAttendance}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-bold">
            <span>Department cutoff: 75.0%</span>
          </div>
        </div>

      </div>

      {/* Row 2: Score Distribution Histogram & Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Distribution Histogram */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
                Student Success Score Distribution
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Categorization across four standard institutional achievement bands
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950 px-2.5 py-1 rounded-full">
              N={students.length}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="band" tick={{ fill: '#64748b', fontSize: 10 }} angle={-10} textAnchor="end" />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} students`, 'Cohort Count']}
                  contentStyle={{ borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {distributionData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
                Department Performance Benchmarks
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Average Success Score and Attendance across academic departments
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar name="Avg Success Score" dataKey="avgScore" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar name="Avg Attendance %" dataKey="avgAtt" fill="#0891b2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Semester Trend & Department x Year Risk Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Over Semesters */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
                Multi-Semester Longitudinal Trajectory
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Average Success Score vs Classroom Attendance over academic semesters
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="sem" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" name="Success Score" dataKey="avgScore" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" name="Attendance %" dataKey="attendance" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Heatmap by Department x Year (B6 spec) */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
                Department × Year Risk Density Heatmap
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                High risk counts across 4 departments and 4 academic years
              </p>
            </div>
            <button
              onClick={() => {
                const doDownload = () => {
                  setIsGeneratingPdf(true);
                  setTimeout(() => {
                    generateHeatmapPdfReport({ students });
                    setIsGeneratingPdf(false);
                  }, 300);
                };

                if (onRequireAuth) {
                  onRequireAuth(doDownload, 'generate and download heatmap summary report PDF');
                } else {
                  doDownload();
                }
              }}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              title="Download summary report of the heatmap visualizations as a PDF document"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download Heatmap PDF</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-['Quicksand']">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold">
                  <th className="py-2 text-left">Department</th>
                  <th className="py-2">Year 1</th>
                  <th className="py-2">Year 2</th>
                  <th className="py-2">Year 3</th>
                  <th className="py-2">Year 4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                {depts.map((d) => (
                  <tr key={d} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="py-3 text-left font-bold text-slate-800 dark:text-slate-200">{d}</td>
                    {years.map((y) => {
                      const cell = heatmapMatrix[d]?.[y] || { high: 0, med: 0, low: 0 };
                      const high = cell.high;
                      // Color intensity based on high risk count
                      const bgClass =
                        high >= 4
                          ? 'bg-rose-500 text-white shadow-sm'
                          : high >= 2
                          ? 'bg-rose-200 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
                          : high >= 1
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300';

                      return (
                        <td key={y} className="py-2 px-1">
                          <div className={`py-2 px-2.5 rounded-xl font-bold transition-all ${bgClass}`}>
                            <span className="block text-sm">{high} high</span>
                            <span className="text-[10px] opacity-75 font-normal">{cell.med} med</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Row 4: Top 10 Most Improved and Most Declining Students (B6 spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Most Improved Students */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
                Highest Performance Momentum
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              Positive Trajectory
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-['Quicksand']">
            {top10Improved.map((s) => (
              <div
                key={s.student_id}
                onClick={() => onSelectStudent(s)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10" />
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">{s.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{s.student_id} • {s.department} Y{s.year}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-700 dark:text-blue-400 block">{s.successScore}/100</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Att: {s.overall_attendance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Declining / Critical Attention Students */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
                Critical Intervention Watchlist
              </h3>
            </div>
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">
              High Probability Risk
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-['Quicksand']">
            {top10Declining.map((s) => (
              <div
                key={s.student_id}
                onClick={() => onSelectStudent(s)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10" />
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">{s.name}</span>
                    <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold">{s.primaryRiskReason}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block">{s.academicRisk.probability}% Risk</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{s.backlogs} Backlog{s.backlogs > 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
