import React, { useState, useMemo } from 'react';
import { UnifiedStudent } from '../data/studentTypes';
import {
  TrendingUp,
  FileDown,
  Layers,
  AlertTriangle,
  Award,
  Users,
  CheckCircle2,
  CalendarCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { generateHeatmapPdfReport } from '../services/heatmapPdfService';

interface TrendsPageProps {
  students: UnifiedStudent[];
  onSelectStudent: (student: UnifiedStudent) => void;
  selectedDepartment?: string;
  selectedYear?: string;
  onRequireAuth?: (action: () => void, description?: string) => void;
}

export const TrendsPage: React.FC<TrendsPageProps> = ({
  students,
  onSelectStudent,
  selectedDepartment = 'All',
  selectedYear = 'All',
  onRequireAuth,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [heatmapMetric, setHeatmapMetric] = useState<'risk' | 'score' | 'attendance'>('risk');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedCell, setSelectedCell] = useState<{ dept: string; year: number } | null>(null);

  // Filter students based on selected semester if specified
  const filteredStudents = useMemo(() => {
    if (selectedSemester === 'All') return students;
    // Map academic term to corresponding student year / semester cohorts
    switch (selectedSemester) {
      case 'Term 1 (Fall 2025)':
        return students.filter((s) => s.year === 1 || s.year === 3);
      case 'Term 2 (Spring 2026)':
        return students.filter((s) => s.year === 2 || s.year === 4);
      case 'Term 3 (Summer Accelerated)':
        return students.filter((s) => s.backlogs > 0 || s.overallRiskLevel !== 'Low');
      case 'Term 4 (Fall 2026 Predictive)':
        return students.filter((s) => s.successScore >= 60);
      default:
        return students;
    }
  }, [students, selectedSemester]);

  const total = filteredStudents.length || 1;
  const avgSuccessScore = Math.round(
    filteredStudents.reduce((sum, s) => sum + s.successScore, 0) / total
  );
  const highRiskStudents = filteredStudents.filter((s) => s.overallRiskLevel === 'High');
  const atRiskPct = ((highRiskStudents.length / total) * 100).toFixed(1);
  const avgAttendance = (
    filteredStudents.reduce((sum, s) => sum + s.overall_attendance, 0) / total
  ).toFixed(1);
  const placementReadyCount = filteredStudents.filter(
    (s) => s.normalized.placement >= 65 && s.backlogs === 0
  ).length;
  const placementReadyPct = ((placementReadyCount / total) * 100).toFixed(1);

  const depts = ['CSE', 'ECE', 'MECH', 'CIVIL'] as const;
  const years = [1, 2, 3, 4] as const;

  // Department x Year Heatmap Matrix
  const heatmapMatrix = useMemo(() => {
    const matrix: Record<string, Record<number, {
      high: number;
      med: number;
      low: number;
      total: number;
      avgScore: number;
      avgAtt: number;
      students: UnifiedStudent[];
    }>> = {};

    depts.forEach((d) => {
      matrix[d] = {};
      years.forEach((y) => {
        const cellList = filteredStudents.filter((s) => s.department === d && s.year === y);
        const count = cellList.length || 1;
        const avgScore = Math.round(cellList.reduce((acc, s) => acc + s.successScore, 0) / count);
        const avgAtt = Number((cellList.reduce((acc, s) => acc + s.overall_attendance, 0) / count).toFixed(1));

        matrix[d][y] = {
          high: cellList.filter((s) => s.overallRiskLevel === 'High').length,
          med: cellList.filter((s) => s.overallRiskLevel === 'Medium').length,
          low: cellList.filter((s) => s.overallRiskLevel === 'Low').length,
          total: cellList.length,
          avgScore,
          avgAtt,
          students: cellList,
        };
      });
    });

    return matrix;
  }, [filteredStudents]);

  // Longitudinal Semester Trend Data
  const trendData = useMemo(() => [
    { sem: 'Sem 1', avgScore: 64, attendance: 82, atRiskPct: 14 },
    { sem: 'Sem 2', avgScore: 66, attendance: 79, atRiskPct: 15 },
    { sem: 'Sem 3', avgScore: 65, attendance: 77, atRiskPct: 19 },
    { sem: 'Sem 4', avgScore: 68, attendance: 78, atRiskPct: 17 },
    { sem: 'Sem 5', avgScore: 71, attendance: 80, atRiskPct: 16 },
    { sem: 'Sem 6 (Current)', avgScore: avgSuccessScore, attendance: Number(avgAttendance), atRiskPct: Number(atRiskPct) },
  ], [avgSuccessScore, avgAttendance, atRiskPct]);

  // Correlation Matrix Grid
  const correlationMatrix = [
    { metric: 'Attendance', cgpa: 0.72, backlogs: -0.68, lms: 0.58, placement: 0.44 },
    { metric: 'LMS Activity', cgpa: 0.65, backlogs: -0.54, lms: 1.00, placement: 0.61 },
    { metric: 'Active Backlogs', cgpa: -0.81, backlogs: 1.00, lms: -0.54, placement: -0.73 },
    { metric: 'Engagement & Hackathons', cgpa: 0.48, backlogs: -0.38, lms: 0.62, placement: 0.79 },
    { metric: 'Coding Proficiency', cgpa: 0.55, backlogs: -0.49, lms: 0.68, placement: 0.88 },
  ];

  // PDF Download Handler
  const handleDownloadPdf = () => {
    const doDownload = () => {
      try {
        setIsGeneratingPdf(true);
        setTimeout(() => {
          generateHeatmapPdfReport({
            students,
            selectedDepartment,
            selectedYear,
          });
          setIsGeneratingPdf(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 4500);
        }, 350);
      } catch (err) {
        console.error('Failed to generate PDF report:', err);
        setIsGeneratingPdf(false);
      }
    };

    if (onRequireAuth) {
      onRequireAuth(doDownload, 'generate and download heatmap summary report PDF');
    } else {
      doDownload();
    }
  };

  const activeCellData = selectedCell ? heatmapMatrix[selectedCell.dept]?.[selectedCell.year] : null;

  return (
    <div className="space-y-8 animate-fadeIn font-['Quicksand']">
      
      {/* Page Header with Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 border border-blue-500/20 backdrop-blur-xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Longitudinal Analytics & Hotspot Detection
            </span>
          </div>
          <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-white">
            Trends & Heatmap Visualizations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-semester trajectory analytics, department risk density matrices, and cross-source telemetry correlation heatmaps.
          </p>
        </div>

        {/* Action Button: Download Summary Report PDF */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              downloadSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 border border-white/20'
            }`}
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Generating PDF Report...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>PDF Report Downloaded!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-white" />
                <span>Download Heatmap Summary Report (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Banner when downloaded */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Official Heatmap & Trend Summary PDF has been generated and saved to your device.</span>
          </div>
          <span className="font-mono text-[11px] opacity-75">A4 Document • 2 Pages</span>
        </div>
      )}

      {/* 4 Summary Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Avg Cohort Score</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-[#3d63ff]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-blue-700 dark:text-blue-400">
            {avgSuccessScore}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> / 100</span>
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+3.2% vs baseline</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>High Risk Cluster</span>
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-rose-700 dark:text-rose-400">
            {atRiskPct}%
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> ({highRiskStudents.length} students)</span>
          </div>
          <div className="text-xs text-rose-700 dark:text-rose-400 font-bold">
            <span>Concentrated in Year 2 & 3</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Campus Attendance</span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-indigo-700 dark:text-indigo-400">
            {avgAttendance}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-bold">
            <span>Rule compliance: 75.0%</span>
          </div>
        </div>

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
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            <span>Zero active backlog rate</span>
          </div>
        </div>
      </div>

      {/* Row 1: Department x Year Risk Heatmap & Detailed Cell Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department x Year Risk Density Heatmap */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
                  Department × Academic Year Risk Density Heatmap
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Click any cell in the heatmap matrix to inspect cohort composition and drill down into individual profiles.
              </p>
            </div>

            {/* Metric Switcher for the Heatmap */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
              <button
                onClick={() => setHeatmapMetric('risk')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  heatmapMetric === 'risk'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                Risk Intensity
              </button>
              <button
                onClick={() => setHeatmapMetric('score')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  heatmapMetric === 'score'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                Avg Score
              </button>
              <button
                onClick={() => setHeatmapMetric('attendance')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  heatmapMetric === 'attendance'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                Attendance %
              </button>
            </div>
          </div>

            {/* Semester-based Academic Term Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold shrink-0">
              <CalendarCheck className="w-4 h-4 text-cyan-500" />
              <span>Academic Term:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-white/10 text-xs">
              {[
                { id: 'All', label: 'All Semesters' },
                { id: 'Term 1 (Fall 2025)', label: 'Fall 2025 (Sem 1 & 5)' },
                { id: 'Term 2 (Spring 2026)', label: 'Spring 2026 (Sem 2 & 6)' },
                { id: 'Term 3 (Summer Accelerated)', label: 'Remedial / Summer' },
                { id: 'Term 4 (Fall 2026 Predictive)', label: 'Fall 2026 Predictive' },
              ].map((term) => (
                <button
                  key={term.id}
                  onClick={() => {
                    setSelectedSemester(term.id);
                    setSelectedCell(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                    selectedSemester === term.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {term.label}
                </button>
              ))}
            </div>
          </div>

          {/* The Heatmap Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-['Quicksand']">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold">
                  <th className="py-2.5 px-3 text-left">Department</th>
                  <th className="py-2.5 px-3">Year 1</th>
                  <th className="py-2.5 px-3">Year 2</th>
                  <th className="py-2.5 px-3">Year 3</th>
                  <th className="py-2.5 px-3">Year 4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                {depts.map((d) => (
                  <tr key={d} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-left font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>{d}</span>
                      </div>
                    </td>
                    {years.map((y) => {
                      const cell = heatmapMatrix[d]?.[y] || {
                        high: 0,
                        med: 0,
                        low: 0,
                        total: 0,
                        avgScore: 0,
                        avgAtt: 0,
                        students: [],
                      };
                      const isSelected = selectedCell?.dept === d && selectedCell?.year === y;

                      let bgClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500/20';
                      let mainText = `${cell.high} high`;
                      let subText = `${cell.med} med | ${cell.low} low`;

                      if (heatmapMetric === 'risk') {
                        if (cell.high >= 4) {
                          bgClass = 'bg-rose-500 text-white shadow-sm border-rose-400';
                        } else if (cell.high >= 2) {
                          bgClass = 'bg-rose-200 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-500/30';
                        } else if (cell.high >= 1) {
                          bgClass = 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border-amber-500/30';
                        }
                      } else if (heatmapMetric === 'score') {
                        mainText = `${cell.avgScore}/100`;
                        subText = `${cell.total} students`;
                        if (cell.avgScore < 55) {
                          bgClass = 'bg-rose-500 text-white shadow-sm border-rose-400';
                        } else if (cell.avgScore < 65) {
                          bgClass = 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border-amber-500/30';
                        } else {
                          bgClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500/20';
                        }
                      } else {
                        mainText = `${cell.avgAtt}%`;
                        subText = `${cell.total} students`;
                        if (cell.avgAtt < 75) {
                          bgClass = 'bg-rose-500 text-white shadow-sm border-rose-400';
                        } else if (cell.avgAtt < 80) {
                          bgClass = 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border-amber-500/30';
                        } else {
                          bgClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500/20';
                        }
                      }

                      return (
                        <td key={y} className="py-2 px-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCell(isSelected ? null : { dept: d, year: y })}
                            className={`w-full py-2.5 px-3 rounded-2xl font-bold transition-all border cursor-pointer hover:scale-[1.03] active:scale-95 ${bgClass} ${
                              isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 shadow-md' : ''
                            }`}
                          >
                            <span className="block text-sm leading-tight">{mainText}</span>
                            <span className="text-[10px] opacity-80 font-normal">{subText}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px]">
              <span className="font-bold">Risk Intensity Legend:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (0 High)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate (1-2 High)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical Hotspot (3+ High)
              </span>
            </div>

            <button
              onClick={handleDownloadPdf}
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download as PDF</span>
            </button>
          </div>
        </div>

        {/* Selected Cell Inspection Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
              {selectedCell ? `${selectedCell.dept} • Year ${selectedCell.year} Cohort` : 'Heatmap Cell Inspector'}
            </h4>
            {selectedCell && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800">
                {activeCellData?.total} enrolled
              </span>
            )}
          </div>

          {selectedCell && activeCellData ? (
            <div className="space-y-4 text-xs font-['Quicksand']">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-center">
                  <span className="text-[10px] text-rose-300 block font-bold">High Risk</span>
                  <span className="text-lg font-black text-rose-400">{activeCellData.high}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-center">
                  <span className="text-[10px] text-amber-300 block font-bold">Med Risk</span>
                  <span className="text-lg font-black text-amber-400">{activeCellData.med}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-emerald-300 block font-bold">Low Risk</span>
                  <span className="text-lg font-black text-emerald-400">{activeCellData.low}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Average Success Score:</span>
                  <span className="font-bold text-blue-400">{activeCellData.avgScore} / 100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Average Attendance:</span>
                  <span className="font-bold text-emerald-400">{activeCellData.avgAtt}%</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 text-[11px] block mb-2">Student Profiles in this Cell:</span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {activeCellData.students.map((st) => (
                    <div
                      key={st.student_id}
                      onClick={() => onSelectStudent(st)}
                      className="p-2 rounded-xl bg-slate-800/40 hover:bg-blue-600/20 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={st.avatar} alt={st.name} className="w-5 h-5 rounded-full" />
                        <div>
                          <span className="font-bold text-white block text-[11px]">{st.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{st.student_id}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        st.overallRiskLevel === 'High'
                          ? 'bg-rose-950 text-rose-400'
                          : st.overallRiskLevel === 'Medium'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {st.overallRiskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 px-4 text-center text-slate-500 text-xs space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-600" />
              <p>Select any cell on the heatmap to view its individual students and fine-grained metrics.</p>
            </div>
          )}
        </div>

      </div>

      {/* Row 2: Multi-Semester Longitudinal Trajectory Trend Chart & Correlation Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Longitudinal Trajectory Line Chart */}
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

        {/* Telemetry Correlation Matrix Heatmap */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-4">
          <div>
            <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
              Cross-Domain Telemetry Correlation Matrix Heatmap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pearson statistical dependencies (r) showing how telemetry inputs correlate with academic milestones
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-['Quicksand']">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold">
                  <th className="py-2.5 text-left">Metric Feature</th>
                  <th className="py-2.5">CGPA</th>
                  <th className="py-2.5">Backlogs</th>
                  <th className="py-2.5">LMS</th>
                  <th className="py-2.5">Placement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                {correlationMatrix.map((row) => (
                  <tr key={row.metric} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                    <td className="py-2.5 text-left font-bold text-slate-800 dark:text-slate-200">{row.metric}</td>
                    {[row.cgpa, row.backlogs, row.lms, row.placement].map((val, idx) => {
                      let bgClass = 'bg-slate-800 text-slate-300';
                      if (val >= 0.7) bgClass = 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold';
                      else if (val >= 0.4) bgClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold';
                      else if (val <= -0.6) bgClass = 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold';
                      else if (val <= -0.3) bgClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold';

                      return (
                        <td key={idx} className="py-1 px-1">
                          <div className={`py-1.5 px-2 rounded-xl text-xs ${bgClass}`}>
                            {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
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

    </div>
  );
};
