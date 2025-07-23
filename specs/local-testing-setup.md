# Local Testing Setup

## Overview

The authentication system now supports local testing mode using a hardcoded token from environment variables. This allows you to test the authentication flow without requiring a full Cloudflare Access setup.

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root with the following content:

```bash
# Local testing token (any string will work for testing)
NEXT_PUBLIC_LOCAL_TEST_TOKEN=local-test-token-12345

# Cloudflare Configuration (for production)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access the Application

Navigate to `http://localhost:3000` and you should see:

- ✅ **Authentication Working**: You'll be automatically logged in as "Local Test User"
- 🧪 **Testing Indicator**: A yellow banner showing "Local Testing Mode"
- 🔐 **Protected Features**: All authentication-protected features will work

## How It Works

### Local Testing Mode Detection

The system detects local testing mode by checking for the `NEXT_PUBLIC_LOCAL_TEST_TOKEN` environment variable:

```typescript
export function isLocalTestingMode(): boolean {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_LOCAL_TEST_TOKEN;
}
```

### Hardcoded User Data

When in local testing mode, the system uses hardcoded user data:

```typescript
const LOCAL_TEST_USER: CloudflareUser = {
  sub: 'local-test-user',
  email: 'test@example.com',
  name: 'Local Test User',
  picture: undefined,
  aud: 'local-test-app',
  iss: 'local-test',
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
  iat: Math.floor(Date.now() / 1000)
};
```

### Authentication Flow

1. **Client-Side**: UserContext checks for local testing mode and uses the hardcoded token
2. **Middleware**: Bypasses Cloudflare Access checks and injects test user headers
3. **API Routes**: Accept the test user data and process requests normally
4. **UI**: Shows testing indicator and works with test user data

## Testing Features

### ✅ What Works in Local Testing Mode

1. **Authentication State**: User is automatically logged in
2. **Protected Routes**: All API routes work with test user
3. **Image Generation**: Can generate images with test user data
4. **User-Specific Storage**: Images stored under test user email
5. **Logout**: Logout clears user state (no redirect in local mode)
6. **UI Components**: All authentication UI works normally

### 🔄 Differences from Production

1. **No Cloudflare Access**: No actual Cloudflare Access integration
2. **Hardcoded User**: Always uses "Local Test User" data
3. **No Cookie Management**: Doesn't set/clear Cloudflare cookies
4. **Testing Indicator**: Shows yellow banner indicating test mode
5. **Simplified Logout**: Just clears state, no redirect

## Production vs Local Testing

| Feature           | Production            | Local Testing    |
| ----------------- | --------------------- | ---------------- |
| Authentication    | Cloudflare Access     | Hardcoded Token  |
| User Data         | Real JWT Token        | Hardcoded User   |
| Cookie Management | Full CF_Authorization | None             |
| Logout            | CF Access Logout      | State Clear Only |
| User Isolation    | Real User IDs         | Test User ID     |
| Security          | Full JWT Validation   | Token Check Only |

## Troubleshooting

### Common Issues

1. **Not Logged In**: Check that `NEXT_PUBLIC_LOCAL_TEST_TOKEN` is set in `.env.local`
2. **Build Errors**: Ensure the environment variable is properly set
3. **API Errors**: Check that the middleware is working correctly

### Debug Steps

1. Check browser console for authentication errors
2. Verify environment variable is loaded: `console.log(process.env.NEXT_PUBLIC_LOCAL_TEST_TOKEN)`
3. Check network tab for API request headers
4. Verify user context is populated correctly

## Security Notes

⚠️ **Important**: Local testing mode is for development only. Never use this in production.

- The hardcoded token bypasses all security checks
- User data is not real and should not be used for testing sensitive features
- This mode is designed for UI/UX testing only

## Next Steps

Once local testing is working:

1. **Test UI Flow**: Verify all authentication UI works correctly
2. **Test API Integration**: Ensure image generation and storage work
3. **Test Error Handling**: Verify error states work properly
4. **Deploy to Production**: Set up real Cloudflare Access for production use

---

*Last Updated: July 25, 2024*
