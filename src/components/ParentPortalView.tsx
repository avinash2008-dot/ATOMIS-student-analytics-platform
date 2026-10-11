import React, { useState } from 'react';
import { Student } from '../types/student';
import {
  Users,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  Award,
  Lock,
  ChevronRight,
  TrendingUp,
  HeartHandshake,
  Send,
  Eye,
  Info
} from 'lucide-react';

interface ParentPortalViewProps {
  students: Student[];
  onOpenDetailModal: (student: Student) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  onOpenDetailModal
}) => {
  // Currently authenticated parent view for a child
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Contact Mentor State
  const [mentorMessage, setMentorMessage] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Institution Privacy Controls (Mockable toggle)
  const [privacySettings, setPrivacySettings] = useState({
    showGrades: true,
    showAttendance: true,
    showTeacherNotes: true,
    showBehavioralAlerts: true,
    showPlacementEligibility: true
  });

  if (!activeStudent) return null;

  // Derive attendance status
  const isAttendanceAtRisk = activeStudent.overallAttendance < 75;
  const attendanceBufferClasses = Math.max(
    0,
    Math.ceil((0.75 * 60 - (activeStudent.overallAttendance / 100) * 60) / 0.25)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorMessage.trim()) return;
    setIsMessageSent(true);
    setTimeout(() => {
      setMentorMessage('');
      setIsMessageSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Top Banner: Parent / Guardian Authentication & Child Switcher */}
      <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)]">
        <div className="rounded-[22px] backdrop-blur-2xl bg-gradient-to-r from-[#031d14]/90 via-slate-900/80 to-[#031d14]/90 border border-emerald-500/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                Authorized Parent & Guardian Portal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                FERPA / Privacy Compliant
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Parent Dashboard for {activeStudent.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time transparent view of your ward's attendance health, academic progress, upcoming examinations, and faculty mentor counseling feedback.
            </p>
          </div>

          {/* Child Switcher Dropdown */}
          <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-3 shrink-0 flex flex-col gap-1 min-w-[240px]">
            <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Selected Ward / Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} ({s.rollNo}) - {s.department}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400">
              Mentor: <strong>{activeStudent.mentor}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Primary Alert Ribbon (If attendance below 75% or backlogs present) */}
      {isAttendanceAtRisk && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-900/50 border border-amber-600/50 text-amber-300 shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-200">
                Attention Required: Attendance Below 75% Cutoff
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {activeStudent.name}'s current attendance is <strong>{activeStudent.overallAttendance}%</strong> (recent streak: {activeStudent.recentAbsenceStreak} consecutive days missed). University regulations require minimum 75% attendance to appear for semester end examinations. Ward must attend approximately <strong>{attendanceBufferClasses} consecutive lecture sessions</strong> to restore eligibility.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenDetailModal(activeStudent)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all cursor-pointer shadow-md"
          >
            Review Attendance Ledger
          </button>
        </div>
      )}

      {/* Grid: Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Attendance Rate</span>
            <div className={`p-1.5 rounded-lg ${isAttendanceAtRisk ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${isAttendanceAtRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
              {activeStudent.overallAttendance}%
            </span>
            <span className="text-xs text-slate-400">Target: 75%+</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full ${isAttendanceAtRisk ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, activeStudent.overallAttendance)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {isAttendanceAtRisk ? `Approaching cutoff - needs ${attendanceBufferClasses} classes` : 'Healthy attendance record'}
          </p>
        </div>

        {/* CGPA / Academic Standing */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cumulative CGPA</span>
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{activeStudent.cgpa}</span>
            <span className="text-xs text-slate-400">/ 10.0 scale</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Semester: {activeStudent.semester}</span>
            <span className="text-emerald-400 font-semibold">Passing: Yes</span>
          </div>
        </div>

        {/* Coursework Backlogs */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Backlogs</span>
            <div className={`p-1.5 rounded-lg ${activeStudent.activeBacklogs > 0 ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${activeStudent.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeStudent.activeBacklogs}
            </span>
            <span className="text-xs text-slate-400">Active</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Cleared: <strong className="text-slate-200">{activeStudent.clearedBacklogs}</strong> subjects
          </p>
        </div>

        {/* Overall Risk Index */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Standing</span>
            <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${
              activeStudent.riskLevel === 'Critical' ? 'text-rose-400' :
              activeStudent.riskLevel === 'Moderate' ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {activeStudent.riskLevel}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {activeStudent.riskLevel === 'Critical' ? 'Immediate counseling recommended' :
             activeStudent.riskLevel === 'Moderate' ? 'Monitor progress closely' : 'On track for graduation'}
          </p>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Academic Subject Breakdown & Upcoming Assessments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Semester Subjects & Grades */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Semester {activeStudent.semester} Subject Performance & Attendance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live scores and lecture presence reported by faculty members
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/30 text-slate-400 uppercase text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Internal Score</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeStudent.academicRecords[0]?.subjects?.map((sub, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">
                        {sub.name}
                        <span className="block text-[10px] text-slate-500 font-normal">{sub.code}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`font-bold ${sub.attendancePercent >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {sub.attendancePercent}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-200">
                        {sub.marks} / {sub.maxMarks}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded font-black text-[11px] bg-white/5 border border-white/10 text-white">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.status === 'Pass' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          sub.status === 'At Risk' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-500">
                        No subject records found for active semester.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Assessments & Examination Schedule */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Upcoming Assessments & Examination Timetable</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Mid-Term Examination II</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800">
                    In 12 Days
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Covers Modules 3 & 4 of all department core courses.</p>
                <div className="text-[10px] text-slate-500">Weightage: 25% of final semester grade</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Lab Practicum & Code Submission</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
                    In 18 Days
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Software engineering laboratory micro-project evaluation.</p>
                <div className="text-[10px] text-slate-500">Weightage: 15% internal practicals</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">End Semester University Finals</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-800">
                    In 45 Days
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Comprehensive university board examination.</p>
                <div className="text-[10px] text-slate-500">Mandatory Attendance: 75% required</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Backlog Supplementary Exam Window</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                    Summer Term
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Opportunity to clear pending backlog credits before Year 4.</p>
                <div className="text-[10px] text-slate-500">Registration deadline: Next Month</div>
              </div>
            </div>
          </div>

          {/* Recommended Actions for Parents (Actionable Guidance) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 border border-emerald-500/30 backdrop-blur-xl space-y-3">
            <h3 className="text-base font-extrabold text-emerald-200 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <span>Recommended Actions for Parents at Home</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Establish regular attendance check-ins:</strong> Inquire gently about their daily morning lecture arrival and laboratory practical submissions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Encourage peer tutoring:</strong> {activeStudent.name} has been matched with senior department mentors for doubt-clearing sessions every Tuesday and Thursday.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Review upcoming mid-terms together:</strong> Ensure dedicated uninterrupted study time 2 weeks ahead of examinations.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Faculty Mentor Communication & Privacy Controls */}
        <div className="space-y-6">
          {/* Faculty Mentor Notes & Direct Messaging */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold">
                {activeStudent.mentor.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Assigned Faculty Mentor</h4>
                <p className="text-xs text-indigo-300 font-semibold">{activeStudent.mentor}</p>
                <span className="text-[10px] text-slate-400">Department of {activeStudent.department}</span>
              </div>
            </div>

            {/* Mentor Recent Observation */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Latest Mentor Assessment:
              </span>
              <p className="text-slate-300 italic">
                "{activeStudent.name} exhibits sharp conceptual thinking in class discussions but needs to maintain strict attendance discipline. If they remain consistent over the next 4 weeks, their CGPA is projected to rise to 7.8+."
              </p>
              <div className="text-[10px] text-slate-500 text-right">Logged 3 days ago</div>
            </div>

            {/* Send Message to Faculty Mentor */}
            <form onSubmit={handleSendMessage} className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold text-slate-300">
                Send Note to Mentor {activeStudent.mentor}:
              </label>
              <textarea
                value={mentorMessage}
                onChange={e => setMentorMessage(e.target.value)}
                placeholder="Share any home context, health updates, or request a phone counseling call..."
                rows={3}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="submit"
                disabled={!mentorMessage.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Note to Mentor</span>
              </button>
              {isMessageSent && (
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-300 text-[11px] font-semibold text-center border border-emerald-800 animate-fadeIn">
                  Message securely dispatched to {activeStudent.mentor}.
                </div>
              )}
            </form>
          </div>

          {/* Institutional Privacy & Governance Controls */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Institutional Privacy Governance
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In accordance with educational privacy standards, colleges configure access rules for guardian portals. Below is your verified permission tier:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-300">Semester Exam & Internal Grades</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Enabled
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-300">Attendance Log & Absence Streaks</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Enabled
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-300">Faculty Advisory Counseling Notes</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Enabled
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-300">Confidential Peer Tutoring Match Logs</span>
                <span className="text-slate-400 text-[11px]">Student Only</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-[10px] text-emerald-300/80 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Identity verified via two-factor mobile authentication</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
