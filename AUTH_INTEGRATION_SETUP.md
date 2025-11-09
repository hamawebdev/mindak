# Authentication Integration Setup

## ✅ Integration Complete

The authentication system has been successfully integrated with the backend API as documented in `docs/AUTH_DOCUMENTATION.md`.

## Changes Made

### 1. **API Endpoint Corrections**
- **Fixed**: Changed from `/api/v1/admin/auth/*` to `/api/v1/auth/*`
- **Endpoints now match backend documentation**:
  - `POST /api/v1/auth/login` - User login
  - `POST /api/v1/auth/refresh` - Token refresh
  - `POST /api/v1/auth/logout` - User logout
  - `GET /api/v1/auth/me` - Get current user

### 2. **Response Structure Alignment**
Updated `AuthResponse` type to match backend:
```typescript
// Before
interface AuthResponse {
  accessToken: string;
  user: { id, email, role };
}

// After (matches backend)
interface AuthResponse {
  user: { id, username, email, role };
  token: string;           // Access token
  refreshToken: string;    // Refresh token
}
```

### 3. **Token Management**
- **Added refresh token storage** in `AdminApiClient`
- **Both tokens now stored** in localStorage:
  - `admin_access_token` - Access token (JWT)
  - `admin_refresh_token` - Refresh token (JWT)
- **Token rotation implemented** on refresh

### 4. **Auth Store Updates**
- Added `username` field to User interface
- Updated to match backend user structure

### 5. **Environment Configuration**
Added `NEXT_PUBLIC_API_URL` to `.env.example`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Required Setup

### 1. Create `.env.local` File

Create a `.env.local` file in the project root with:

```bash
# Environment
NODE_ENV=development

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=mindak studio

# Backend API URL (used by Next.js server-side)
API_BASE_URL=http://localhost:8000

# Public API URL (used by frontend client)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important**: Use `localhost:8000`, not `0.0.0.0:8000` for API URLs.

### 2. Verify Backend is Running

Ensure your backend API is running on port 8000:

```bash
# Test backend directly
curl http://localhost:8000/api/v1/auth/login
```

### 3. Restart Development Server

After creating `.env.local`:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Authentication Flow

### Login Flow
```
1. User submits email/password via LoginForm
2. POST /api/v1/auth/login
3. Backend returns: { user, token, refreshToken }
4. Client stores both tokens in localStorage
5. Client stores user in Zustand auth store
6. Redirect to /dashboard
```

### Token Refresh Flow
```
1. Access token expires
2. Client calls refreshToken()
3. POST /api/v1/auth/refresh with refreshToken
4. Backend returns: { accessToken, refreshToken }
5. Old refresh token revoked
6. New tokens stored in localStorage
```

### Logout Flow
```
1. User clicks logout
2. POST /api/v1/auth/logout (revokes refresh tokens)
3. Clear tokens from localStorage
4. Clear user from auth store
5. Redirect to login
```

## API Client Features

### AdminApiClient
- **Automatic token injection** in Authorization header
- **401 handling** - Clears auth on unauthorized
- **403 handling** - Admin access required errors
- **Token storage** - localStorage for persistence
- **Refresh token support** - Full token rotation

## Testing Authentication

### 1. Test Login
```typescript
// Use existing test user from backend
const response = await login({
  email: "test@example.com",
  password: "password123"
});
```

### 2. Test Protected Routes
```typescript
// Get current user
const user = await getCurrentUser();
```

### 3. Test Token Refresh
```typescript
// Refresh tokens
const tokens = await refreshToken();
```

### 4. Test Logout
```typescript
// Logout user
await logout();
```

## Security Considerations

### Implemented
- ✅ JWT access tokens with expiration
- ✅ Refresh token rotation
- ✅ Secure token storage (localStorage)
- ✅ Automatic token injection
- ✅ 401/403 error handling
- ✅ Token revocation on logout

### Recommended for Production
- 🔒 **httpOnly cookies** for token storage (more secure than localStorage)
- 🔒 **Token blacklist** using Redis for access token revocation
- 🔒 **Rate limiting** on auth endpoints
- 🔒 **HTTPS only** in production
- 🔒 **CSRF protection** for state-changing operations
- 🔒 **Account lockout** after failed login attempts

## Route Protection

### Dashboard Protection
The dashboard is now protected with authentication:

```typescript
// src/app/(main)/dashboard/layout.tsx
<DashboardAuthProvider>
  {/* Dashboard content */}
</DashboardAuthProvider>
```

### Auth Hooks Available

#### `useRequireAuth()`
Redirects to login if not authenticated:
```typescript
const { isAuthenticated, user } = useRequireAuth();
```

#### `useRequireAdmin()`
Redirects to login if not authenticated, or to `/unauthorized` if not admin:
```typescript
const { isAuthenticated, user } = useRequireAdmin();
```

#### `useAuth()`
Get auth state without redirecting:
```typescript
const { isAuthenticated, user, isLoading, error, hasToken } = useAuth();
```

### Protected Routes
- `/dashboard/*` - Requires admin authentication
- All dashboard routes automatically protected by `DashboardAuthProvider`

### Public Routes
- `/auth/v1/login` - Login page
- `/auth/v1/register` - Registration page
- `/unauthorized` - Unauthorized access page

## File Changes Summary

### Modified Files
1. `src/types/admin-api.ts` - Updated AuthResponse type
2. `src/lib/api/admin-client.ts` - Added refresh token management
3. `src/lib/api/admin/auth.ts` - Fixed endpoints and token handling
4. `src/stores/auth/auth-store.ts` - Added username field
5. `src/app/(agency)/auth/_components/login-form.tsx` - Updated toast message
6. `src/hooks/use-auth.ts` - Fixed login redirect paths
7. `src/app/(main)/dashboard/layout.tsx` - Added DashboardAuthProvider
8. `.env.example` - Added NEXT_PUBLIC_API_URL

### New Files
1. `src/app/(main)/dashboard/_components/auth-provider.tsx` - Dashboard auth guard
2. `AUTH_INTEGRATION_SETUP.md` - This setup guide

### No Breaking Changes
All changes are backward compatible with existing code.

## Troubleshooting

### Issue: "Network Error" or "Failed to fetch"
**Solution**: Ensure backend is running on `http://localhost:8000`

### Issue: "401 Unauthorized"
**Solution**: Check that JWT_SECRET matches between frontend and backend

### Issue: "CORS Error"
**Solution**: Backend must allow `http://localhost:3000` origin

### Issue: Tokens not persisting
**Solution**: Check browser localStorage in DevTools → Application → Local Storage

### Issue: "Invalid refresh token"
**Solution**: Refresh tokens expire after 30 days (default), login again

## Next Steps

1. ✅ **Setup Complete** - Auth integration is ready
2. 🔄 **Test Login Flow** - Try logging in with test credentials
3. 🔄 **Test Protected Routes** - Access dashboard after login
4. 🔄 **Test Token Refresh** - Wait for token expiration or manually trigger
5. 🔄 **Test Logout** - Verify tokens are cleared

## Documentation References

- [AUTH_DOCUMENTATION.md](./docs/AUTH_DOCUMENTATION.md) - Complete auth API documentation
- [ADMIN_API_DOCUMENTATION.md](./docs/api/ADMIN_API_DOCUMENTATION.md) - Admin API reference
- [FIX_ENV_CONFIG.md](./FIX_ENV_CONFIG.md) - Environment configuration guide

## Support

For issues or questions:
1. Check backend logs for API errors
2. Check browser console for client errors
3. Verify environment variables are set correctly
4. Ensure backend and frontend are running on correct ports
