const express = require('express');
const router = express.Router();

let Groq;
try { Groq = require('groq-sdk'); } catch { Groq = null; }

const hasKey = Boolean(process.env.GROQ_API_KEY);
if (!hasKey) {
  console.warn('Missing GROQ_API_KEY. /chat will return an error until you set it.');
}
const groq = hasKey && Groq ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// ---- Career-only intent filter & safety guardrails ----
const CAREER_SIGNALS_STRONG = [
  // Resume & Professional Documents
  /\b(resume|cv|cover\s*letter|linkedin|portfolio|ats|github\s*profile)\b/i,
  // Interviews & Hiring
  /\b(interview(s|ing)?|hiring|offer(s)?|negotiat(e|ion|ing))\b/i,
  // Internships & Jobs
  /\b(intern(ship)?s?|apprentice(ship)?|co-?op)\b/i,
  /\b(job\s*(description|search|portal|market|hunt(ing)?|board))\b/i,
  /\b(jd|apply(ing)?|application(s)?)\b/i,
  // Career Planning
  /\b(roadmap|career\s*(switch|change|path|plan(ning)?|growth|goal|transition|development|advice|guidance|strategy|objective))\b/i,
  // Education & Skills
  /\b(skill(s|set)?|upskill(ing)?|reskill(ing)?|learn(ing)?\s*(path|plan))\b/i,
  /\b(course(s)?|certification(s)?|bootcamp|degree|diploma|master'?s?|bachelor'?s?|mba|mca|btech|bca|mtech)\b/i,
  // Technology & Domains
  /\b(frontend|backend|full\s*-?stack|devops|cloud|data\s*(science|engineer|analyst)|machine\s*learning|deep\s*learning|ai|ml|nlp|cybersecurity|blockchain|web3|mobile\s*dev|game\s*dev|iot|embedded|sre|platform\s*engineer)\b/i,
  /\b(react|angular|vue|node|express|django|flask|spring|dotnet|swift|kotlin|flutter|rust|go(lang)?|typescript|javascript|python|java|c\+\+|c#|ruby|php|scala|r\s+programming|matlab)\b/i,
  /\b(aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/?cd|git|linux|sql|nosql|mongodb|postgresql|mysql|redis|kafka|spark|hadoop|tableau|power\s*bi)\b/i,
  // CS Fundamentals
  /\b(dsa|data\s*structure(s)?|algorithm(s)?|system\s*design|oop|os|operating\s*system|dbms|database|computer\s*network(s|ing)?|software\s*engineer(ing)?)\b/i,
  /\b(leetcode|hackerrank|codeforces|codechef|competitive\s*programming|coding\s*(test|challenge|round|contest))\b/i,
];
const CAREER_SIGNALS_WEAK = [
  // General career terms
  /\b(career|role(s)?|profession(al)?|title|position|designation)\b/i,
  /\b(placement(s)?|campus|recruit(ment|er|ing)?|fresher(s)?)\b/i,
  /\b(salary|ctc|compensat(ion|e)|pay(scale)?|stipend|package|lpa|benefits|equity|stock\s*option)\b/i,
  /\b(break\s*into|get\s*into|switch\s*to|pivot\s*to|move\s*to|land\s*a)\b/i,
  /\b(recruiter|hiring\s*manager|hr|talent\s*acquisition)\b/i,
  /\b(work\s*experience|experience\s*letter|recommendation|reference)\b/i,
  // Professional Development
  /\b(mentor(ship)?|coach(ing)?|guid(e|ance)|tip(s)?|advice|strateg(y|ies)|best\s*practice(s)?)\b/i,
  /\b(project(s)?|hackathon|open\s*source|contribution|freelanc(e|ing|er))\b/i,
  /\b(remote|hybrid|onsite|work\s*from\s*home|startup|mnc|product\s*company|service\s*company)\b/i,
  /\b(network(ing)?|referral(s)?|cold\s*(email|message|outreach)|connect(ion)?)\b/i,
  // Soft Skills & General
  /\b(communicat(e|ion)|teamwork|leadership|problem\s*solv(e|ing)|critical\s*thinking|time\s*management|presentation|public\s*speak(ing)?)\b/i,
  /\b(productivity|motivation|burnout|work\s*life\s*balance|imposter\s*syndrome|confidence)\b/i,
  /\b(compan(y|ies)|industry|sector|domain|field|market|trend(s)?|opportunit(y|ies))\b/i,
  /\b(promotion|appraisal|performance|review|feedback|growth|raise|hike)\b/i,
  // Education
  /\b(college|university|institute|school|education|academ(ic|y)|gpa|cgpa|grade|exam|gate|cat|gre|gmat|toefl|ielts)\b/i,
  /\b(research|paper|thesis|publication|phd|postdoc|professor)\b/i,
  /\b(government\s*job|ssc|upsc|bank\s*(exam|po)|civil\s*service|psu|defence)\b/i,
  // Entrepreneurship
  /\b(startup|entrepreneur(ship)?|business|found(er|ing)|co-?found|venture|bootstrap|funding|pitch|investor)\b/i,
  // Questions / How-to
  /\b(how\s*(to|do|can|should)|what\s*(is|are|should)|where\s*(to|can)|which\s*(is|are)|why\s*(should|is)|suggest|recommend|compare|difference|between|vs|versus|pros?\s*(and|&)\s*cons?)\b/i,
  /\b(help|prepare|practice|improve|build|create|develop|enhance|optimize|boost|strengthen)\b/i,
];
const SENSITIVE_PATTERNS = [
  /\b(violence|extremis(m|t)|terror(is[mt])?|bomb|weapon|suicide|self\s*-?harm)\b/i,
  /\b(hate\s*speech|racis(m|t)|sexist|homophob(ic|ia))\b/i,
  /\b(porn|sexual(ly)?\s*explicit|nsfw|nude)\b/i,
  /\b(illegal\s*activit|crime|drugs?\s*(deal|traf)|crack(ing)?\s*(software|account)|piracy)\b/i,
];
function isCareerQuery(text) {
  const strong = CAREER_SIGNALS_STRONG.filter((re) => re.test(text)).length;
  const weak = CAREER_SIGNALS_WEAK.filter((re) => re.test(text)).length;
  // Allow if any strong signal matches, or if at least 1 weak signal matches (relaxed from 2)
  const decision = strong >= 1 || weak >= 1;
  if (process.env.DEBUG_FILTER === '1') {
    console.log('[filter] allow:', decision, { strong, weak });
  }
  return decision;
}
function isSensitive(text) {
  return SENSITIVE_PATTERNS.some((re) => re.test(text));
}

// Debug endpoint to inspect filter decisions
router.get('/classify', (req, res) => {
  const text = String(req.query.text || '');
  const isC = isCareerQuery(text);
  const isS = isSensitive(text);
  if (process.env.DEBUG_FILTER === '1') {
    const strongMatches = CAREER_SIGNALS_STRONG.filter((re) => re.test(text)).map((r) => r.source);
    const weakMatches = CAREER_SIGNALS_WEAK.filter((re) => re.test(text)).map((r) => r.source);
    const sensMatches = SENSITIVE_PATTERNS.filter((re) => re.test(text)).map((r) => r.source);
    return res.json({ text, isCareer: isC, isSensitive: isS, strongMatches, weakMatches, sensMatches });
  }
  return res.json({ text, isCareer: isC, isSensitive: isS });
});

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required (string)' });
    }
    if (!hasKey || !groq) {
      return res.status(500).json({ error: 'Server missing GROQ_API_KEY. Add it to .env and restart the server.' });
    }

    const text = message.trim();
    if (isSensitive(text)) {
      if (process.env.DEBUG_FILTER === '1') console.log('[filter] blocked sensitive:', text);
      return res.json({
        reply:
          'I can’t assist with sensitive or restricted topics. I only answer career-related questions (e.g., roles, skills, courses, resumes, internships, interviews). Please ask something about careers.',
      });
    }
    if (!isCareerQuery(text)) {
      if (process.env.DEBUG_FILTER === '1') console.log('[filter] blocked non-career:', text);
      return res.json({
        reply:
          'I only handle career-related questions. Examples: ‘How do I switch from IT support to data science?’, ‘What skills and courses for a cloud engineer role?’, ‘Improve my resume for a frontend role’. Please rephrase your question to focus on careers.',
      });
    }

    // Build conversation history for context (last 10 messages)
    const history = req.body.history || [];
    const conversationMessages = history.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }));

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1500,
      messages: [
        {
          role: 'system',
          content:
            `You are **Elevate AI Career Coach** — an expert career strategist and mentor for students and professionals.

## Your Expertise Areas
You provide comprehensive guidance across ALL career and professional development topics:

- **Career Planning**: Career paths, transitions, goal setting, industry analysis, market trends
- **Technical Skills**: Programming languages, frameworks, tools, technologies, CS fundamentals (DSA, OS, DBMS, CN, System Design)
- **Education & Learning**: Courses, certifications, bootcamps, degrees (B.Tech, MCA, MBA, etc.), competitive exams (GATE, CAT, GRE, UPSC), research
- **Resume & Branding**: Resume optimization, ATS tips, LinkedIn profiles, portfolios, GitHub, personal branding
- **Interview Prep**: Technical interviews, HR rounds, behavioral questions (STAR), system design, coding challenges, mock interviews
- **Job Search**: Job hunting strategies, networking, referrals, cold outreach, job portals, applications
- **Internships & Placements**: Campus recruitment, off-campus opportunities, internship strategies
- **Salary & Negotiation**: Compensation, CTC, benefits, negotiation tactics, market rates
- **Soft Skills**: Communication, leadership, teamwork, time management, presentations, public speaking
- **Entrepreneurship**: Startups, freelancing, business ideas, funding, pitch decks
- **Professional Growth**: Promotions, appraisals, work-life balance, productivity, burnout, imposter syndrome
- **Industry Insights**: Tech, finance, consulting, healthcare, government, defense, PSU sectors
- **Project Ideas**: Suggesting projects aligned with career goals, open-source contribution guidance
- **Competitive Programming**: LeetCode, HackerRank, CodeForces strategies and preparation

## Response Style
- Give **detailed, structured, and actionable** responses
- Use **markdown formatting**: headings (##, ###), bold (**text**), bullet points, numbered lists, code blocks where relevant
- Break complex topics into clear sections
- Provide **step-by-step roadmaps** when discussing learning paths
- Include **specific resources**, tool names, course platforms (Coursera, Udemy, freeCodeCamp, etc.) when relevant
- Be encouraging and motivational while being realistic
- For technical questions, provide examples and explanations
- Tailor advice based on context (fresher vs experienced, specific domain)

## Boundaries
- Politely decline topics completely unrelated to career/education/professional development
- Do NOT provide medical, legal, political, or religious advice
- If a question is ambiguous, ask a clarifying question to give better advice

End longer responses with a brief encouraging note.`
        },
        ...conversationMessages,
        { role: 'user', content: message },
      ],
    });

    const reply = completion?.choices?.[0]?.message?.content || '';
    return res.json({ reply });
  } catch (err) {
    console.error('Groq Error:', err?.message || err);
    const status = err?.status || 500;
    return res.status(status).json({ error: 'LLM request failed' });
  }
});

module.exports = router;
