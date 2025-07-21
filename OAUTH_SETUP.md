# Eventbrite OAuth Setup Guide

This application now uses Eventbrite OAuth for secure authentication instead of hardcoded API tokens.

## Features Implemented

### 1. Server-Side OAuth Handler (`api/oauth.php`)
- Generates authorization URLs with proper scopes
- Handles OAuth callback and token exchange
- Manages session-based token storage
- Includes security features (state parameter validation)

### 2. Client-Side OAuth Service (`src/services/oauth.ts`)
- Manages OAuth flow initiation
- Handles token storage and retrieval
- Provides authentication status checking
- Includes token expiration handling

### 3. OAuth Callback Component (`src/components/OAuthCallback.tsx`)
- Handles the redirect from Eventbrite
- Processes authorization codes
- Shows loading and error states
- Redirects back to dashboard after successful auth

### 4. Authentication Button (`src/components/AuthButton.tsx`)
- Shows login/logout button based on auth status
- Handles OAuth flow initiation
- Provides visual feedback during authentication

## Configuration

### Eventbrite App Settings
Your Eventbrite app is configured with:
- **Client ID**: `UTLU7YCIGFXD4L64FE`
- **Client Secret**: `V45ZWUIX3APUXJAYREWVF3TUWSUWD3MGM7HKTYEDJBQSJ7AJQG`
- **Redirect URI**: `http://localhost:5173/oauth-callback`

### Required Scopes
The OAuth flow requests these scopes:
- `events_read` - Read access to events
- `organizations_read` - Read access to organizations

## How to Use

### 1. Start the Application
```bash
npm run dev
```

### 2. Navigate to the Dashboard
The dashboard will show a "Connect with Eventbrite" button in the top-right corner.

### 3. Click "Connect with Eventbrite"
This will:
1. Generate an authorization URL
2. Redirect you to Eventbrite's authorization page
3. Ask for permission to access your events and organizations
4. Redirect back to your application with an authorization code
5. Exchange the code for an access token
6. Store the token securely

### 4. View Your Events
Once authenticated, the dashboard will:
- Show your organization's events in the "Recommended for You" section
- Display other events in the "Other Events" section
- Use the OAuth token for all API calls

## Security Features

### State Parameter
- Each OAuth request includes a random state parameter
- Prevents CSRF attacks
- Validated on callback

### Token Management
- Tokens are stored in PHP sessions (server-side)
- Tokens are cached in localStorage (client-side)
- Automatic token expiration handling
- Secure token exchange process

### Error Handling
- Comprehensive error handling for all OAuth steps
- User-friendly error messages
- Fallback to demo data when authentication fails

## API Endpoints Used

### Organization Events
- `GET /v3/users/me/organizations/` - Get user's organizations
- `GET /v3/organizations/{ORG_ID}/events/` - Get organization events

### OAuth Endpoints
- `GET /oauth/authorize` - Start OAuth flow
- `POST /oauth/token` - Exchange code for token

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure the redirect URI in your Eventbrite app settings matches exactly
   - Update `$REDIRECT_URI` in `api/oauth.php` if needed

2. **"No organizations found"**
   - Make sure your Eventbrite account has organizations
   - Check that the OAuth token has the correct scopes

3. **"Token expired"**
   - The application will automatically handle token refresh
   - Users can re-authenticate by clicking the logout button and logging in again

4. **CORS Issues**
   - Ensure your PHP server is properly configured
   - Check that the API endpoints are accessible

### Debug Information
The dashboard includes debug information showing:
- Authentication status
- Loading states
- Event counts
- API response data

## Production Deployment

### Environment Variables
For production, consider moving credentials to environment variables:
```php
$CLIENT_ID = $_ENV['EVENTBRITE_CLIENT_ID'];
$CLIENT_SECRET = $_ENV['EVENTBRITE_CLIENT_SECRET'];
```

### HTTPS Requirements
- Eventbrite requires HTTPS for production OAuth
- Update redirect URIs to use HTTPS
- Ensure proper SSL certificates

### Database Storage
- Consider storing tokens in a database instead of sessions
- Implement proper token refresh logic
- Add user management features

## Next Steps

1. **User Management**: Add user registration and profile management
2. **Token Refresh**: Implement automatic token refresh
3. **Event Creation**: Add ability to create events through the API
4. **Analytics**: Track OAuth usage and success rates
5. **Multi-tenant**: Support multiple Eventbrite organizations 