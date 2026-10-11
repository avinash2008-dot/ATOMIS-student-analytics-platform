import React from 'react';
import {
  UnifiedStudent,
} from '../data/studentTypes';
import {
  X,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  FileText,
  Mail,
  ShieldCheck,
  Award,
  BookOpen
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import { generateWaterfallContributions } from '../lib/explainability';

interface StudentProfileDrawerProps {
  student: UnifiedStudent | null;
  onClose: () => void;
  onUpdateInterventionStatus?: (studentId: string, status: 'Pending' | 'In progress' | 'Done') => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  onClose,
  onUpdateInterventionStatus,
}) => {
  const [touchStartY, setTouchStartY] = React.useState<number | null>(null);

  if (!student) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    // If pulled down by more than 90px from top, dismiss
    if (currentY - touchStartY > 90) {
      onClose();
      setTouchStartY(null);
    }
  };

  const radarData = [
    { subject: 'Academics', score: student.normalized.academic, fullMark: 100 },
    { subject: 'Attendance', score: student.normalized.attendance, fullMark: 100 },
    { subject: 'LMS Activity', score: student.normalized.lms, fullMark: 100 },
    { subject: 'Engagement', score: student.normalized.engagement, fullMark: 100 },
    { subject: 'Placement', score: student.normalized.placement, fullMark: 100 },
    { subject: 'Skills', score: student.normalized.skills, fullMark: 100 },
  ];

  const waterfallData = generateWaterfallContributions(student.breakdown);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dimmed glass backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Sheet Container: Fullscreen bottom sheet on mobile (< sm), slide-in right drawer on tablet/desktop */}
      <div className="absolute inset-x-0 bottom-0 top-10 sm:top-0 sm:left-auto sm:right-0 sm:inset-y-0 sm:max-w-2xl w-full flex">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="w-full bg-white dark:bg-[#0c1626] rounded-t-3xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/10 shadow-2xl p-4 sm:p-8 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 safe-bottom font-['Quicksand']"
        >
          {/* Mobile Drag Indicator Handle */}
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto sm:hidden cursor-grab active:cursor-grabbing mb-2" />

          {/* Header */}
          <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-['Raleway'] text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-none">{student.name}</h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    {student.student_id}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {student.department} • Y{student.year} Sec {student.section}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-target flex items-center justify-center cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Score & Risk Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Success Score</div>
              <div className="text-2xl font-black text-blue-700 dark:text-[#3d63ff] font-['Raleway'] mt-1">
                {student.successScore}<span className="text-sm font-normal text-slate-500 dark:text-slate-400">/100</span>
              </div>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                student.scoreBand === 'Thriving' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                student.scoreBand === 'On Track' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                student.scoreBand === 'Needs Attention' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}>
                {student.scoreBand}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Academic Risk</div>
              <div className="text-2xl font-black font-['Raleway'] mt-1 text-slate-900 dark:text-white">
                {student.academicRisk.probability}%
              </div>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                student.academicRisk.level === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                student.academicRisk.level === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {student.academicRisk.level} Risk
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Placement Risk</div>
              <div className="text-2xl font-black font-['Raleway'] mt-1 text-slate-900 dark:text-white">
                {student.placementRisk.probability}%
              </div>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                student.placementRisk.level === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                student.placementRisk.level === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {student.placementRisk.level} Risk
              </span>
            </div>
          </div>

          {/* Plain-English Explainable Summary Sentence (B4) */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-[#3d63ff]/20 text-xs sm:text-sm font-['Quicksand'] text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3">
            <BrainCircuit className="w-5 h-5 text-blue-700 dark:text-[#3d63ff] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-700 dark:text-[#3d63ff] block mb-0.5">Automated Explainable Diagnostic:</span>
              <p>{student.explainableSentence}</p>
            </div>
          </div>

          {/* Segment & Recommended Intervention */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase">Assigned Segment</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {student.segment}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-['Quicksand']">{student.segmentDescription}</p>
            
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-700 dark:text-[#3d63ff] block">Recommended Action Plan:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{student.recommendedIntervention}</span>
              </div>
              <select
                value={student.interventionStatus}
                onChange={(e) => onUpdateInterventionStatus?.(student.student_id, e.target.value as any)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1626] text-slate-900 dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="In progress">In Progress</option>
                <option value="Done">Resolved / Done</option>
              </select>
            </div>
          </div>

          {/* Radar Chart (360° Indicators) & Explainability Waterfall */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Radar chart */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
                360° Competency Radar
              </h4>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Student" dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Waterfall Contributions vs Cohort Average */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
                Contribution vs Cohort Avg (Points)
              </h4>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} domain={[-10, 10]} />
                    <YAxis type="category" dataKey="label" tick={{ fill: '#475569', fontSize: 9 }} width={80} />
                    <Tooltip
                      formatter={(val: any) => [`${val > 0 ? '+' : ''}${val} pts`, 'Impact on Success Score']}
                      contentStyle={{ borderRadius: 8, fontSize: 12, backgroundColor: '#ffffff', color: '#0f172a' }}
                    />
                    <ReferenceLine x={0} stroke="#94a3b8" />
                    <Bar dataKey="contribution" radius={[4, 4, 4, 4]}>
                      {waterfallData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.isPositive ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Subject-Wise Performance & Attendance Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
              Current Semester Coursework & Lab Performance
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-xs font-['Quicksand']">
                <thead className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Exam Score</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {student.subjects.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{s.marks}/100</td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                        <span className={s.attendance < 75 ? 'text-rose-600 font-bold' : ''}>
                          {s.attendance}%
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.marks >= 60 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                          s.marks >= 45 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                          'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {s.marks >= 60 ? 'Passed' : s.marks >= 45 ? 'Borderline' : 'Remedial'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
