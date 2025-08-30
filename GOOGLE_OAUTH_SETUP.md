# Google OAuth Setup Guide

This guide will help you set up Google OAuth for your MERN authentication system.

## Prerequisites

1. A Google Cloud Console account
2. A Google Cloud Project
3. Google OAuth 2.0 credentials

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity Services API

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses for testing)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Copy the Client ID and Client Secret

## Step 4: Update Environment Variables

### Server (.env file)
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Client (.env file)
```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
REACT_APP_API_URL=http://localhost:5000/api
```

**Important**: The client-side only needs the Client ID, never the Client Secret!

## Step 5: Test the Integration

1. Start your server: `npm run dev` (in server directory)
2. Start your client: `npm start` (in client directory)
3. Go to `/login` or `/register`
4. Click the "Continue with Google" button
5. Complete the Google OAuth flow

## Features

- **Automatic Account Creation**: New Google users get accounts created automatically
- **Profile Picture**: Google profile pictures are automatically saved
- **Email Verification**: Google users are automatically verified
- **Seamless Login**: Existing Google users can log in with one click
- **Password-Free**: Google users don't need passwords

## Security Notes

1. **Never expose Client Secret** on the client side
2. **Always verify tokens** on the server side
3. **Use HTTPS** in production
4. **Validate redirect URIs** to prevent open redirect attacks

## Troubleshooting

### Common Issues

1. **"popup_closed_by_user"**: User closed the OAuth popup
2. **"access_denied"**: User denied permission
3. **"invalid_client"**: Check your Client ID configuration
4. **"redirect_uri_mismatch"**: Verify redirect URIs in Google Console

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify environment variables are loaded
3. Check server logs for authentication errors
4. Ensure Google APIs are enabled in Cloud Console

## Production Deployment

1. Update redirect URIs to your production domain
2. Use HTTPS for all OAuth flows
3. Set appropriate OAuth consent screen settings
4. Monitor OAuth usage in Google Cloud Console

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
