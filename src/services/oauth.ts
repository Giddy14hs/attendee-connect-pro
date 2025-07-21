export interface OAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface OAuthResponse {
  success: boolean;
  auth_url?: string;
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  message?: string;
}

class OAuthService {
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  
  // Redirect to backend to start OAuth flow
  redirectToAuth(): void {
    window.location.href = '/api/oauth.php?action=authorize';
  }

  // Handle callback (code/state) - backend does the exchange, so just reload token
  async handleCallback(code: string, state: string): Promise<void> {
    // After backend exchanges code, token is stored in session
    // Just fetch the token from backend
    await this.getToken();
  }

  // Get current token from backend or localStorage
  async getToken(): Promise<OAuthToken | null> {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return {
        access_token: this.token,
        expires_in: Math.floor((this.tokenExpiry - Date.now()) / 1000),
        token_type: 'Bearer'
      };
    }
    try {
      const res = await fetch('/api/oauth.php?action=get_token', { credentials: 'include' });
      if (!res.ok) throw new Error('No valid token');
      const data = await res.json();
      this.token = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('eventbrite_token', this.token);
      localStorage.setItem('eventbrite_token_expiry', this.tokenExpiry.toString());
      return {
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type || 'Bearer'
      };
    } catch {
      this.clearToken();
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Logout - clears stored token
  async logout(): Promise<void> {
    this.clearToken();
    // Optionally, call backend to clear session
    // await fetch('/api/oauth.php?action=logout', { credentials: 'include' });
  }

  // Clear token from memory and localStorage
  private clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
    localStorage.removeItem('eventbrite_token');
    localStorage.removeItem('eventbrite_token_expiry');
  }
}

export const oauthService = new OAuthService(); 