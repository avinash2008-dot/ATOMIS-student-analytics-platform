import React, { useState } from 'react';
import { Student, StudentGoal, PersonalizedLearningItem } from '../types/student';
import { api } from '../services/api';
import {
  GraduationCap,
  CalendarCheck,
  AlertTriangle,
  Code2,
  Sparkles,
  Send,
  CheckCircle2,
  BookOpen,
  Briefcase,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  Plus,
  PlayCircle,
  FileText,
  Lightbulb,
  Award,
  Video,
  ListTodo,
  Compass,
  Check,
  User,
  ExternalLink
} from 'lucide-react';

interface StudentPortalViewProps {
  students: Student[];
  onOpenDetailModal: (student: Student) => void;
  onOpenAiModal?: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  onOpenDetailModal,
  onOpenAiModal
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const [activeSection, setActiveSection] = useState<'360' | 'analytics' | 'goals' | 'learning' | 'copilot'>('360');

  // Goals State (Interactive)
  const [goals, setGoals] = useState<StudentGoal[]>([
    {
      id: 'g-1',
      studentId: activeStudent?.id || '',
      title: "Raise Mathematics & Discrete Structures to 80%",
      category: 'Academic',
      currentValue: "64%",
      targetValue: "80%",
      deadline: "End of Term",
      progressPercentage: 62,
      status: 'In Progress',
      milestones: [
        { task: "Complete Algebra & Probability Module 3 exercises", completed: true },
        { task: "Take 10-question diagnostic quiz", completed: true },
        { task: "Attend Thursday mathematics faculty clinic", completed: false },
        { task: "Solve 5 previous year university exam papers", completed: false }
      ]
    },
    {
      id: 'g-2',
      studentId: activeStudent?.id || '',
      title: "Clear Algorithms Backlog with Grade B+",
      category: 'Academic',
      currentValue: "0/1 Cleared",
      targetValue: "1 Cleared",
      deadline: "Mid-Semester",
      progressPercentage: 45,
      status: 'In Progress',
      milestones: [
        { task: "Review Graph Traversal & Dynamic Programming slides", completed: true },
        { task: "Solve 20 practice algorithm problems", completed: false },
        { task: "Submit supplementary exam application", completed: true }
      ]
    },
    {
      id: 'g-3',
      studentId: activeStudent?.id || '',
      title: "Boost Coding Benchmark Score to 85+",
      category: 'Skill',
      currentValue: `${activeStudent?.codingProfile?.byteXlScore || 65}`,
      targetValue: "85",
      deadline: "Before Campus Placement",
      progressPercentage: 70,
      status: 'In Progress',
      milestones: [
        { task: "Solve 50 LeetCode Easy & Medium DSA problems", completed: true },
        { task: "Build full-stack portfolio capstone project", completed: false },
        { task: "Pass SQL indexing and query optimization mock assessment", completed: true }
      ]
    }
  ]);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Personalized Learning recommendations
  const learningItems: PersonalizedLearningItem[] = [
    {
      id: 'l-1',
      title: "Algebra & Discrete Mathematics: Probability Foundations",
      type: 'Video',
      provider: "University NPTEL Vault",
      duration: "45 mins",
      difficulty: 'Intermediate',
      subjectArea: "Mathematics",
      relevanceReason: "Targeted to boost your weakest exam topic (Probability Distributions)",
      actionUrl: "#"
    },
    {
      id: 'l-2',
      title: "Dynamic Programming: 10 Essential Patterns Masterclass",
      type: 'Course',
      provider: "Engineering Code Lab",
      duration: "2.5 hours",
      difficulty: 'Intermediate',
      subjectArea: "Computer Science",
      relevanceReason: "Directly prepares you for campus recruitment coding assessments",
      actionUrl: "#"
    },
    {
      id: 'l-3',
      title: "10-Question Diagnostic Quiz: Database Normalization",
      type: 'Quiz',
      provider: "Faculty Coursework",
      duration: "15 mins",
      difficulty: 'Beginner',
      subjectArea: "Database Systems",
      relevanceReason: "Tests your mastery of BCNF before the mid-term examination",
      actionUrl: "#"
    },
    {
      id: 'l-4',
      title: "Peer Mentorship Clinic: 1-on-1 Algorithms Review",
      type: 'Mentor',
      provider: "Department Senior Cohort",
      duration: "1 hour / week",
      difficulty: 'Intermediate',
      subjectArea: "Data Structures",
      relevanceReason: "Free tutoring session assigned with top-ranked department peer",
      actionUrl: "#"
    }
  ];

