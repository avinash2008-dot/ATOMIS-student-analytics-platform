import React, { useState } from 'react';
import { Student } from '../types/student';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  TrendingUp,
  BookOpen,
  CalendarCheck,
  ArrowRight,
  ClipboardList,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Settings,
  PlusCircle,
  Clock,
  UserCheck
} from 'lucide-react';

interface TeacherDashboardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal?: (student: Student) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal
}) => {
  const [selectedClassDepartment, setSelectedClassDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Critical' | 'Moderate' | 'Low' | 'Exemplary'>('All');
  
  // Early Warning Configurable Rules State
  const [showRuleConfig, setShowRuleConfig] = useState(false);
  const [attendanceCutoff, setAttendanceCutoff] = useState(75);
  const [backlogThreshold, setBacklogThreshold] = useState(1);
  const [cgpaWarningThreshold, setCgpaWarningThreshold] = useState(6.5);
  const [assignmentSubmissionMin, setAssignmentSubmissionMin] = useState(70);

  // Filter cohort
  const classStudents = students.filter(s => {
    if (selectedClassDepartment !== 'All' && s.department !== selectedClassDepartment) return false;
    if (filterStatus !== 'All' && s.riskLevel !== filterStatus) return false;
    return true;
  });

  // Calculate dynamic stats based on department
  const totalCount = students.length;
  const onTrackCount = students.filter(s => s.riskLevel === 'Exemplary' || s.riskLevel === 'Low').length;
  const needAttentionCount = students.filter(s => s.riskLevel === 'Moderate').length;
  const atRiskCount = students.filter(s => s.riskLevel === 'Critical').length;

  // Topic difficulty breakdown
  const topicDifficulties = [
    {
      subject: "Data Structures & Algorithms",
      topic: "Dynamic Programming & Graph Traversal",
      failureRate: 34,
      avgScore: 56,
      studentsStruggling: 14,
      difficulty: "High",
      remedialStrategy: "Conduct specialized 2-hour weekend clinic on Memoization & Dijkstra's Algorithm."
    },
    {
      subject: "Mathematics & Discrete Structures",
      topic: "Probability Distributions & Random Variables",
      failureRate: 28,
      avgScore: 61,
      studentsStruggling: 11,
      difficulty: "High",
      remedialStrategy: "Provide formula cheat-sheet and 15 solved practice problems with video solutions."
    },
    {
      subject: "Database Management Systems",
      topic: "BCNF Normalization & Multi-valued Dependency",
      failureRate: 19,
      avgScore: 68,
      studentsStruggling: 8,
      difficulty: "Medium",
      remedialStrategy: "Assign interactive SQL normalization lab with instant automated evaluation."
    },
    {
      subject: "Operating Systems",
      topic: "Process Synchronization & Semaphore Deadlocks",
      failureRate: 22,
      avgScore: 64,
      studentsStruggling: 9,
      difficulty: "Medium",
      remedialStrategy: "Use visual OS simulation tool demonstrating Dining Philosophers problem."
    }
  ];

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Teacher Class Cockpit Hero */}
      <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-indigo-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)]">
        <div className="rounded-[22px] backdrop-blur-2xl bg-gradient-to-r from-[#031d14]/90 via-slate-900/80 to-[#031d14]/90 border border-emerald-500/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                Faculty Academic Command & Early-Warning
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Faculty Class Cockpit: Cohort Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time monitoring across <strong>{totalCount} students</strong>: 
              <span className="text-emerald-400 font-bold ml-1">{onTrackCount} on track</span>, 
              <span className="text-amber-400 font-bold ml-1">{needAttentionCount} need attention</span>, and 
              <span className="text-rose-400 font-bold ml-1">{atRiskCount} at critical risk</span>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowRuleConfig(!showRuleConfig)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configure Early-Warning Rules</span>
            </button>
          </div>
        </div>
      </div>

      {/* Early-Warning Rules Configuration Drawer (Collapsible) */}
      {showRuleConfig && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-extrabold text-white">
                Early-Warning Threshold Rules & ML Sensitivity
              </h4>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Status: Active & Calibrated</span>
          </div>
          <p className="text-xs text-slate-400">
            Define specific trigger criteria for automatic classification into Critical 🔴, At Risk 🟠, Needs Attention 🟡, and On Track 🟢 tiers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Attendance Cutoff:</span>
                <span className="text-emerald-400 font-bold">{attendanceCutoff}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                value={attendanceCutoff}
                onChange={e => setAttendanceCutoff(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Flag if attendance drops below {attendanceCutoff}%</span>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Backlogs Tolerance:</span>
                <span className="text-rose-400 font-bold">{backlogThreshold} Backlog</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={backlogThreshold}
                onChange={e => setBacklogThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Critical alert when active backlogs &gt;= {backlogThreshold}</span>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">CGPA Floor Warning:</span>
                <span className="text-amber-400 font-bold">{cgpaWarningThreshold}</span>
              </div>
              <input
                type="range"
                min="5.5"
                max="7.5"
                step="0.1"
                value={cgpaWarningThreshold}
                onChange={e => setCgpaWarningThreshold(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Warning if CGPA falls under {cgpaWarningThreshold}</span>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Min Assignment Rate:</span>
                <span className="text-cyan-400 font-bold">{assignmentSubmissionMin}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={assignmentSubmissionMin}
                onChange={e => setAssignmentSubmissionMin(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Alert if LMS assignments under {assignmentSubmissionMin}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Early-Warning Tier Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* On Track */}
        <div
          onClick={() => setFilterStatus(filterStatus === 'Exemplary' ? 'All' : 'Exemplary')}
          className={`p-4 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all ${
            filterStatus === 'Exemplary'
              ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900/50 border-white/10 hover:border-emerald-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              🟢 On Track
            </span>
            <span className="text-[11px] text-slate-400">{Math.round((onTrackCount / totalCount) * 100)}%</span>
          </div>
          <div className="text-3xl font-black text-white">{onTrackCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">High consistency & zero backlogs</p>
        </div>

        {/* Needs Attention */}
        <div
          onClick={() => setFilterStatus(filterStatus === 'Moderate' ? 'All' : 'Moderate')}
          className={`p-4 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all ${
            filterStatus === 'Moderate'
              ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900/50 border-white/10 hover:border-amber-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              🟡 Needs Attention
            </span>
            <span className="text-[11px] text-slate-400">{Math.round((needAttentionCount / totalCount) * 100)}%</span>
          </div>
          <div className="text-3xl font-black text-white">{needAttentionCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">1 backlog or declining attendance</p>
        </div>

        {/* At Risk */}
        <div
          onClick={() => setFilterStatus(filterStatus === 'Critical' ? 'All' : 'Critical')}
          className={`p-4 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all ${
            filterStatus === 'Critical'
              ? 'bg-rose-950/70 border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.3)]'
              : 'bg-slate-900/50 border-white/10 hover:border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              🔴 Critical Risk
            </span>
            <span className="text-[11px] text-slate-400">{Math.round((atRiskCount / totalCount) * 100)}%</span>
          </div>
          <div className="text-3xl font-black text-rose-300">{atRiskCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Immediate intervention required</p>
        </div>

        {/* Class Attendance Average */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5" /> Class Attendance
            </span>
            <span className="text-[11px] text-slate-400">Target 75%</span>
          </div>
          <div className="text-3xl font-black text-white">79.4%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">6 students below minimum threshold</p>
        </div>
      </div>

      {/* Topic Difficulty Matrix Section */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Topic-Level Difficulty & Conceptual Bottlenecks</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pinpoints exact subject topics causing student failure and triggers recommended teaching remedies
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Analyzed across all recent class quizzes and midterms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicDifficulties.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    {item.subject}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.topic}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    item.difficulty === 'High'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {item.difficulty} Difficulty
                </span>
              </div>

              {/* Progress Bar of Failure Rate vs Passing */}
              <div>
                <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                  <span>Class Average Score: <strong className="text-white">{item.avgScore}%</strong></span>
                  <span>Failure Rate: <strong className="text-rose-400">{item.failureRate}%</strong> ({item.studentsStruggling} students)</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-400 h-full" style={{ width: `${100 - item.failureRate}%` }} />
                  <div className="bg-rose-500 h-full" style={{ width: `${item.failureRate}%` }} />
                </div>
              </div>

              {/* Recommended Action / Intervention */}
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200/90 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Recommended Remedy:</strong> {item.remedialStrategy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At-Risk Students Drill-Down with Explainable Root Cause */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>At-Risk Students List (With Explainable Root Causes)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instead of just a risk score, review <strong>exactly why</strong> each student is in jeopardy and launch remediation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedClassDepartment}
              onChange={e => setSelectedClassDepartment(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
            </select>
          </div>
        </div>

        {/* List of Students */}
        <div className="space-y-3">
          {classStudents.map(student => (
            <div
              key={student.id}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-white/10 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">{student.name}</h4>
                    <span className="text-[11px] font-mono text-slate-400">({student.rollNo})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.riskLevel === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : student.riskLevel === 'Moderate'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {student.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {student.department} • Year {student.year}, Sem {student.semester} • Mentor: {student.mentor}
                  </div>

                  {/* Explainable Why Diagnosis Box */}
                  <div className="mt-2 text-xs text-rose-200/90 bg-rose-950/30 border border-rose-900/50 rounded-xl px-3 py-1.5 flex items-start gap-2">
                    <span className="font-bold text-rose-400 shrink-0">Root Cause:</span>
                    <span>
                      {student.riskFactors.join(" • ") || "Minor score fluctuations; maintain observation."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Fast Metrics */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                <div className="text-right text-xs">
                  <div className="font-bold text-white">CGPA: {student.cgpa}</div>
                  <div className={`text-[11px] ${student.overallAttendance >= 75 ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                    Attendance: {student.overallAttendance}%
                  </div>
                </div>

                <button
                  onClick={() => onSelectStudent(student)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>360° Diagnostic</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
