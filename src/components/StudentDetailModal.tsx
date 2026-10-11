import React, { useState, useEffect } from 'react';
import {
  Student,
  AiDiagnosisResult,
  RemedialPlanResult,
  MentorBriefResult,
  KpmgAuditResult,
  Intervention,
  DegreeCompletionPathResult
} from '../types/student';
import { api } from '../services/api';
import {
  X,
  Sparkles,
  AlertTriangle,
  CalendarCheck,
  Code2,
  FileText,
  UserCheck,
  Send,
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  BookOpen,
  Copy,
  Check,
  PlusCircle,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Award
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onStudentUpdated: (updated: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onStudentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai_diagnosis' | 'remedial_plan' | 'mentor_brief' | 'kpmg_audit' | 'interventions' | 'degree_path'>('degree_path');

  // AI Loading States
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState<AiDiagnosisResult | null>(null);

  // Degree Completion Path State
  const [degreePathData, setDegreePathData] = useState<DegreeCompletionPathResult | null>(null);
  const [isLoadingDegreePath, setIsLoadingDegreePath] = useState(false);
  const [simulatedPassRate, setSimulatedPassRate] = useState<number | null>(null);
  const [simulatedSummerTerm, setSimulatedSummerTerm] = useState(true);
  const [simulatedBacklogClearancePerTerm, setSimulatedBacklogClearancePerTerm] = useState(4);

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [remedialPlan, setRemedialPlan] = useState<RemedialPlanResult | null>(null);
  const [targetGoal, setTargetGoal] = useState("Clear pending backlogs, raise attendance to >80%, and reach KPMG Placement Eligibility benchmark");

  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [mentorBrief, setMentorBrief] = useState<MentorBriefResult | null>(null);
  const [briefAudience, setBriefAudience] = useState<'mentor_notes' | 'parent_letter'>('mentor_notes');
  const [copiedBrief, setCopiedBrief] = useState(false);

  const [isAuditingKpmg, setIsAuditingKpmg] = useState(false);
  const [kpmgAudit, setKpmgAudit] = useState<KpmgAuditResult | null>(null);
  const [targetRole, setTargetRole] = useState("Technology Consulting Analyst");

  // New Intervention State
  const [showAddIntervention, setShowAddIntervention] = useState(false);
  const [interventionType, setInterventionType] = useState<Intervention['type']>('Academic Tutoring');
  const [interventionNotes, setInterventionNotes] = useState('');
  const [interventionAction, setInterventionAction] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-20');
  const [isSavingIntervention, setIsSavingIntervention] = useState(false);

  // Trigger Gemini Deep Diagnosis
  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await api.getAiRiskDiagnosis(student.id);
      if (res.success) {
        setDiagnosisData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Fetch AI Degree Completion Path Projection
  const handleFetchDegreePath = async () => {
    setIsLoadingDegreePath(true);
    try {
      const res = await api.projectDegreeCompletionPath(student.id);
      if (res.success) {
        setDegreePathData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDegreePath(false);
    }
  };

  // Reset student-specific data when student changes
  useEffect(() => {
    setDegreePathData(null);
    setSimulatedPassRate(null);
    setSimulatedSummerTerm(false);
    setDiagnosisData(null);
    setRemedialPlan(null);
    setMentorBrief(null);
    setKpmgAudit(null);
  }, [student.id]);

  // Fetch Degree Completion Path when on tab and data is missing
  useEffect(() => {
    if (activeTab === 'degree_path' && !degreePathData) {
      handleFetchDegreePath();
    }
  }, [activeTab, student.id, degreePathData]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Trigger Remedial Plan
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await api.generateRemedialPlan(student.id, targetGoal);
      if (res.success) {
        setRemedialPlan(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Trigger Mentor Brief / Parent Letter
  const handleGenerateBrief = async (audience: 'mentor_notes' | 'parent_letter') => {
    setBriefAudience(audience);
    setIsGeneratingBrief(true);
    try {
      const res = await api.generateMentorNote(student.id, audience);
      if (res.success) {
        setMentorBrief(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  // Trigger KPMG Placement Audit
  const handleRunKpmgAudit = async () => {
    setIsAuditingKpmg(true);
    try {
      const res = await api.auditKpmgReadiness(student.id, targetRole);
      if (res.success) {
        setKpmgAudit(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditingKpmg(false);
    }
  };

  // Copy to clipboard
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  // Submit Intervention
  const handleAddIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionNotes.trim()) return;
    setIsSavingIntervention(true);
    try {
      const res = await api.addIntervention(student.id, {
        date: new Date().toISOString().split('T')[0],
        type: interventionType,
        mentorName: student.mentor,
        notes: interventionNotes,
        actionItems: interventionAction.split(',').map(s => s.trim()).filter(Boolean),
        status: 'In Progress',
        followUpDate: followUpDate || '2026-10-25'
      });
      if (res.success) {
        const updatedStudent = await api.getStudent(student.id);
        if (updatedStudent.success) {
          onStudentUpdated(updatedStudent.data);
        }
        setShowAddIntervention(false);
        setInterventionNotes('');
        setInterventionAction('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingIntervention(false);
    }
  };

  // Update status of an existing intervention
  const handleUpdateInterventionStatus = async (interventionId: string, status: Intervention['status']) => {
    try {
      const res = await api.updateInterventionStatus(interventionId, status);
      if (res.success) {
        const updated = await api.getStudent(student.id);
        if (updated.success) {
          onStudentUpdated(updated.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)] w-full max-w-5xl my-auto"
      >
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{student.name}</h2>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {student.rollNo}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    student.riskLevel === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    student.riskLevel === 'Moderate' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    Risk Score: {student.riskScore}/100 ({student.riskLevel})
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student.department} • Year {student.year}, Sem {student.semester} • Assigned Mentor: {student.mentor}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-4 text-xs sm:text-sm gap-2">
          <button
            onClick={() => setActiveTab('degree_path')}
            className={`py-3 px-3.5 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'degree_path'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Degree Completion Path</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              AI Projected
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai_diagnosis')}
            className={`py-3 px-3.5 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'ai_diagnosis'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Risk Diagnosis</span>
          </button>

          <button
            onClick={() => setActiveTab('remedial_plan')}
            className={`py-3 px-3.5 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'remedial_plan'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>AI Remedial Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('mentor_brief')}
            className={`py-3 px-3.5 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'mentor_brief'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Advising & Parent Letter</span>
          </button>

          <button
            onClick={() => setActiveTab('kpmg_audit')}
            className={`py-3 px-3.5 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'kpmg_audit'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>KPMG Placement Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Transcripts & Technical Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('interventions')}
            className={`py-3 px-3.5 font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'interventions'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Interventions ({student.interventions.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 0: AI Degree Completion Path Visualization */}
          {activeTab === 'degree_path' && (() => {
            const isSimulating = simulatedPassRate !== null || simulatedSummerTerm;
            const effectivePassRate = degreePathData 
              ? (simulatedPassRate !== null ? simulatedPassRate : degreePathData.historicalPassRate)
              : 80;
            const effectiveBacklogCredits = degreePathData
              ? (simulatedSummerTerm ? Math.max(0, degreePathData.backlogCreditsPending - 4) : degreePathData.backlogCreditsPending)
              : (student.activeBacklogs * 4);
            const isDelayed = effectivePassRate < 72 || effectiveBacklogCredits > 6;
            const activeGradStatus = effectiveBacklogCredits === 0 ? 'On-Track' : isDelayed ? 'At-Risk (1 Term Delay)' : 'On-Track';
            const activeProb = Math.min(99, Math.max(20, Math.round((effectivePassRate * 0.98) - (effectiveBacklogCredits * 2.2))));
            const gradYear = 2026 + Math.max(0, 4 - student.year);
            const activeGradDate = isDelayed ? `December ${gradYear}` : (degreePathData?.standardGraduationDate || `May ${gradYear}`);

            return (
            <div className="space-y-5 animate-fadeIn">
              {/* Top Hero Glass Projection Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 shadow-sm flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Degree Trajectory Engine
                    </span>
                    <span className="text-xs text-slate-400">B.Tech {student.department}</span>
                    {isSimulating && (
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/80 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        Interactive What-If Simulation Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight flex-wrap">
                    <span>Projected Degree Conferral:</span>
                    <span className={activeGradStatus === 'On-Track' ? 'text-emerald-400' : 'text-amber-400'}>
                      {degreePathData ? activeGradDate : 'Calculating...'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Standard Cohort Target: <strong className="text-white">{degreePathData?.standardGraduationDate || `May ${gradYear}`}</strong> • Current Standing: <strong className="text-cyan-300">Year {student.year}, Sem {student.semester}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Probability Pill */}
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-center min-w-[130px] shadow-inner">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">On-Time Probability</span>
                    <div className={`text-2xl font-black ${activeProb >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {degreePathData ? `${activeProb}%` : '--'}
                    </div>
                    <span className="text-[9px] text-slate-400">{degreePathData ? activeGradStatus : 'Pending'}</span>
                  </div>

                  {/* Re-calculate Button */}
                  <button
                    onClick={handleFetchDegreePath}
                    disabled={isLoadingDegreePath}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isLoadingDegreePath ? 'animate-spin text-amber-300' : ''}`} />
                    <span>{isLoadingDegreePath ? 'Projecting...' : 'Re-Project'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Gauges & Credit Balance */}
              {degreePathData && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <span className="text-[11px] text-slate-400 font-semibold block">Total Degree Credits</span>
                      <div className="text-xl font-black text-white mt-0.5">{degreePathData.totalCreditsRequired} Credits</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">B.Tech Accreditation Rule</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <span className="text-[11px] text-slate-400 font-semibold block">Earned Credits to Date</span>
                      <div className="text-xl font-black text-emerald-400 mt-0.5">
                        {degreePathData.creditsEarned} <span className="text-xs font-normal text-slate-400">/ 160</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${Math.min(100, Math.round((degreePathData.creditsEarned / degreePathData.totalCreditsRequired) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <span className="text-[11px] text-slate-400 font-semibold block">Pending Backlog Credits</span>
                      <div className={`text-xl font-black mt-0.5 ${effectiveBacklogCredits > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {effectiveBacklogCredits} Credits
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {simulatedSummerTerm ? `${student.activeBacklogs} backlogs (-4 Cr in Summer)` : `${student.activeBacklogs} active backlogs to clear`}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <span className="text-[11px] text-slate-400 font-semibold block">Course Pass Rate</span>
                      <div className="text-xl font-black text-cyan-300 mt-0.5">
                        {effectivePassRate}% {isSimulating && <span className="text-xs text-amber-300 font-bold">*sim</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {degreePathData.creditRecoveryVelocity}
                      </div>
                    </div>
                  </div>

                  {/* Degree Credit Architecture Breakdown Bar */}
                  <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Curriculum Credit Distribution (160 Credit Scheme)</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Completed: <strong className="text-emerald-400">{degreePathData.creditsEarned} Cr</strong> ({Math.round((degreePathData.creditsEarned / 160) * 100)}%)
                      </span>
                    </div>

                    {/* Multi-segment Progress Bar */}
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div style={{ width: '60%' }} className="bg-indigo-500 h-full" title="Engineering Core (96 Credits)" />
                      <div style={{ width: '15%' }} className="bg-cyan-500 h-full" title="Professional Electives (24 Credits)" />
                      <div style={{ width: '10%' }} className="bg-purple-500 h-full" title="Open Electives (16 Credits)" />
                      <div style={{ width: '10%' }} className="bg-emerald-500 h-full" title="Practicum & Technical Labs (16 Credits)" />
                      <div style={{ width: '5%' }} className="bg-amber-500 h-full" title="Capstone Project (8 Credits)" />
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>Core (96 Cr)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span>Prof Electives (24 Cr)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Open Electives (16 Cr)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Technical Labs (16 Cr)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Capstone (8 Cr)</span>
                      </span>
                    </div>
                  </div>

                  {/* Interactive What-If Pass Rate & Clearance Simulator */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 backdrop-blur-xl border border-indigo-500/30 space-y-3 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-900/70 border border-indigo-600/50 text-indigo-300">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">Interactive Pass Rate & Credit Velocity Simulator</h4>
                          <p className="text-[11px] text-slate-400">
                            Adjust projected pass rate and remedial enrollments to test graduation date resilience in real time.
                          </p>
                        </div>
                      </div>

                      {isSimulating && (
                        <button
                          onClick={() => {
                            setSimulatedPassRate(null);
                            setSimulatedSummerTerm(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          Reset to Baseline
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      {/* Pass Rate Slider */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="text-slate-300 font-medium">Simulated Semester Pass Rate</label>
                          <span className="text-sm font-black text-cyan-400">{effectivePassRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={effectivePassRate}
                          onChange={e => setSimulatedPassRate(Number(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>50% (At Risk)</span>
                          <span className="text-indigo-400 font-semibold cursor-pointer" onClick={() => setSimulatedPassRate(degreePathData.historicalPassRate)}>
                            Baseline ({degreePathData.historicalPassRate}%)
                          </span>
                          <span>100% (Optimal)</span>
                        </div>
                      </div>

                      {/* Remedial Summer Term Toggle & Velocity */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 font-medium block">Remedial Acceleration Options</label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={simulatedSummerTerm}
                              onChange={e => setSimulatedSummerTerm(e.target.checked)}
                              className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-0"
                            />
                            <span>Include Summer Supplementary Term (+4 Cr fast clearance)</span>
                          </label>
                        </div>

                        {/* Real-time Simulated Outcome Pill */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Projected Trajectory:</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-black ${isDelayed ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {activeGradDate}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isDelayed ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {activeProb}% On-Time
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual 3D Timeline Path to Degree Completion */}
                  <div className="p-5 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-700/60 text-indigo-400">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Term-by-Term Credit Clearance Roadmap</h4>
                          <p className="text-[11px] text-slate-400">
                            Milestone path balancing regular coursework (max 24 credits/sem) with supplementary backlog exams.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                        Max 24 Credits / Regular Term
                      </span>
                    </div>

                    {/* Step-by-Step Path Rail */}
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-emerald-500">
                      {degreePathData.termMilestones?.map((milestone, idx) => {
                        const isCurrent = milestone.status === 'In Progress';
                        const isGrad = milestone.status === 'Degree Conferred';
                        const isRemedial = milestone.status === 'Projected Remedial';
                        return (
                          <div key={idx} className="relative group">
                            {/* Glowing Node Dot on Rail */}
                            <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                              isGrad ? 'bg-emerald-500 border-white text-slate-950' :
                              isCurrent ? 'bg-cyan-500 border-white animate-pulse' :
                              isRemedial ? 'bg-amber-500 border-slate-900' :
                              'bg-indigo-600 border-slate-900'
                            }`}>
                              <span className="text-[9px] font-black">{idx + 1}</span>
                            </div>

                            {/* Milestone Card */}
                            <div className={`p-4 rounded-xl border backdrop-blur-xl transition-all ${
                              isCurrent ? 'bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-indigo-950/40 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30' :
                              isGrad ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950 border-emerald-500/50 shadow-md' :
                              isRemedial ? 'bg-amber-950/30 border-amber-800/50' :
                              'bg-slate-900/70 border-white/10 hover:border-white/20'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-white text-xs sm:text-sm">{milestone.termName}</h5>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isCurrent ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                                    isGrad ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                    isRemedial ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                    'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                  }`}>
                                    {milestone.status}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-slate-300">
                                    Total Load: <strong className="text-white">{milestone.totalCredits} Credits</strong>
                                  </span>
                                  {milestone.backlogCreditsScheduled > 0 && (
                                    <span className="text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
                                      +{milestone.backlogCreditsScheduled} Backlog Cr
                                    </span>
                                  )}
                                  <span className="text-slate-400">
                                    Pass Prob: <strong className="text-emerald-400">{milestone.projectedPassRate}%</strong>
                                  </span>
                                </div>
                              </div>

                              {/* Focus subjects */}
                              {milestone.focusSubjects?.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                                  <span className="text-slate-400 font-medium">Curriculum Focus:</span>
                                  {milestone.focusSubjects.map((sub, sI) => (
                                    <span key={sI} className="px-2 py-0.5 rounded bg-white/5 text-slate-200 border border-white/10">
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Critical Backlog Chokepoints (if any) */}
                  {degreePathData.criticalBacklogChokepoints?.length > 0 && (
                    <div className="p-4 rounded-xl bg-rose-950/30 backdrop-blur-xl border border-rose-900/60 space-y-2 shadow-lg">
                      <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Prerequisite Chokepoint Alerts (Critical Graduation Blockers)</span>
                      </div>
                      <div className="space-y-2">
                        {degreePathData.criticalBacklogChokepoints.map((choke, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-900/80 backdrop-blur-md border border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div>
                              <div className="font-bold text-white text-xs">{choke.subjectName} ({choke.credits} Credits)</div>
                              <p className="text-slate-400 text-[11px] mt-0.5">
                                Blocks: <strong className="text-rose-300">{choke.prerequisiteFor}</strong>
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800 shrink-0 text-[11px]">
                              Attempt in: {choke.recommendedAttemptTerm}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acceleration Strategies */}
                  {degreePathData.accelerationStrategies?.length > 0 && (
                    <div className="p-4 rounded-xl bg-indigo-950/30 backdrop-blur-xl border border-indigo-900/50 space-y-2 text-xs shadow-lg">
                      <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Fast-Track Degree Acceleration Strategies</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {degreePathData.accelerationStrategies.map((strat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span>{strat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Registrar Verdict */}
                  <div className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-xs space-y-1 shadow-lg">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      AI Academic Registrar Clinical Counsel (Gemini 3.8 Flash)
                    </span>
                    <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                      {degreePathData.aiAdvisorVerdict}
                    </p>
                  </div>
                </>
              )}

              {isLoadingDegreePath && !degreePathData && (
                <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Sparkles className="w-8 h-8 animate-spin text-emerald-400" />
                  <span>Computing credit clearing velocity and degree completion trajectory with Gemini 3.8 Flash...</span>
                </div>
              )}
            </div>
            );
          })()}

          {/* TAB 1: AI Risk Diagnosis */}
          {activeTab === 'ai_diagnosis' && (
            <div className="space-y-4">
              {/* Snapshot Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="text-xs text-slate-400">Current CGPA</div>
                  <div className="text-xl font-black text-white">{student.cgpa.toFixed(2)}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {student.activeBacklogs} active backlogs
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="text-xs text-slate-400">Lecture Attendance</div>
                  <div className={`text-xl font-black ${student.overallAttendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {student.overallAttendance}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {student.recentAbsenceStreak > 0 ? `${student.recentAbsenceStreak} consecutive days absent` : 'Regular attendance'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="text-xs text-slate-400">Coding Proficiency Score</div>
                  <div className="text-xl font-black text-indigo-300">
                    {student.codingProfile.byteXlScore}/100
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {student.codingProfile.problemsSolved} practice problems
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="text-xs text-slate-400">KPMG Placement</div>
                  <div className="text-xl font-black text-cyan-300">
                    {student.kpmgReadinessScore}/100
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {student.placementEligibility} status
                  </div>
                </div>
              </div>

              {/* Detected Risk Factors */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Identified Academic Threat Signals
                </h4>
                <ul className="space-y-1.5">
                  {student.riskFactors.length === 0 ? (
                    <li className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      No acute risk signals detected. Student maintains strong momentum.
                    </li>
                  ) : (
                    student.riskFactors.map((factor, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Action Button to Run Gemini 3.8 Flash Diagnostic */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-800/60">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Explainable AI Clinical Diagnosis (Gemini 3.8 Flash)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Deep neural analysis of multidimensional attendance drops, backlog compounding, and retention prognosis.
                  </p>
                </div>
                <button
                  onClick={handleRunDiagnosis}
                  disabled={isDiagnosing}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {isDiagnosing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Diagnosing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{diagnosisData ? 'Re-Run Deep Diagnosis' : 'Run Deep Diagnosis'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Diagnosis Output Card */}
              {diagnosisData && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-indigo-900/60 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Primary Threat Vector:
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {diagnosisData.primaryThreatVector}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Model Confidence: <strong>{diagnosisData.confidenceScore}%</strong>
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Clinical Executive Summary
                    </h5>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      {diagnosisData.clinicalSummary}
                    </p>
                  </div>

                  {/* Top Drivers */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Critical Risk Drivers & Root Causes
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {diagnosisData.topDrivers?.map((driver, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{driver.factor}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              driver.severity === 'High' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                            }`}>
                              {driver.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{driver.observation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projected Trajectory */}
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs">
                    <strong className="text-amber-300 block mb-1">Projected Trajectory:</strong>
                    <p className="text-slate-300">{diagnosisData.projectedTrajectory}</p>
                  </div>

                  {/* Immediate Faculty Action */}
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-xs">
                    <strong className="text-emerald-300 block mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Recommended Faculty Action (Next 48 Hours):
                    </strong>
                    <p className="text-slate-200">{diagnosisData.immediateFacultyAction}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI Remedial Plan Generator */}
          {activeTab === 'remedial_plan' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Generate Personalized 4-Week Remedial & Recovery Roadmap
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Powered by Gemini 3.8 Flash. Generates structured weekly milestones, hours allocation, and recommended practice modules based on student backlogs.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={targetGoal}
                    onChange={e => setTargetGoal(e.target.value)}
                    placeholder="Specify learning or remediation objective..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleGeneratePlan}
                    disabled={isGeneratingPlan}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {isGeneratingPlan ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{remedialPlan ? 'Regenerate Plan' : 'Generate 4-Week Plan'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {remedialPlan && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{remedialPlan.planTitle}</h3>
                      <div className="text-xs text-cyan-300 mt-0.5">Target KPI: {remedialPlan.kpiTarget}</div>
                    </div>
                    <div className="flex gap-1.5">
                      {remedialPlan.focusAreas?.map((area, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Timeline */}
                  <div className="space-y-2.5">
                    {remedialPlan.weeklyMilestones?.map(week => (
                      <div key={week.week} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                              W{week.week}
                            </span>
                            <span className="text-sm font-bold text-white">{week.theme}</span>
                          </div>
                          <span className="text-xs text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                            {week.hoursPerWeek} hrs/week
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2 pt-2 border-t border-slate-850">
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Action Items:
                            </span>
                            <ul className="space-y-1">
                              {week.tasks?.map((task, i) => (
                                <li key={i} className="text-slate-300 flex items-start gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                              Recommended Practice Modules:
                            </span>
                            <ul className="space-y-1">
                              {week.byteXlModules?.map((mod, i) => (
                                <li key={i} className="text-cyan-200 flex items-start gap-1.5 bg-slate-900/80 px-2 py-1 rounded">
                                  <Code2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                                  <span>{mod}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Faculty Advising Brief & Parent Letter */}
          {activeTab === 'mentor_brief' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    AI Communication & Counseling Drafts
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate an official counseling brief for faculty or an empathetic notification letter to parents regarding attendance & backlogs.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerateBrief('mentor_notes')}
                    disabled={isGeneratingBrief}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    Faculty 1-on-1 Notes
                  </button>
                  <button
                    onClick={() => handleGenerateBrief('parent_letter')}
                    disabled={isGeneratingBrief}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 text-cyan-300 border border-slate-700 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Parent Notification
                  </button>
                </div>
              </div>

              {isGeneratingBrief && (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Sparkles className="w-6 h-6 animate-spin text-indigo-400" />
                  <span>Drafting tailored communication with Gemini...</span>
                </div>
              )}

              {mentorBrief && !isGeneratingBrief && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 uppercase">Subject: </span>
                      <span className="text-xs font-bold text-white">{mentorBrief.subject}</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(mentorBrief.content)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                    >
                      {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBrief ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {mentorBrief.content}
                  </div>

                  {/* Talking points */}
                  {mentorBrief.recommendedTalkingPoints?.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                        Key Counseling Talking Points:
                      </span>
                      <ul className="space-y-1 text-xs">
                        {mentorBrief.recommendedTalkingPoints.map((pt, i) => (
                          <li key={i} className="text-slate-300 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/40 text-xs text-indigo-200">
                    <strong>Next Follow-up Step: </strong> {mentorBrief.followUpAction}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KPMG Placement Audit */}
          {activeTab === 'kpmg_audit' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-950 rounded-xl border border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      Corporate Partner: KPMG in India
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    Campus Recruitment & Competency Readiness Audit
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Evaluates student profile against KPMG hiring benchmarks, backlog filters, and technical interview thresholds.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-slate-200"
                  >
                    <option value="Technology Consulting Analyst">Technology Consulting Analyst</option>
                    <option value="Cloud & Infrastructure Engineer">Cloud & Infrastructure Engineer</option>
                    <option value="Data & AI Specialist">Data & AI Specialist</option>
                    <option value="Technology Risk Consultant">Technology Risk Consultant</option>
                  </select>

                  <button
                    onClick={handleRunKpmgAudit}
                    disabled={isAuditingKpmg}
                    className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {isAuditingKpmg ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-white" />
                        <span>Auditing...</span>
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-4 h-4" />
                        <span>Run Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {kpmgAudit && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 uppercase">Hiring Verdict: </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        kpmgAudit.hiringVerdict === 'Direct Interview Eligible'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : kpmgAudit.hiringVerdict.includes('Borderline')
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {kpmgAudit.hiringVerdict}
                      </span>
                    </div>

                    <div className="text-xs">
                      Readiness Index: <strong className="text-cyan-400 text-sm">{kpmgAudit.readinessScore}/100</strong>
                    </div>
                  </div>

                  {/* Competency Gap Matrix */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      KPMG Core Competency Benchmarks
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {kpmgAudit.kpmgCompetencies?.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="flex justify-between font-semibold text-white mb-1">
                            <span>{c.competency}</span>
                            <span className={c.rating >= c.benchmark ? 'text-emerald-400' : 'text-amber-400'}>
                              {c.rating}% (Target: {c.benchmark}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${c.rating >= c.benchmark ? 'bg-emerald-400' : 'bg-amber-400'}`}
                              style={{ width: `${c.rating}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Gaps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                      <span className="text-emerald-400 font-bold block mb-1">Demonstrated Strengths</span>
                      <ul className="space-y-1">
                        {kpmgAudit.keyStrengths?.map((str, i) => (
                          <li key={i} className="text-slate-300 flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
                      <span className="text-rose-400 font-bold block mb-1">Recruitment Barriers / Gaps</span>
                      <ul className="space-y-1">
                        {kpmgAudit.criticalGaps?.map((gap, i) => (
                          <li key={i} className="text-slate-300 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mock Interview Prep */}
                  {kpmgAudit.mockInterviewQuestions?.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-cyan-400 font-bold block mb-1">
                        Targeted KPMG Technical Interview Questions:
                      </span>
                      <ul className="space-y-1">
                        {kpmgAudit.mockInterviewQuestions.map((q, i) => (
                          <li key={i} className="text-slate-300 italic">
                            "{q}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Academic Transcripts & Technical Skill Benchmarks */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Technical Coding Profile Breakdown */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Technical Engineering Skills Passport
                    </h4>
                  </div>
                  <span className="text-xs text-indigo-300 font-bold">
                    Score: {student.codingProfile.byteXlScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">DSA Proficiency</span>
                    <div className="text-base font-bold text-white mt-0.5">{student.codingProfile.dsaProficiency}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Database & SQL</span>
                    <div className="text-base font-bold text-white mt-0.5">{student.codingProfile.sqlProficiency}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Web / App Development</span>
                    <div className="text-base font-bold text-white mt-0.5">{student.codingProfile.webDevProficiency}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-850">
                  <span>Problems Solved: <strong>{student.codingProfile.problemsSolved}</strong></span>
                  <span>GitHub Commits (Past 30d): <strong>{student.codingProfile.githubCommitsThisMonth}</strong></span>
                  <span>LMS Engagement: <strong>{student.lmsEngagementScore}/100</strong></span>
                </div>
              </div>

              {/* Semester Records */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Semester Academic Records & Backlogs
                </h4>
                {student.academicRecords.length === 0 ? (
                  <div className="p-4 bg-slate-950 rounded-lg text-center text-xs text-slate-400">
                    No individual subject records uploaded yet for this student.
                  </div>
                ) : (
                  student.academicRecords.map((sem, sIdx) => (
                    <div key={sIdx} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">Semester {sem.semester}</span>
                        <div className="text-xs text-slate-400 space-x-3">
                          <span>SGPA: <strong className="text-cyan-400">{sem.sgpa}</strong></span>
                          <span>Credits: <strong>{sem.credits}</strong></span>
                          <span className={sem.backlogs > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {sem.backlogs} Backlog(s)
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="text-[11px] uppercase text-slate-500 border-b border-slate-800">
                            <tr>
                              <th className="py-1.5 px-2">Code</th>
                              <th className="py-1.5 px-2">Subject Name</th>
                              <th className="py-1.5 px-2">Grade</th>
                              <th className="py-1.5 px-2">Marks</th>
                              <th className="py-1.5 px-2">Attendance</th>
                              <th className="py-1.5 px-2">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {sem.subjects.map((sub, subIdx) => (
                              <tr key={subIdx}>
                                <td className="py-1.5 px-2 font-mono text-slate-400">{sub.code}</td>
                                <td className="py-1.5 px-2 font-medium text-white">{sub.name}</td>
                                <td className="py-1.5 px-2">{sub.grade}</td>
                                <td className="py-1.5 px-2">{sub.marks}/{sub.maxMarks}</td>
                                <td className="py-1.5 px-2">
                                  <span className={sub.attendancePercent < 75 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                                    {sub.attendancePercent}%
                                  </span>
                                </td>
                                <td className="py-1.5 px-2">
                                  <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                                    sub.status === 'Pass' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                                  }`}>
                                    {sub.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Interventions & Case Notes */}
          {activeTab === 'interventions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Intervention Audit Log & Action Tracking
                  </h4>
                  <p className="text-xs text-slate-400">
                    Track faculty interventions, counseling sessions, remedial assignments, and resolution progress.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddIntervention(!showAddIntervention)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log New Intervention</span>
                </button>
              </div>

              {/* Form to Log New Intervention */}
              {showAddIntervention && (
                <form onSubmit={handleAddIntervention} className="p-4 bg-slate-950 rounded-xl border border-indigo-900/60 space-y-3 animate-fadeIn">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Create Intervention Record
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Intervention Type</label>
                      <select
                        value={interventionType}
                        onChange={e => setInterventionType(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      >
                        <option value="Academic Tutoring">Academic Tutoring</option>
                        <option value="Attendance Counseling">Attendance Counseling</option>
                        <option value="Mental Health / Wellbeing">Mental Health / Wellbeing</option>
                        <option value="Placement Mentorship">Placement Mentorship</option>
                        <option value="Parent Notification">Parent Notification</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Follow-up Target Date</label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={e => setFollowUpDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-400 mb-1">Faculty / Mentor Session Notes</label>
                    <textarea
                      rows={2}
                      value={interventionNotes}
                      onChange={e => setInterventionNotes(e.target.value)}
                      placeholder="Describe the issues discussed, agreed commitments, and remediation timeline..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-400 mb-1">Action Items (comma-separated)</label>
                    <input
                      type="text"
                      value={interventionAction}
                      onChange={e => setInterventionAction(e.target.value)}
                      placeholder="e.g. Enroll in DSA lab, Submit assignment 3, Meet mentor weekly"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddIntervention(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingIntervention}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {isSavingIntervention ? 'Saving...' : 'Save Intervention'}
                    </button>
                  </div>
                </form>
              )}

              {/* Past Interventions List */}
              <div className="space-y-2">
                {student.interventions.length === 0 ? (
                  <div className="p-6 bg-slate-950 rounded-xl text-center text-xs text-slate-400">
                    No intervention records logged yet for this student.
                  </div>
                ) : (
                  student.interventions.map(int => (
                    <div key={int.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{int.type}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{int.date}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">Mentor: {int.mentorName}</span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Status:</span>
                          <select
                            value={int.status}
                            onChange={e => handleUpdateInterventionStatus(int.id, e.target.value as any)}
                            className={`text-xs font-semibold rounded px-2 py-0.5 border ${
                              int.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                              int.status === 'Escalated' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                              int.status === 'In Progress' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                              'bg-amber-950 text-amber-300 border-amber-800'
                            }`}
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Escalated">Escalated</option>
                          </select>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        {int.notes}
                      </p>

                      {int.actionItems?.length > 0 && (
                        <div className="text-xs flex items-center gap-2 flex-wrap">
                          <span className="text-slate-400 font-medium">Actions:</span>
                          {int.actionItems.map((act, idx) => (
                            <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-700">
                              ✓ {act}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Follow-up scheduled: <strong>{int.followUpDate}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
