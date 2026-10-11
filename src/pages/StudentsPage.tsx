import React, { useState, useMemo } from 'react';
import { UnifiedStudent, ScoreBand, RiskLevel, StudentSegment } from '../data/studentTypes';
import {
  Search,
  ArrowUpDown,
  Filter,
  Eye,
  AlertTriangle,
  Award,
  Download,
  GraduationCap,
  ArrowLeftRight,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Table,
  Check,
  X,
} from 'lucide-react';
import { StudentComparisonView } from '../components/StudentComparisonView';

interface StudentsPageProps {
  students: UnifiedStudent[];
  onSelectStudent: (student: UnifiedStudent) => void;
  onExportCsv: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  onSelectStudent,
  onExportCsv,
}) => {
  const [pageMode, setPageMode] = useState<'directory' | 'comparison'>('directory');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [selectedBandFilter, setSelectedBandFilter] = useState<string>('All');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState<'successScore' | 'cgpa' | 'attendance' | 'risk'>('risk');
  const [sortAsc, setSortAsc] = useState(false);

  // Toggle selection for comparison
  const handleToggleCompare = (studentId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      }
      if (prev.length >= 2) {
        // Replace second or rotate
        return [prev[1], studentId];
      }
      return [...prev, studentId];
    });
  };

  const handleLaunchComparison = (idA?: string, idB?: string) => {
    if (idA && idB) {
      setCompareIds([idA, idB]);
    }
    setPageMode('comparison');
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.student_id.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());

      const matchRisk =
        selectedRiskFilter === 'All' || s.overallRiskLevel === selectedRiskFilter;

      const matchBand =
        selectedBandFilter === 'All' || s.scoreBand === selectedBandFilter;

      const matchSegment =
        selectedSegmentFilter === 'All' || s.segment === selectedSegmentFilter;

      return matchSearch && matchRisk && matchBand && matchSegment;
    });
  }, [students, search, selectedRiskFilter, selectedBandFilter, selectedSegmentFilter]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortKey === 'successScore') {
        valA = a.successScore;
        valB = b.successScore;
      } else if (sortKey === 'cgpa') {
        valA = a.cgpa;
        valB = b.cgpa;
      } else if (sortKey === 'attendance') {
        valA = a.overall_attendance;
        valB = b.overall_attendance;
      } else if (sortKey === 'risk') {
        valA = a.academicRisk.probability + a.placementRisk.probability;
        valB = b.academicRisk.probability + b.placementRisk.probability;
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [filteredStudents, sortKey, sortAsc]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  // If in comparison mode, render the StudentComparisonView component
  if (pageMode === 'comparison') {
    const studentA = students.find((s) => s.student_id === compareIds[0]) || students[0];
    const studentB = students.find((s) => s.student_id === compareIds[1]) || students[1] || students[0];

    return (
      <StudentComparisonView
        students={students}
        initialStudentA={studentA}
        initialStudentB={studentB}
        onSelectStudentProfile={onSelectStudent}
        onBackToDirectory={() => setPageMode('directory')}
      />
    );
  }

  const selectedStudentsForCompare = students.filter((s) => compareIds.includes(s.student_id));

  return (
    <div className="space-y-6 animate-fadeIn font-['Quicksand']">
      
      {/* Header & Quick Stats & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-['Raleway'] tracking-tight text-slate-900 dark:text-white">
            Unified Student Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Displaying {sortedStudents.length} of {students.length} unified records with 360° diagnostics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <button
              onClick={() => setPageMode('directory')}
              className="px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#3d63ff] text-slate-900 dark:text-white shadow-sm"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Directory</span>
            </button>
            <button
              onClick={() => handleLaunchComparison()}
              className="px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600 dark:text-[#3d63ff]" />
              <span>Comparison Mode</span>
              {compareIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {compareIds.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm hover:border-blue-700 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-blue-700 dark:text-[#3d63ff]" />
            <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Floating / Top Comparison Notification Bar when students are picked */}
      {compareIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-blue-600/10 dark:bg-[#3d63ff]/15 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#3d63ff] text-white flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block">
                {compareIds.length === 1
                  ? '1 Student Selected for Comparison'
                  : '2 Students Ready for Radar Comparison'}
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                {selectedStudentsForCompare.map((s) => s.name).join(' vs ')}
                {compareIds.length === 1 && ' (Pick 1 more student below or open comparison)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCompareIds([])}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[11px] font-bold"
            >
              Clear Selection
            </button>
            <button
              onClick={() => handleLaunchComparison()}
              className="px-4 py-1.5 rounded-lg bg-[#3d63ff] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Radar Comparison</span>
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl glass-panel space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or ID..."
              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/40 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk Only</option>
            <option value="Medium">Medium Risk Only</option>
            <option value="Low">Low / On Track</option>
          </select>

          {/* Score Band Filter */}
          <select
            value={selectedBandFilter}
            onChange={(e) => setSelectedBandFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/40 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
          >
            <option value="All">All Score Bands</option>
            <option value="Thriving">Thriving (80+)</option>
            <option value="On Track">On Track (60-79)</option>
            <option value="Needs Attention">Needs Attention (40-59)</option>
            <option value="Critical">Critical (&lt;40)</option>
          </select>

          {/* Segment Filter */}
          <select
            value={selectedSegmentFilter}
            onChange={(e) => setSelectedSegmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/40 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
          >
            <option value="All">All 5 Segments</option>
            <option value="High academic, low placement">High academic, low placement</option>
            <option value="High potential, low engagement">High potential, low engagement</option>
            <option value="Consistent performers">Consistent performers</option>
            <option value="Placement-ready achievers">Placement-ready achievers</option>
            <option value="Disengaged and at risk">Disengaged and at risk</option>
          </select>

        </div>
      </div>

      {/* Mobile Card List View (< md) */}
      <div className="block md:hidden space-y-3">
        {sortedStudents.length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel text-center text-slate-500 text-xs">
            No students match the active filter criteria. Try clearing search filters.
          </div>
        ) : (
          sortedStudents.map((s) => {
            const isChecked = compareIds.includes(s.student_id);
            return (
              <div
                key={s.student_id}
                onClick={() => onSelectStudent(s)}
                className={`p-4 rounded-2xl glass-panel space-y-3 transition-all cursor-pointer border ${
                  isChecked
                    ? 'border-[#3d63ff] bg-blue-50/40 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {s.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {s.student_id} • {s.department} Y{s.year}
                      </div>
                    </div>
                  </div>

                  {/* Score pill */}
                  <div className="text-right shrink-0">
                    <div className="text-base font-black font-['Raleway'] text-blue-700 dark:text-blue-400">
                      {s.successScore}
                      <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </div>
                    <span
                      className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        s.scoreBand === 'Thriving'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : s.scoreBand === 'On Track'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                          : s.scoreBand === 'Needs Attention'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {s.scoreBand}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">CGPA</span>
                    <span
                      className={`font-bold ${
                        s.cgpa < 6.0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {s.cgpa.toFixed(2)}
                      {s.backlogs > 0 && ` (${s.backlogs} bk)`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Attendance</span>
                    <span
                      className={`font-bold ${
                        s.overall_attendance < 75
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {s.overall_attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Risk Level</span>
                    <span
                      className={`font-bold ${
                        s.overallRiskLevel === 'High'
                          ? 'text-rose-600 dark:text-rose-400'
                          : s.overallRiskLevel === 'Medium'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {s.overallRiskLevel} Risk
                    </span>
                  </div>
                </div>

                {/* Primary Risk / Segment sentence */}
                <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                  <span className="font-semibold text-slate-700 dark:text-slate-400">Diagnosis: </span>
                  <span>{s.primaryRiskReason || s.segment}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(s);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-700 dark:bg-[#3d63ff] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 touch-target cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleToggleCompare(s.student_id, e)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 touch-target cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#3d63ff] border-[#3d63ff] text-white'
                        : 'border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{isChecked ? 'Selected' : 'Compare'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Main Student Records Table (Desktop / Tablet: md+) */}
      <div className="hidden md:block rounded-3xl glass-panel overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-['Quicksand']">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 w-12 text-center" title="Select for side-by-side radar comparison">
                  <ArrowLeftRight className="w-3.5 h-3.5 mx-auto text-slate-400" />
                </th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Dept & Year</th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-700 dark:hover:text-[#3d63ff]" onClick={() => toggleSort('cgpa')}>
                  <div className="flex items-center gap-1">
                    <span>CGPA</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-700 dark:hover:text-[#3d63ff]" onClick={() => toggleSort('attendance')}>
                  <div className="flex items-center gap-1">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-700 dark:hover:text-[#3d63ff]" onClick={() => toggleSort('successScore')}>
                  <div className="flex items-center gap-1">
                    <span>Success Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-700 dark:hover:text-[#3d63ff]" onClick={() => toggleSort('risk')}>
                  <div className="flex items-center gap-1">
                    <span>Risk Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Assigned Segment</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No students match the active filter criteria. Try clearing search filters.
                  </td>
                </tr>
              ) : (
                sortedStudents.map((s) => {
                  const isChecked = compareIds.includes(s.student_id);

                  return (
                    <tr
                      key={s.student_id}
                      onClick={() => onSelectStudent(s)}
                      className={`hover:bg-blue-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Compare Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleCompare(s.student_id, e)}
                          className={`w-6 h-6 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#3d63ff] text-white shadow-sm ring-2 ring-blue-400/40'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-slate-300 dark:border-white/10'
                          }`}
                          title={
                            isChecked
                              ? 'Remove from side-by-side radar comparison'
                              : 'Select for side-by-side radar comparison (up to 2)'
                          }
                        >
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[11px] font-bold">+</span>
                          )}
                        </button>
                      </td>

                      {/* Student Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
                          <div>
                            <strong className="block font-bold text-slate-900 dark:text-white">{s.name}</strong>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{s.student_id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Year */}
                      <td className="py-3 px-4 font-semibold">
                        <span className="text-slate-900 dark:text-slate-100">{s.department}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Year {s.year} • Sec {s.section}</span>
                      </td>

                      {/* CGPA */}
                      <td className="py-3 px-4">
                        <span className={`font-bold ${s.cgpa < 6.0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {s.cgpa.toFixed(2)}
                        </span>
                        {s.backlogs > 0 && (
                          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block">
                            {s.backlogs} backlog{s.backlogs > 1 ? 's' : ''}
                          </span>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-4">
                        <span className={`font-bold ${s.overall_attendance < 75 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                          {s.overall_attendance}%
                        </span>
                      </td>

                      {/* Success Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black font-['Raleway'] text-blue-700 dark:text-blue-400">
                            {s.successScore}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.scoreBand === 'Thriving' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                            s.scoreBand === 'On Track' ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300' :
                            s.scoreBand === 'Needs Attention' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                            'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          }`}>
                            {s.scoreBand}
                          </span>
                        </div>
                      </td>

                      {/* Risk Badge */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.overallRiskLevel === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                            s.overallRiskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                            'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          }`}>
                            {s.overallRiskLevel} Risk
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[140px]" title={s.primaryRiskReason}>
                            {s.primaryRiskReason}
                          </span>
                        </div>
                      </td>

                      {/* Assigned Segment */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate max-w-[150px]" title={s.segment}>
                          {s.segment}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleCompare(s.student_id, e)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isChecked
                                ? 'bg-[#3d63ff] text-white'
                                : 'hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-blue-600 dark:hover:text-[#3d63ff]'
                            }`}
                            title={isChecked ? 'Remove from comparison' : 'Compare with another student'}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudent(s);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-blue-700 dark:text-blue-400 cursor-pointer"
                            title="Open 360° Diagnostic Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
