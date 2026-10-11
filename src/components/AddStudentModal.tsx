import React, { useState } from 'react';
import { Student, Department, PlacementEligibility } from '../types/student';
import { api } from '../services/api';
import { X, UserPlus, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
  onStudentAdded: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onStudentAdded }) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Computer Science');
  const [year, setYear] = useState<number>(3);
  const [semester, setSemester] = useState<number>(5);
  const [section, setSection] = useState('A');
  const [mentor, setMentor] = useState('Dr. Ramesh Babu');
  const [cgpa, setCgpa] = useState<number>(7.2);
  const [activeBacklogs, setActiveBacklogs] = useState<number>(0);
  const [clearedBacklogs, setClearedBacklogs] = useState<number>(0);
  const [overallAttendance, setOverallAttendance] = useState<number>(82);
  const [recentAbsenceStreak, setRecentAbsenceStreak] = useState<number>(0);
  const [byteXlScore, setByteXlScore] = useState<number>(68);
  const [problemsSolved, setProblemsSolved] = useState<number>(120);
  const [dsaProficiency, setDsaProficiency] = useState<number>(65);
  const [sqlProficiency, setSqlProficiency] = useState<number>(70);
  const [webDevProficiency, setWebDevProficiency] = useState<number>(65);
  const [placementEligibility, setPlacementEligibility] = useState<PlacementEligibility>('Eligible');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live client-side risk projection
  let projectedRisk = 0;
  if (overallAttendance < 60) projectedRisk += 30;
  else if (overallAttendance < 75) projectedRisk += 20;
  else if (overallAttendance < 80) projectedRisk += 10;

  if (activeBacklogs >= 3) projectedRisk += 30;
  else if (activeBacklogs === 2) projectedRisk += 20;
  else if (activeBacklogs === 1) projectedRisk += 10;

  if (cgpa < 6.0) projectedRisk += 20;
  else if (cgpa < 7.0) projectedRisk += 12;

  if (byteXlScore < 40) projectedRisk += 10;
  else if (byteXlScore < 60) projectedRisk += 5;

  projectedRisk = Math.min(100, Math.max(0, projectedRisk));

  let projectedLevel = 'Low';
  if (projectedRisk >= 70) projectedLevel = 'Critical';
  else if (projectedRisk >= 40) projectedLevel = 'Moderate';
  else if (projectedRisk < 20) projectedLevel = 'Exemplary';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) return;
    setIsSubmitting(true);

    try {
      const studentPayload: Partial<Student> = {
        name,
        rollNo,
        email: email || `${rollNo.toLowerCase()}@college.edu.in`,
        department,
        year,
        semester,
        section,
        mentor,
        cgpa,
        activeBacklogs,
        clearedBacklogs,
        overallAttendance,
        recentAbsenceStreak,
        lmsEngagementScore: 75,
        assignmentSubmissionRate: 80,
        avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 500000)}?w=150&auto=format&fit=crop&q=80`,
        codingProfile: {
          byteXlScore,
          problemsSolved,
          githubCommitsThisMonth: 10,
          dsaProficiency,
          sqlProficiency,
          webDevProficiency
        },
        kpmgReadinessScore: Math.round((cgpa * 7) + (byteXlScore * 0.3)),
        placementEligibility,
        academicRecords: [],
        skillBenchmarks: [
          { category: 'Data Structures & Algorithms', score: dsaProficiency, percentile: 60, status: 'Average' },
          { category: 'Database & SQL', score: sqlProficiency, percentile: 70, status: 'Strong' }
        ]
      };

      const res = await api.createStudent(studentPayload);
      if (res.success) {
        onStudentAdded(res.data);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)] w-full max-w-2xl my-auto"
      >
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
                <UserPlus className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">Enroll Student Profile</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Live Projected Risk Indicator */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-semibold">Real-Time Predictive Risk Calculation:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-black text-sm ${
                projectedLevel === 'Critical' ? 'text-rose-400' :
                projectedLevel === 'Moderate' ? 'text-amber-400' :
                'text-emerald-400'
              }`}>
                {projectedRisk}/100 ({projectedLevel})
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Student Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Dev"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Roll / Registration Number *</label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                placeholder="e.g. 22CS155"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Year & Semester</label>
              <div className="flex gap-2">
                <select
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
                <select
                  value={semester}
                  onChange={e => setSemester(Number(e.target.value))}
                  className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value={1}>Sem 1</option>
                  <option value={2}>Sem 2</option>
                  <option value={3}>Sem 3</option>
                  <option value={4}>Sem 4</option>
                  <option value={5}>Sem 5</option>
                  <option value={6}>Sem 6</option>
                  <option value={7}>Sem 7</option>
                  <option value={8}>Sem 8</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Assigned Faculty Mentor</label>
              <input
                type="text"
                value={mentor}
                onChange={e => setMentor(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          {/* Academic & Attendance Metrics */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Academic & Attendance Thresholds
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">CGPA (0 - 10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={e => setCgpa(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  value={activeBacklogs}
                  onChange={e => setActiveBacklogs(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Attendance %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overallAttendance}
                  onChange={e => setOverallAttendance(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Absence Streak (Days)</label>
                <input
                  type="number"
                  min="0"
                  value={recentAbsenceStreak}
                  onChange={e => setRecentAbsenceStreak(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Technical & Placement Track Benchmarks */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
              Technical & Placement Track Benchmarks
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Coding Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={byteXlScore}
                  onChange={e => setByteXlScore(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">DSA Proficiency %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={dsaProficiency}
                  onChange={e => setDsaProficiency(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Problems Solved</label>
                <input
                  type="number"
                  min="0"
                  value={problemsSolved}
                  onChange={e => setProblemsSolved(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Placement Status</label>
                <select
                  value={placementEligibility}
                  onChange={e => setPlacementEligibility(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Eligible">Eligible (Tier-1)</option>
                  <option value="Borderline">Borderline</option>
                  <option value="Ineligible">Ineligible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md cursor-pointer"
            >
              {isSubmitting ? 'Saving Profile...' : 'Save & Calculate Risk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};
