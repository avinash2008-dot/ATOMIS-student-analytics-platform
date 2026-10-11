import React, { useState } from 'react';
import { Student } from '../types/student';
import { api, AlertDispatchResult } from '../services/api';
import { X, Send, MessageSquare, PhoneCall, Mail, CheckCircle2, Sparkles, ShieldAlert } from 'lucide-react';

interface EmergencyAlertModalProps {
  student: Student;
  onClose: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({ student, onClose }) => {
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [recipient, setRecipient] = useState<'Parent & Student' | 'Student Only' | 'Parent Only' | 'Mentor Escalation'>('Parent & Student');
  const [message, setMessage] = useState(
    `URGENT ACADEMIC ALERT: ${student.name} (${student.rollNo}) has an attendance level of ${student.overallAttendance}% and ${student.activeBacklogs} active backlogs. Under university regulations, this poses an immediate risk of exam detention and KPMG placement ineligibility. Please attend the scheduled counseling session with mentor ${student.mentor}.`
  );
  const [isSending, setIsSending] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<AlertDispatchResult | null>(null);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await api.dispatchAlert(student.id, channel, recipient, message);
      if (res.success) {
        setDispatchResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
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
        className="rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)] w-full max-w-xl my-auto"
      >
        <div className="rounded-[22px] backdrop-blur-2xl bg-slate-950/90 border border-white/10 w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Multi-Channel Intervention Alert Dispatcher</h3>
                <p className="text-xs text-slate-400">Target Student: {student.name} ({student.rollNo})</p>
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
        <form onSubmit={handleSend} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Channel Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block">Select Delivery Channel:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('WhatsApp')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer ${
                  channel === 'WhatsApp' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer ${
                  channel === 'SMS' ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-indigo-400" />
                <span>SMS Alert</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('Email')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer ${
                  channel === 'Email' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Email Official</span>
              </button>
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block">Recipients:</label>
            <select
              value={recipient}
              onChange={e => setRecipient(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            >
              <option value="Parent & Student">Parent & Student Joint Broadcast</option>
              <option value="Parent Only">Parent / Guardian Only</option>
              <option value="Student Only">Student SMS / WhatsApp Direct</option>
              <option value="Mentor Escalation">Department HOD & Mentor Escalation</option>
            </select>
          </div>

          {/* Message Text */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block">Customized Alert Text:</label>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Transmitting Alert over Carrier Gateways...' : `Dispatch ${channel} Alert`}</span>
          </button>

          {/* Dispatch Confirmation */}
          {dispatchResult && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Emergency Broadcast Successfully Dispatched!</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Dispatch ID: <strong className="text-white">{dispatchResult.dispatchId}</strong> • Channel: {dispatchResult.channel}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Carrier Acknowledgment: {dispatchResult.carrierAck}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
  );
};
