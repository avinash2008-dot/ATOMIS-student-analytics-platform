import React, { useState } from 'react';
import { Student } from '../types/student';
import { api, ResumeAuditResult } from '../services/api';
import {
  X,
  FileSearch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Code2,
  Copy,
  Check
} from 'lucide-react';

interface KpmgResumeAuditorModalProps {
  student: Student;
  onClose: () => void;
}

export const KpmgResumeAuditorModal: React.FC<KpmgResumeAuditorModalProps> = ({ student, onClose }) => {
  const defaultResume = `EDUCATION:
B.Tech in ${student.department}, Year ${student.year} (CGPA: ${student.cgpa})
Key Courses: Data Structures, Operating Systems, Database Management Systems, Computer Networks.

TECHNICAL SKILLS:
- Languages: Python, C++, Java, JavaScript, SQL
- Frameworks & Tools: React, Node.js, Express, Git, Coding Benchmark (${student.codingProfile.byteXlScore}/100)
- GitHub: https://github.com/student-${student.rollNo.toLowerCase()} (${student.codingProfile.problemsSolved} coding problems solved)

PROJECTS:
1. Enterprise Student Success Platform:
   - Built a full-stack platform for college administration to predict student dropout risk.
   - Used React and Express for frontend and backend integration.
   - Connected with Gemini AI for automated personalized study recommendations.

2. Database Query Optimizer:
   - Designed schema normalization for college course registration.
   - Wrote SQL queries and indexed tables.`;

  const [resumeText, setResumeText] = useState(defaultResume);
  const [targetRole, setTargetRole] = useState("Technology Consulting Analyst");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<ResumeAuditResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await api.auditResume(student.id, resumeText, targetRole);
      if (res.success) {
        setAuditResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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
        className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)] w-full max-w-4xl my-auto"
      >
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <FileSearch className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">AI Resume & GitHub Portfolio Auditor</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-blue-800">
                    KPMG in India Partner Track
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Auditing candidate: <strong className="text-white">{student.name}</strong> ({student.rollNo} • {student.department})
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Target Role Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">Select Target KPMG Hiring Role:</span>
            </div>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs"
            >
              <option value="Technology Consulting Analyst">Technology Consulting Analyst</option>
              <option value="Cloud & Infrastructure Engineer">Cloud & Infrastructure Engineer</option>
              <option value="Data & AI Specialist">Data & AI Specialist</option>
              <option value="Technology Risk Consultant">Technology Risk Consultant</option>
            </select>
          </div>

          {/* Resume Text Input */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block">Resume Experience & Portfolio Content:</label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              className="w-full bg-slate-950 font-mono text-[11px] text-slate-200 p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAuditing ? 'Auditing Resume & GitHub with Gemini 3.8 Flash...' : 'Run KPMG ATS & Portfolio Audit'}</span>
          </button>

          {/* Audit Results */}
          {auditResult && (
            <div className="p-4 bg-slate-950 border border-cyan-900/60 rounded-xl space-y-4 animate-fadeIn">
              {/* Scores Bar */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">KPMG ATS Score</span>
                  <div className="text-2xl font-black text-cyan-400 mt-0.5">{auditResult.atsScore}/100</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Role Competency Fit</span>
                  <div className="text-2xl font-black text-indigo-400 mt-0.5">{auditResult.kpmgFitScore}%</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Hiring Verdict</span>
                  <div className={`text-xs font-bold px-2 py-1 mt-1 rounded ${
                    auditResult.verdict.includes('Ready') ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {auditResult.verdict}
                  </div>
                </div>
              </div>

              {/* Missing Keywords & Strengths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">Key Strengths Found:</span>
                  <ul className="space-y-1">
                    {auditResult.strengthsFound?.map((st, i) => (
                      <li key={i} className="text-slate-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="font-bold text-rose-400 block mb-1">Recommended Missing Keywords:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {auditResult.missingKeywords?.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-800/80 rounded text-[11px]">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* High-Impact Resume Bullet Rewrites */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-white text-xs uppercase tracking-wider block">
                  AI High-Impact Resume Bullet Improvements:
                </span>
                {auditResult.resumeBulletImprovements?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-slate-400 text-[11px]">
                      <span className="font-semibold text-rose-400">Original: </span>
                      <span className="line-through">{item.original}</span>
                    </div>
                    <div className="text-cyan-300 font-medium flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-emerald-400">Rewritten for KPMG: </span>
                        <span>{item.improved}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.improved, idx)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0"
                        title="Copy improved bullet point"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* GitHub Portfolio Audit */}
              <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-900/40 text-xs">
                <span className="font-bold text-indigo-300 block mb-1">GitHub & Technical Portfolio Assessment:</span>
                <p className="text-slate-300 leading-relaxed">{auditResult.gitHubPortfolioAudit}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
