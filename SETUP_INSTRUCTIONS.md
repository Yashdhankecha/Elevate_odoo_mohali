# Quick Fix for Google OAuth Not Working

## The Problem
The Google OAuth button is not working because the `REACT_APP_GOOGLE_CLIENT_ID` environment variable is not set.

## Solution

### Step 1: Create a .env file in the client directory
Create a file named `.env` (not `.env.example`) in the `client` folder with this content:

```env
REACT_APP_GOOGLE_CLIENT_ID=your-actual-google-client-id-here
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 2: Get your Google Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Copy your OAuth 2.0 Client ID

### Step 3: Restart your React app
After creating the .env file, you need to restart your React development server:
1. Stop the React app (Ctrl+C)
2. Run `npm start` again

## Why This Happens
- React only loads environment variables when the app starts
- Changes to .env files require a restart
- The Google OAuth component needs the client ID to initialize

## Testing
1. Open browser console (F12)
2. Look for logs starting with "GoogleOAuth useEffect triggered"
3. You should see "Google script ready, initializing..."
4. The Google button should appear and be clickable

## If Still Not Working
Check the browser console for errors and make sure:
1. Your .env file is in the correct location (client folder)
2. The variable name is exactly `REACT_APP_GOOGLE_CLIENT_ID`
3. You've restarted the React app after creating the .env file
4. Your Google Cloud Console OAuth credentials are properly configured
