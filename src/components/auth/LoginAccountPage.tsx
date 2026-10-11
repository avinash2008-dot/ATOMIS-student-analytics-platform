import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AtomisLogo } from '../AtomisLogo';
import {
  loginAccount,
  getRateLimitState,
  UserAuthSession,
} from '../../services/authStorage';

interface LoginAccountPageProps {
  onSuccess: (user: UserAuthSession) => void;
  onNavigateToRegister: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const LoginAccountPage: React.FC<LoginAccountPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  isModal = false,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotPasswordMsg(null);

    const normEmail = email.trim().toLowerCase();
    if (!normEmail) {
      setError('Incorrect email or password');
      return;
    }

    setLoading(true);

    try {
      const res = await loginAccount({
        email: normEmail,
        password,
        provider: 'email',
      });

      setLoading(false);

      if (!res.success || !res.user) {
        setError(res.error || 'Incorrect email or password');
        return;
      }

      onSuccess(res.user);
    } catch (err: any) {
      setLoading(false);
      setError('Incorrect email or password');
    }
  };

  // Google Login for Student / Parent
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginAccount({
        email: 'alex.morgan@university.edu',
        provider: 'google',
      });
      setLoading(false);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.error || 'Incorrect email or password');
      }
    } catch {
      setLoading(false);
      setError('Incorrect email or password');
    }
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError('Please enter your email address to receive a password reset link.');
      return;
    }
    setError(null);
    setForgotPasswordMsg(`Password reset instructions have been dispatched to ${email.trim()}.`);
  };

  // Check rate limit state
  const currentRateLimit = email.trim() ? getRateLimitState(email.trim()) : null;
  const isLocked = currentRateLimit?.lockedUntil ? Date.now() < currentRateLimit.lockedUntil : false;

  return (
    <div className="w-full max-w-md mx-auto rounded-[32px] backdrop-blur-2xl bg-slate-950/65 border border-white/20 p-6 sm:p-9 space-y-6 shadow-[0_16px_50px_rgba(0,0,0,0.6)] text-slate-100 relative font-['Quicksand']">
      {/* Top ambient glass glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />

      {/* Header with Atomis Logo & Tagline */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Login Account</span>
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

      {forgotPasswordMsg && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>{forgotPasswordMsg}</span>
        </div>
      )}

      {/* Continue with Google (Student / Parent) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || isLocked}
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
          <span>Continue with Google</span>
        </button>
        <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
          <div className="flex-1 h-px bg-white/10" />
          <span>or login with credentials</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@atomis.edu, mentor@atomis.edu"
              required
              className="w-full bg-slate-900/70 border border-white/20 rounded-2xl px-3.5 py-3 text-base sm:text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer py-1"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full bg-slate-900/70 border border-white/20 rounded-2xl px-3.5 py-3 text-base sm:text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-12"
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

        <button
          type="submit"
          disabled={loading || isLocked}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-[#3d63ff] hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
        >
          <span>{loading ? 'Authenticating...' : 'Login Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Pre-fill helpers for instant evaluation */}
      <div className="pt-2 border-t border-white/10 space-y-1.5">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
          Instant Demo Logins:
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@atomis.edu');
              setPassword('password123');
            }}
            className="py-1 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-semibold truncate cursor-pointer"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('mentor@atomis.edu');
              setPassword('password123');
            }}
            className="py-1 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-semibold truncate cursor-pointer"
          >
            Teacher
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('alex.morgan@university.edu');
              setPassword('password123');
            }}
            className="py-1 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-semibold truncate cursor-pointer"
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('sam.parent@gmail.com');
              setPassword('password123');
            }}
            className="py-1 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-semibold truncate cursor-pointer"
          >
            Parent
          </button>
        </div>
      </div>

      {/* Footer Link to Register Account */}
      <div className="text-center pt-2 text-xs text-slate-400 border-t border-white/10">
        New here?{' '}
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
        >
          Register Account
        </button>
      </div>
    </div>
  );
};
