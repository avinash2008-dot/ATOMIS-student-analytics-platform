import React from 'react';
import { Lock, X, LogIn, UserPlus } from 'lucide-react';
import { UserAuthSession } from '../services/authStorage';
import { RegisterAccountPage } from './auth/RegisterAccountPage';
import { LoginAccountPage } from './auth/LoginAccountPage';

export interface SignInRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSignIn: (user: UserAuthSession) => void;
  actionDescription?: string;
  initialView?: 'login' | 'register';
}

export const SignInRequiredModal: React.FC<SignInRequiredModalProps> = ({
  isOpen,
  onClose,
  onSuccessSignIn,
  actionDescription = 'take this action',
  initialView = 'register',
}) => {
  const [activeView, setActiveView] = React.useState<'prompt' | 'login' | 'register'>('prompt');

  // Sync if opened
  React.useEffect(() => {
    if (isOpen) {
      setActiveView(initialView === 'login' ? 'login' : initialView === 'register' ? 'register' : 'prompt');
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-['Quicksand'] safe-top safe-bottom">
      <div className="relative w-full max-w-xl">
        {activeView === 'login' ? (
          <LoginAccountPage
            isModal={true}
            onClose={onClose}
            onNavigateToRegister={() => setActiveView('register')}
            onSuccess={(user) => {
              onSuccessSignIn(user);
              onClose();
            }}
          />
        ) : activeView === 'register' ? (
          <RegisterAccountPage
            isModal={true}
            onClose={onClose}
            onNavigateToLogin={() => setActiveView('login')}
            onSuccess={(user) => {
              onSuccessSignIn(user);
              onClose();
            }}
          />
        ) : (
          <div className="w-full rounded-[28px] sm:rounded-[32px] backdrop-blur-2xl bg-slate-950/90 border border-white/20 p-5 sm:p-8 space-y-5 sm:space-y-6 text-slate-100 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-400/30">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Account Required</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer touch-target flex items-center justify-center"
                title="Keep browsing"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-center py-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Raleway'] tracking-tight">
                Please login or register to continue
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                You need a verified account to {actionDescription}. Please choose an option below to proceed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveView('login')}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-[#3d63ff] hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer touch-target"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Account</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('register')}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer touch-target"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Account</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center touch-target flex items-center justify-center"
              >
                Keep browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
