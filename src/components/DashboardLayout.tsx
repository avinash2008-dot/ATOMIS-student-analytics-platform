import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  PieChart,
  Lightbulb,
  CheckSquare,
  Database,
  Sliders,
  LogOut,
  Bot,
  HelpCircle,
  Play,
  Moon,
  Sun,
  FileDown,
  Filter,
  ShieldCheck,
  Building2,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  Home,
  Sparkles,
  Menu,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Department, YearLevel } from '../data/studentTypes';
import { UserAuthSession } from '../landing/LandingPage';
import { getDashboardStyles, lightModeTailwindConfig } from '../theme/lightModeTheme';
import { AtomisLogo } from './AtomisLogo';
import { AtomisScrollScene } from './3d/AtomisScrollScene';
import { SplitAtomTransition } from './SplitAtomTransition';

export type DashboardTab =
  | 'landing'
  | 'overview'
  | 'trends'
  | 'students'
  | 'segments'
  | 'insights'
  | 'interventions'
  | 'integration'
  | 'settings';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  currentUser: UserAuthSession | null;
  onSignOut: () => void;
  onOpenSignIn?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;

  // Filters
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedYear: string;
  onYearChange: (yr: string) => void;

  // Role toggle
  userRole: 'faculty' | 'admin';
  onToggleRole: () => void;

  // Modals & Chat
  onOpenExplainer: () => void;
  onOpenDemoTour: () => void;
  onOpenAskAnalyst: () => void;
  onExportCsv: () => void;

  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  onSignOut,
  onOpenSignIn,
  onOpenLogin,
  onOpenRegister,
  isDarkMode = true,
  onToggleDarkMode,
  selectedDepartment,
  onDepartmentChange,
  selectedYear,
  onYearChange,
  userRole,
  onToggleRole,
  onOpenExplainer,
  onOpenDemoTour,
  onOpenAskAnalyst,
  onExportCsv,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardScrollProgress, setDashboardScrollProgress] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on route/tab change
  const handleTabSelect = (tab: DashboardTab) => {
    onTabChange(tab);
    setMobileDrawerOpen(false);
  };

  // Monitor dashboard scroll progress to drive the atom splitting 3D effect
  useEffect(() => {
    const handleScroll = () => {
      let progress = 0;
      const el = mainScrollRef.current;
      if (el && el.scrollHeight > el.clientHeight) {
        progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      }
      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        const winProgress = window.scrollY / winHeight;
        progress = Math.max(progress, winProgress);
      }
      setDashboardScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const target = mainScrollRef.current;
    if (target) {
      target.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (target) {
        target.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home / Welcome', icon: Home },
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'segments', label: 'Student Segments', icon: PieChart },
    { id: 'insights', label: 'Predictive Insights', icon: Lightbulb },
    { id: 'interventions', label: 'Interventions Board', icon: CheckSquare },
    { id: 'integration', label: 'Data Integration', icon: Database },
    { id: 'settings', label: 'Score Settings', icon: Sliders },
  ];

  const theme = getDashboardStyles(isDarkMode);

  return (
    <div className="min-h-screen flex dark bg-[#070b12] text-[#eef3f8] font-sans selection:bg-[#3d63ff] selection:text-white">
      
      {/* ========================================================
          LEFT SIDEBAR NAVIGATION (Desktop: lg+)
         ======================================================== */}
      <aside 
        style={!isDarkMode ? theme.navigation.sidebar : undefined}
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 ${sidebarCollapsed ? 'w-20' : 'w-64'} dash-sidebar bg-white dark:bg-[#0c1626]/90 backdrop-blur-xl border-r border-slate-300 dark:border-white/10 flex-col justify-between p-4 transition-all duration-300 z-30 shadow-xs`}
      >
        
        {/* Brand Header: slides up and fades out smoothly (about 250ms with transform and opacity) while scrolling down */}
        <div className="space-y-6">
          <div 
            className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10 transition-all duration-[250ms] ease-out"
            style={{
              opacity: dashboardScrollProgress > 0.02 ? 0 : 1,
              transform: dashboardScrollProgress > 0.02 ? 'translateY(-16px) scale(0.95)' : 'translateY(0) scale(1)',
              pointerEvents: dashboardScrollProgress > 0.02 ? 'none' : 'auto',
              maxHeight: dashboardScrollProgress > 0.08 ? '0px' : '60px',
              overflow: 'hidden',
            }}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <AtomisLogo
                variant={sidebarCollapsed ? 'icon' : 'horizontal'}
                size={sidebarCollapsed ? 'sm' : 'md'}
                withText={!sidebarCollapsed}
                showTagline={!sidebarCollapsed}
                taglineClassName="hidden sm:block"
                className="shrink-0"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 font-['Quicksand']">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as DashboardTab)}
                  style={!isDarkMode ? (isActive ? theme.navigation.itemActive : theme.navigation.itemInactive) : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'dash-nav-active bg-blue-700 dark:bg-[#3d63ff] text-white shadow-md shadow-blue-700/20 dark:shadow-blue-500/25'
                      : 'dash-nav-inactive text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-700 dark:text-[#3d63ff]'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Card, Role Switcher & Sign Out */}
        <div className="space-y-3 pt-4 border-t border-slate-300 dark:border-white/10 font-['Quicksand']">
          
          {/* Role Toggle Pill (Faculty View vs Admin View - B6) */}
          {!sidebarCollapsed && (
            <div 
              style={!isDarkMode ? theme.navigation.roleSwitcher : undefined}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-400 font-bold">
                <span>Active Scope:</span>
                <span className="text-blue-700 dark:text-blue-400 uppercase font-bold">{userRole}</span>
              </div>
              <button
                type="button"
                onClick={onToggleRole}
                className="w-full py-1.5 px-2 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 hover:border-blue-700 text-[11px] font-bold text-slate-900 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-[#3d63ff]" />
                <span>Switch to {userRole === 'admin' ? 'Faculty View' : 'Campus Admin'}</span>
              </button>
            </div>
          )}

          {/* User Profile Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#3d63ff]/20 text-blue-700 dark:text-[#3d63ff] font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser ? currentUser.name.charAt(0) : 'G'}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate text-xs">
                  <span className="font-bold block truncate text-slate-900 dark:text-white">
                    {currentUser ? currentUser.name : 'Guest Visitor'}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 capitalize block">
                    {currentUser ? currentUser.role : 'Read-only mode'}
                  </span>
                </div>
              )}
            </div>

            {currentUser ? (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : onOpenRegister ? (
              <button
                type="button"
                onClick={onOpenRegister}
                className="text-[11px] font-bold text-cyan-500 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Register Account
              </button>
            ) : null}
          </div>

        </div>

      </aside>

      {/* ========================================================
          MOBILE SLIDE-IN DRAWER NAVIGATION (< lg)
         ======================================================== */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
          {/* Overlay */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 left-0 w-[290px] max-w-[85vw] bg-white dark:bg-[#0c1626] border-r border-slate-300 dark:border-white/10 shadow-2xl flex flex-col justify-between p-4 safe-top safe-bottom z-10 animate-slideRight font-['Quicksand']">
            <div className="space-y-4 overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10">
                <AtomisLogo variant="horizontal" size="sm" withText={true} showTagline={false} />
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 touch-target flex items-center justify-center cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id as DashboardTab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left touch-target ${
                        isActive
                          ? 'dash-nav-active bg-blue-700 dark:bg-[#3d63ff] text-white shadow-md shadow-blue-700/20 dark:shadow-blue-500/25'
                          : 'dash-nav-inactive text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-950'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-700 dark:text-[#3d63ff]'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Action Buttons */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenAskAnalyst?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 font-bold text-xs hover:bg-blue-600/20 transition-colors touch-target"
                >
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Ask Analyst AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenDemoTour?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-colors touch-target"
                >
                  <Play className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Guided Tour</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenExplainer?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-colors touch-target"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>How Score Works</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onExportCsv?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-colors touch-target"
                >
                  <FileDown className="w-4 h-4 text-emerald-400" />
                  <span>Export CSV Records</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer: Role Switcher & User Card */}
            <div className="space-y-3 pt-3 border-t border-slate-300 dark:border-white/10 font-['Quicksand']">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10">
                <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-400 font-bold mb-1.5">
                  <span>Scope:</span>
                  <span className="text-blue-700 dark:text-blue-400 uppercase font-bold">{userRole}</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleRole}
                  className="w-full py-2 px-2 rounded-lg bg-white dark:bg-[#0c1626] border border-slate-300 dark:border-white/10 text-[11px] font-bold text-slate-900 dark:text-slate-200 flex items-center justify-center gap-1.5 touch-target"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-[#3d63ff]" />
                  <span>Switch to {userRole === 'admin' ? 'Faculty' : 'Admin'}</span>
                </button>
              </div>

              {/* User / Sign in state */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#3d63ff]/20 text-blue-700 dark:text-[#3d63ff] font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser ? currentUser.name.charAt(0) : 'G'}
                  </div>
                  <div className="truncate text-xs">
                    <span className="font-bold block truncate text-slate-900 dark:text-white">
                      {currentUser ? currentUser.name : 'Guest Visitor'}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 capitalize block">
                      {currentUser ? currentUser.role : 'Read-only mode'}
                    </span>
                  </div>
                </div>

                {currentUser ? (
                  <button
                    onClick={onSignOut}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer touch-target flex items-center justify-center"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                ) : onOpenRegister ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onOpenRegister();
                    }}
                    className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer py-1.5 px-2"
                  >
                    Register
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MOBILE FILTERS BOTTOM SHEET (< lg)
         ======================================================== */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[#0c1626] border-t border-white/15 rounded-t-3xl p-5 safe-bottom space-y-4 shadow-2xl animate-slideUp font-['Quicksand'] z-10">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm text-white">Filter Cohort</span>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white touch-target flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => onDepartmentChange(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-white/15 bg-slate-900 text-white font-bold text-base sm:text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Departments (CSE, ECE, MECH, CIVIL)</option>
                  <option value="CSE">CSE – Computer Science</option>
                  <option value="ECE">ECE – Electronics</option>
                  <option value="MECH">MECH – Mechanical</option>
                  <option value="CIVIL">CIVIL – Civil Eng</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Academic Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => onYearChange(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-white/15 bg-slate-900 text-white font-bold text-base sm:text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Academic Years (1-4)</option>
                  <option value="1">Year 1 (Freshmen)</option>
                  <option value="2">Year 2 (Sophomores)</option>
                  <option value="3">Year 3 (Pre-Final)</option>
                  <option value="4">Year 4 (Final Year)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-[#3d63ff] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all mt-2 touch-target flex items-center justify-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT AREA & STICKY TOP FILTER BAR (B8 spec)
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Top Bar: Filters, AI triggers, Tour, Dark mode */}
        <header 
          style={!isDarkMode ? theme.headers.topBar : undefined}
          className="sticky top-0 z-20 px-3.5 sm:px-8 py-2.5 sm:py-3.5 backdrop-blur-xl bg-white/95 dark:bg-[#070b12]/80 border-b border-slate-300 dark:border-white/10 transition-colors shadow-xs safe-top"
        >
          {/* Mobile Top Bar (< lg) */}
          <div className="flex lg:hidden items-center justify-between w-full gap-2 font-['Quicksand']">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="p-2 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 touch-target flex items-center justify-center cursor-pointer"
                title="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                <AtomisLogo variant="icon" size="sm" withText={false} />
                <span className="font-extrabold text-sm text-slate-900 dark:text-white capitalize truncate max-w-[120px] sm:max-w-none">
                  {currentTab === 'overview' ? 'Overview' : currentTab === 'students' ? 'Directory' : currentTab}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Filter Sheet trigger */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 touch-target cursor-pointer"
              >
                <Filter className="w-3 h-3 text-blue-700 dark:text-[#3d63ff]" />
                <span className="text-[11px] font-bold">{selectedDepartment === 'All' ? 'Dept' : selectedDepartment}</span>
              </button>

              {/* Ask Analyst button */}
              <button
                type="button"
                onClick={onOpenAskAnalyst}
                className="p-2 rounded-full bg-blue-700 dark:bg-[#3d63ff] text-white shadow-md touch-target flex items-center justify-center cursor-pointer"
                title="Ask Analyst AI"
              >
                <Bot className="w-4 h-4" />
              </button>

              {/* Auth button */}
              {currentUser ? (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              ) : onOpenRegister ? (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-bold text-[11px] shrink-0 touch-target flex items-center justify-center"
                >
                  Register
                </button>
              ) : null}
            </div>
          </div>

          {/* Desktop Top Bar (lg+) */}
          <div className="hidden lg:flex items-center justify-between w-full gap-3">
            {/* Department, Year & Semester Filter Dropdowns */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-['Quicksand']">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-bold mr-1">
                <Filter className="w-3.5 h-3.5 text-blue-700 dark:text-[#3d63ff]" />
                <span>Filters:</span>
              </div>

              {/* Department */}
              <select
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                style={!isDarkMode ? theme.navigation.filterSelect : undefined}
                className="dash-select px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1626] font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
              >
                <option value="All">All Departments (CSE, ECE, MECH, CIVIL)</option>
                <option value="CSE">CSE – Computer Science</option>
                <option value="ECE">ECE – Electronics</option>
                <option value="MECH">MECH – Mechanical</option>
                <option value="CIVIL">CIVIL – Civil Eng</option>
              </select>

              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                style={!isDarkMode ? theme.navigation.filterSelect : undefined}
                className="dash-select px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1626] font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
              >
                <option value="All">All Academic Years (1-4)</option>
                <option value="1">Year 1 (Freshmen)</option>
                <option value="2">Year 2 (Sophomores)</option>
                <option value="3">Year 3 (Pre-Final)</option>
                <option value="4">Year 4 (Final Year)</option>
              </select>
            </div>

            {/* Quick Action Buttons & Auth Status */}
            <div className="flex items-center gap-2">
              {/* Ask the Analyst AI */}
              <button
                onClick={onOpenAskAnalyst}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-700 hover:bg-blue-800 dark:bg-[#3d63ff] dark:hover:bg-[#2f52eb] text-white text-xs font-bold shadow-md shadow-blue-700/20 dark:shadow-blue-500/25 transition-all cursor-pointer hover:scale-105"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Analyst AI</span>
              </button>

              {/* 5-Step Guided Tour (B8) */}
              <button
                onClick={onOpenDemoTour}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-xs font-bold transition-all cursor-pointer text-slate-800 dark:text-slate-200"
                title="Start 5-Step Interactive Guided Presentation Tour"
              >
                <Play className="w-3 h-3 text-blue-700 dark:text-[#3d63ff]" />
                <span>Tour</span>
              </button>

              {/* How Score Works Modal Trigger (B8) */}
              <button
                onClick={onOpenExplainer}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"
                title="How the Success Score Works"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Export CSV (B6) */}
              <button
                onClick={onExportCsv}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"
                title="Export Current Filtered Cohort as CSV"
              >
                <FileDown className="w-4 h-4" />
              </button>

              <div className="h-5 w-px bg-slate-300 dark:border-white/10 mx-1" />

              {/* User Profile or Guest Actions */}
              {currentUser ? (
                <div className="flex items-center gap-2 pl-1">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-600/20 text-blue-400 capitalize font-bold">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="p-1.5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-1">
                  <span className="px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide shrink-0">
                    Guest mode, read-only
                  </span>
                  {/* Login Account button */}
                  <button
                    type="button"
                    onClick={() => (onOpenLogin ? onOpenLogin() : onOpenSignIn?.())}
                    className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Login Account
                  </button>
                  {/* Register Account button */}
                  <button
                    type="button"
                    onClick={() => (onOpenRegister ? onOpenRegister() : onOpenSignIn?.())}
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer hover:scale-105"
                  >
                    Register Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Body Content with Split-Atom Visual Transition Effect on Scroll */}
        <main
          ref={mainScrollRef}
          className="p-4 sm:p-8 flex-1 overflow-x-hidden overflow-y-auto relative min-h-screen pb-28 lg:pb-12"
        >
          {/* Visual Split-Atom Graphic Parting Effect */}
          <SplitAtomTransition scrollProgress={dashboardScrollProgress} />

          {/* 3D WebGL Atom Splitting Particle Canvas */}
          <div
            className="pointer-events-none fixed inset-0 lg:left-64 z-0 opacity-40 dark:opacity-45 transition-opacity"
            aria-hidden="true"
          >
            <AtomisScrollScene scrollProgress={dashboardScrollProgress} />
          </div>

          <div className="relative z-10">
            {children}
          </div>
        </main>

        {/* Compact Mobile Bottom Navigation Tab Bar (< lg) */}
        <nav
          className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-1 safe-bottom flex items-center justify-around font-['Quicksand'] shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
          aria-label="Mobile Navigation"
        >
          {[
            { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
            { id: 'students' as DashboardTab, label: 'Directory', icon: Users },
            { id: 'interventions' as DashboardTab, label: 'Action Board', icon: CheckSquare },
            { id: 'trends' as DashboardTab, label: 'Trends', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-target cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-cyan-500/20' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
              </button>
            );
          })}
          {/* "More" trigger to open the full drawer */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all touch-target cursor-pointer"
          >
            <div className="p-1 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">More</span>
          </button>
        </nav>
      </div>

    </div>
  );
};
