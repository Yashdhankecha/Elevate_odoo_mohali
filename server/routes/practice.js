const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Proxy route for LeetCode GraphQL API
 * Handles CORS issues from the frontend
 */
router.post('/leetcode', async (req, res) => {
  try {
    const { query, variables } = req.body;
    
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('LeetCode Proxy Error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message,
      error: error.response?.data
    });
  }
});

module.exports = router;
