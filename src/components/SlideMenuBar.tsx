import React from 'react';
import {
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  School,
  Users,
  Award,
  ClipboardList,
  Sparkles,
  Home,
  X,
  LogOut,
  Palette,
  Atom,
  Bot,
  Sliders,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { AppTab } from './Header';
import { useTheme } from '../context/ThemeContext';

interface SlideMenuBarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isLandingActive: boolean;
  setIsLandingActive: (active: boolean) => void;
  currentUser: { email: string; role: string; name: string } | null;
  onSignOut: () => void;
  onOpenAiCopilot: () => void;
}

export const SlideMenuBar: React.FC<SlideMenuBarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  isLandingActive,
  setIsLandingActive,
  currentUser,
  onSignOut,
  onOpenAiCopilot
}) => {
  const { currentThemeConfig, setIsThemeModalOpen, setIsStructureModalOpen } = useTheme();

  if (!isOpen) return null;

  const handleSelectNav = (tab?: AppTab, toLanding = false) => {
    if (toLanding) {
      setIsLandingActive(true);
    } else if (tab) {
      setIsLandingActive(false);
      setActiveTab(tab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dimmed Glassmorphic Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
      />

      {/* Slide Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm bg-gradient-to-b from-[#031d14]/95 via-slate-950/95 to-[#02110c]/95 border-r border-emerald-500/30 text-white shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.2)] flex flex-col justify-between p-6 overflow-y-auto">
          
          {/* Top Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-white/20">
                  <Atom className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">ATOMIS Platform</h3>
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Predict. Support. Succeed.</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu List */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block px-3 mb-2">
                Portals & Login Navigation
              </span>

              {/* 1. Landing Page with 3D Rotating Cubes */}
              <button
                onClick={() => handleSelectNav(undefined, true)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  isLandingActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Atom className="w-4 h-4 text-emerald-400" />
                  <span>3D Atomis Landing & Portal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* 2. Student Login & Portal */}
              <button
                onClick={() => handleSelectNav('student')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  !isLandingActive && activeTab === 'student'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span>Student Login & 360° Portal</span>
                    <span className="text-[10px] text-emerald-400/80 block font-normal">Self-service academic cockpit</span>
                  </div>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Student
                </span>
              </button>

              {/* 3. Parent Login & Portal */}
              <button
                onClick={() => handleSelectNav('parent')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  !isLandingActive && activeTab === 'parent'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HeartHandshake className="w-4 h-4 text-teal-400" />
                  <div>
                    <span>Parent Login & Guardian Hub</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Attendance alerts & mentor notes</span>
                  </div>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
                  Parent
                </span>
              </button>

              {/* 4. Teacher Login & Dashboard */}
              <button
                onClick={() => handleSelectNav('teacher')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  !isLandingActive && activeTab === 'teacher'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <div>
                    <span>Teacher Login ("My Class")</span>
                    <span className="text-[10px] text-slate-400 block font-normal">Topic difficulty & early-warning</span>
                  </div>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                  Faculty
                </span>
              </button>

              {/* 5. College & Dean Analytics */}
              <button
                onClick={() => handleSelectNav('university')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  !isLandingActive && activeTab === 'university'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <School className="w-4 h-4 text-indigo-400" />
                  <span>College & Dean Analytics</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* 6. Cohort Directory */}
              <button
                onClick={() => handleSelectNav('admin')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  !isLandingActive && activeTab === 'admin'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Cohort Directory</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* 7. Placement Hub */}
              <button
                onClick={() => handleSelectNav('kpmg')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  !isLandingActive && activeTab === 'kpmg'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Placement Intelligence</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* 8. Interventions Board */}
              <button
                onClick={() => handleSelectNav('interventions')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                  !isLandingActive && activeTab === 'interventions'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-rose-400" />
                  <span>Campus Intervention Board</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            {/* Quick Actions in Slide Menu */}
            <div className="pt-4 border-t border-emerald-500/20 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block px-3">
                Quick Tools
              </span>

              <button
                onClick={() => {
                  onClose();
                  onOpenAiCopilot();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Ask AI Student Success Copilot</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    setIsThemeModalOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/5 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Themes</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setIsStructureModalOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3D Structures</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Authenticated User Account Card */}
          <div className="pt-4 border-t border-emerald-500/20">
            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white leading-none">{currentUser.name}</h5>
                      <span className="text-[10px] text-emerald-400 capitalize">{currentUser.role} Account</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</div>
                <button
                  onClick={onSignOut}
                  className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-white/10 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
                <span className="text-xs text-slate-400 block mb-1">Firebase Authentication Active</span>
                <span className="text-[10px] text-cyan-400">Secure Login & Register for Students, Parents & Teachers</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
