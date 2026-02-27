import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaShieldAlt,
  FaLightbulb,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaBolt,
  FaBriefcase,
  FaBookOpen,
  FaMagic,
  FaHistory,
  FaPlus,
  FaChartLine,
  FaTimes,
  FaBrain,
  FaCompass,
  FaSparkles
} from 'react-icons/fa';

/**
 * AICareerCoach: Mobile-Optimized & Robust Version
 * Focused on content wrapping, proper spacing, and a clean mobile-first chat UI.
 */
const AICareerCoach = () => {
  const apiBase = process.env.REACT_APP_API_URL || '/api';

  const allowedKeywords = [
    // Career & Jobs
    'career', 'job', 'jobs', 'internship', 'internships', 'placement', 'placements', 'campus', 'fresher', 'freshers', 'opportunity', 'opportunities',
    'apply', 'application', 'applications', 'hire', 'hiring', 'recruit', 'recruitment', 'recruiter', 'position', 'vacancy', 'opening',
    'remote', 'hybrid', 'onsite', 'work from home', 'startup', 'mnc', 'product company', 'service company', 'freelance', 'freelancing',
    // Resume & Branding
    'resume', 'cv', 'cover letter', 'portfolio', 'ats', 'linkedin', 'github', 'profile', 'summary', 'objective', 'experience', 'personal brand',
    // Skills & Learning
    'skill', 'skills', 'upskill', 'reskill', 'roadmap', 'course', 'courses', 'certification', 'certifications', 'bootcamp', 'learn', 'learning',
    'degree', 'diploma', 'masters', 'bachelors', 'mba', 'mca', 'btech', 'bca', 'mtech', 'education', 'college', 'university', 'institute',
    // Interviews
    'interview', 'interviews', 'behavioral', 'hr round', 'technical round', 'system design', 'dsa', 'data structures', 'algorithms',
    'coding test', 'assessment', 'mock interview', 'star method', 'problem solving', 'whiteboard', 'live coding',
    // Roles & Domains
    'role', 'roles', 'jd', 'job description', 'requirements', 'responsibilities',
    'frontend', 'backend', 'full stack', 'fullstack', 'devops', 'cloud', 'sre', 'platform engineer',
    'data analyst', 'data scientist', 'data engineer', 'ml', 'ai', 'machine learning', 'deep learning', 'nlp', 'computer vision',
    'cybersecurity', 'blockchain', 'web3', 'mobile dev', 'game dev', 'iot', 'embedded',
    'product manager', 'project manager', 'business analyst', 'consultant', 'designer', 'ux', 'ui', 'qa', 'tester',
    // Technologies
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'spring boot', 'dotnet',
    'swift', 'kotlin', 'flutter', 'rust', 'golang', 'go', 'typescript', 'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'scala',
    'html', 'css', 'tailwind', 'bootstrap', 'next', 'nextjs', 'vite',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd', 'cicd', 'git', 'linux',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'kafka', 'spark', 'hadoop', 'elasticsearch',
    'tableau', 'power bi', 'excel',
    // CS Fundamentals
    'operating system', 'os', 'dbms', 'database', 'computer networks', 'web development',
    'oop', 'object oriented', 'software engineering', 'low level design', 'high level design',
    'leetcode', 'hackerrank', 'codeforces', 'codechef', 'competitive programming', 'coding challenge',
    // Networking & Job Search
    'network', 'networking', 'referral', 'referrals', 'job portal', 'cold email', 'cold message', 'outreach',
    // Salary & Compensation
    'salary', 'ctc', 'compensation', 'offer', 'offers', 'negotiation', 'negotiate', 'package', 'lpa', 'stipend', 'benefits', 'equity', 'hike', 'raise', 'appraisal',
    // Projects & Building
    'project', 'projects', 'hackathon', 'github repo', 'open source', 'contribution', 'side project',
    // Soft Skills
    'communication', 'leadership', 'teamwork', 'time management', 'presentation', 'public speaking', 'critical thinking',
    'productivity', 'motivation', 'burnout', 'work life balance', 'imposter syndrome', 'confidence',
    // Professional Growth
    'promotion', 'performance', 'review', 'feedback', 'growth', 'mentor', 'mentorship', 'coaching', 'guidance',
    // Entrepreneurship
    'startup', 'entrepreneur', 'entrepreneurship', 'business', 'founder', 'cofounder', 'venture', 'bootstrap', 'funding', 'pitch', 'investor',
    // Exams & Higher Ed
    'gate', 'cat', 'gre', 'gmat', 'toefl', 'ielts', 'upsc', 'ssc', 'bank exam', 'civil service', 'psu', 'government job',
    'research', 'paper', 'thesis', 'phd', 'postdoc',
    // Industry & Trends
    'industry', 'sector', 'domain', 'field', 'market', 'trend', 'trends', 'company', 'companies',
    // General question words
    'how to', 'what is', 'what are', 'which is', 'where to', 'suggest', 'recommend', 'compare', 'difference',
    'tips', 'advice', 'guide', 'help', 'prepare', 'practice', 'improve', 'build', 'create', 'develop', 'enhance', 'optimize', 'best', 'top'
  ];

  const restrictedKeywords = [
    'nsfw', 'adult', 'porn', 'nude', 'explicit',
    'suicide', 'self-harm', 'murder', 'violence', 'terror',
    'drug deal', 'drug traffic', 'ddos', 'malware', 'crack software', 'exam answers'
  ];

  const normalize = (s) => s.toLowerCase();
  const containsAny = (text, list) => {
    const t = normalize(text);
    return list.some((k) => {
      const phrase = normalize(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const isSingle = !phrase.includes(' ');
      const pattern = isSingle ? new RegExp(`(^|[^a-z0-9_])${phrase}([^a-z0-9_]|$)`) : new RegExp(phrase);
      return pattern.test(t);
    });
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Career Strategist. I can help you with resume reviews, interview preparation, and finding the right career path.\n\nWhat would you like to discuss today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthy, setHealthy] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${apiBase.replace(/\/$/, '')}/health`);
        setHealthy(r.ok);
      } catch (e) {
        setHealthy(false);
      }
    })();
  }, [apiBase]);

  const fallbackResponses = {
    'resume': 'Strategic Resume Optimization:\n\n• Quantify impact using the Google XYZ formula\n• Align keywords with ATS requirements\n• Prioritize technical stack and project velocity\n• Maintain clean, modular formatting',
    'interview': 'Technical Interview Execution:\n\n• Mastery of DSA fundamentals and time complexity\n• Structural storytelling via the STAR method\n• Deep understanding of System Design patterns\n• Collaborative problem-solving mindset',
    'internship': 'Pipeline Acquisition Strategies:\n\n• Leverage internal institutional referrals\n• Optimize LinkedIn for recruiter visibility\n• Direct-to-Engineer networking on GitHub/Twitter\n• Maintaining a resilient application volume',
    'default': 'I am ready to provide specialized career advice. Please specify a domain: Resume Audit, Interview Prep, Skill Synthesis, or Market Analysis.'
  };

  const getFallbackResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('resume')) return fallbackResponses.resume;
    if (lowerText.includes('interview')) return fallbackResponses.interview;
    if (lowerText.includes('internship')) return fallbackResponses.internship;
    return fallbackResponses.default;
  };

  const send = async (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;

    if (containsAny(text, restrictedKeywords)) {
      setMessages((m) => [...m, { role: 'user', content: text }, { role: 'system', content: 'Inquiry restricted. Please adhere to professional career-related domains.' }]);
      setInput('');
      return;
    }

    if (!containsAny(text, allowedKeywords)) {
      setMessages((m) => [...m, { role: 'user', content: text }, { role: 'system', content: 'Out of Context. Please direct your inquiry towards career engineering, roles, or interview intelligence.' }]);
      setInput('');
      return;
    }

    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      // Send message with conversation history for context
      const chatHistory = messages.filter(m => m.role !== 'system').slice(-10);
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: `[OFFLINE] Theoretical Insight:\n\n${getFallbackResponse(text)}` }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: `[OFFLINE] Theoretical Guidance:\n\n${getFallbackResponse(text)}` }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant', content: 'Chat reset. How can I help you today?'
    }]);
  };

  const suggestions = [
    { label: 'Review Resume', icon: FaMagic, color: 'bg-blue-600' },
    { label: 'Market Trends', icon: FaChartLine, color: 'bg-indigo-600' },
    { label: 'Technical Mock', icon: FaRobot, color: 'bg-emerald-600' },
    { label: 'Roadmap', icon: FaCompass, color: 'bg-purple-600' }
  ];

  return (
    <div className="p-4 md:p-0 h-full w-full">
      <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] w-full bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden animate-fade-in relative">

        {/* Header */}
        <header className="px-4 py-3 md:px-8 md:py-5 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
              <FaRobot size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm md:text-lg font-bold text-gray-900 truncate">AI Career Coach</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${healthy ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{healthy ? 'Ready' : 'Connecting'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            title="Reset"
          >
            <FaPlus size={14} />
          </button>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-3 max-w-[100%] sm:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm text-[12px] md:text-[14px] ${m.role === 'user' ? 'bg-gray-800 text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                  {m.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl md:rounded-[1.5rem] text-[13px] md:text-sm leading-relaxed break-words overflow-hidden ${m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : m.role === 'assistant'
                    ? 'bg-gray-100 text-gray-700 rounded-tl-none border border-gray-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-100 italic'
                  }`}>
                  {m.role === 'user' ? (
                    m.content.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                    ))
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
                        h4: ({ children }) => <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>,
                        ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="ml-1">{children}</li>,
                        code: ({ inline, children, ...props }) =>
                          inline
                            ? <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                            : <code className="block bg-gray-800 text-green-300 px-3 py-2 rounded-lg text-xs font-mono my-2 overflow-x-auto whitespace-pre" {...props}>{children}</code>,
                        pre: ({ children }) => <pre className="my-2">{children}</pre>,
                        blockquote: ({ children }) => <blockquote className="border-l-3 border-blue-400 pl-3 my-2 italic text-gray-500">{children}</blockquote>,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">{children}</a>,
                        hr: () => <hr className="my-3 border-gray-200" />,
                        table: ({ children }) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border-collapse">{children}</table></div>,
                        thead: ({ children }) => <thead className="bg-gray-200">{children}</thead>,
                        th: ({ children }) => <th className="px-2 py-1 text-left font-semibold border border-gray-300">{children}</th>,
                        td: ({ children }) => <td className="px-2 py-1 border border-gray-200">{children}</td>,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <FaRobot size={12} className="animate-spin" />
                </div>
                <div className="flex gap-1.5 px-4 py-2 bg-gray-50 rounded-2xl rounded-tl-none">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions & Input */}
        <footer className="p-4 md:p-6 bg-white border-t border-gray-50 sticky bottom-0">
          <div className="max-w-4xl mx-auto">
            {/* Scrollable Suggestions */}
            <div className="flex gap-2.5 mb-4 overflow-x-auto no-scrollbar pb-1">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(s.label)}
                  className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 rounded-xl transition-all group whitespace-nowrap"
                >
                  <div className={`w-5 h-5 rounded-md ${s.color} text-white flex items-center justify-center`}>
                    <s.icon size={10} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-600 uppercase tracking-wider">{s.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={send} className="flex items-center gap-2 md:gap-3">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 py-3 md:py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-11 h-11 md:w-12 md:h-12 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-20 flex-shrink-0"
              >
                <FaPaperPlane size={16} />
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AICareerCoach;
