import React, { useEffect, useState } from 'react';
import { api, PeerMatch } from '../services/api';
import { X, Users, Sparkles, CheckCircle2, Calendar, ArrowRight, UserCheck } from 'lucide-react';

interface PeerMatchmakerModalProps {
  onClose: () => void;
}

export const PeerMatchmakerModal: React.FC<PeerMatchmakerModalProps> = ({ onClose }) => {
  const [matches, setMatches] = useState<PeerMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pairedIds, setPairedIds] = useState<Set<string>>(new Set());

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    api.getPeerMatches()
      .then(res => {
        if (res.success) setMatches(res.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleConfirmPair = (menteeId: string) => {
    setPairedIds(prev => new Set(prev).add(menteeId));
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)] w-full max-w-3xl my-auto"
      >
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">AI Peer Tutoring & Coding Buddy Matchmaker</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                    Complementary Skill Pairs
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Matches struggling students with top-ranking department peers based on specific backlog subjects and technical coding strengths.
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 animate-spin text-purple-400" />
              <span>Analyzing academic profiles & computing optimal peer pairings...</span>
            </div>
          ) : (
            matches.map((match, i) => {
              const isPaired = pairedIds.has(match.menteeId);
              return (
                <div
                  key={i}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-800/60 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{match.menteeName}</span>
                      <span className="text-[11px] text-slate-400">({match.menteeRoll})</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        match.menteeRisk === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {match.menteeRisk} Risk
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                      <span>Paired Peer Mentor:</span>
                      <strong className="text-emerald-400">{match.mentorName}</strong>
                      <span className="text-slate-500">({match.mentorRoll})</span>
                      <span className="text-[11px] bg-slate-800 px-1.5 py-0.2 rounded text-indigo-300">
                        Coding: {match.mentorScore}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Focus: <strong className="text-cyan-300">{match.focusSubject}</strong></span>
                      <span>•</span>
                      <span>Frequency: {match.recommendedFrequency}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConfirmPair(match.menteeId)}
                    disabled={isPaired}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                      isPaired
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                    }`}
                  >
                    {isPaired ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pair Confirmed</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Confirm Pairing</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
