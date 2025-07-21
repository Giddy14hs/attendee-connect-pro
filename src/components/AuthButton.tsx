import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { oauthService } from '@/services/oauth';

const AuthButton: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setIsAuthenticated(await oauthService.isAuthenticated());
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
  // Use the absolute backend URL for OAuth
  window.location.href = 'http://localhost:8000/api/oauth.php?action=authorize';
};

  const handleLogout = async () => {
    setLoading(true);
    await oauthService.logout();
    setIsAuthenticated(false);
    setLoading(false);
  };

  if (loading) return <Button disabled>Checking...</Button>;

  if (isAuthenticated) {
    return <Button onClick={handleLogout} variant="outline">Logout</Button>;
  }

  return (
    <Button onClick={handleLogin} className="bg-blue-600 text-white">
      Login with Eventbrite
    </Button>
  );
};

export default AuthButton; 