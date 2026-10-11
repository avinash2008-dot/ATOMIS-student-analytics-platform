import React, { useState, useMemo, useEffect } from 'react';
import { LandingPage, UserAuthSession } from './landing/LandingPage';
import { DashboardLayout, DashboardTab } from './components/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage';
import { TrendsPage } from './pages/TrendsPage';
import { StudentsPage } from './pages/StudentsPage';
import { SegmentsPage } from './pages/SegmentsPage';
import { InsightsPage } from './pages/InsightsPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { DataIntegrationPage } from './pages/DataIntegrationPage';
import { ScoreSettingsPage } from './pages/ScoreSettingsPage';
import { StudentProfileDrawer } from './components/StudentProfileDrawer';
import { ScoreExplainerModal } from './components/ScoreExplainerModal';
import { DemoTourModal } from './components/DemoTourModal';
import { AskAnalystChat } from './components/AskAnalystChat';
import { SignInRequiredModal } from './components/SignInRequiredModal';
import { AtomisLogo } from './components/AtomisLogo';

import {
  getCurrentSession,
  saveCurrentSession,
  clearCurrentSession,
} from './services/authStorage';
import { generateSyntheticDataset } from './data/syntheticDataGenerator';
import { runDataIntegrationPipeline } from './data/dataIntegrationPipeline';
import { DEFAULT_WEIGHTS } from './lib/scoring';
import { ScoreWeights, UnifiedStudent } from './data/studentTypes';

