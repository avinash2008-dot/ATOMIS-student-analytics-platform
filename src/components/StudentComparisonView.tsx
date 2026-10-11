import React, { useState, useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowLeftRight,
  ArrowLeft,
  Award,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Code,
  Activity,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { UnifiedStudent } from '../data/studentTypes';

interface StudentComparisonViewProps {
  students: UnifiedStudent[];
  initialStudentA?: UnifiedStudent;
  initialStudentB?: UnifiedStudent;
  onSelectStudentProfile: (student: UnifiedStudent) => void;
  onBackToDirectory: () => void;
}

export const StudentComparisonView: React.FC<StudentComparisonViewProps> = ({
  students,
  initialStudentA,
  initialStudentB,
  onSelectStudentProfile,
  onBackToDirectory,
}) => {
  // Default selection: pick distinct students if possible
  const [selectedIdA, setSelectedIdA] = useState<string>(() => {
    if (initialStudentA) return initialStudentA.student_id;
    return students[0]?.student_id || '';
  });

  const [selectedIdB, setSelectedIdB] = useState<string>(() => {
    if (initialStudentB && initialStudentB.student_id !== initialStudentA?.student_id) {
      return initialStudentB.student_id;
    }
    // Pick another student with a contrasting score band if available
    const other = students.find((s) => s.student_id !== initialStudentA?.student_id);
    return other?.student_id || students[1]?.student_id || '';
  });

  const [radarLayout, setRadarLayout] = useState<'overlay' | 'split'>('split');
  const [activeCategory, setActiveCategory] = useState<'all' | 'academic' | 'skills' | 'engagement'>('all');

  const studentA = useMemo(() => {
    return students.find((s) => s.student_id === selectedIdA) || students[0];
  }, [students, selectedIdA]);

  const studentB = useMemo(() => {
    return students.find((s) => s.student_id === selectedIdB) || students[1] || students[0];
  }, [students, selectedIdB]);

  // Swap students
  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
  };

  // Quick preset pairings
  const applyPreset = (type: 'contrast' | 'peers' | 'placement') => {
    if (students.length < 2) return;
    if (type === 'contrast') {
      const top = [...students].sort((a, b) => b.successScore - a.successScore)[0];
      const risk = [...students].sort((a, b) => a.successScore - b.successScore)[0];
      if (top && risk) {
        setSelectedIdA(top.student_id);
        setSelectedIdB(risk.student_id);
      }
    } else if (type === 'peers') {
      const first = studentA || students[0];
      const peer = students.find(
        (s) => s.department === first.department && s.student_id !== first.student_id
      ) || students[1];
      if (peer) {
        setSelectedIdA(first.student_id);
        setSelectedIdB(peer.student_id);
      }
    } else if (type === 'placement') {
      const placementReady = students.find((s) => s.segment === 'Placement-ready achievers') || students[0];
      const atRisk = students.find((s) => s.segment === 'High academic, low placement') || students[1];
      if (placementReady && atRisk) {
        setSelectedIdA(placementReady.student_id);
        setSelectedIdB(atRisk.student_id);
      }
    }
  };

  // 8-Axis Radar Chart Dataset covering Academic, Skill, and Engagement metrics
  const radarData = useMemo(() => {
    if (!studentA || !studentB) return [];

    return [
      {
        dimension: 'Academic Index',
        category: 'academic',
        scoreA: Math.round(studentA.normalized?.academic ?? studentA.cgpa * 10),
        scoreB: Math.round(studentB.normalized?.academic ?? studentB.cgpa * 10),
        fullMark: 100,
      },
      {
        dimension: 'CGPA Equiv',
        category: 'academic',
        scoreA: Math.round(Math.min(100, studentA.cgpa * 10)),
        scoreB: Math.round(Math.min(100, studentB.cgpa * 10)),
        fullMark: 100,
      },
      {
        dimension: 'Technical Skills',
        category: 'skills',
        scoreA: Math.round(studentA.technical_skill_score || 0),
        scoreB: Math.round(studentB.technical_skill_score || 0),
        fullMark: 100,
      },
      {
        dimension: 'Coding Mastery',
        category: 'skills',
        scoreA: Math.round(studentA.coding_score || 0),
        scoreB: Math.round(studentB.coding_score || 0),
        fullMark: 100,
      },
      {
        dimension: 'Soft Skills & Apt',
        category: 'skills',
        scoreA: Math.round(((studentA.soft_skill_score || 0) + (studentA.aptitude_score || 0)) / 2),
        scoreB: Math.round(((studentB.soft_skill_score || 0) + (studentB.aptitude_score || 0)) / 2),
        fullMark: 100,
      },
      {
        dimension: 'Attendance %',
        category: 'engagement',
        scoreA: Math.round(studentA.overall_attendance || 0),
        scoreB: Math.round(studentB.overall_attendance || 0),
        fullMark: 100,
      },
      {
        dimension: 'LMS Activity',
        category: 'engagement',
        scoreA: Math.round(studentA.normalized?.lms ?? studentA.assignment_completion_pct),
        scoreB: Math.round(studentB.normalized?.lms ?? studentB.assignment_completion_pct),
        fullMark: 100,
      },
      {
        dimension: 'Co-Curriculars',
        category: 'engagement',
        scoreA: Math.round(Math.min(100, (studentA.events_count + studentA.hackathons_count) * 12)),
        scoreB: Math.round(Math.min(100, (studentB.events_count + studentB.hackathons_count) * 12)),
        fullMark: 100,
      },
    ];
  }, [studentA, studentB]);

  // Dynamic Radar Chart Dataset adapting to selected category (Academic, Skills, Engagement, or All)
  const activeRadarData = useMemo(() => {
    if (!studentA || !studentB) return [];
    if (activeCategory === 'academic') {
      return [
        { dimension: 'CGPA (×10)', scoreA: Math.round(Math.min(100, studentA.cgpa * 10)), scoreB: Math.round(Math.min(100, studentB.cgpa * 10)), fullMark: 100 },
        { dimension: 'Internals (×2)', scoreA: Math.round(studentA.internal_marks * 2), scoreB: Math.round(studentB.internal_marks * 2), fullMark: 100 },
        { dimension: 'Sem Exams', scoreA: Math.round(studentA.exam_marks), scoreB: Math.round(studentB.exam_marks), fullMark: 100 },
        { dimension: 'Clear Rate', scoreA: Math.max(0, 100 - studentA.backlogs * 20), scoreB: Math.max(0, 100 - studentB.backlogs * 20), fullMark: 100 },
        { dimension: 'Academic Index', scoreA: Math.round(studentA.normalized?.academic ?? studentA.cgpa * 10), scoreB: Math.round(studentB.normalized?.academic ?? studentB.cgpa * 10), fullMark: 100 },
      ];
    }
    if (activeCategory === 'skills') {
      return [
        { dimension: 'Technical Score', scoreA: Math.round(studentA.technical_skill_score || 0), scoreB: Math.round(studentB.technical_skill_score || 0), fullMark: 100 },
        { dimension: 'Coding Mastery', scoreA: Math.round(studentA.coding_score || 0), scoreB: Math.round(studentB.coding_score || 0), fullMark: 100 },
        { dimension: 'Aptitude & Logic', scoreA: Math.round(studentA.aptitude_score || 0), scoreB: Math.round(studentB.aptitude_score || 0), fullMark: 100 },
        { dimension: 'Soft Skills', scoreA: Math.round(studentA.soft_skill_score || 0), scoreB: Math.round(studentB.soft_skill_score || 0), fullMark: 100 },
        { dimension: 'Mock Interview', scoreA: Math.round(studentA.mock_interview_score || 0), scoreB: Math.round(studentB.mock_interview_score || 0), fullMark: 100 },
      ];
    }
    if (activeCategory === 'engagement') {
      return [
        { dimension: 'Attendance %', scoreA: Math.round(studentA.overall_attendance || 0), scoreB: Math.round(studentB.overall_attendance || 0), fullMark: 100 },
        { dimension: 'LMS Activity', scoreA: Math.round(studentA.normalized?.lms ?? studentA.assignment_completion_pct), scoreB: Math.round(studentB.normalized?.lms ?? studentB.assignment_completion_pct), fullMark: 100 },
        { dimension: 'Assignments %', scoreA: Math.round(studentA.assignment_completion_pct || 0), scoreB: Math.round(studentB.assignment_completion_pct || 0), fullMark: 100 },
        { dimension: 'Weekly Logins', scoreA: Math.min(100, (studentA.lms_logins_per_week || 0) * 10), scoreB: Math.min(100, (studentB.lms_logins_per_week || 0) * 10), fullMark: 100 },
        { dimension: 'Co-Curriculars', scoreA: Math.min(100, (studentA.events_count + studentA.hackathons_count) * 12), scoreB: Math.min(100, (studentB.events_count + studentB.hackathons_count) * 12), fullMark: 100 },
      ];
    }
    return radarData;
  }, [studentA, studentB, activeCategory, radarData]);

  // Metric Categories Detailed Breakdown
  const academicMetrics = useMemo(() => {
    if (!studentA || !studentB) return [];
    return [
      {
        name: 'Cumulative GPA (CGPA)',
        valA: studentA.cgpa.toFixed(2),
        valB: studentB.cgpa.toFixed(2),
        numA: studentA.cgpa,
        numB: studentB.cgpa,
        format: (v: number) => `${v.toFixed(2)} / 10.0`,
        higherIsBetter: true,
      },
      {
        name: 'Internal Assessment Marks',
        valA: studentA.internal_marks,
        valB: studentB.internal_marks,
        numA: studentA.internal_marks,
        numB: studentB.internal_marks,
        format: (v: number) => `${v} / 50`,
        higherIsBetter: true,
      },
      {
        name: 'Semester Exam Average',
        valA: studentA.exam_marks,
        valB: studentB.exam_marks,
        numA: studentA.exam_marks,
        numB: studentB.exam_marks,
        format: (v: number) => `${v} / 100`,
        higherIsBetter: true,
      },
      {
        name: 'Active Course Backlogs',
        valA: studentA.backlogs,
        valB: studentB.backlogs,
        numA: studentA.backlogs,
        numB: studentB.backlogs,
        format: (v: number) => `${v} backlog${v === 1 ? '' : 's'}`,
        higherIsBetter: false,
      },
    ];
  }, [studentA, studentB]);

  const skillMetrics = useMemo(() => {
    if (!studentA || !studentB) return [];
    return [
      {
        name: 'Technical Skill Rating',
        valA: studentA.technical_skill_score,
        valB: studentB.technical_skill_score,
        numA: studentA.technical_skill_score,
        numB: studentB.technical_skill_score,
        format: (v: number) => `${v} / 100`,
        higherIsBetter: true,
      },
      {
        name: 'Coding & Algorithmic Score',
        valA: studentA.coding_score,
        valB: studentB.coding_score,
        numA: studentA.coding_score,
        numB: studentB.coding_score,
        format: (v: number) => `${v} / 100`,
        higherIsBetter: true,
      },
      {
        name: 'Aptitude & Analytical Score',
        valA: studentA.aptitude_score,
        valB: studentB.aptitude_score,
        numA: studentA.aptitude_score,
        numB: studentB.aptitude_score,
        format: (v: number) => `${v} / 100`,
        higherIsBetter: true,
      },
      {
        name: 'Soft Skills & Communication',
        valA: studentA.soft_skill_score,
        valB: studentB.soft_skill_score,
        numA: studentA.soft_skill_score,
        numB: studentB.soft_skill_score,
        format: (v: number) => `${v} / 100`,
        higherIsBetter: true,
      },
      {
        name: 'Mock Interview Performance',
        valA: studentA.mock_interview_score,
        valB: studentB.mock_interview_score,
        numA: studentA.mock_interview_score,
        numB: studentB.mock_interview_score,
        format: (v: number) => `${v} / 100`,
        higherIsBetter: true,
      },
    ];
  }, [studentA, studentB]);

  const engagementMetrics = useMemo(() => {
    if (!studentA || !studentB) return [];
    return [
      {
        name: 'Overall Attendance',
        valA: studentA.overall_attendance,
        valB: studentB.overall_attendance,
        numA: studentA.overall_attendance,
        numB: studentB.overall_attendance,
        format: (v: number) => `${v}%`,
        higherIsBetter: true,
      },
      {
        name: 'LMS Logins per Week',
        valA: studentA.lms_logins_per_week,
        valB: studentB.lms_logins_per_week,
        numA: studentA.lms_logins_per_week,
        numB: studentB.lms_logins_per_week,
        format: (v: number) => `${v} logins/wk`,
        higherIsBetter: true,
      },
      {
        name: 'Assignment Completion Rate',
        valA: studentA.assignment_completion_pct,
        valB: studentB.assignment_completion_pct,
        numA: studentA.assignment_completion_pct,
        numB: studentB.assignment_completion_pct,
        format: (v: number) => `${v}%`,
        higherIsBetter: true,
      },
      {
        name: 'LMS Content Views',
        valA: studentA.lms_content_views,
        valB: studentB.lms_content_views,
        numA: studentA.lms_content_views,
        numB: studentB.lms_content_views,
        format: (v: number) => `${v} views`,
        higherIsBetter: true,
      },
      {
        name: 'Hackathons & Events Attended',
        valA: studentA.events_count + studentA.hackathons_count,
        valB: studentB.events_count + studentB.hackathons_count,
        numA: studentA.events_count + studentA.hackathons_count,
        numB: studentB.events_count + studentB.hackathons_count,
        format: (v: number) => `${v} activities`,
        higherIsBetter: true,
      },
      {
        name: 'Certifications Completed',
        valA: studentA.certifications_count,
        valB: studentB.certifications_count,
        numA: studentA.certifications_count,
        numB: studentB.certifications_count,
        format: (v: number) => `${v} verified`,
        higherIsBetter: true,
      },
    ];
  }, [studentA, studentB]);

  // Overall score delta
  const scoreDelta = (studentA?.successScore || 0) - (studentB?.successScore || 0);

  return (
    <div className="space-y-6 animate-fadeIn font-['Quicksand'] pb-12">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDirectory}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Return to Student Directory Table"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <div>
            <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Dual Student Profile Comparison</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono font-bold">
                Radar Matrix
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Side-by-side diagnostic benchmark across Academic, Skill, and Engagement competency vectors
            </p>
          </div>
        </div>

        {/* Quick presets & view toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold hidden md:inline">
            Quick Pairs:
          </span>
          <button
            onClick={() => applyPreset('contrast')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Top vs At-Risk
          </button>
          <button
            onClick={() => applyPreset('peers')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Department Peers
          </button>
          <button
            onClick={() => applyPreset('placement')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Placement Contrast
          </button>
        </div>
      </div>

      {/* ========================================================
          STUDENT PICKER CARDS & VS BANNER
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Student A Selector Card */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-blue-50/50 dark:bg-[#0c1626]/80 border-2 border-[#3d63ff]/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3d63ff]" />
              Student Profile A
            </span>
            <button
              onClick={() => studentA && onSelectStudentProfile(studentA)}
              className="text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>360° Diagnostic</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(e.target.value)}
              className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3d63ff] cursor-pointer"
            >
              {students.map((s) => (
                <option key={`a-${s.student_id}`} value={s.student_id} className="bg-[#070b12] text-white">
                  {s.name} ({s.student_id}) • {s.department} Year {s.year} • Score: {s.successScore}
                </option>
              ))}
            </select>
          </div>

          {/* Student A Mini Bio */}
          {studentA && (
            <div className="flex items-center gap-3.5 pt-1">
              <img
                src={studentA.avatar}
                alt={studentA.name}
                className="w-12 h-12 rounded-full border-2 border-[#3d63ff] bg-slate-200 dark:bg-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                  {studentA.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-mono text-[11px]">{studentA.student_id}</span>
                  <span>•</span>
                  <span>{studentA.department} Year {studentA.year} (Sec {studentA.section})</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black font-['Raleway'] text-[#3d63ff]">
                  {studentA.successScore}
                </span>
                <span className="text-[10px] block font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {studentA.scoreBand}
                </span>
              </div>
            </div>
          )}

          {/* Risk & Segment Tags */}
          {studentA && (
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2 text-[11px]">
              <span className={`px-2 py-0.5 rounded-full font-bold ${
                studentA.overallRiskLevel === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                studentA.overallRiskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
              }`}>
                {studentA.overallRiskLevel} Risk
              </span>
              <span className="text-slate-600 dark:text-slate-400 truncate max-w-[220px]" title={studentA.segment}>
                {studentA.segment}
              </span>
            </div>
          )}
        </div>

        {/* Center VS & Swap Action */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center gap-2">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-white dark:bg-[#10233a] border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Swap Student A and Student B positions"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
          <div className="px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-black font-['Raleway'] text-slate-700 dark:text-slate-300">
            VS
          </div>
          <div className="text-[11px] font-bold text-center text-slate-500 dark:text-slate-400">
            {scoreDelta !== 0 ? (
              <span className={scoreDelta > 0 ? 'text-[#3d63ff]' : 'text-emerald-500'}>
                {scoreDelta > 0 ? `A leads by +${scoreDelta} pts` : `B leads by +${Math.abs(scoreDelta)} pts`}
              </span>
            ) : (
              <span>Scores are Tied</span>
            )}
          </div>
        </div>

        {/* Student B Selector Card */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-emerald-50/50 dark:bg-[#0c1626]/80 border-2 border-emerald-500/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Student Profile B
            </span>
            <button
              onClick={() => studentB && onSelectStudentProfile(studentB)}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>360° Diagnostic</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(e.target.value)}
              className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {students.map((s) => (
                <option key={`b-${s.student_id}`} value={s.student_id} className="bg-[#070b12] text-white">
                  {s.name} ({s.student_id}) • {s.department} Year {s.year} • Score: {s.successScore}
                </option>
              ))}
            </select>
          </div>

          {/* Student B Mini Bio */}
          {studentB && (
            <div className="flex items-center gap-3.5 pt-1">
              <img
                src={studentB.avatar}
                alt={studentB.name}
                className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-slate-200 dark:bg-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                  {studentB.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-mono text-[11px]">{studentB.student_id}</span>
                  <span>•</span>
                  <span>{studentB.department} Year {studentB.year} (Sec {studentB.section})</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black font-['Raleway'] text-emerald-600 dark:text-emerald-400">
                  {studentB.successScore}
                </span>
                <span className="text-[10px] block font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {studentB.scoreBand}
                </span>
              </div>
            </div>
          )}

          {/* Risk & Segment Tags */}
          {studentB && (
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2 text-[11px]">
              <span className={`px-2 py-0.5 rounded-full font-bold ${
                studentB.overallRiskLevel === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                studentB.overallRiskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
              }`}>
                {studentB.overallRiskLevel} Risk
              </span>
              <span className="text-slate-600 dark:text-slate-400 truncate max-w-[220px]" title={studentB.segment}>
                {studentB.segment}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================
          RADAR CHART COMPARISON SECTION
         ======================================================== */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h3 className="text-lg font-black font-['Raleway'] text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-[#3d63ff]" />
              <span>Competency Radar Comparison</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Multi-axis radar benchmark displaying normalized competencies across academic, skill, and engagement dimensions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter for Radar */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All 8 Axes
              </button>
              <button
                onClick={() => setActiveCategory('academic')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategory === 'academic'
                    ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Academic
              </button>
              <button
                onClick={() => setActiveCategory('skills')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategory === 'skills'
                    ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveCategory('engagement')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategory === 'engagement'
                    ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Engagement
              </button>
            </div>

            {/* Radar layout switch */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
              <button
                onClick={() => setRadarLayout('split')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  radarLayout === 'split'
                    ? 'bg-white dark:bg-[#3d63ff] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Side-by-Side Dual Radars
              </button>
              <button
                onClick={() => setRadarLayout('overlay')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  radarLayout === 'overlay'
                    ? 'bg-white dark:bg-[#3d63ff] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Unified Overlay
              </button>
            </div>
          </div>
        </div>

        {/* Legend Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#3d63ff] shadow-sm" />
            <span className="text-slate-800 dark:text-slate-200">{studentA?.name} (Student A)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-slate-800 dark:text-slate-200">{studentB?.name} (Student B)</span>
          </div>
        </div>

        {/* Radar Charts Render */}
        {radarLayout === 'overlay' ? (
          /* Unified Superimposed Radar */
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={activeRadarData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={studentA?.name || 'Student A'}
                  dataKey="scoreA"
                  stroke="#3d63ff"
                  fill="#3d63ff"
                  fillOpacity={0.35}
                  strokeWidth={2.5}
                />
                <Radar
                  name={studentB?.name || 'Student B'}
                  dataKey="scoreB"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2.5}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} / 100`, name]}
                  contentStyle={{
                    borderRadius: 12,
                    fontSize: 12,
                    backgroundColor: '#0c1626',
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Side-by-Side Dual Radars */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Student A Radar */}
            <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-white/[0.03] border border-blue-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#3d63ff]">{studentA?.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">Score: {studentA?.successScore}</span>
              </div>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={activeRadarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name={studentA?.name}
                      dataKey="scoreA"
                      stroke="#3d63ff"
                      fill="#3d63ff"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(v: any) => [`${v} / 100`, studentA?.name]}
                      contentStyle={{ borderRadius: 8, fontSize: 11, backgroundColor: '#0c1626', color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Student B Radar */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-white/[0.03] border border-emerald-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">{studentB?.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">Score: {studentB?.successScore}</span>
              </div>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={activeRadarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name={studentB?.name}
                      dataKey="scoreB"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(v: any) => [`${v} / 100`, studentB?.name]}
                      contentStyle={{ borderRadius: 8, fontSize: 11, backgroundColor: '#0c1626', color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          DETAILED METRIC COMPARISON CATEGORIES
         ======================================================== */}
      <div className="space-y-4">
        
        {/* Category filter pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Category Breakdown:
          </span>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Dimensions
            </button>
            <button
              onClick={() => setActiveCategory('academic')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === 'academic'
                  ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setActiveCategory('skills')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === 'skills'
                  ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Skills & Placement
            </button>
            <button
              onClick={() => setActiveCategory('engagement')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === 'engagement'
                  ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Engagement & LMS
            </button>
          </div>
        </div>

        {/* 1. Academic Comparison Section */}
        {(activeCategory === 'all' || activeCategory === 'academic') && (
          <div className="rounded-3xl glass-panel p-5 border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-[#3d63ff]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Academic Performance Comparison
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  CGPA, Internal Continuous Assessments, and University Exam Records
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {academicMetrics.map((m) => {
                const diff = m.numA - m.numB;
                const aWins = m.higherIsBetter ? diff > 0 : diff < 0;
                const bWins = m.higherIsBetter ? diff < 0 : diff > 0;
                const tied = diff === 0;

                return (
                  <div key={m.name} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate" title={m.name}>
                      {m.name}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">A ({studentA?.name?.split(' ')[0]})</span>
                        <strong className="text-sm font-black text-[#3d63ff] font-['Raleway']">
                          {m.format(m.numA)}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">B ({studentB?.name?.split(' ')[0]})</span>
                        <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-['Raleway']">
                          {m.format(m.numB)}
                        </strong>
                      </div>
                    </div>

                    {/* Comparative indicator */}
                    <div className="pt-1.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Advantage:</span>
                      {tied ? (
                        <span className="text-slate-400">Tied</span>
                      ) : aWins ? (
                        <span className="text-[#3d63ff] flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>Student A (+{Math.abs(diff).toFixed(1)})</span>
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>Student B (+{Math.abs(diff).toFixed(1)})</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Skill & Placement Comparison Section */}
        {(activeCategory === 'all' || activeCategory === 'skills') && (
          <div className="rounded-3xl glass-panel p-5 border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Skills & Career Placement Readiness
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Technical acumen, coding proficiency, soft skills, aptitude, and mock interviews
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skillMetrics.map((m) => {
                const diff = m.numA - m.numB;
                const aWins = diff > 0;
                const bWins = diff < 0;
                const tied = diff === 0;

                return (
                  <div key={m.name} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate" title={m.name}>
                      {m.name}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">A ({studentA?.name?.split(' ')[0]})</span>
                        <strong className="text-sm font-black text-[#3d63ff] font-['Raleway']">
                          {m.format(m.numA)}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">B ({studentB?.name?.split(' ')[0]})</span>
                        <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-['Raleway']">
                          {m.format(m.numB)}
                        </strong>
                      </div>
                    </div>

                    {/* Progress comparison bar */}
                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex">
                        <div className="h-full bg-[#3d63ff]" style={{ width: `${m.numA}%` }} />
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: `${m.numB}%` }} />
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Difference:</span>
                      {tied ? (
                        <span className="text-slate-400">Tied</span>
                      ) : aWins ? (
                        <span className="text-[#3d63ff]">Student A (+{diff} pts)</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">Student B (+{Math.abs(diff)} pts)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Engagement & LMS Activity Comparison Section */}
        {(activeCategory === 'all' || activeCategory === 'engagement') && (
          <div className="rounded-3xl glass-panel p-5 border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Engagement & Digital Learning Analytics
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Campus presence attendance, LMS assignments, and hackathon co-curricular activity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {engagementMetrics.map((m) => {
                const diff = m.numA - m.numB;
                const aWins = diff > 0;
                const bWins = diff < 0;
                const tied = diff === 0;

                return (
                  <div key={m.name} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate" title={m.name}>
                      {m.name}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">A ({studentA?.name?.split(' ')[0]})</span>
                        <strong className="text-sm font-black text-[#3d63ff] font-['Raleway']">
                          {m.format(m.numA)}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">B ({studentB?.name?.split(' ')[0]})</span>
                        <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-['Raleway']">
                          {m.format(m.numB)}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Advantage:</span>
                      {tied ? (
                        <span className="text-slate-400">Tied</span>
                      ) : aWins ? (
                        <span className="text-[#3d63ff]">Student A (+{diff})</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">Student B (+{Math.abs(diff)})</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          DIAGNOSTIC VERDICT & RECOMMENDATIONS
         ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-700/60 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#3d63ff]" />
          <h4 className="font-extrabold text-sm tracking-wide">
            Comparative Diagnostic Summary & Interventions
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-['Quicksand']">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[#3d63ff] font-bold block text-sm">
              {studentA?.name} Action Strategy:
            </span>
            <p className="text-slate-300 leading-relaxed text-xs">
              <strong>Recommended Track:</strong> {studentA?.recommendedIntervention}
            </p>
            <p className="text-slate-400 text-[11px]">
              <em>Status:</em> {studentA?.interventionStatus} • <em>Risk Driver:</em> {studentA?.primaryRiskReason}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-emerald-400 font-bold block text-sm">
              {studentB?.name} Action Strategy:
            </span>
            <p className="text-slate-300 leading-relaxed text-xs">
              <strong>Recommended Track:</strong> {studentB?.recommendedIntervention}
            </p>
            <p className="text-slate-400 text-[11px]">
              <em>Status:</em> {studentB?.interventionStatus} • <em>Risk Driver:</em> {studentB?.primaryRiskReason}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
