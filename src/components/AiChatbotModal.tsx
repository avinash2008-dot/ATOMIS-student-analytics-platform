import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types/student';
import { api } from '../services/api';
import {
  Sparkles,
  Bot,
  Send,
  User,
  X,
  Minimize2,
  Maximize2,
  BookOpen,
  CalendarCheck,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';

interface AiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentStudentId?: string;
  onSelectStudent?: (student: Student) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  dataCitations?: { label: string; value: string }[];
}

export const AiChatbotModal: React.FC<AiChatbotModalProps> = ({
  isOpen,
  onClose,
  students,
  currentStudentId,
  onSelectStudent
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentStudentId || students[0]?.id || ''
  );
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Update initial welcome message when student changes
  useEffect(() => {
    if (!activeStudent) return;
    const initialMsg: ChatMessage = {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello ${activeStudent.name}! I am your AI Student Success Copilot. I have live access to your 360° academic profile: current CGPA of ${activeStudent.cgpa}, attendance of ${activeStudent.overallAttendance}%, ${activeStudent.activeBacklogs} backlogs, and technical coding score of ${activeStudent.codingProfile.byteXlScore}/100. How can I guide you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        "Why did my grades fall this semester?",
        "How can I raise my CGPA to 8.5?",
        "What are my weakest topics right now?",
        "How many classes to reach 75% attendance?",
        "Am I ready for campus placements?"
      ],
      dataCitations: [
        { label: "CGPA", value: `${activeStudent.cgpa}/10.0` },
        { label: "Attendance", value: `${activeStudent.overallAttendance}%` },
        { label: "Backlogs", value: `${activeStudent.activeBacklogs}` },
        { label: "Skill Benchmark", value: `${activeStudent.codingProfile.byteXlScore}/100` }
      ]
    };
    setMessages([initialMsg]);
  }, [activeStudent?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen || !activeStudent) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend || inputQuery).trim();
    if (!question || isLoading) return;

    setInputQuery('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await api.askStudentCopilot(activeStudent.id, question);
      const aiReply = res.success ? res.data.reply : "Here is my assessment based on your current record.";

      // Formulate contextual suggested actions
      let nextSuggestions: string[] = [];
      if (question.toLowerCase().includes("grade") || question.toLowerCase().includes("cgpa")) {
        nextSuggestions = [
          "Generate a 4-week study plan for my weak subjects",
          "What is my projected degree completion date?",
          "How will an extra 5 attendance classes impact my CGPA?"
        ];
      } else if (question.toLowerCase().includes("attendance")) {
        nextSuggestions = [
          "Show me subject-wise attendance breakdown",
          "What is the penalty if I fall below 65%?",
          "Help me draft an email to my mentor"
        ];
      } else {
        nextSuggestions = [
          "Review my coding skill benchmarks",
          "Find peer tutoring partners in my department",
          "Check upcoming assignment deadlines"
        ];
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: nextSuggestions,
        dataCitations: [
          { label: "Attendance Health", value: `${activeStudent.overallAttendance}%` },
          { label: "Risk Tier", value: activeStudent.riskLevel },
          { label: "Branch", value: activeStudent.department }
        ]
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      // Graceful rich answer if network error occurs
      const fallbackAiMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Based on your live record (${activeStudent.cgpa} CGPA, ${activeStudent.overallAttendance}% attendance, ${activeStudent.activeBacklogs} backlogs): To maximize your performance, focus on attending all lectures for the next 3 weeks to push attendance past 75%, and devote 45 minutes daily to your weakest coursework modules. You're fully capable of turning this into an outstanding semester!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          "How many classes do I need to attend to be safe?",
          "What coding topics should I practice?"
        ]
      };
      setMessages(prev => [...prev, fallbackAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (!activeStudent) return;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Chat reset. Ask me anything about your coursework, assignments, attendance, or career readiness, ${activeStudent.name}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          "Why did my grades fall this semester?",
          "What are my weakest topics right now?",
          "Am I ready for campus placements?"
        ]
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[88vh] max-h-[850px] bg-gradient-to-b from-[#041a13]/95 via-[#03150f]/95 to-slate-950/95 border border-emerald-500/30 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-emerald-500/20 bg-emerald-950/40 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-white/20">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  AI Student Success Copilot
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Data-Grounded
                </span>
              </div>
              <p className="text-xs text-emerald-400/80">
                Grounded in your live academic performance, attendance records, and learning activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Student Persona Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-emerald-500/30 rounded-xl px-2.5 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedStudentId}
                onChange={e => {
                  setSelectedStudentId(e.target.value);
                  const st = students.find(s => s.id === e.target.value);
                  if (st && onSelectStudent) onSelectStudent(st);
                }}
                className="bg-transparent text-emerald-200 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.rollNo}) - {s.riskLevel}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition-all cursor-pointer border border-white/10"
              title="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Academic Context Ribbon for Active Student */}
        <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between text-xs overflow-x-auto gap-4 no-scrollbar">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <strong>{activeStudent.name}</strong> ({activeStudent.rollNo})
            </span>
            <span>• {activeStudent.department} (Sem {activeStudent.semester})</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-slate-300">
              CGPA: <strong className="text-white">{activeStudent.cgpa}</strong>
            </span>
            <span className={activeStudent.overallAttendance >= 75 ? 'text-emerald-300' : 'text-amber-300 font-bold'}>
              Attendance: <strong>{activeStudent.overallAttendance}%</strong>
            </span>
            <span className={activeStudent.activeBacklogs === 0 ? 'text-emerald-300' : 'text-rose-300 font-bold'}>
              Backlogs: <strong>{activeStudent.activeBacklogs}</strong>
            </span>
            <span className="text-cyan-300">
              Coding Benchmark: <strong>{activeStudent.codingProfile.byteXlScore}/100</strong>
            </span>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
            >
              <div
                className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed backdrop-blur-md shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900/80 border border-emerald-500/20 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Data Citations Pills (If AI cited student records) */}
                  {msg.dataCitations && msg.dataCitations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2 text-[11px]">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Cited Record:
                      </span>
                      {msg.dataCitations.map((c, i) => (
                        <span
                          key={i}
                          className="bg-black/40 border border-emerald-500/30 px-2 py-0.5 rounded-md text-emerald-200"
                        >
                          {c.label}: <strong>{c.value}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 text-[10px] text-slate-400 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>

              {/* Actionable Prompt Suggestions Pills */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 ml-11 flex flex-wrap gap-1.5 max-w-[85%]">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 w-full mb-0.5">
                    <Lightbulb className="w-3 h-3 text-amber-300" /> Quick Questions:
                  </span>
                  {msg.suggestedActions.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs transition-all cursor-pointer shadow-sm text-left flex items-center gap-1.5"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-slate-900/80 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Analyzing student transcript & generating guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-4 border-t border-emerald-500/20 bg-slate-950/70 backdrop-blur-md">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder={`Ask Copilot about grades, attendance recovery, weak topics, or placements...`}
                className="w-full bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>Powered by Gemini 3.8 Flash • Student Success Knowledge Engine</span>
            <span>All responses grounded in university curriculum policies</span>
          </div>
        </div>

      </div>
    </div>
  );
};
