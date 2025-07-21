import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { oauthService } from '@/services/oauth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      if (success === '1') {
        setStatus('success');
        setMessage('Authentication successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authorization code or state parameter');
          return;
        }

        await oauthService.handleCallback(code, state);
        // --- Begin Eventbrite user info fetch and backend save ---
        const tokenData = await oauthService.getToken();
        const accessToken = tokenData?.access_token;
        if (accessToken) {
          try {
            // Fetch Eventbrite user profile
            const userRes = await fetch('https://www.eventbriteapi.com/v3/users/me/', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (!userRes.ok) throw new Error('Failed to fetch Eventbrite user profile');
            const eventbriteUser = await userRes.json();
            const email =
              eventbriteUser.email ||
              (eventbriteUser.emails && eventbriteUser.emails[0]?.email) ||
              '';
            const fullName =
              eventbriteUser.name ||
              [eventbriteUser.first_name, eventbriteUser.last_name].filter(Boolean).join(' ') ||
              '';
            // Send to backend
            const backendRes = await fetch('/api/user_api.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'eventbrite_login',
                eventbrite_id: eventbriteUser.id,
                full_name: fullName,
                email
              })
            });
            const backendUser = await backendRes.json();
            if (backendRes.ok) {
              localStorage.setItem('user', JSON.stringify(backendUser));
            } else {
              setStatus('error');
              setMessage(backendUser.error || 'Failed to save user in backend');
              return;
            }
          } catch (err) {
            setStatus('error');
            setMessage(err instanceof Error ? err.message : 'Eventbrite login failed');
            return;
          }
        }
        // --- End Eventbrite user info fetch and backend save ---
        setStatus('success');
        setMessage('Authentication successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };
    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            )}
            
            {status === 'success' && (
              <div className="text-green-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {status === 'error' && (
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Authentication Failed'}
            </h2>
            
            <p className="text-gray-600 mb-6">{message}</p>
            
            {status === 'error' && (
              <div className="space-y-3">
                <Button 
                  onClick={() => oauthService.redirectToAuth()}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback; 