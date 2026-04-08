const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

let Groq;
try { Groq = require('groq-sdk'); } catch { Groq = null; }

const hasKey = Boolean(process.env.GROQ_API_KEY);
if (!hasKey) {
  console.warn('Missing GROQ_API_KEY. /chat will return an error until you set it.');
}
const groq = hasKey && Groq ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// ─── Helper: Try to get student from JWT ──────────────────────────────────────
async function getStudentFromRequest(req) {
  try {
    const token =
      req.cookies?.token ||
      req.headers?.authorization?.split(' ')[1];

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.userId).select(
      'name branch cgpa currentBacklogs backlogHistory skills preferredCompanies isPlaced placementDetails'
    );
    return student || null;
  } catch {
    return null;
  }
}

// ─── Helper: Build personalised system prompt ────────────────────────────────
function buildSystemPrompt(student) {
  let studentName = 'Student';
  let branch = 'Engineering';
  let cgpa = 'Not provided';
  let backlogs = '0';
  let skills = 'No skills listed yet';
  let targetCompanies = 'Not specified';
  let placementStatus = 'Not yet placed';

  if (student) {
    studentName = student.name || 'Student';
    branch = student.branch || 'Engineering';
    cgpa = student.cgpa != null ? String(student.cgpa) : 'Not provided';

    const totalBacklogs = (student.currentBacklogs || 0) + (student.backlogHistory || 0);
    backlogs = String(totalBacklogs);

    if (student.skills && student.skills.length > 0) {
      skills = student.skills.map(s => s.name).filter(Boolean).join(', ') || 'No skills listed yet';
    }

    if (student.preferredCompanies && student.preferredCompanies.length > 0) {
      targetCompanies = student.preferredCompanies.join(', ');
    }

    if (student.isPlaced && student.placementDetails?.company) {
      placementStatus = `Placed at ${student.placementDetails.company}`;
    } else {
      placementStatus = 'Not yet placed';
    }
  }

  return `You are ELEVATE, a placement & career assistant for engineering students.
You are part of the Elevate Placement Portal.

================================================================
STUDENT PROFILE
================================================================
Name: ${studentName} | Branch: ${branch} | CGPA: ${cgpa}
Backlogs: ${backlogs} | Skills: ${skills}
Target Companies: ${targetCompanies} | Status: ${placementStatus}

================================================================
YOU ONLY HELP WITH ✅
================================================================
- Placement prep (aptitude, coding, interviews, GD)
- Company info (eligibility, rounds, packages, bond)
- Resume & LinkedIn tips
- Career guidance & roadmaps
- Academic impact on placements (CGPA, backlogs)
- Practice Hub guidance (what to practice next)
- Motivation & preparation strategy

================================================================
YOU NEVER HELP WITH ❌
================================================================
Anything outside placements, career, or academics.
If asked, respond:
"I'm ELEVATE 🎯 I only help with placements & career queries.
Try asking about interview prep or target companies! 💪"

================================================================
PERSONALIZATION RULES
================================================================
- CGPA < 6.5 → suggest mass recruiters
- CGPA > 8 → suggest product companies & higher studies
- Has backlogs → honest guidance, suggest backlog-friendly companies
- Already placed → offer offer evaluation or dream company strategy
- No skills listed → suggest what to build first
- Non-CSE branch → guide toward IT roles available for their branch

================================================================
TONE & FORMAT
================================================================
- Friendly, encouraging, like a placed senior.
- Provide comprehensive, detailed, and insightful guidance.
- Take your time to explain things thoroughly; use structured headings or bullet points where appropriate to make information easy to digest.
- Occasional emojis, never say "I am an AI"
- End with an actionable tip or follow-up question
- Never make up company data — say "verify on official site" if unsure`;
}

// ─── Health ───────────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({ status: 'ok', llm: hasKey ? 'groq' : 'unavailable' });
});

// ─── Chat ─────────────────────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required (string)' });
    }
    if (!hasKey || !groq) {
      return res.status(500).json({ error: 'Server missing GROQ_API_KEY. Add it to .env and restart.' });
    }

    // Fetch student profile for personalised system prompt
    const student = await getStudentFromRequest(req);
    const systemPrompt = buildSystemPrompt(student);

    // Keep only the last 6 messages for context window
    const conversationHistory = history
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-6)
      .map(m => ({ role: m.role, content: String(m.content) }));

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message.trim() },
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
