import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  Award,
  PlusCircle,
  UploadCloud,
  RotateCcw,
  BookOpen,
  ClipboardList,
  Box,
  Sliders,
  UserCheck,
  Palette,
  Atom,
  Bot,
  HeartHandshake,
  School,
  Menu,
  Home
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { STRUCTURE_CATALOG } from '../types/theme';

export type AppTab = 'student' | 'parent' | 'teacher' | 'university' | 'kpmg' | 'interventions' | 'admin';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  show3dScene: boolean;
  setShow3dScene: (show: boolean) => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onOpenSimulatorModal: () => void;
  onOpenPeerMatchModal: () => void;
  onOpenAiCopilotModal: () => void;
  onOpenSlideMenu: () => void;
  onGoToLanding: () => void;
  onResetData: () => void;
  totalStudents: number;
  criticalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  show3dScene,
  setShow3dScene,
  onOpenAddModal,
  onOpenImportModal,
  onOpenSimulatorModal,
  onOpenPeerMatchModal,
  onOpenAiCopilotModal,
  onOpenSlideMenu,
  onGoToLanding,
  onResetData,
  totalStudents,
  criticalCount,
}) => {
  const {
    currentThemeConfig,
    setIsThemeModalOpen,
    structureType,
    setIsStructureModalOpen,
  } = useTheme();

  return (
    <header className="bg-[#03150f]/80 backdrop-blur-2xl border-b border-emerald-500/20 text-white sticky top-0 z-40 shadow-[0_10px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]">
      {/* Top Brand & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 border-b border-white/5 gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Slide Menu */}
            <button
              onClick={onOpenSlideMenu}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-xl transition-all cursor-pointer shadow-md group"
              title="Open Navigation Menu Slide"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] font-black text-xl tracking-wider text-white border border-white/20">
                <Atom className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  ATOMIS • Predict. Support. Succeed.
                </span>
                <span className="text-xs font-bold text-slate-200 bg-white/5 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  Theme: <strong className="text-emerald-300">Emerald Fintech & Growth</strong>
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">
                Student Analytics & Success Platform
              </h1>
            </div>
          </div>

          {/* Quick Triggers & Action Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* 3D Rotating Cubes Landing Button */}
            <button
              onClick={onGoToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-xl transition-all cursor-pointer shadow-md"
              title="Return to 3D Rotating Cubes Landing Page & Login"
            >
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>Landing Page</span>
            </button>
            {/* Ask AI Student Copilot Button */}
            <button
              onClick={onOpenAiCopilotModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_28px_rgba(16,185,129,0.7)] transition-all cursor-pointer border border-emerald-300 group"
              title="Launch AI Student Success Copilot Chat"
            >
              <Bot className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Ask AI Copilot</span>
              <Sparkles className="w-3 h-3 text-emerald-900" />
            </button>

            {/* Theme Chooser Trigger */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl transition-all cursor-pointer shadow-md hover:border-emerald-400/50 group"
              title="Change Theme & Website Colors"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>Theme:</span>
              <span className="text-emerald-300 font-extrabold">{currentThemeConfig.name.split(' ')[0]}</span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/30 ml-0.5 shadow-sm"
                style={{
                  backgroundColor: `#${currentThemeConfig.threeJs.dirLight1.toString(16).padStart(6, '0')}`,
                }}
              />
            </button>

            {/* 3D Scene Toggle Button (Atom Model) */}
            <button
              onClick={() => setShow3dScene(!show3dScene)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border backdrop-blur-xl transition-all cursor-pointer shadow-md ${
                show3dScene
                  ? 'bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Atom className={`w-3.5 h-3.5 ${show3dScene ? 'text-emerald-300 animate-spin' : 'text-emerald-400'}`} />
              <span>{show3dScene ? '3D Atom: ON' : '3D Atom'}</span>
            </button>

            {/* 3D Structure Chooser Trigger */}
            {show3dScene && (
              <button
                onClick={() => setIsStructureModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-xl transition-all cursor-pointer shadow-md"
                title="Choose & Change 3D Spatial Structure"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Structure:</span>
                <span className="text-white font-extrabold">
                  {STRUCTURE_CATALOG.find((s) => s.id === structureType)?.shortName || 'Atom'}
                </span>
              </button>
            )}

            {/* What-If Simulator Trigger */}
            <button
              onClick={onOpenSimulatorModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 backdrop-blur-xl transition-all cursor-pointer shadow-sm"
              title="Predictive What-If Academic Simulator"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>What-If</span>
            </button>

            {/* Peer Mentorship Matchmaker Trigger */}
            <button
              onClick={onOpenPeerMatchModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-xl transition-all cursor-pointer shadow-sm"
              title="AI Peer Tutoring Matchmaker"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Peer Buddy</span>
            </button>

            {/* Enrol Student */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Student</span>
            </button>

            {/* Import Data */}
            <button
              onClick={onOpenImportModal}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 backdrop-blur-xl transition-all cursor-pointer shadow-sm"
              title="Bulk Data Ingestion"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Reset Data */}
            <button
              onClick={onResetData}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-white/10 backdrop-blur-xl transition-all cursor-pointer shadow-sm"
              title="Reset Dataset to Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Menu Bar: Student Login & Parent Login + Roles */}
        <div className="flex overflow-x-auto no-scrollbar py-2.5 gap-1.5 text-xs sm:text-sm">
          {/* 1. Student Login / Portal */}
          <button
            onClick={() => setActiveTab('student')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Student Login & 360° Portal</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-500/30 font-bold">
              Self-Service
            </span>
          </button>

          {/* 2. Parent Login / Portal */}
          <button
            onClick={() => setActiveTab('parent')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'parent'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-teal-400" />
            <span>Parent Login & Guardian Hub</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-teal-950/80 text-teal-300 rounded border border-teal-500/30 font-bold">
              Verified
            </span>
          </button>

          {/* 3. Teacher Dashboard */}
          <button
            onClick={() => setActiveTab('teacher')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Teacher Dashboard ("My Class")</span>
            {criticalCount > 0 && (
              <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-full animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.8)]">
                {criticalCount} Critical
              </span>
            )}
          </button>

          {/* 4. College / Dean Analytics */}
          <button
            onClick={() => setActiveTab('university')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'university'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <School className="w-4 h-4 text-indigo-400" />
            <span>College & Dean Analytics</span>
          </button>

          {/* 5. Institutional Overview Directory */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-slate-300" />
            <span>Cohort Directory</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full text-slate-300 border border-white/10">
              {totalStudents}
            </span>
          </button>

          {/* 6. Placement & Career Hub */}
          <button
            onClick={() => setActiveTab('kpmg')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'kpmg'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-cyan-300" />
            <span>Placement Intelligence</span>
          </button>

          {/* 7. Interventions Board */}
          <button
            onClick={() => setActiveTab('interventions')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'interventions'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-purple-400" />
            <span>Intervention Board</span>
          </button>
        </div>
      </div>
    </header>
  );
};
