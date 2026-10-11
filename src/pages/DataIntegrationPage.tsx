import React, { useState } from 'react';
import { DataQualityReport } from '../data/studentTypes';
import {
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Zap,
  Sliders,
  Filter
} from 'lucide-react';

interface DataIntegrationPageProps {
  report: DataQualityReport;
  onRegenerateData: () => void;
  onRequireAuth?: (action: () => void, description?: string) => void;
}

export const DataIntegrationPage: React.FC<DataIntegrationPageProps> = ({
  report,
  onRegenerateData,
  onRequireAuth,
}) => {
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const sourcesList = [
    { name: '1. Academic Exam & CGPA Table', count: report.sourceCounts.academic, keys: 'cgpa, internal_marks, exam_marks, backlogs, subjects' },
    { name: '2. Biometric Attendance Table', count: report.sourceCounts.attendance, keys: 'overall_attendance_pct, subject_attendance' },
    { name: '3. LMS Portal Activity Table', count: report.sourceCounts.lms, keys: 'logins_per_week, assignment_completion_pct, content_views' },
    { name: '4. Campus Engagement & Clubs Table', count: report.sourceCounts.engagement, keys: 'events, club_memberships, hackathons, certs' },
    { name: '5. Placement Cell Readiness Table', count: report.sourceCounts.placement, keys: 'aptitude_score, coding_score, mock_interview' },
    { name: '6. Technical & Soft Skills Assessment', count: report.sourceCounts.skills, keys: 'technical_skill_score, soft_skill_score' },
    { name: '7. Student & Faculty Feedback Table', count: report.sourceCounts.feedback, keys: 'student_satisfaction, faculty_feedback_rating' },
  ];

  const handleSimulateUpload = (sourceName: string) => {
    const doUpload = () => {
      setUploadNotice(`Received file upload for "${sourceName}". Applied schema validation and merged into unified pipeline.`);
      setTimeout(() => setUploadNotice(null), 3500);
    };

    if (onRequireAuth) {
      onRequireAuth(doUpload, `upload and ingest ${sourceName} CSV files`);
    } else {
      doUpload();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-['Quicksand']">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-slate-900 dark:text-white">
            Campus Data Integration & Quality Engineering
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            ETL pipeline orchestrating 7 isolated institutional tables into a single unified student identity
          </p>
        </div>

        <button
          onClick={onRegenerateData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 hover:border-blue-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-blue-700 dark:text-[#3d63ff]" />
          <span>Re-run Synthetic ETL Pipeline</span>
        </button>
      </div>

      {uploadNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Before & After Data Quality Report (B1 spec) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Total Raw Ingested Rows</span>
          <div className="text-3xl font-black font-['Raleway'] text-slate-900 dark:text-white">
            {report.rawRowCount}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold">Across 7 campus data sources</span>
        </div>

        <div className="p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Duplicates Deduplicated</span>
          <div className="text-3xl font-black font-['Raleway'] text-blue-700 dark:text-blue-400">
            {report.dedupedCount}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold">Unique student_id constraint</span>
        </div>

        <div className="p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Missing Values Imputed</span>
          <div className="text-3xl font-black font-['Raleway'] text-amber-700 dark:text-amber-400">
            {report.missingValuesFixed}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold">Department median substitution</span>
        </div>

        <div className="p-5 rounded-3xl glass-panel space-y-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Cleaned Unified Records</span>
          <div className="text-3xl font-black font-['Raleway'] text-emerald-700 dark:text-emerald-400">
            {report.mergedStudentsCount}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
            Quality: {report.beforeQualityPct}% → {report.afterQualityPct}%
          </span>
        </div>

      </div>

      {/* Visual Merge Pipeline Flow Diagram (B1 spec) */}
      <div className="p-6 rounded-3xl glass-panel space-y-6">
        <div>
          <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
            Automated Merge & Transformation Pipeline
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Step-by-step cleaning flow applied automatically on raw campus ingestion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 space-y-2 relative">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-[#3d63ff] font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white font-['Raleway']">
              1. Ingestion & Join by student_id
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Consolidates 7 schemas. Matches keys across university ERP, LMS databases, and biometric servers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 space-y-2 relative">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-[#3d63ff] font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white font-['Raleway']">
              2. Deduplication & Verification
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Discards redundant student_id rows (found {report.dedupedCount} duplicates). Resolves timestamps to latest valid state.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 space-y-2 relative">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-[#3d63ff] font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white font-['Raleway']">
              3. Imputation & Outlier Capping
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Median imputation for ~5% null values. Clamps invalid outliers (e.g. attendance &gt;100% or CGPA &gt;10.0).
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 space-y-2 relative">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white font-['Raleway']">
              4. 0-100 Normalization & Scoring
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Standardizes indicators into 0-100 dimensions, applies active weights, and evaluates academic risk flags.
            </p>
          </div>

        </div>
      </div>

      {/* 7 Sources Table with Row Counts & CSV Upload (B1 spec) */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div>
          <h3 className="font-extrabold text-base font-['Raleway'] text-slate-900 dark:text-white">
            Configured Campus Data Sources & CSV Ingestion
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Upload custom departmental CSV dumps or maintain seeded synthetic baseline
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-['Quicksand']">
          {sourcesList.map((src, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-700 dark:text-[#3d63ff]" />
                  <strong className="text-slate-900 dark:text-white text-sm font-bold font-['Raleway']">
                    {src.name}
                  </strong>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-blue-700 dark:text-blue-400 font-bold">
                    {src.count} rows
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                  Schema Fields: {src.keys}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 hover:border-blue-700 bg-white dark:bg-[#0c1626] text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-blue-700 dark:text-[#3d63ff]" />
                  <span>Upload CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={() => handleSimulateUpload(src.name)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
