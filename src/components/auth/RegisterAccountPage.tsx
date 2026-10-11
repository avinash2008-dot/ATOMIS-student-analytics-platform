import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { AtomisLogo } from '../AtomisLogo';
import {
  registerAccount,
  checkAdminLockExists,
  UserAuthSession,
  UserRole,
} from '../../services/authStorage';

interface RegisterAccountPageProps {
  onSuccess: (user: UserAuthSession) => void;
  onNavigateToLogin: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const RegisterAccountPage: React.FC<RegisterAccountPageProps> = ({
  onSuccess,
  onNavigateToLogin,
  isModal = false,
  onClose,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Extra fields by type
  // Student: roll number, department, year
  const [rollNumber, setRollNumber] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('CSE');
  const [studentYear, setStudentYear] = useState('1');

  // Teacher: department, employee ID
  const [teacherDepartment, setTeacherDepartment] = useState('Computer Science');
  const [employeeId, setEmployeeId] = useState('');

  // Parent: student roll number or invite code to link the child
  const [linkedStudentRoll, setLinkedStudentRoll] = useState('');

  // Admin lock checking
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check Firestore admin lock on mount
  useEffect(() => {
    let isMounted = true;
    checkAdminLockExists().then((locked) => {
      if (isMounted) {
        setIsAdminLocked(locked);
        if (locked && selectedRole === 'admin') {
          setSelectedRole('student');
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedRole]);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full legal or campus name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!agreedTerms) {
      setError('You must agree to the terms and privacy policy.');
      return;
    }

    // Role specific requirements
    if (selectedRole === 'student' && !rollNumber.trim()) {
      setError('Please provide your student roll number.');
      return;
    }

    if (selectedRole === 'teacher' && !employeeId.trim()) {
      setError('Please provide your campus employee ID.');
      return;
    }

    if (selectedRole === 'parent' && !linkedStudentRoll.trim()) {
      setError("Please provide your child's student roll number or invite code.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
        rollNumber: selectedRole === 'student' ? rollNumber.trim() : undefined,
        department: selectedRole === 'student' ? studentDepartment : selectedRole === 'teacher' ? teacherDepartment : undefined,
        year: selectedRole === 'student' ? studentYear : undefined,
        employeeId: selectedRole === 'teacher' ? employeeId.trim() : undefined,
        linkedStudentRoll: selectedRole === 'parent' ? linkedStudentRoll.trim() : undefined,
        provider: 'email',
      });

      setLoading(false);

      if (!res.success || !res.user) {
        setError(res.error || 'Registration could not be completed.');
        return;
      }

      onSuccess(res.user);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'An error occurred during registration.');
    }
  };

  // Google Sign-In (Student or Parent only)
  const handleGoogleAuth = async (googleRole: 'student' | 'parent') => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerAccount({
        name: googleRole === 'student' ? 'Alex Morgan' : 'Sam Morgan (Guardian)',
        email: googleRole === 'student' ? 'alex.morgan@university.edu' : 'sam.parent@gmail.com',
        role: googleRole,
        rollNumber: googleRole === 'student' ? '2026-CSE-001' : undefined,
        department: googleRole === 'student' ? 'CSE' : undefined,
        year: googleRole === 'student' ? '4' : undefined,
        linkedStudentRoll: googleRole === 'parent' ? '2026-CSE-001' : undefined,
        provider: 'google',
      });
      setLoading(false);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.error || 'Google registration failed.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Google registration failed.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-[32px] backdrop-blur-2xl bg-slate-950/65 border border-white/20 p-6 sm:p-9 space-y-6 shadow-[0_16px_50px_rgba(0,0,0,0.6)] text-slate-100 relative font-['Quicksand']">
      {/* Top ambient glass glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />

      {/* Header with Atomis Logo & Tagline */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Register Account</span>
          </div>
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Logo and Tagline */}
        <div className="py-1">
          <AtomisLogo variant="badge" size="lg" transparentBg={false} />
        </div>
        <p className="text-xs text-slate-300 font-medium">
          Predict. Support. Succeed. • Student Analytics &amp; Success Platform
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Continue with Google (Student & Parent only) */}
      {(selectedRole === 'student' || selectedRole === 'parent') && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleGoogleAuth(selectedRole as 'student' | 'parent')}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.13z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.39 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.26C.46 8.18 0 9.97 0 12s.46 3.82 1.26 5.41l4.02-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.26 6.59l4.02 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
              />
            </svg>
            <span>Continue with Google ({selectedRole === 'student' ? 'Student' : 'Parent'})</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
            <div className="flex-1 h-px bg-white/10" />
            <span>or register with email below</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              required
              className="w-full bg-slate-900/70 border border-white/20 rounded-2xl px-3.5 py-3 text-base sm:text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              required
              className="w-full bg-slate-900/70 border border-white/20 rounded-2xl px-3.5 py-3 text-base sm:text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300">
                Password *
              </label>
              <span className={`text-[10px] font-bold ${password.length >= 8 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {password.length}/8 min
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                className="w-full bg-slate-900/70 border border-white/20 rounded-2xl px-3.5 py-3 text-base sm:text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10 pr-12"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1 bottom-1 w-11 flex items-center justify-center text-slate-400 hover:text-slate-200 cursor-pointer touch-target"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300">
                Confirm Password *
              </label>
              {confirmPassword && (
                <span className={`text-[10px] font-bold ${password === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {password === confirmPassword ? '✓ Match' : '✗ Mismatch'}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full bg-slate-900/70 border border-white/20 rounded-2xl px-3.5 py-3 text-base sm:text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10 pr-12"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-1 top-1 bottom-1 w-11 flex items-center justify-center text-slate-400 hover:text-slate-200 cursor-pointer touch-target"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Account Type Selector: exactly four options */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Account Type</span>
            <span className="text-[11px] text-slate-400">Choose your campus role</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Student */}
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm ring-1 ring-cyan-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Student</span>
            </button>

            {/* Teacher */}
            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'teacher'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-sm ring-1 ring-blue-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Teacher</span>
            </button>

            {/* Parent */}
            <button
              type="button"
              onClick={() => setSelectedRole('parent')}
              className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'parent'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-sm ring-1 ring-teal-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Parent</span>
            </button>

            {/* Admin (single admin lock) */}
            <button
              type="button"
              disabled={isAdminLocked}
              onClick={() => {
                if (!isAdminLocked) setSelectedRole('admin');
              }}
              title={isAdminLocked ? 'Admin already registered' : 'Register as primary administrator'}
              className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                isAdminLocked
                  ? 'bg-slate-900/60 border-white/5 text-slate-600 cursor-not-allowed opacity-60'
                  : selectedRole === 'admin'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm ring-1 ring-amber-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isAdminLocked ? 'text-slate-600' : 'text-amber-400'}`} />
              <span>{isAdminLocked ? 'Admin (Locked)' : 'Admin'}</span>
            </button>
          </div>

          {isAdminLocked && (
            <p className="text-[11px] text-amber-400/90 mt-1.5 font-medium flex items-center gap-1">
              <span>●</span> An admin account already exists. Only the first registered admin is permitted.
            </p>
          )}
        </div>

        {/* Extra Fields by Type */}
        {selectedRole === 'student' && (
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 space-y-3 animate-fadeIn">
            <div className="text-xs font-bold text-cyan-300">Student Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Roll Number *</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 2026-CSE-042"
                  required
                  className="w-full bg-slate-900/80 border border-cyan-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Department</label>
                <select
                  value={studentDepartment}
                  onChange={(e) => setStudentDepartment(e.target.value)}
                  className="w-full bg-slate-900/80 border border-cyan-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="AI_DS">AI &amp; DS</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Year</label>
                <select
                  value={studentYear}
                  onChange={(e) => setStudentYear(e.target.value)}
                  className="w-full bg-slate-900/80 border border-cyan-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {selectedRole === 'teacher' && (
          <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-400/30 space-y-3 animate-fadeIn">
            <div className="text-xs font-bold text-blue-300">Teacher / Faculty Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Employee ID *</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-FAC-102"
                  required
                  className="w-full bg-slate-900/80 border border-blue-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Faculty Department</label>
                <select
                  value={teacherDepartment}
                  onChange={(e) => setTeacherDepartment(e.target.value)}
                  className="w-full bg-slate-900/80 border border-blue-400/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics &amp; Comm">Electronics &amp; Comm</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Note: Teachers register with pending status and have limited access until approved by the campus administrator.
            </p>
          </div>
        )}

        {selectedRole === 'parent' && (
          <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-400/30 space-y-2 animate-fadeIn">
            <div className="text-xs font-bold text-teal-300">Parent / Guardian Link</div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">
                Student Roll Number or Invite Code *
              </label>
              <input
                type="text"
                value={linkedStudentRoll}
                onChange={(e) => setLinkedStudentRoll(e.target.value)}
                placeholder="e.g. 2026-CSE-001 or INV-9842"
                required
                className="w-full bg-slate-900/80 border border-teal-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Parents only see the academic progress, risk metrics, and interventions of their linked student.
            </p>
          </div>
        )}

        {selectedRole === 'admin' && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-400/40 text-amber-200 text-xs space-y-1 animate-fadeIn">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Sole Administrator Registration</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              The first person who registers as Admin creates the permanent system lock. No other admin account can ever be created.
            </p>
          </div>
        )}

        {/* Terms and Privacy policy checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="terms-check"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
          />
          <label htmlFor="terms-check" className="text-xs text-slate-300 cursor-pointer leading-tight">
            I agree to the <span className="text-cyan-400 font-semibold underline">terms and privacy policy</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !agreedTerms}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
        >
          <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Link to Login Account */}
      <div className="text-center pt-2 text-xs text-slate-400 border-t border-white/10">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
        >
          Login Account
        </button>
      </div>
    </div>
  );
};
