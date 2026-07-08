const express = require('express');
const axios = require('axios');
const router = express.Router();

// ── News API Proxy ─────────────────────────────────────────────────────────────
router.get('/news', async (req, res) => {
  try {
    const { category, language } = req.query;
    const apiKey = process.env.NEWS_API;
    
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'News API key not configured' });
    }

    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        ...req.query,
        apikey: apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('News API Proxy Error:', error.message);
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
});

// ── Judge0 API Proxy ──────────────────────────────────────────────────────────
const JUDGE0_HOST = process.env.X_RAPID_API_HOST || 'judge0-ce.p.rapidapi.com';

router.post('/judge0/submissions', async (req, res) => {
  try {
    const apiKey = process.env.JUDGE0_API_KEY;
    if (!apiKey) return res.status(500).json({ success: false, message: 'Judge0 API key not configured' });

    const response = await axios.post(
      `https://${JUDGE0_HOST}/submissions?base64_encoded=true&fields=*`,
      req.body,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': JUDGE0_HOST,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Judge0 Submission Proxy Error:', error.message);
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
});

router.get('/judge0/submissions/:token', async (req, res) => {
  try {
    const apiKey = process.env.JUDGE0_API_KEY;
    if (!apiKey) return res.status(500).json({ success: false, message: 'Judge0 API key not configured' });

    const response = await axios.get(
      `https://${JUDGE0_HOST}/submissions/${req.params.token}?base64_encoded=true&fields=*`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': JUDGE0_HOST
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Judge0 Retrieval Proxy Error:', error.message);
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
});

module.exports = router;
