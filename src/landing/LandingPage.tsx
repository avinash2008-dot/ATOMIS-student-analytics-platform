import React, { useState, useEffect, useRef } from 'react';
import { AtomScrollScene } from './AtomScrollScene';
import { RegisterAccountPage } from '../components/auth/RegisterAccountPage';
import { LoginAccountPage } from '../components/auth/LoginAccountPage';
import { AtomisLogo } from '../components/AtomisLogo';
import {
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Database,
  LineChart,
  ShieldAlert,
  UserCheck,
  Send,
  Building,
  Check,
  X,
  Menu
} from 'lucide-react';
import { UserAuthSession } from '../services/authStorage';
export type { UserAuthSession };

interface LandingPageProps {
  onLoginSuccess: (user: UserAuthSession) => void;
  currentUser?: UserAuthSession | null;
  onSignOut?: () => void;
  onExploreDashboards?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginSuccess,
  currentUser = null,
  onSignOut,
  onExploreDashboards,
  isDarkMode = true,
  onToggleDarkMode,
  onOpenLogin,
  onOpenRegister,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const loginPortalRef = useRef<HTMLDivElement>(null);

  // Sync window scroll to 0..1 with responsive progress so it easily splits
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight || 800;
      // Ambient 3D particle split progress as user scrolls
      const scrollAnimHeight = viewportH * 1.2;
      const progress = Math.min(1, Math.max(0, scrollY / scrollAnimHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openRegisterModal = () => {
    if (onOpenRegister) {
      onOpenRegister();
      return;
    }
    setAuthModalMode('register');
    if (window.scrollY > 350) {
      setAuthModalOpen(true);
    } else if (loginPortalRef.current) {
      loginPortalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      loginPortalRef.current.classList.add('ring-4', 'ring-cyan-400');
      setTimeout(() => {
        loginPortalRef.current?.classList.remove('ring-4', 'ring-cyan-400');
      }, 1500);
    } else {
      setAuthModalOpen(true);
    }
  };

  const openLoginModal = () => {
    if (onOpenLogin) {
      onOpenLogin();
      return;
    }
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Right edge subtle scroll indicator
  const showProgressBar = scrollProgress > 0.05 && scrollProgress < 0.98;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 3000);
  };

  return (
    <div className="relative min-h-screen dark bg-[#070b12] text-[#eef3f8] font-sans overflow-x-hidden selection:bg-[#3d63ff] selection:text-white">
      
      {/* Scroll-driven 3D Atoms Canvas (Fixed background on the scroll section) */}
      <AtomScrollScene scrollProgress={scrollProgress} />

      {/* Right Edge Vertical Progress Bar (Active only during 3D scroll section) */}
      <div 
        className={`fixed right-0 top-0 w-1 sm:w-1.5 h-full z-40 pointer-events-none bg-black/10 dark:bg-white/5 transition-opacity duration-300 ${
          showProgressBar ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <i
          className="block w-full bg-[#3d63ff] transition-[height] duration-75 shadow-[0_0_12px_#3d63ff]"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ========================================================
          A1. CENTERED TOP NAVIGATION
          (NO slide menu bar - strictly protected login)
         ======================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-12 py-3.5 flex items-center justify-between backdrop-blur-xl bg-white/85 dark:bg-[#070b12]/80 border-b border-slate-200/80 dark:border-white/10 transition-colors safe-top">
        
        {/* Brand Logo: Horizontal variant in Nav */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <AtomisLogo variant="horizontal" size="md" withText={true} showTagline={true} />
        </div>

        {/* Centered Nav: Home, Dashboards, About Us, Contact Us */}
        <nav className="hidden md:flex items-center gap-7 font-semibold text-[15px] font-['Quicksand']">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-blue-700 dark:text-blue-400 font-bold hover:opacity-80 transition-opacity cursor-pointer"
          >
            Home
          </a>
          {onExploreDashboards && (
            <button
              type="button"
              onClick={onExploreDashboards}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer text-slate-700 dark:text-slate-300 font-medium"
            >
              Dashboards & Analytics
            </button>
          )}
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about-section');
            }}
            className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer text-slate-700 dark:text-slate-300 font-medium"
          >
            About Us
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact-section');
            }}
            className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer text-slate-700 dark:text-slate-300 font-medium"
          >
            Contact Us
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold block text-slate-900 dark:text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-blue-400 capitalize block font-semibold">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              {onExploreDashboards && (
                <button
                  type="button"
                  onClick={onExploreDashboards}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all cursor-pointer hidden sm:inline-block"
                >
                  Dashboard
                </button>
              )}
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-3 py-1.5 text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-full transition-colors cursor-pointer hidden sm:inline-block"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide hidden sm:inline-block">
                Guest mode, read-only
              </span>
              {/* Login Account button */}
              <button
                type="button"
                onClick={openLoginModal}
                className="hidden sm:inline-block px-3.5 py-1.5 text-xs sm:text-sm font-bold text-slate-200 border border-white/20 rounded-full hover:bg-white/10 transition-all cursor-pointer"
              >
                Login Account
              </button>
              {/* Register Account button */}
              <button
                type="button"
                onClick={openRegisterModal}
                className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-600 rounded-full shadow-md shadow-cyan-500/25 transition-all cursor-pointer hover:scale-105"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle (< md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 touch-target flex items-center justify-center cursor-pointer ml-1"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Landing Slide-out Drawer (< md) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 w-[280px] max-w-[85vw] bg-[#070b12] border-l border-white/15 p-5 flex flex-col justify-between safe-top safe-bottom z-10 font-['Quicksand'] shadow-2xl animate-slideLeft">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <AtomisLogo variant="horizontal" size="sm" withText={true} showTagline={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white touch-target flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-2 font-semibold text-sm">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl text-blue-400 hover:bg-white/5"
                >
                  Home
                </a>
                {onExploreDashboards && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onExploreDashboards();
                    }}
                    className="p-2.5 rounded-xl text-left text-slate-200 hover:bg-white/5 font-semibold"
                  >
                    Dashboards & Analytics
                  </button>
                )}
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    scrollToSection('about-section');
                  }}
                  className="p-2.5 rounded-xl text-slate-200 hover:bg-white/5"
                >
                  About Us
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    scrollToSection('contact-section');
                  }}
                  className="p-2.5 rounded-xl text-slate-200 hover:bg-white/5"
                >
                  Contact Us
                </a>
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{currentUser.name}</div>
                      <div className="text-[10px] text-blue-400 capitalize">{currentUser.role}</div>
                    </div>
                  </div>
                  {onSignOut && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full py-2.5 rounded-xl bg-rose-500/20 text-rose-300 font-bold text-xs touch-target flex items-center justify-center"
                    >
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal();
                    }}
                    className="w-full py-3 rounded-2xl border border-white/20 text-white font-bold text-xs touch-target flex items-center justify-center"
                  >
                    Login Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openRegisterModal();
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-bold text-xs shadow-md touch-target flex items-center justify-center"
                  >
                    Register Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          A2. HERO SECTION (Full Viewport Height)
         ======================================================== */}
      <section id="home" className="relative z-10 min-h-screen pt-24 pb-12 px-4 sm:px-12 max-w-7xl mx-auto flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center py-6 sm:py-8">
          
          {/* Left Column: Headline, subtext, two pill buttons */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-3 flex-wrap">
              <AtomisLogo size="md" animated={true} withText={false} />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-700 dark:bg-[#3d63ff] animate-ping" />
                <span>Predict. Support. Succeed. • Student Analytics & Success Platform</span>
              </div>
            </div>

            <h1 
              className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.12] text-slate-900 dark:text-white font-calisto"
              style={{ fontFamily: "'Calisto MT', 'Calisto', 'Book Antiqua', 'Palatino Linotype', Palatino, Georgia, serif" }}
            >
              Turn Student Data into Student Success
            </h1>

            <p className="text-sm sm:text-lg text-slate-700 dark:text-slate-300 font-['Quicksand'] font-medium leading-relaxed max-w-xl">
              Track performance, predict risk early and guide every learner with insights, securely hosted on your campus.
            </p>

            {/* Two Pill Buttons: Stacked full-width on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full">
              {/* Primary button: explore dashboards in guest/auth mode */}
              <button
                onClick={onExploreDashboards ? onExploreDashboards : openRegisterModal}
                className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-full bg-blue-700 hover:bg-blue-800 dark:bg-[#3d63ff] dark:hover:bg-[#2f52eb] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-700/25 dark:shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-2 hover:scale-105 touch-target"
              >
                <span>Explore Dashboards</span>
                <span className="text-lg">›</span>
              </button>

              {/* Ghost / outlined button */}
              <button
                onClick={() => scrollToSection('about-section')}
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-blue-700 dark:hover:border-[#3d63ff] text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 touch-target"
              >
                <span>Discover more</span>
                <span className="text-lg">›</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-700 dark:text-slate-300 font-semibold font-['Quicksand']">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                <span>300+ Unified Profiles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                <span>Transparent Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                <span>On-Premises Privacy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Secure Campus Access Portal */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">

            {/* Campus Identity & Access Portal Card */}
            <div 
              ref={loginPortalRef}
              className="w-full"
            >
              {authModalMode === 'login' ? (
                <LoginAccountPage
                  onSuccess={onLoginSuccess}
                  onNavigateToRegister={() => setAuthModalMode('register')}
                />
              ) : (
                <RegisterAccountPage
                  onSuccess={onLoginSuccess}
                  onNavigateToLogin={() => setAuthModalMode('login')}
                />
              )}
            </div>

          </div>

        </div>

        {/* Small chevron at bottom center that bobs up and down (A2) */}
        <div className="pt-6 text-center animate-bob cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}>
          <ChevronDown className="w-7 h-7 mx-auto text-blue-700 dark:text-[#3d63ff] opacity-80" />
        </div>

      </section>

      {/* ========================================================
          A3. 3D SCROLL ANIMATION SECTION
          Smooth ambient 3D particle transition in background
         ======================================================== */}
      <div className="relative">
        {/* Scroller Spacer for ambient 3D particle split transition */}
        <div id="scroller" className="h-[80vh] pointer-events-none" />
      </div>

      {/* ========================================================
          A4. AFTER ANIMATION SECTIONS: ABOUT US, STATS, CONTACT US
         ======================================================== */}
      <div id="about-section" className="relative z-20 bg-white/95 dark:bg-[#070b12]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 pt-20 pb-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* About Us Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
              About Atomis
            </span>
            <h2 
              className="text-3xl sm:text-5xl font-bold font-calisto tracking-tight text-slate-900 dark:text-white"
              style={{ fontFamily: "'Calisto MT', 'Calisto', 'Book Antiqua', 'Palatino Linotype', Palatino, Georgia, serif" }}
            >
              A Complete Intelligence Engine for Higher Education
            </h2>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-['Quicksand'] font-medium">
              Atomis unifies fractured campus databases into an explainable, early-intervention student success cockpit that faculty and deans love using.
            </p>
          </div>

          {/* Four Glass Feature Cards (A4 spec) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Performance Analytics */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-700 dark:text-blue-400">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg font-['Raleway'] text-slate-900 dark:text-white">
                Performance Analytics
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-['Quicksand'] leading-relaxed font-medium">
                Unified academic metrics across CGPA, internal exam marks, and multi-semester backlog tracking.
              </p>
            </div>

            {/* Card 2: Early Risk Alerts */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg font-['Raleway'] text-slate-900 dark:text-white">
                Early Risk Alerts
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-['Quicksand'] leading-relaxed font-medium">
                Bi-factor academic and placement dropout probability scoring with plain-English explanation of root causes.
              </p>
            </div>

            {/* Card 3: Personal Success Plans */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg font-['Raleway'] text-slate-900 dark:text-white">
                Personal Success Plans
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-['Quicksand'] leading-relaxed font-medium">
                Custom intervention tracks, remedial coaching assignments, and parent sync alerts tied to learner needs.
              </p>
            </div>

            {/* Card 4: Private by Design / On-Premises */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg font-['Raleway'] text-slate-900 dark:text-white">
                Private by Design
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-['Quicksand'] leading-relaxed font-medium">
                Zero external telemetry, FERPA compliant, securely hosted inside your university infrastructure.
              </p>
            </div>
          </div>

          {/* Stats Strip (4 Numbers - A4 spec) */}
          <div className="rounded-3xl p-8 glass-panel bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-indigo-500/10 border border-blue-600/20 dark:border-[#3d63ff]/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-blue-700 dark:text-blue-400 font-['Raleway']">
                  +18.4%
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-['Quicksand']">
                  Retention Uplift
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-blue-700 dark:text-blue-400 font-['Raleway']">
                  3.2x
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-['Quicksand']">
                  Faster Intervention
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-blue-700 dark:text-blue-400 font-['Raleway']">
                  45+
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-['Quicksand']">
                  Report Templates
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-blue-700 dark:text-blue-400 font-['Raleway']">
                  24/7
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-['Quicksand']">
                  Campus Telemetry Access
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us Section: Demo-request form (name, email, message) & Footer (A4 spec) */}
          <div id="contact-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                Contact Us
              </span>
              <h2 
                className="text-3xl sm:text-4xl font-bold font-calisto tracking-tight text-slate-900 dark:text-white"
                style={{ fontFamily: "'Calisto MT', 'Calisto', 'Book Antiqua', 'Palatino Linotype', Palatino, Georgia, serif" }}
              >
                Request an On-Campus Pilot Consultation
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-['Quicksand'] leading-relaxed">
                Connect your college ERP, attendance biometric machines, and LMS database within 48 hours. Let us show your academic council the power of Atomis.
              </p>
              
              <div className="pt-4 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <p>📍 <strong className="text-slate-900 dark:text-white">Institutional Headquarters:</strong> Tech Innovation Park, Tower B</p>
                <p>📧 <strong className="text-slate-900 dark:text-white">Direct Inquiries:</strong> campus-partnerships@atomis.edu</p>
                <p>📞 <strong className="text-slate-900 dark:text-white">Academic Advisory Desk:</strong> +1 (800) 450-ATOMIS</p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-lg space-y-4">
                <h3 className="font-extrabold text-lg font-['Raleway'] text-slate-900 dark:text-white">
                  Schedule Campus Pilot
                </h3>

                {contactSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <span>Thank you! Your pilot request has been received. Our higher-ed specialist will reach out within 2 hours.</span>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-['Quicksand']">
                    <div>
                      <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                        Full Name & Title
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Dr. Samantha Vance, Dean of Academics"
                        required
                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                        Institution Email
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="svance@university.edu"
                        required
                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                        Message / Student Enrollment Size
                      </label>
                      <textarea
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="We have 4,500 students across Engineering and Management and want to pilot early dropout intervention..."
                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-[#3d63ff]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-blue-700 hover:bg-blue-800 dark:bg-[#3d63ff] dark:hover:bg-[#3252db] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-700/25 dark:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Pilot Request</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Footer with Atomis Badge Logo */}
          <footer className="pt-12 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600 dark:text-slate-400 font-['Quicksand'] font-medium">
            <div className="flex items-center gap-4">
              <AtomisLogo variant="badge" size="md" transparentBg={false} />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-base text-slate-900 dark:text-white font-['Raleway'] tracking-wider">
                  ATOMIS
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-cyan-600 dark:text-cyan-400">
                  Predict. Support. Succeed.
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right space-y-1.5">
              <div className="flex items-center justify-center sm:justify-end gap-3 text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-semibold tracking-wide">
                  Predict. Support. Succeed.
                </span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                © 2026 ATOMIS Inc. All rights reserved. Student Analytics & Success Platform.
              </div>
            </div>
          </footer>

        </div>
      </div>

      {/* Pop-up Auth Modal when invoked while scrolled */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-xl">
            {authModalMode === 'login' ? (
              <LoginAccountPage
                isModal={true}
                onClose={() => setAuthModalOpen(false)}
                onNavigateToRegister={() => setAuthModalMode('register')}
                onSuccess={(user) => {
                  setAuthModalOpen(false);
                  onLoginSuccess(user);
                }}
              />
            ) : (
              <RegisterAccountPage
                isModal={true}
                onClose={() => setAuthModalOpen(false)}
                onNavigateToLogin={() => setAuthModalMode('login')}
                onSuccess={(user) => {
                  setAuthModalOpen(false);
                  onLoginSuccess(user);
                }}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
};
