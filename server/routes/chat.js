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
  /\b(resume|cv|cover\s*letter|linkedin|portfolio|ats)\b/i,
  /\b(interview(s)?|hiring|offer|negotiation)\b/i,
  /\b(intern(ship)?|internship)\b/i,
  /\b(job\s*description|jd)\b/i,
  /\b(roadmap|career\s*switch|transition)\b/i,
];
const CAREER_SIGNALS_WEAK = [
  /\b(career|role|roles|profession|title)\b/i,
  /\b(placement|campus\s*recruit(ment|er)?)\b/i,
  /\b(salary|ctc|compensation)\b/i,
  /\b(break\s*into)\b/i,
  /\b(recruiter|hiring\s*manager)\b/i,
  /\b(internship\s*report|work\s*experience|experience\s*letter)\b/i,
  /\b(bootcamp|cert(ification)?|course[s]?)\b/i,
];
const SENSITIVE_PATTERNS = [
  /\b(violence|extremis(m|t)|terror|bomb|weapon|suicide|self\s*-?harm)\b/i,
  /\b(hate\s*speech|racis(m|t)|sexist|homophob(ic|ia))\b/i,
  /\b(porn|sexual(ly)?\s*explicit|nsfw)\b/i,
  /\b(illegal|crime|drugs?|hack(ing)?|crack|piracy)\b/i,
  /\b(religion|politics|election|political\s*opinion)\b/i,
  /\b(medical\s*advice|diagnos(e|is)|treatment)\b/i,
  /\b(legal\s*advice|attorney|lawsuit)\b/i,
];
function isCareerQuery(text) {
  const strong = CAREER_SIGNALS_STRONG.filter((re) => re.test(text)).length;
  const weak = CAREER_SIGNALS_WEAK.filter((re) => re.test(text)).length;
  const decision = strong >= 1 || weak >= 2;
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

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        {
          role: 'system',
          content:
            'You are an AI Career Advisor.\n' +
            'Policy: ONLY answer career-related questions (roles, responsibilities, skills, courses/certifications, internships, interviews, resumes/portfolios, job search).\n' +
            'Refuse and ask the user to rephrase if the request is outside career topics or touches sensitive areas (violence, hate, explicit sexual content, illegal activities, politics, religion, personal medical/legal advice).\n' +
            'If ambiguous, ask a short clarifying question limited to the career context.\n' +
            'Style: Be clear, structured, and actionable. Provide multiple suggestions where useful.\n' +
            "Always add: 'Note: This is general guidance, please consult a mentor for detailed decisions.'",
        },
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