export function App() {
  // Dark mode is the permanent default mode
  const isDarkMode = true;

  // Session loading state (prevents portal flash on mount)
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Persistent authenticated user session (null when in guest read-only mode)
  const [currentUser, setCurrentUser] = useState<UserAuthSession | null>(null);

  // Active view tab (guests can freely browse all tabs)
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [userRole, setUserRole] = useState<'admin' | 'faculty'>('admin');

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<UnifiedStudent | null>(null);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isAskAnalystOpen, setIsAskAnalystOpen] = useState(false);

  // Authentication modal state & pending action continuation
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'register'>('register');
  const [authActionDescription, setAuthActionDescription] = useState('take this action');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [emailResentMessage, setEmailResentMessage] = useState<string | null>(null);

  // Initialize and check session on startup
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      setUserRole(session.role === 'admin' ? 'admin' : 'faculty');
      // If user is already logged in, never show the register / login portal
      if (['/register', '/login', '/admin/login'].includes(window.location.pathname)) {
        try {
          window.history.replaceState(null, '', '/');
        } catch (e) {
          // ignore
        }
      }
    }
    // Brief loading simulation with atom icon to guarantee smooth initialization
    const timer = setTimeout(() => {
      setIsAuthLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  // Check URL pathname for /register and /login on mount and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const session = getCurrentSession();

      // If user is logged in, redirect /register and /login immediately to dashboard
      if (session) {
        if (['/register', '/login', '/admin/login'].includes(path)) {
          try {
            window.history.replaceState(null, '', '/');
          } catch (e) {
            // ignore
          }
          setIsSignInModalOpen(false);
        }
        return;
      }

      if (path === '/login' || path === '/admin/login') {
        setAuthModalInitialView('login');
        setIsSignInModalOpen(true);
      } else if (path === '/register') {
        setAuthModalInitialView('register');
        setIsSignInModalOpen(true);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [currentUser]);

  const openRegister = (desc = 'access full campus workspace') => {
    if (currentUser) return;
    setAuthActionDescription(desc);
    setAuthModalInitialView('register');
    setIsSignInModalOpen(true);
    try {
      window.history.pushState(null, '', '/register');
    } catch (e) {
      // ignore
    }
  };

  const openLogin = (desc = 'access full campus workspace') => {
    if (currentUser) return;
    setAuthActionDescription(desc);
    setAuthModalInitialView('login');
    setIsSignInModalOpen(true);
    try {
      window.history.pushState(null, '', '/login');
    } catch (e) {
      // ignore
    }
  };

  const handleCloseAuthModal = () => {
    setIsSignInModalOpen(false);
    setPendingAction(null);
    if (['/login', '/register', '/admin/login'].includes(window.location.pathname)) {
      try {
        window.history.pushState(null, '', '/');
      } catch (e) {
        // ignore
      }
    }
  };

  // Score weights state (adjustable live in ScoreSettingsPage)
  const [weights, setWeights] = useState<ScoreWeights>(DEFAULT_WEIGHTS);

  // Raw dataset seed & generation
  const [datasetSeed, setDatasetSeed] = useState(2026);
  const rawData = useMemo(() => generateSyntheticDataset(datasetSeed), [datasetSeed]);

  // Integrated unified students & data quality report
  const { students: allStudents, report } = useMemo(
    () => runDataIntegrationPipeline(rawData, weights),
    [rawData, weights]
  );

  // Local state for tracking student intervention status overrides
  const [interventionOverrides, setInterventionOverrides] = useState<
    Record<string, 'Pending' | 'In progress' | 'Done'>
  >({});

  // Always enforce dark mode on root document
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Filter students based on active Department, Year, and Faculty Role scope
  const filteredStudents = useMemo(() => {
    return allStudents
      .map((s) => {
        if (interventionOverrides[s.student_id]) {
          return {
            ...s,
            interventionStatus: interventionOverrides[s.student_id],
          };
        }
        return s;
      })
      .filter((s) => {
        if (userRole === 'faculty') {
          if (selectedDepartment === 'All' && s.department !== 'CSE') return false;
        }

        if (selectedDepartment !== 'All' && s.department !== selectedDepartment) {
          return false;
        }

        if (selectedYear !== 'All' && s.year.toString() !== selectedYear) {
          return false;
        }

        return true;
      });
  }, [allStudents, selectedDepartment, selectedYear, userRole, interventionOverrides]);

  // Update user session and role
  const handleLoginSuccess = (user: UserAuthSession) => {
    setCurrentUser(user);
    saveCurrentSession(user);
    setUserRole(user.role === 'admin' ? 'admin' : 'faculty');
    setIsSignInModalOpen(false);

    // Route to portal for role
    if (user.role === 'student') {
      setCurrentTab('students');
    } else if (user.role === 'teacher') {
      setCurrentTab('interventions');
    } else if (user.role === 'parent') {
      setCurrentTab('students');
    } else {
      setCurrentTab('overview');
    }

    if (['/register', '/login', '/admin/login'].includes(window.location.pathname)) {
      try {
        window.history.replaceState(null, '', '/');
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSignOut = () => {
    clearCurrentSession();
    setCurrentUser(null);
    setIsSignInModalOpen(false);
  };

  // Reusable requireAuth helper: runs action immediately if signed in,
  // or opens the Register modal and resumes after authentication.
  const requireAuth = (action: () => void, description = 'take this action') => {
    if (currentUser) {
      action();
    } else {
      setAuthActionDescription(description);
      setPendingAction(() => action);
      openRegister(description);
    }
  };

  const handleModalSignInSuccess = (user: UserAuthSession) => {
    handleLoginSuccess(user);
    handleCloseAuthModal();
    if (pendingAction) {
      const act = pendingAction;
      setPendingAction(null);
      // Automatically continue the action the user was trying to do
      setTimeout(() => act(), 100);
    }
  };

  // Loading state with Atom icon (never flash register portal to logged in users)
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#070b12] flex flex-col items-center justify-center text-slate-200">
        <div className="relative flex flex-col items-center gap-4">
          <AtomisLogo size="lg" animated={true} withText={false} />
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Initializing Atomis Session...</span>
          </div>
        </div>
      </div>
    );
  }

  // Update intervention status handler (protected)
  const handleUpdateInterventionStatus = (
    studentId: string,
    status: 'Pending' | 'In progress' | 'Done'
  ) => {
    requireAuth(() => {
      setInterventionOverrides((prev) => ({
        ...prev,
        [studentId]: status,
      }));
    }, 'assign and update student intervention status');
  };

  const handleBulkAssignStatus = (status: 'Pending' | 'In progress' | 'Done') => {
    requireAuth(() => {
      const overrides: Record<string, 'Pending' | 'In progress' | 'Done'> = {};
      filteredStudents.forEach((s) => {
        overrides[s.student_id] = status;
      });
      setInterventionOverrides((prev) => ({ ...prev, ...overrides }));
    }, 'bulk assign interventions to this cohort');
  };

  // CSV Export utility (protected)
  const executeExportCsv = () => {
    const headers = [
      'Student ID',
      'Name',
      'Department',
      'Year',
      'Section',
      'CGPA',
      'Attendance %',
      'Success Score',
      'Score Band',
      'Academic Risk Level',
      'Placement Risk Level',
      'Primary Risk Reason',
      'Assigned Segment',
      'Intervention Status',
    ];

    const rows = filteredStudents.map((s) => [
      s.student_id,
      `"${s.name}"`,
      s.department,
      s.year,
      s.section,
      s.cgpa.toFixed(2),
      s.overall_attendance,
      s.successScore,
      s.scoreBand,
      s.academicRisk.level,
      s.placementRisk.level,
      `"${s.primaryRiskReason}"`,
      `"${s.segment}"`,
      s.interventionStatus,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `atomis_student_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCsv = () => {
    requireAuth(executeExportCsv, 'export student records and reports');
  };

  // Toggle user role between Faculty view and Campus Admin view (protected)
  const handleToggleRole = () => {
    requireAuth(() => {
      setUserRole((prev) => (prev === 'admin' ? 'faculty' : 'admin'));
    }, 'switch administrative user role');
  };

  // Re-run synthetic pipeline with fresh seed (protected)
  const handleRegenerateData = () => {
    requireAuth(() => {
      setDatasetSeed((prev) => prev + 1);
      setInterventionOverrides({});
    }, 'refresh and regenerate student telemetry data');
  };

  // Update weights (protected)
  const handleUpdateWeights = (w: ScoreWeights) => {
    requireAuth(() => setWeights(w), 'customize AI score weights');
  };

  const handleResetWeights = () => {
    requireAuth(() => setWeights(DEFAULT_WEIGHTS), 'reset scoring weights');
  };

  // If user is logged in but their email is not verified, show "Verify your email" screen with "Resend email"
  if (currentUser && currentUser.isEmailVerified === false) {
    return (
      <div className="min-h-screen bg-[#070b12] flex flex-col items-center justify-center p-4 text-slate-100 font-['Quicksand']">
        <div className="w-full max-w-md rounded-[32px] backdrop-blur-2xl bg-slate-950/80 border border-white/20 p-8 space-y-5 text-center shadow-[0_16px_50px_rgba(0,0,0,0.7)]">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <AtomisLogo size="md" withText={false} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white font-['Raleway']">
              Verify your email
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              We sent an activation link to <span className="font-bold text-cyan-300">{currentUser.email}</span>.
              Please verify your email address to unlock full access.
            </p>
          </div>

          {emailResentMessage && (
            <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs text-center animate-fadeIn">
              {emailResentMessage}
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setEmailResentMessage(`A fresh activation link has been resent to ${currentUser.email}.`);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-md"
            >
              Resend email
            </button>
            <button
              type="button"
              onClick={() => {
                // Simulate verification confirmation
                const updated = { ...currentUser, isEmailVerified: true };
                handleLoginSuccess(updated);
              }}
              className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-bold text-xs cursor-pointer transition-colors"
            >
              I have verified my email
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline pt-1 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user selected Landing Page tab, render Landing Page with full-screen experience
  if (currentTab === 'landing') {
    return (
      <>
        <LandingPage
          onLoginSuccess={handleLoginSuccess}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onExploreDashboards={() => setCurrentTab('overview')}
          isDarkMode={isDarkMode}
          onOpenLogin={() => openLogin('access campus workspace')}
          onOpenRegister={() => openRegister('create your account')}
        />
        <SignInRequiredModal
          isOpen={isSignInModalOpen}
          initialView={authModalInitialView}
          onClose={handleCloseAuthModal}
          onSuccessSignIn={handleModalSignInSuccess}
          actionDescription={authActionDescription}
        />
      </>
    );
  }

  // Analytics Dashboard (accessible to guests and signed in users)
  return (
    <>
      <DashboardLayout
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenLogin={() => openLogin('access campus workspace')}
        onOpenRegister={() => openRegister('create your account')}
        isDarkMode={isDarkMode}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        onOpenExplainer={() => setIsExplainerOpen(true)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenAskAnalyst={() => setIsAskAnalystOpen(true)}
        onExportCsv={handleExportCsv}
      >
        {currentTab === 'overview' && (
          <OverviewPage
            students={filteredStudents}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onRequireAuth={requireAuth}
          />
        )}

        {currentTab === 'trends' && (
          <TrendsPage
            students={filteredStudents}
            onSelectStudent={(student) => setSelectedStudent(student)}
            selectedDepartment={selectedDepartment}
            selectedYear={selectedYear}
            onRequireAuth={requireAuth}
          />
        )}

        {currentTab === 'students' && (
          <StudentsPage
            students={filteredStudents}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onExportCsv={handleExportCsv}
          />
        )}

        {currentTab === 'segments' && (
          <SegmentsPage
            students={filteredStudents}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        )}

        {currentTab === 'insights' && (
          <InsightsPage
            students={filteredStudents}
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        )}

        {currentTab === 'interventions' && (
          <InterventionsPage
            students={filteredStudents}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onUpdateInterventionStatus={handleUpdateInterventionStatus}
            onBulkAssignStatus={handleBulkAssignStatus}
          />
        )}

        {currentTab === 'integration' && (
          <DataIntegrationPage
            report={report}
            onRegenerateData={handleRegenerateData}
            onRequireAuth={requireAuth}
          />
        )}

        {currentTab === 'settings' && (
          <ScoreSettingsPage
            weights={weights}
            onUpdateWeights={handleUpdateWeights}
            onResetWeights={handleResetWeights}
          />
        )}
      </DashboardLayout>

      {/* 360° Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onUpdateInterventionStatus={handleUpdateInterventionStatus}
      />

      {/* "How the Score Works" Explainer Modal */}
      <ScoreExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        weights={weights}
      />

      {/* 5-Step Guided Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={(tabId) => setCurrentTab(tabId as DashboardTab)}
      />

      {/* Ask the Analyst AI Chat Panel */}
      <AskAnalystChat
        isOpen={isAskAnalystOpen}
        onClose={() => setIsAskAnalystOpen(false)}
        filteredStudents={filteredStudents}
        currentDepartment={selectedDepartment}
        currentYear={selectedYear}
        onRequireAuth={requireAuth}
      />

      {/* Reusable Authentication Modal (Register / Welcome back) */}
      <SignInRequiredModal
        isOpen={isSignInModalOpen}
        onClose={handleCloseAuthModal}
        onSuccessSignIn={handleModalSignInSuccess}
        actionDescription={authActionDescription}
      />
    </>
  );
}

export default App;
