import React from 'react';
import { UnifiedStudent, StudentSegment } from '../data/studentTypes';
import { SEGMENT_CATALOG } from '../lib/segmentation';
import {
  Users,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

interface SegmentsPageProps {
  students: UnifiedStudent[];
  onSelectStudent: (student: UnifiedStudent) => void;
}

export const SegmentsPage: React.FC<SegmentsPageProps> = ({
  students,
  onSelectStudent,
}) => {
  const total = students.length || 1;

  const segmentList = Object.keys(SEGMENT_CATALOG) as StudentSegment[];

  // Prepare scatter data: x = normalizedAcademic, y = normalizedPlacement
  const scatterData = students.map((s) => ({
    x: s.normalized.academic,
    y: s.normalized.placement,
    z: 1,
    name: s.name,
    id: s.student_id,
    segment: s.segment,
    dept: s.department,
    score: s.successScore,
    student: s,
  }));

  // Aggregated segment stats
  const segmentStats = segmentList.map((segKey) => {
    const meta = SEGMENT_CATALOG[segKey];
    const matching = students.filter((s) => s.segment === segKey);
    const count = matching.length;
    const pct = ((count / total) * 100).toFixed(1);

    const avgScore = count ? Math.round(matching.reduce((acc, s) => acc + s.successScore, 0) / count) : 0;
    const avgCgpa = count ? (matching.reduce((acc, s) => acc + s.cgpa, 0) / count).toFixed(2) : '0';
    const avgAttendance = count ? Math.round(matching.reduce((acc, s) => acc + s.overall_attendance, 0) / count) : 0;
    const avgCoding = count ? Math.round(matching.reduce((acc, s) => acc + s.coding_score, 0) / count) : 0;

    return {
      meta,
      count,
      pct,
      avgScore,
      avgCgpa,
      avgAttendance,
      avgCoding,
      sampleStudents: matching.slice(0, 3),
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn font-['Quicksand']">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-slate-900 dark:text-white">
          k=5 Multi-Dimensional Student Segmentation
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Behavioral and performance cohort clustering across Academic Mastery vs Corporate Placement Readiness
        </p>
      </div>

      {/* 2D Scatter Plot (Academic vs Placement Readiness - B5) */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
              Academic Performance vs Placement Preparedness (0-100)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Each bubble represents a student coloured by assigned segment cluster
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-bold hidden sm:inline">X-Axis: Academic • Y-Axis: Placement</span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold sm:hidden">Tap any student dot to view 360° profile</span>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="h-60 sm:h-80 w-full min-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                type="number"
                dataKey="x"
                name="Academic Score"
                unit="/100"
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Placement Score"
                unit="/100"
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-white dark:bg-[#0c1626] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl text-xs space-y-1">
                      <strong className="block text-slate-900 dark:text-white font-bold">{data.name} ({data.id})</strong>
                      <span className="text-blue-700 dark:text-blue-400 font-bold block">{data.segment}</span>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px] space-y-0.5">
                        <p>Academic Score: {data.x}/100</p>
                        <p>Placement Score: {data.y}/100</p>
                        <p>Success Score: {data.score}/100</p>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                name="Students"
                data={scatterData}
                onClick={(node: any) => node.student && onSelectStudent(node.student)}
              >
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SEGMENT_CATALOG[entry.segment as StudentSegment]?.chartColor || '#3d63ff'}
                    opacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {segmentList.map((seg) => (
            <div key={seg} className="flex items-center gap-1.5 text-xs font-semibold">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: SEGMENT_CATALOG[seg].chartColor }}
              />
              <span className="text-slate-700 dark:text-slate-300">{seg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Segment Cards Grid with Descriptions and Recommended Interventions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segmentStats.map((item) => (
          <div
            key={item.meta.id}
            className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.meta.badgeColor}`}>
                  {item.meta.title}
                </span>
                <span className="text-xs font-mono font-black text-slate-500 dark:text-slate-400">
                  {item.count} students ({item.pct}%)
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-['Quicksand'] font-medium">
                {item.meta.description}
              </p>
            </div>

            {/* Average indicators for this cluster */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-white/5 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Avg Score</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.avgScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Avg CGPA</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.avgCgpa}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">Avg Coding</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.avgCoding}</span>
              </div>
            </div>

            {/* Recommended Action & Sample student triggers */}
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-[#3d63ff]/20 text-xs">
                <span className="font-bold text-blue-700 dark:text-blue-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Cluster Action Plan:
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold leading-snug">
                  {item.meta.recommendedIntervention}
                </span>
              </div>

              {item.sampleStudents.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Sample Students:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.sampleStudents.map((s) => (
                      <button
                        key={s.student_id}
                        onClick={() => onSelectStudent(s)}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