  // Copilot Chat inside student view
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${activeStudent?.name}! I'm your AI Student Success Copilot. With your current CGPA of ${activeStudent?.cgpa}, attendance of ${activeStudent?.overallAttendance}%, and ${activeStudent?.activeBacklogs} backlogs, I can help you formulate study schedules, clear doubts, or prepare for placements. What's on your mind?`,
      time: 'Just now'
    }
  ]);
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  const handleSelectStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const stu = students.find(s => s.id === id);
    if (stu) {
      setChatMessages([
        {
          sender: 'ai',
          text: `Welcome ${stu.name}! I've loaded your transcript (${stu.cgpa} CGPA, ${stu.overallAttendance}% attendance). Ask me anything about improving your grades, clearing backlogs, or planning your semester!`,
          time: 'Just now'
        }
      ]);
    }
  };

  const handleSendCopilotMessage = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const userText = (customQuestion || chatInput).trim();
    if (!userText || !activeStudent) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setIsCopilotTyping(true);

    try {
      const res = await api.askStudentCopilot(activeStudent.id, userText);
      if (res.success) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: res.data.reply, time: 'Just now' }]);
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on your live record (${activeStudent.cgpa} CGPA, ${activeStudent.overallAttendance}% attendance): Prioritize keeping your attendance above 75% by attending upcoming lectures, and dedicate 30 minutes every evening to practice 2 DSA problems. You are making positive progress!`,
          time: 'Just now'
        }
      ]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  const handleToggleMilestone = (goalId: string, milestoneIndex: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updatedMilestones = [...g.milestones];
      updatedMilestones[milestoneIndex].completed = !updatedMilestones[milestoneIndex].completed;
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const newPercentage = Math.round((completedCount / updatedMilestones.length) * 100);
      return {
        ...g,
        milestones: updatedMilestones,
        progressPercentage: newPercentage,
        status: newPercentage === 100 ? 'Achieved' : 'In Progress'
      };
    }));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const newG: StudentGoal = {
      id: `g-${Date.now()}`,
      studentId: activeStudent?.id || '',
      title: newGoalTitle.trim(),
      category: 'Academic',
      currentValue: "Starting",
      targetValue: "100%",
      deadline: "Semester End",
      progressPercentage: 10,
      status: 'In Progress',
      milestones: [
        { task: "Define primary milestone", completed: false },
        { task: "Review course material", completed: false }
      ]
    };
    setGoals(prev => [newG, ...prev]);
    setNewGoalTitle('');
    setShowAddGoal(false);
  };

  if (!activeStudent) return null;

  // Attendance recovery math
  const totalClassesSoFar = 60;
  const attendedClasses = Math.round((activeStudent.overallAttendance / 100) * totalClassesSoFar);
  const neededClasses = Math.max(0, Math.ceil((0.75 * totalClassesSoFar - attendedClasses) / 0.25));

  // Trajectory calculations: current CGPA, predicted CGPA, target CGPA
  const currentCgpa = activeStudent.cgpa;
  const predictedCgpa = Number((currentCgpa + (activeStudent.overallAttendance >= 75 ? 0.3 : -0.2)).toFixed(2));
  const targetCgpa = 8.5;

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Student Profile Header & Persona Switcher */}
      <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-indigo-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)]">
        <div className="rounded-[22px] backdrop-blur-2xl bg-gradient-to-r from-[#031d14]/90 via-slate-900/80 to-[#031d14]/90 border border-emerald-500/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={activeStudent.avatar}
              alt={activeStudent.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">{activeStudent.name}</h2>
                <span className="text-xs bg-black/40 text-emerald-300 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                  {activeStudent.rollNo}
                </span>
                <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  activeStudent.riskLevel === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  activeStudent.riskLevel === 'Moderate' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {activeStudent.riskLevel} Tier
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {activeStudent.department} • Year {activeStudent.year}, Semester {activeStudent.semester} • Mentor: {activeStudent.mentor}
              </p>
            </div>
          </div>

          {/* Student Switcher Dropdown */}
          <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-3 shrink-0 flex flex-col gap-1 min-w-[240px]">
            <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Switch Student Persona:
            </label>
            <select
              value={activeStudent.id}
              onChange={e => handleSelectStudentChange(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} ({s.rollNo}) - {s.riskLevel}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400">
              Select any student to test their self-service portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 text-xs">
        <button
          onClick={() => setActiveSection('360')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === '360'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>360° "How Am I Doing?"</span>
        </button>

        <button
          onClick={() => setActiveSection('analytics')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'analytics'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Academic Analytics & Trajectory</span>
        </button>

        <button
          onClick={() => setActiveSection('goals')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'goals'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Goals & Success Plans</span>
          <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full text-emerald-300">
            {goals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('learning')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'learning'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Personalized Learning Hub</span>
        </button>

        <button
          onClick={() => setActiveSection('copilot')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'copilot'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>AI Success Copilot Chat</span>
        </button>
      </div>

      {/* SECTION 1: 360° "HOW AM I DOING?" DASHBOARD */}
      {activeSection === '360' && (
        <div className="space-y-6">
          {/* Simple "How Am I Doing?" Central Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-[#041a13]/70 border border-emerald-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Executive Academic Summary: "How Am I Doing?"</span>
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
                  {activeStudent.overallAttendance >= 75 && activeStudent.activeBacklogs === 0
                    ? `You are on solid ground, ${activeStudent.name}! You rank in the top 35% of your ${activeStudent.department} class. Your attendance is on track at ${activeStudent.overallAttendance}%, and you have zero course backlogs.`
                    : activeStudent.overallAttendance < 75
                    ? `Attention needed, ${activeStudent.name}: Your attendance is at ${activeStudent.overallAttendance}%, below the university 75% cutoff. Attend the next ${neededClasses} consecutive classes to restore exam eligibility.`
                    : `You have ${activeStudent.activeBacklogs} active backlog(s) needing clearance, but your technical coding score (${activeStudent.codingProfile.byteXlScore}/100) is solid. Focus on exam prep!`}
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  <strong>Recommended Immediate Focus:</strong> Complete your weekly laboratory modules, review weak concepts in mathematics, and practice 2 DSA problems daily to stay eligible for upcoming campus placement drives.
                </p>
              </div>

              <button
                onClick={() => onOpenDetailModal(activeStudent)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Full Transcript</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Core 360° Profile Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 1. Academic Performance */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CGPA</span>
              <div className="text-2xl font-black text-white">{activeStudent.cgpa}</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Semester {activeStudent.semester}</span>
            </div>

            {/* 2. Attendance */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance</span>
              <div className={`text-2xl font-black ${activeStudent.overallAttendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeStudent.overallAttendance}%
              </div>
              <span className="text-[10px] text-slate-400">75% Cutoff</span>
            </div>

            {/* 3. Assignments */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assignments</span>
              <div className="text-2xl font-black text-white">{activeStudent.assignmentSubmissionRate}%</div>
              <span className="text-[10px] text-slate-400">Submission Rate</span>
            </div>

            {/* 4. Active Backlogs */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Backlogs</span>
              <div className={`text-2xl font-black ${activeStudent.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {activeStudent.activeBacklogs}
              </div>
              <span className="text-[10px] text-slate-400">{activeStudent.clearedBacklogs} Cleared</span>
            </div>

            {/* 5. Technical Coding Score */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coding Score</span>
              <div className="text-2xl font-black text-cyan-400">{activeStudent.codingProfile.byteXlScore}</div>
              <span className="text-[10px] text-slate-400">Benchmark /100</span>
            </div>

            {/* 6. Placement Readiness */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Placement</span>
              <div className="text-2xl font-black text-indigo-400">{activeStudent.kpmgReadinessScore}</div>
              <span className="text-[10px] text-slate-400">{activeStudent.placementEligibility}</span>
            </div>
          </div>

          {/* 360° Profile Details: Competencies, Extracurriculars & Career Interests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Skills & Competencies */}
            <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
              <h4 className="font-extrabold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Skills & Competencies</span>
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Data Structures & Algorithms</span>
                    <span className="text-emerald-400 font-bold">{activeStudent.codingProfile.dsaProficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${activeStudent.codingProfile.dsaProficiency}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Relational SQL & Databases</span>
                    <span className="text-cyan-400 font-bold">{activeStudent.codingProfile.sqlProficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${activeStudent.codingProfile.sqlProficiency}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Web & Enterprise Cloud Systems</span>
                    <span className="text-indigo-400 font-bold">{activeStudent.codingProfile.webDevProficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400" style={{ width: `${activeStudent.codingProfile.webDevProficiency}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Extracurricular Activities */}
            <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
              <h4 className="font-extrabold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Extracurriculars & Leadership</span>
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <span>Robotics & IoT Innovation Club</span>
                  <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded font-bold">Active Member</span>
                </li>
                <li className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <span>College Hackathon Organizing Committee</span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded font-bold">Coordinator</span>
                </li>
                <li className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <span>Department Coding Peer Mentor</span>
                  <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded font-bold">Tutor</span>
                </li>
              </ul>
            </div>

            {/* Career Interests & Target Profile */}
            <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
              <h4 className="font-extrabold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Career Interests & Target Role</span>
              </h4>
              <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Career</span>
                <div className="text-base font-extrabold text-white">Technology Consulting Analyst / Cloud Engineer</div>
                <p className="text-[11px] text-slate-400">
                  Targeted companies: KPMG in India, Enterprise Tech Advisory, Global Delivery Centers.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Next Recommended Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">System Architecture</span>
                  <span className="px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px]">GCP / AWS Cloud</span>
                  <span className="px-2 py-0.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 text-[11px]">Docker & CI/CD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ACADEMIC ANALYTICS & TRAJECTORY */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          {/* Performance Trajectory Card: Current -> Predicted -> Target */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#031d14] via-slate-900 to-[#031d14] border border-emerald-500/30 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Performance Trajectory: Current → Predicted → Target</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Predictive academic trajectory based on attendance trends, historical pass velocity, and current assignment submission habits
                </p>
              </div>
              <span className="text-xs text-emerald-300 font-mono">ML Confidence: 91%</span>
            </div>

            {/* Trajectory Stepper */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">1. Current Performance</span>
                <div className="text-3xl font-black text-white">{currentCgpa} CGPA</div>
                <p className="text-xs text-slate-400">Based on past semesters completed</p>
                <div className="mt-2 text-[11px] text-slate-300 bg-white/5 p-2 rounded-xl">
                  Attendance: {activeStudent.overallAttendance}% • Backlogs: {activeStudent.activeBacklogs}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">2. Predicted End-of-Term</span>
                <div className="text-3xl font-black text-emerald-300">{predictedCgpa} CGPA</div>
                <p className="text-xs text-slate-300">Forecast if current attendance is sustained</p>
                <div className="mt-2 text-[11px] text-emerald-200 bg-emerald-900/40 p-2 rounded-xl">
                  {predictedCgpa >= currentCgpa ? "Positive momentum (+0.3)" : "Risk of slight drop without intervention"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">3. Target Potential</span>
                <div className="text-3xl font-black text-indigo-300">{targetCgpa} CGPA</div>
                <p className="text-xs text-slate-300">Achievable with backlog clearance & 85% attendance</p>
                <div className="mt-2 text-[11px] text-indigo-200 bg-indigo-900/40 p-2 rounded-xl">
                  Qualifies for Tier-1 Corporate Campus Hiring
                </div>
              </div>
            </div>
          </div>

          {/* Subject-Wise Marks & Department Comparison Table */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Subject-Wise Marks & Department Benchmarks</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/30 text-slate-400 uppercase text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Your Score</th>
                    <th className="py-3 px-4">Dept Average</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeStudent.academicRecords[0]?.subjects?.map((sub, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {sub.name}
                        <span className="block text-[10px] text-slate-500">{sub.code}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-300">{sub.marks} / {sub.maxMarks}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">72 / 100</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${sub.attendancePercent >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {sub.attendancePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
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
                      <td colSpan={5} className="py-4 text-center text-slate-500">No subject records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: STUDENT GOALS & SUCCESS PLANS */}
      {activeSection === 'goals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>My Academic Goals & Success Plans</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set milestones, track deadlines, and watch your progression towards high GPA and campus placements
              </p>
            </div>

            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          </div>

          {/* Add Goal Form */}
          {showAddGoal && (
            <form onSubmit={handleAddGoal} className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Create a New Success Goal</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Raise Mathematics score from 62% to 80%..."
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  disabled={!newGoalTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-40"
                >
                  Save Goal
                </button>
              </div>
            </form>
          )}

          {/* Goals Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => (
              <div
                key={goal.id}
                className="p-5 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {goal.category} Objective
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">{goal.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    goal.status === 'Achieved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Progress: <strong className="text-white">{goal.progressPercentage}%</strong></span>
                    <span>Target: <strong className="text-emerald-300">{goal.targetValue}</strong></span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Action Milestones:</span>
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {goal.milestones.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        onClick={() => handleToggleMilestone(goal.id, mIdx)}
                        className={`p-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-emerald-950/40 text-emerald-200 line-through opacity-80'
                            : 'bg-black/30 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          m.completed ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-600'
                        }`}>
                          {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-[11px]">{m.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: PERSONALIZED LEARNING HUB */}
      {activeSection === 'learning' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Personalized Learning & Study Recommendations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Based on analytics, these specific resources are recommended to strengthen weak concepts and accelerate your skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningItems.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl space-y-3 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {item.type === 'Video' ? <Video className="w-3.5 h-3.5" /> :
                       item.type === 'Quiz' ? <HelpCircle className="w-3.5 h-3.5" /> :
                       item.type === 'Mentor' ? <User className="w-3.5 h-3.5" /> :
                       <BookOpen className="w-3.5 h-3.5" />}
                      <span>{item.type} • {item.subjectArea}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono bg-black/40 px-2 py-0.5 rounded">
                      {item.duration}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white">{item.title}</h4>
                  <p className="text-xs text-emerald-200/80 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40">
                    💡 <strong>Why:</strong> {item.relevanceReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">Provider: {item.provider}</span>
                  <button
                    onClick={() => {
                      // Resource launcher
                      console.log(`Launching resource: ${item.title}`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Start Learning</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: EMBEDDED AI SUCCESS COPILOT CHAT */}
      {activeSection === 'copilot' && (
        <div className="rounded-3xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-xl p-5 h-[620px] flex flex-col shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">AI Student Success Copilot</h4>
                <p className="text-[11px] text-emerald-400">Grounded in your live academic & attendance records</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Gemini 3.8 Flash</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-black/50 border border-emerald-500/20 text-slate-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isCopilotTyping && (
              <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 text-emerald-300 text-xs w-36 flex items-center gap-2 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Copilot is typing...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => handleSendCopilotMessage(undefined, "Why did my grades fall this semester?")}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-emerald-950 text-emerald-300 border border-white/10 whitespace-nowrap cursor-pointer"
            >
              Why did my grades fall this semester?
            </button>
            <button
              onClick={() => handleSendCopilotMessage(undefined, "How can I raise my CGPA to 8.5?")}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-emerald-950 text-emerald-300 border border-white/10 whitespace-nowrap cursor-pointer"
            >
              How can I raise my CGPA to 8.5?
            </button>
            <button
              onClick={() => handleSendCopilotMessage(undefined, "Which topics should I focus on this week?")}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-emerald-950 text-emerald-300 border border-white/10 whitespace-nowrap cursor-pointer"
            >
              Which topics should I focus on?
            </button>
            <button
              onClick={() => handleSendCopilotMessage(undefined, "Am I ready for campus placements?")}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-emerald-950 text-emerald-300 border border-white/10 whitespace-nowrap cursor-pointer"
            >
              Placement Readiness Check?
            </button>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendCopilotMessage} className="pt-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask anything about courses, exams, attendance or career..."
              className="flex-1 bg-slate-950 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <button
              type="submit"
              disabled={isCopilotTyping || !chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
