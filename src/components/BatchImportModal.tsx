import React, { useState } from 'react';
import { api } from '../services/api';
import { X, UploadCloud, CheckCircle, FileText, Sparkles } from 'lucide-react';

interface BatchImportModalProps {
  onClose: () => void;
  onImportSuccess: () => void;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({ onClose, onImportSuccess }) => {
  const sampleJson = `[
  {
    "rollNo": "22CS188",
    "name": "Manish Gupta",
    "email": "manish.gupta@college.edu.in",
    "department": "Computer Science",
    "year": 3,
    "semester": 5,
    "section": "C",
    "mentor": "Dr. Ramesh Babu",
    "cgpa": 5.8,
    "activeBacklogs": 2,
    "clearedBacklogs": 0,
    "overallAttendance": 64.0,
    "recentAbsenceStreak": 3,
    "lmsEngagementScore": 45,
    "assignmentSubmissionRate": 50,
    "codingProfile": {
      "byteXlScore": 38,
      "problemsSolved": 32,
      "githubCommitsThisMonth": 2,
      "dsaProficiency": 30,
      "sqlProficiency": 40,
      "webDevProficiency": 45
    },
    "kpmgReadinessScore": 42,
    "placementEligibility": "Ineligible",
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "rollNo": "22AI192",
    "name": "Tanvi Deshmukh",
    "email": "tanvi.deshmukh@college.edu.in",
    "department": "AI & Data Science",
    "year": 3,
    "semester": 5,
    "section": "A",
    "mentor": "Dr. Vikram Seth",
    "cgpa": 8.7,
    "activeBacklogs": 0,
    "clearedBacklogs": 0,
    "overallAttendance": 94.5,
    "recentAbsenceStreak": 0,
    "lmsEngagementScore": 92,
    "assignmentSubmissionRate": 96,
    "codingProfile": {
      "byteXlScore": 88,
      "problemsSolved": 290,
      "githubCommitsThisMonth": 38,
      "dsaProficiency": 85,
      "sqlProficiency": 90,
      "webDevProficiency": 82
    },
    "kpmgReadinessScore": 91,
    "placementEligibility": "Eligible",
    "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
  }
]`;

  const [jsonText, setJsonText] = useState(sampleJson);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImport = async () => {
    setErrorMsg(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setErrorMsg("JSON root must be an array of students");
        return;
      }
      setIsImporting(true);
      const res = await api.importBatch(parsed);
      if (res.success) {
        onImportSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid JSON syntax");
    } finally {
      setIsImporting(false);
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
          <div className="p-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white">Bulk Student Data Import (JSON/CSV)</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          <p className="text-slate-300">
            Paste structured batch academic records below. The system will automatically ingest, calculate multi-factor risk scores, and categorize KPMG placement status for all students.
          </p>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Student Records JSON Array:</span>
            <button
              type="button"
              onClick={() => setJsonText(sampleJson)}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Load Benchmark Sample</span>
            </button>
          </div>

          <textarea
            rows={12}
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className="w-full bg-slate-950 font-mono text-[11px] text-cyan-300 p-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {isImporting ? 'Ingesting Dataset...' : 'Import Dataset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
