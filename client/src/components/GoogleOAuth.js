import React, { useEffect, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleOAuth = ({ onSuccess, text = "Continue with Google", variant = "signin" }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    console.log('GoogleOAuth useEffect triggered');
    
    // Function to check and initialize
    const checkAndInitialize = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log('Google script ready, initializing...');
        initializeGoogleSignIn();
        return true;
      }
      return false;
    };

    // Try to initialize immediately
    if (checkAndInitialize()) {
      return;
    }

    // If not ready, wait for it with a timeout
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    const checkInterval = setInterval(() => {
      attempts++;
      console.log(`Checking for Google script... attempt ${attempts}`);
      
      if (checkAndInitialize()) {
        clearInterval(checkInterval);
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.error('Google script not loaded after 5 seconds');
        clearInterval(checkInterval);
        renderFallbackButton();
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    console.log('=== Initializing Google Sign-In ===');
    console.log('Window.google exists:', !!window.google);
    console.log('Window.google.accounts exists:', !!(window.google && window.google.accounts));
    console.log('Window.google.accounts.id exists:', !!(window.google && window.google.accounts && window.google.accounts.id));
    console.log('Button ref exists:', !!buttonRef.current);
    console.log('Button ref element:', buttonRef.current);
    
    if (window.google && buttonRef.current) {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      console.log('Client ID:', clientId);
      console.log('Client ID type:', typeof clientId);
      console.log('Client ID length:', clientId ? clientId.length : 0);
      
      if (!clientId) {
        console.error('Google OAuth Client ID not found. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file');
        console.log('Available environment variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
        // Render a fallback button
        renderFallbackButton();
        return;
      }

      console.log('About to initialize Google OAuth...');
      
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true, // Fix for Cross-Origin-Opener-Policy
          prompt_parent_id: buttonRef.current.id || 'google-oauth-button',
          prompt_callback: (notification) => {
            console.log('Google OAuth prompt notification:', notification);
            if (notification.isNotDisplayed()) {
              console.error('Google OAuth not displayed:', notification.getNotDisplayedReason());
            } else if (notification.isSkippedMoment()) {
              console.error('Google OAuth skipped:', notification.getSkippedReason());
            } else if (notification.isDismissedMoment()) {
              console.error('Google OAuth dismissed:', notification.getDismissedReason());
            }
          }
        });

        console.log('Google OAuth initialized successfully, rendering button...');

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: variant === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
        });

        console.log('Google OAuth button rendered successfully!');
      } catch (error) {
        console.error('Error initializing Google OAuth:', error);
        renderFallbackButton();
      }
    } else {
      console.error('Cannot initialize Google OAuth:', {
        googleExists: !!window.google,
        buttonRefExists: !!buttonRef.current
      });
    }
  };

  const renderFallbackButton = () => {
    if (buttonRef.current) {
      buttonRef.current.innerHTML = `
        <button 
          type="button" 
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onclick="alert('Google OAuth not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file')"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      `;
    }
  };

  const handleCredentialResponse = (response) => {
    console.log('=== Google OAuth Response Debug ===');
    console.log('Full response:', response);
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response));
    console.log('Credential exists:', !!response.credential);
    console.log('Credential value:', response.credential);
    
    if (response.credential) {
      console.log('✅ Credential received, calling onSuccess...');
      console.log('onSuccess function:', onSuccess);
      console.log('onSuccess type:', typeof onSuccess);
      
      // Test the credential before calling onSuccess
      console.log('Testing credential:', {
        length: response.credential.length,
        startsWith: response.credential.substring(0, 20) + '...',
        isValid: response.credential.length > 100
      });
      
      onSuccess(response.credential);
    } else {
      console.error('❌ No credential in response:', response);
      console.error('Response structure:', JSON.stringify(response, null, 2));
      
      // Check if this is an error response
      if (response.error) {
        console.error('Google OAuth error:', response.error);
      }
    }
  };

  return (
    <div className="w-full">
      <div ref={buttonRef} id="google-oauth-button" className="w-full" />
    </div>
  );
};

export default GoogleOAuth;
