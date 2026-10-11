import React from 'react';
import { Student, RiskLevel, PlacementEligibility } from '../types/student';
import {
  Search,
  Sparkles,
  Sliders,
  FileSearch,
  ShieldAlert,
  Trash2,
  Code2
} from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenSimulatorForStudent?: (student: Student) => void;
  onOpenResumeAuditForStudent?: (student: Student) => void;
  onOpenAlertForStudent?: (student: Student) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedRisk: string;
  setSelectedRisk: (risk: string) => void;
  selectedPlacement: string;
  setSelectedPlacement: (placement: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onSelectStudent,
  onDeleteStudent,
  onOpenSimulatorForStudent,
  onOpenResumeAuditForStudent,
  onOpenAlertForStudent,
  selectedDepartment,
  setSelectedDepartment,
  selectedRisk,
  setSelectedRisk,
  selectedPlacement,
  setSelectedPlacement,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
}) => {
  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800 shadow-sm shadow-rose-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Critical ({score})
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Moderate ({score})
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Low Risk ({score})
          </span>
        );
      case 'Exemplary':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Exemplary ({score})
          </span>
        );
    }
  };

  const getPlacementBadge = (status: PlacementEligibility) => {
    switch (status) {
      case 'Eligible':
        return (
          <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded shadow-sm">
            Eligible (Tier-1)
          </span>
        );
      case 'Borderline':
        return (
          <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
            Borderline
          </span>
        );
      case 'Ineligible':
        return (
          <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded">
            Ineligible
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-950/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl">
      {/* Controls Bar: Filters & Search */}
      <div className="p-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/[0.02] backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-inner"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="bg-slate-900/90 border border-white/10 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="Electronics & Comm">Electronics & Comm</option>
          </select>

          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="bg-slate-900/90 border border-white/10 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Risk Tiers</option>
            <option value="Critical">Critical Risk (&gt;70)</option>
            <option value="Moderate">Moderate Risk (40-70)</option>
            <option value="Low">Low Risk (20-40)</option>
            <option value="Exemplary">Exemplary (&lt;20)</option>
          </select>

          <select
            value={selectedPlacement}
            onChange={e => setSelectedPlacement(e.target.value)}
            className="bg-slate-900/90 border border-white/10 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Placement Status</option>
            <option value="Eligible">KPMG Eligible</option>
            <option value="Borderline">Borderline</option>
            <option value="Ineligible">Ineligible</option>
          </select>

          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="bg-slate-900/90 border border-white/10 text-xs rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="risk_desc">Sort: Highest Risk First</option>
            <option value="risk_asc">Sort: Lowest Risk First</option>
            <option value="cgpa_desc">Sort: Highest CGPA</option>
            <option value="attendance_asc">Sort: Lowest Attendance</option>
            <option value="bytexl_desc">Sort: Technical Coding Score</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Student Profile</th>
              <th className="py-3 px-4">Department & Year</th>
              <th className="py-3 px-4">CGPA & Backlogs</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Technical Coding Index</th>
              <th className="py-3 px-4">KPMG Placement</th>
              <th className="py-3 px-4">Risk Diagnostic</th>
              <th className="py-3 px-4 text-right">Actions & AI Tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No students found matching current filters.
                </td>
              </tr>
            ) : (
              students.map(student => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                  onClick={() => onSelectStudent(student)}
                >
                  {/* Name and Roll */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{student.rollNo}</div>
                      </div>
                    </div>
                  </td>

                  {/* Department & Year */}
                  <td className="py-3 px-4">
                    <div className="text-white font-medium">{student.department}</div>
                    <div className="text-[10px] text-slate-400">
                      Year {student.year} • Sem {student.semester} (Sec {student.section})
                    </div>
                  </td>

                  {/* CGPA & Backlogs */}
                  <td className="py-3 px-4">
                    <div className="font-black text-white text-xs">
                      {student.cgpa.toFixed(2)} CGPA
                    </div>
                    <div>
                      {student.activeBacklogs > 0 ? (
                        <span className="text-[11px] font-bold text-rose-400">
                          {student.activeBacklogs} Active Backlog(s)
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-400">0 Backlogs</span>
                      )}
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${student.overallAttendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {student.overallAttendance}%
                      </span>
                      {student.recentAbsenceStreak >= 3 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800">
                          {student.recentAbsenceStreak}d streak
                        </span>
                      )}
                    </div>
                    <div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full ${student.overallAttendance >= 75 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, student.overallAttendance)}%` }}
                      />
                    </div>
                  </td>

                  {/* Technical Coding Benchmark */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-bold text-indigo-300">
                        {student.codingProfile.byteXlScore}/100
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {student.codingProfile.problemsSolved} Solved • DSA: {student.codingProfile.dsaProficiency}%
                    </div>
                  </td>

                  {/* KPMG Status */}
                  <td className="py-3 px-4">
                    {getPlacementBadge(student.placementEligibility)}
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Score: {student.kpmgReadinessScore}/100
                    </div>
                  </td>

                  {/* Risk Badge */}
                  <td className="py-3 px-4">
                    {getRiskBadge(student.riskLevel, student.riskScore)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {/* 360 AI */}
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-sm cursor-pointer"
                        title="Open AI 360 Diagnostic Cockpit"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>360°</span>
                      </button>

                      {/* What-If Simulator */}
                      {onOpenSimulatorForStudent && (
                        <button
                          onClick={() => onOpenSimulatorForStudent(student)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-950 text-purple-300 border border-slate-700/80 transition-colors cursor-pointer"
                          title="Run What-If Scenario Forecaster"
                        >
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                      )}

                      {/* Resume Auditor */}
                      {onOpenResumeAuditForStudent && (
                        <button
                          onClick={() => onOpenResumeAuditForStudent(student)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-cyan-300 border border-slate-700/80 transition-colors cursor-pointer"
                          title="Audit Resume for KPMG"
                        >
                          <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                      )}

                      {/* Alert Dispatcher */}
                      {onOpenAlertForStudent && (
                        <button
                          onClick={() => onOpenAlertForStudent(student)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700/80 transition-colors cursor-pointer"
                          title="Dispatch Urgent WhatsApp/SMS Alert"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-1.5 rounded-lg bg-slate-850 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
