import React, { useEffect, useRef, useState } from 'react';

// Career chatbot UI that talks to backend /chat as per provided Express server
// Uses REACT_APP_API_URL (e.g., http://localhost:5000/api) or falls back to /api

const AICareerCoach = () => {
  const apiBase = process.env.REACT_APP_API_URL || '/api';
  // Expanded keyword lists for CS/IT students
  const allowedKeywords = [
    // Core career
    'career','job','jobs','internship','internships','placement','placements','campus','fresher','freshers','opportunity','opportunities',

    // Application material
    'resume','cv','cover letter','portfolio','ats','linkedin','github','profile','summary','objective','bullet','experience',

    // Skills & learning
    'skill','skills','upskill','reskill','roadmap','course','courses','certification','certifications','bootcamp','mooc','udemy','coursera','edx',

    // Interviews
    'interview','interviews','behavioral','hr round','technical round','system design','dsa','data structures','algorithms','coding test','assessment',

    // Roles & domains (general IT + engineering)
    'role','roles','jd','job description','requirements','responsibilities','frontend','backend','full stack','devops','cloud','data analyst','data scientist','ml','ai','cybersecurity','qa','tester','product manager',

    // Search & networking
    'network','networking','referral','referrals','apply','application','applications','job portal','indeed','naukri','glassdoor','linkedin jobs',

    // Compensation & offers
    'salary','ctc','compensation','offer','offers','negotiation','negotiate','notice period',

    // Projects & competitions
    'project','projects','hackathon','coding challenge','leetcode','codeforces','codechef','github repo',

    // ==== Technical Subjects per Branch ====

    // Computer Science / IT
    'operating system','os','dbms','database','sql','mysql','mongodb','oracle','networking','computer networks','web development','web developer',
    'compiler','distributed systems','cyber security','information security','cloud computing','iot','software engineering',
    'object oriented','oop','java','c++','python','javascript','react','node','spring boot','angular','kotlin','swift',

    // Electronics / Electrical / ECE / EEE
    'circuits','digital electronics','analog electronics','vlsi','embedded systems','fpga','microcontroller',
    'microprocessor','power electronics','control systems','signal processing','communication systems',
    'antenna','wireless','rf','radar','semiconductors','electrical machines','transformer','generator','motor','power systems','hvac',

    // Mechanical
    'thermodynamics','fluid mechanics','strength of materials','machine design','manufacturing','cad','cam',
    'solidworks','autocad','ansys','catia','cfd','heat transfer','mechatronics','robotics','hvac','automobile engineering',

    // Civil
    'structural engineering','geotechnical','surveying','concrete technology','steel structures','environmental engineering',
    'transportation engineering','hydraulics','soil mechanics','construction management','staad pro','etabs','revit','autocad civil',

    // Chemical
    'chemical reaction engineering','process control','mass transfer','heat transfer','thermodynamics chemical',
    'polymer technology','petrochemical','refinery','biochemical engineering',

    // Biotechnology
    'genetics','molecular biology','cell culture','bioinformatics','bioprocess','enzymology','microbiology','immunology',

    // Aerospace
    'aerodynamics','propulsion','flight mechanics','aircraft structures','composites','avionics','satellite','rocket propulsion',

    // Metallurgy / Materials
    'material science','metallurgy','welding','casting','composites','corrosion','nanomaterials',

    // General emerging tech (cross-domain)
    'ai','machine learning','deep learning','data science','big data','quantum computing','blockchain','ar','vr','metaverse',
  ];

  const restrictedKeywords = [
    // NSFW / adult
    'nsfw','adult','porn','sex','nude','explicit',
    // Violence / self-harm
    'suicide','self-harm','kill','murder','violence','violent','weapon','gun','bomb','terror','terrorism','extremism',
    // Drugs / illegal
    'drug','drugs','cocaine','heroin','weed','marijuana','sell drugs','buy drugs','narcotics',
    // Cybercrime / piracy / bypassing security
    'crack','cracker','exploit','ddos','malware','virus','keygen','torrent','piracy','warez','license bypass','paywall bypass','password cracking','phishing','sql injection','xss attack','credential stuffing','carding',
    // Academic dishonesty
    'cheat in exam','exam answers','assignment answers','write my assignment','solve my exam','proctoring bypass',
    // Privacy/PII abuse & deepfakes
    'scrape emails','scrape phone numbers','dox','doxxing','pii','face swap','deepfake','impersonate','spoof id',
    // Politics / religion (non-career context)
    'election','politics','political','religion','religious','hindu','muslim','christian','islam','temple','church','mosque',
    // Medical/legal advice (non-career)
    'diagnose','medical advice','treatment','prescription','law advice','legal case','court strategy',
    // Scams / financial speculation
    'get rich quick','scam','ponzi','bitcoin investment','crypto tips','stock tips','forex signal','insider trading',
    // Harassment / hate / discrimination
    'hate','racist','harass','abuse','bully','slur','sexist','homophobic'
  ];
  // More robust matching: normalize and check word boundaries
  const normalize = (s) => s.toLowerCase();
  const containsAny = (text, list) => {
    const t = normalize(text);
    return list.some((k) => {
      const phrase = normalize(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Word boundary for single words, substring for multi-word phrases
      const isSingle = !phrase.includes(' ');
      const pattern = isSingle ? new RegExp(`(^|[^a-z0-9_])${phrase}([^a-z0-9_]|$)`) : new RegExp(phrase);
      return pattern.test(t);
    });
  };
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I am your AI Career Coach. Ask me career-related questions about roles, skills, courses/certifications, internships, interviews, resumes/portfolios, or job search.\n\nNote: This is general guidance; please consult a mentor for detailed decisions.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthy, setHealthy] = useState(null); // null=unknown, true=ok, false=down
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // health check
    (async () => {
      try {
        const r = await fetch(`${apiBase.replace(/\/$/, '')}/health`);
        setHealthy(r.ok);
      } catch (e) {
        setHealthy(false);
      }
    })();
  }, [apiBase]);

  // Fallback responses for when AI service is unavailable
  const fallbackResponses = {
    'resume': 'To improve your resume:\n\n• Use action verbs and quantifiable achievements\n• Tailor it to each job application\n• Keep it concise (1-2 pages)\n• Include relevant keywords from job descriptions\n• Proofread thoroughly\n• Use a clean, professional format\n\nConsider using ATS-friendly templates and getting feedback from career counselors.',
    
    'interview': 'Interview preparation tips:\n\n• Research the company and role thoroughly\n• Practice common behavioral questions (STAR method)\n• Prepare questions to ask the interviewer\n• Dress professionally and arrive early\n• Bring copies of your resume and portfolio\n• Follow up with a thank-you email\n\nPractice with mock interviews to build confidence.',
    
    'internship': 'Finding internships:\n\n• Use job portals like LinkedIn, Indeed, Glassdoor\n• Network with alumni and professionals\n• Attend career fairs and company events\n• Apply to multiple positions\n• Customize your application for each role\n• Follow up on applications\n• Consider both paid and unpaid opportunities for experience',
    
    'skills': 'Essential skills for tech careers:\n\n• Technical: Programming languages, frameworks, tools\n• Soft skills: Communication, teamwork, problem-solving\n• Industry knowledge: Stay updated with trends\n• Certifications: Relevant professional certifications\n• Projects: Build a portfolio of work\n• Networking: Connect with professionals in your field',
    
    'career': 'Career development strategies:\n\n• Set clear short-term and long-term goals\n• Continuously learn and upskill\n• Build a strong professional network\n• Seek mentorship and guidance\n• Stay updated with industry trends\n• Consider different career paths and opportunities\n• Balance technical and soft skills development',
    
    'job': 'Job search strategies:\n\n• Use multiple job portals and company websites\n• Leverage your professional network\n• Attend career fairs and networking events\n• Optimize your LinkedIn profile\n• Apply to positions that match your skills\n• Follow up on applications\n• Prepare for interviews thoroughly',
    
    'default': 'I\'m here to help with your career questions! You can ask me about:\n\n• Resume writing and optimization\n• Interview preparation and techniques\n• Finding internships and job opportunities\n• Skill development and learning paths\n• Career planning and goal setting\n• Industry insights and trends\n\nWhat specific career topic would you like to discuss?'
  };

  const getFallbackResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('resume') || lowerText.includes('cv')) {
      return fallbackResponses.resume;
    } else if (lowerText.includes('interview')) {
      return fallbackResponses.interview;
    } else if (lowerText.includes('internship')) {
      return fallbackResponses.internship;
    } else if (lowerText.includes('skill')) {
      return fallbackResponses.skills;
    } else if (lowerText.includes('career')) {
      return fallbackResponses.career;
    } else if (lowerText.includes('job')) {
      return fallbackResponses.job;
    } else {
      return fallbackResponses.default;
    }
  };

  const send = async (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;
    
    // Client-side filtering: refuse restricted, require career context
    if (containsAny(text, restrictedKeywords)) {
      setMessages((m) => [
        ...m,
        { role: 'user', content: text },
        {
          role: 'system',
          content:
            'I can\'t assist with that topic. I only provide guidance on career-related subjects like roles, skills, interviews, resumes, and job search.',
        },
      ]);
      setInput('');
      return;
    }
    
    const isCareer = containsAny(text, allowedKeywords);
    if (!isCareer) {
      setMessages((m) => [
        ...m,
        { role: 'user', content: text },
        {
          role: 'system',
          content:
            'Please rephrase your question to be career-related (e.g., roles, skills, courses/certifications, internships, interviews, resumes/portfolios, job search).',
        },
      ]);
      setInput('');
      return;
    }
    
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const reply = data.reply;
        setMessages((m) => [...m, { role: 'assistant', content: reply }]);
        setApiKeyMissing(false);
      } else {
        const errorMessage = data.error || 'Request failed';
        
        // Check if it's an API key missing error
        if (errorMessage.includes('GROQ_API_KEY')) {
          setApiKeyMissing(true);
          const fallbackReply = getFallbackResponse(text);
          setMessages((m) => [
            ...m, 
            { 
              role: 'assistant', 
              content: `🤖 AI Service Note: I'm currently operating in limited mode due to missing API configuration. Here's some helpful guidance:\n\n${fallbackReply}\n\n💡 For more personalized advice, please contact your career counselor or administrator to set up the full AI service.` 
            }
          ]);
        } else {
          setMessages((m) => [...m, { role: 'system', content: errorMessage }]);
        }
      }
    } catch (err) {
      // Provide fallback response on network errors too
      const fallbackReply = getFallbackResponse(text);
      setMessages((m) => [
        ...m, 
        { 
          role: 'assistant', 
          content: `🤖 AI Service Note: I'm currently operating in limited mode due to connection issues. Here's some helpful guidance:\n\n${fallbackReply}\n\n💡 Please try again later or contact support if the issue persists.` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-[70vh] grid grid-rows-[auto_1fr_auto] bg-gray-50 border border-gray-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-xl">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">AI Career Coach</h2>
          <p className="text-xs text-gray-500">Career-only assistant powered by Groq</p>
        </div>
        <div className="text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
              healthy === null
                ? 'bg-gray-100 text-gray-600'
                : healthy
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                healthy === null ? 'bg-gray-400' : healthy ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {healthy === null ? 'Checking…' : healthy ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* API Key Missing Warning */}
      {apiKeyMissing && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>AI Service Note:</strong> Operating in limited mode. For full AI assistance, contact your administrator to configure the API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${
              m.role === 'user'
                ? 'bg-indigo-600 text-white ml-auto'
                : m.role === 'assistant'
                ? 'bg-gray-100 text-gray-900'
                : 'bg-red-50 text-red-800'
            } max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500 italic">Typing…</div>}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="p-3 border-t bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKeyMissing ? "Limited mode - Ask career questions..." : "Ask your career question..."}
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {apiKeyMissing 
            ? "Operating in limited mode with basic career guidance. Full AI service requires API configuration."
            : "The assistant only answers career-related questions and may refuse other topics."
          }
        </p>
      </form>
    </div>
  );
};

export default AICareerCoach;
