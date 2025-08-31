# AI Career Coach Setup Guide

## Overview
The AI Career Coach is a chatbot that provides career guidance to students. It uses the Groq AI API for intelligent responses and includes fallback responses when the API is not configured.

## Features
- ✅ **Career-focused conversations** - Only responds to career-related questions
- ✅ **Safety filters** - Blocks inappropriate or sensitive content
- ✅ **Fallback responses** - Provides basic guidance even without API key
- ✅ **Real-time chat** - Interactive conversation interface
- ✅ **Health monitoring** - Shows service status

## Setup Instructions

### 1. Get a Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Create a new API key
4. Copy the API key (starts with `gsk_`)

### 2. Configure Environment Variables
In your `server/.env` file, add:

```env
# Groq AI API Key for Career Coach
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 3. Install Dependencies
The `groq-sdk` package is already installed. If you need to reinstall:

```bash
cd server
npm install groq-sdk
```

### 4. Restart the Server
After adding the API key, restart your server:

```bash
cd server
npm start
```

## Usage

### For Students
1. Navigate to the Student Dashboard
2. Click on "AI Career Coach" in the sidebar
3. Ask career-related questions about:
   - Resume writing and optimization
   - Interview preparation
   - Job search strategies
   - Skill development
   - Career planning
   - Internship opportunities

### For Administrators
- Monitor the health status indicator
- Check server logs for API errors
- Update the API key if needed

## Fallback Mode
When the API key is not configured, the system operates in "limited mode":
- Provides basic career guidance using predefined responses
- Shows a warning message about limited functionality
- Still filters for career-related questions only
- Maintains all safety features

## Troubleshooting

### Common Issues

1. **"Server missing GROQ_API_KEY" error**
   - Solution: Add the GROQ_API_KEY to your .env file
   - Restart the server after adding the key

2. **"Network error" messages**
   - Check if the server is running
   - Verify the API endpoint is accessible
   - Check network connectivity

3. **API rate limits**
   - Groq has generous free tier limits
   - Monitor usage in the Groq console
   - Consider upgrading if needed

### Testing the Setup
1. Start the server with a valid API key
2. Open the AI Career Coach in the student dashboard
3. Ask a career question like "How do I improve my resume?"
4. Verify you get an AI-generated response
5. Check that the health indicator shows "Online"

## Security Notes
- The API key is stored in environment variables (not in code)
- All conversations are filtered for career-related content only
- Sensitive topics are automatically blocked
- No personal data is stored from conversations

## Cost Information
- Groq offers a generous free tier
- Free tier includes 1000 requests per day
- Additional usage is very affordable
- Monitor usage in the Groq console

## Support
If you encounter issues:
1. Check the server logs for error messages
2. Verify the API key is correct
3. Test the API endpoint directly
4. Contact the development team for assistance
