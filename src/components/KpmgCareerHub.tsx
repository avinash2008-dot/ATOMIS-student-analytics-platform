import React, { useState } from 'react';
import { Student } from '../types/student';
import {
  Award,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Code2,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface KpmgCareerHubProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const KpmgCareerHub: React.FC<KpmgCareerHubProps> = ({ students, onSelectStudent }) => {
  const [selectedRole, setSelectedRole] = useState<'consultant' | 'cloud' | 'data' | 'risk'>('consultant');

  const roleDefinitions = {
    consultant: {
      title: "Technology Consulting Analyst",
      team: "Digital Transformation & Strategy",
      minCgpa: 7.0,
      maxBacklogs: 0,
      minByteXl: 70,
      description: "Applies modern software development and cloud capabilities to drive core modernization for Fortune 500 enterprises.",
      coreSkills: ["Full-Stack Architecture", "Data Structures & Algorithms", "SQL & Database Design", "Client Communication"]
    },
    cloud: {
      title: "Cloud & Infrastructure Engineer",
      team: "Cloud Engineering & DevOps",
      minCgpa: 6.8,
      maxBacklogs: 0,
      minByteXl: 75,
      description: "Designs enterprise cloud-native infrastructure, automated CI/CD pipelines, and microservices resilience.",
      coreSkills: ["Containerization (Docker/K8s)", "Linux Systems & Networking", "Cloud Security", "API Engineering"]
    },
    data: {
      title: "Data & AI Specialist",
      team: "Lighthouse (Data, Analytics & AI)",
      minCgpa: 7.2,
      maxBacklogs: 0,
      minByteXl: 75,
      description: "Builds production machine learning, predictive analytics, and automated decision engines for KPMG clients.",
      coreSkills: ["Python / PySpark", "SQL & Data Warehousing", "Applied Machine Learning", "Business Analytics"]
    },
    risk: {
      title: "Technology Risk Consultant",
      team: "Governance, Risk & Compliance",
      minCgpa: 6.5,
      maxBacklogs: 0,
      minByteXl: 60,
      description: "Assesses cyber threat vulnerabilities, internal IT controls, and AI ethics frameworks for global institutions.",
      coreSkills: ["Cyber Security Foundations", "IT Audit & Compliance", "Analytical Problem Solving", "Risk Quantification"]
    }
  };

  const currentRole = roleDefinitions[selectedRole];

  // Compute eligibility against selected role
  const evaluatedStudents = students.map(s => {
    const isCgpaFit = s.cgpa >= currentRole.minCgpa;
    const isBacklogFit = s.activeBacklogs <= currentRole.maxBacklogs;
    const isSkillFit = s.codingProfile.byteXlScore >= currentRole.minByteXl;
    const isAttendanceFit = s.overallAttendance >= 75;

    let fitStatus: 'Ready' | 'Potential (Minor Gap)' | 'Critical Barrier' = 'Critical Barrier';
    if (isCgpaFit && isBacklogFit && isSkillFit && isAttendanceFit) {
      fitStatus = 'Ready';
    } else if (isBacklogFit && (s.cgpa >= currentRole.minCgpa - 0.5)) {
      fitStatus = 'Potential (Minor Gap)';
    }

    return {
      student: s,
      fitStatus,
      isCgpaFit,
      isBacklogFit,
      isSkillFit,
      isAttendanceFit
    };
  });

  const readyCount = evaluatedStudents.filter(e => e.fitStatus === 'Ready').length;
  const potentialCount = evaluatedStudents.filter(e => e.fitStatus === 'Potential (Minor Gap)').length;
  const barrierCount = evaluatedStudents.filter(e => e.fitStatus === 'Critical Barrier').length;

  return (
    <div className="space-y-4">
      {/* KPMG Corporate Partnership Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                KPMG in India
              </span>
              <span className="text-xs text-slate-400">Campus Talent Pipeline</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Career Intelligence Track
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Corporate Recruitment & Placement Success Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Grounded in KPMG’s actual engineering and consulting competencies. Real-time eligibility audits identify high-potential candidates and prescribe precise skill acceleration tracks before campus recruitment commences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-xs text-slate-400 uppercase font-semibold">Drive Ready</div>
              <div className="text-2xl font-black text-emerald-400">{readyCount}</div>
              <div className="text-[10px] text-slate-500">Students</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-xs text-slate-400 uppercase font-semibold">Upskill Gap</div>
              <div className="text-2xl font-black text-amber-400">{potentialCount}</div>
              <div className="text-[10px] text-slate-500">Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Role Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {(Object.keys(roleDefinitions) as Array<keyof typeof roleDefinitions>).map(roleKey => {
          const role = roleDefinitions[roleKey];
          const isSelected = selectedRole === roleKey;
          return (
            <button
              key={roleKey}
              onClick={() => setSelectedRole(roleKey)}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-950/80 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">{role.team}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <div className="font-bold text-sm text-white">{role.title}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Min CGPA: <strong>{role.minCgpa}</strong> • Coding: <strong>{role.minByteXl}+</strong>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Role Benchmark Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Role Benchmark Requirements: {currentRole.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentRole.description}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {currentRole.coreSkills.map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Candidate Evaluation Roster */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase font-semibold text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">CGPA Fit</th>
                <th className="py-2.5 px-3">Backlog Status</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Coding Benchmark</th>
                <th className="py-2.5 px-3">KPMG Verdict</th>
                <th className="py-2.5 px-3 text-right">360° AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {evaluatedStudents.map(({ student, fitStatus, isCgpaFit, isBacklogFit, isSkillFit, isAttendanceFit }) => (
                <tr key={student.id} className="hover:bg-slate-850 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img src={student.avatar} alt={student.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.rollNo} • {student.department}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`font-semibold ${isCgpaFit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {student.cgpa.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Cutoff: {currentRole.minCgpa}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`font-semibold ${isBacklogFit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {student.activeBacklogs} Active
                    </span>
                    <span className="text-[10px] text-slate-500 block">Req: 0 backlogs</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`font-semibold ${isAttendanceFit ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {student.overallAttendance}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Req: &gt;=75%</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`font-semibold ${isSkillFit ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {student.codingProfile.byteXlScore}/100
                    </span>
                    <span className="text-[10px] text-slate-500 block">Benchmark: {currentRole.minByteXl}+</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      fitStatus === 'Ready' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      fitStatus === 'Potential (Minor Gap)' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {fitStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      Audit & Remediate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
