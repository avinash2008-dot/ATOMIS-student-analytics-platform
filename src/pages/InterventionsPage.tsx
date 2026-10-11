import React, { useState } from 'react';
import { UnifiedStudent } from '../data/studentTypes';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface InterventionsPageProps {
  students: UnifiedStudent[];
  onSelectStudent: (student: UnifiedStudent) => void;
  onUpdateInterventionStatus: (studentId: string, status: 'Pending' | 'In progress' | 'Done') => void;
  onBulkAssignStatus: (status: 'Pending' | 'In progress' | 'Done') => void;
}

export const InterventionsPage: React.FC<InterventionsPageProps> = ({
  students,
  onSelectStudent,
  onUpdateInterventionStatus,
  onBulkAssignStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [bulkActionNotice, setBulkActionNotice] = useState<string | null>(null);

  // Focus primarily on at-risk students who need interventions
  const actionRequiredStudents = students.filter(
    (s) => s.overallRiskLevel === 'High' || s.overallRiskLevel === 'Medium'
  );

  const filtered = actionRequiredStudents.filter((s) => {
    if (filterStatus === 'All') return true;
    return s.interventionStatus === filterStatus;
  });

  const pendingCount = actionRequiredStudents.filter((s) => s.interventionStatus === 'Pending').length;
  const inProgressCount = actionRequiredStudents.filter((s) => s.interventionStatus === 'In progress').length;
  const doneCount = actionRequiredStudents.filter((s) => s.interventionStatus === 'Done').length;

  const handleBulkAction = (newStatus: 'Pending' | 'In progress' | 'Done') => {
    onBulkAssignStatus(newStatus);
    setBulkActionNotice(`Successfully updated all ${filtered.length} visible student interventions to "${newStatus}".`);
    setTimeout(() => setBulkActionNotice(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-['Quicksand']">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-slate-900 dark:text-white">
            Academic & Placement Intervention Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tracking personalized remedial plans, mentoring sessions, and bootcamp tracks for {actionRequiredStudents.length} vulnerable students
          </p>
        </div>

        {/* Bulk Action Controls (B6 spec) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBulkAction('In progress')}
            className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer"
          >
            Bulk Set In Progress
          </button>
          <button
            onClick={() => handleBulkAction('Done')}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-[#3d63ff] dark:hover:bg-[#2f52eb] text-white text-xs font-bold shadow-md shadow-blue-700/20 dark:shadow-blue-500/25 transition-all cursor-pointer"
          >
            Bulk Mark Resolved
          </button>
        </div>
      </div>

      {bulkActionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{bulkActionNotice}</span>
        </div>
      )}

      {/* 3 Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-3xl glass-panel space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Pending Action</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-rose-700 dark:text-rose-400">{pendingCount}</div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Immediate attention needed</span>
        </div>

        <div className="p-5 rounded-3xl glass-panel space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>In Progress / Mentoring</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-blue-700 dark:text-blue-400">{inProgressCount}</div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Assigned & active</span>
        </div>

        <div className="p-5 rounded-3xl glass-panel space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Resolved / Target Met</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-black font-['Raleway'] text-emerald-700 dark:text-emerald-400">{doneCount}</div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Verified by faculty</span>
        </div>

      </div>

      {/* Status Filter Tab Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', 'Pending', 'In progress', 'Done'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterStatus === st
                ? 'bg-blue-700 dark:bg-[#3d63ff] text-white shadow-md'
                : 'bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {st} ({st === 'All' ? actionRequiredStudents.length : actionRequiredStudents.filter(s => s.interventionStatus === st).length})
          </button>
        ))}
      </div>

      {/* Interventions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel text-slate-500 text-xs">
            No student interventions found with status "{filterStatus}".
          </div>
        ) : (
          filtered.map((student) => (
            <div
              key={student.student_id}
              className="p-5 rounded-3xl glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg transition-all"
            >
              {/* Student Identification & Vulnerability */}
              <div className="flex items-start gap-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-white/10 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white">
                      {student.name}
                    </strong>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">
                      {student.student_id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      student.overallRiskLevel === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}>
                      {student.overallRiskLevel} Risk
                    </span>
                  </div>

                  <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold">
                    Trigger: {student.primaryRiskReason}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span>{student.department} Year {student.year}</span>
                    <span>•</span>
                    <span>CGPA: {student.cgpa.toFixed(2)}</span>
                    <span>•</span>
                    <span>Attendance: {student.overall_attendance}%</span>
                  </div>
                </div>
              </div>

              {/* Action Plan & Status Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-white/5">
                <div className="max-w-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d63ff] block">
                    Action Plan:
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {student.recommendedIntervention}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={student.interventionStatus}
                    onChange={(e) => onUpdateInterventionStatus(student.student_id, e.target.value as any)}
                    className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none ${
                      student.interventionStatus === 'Done'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : student.interventionStatus === 'In progress'
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                        : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    <option value="Pending">Pending Action</option>
                    <option value="In progress">In Progress</option>
                    <option value="Done">Resolved / Done</option>
                  </select>

                  <button
                    onClick={() => onSelectStudent(student)}
                    className="p-2 rounded-xl text-slate-400 hover:text-[#3d63ff] hover:bg-slate-100 dark:hover:bg-white/5"
                    title="View 360° Profile"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
