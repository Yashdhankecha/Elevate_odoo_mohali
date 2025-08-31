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
      const reply = res.ok ? data.reply : data.error || 'Request failed';
      setMessages((m) => [...m, { role: res.ok ? 'assistant' : 'system', content: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'system', content: 'Network error. Please try again.' }]);
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
            placeholder="Ask your career question..."
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
          The assistant only answers career-related questions and may refuse other topics.
        </p>
      </form>
    </div>
  );
};

export default AICareerCoach;
