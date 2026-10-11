import React, { useState } from 'react';
import { Student, Intervention } from '../types/student';
import { api } from '../services/api';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertOctagon,
  UserCheck,
  Calendar,
  ArrowRight,
  Filter
} from 'lucide-react';

interface InterventionBoardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onRefreshData: () => void;
}

export const InterventionBoardView: React.FC<InterventionBoardViewProps> = ({
  students,
  onSelectStudent,
  onRefreshData,
}) => {
  // Extract all interventions from students
  const allInterventions = students.flatMap(s =>
    s.interventions.map(i => ({
      ...i,
      studentName: s.name,
      studentRoll: s.rollNo,
      department: s.department,
      avatar: s.avatar,
      riskLevel: s.riskLevel,
      fullStudent: s
    }))
  );

  const [filterType, setFilterType] = useState<string>('All');

  const filtered = allInterventions.filter(i => {
    if (filterType !== 'All' && i.type !== filterType) return false;
    return true;
  });

  const columns: Array<{ status: Intervention['status']; title: string; color: string; bg: string }> = [
    { status: 'Open', title: 'Open / Pending Action', color: 'text-amber-400', bg: 'border-amber-900/60' },
    { status: 'In Progress', title: 'Active Remediation', color: 'text-cyan-400', bg: 'border-cyan-900/60' },
    { status: 'Escalated', title: 'Escalated to Dean/Parent', color: 'text-rose-400', bg: 'border-rose-900/60' },
    { status: 'Resolved', title: 'Successfully Resolved', color: 'text-emerald-400', bg: 'border-emerald-900/60' }
  ];

  const handleUpdateStatus = async (id: string, newStatus: Intervention['status']) => {
    try {
      await api.updateInterventionStatus(id, newStatus);
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Board Header & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-400" />
            Institutional Academic & Attendance Intervention Board
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of mentoring interventions, remedial class compliance, and parent escalations across departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter by Type:</span>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-white"
          >
            <option value="All">All Types</option>
            <option value="Academic Tutoring">Academic Tutoring</option>
            <option value="Attendance Counseling">Attendance Counseling</option>
            <option value="Parent Notification">Parent Notification</option>
            <option value="Placement Mentorship">Placement Mentorship</option>
          </select>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colItems = filtered.filter(item => item.status === col.status);
          return (
            <div
              key={col.status}
              className={`bg-slate-900/90 border ${col.bg} rounded-xl p-3 flex flex-col min-h-[500px] shadow-sm`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-bold">
                  {colItems.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 italic">
                    No cases in this status.
                  </div>
                ) : (
                  colItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-850 text-indigo-300 border border-slate-700">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.date}</span>
                      </div>

                      <div
                        onClick={() => onSelectStudent(item.fullStudent)}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <img
                          src={item.avatar}
                          alt={item.studentName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.studentRoll} • {item.department}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/80 p-2 rounded">
                        {item.notes}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-850">
                        <span>Mentor: {item.mentorName}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{item.followUpDate}</span>
                        </div>
                      </div>

                      {/* Quick Move Action */}
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Move to:</span>
                        <select
                          value={item.status}
                          onChange={e => handleUpdateStatus(item.id, e.target.value as any)}
                          className="bg-slate-850 border border-slate-700 text-[10px] rounded px-1.5 py-0.5 text-slate-200"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Escalated">Escalated</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
