import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaMagic,
  FaChartLine,
  FaCompass,
  FaPlus,
} from 'react-icons/fa';

const SUGGESTIONS = [
  { label: 'Best companies for my profile', icon: FaCompass, color: 'bg-blue-600' },
  { label: 'Review my resume strategy', icon: FaMagic, color: 'bg-indigo-600' },
  { label: 'Interview prep roadmap', icon: FaChartLine, color: 'bg-emerald-600' },
  { label: 'What skills should I build?', icon: FaRobot, color: 'bg-purple-600' },
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hey! 👋 I'm **ELEVATE**, your personal placement & career assistant.\n\nI know your profile and I'm here to give you advice that's tailored *specifically* to you — not generic tips.\n\nWhat would you like help with today?",
};

const Bubble = ({ m }) => {
  const isUser = m.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-3 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs shadow-sm ${isUser ? 'bg-slate-800 text-white' : 'bg-blue-100 text-blue-600'
            }`}
        >
          {isUser ? <FaUser /> : <FaRobot />}
        </div>
        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words min-w-0 ${isUser
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
            }`}
        >
          {isUser ? (
            <p>{m.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-1">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-1">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="ml-1">{children}</li>,
                code: ({ inline, children, ...props }) =>
                  inline ? (
                    <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-slate-800 text-green-300 px-3 py-2 rounded-lg text-xs font-mono my-2 overflow-x-auto whitespace-pre" {...props}>
                      {children}
                    </code>
                  ),
                pre: ({ children }) => <pre className="my-2">{children}</pre>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-3 border-slate-200" />,
              }}
            >
              {m.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

const TypingDots = () => (
  <div className="flex justify-start">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
        <FaRobot size={12} className="animate-spin" />
      </div>
      <div className="flex gap-1.5 px-4 py-3 bg-slate-50 rounded-2xl rounded-tl-none border border-slate-100">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
      </div>
    </div>
  </div>
);

const AICareerCoach = () => {
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthy, setHealthy] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Health check
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${apiBase}/health`);
        setHealthy(r.ok);
      } catch {
        setHealthy(false);
      }
    })();
  }, [apiBase]);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history from current messages (last 6 exchanges)
      const historyToSend = [...messages, userMsg]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-6);

      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ message: trimmed, history: historyToSend }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm having trouble connecting right now. Please try again in a moment! 🙏",
          },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm offline right now. Check your connection and try again! 🔌",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    send();
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 md:p-0 h-full w-full">
      <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] w-full bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">

        {/* ── Header ── */}
        <header className="px-5 py-4 md:px-8 md:py-5 border-b border-slate-50 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
              <FaRobot size={18} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight">ELEVATE AI</h1>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${healthy === null ? 'bg-slate-300' : healthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                    }`}
                />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {healthy === null ? 'Connecting' : healthy ? 'Online · Personalised' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center border border-slate-100"
            title="New Chat"
          >
            <FaPlus size={13} />
          </button>
        </header>

        {/* ── Message Stream ── */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <Bubble key={i} m={m} />
          ))}
          {loading && <TypingDots />}
          <div ref={endRef} />
        </div>

        {/* ── Footer ── */}
        <footer className="p-4 md:p-6 bg-white border-t border-slate-50 sticky bottom-0 flex-shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">

            {/* Quick suggestions */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => send(s.label)}
                  disabled={loading}
                  className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 rounded-xl transition-all group whitespace-nowrap disabled:opacity-40"
                >
                  <div className={`w-5 h-5 rounded-md ${s.color} text-white flex items-center justify-center`}>
                    <s.icon size={10} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-blue-600 uppercase tracking-wider">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 md:gap-3">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about placements, interviews, skills..."
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-300 transition-all placeholder:text-slate-400 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:translate-y-0 flex-shrink-0"
              >
                <FaPaperPlane size={15} />
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AICareerCoach;
