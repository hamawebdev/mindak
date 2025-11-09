# Authentication Quick Start Guide

## ✅ Status: Integration Complete

All authentication endpoints are properly integrated with the backend API.

## Quick Setup (3 Steps)

### 1. Create `.env.local`
```bash
# Copy and paste this into .env.local in project root
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=mindak studio
API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Start Backend API
Ensure your backend is running on `http://localhost:8000`

### 3. Start Frontend
```bash
npm run dev
```

## Test Authentication

### Login
1. Navigate to `http://localhost:3000/auth/v1/login`
2. Enter credentials from your backend
3. Should redirect to `/dashboard` on success

### Dashboard Access
- Visit `http://localhost:3000/dashboard`
- Should redirect to login if not authenticated
- Should show dashboard if authenticated

## API Endpoints (Backend)

All endpoints use base URL: `http://localhost:8000`

### Public Endpoints
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Protected Endpoints (Require Bearer Token)
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout
- `PUT /api/v1/auth/change-password` - Change password

## Token Storage

### Access Token
- **Location**: `localStorage.admin_access_token`
- **Type**: JWT
- **Lifetime**: 1 day (default)
- **Usage**: Authorization header for API requests

### Refresh Token
- **Location**: `localStorage.admin_refresh_token`
- **Type**: JWT
- **Lifetime**: 30 days (default)
- **Usage**: Refresh access token when expired

## Authentication Flow

```
Login → Store Tokens → Access Dashboard → Token Expires → Auto Refresh → Continue
```

## Code Examples

### Login
```typescript
import { login } from "@/lib/api/admin/auth";

const response = await login({
  email: "admin@example.com",
  password: "password123"
});

// Response: { user, token, refreshToken }
```

### Get Current User
```typescript
import { getCurrentUser } from "@/lib/api/admin/auth";

const user = await getCurrentUser();
// Returns: { id, username, email, role }
```

### Logout
```typescript
import { logout } from "@/lib/api/admin/auth";

await logout();
// Clears tokens and redirects to login
```

### Protect a Page
```typescript
"use client";

import { useRequireAdmin } from "@/hooks/use-auth";

export default function AdminPage() {
  const { user } = useRequireAdmin();
  
  return <div>Welcome {user?.username}</div>;
}
```

## Route Protection

### Automatic Protection
- `/dashboard/*` - Protected by `DashboardAuthProvider`

### Manual Protection
Use auth hooks in your components:

```typescript
// Require any authenticated user
const { user } = useRequireAuth();

// Require admin role
const { user } = useRequireAdmin();

// Check auth without redirecting
const { isAuthenticated, user } = useAuth();
```

## Common Issues

### "Network Error"
- ✅ Check backend is running on `localhost:8000`
- ✅ Check `.env.local` has correct API URL

### "401 Unauthorized"
- ✅ Login again (token may be expired)
- ✅ Check JWT_SECRET matches backend

### "CORS Error"
- ✅ Backend must allow `http://localhost:3000` origin

### Redirect Loop
- ✅ Clear localStorage in browser DevTools
- ✅ Login again with valid credentials

## File Locations

### Auth Components
- `src/app/(agency)/auth/_components/login-form.tsx` - Login form
- `src/app/(agency)/auth/v1/login/page.tsx` - Login page

### Auth API
- `src/lib/api/admin/auth.ts` - Auth API functions
- `src/lib/api/admin-client.ts` - API client with token management

### Auth State
- `src/stores/auth/auth-store.ts` - Zustand auth store
- `src/hooks/use-auth.ts` - Auth hooks

### Route Protection
- `src/app/(main)/dashboard/_components/auth-provider.tsx` - Dashboard guard
- `src/app/(main)/dashboard/layout.tsx` - Dashboard layout with auth

## Documentation

- **Full Setup**: `AUTH_INTEGRATION_SETUP.md`
- **API Docs**: `docs/AUTH_DOCUMENTATION.md`
- **Admin API**: `docs/api/ADMIN_API_DOCUMENTATION.md`

## Next Steps

1. ✅ Setup complete
2. 🔄 Test login flow
3. 🔄 Test dashboard access
4. 🔄 Test logout
5. 🔄 Test token refresh (wait for expiration)

## Support

Check these in order:
1. Backend logs for API errors
2. Browser console for client errors
3. Network tab for request/response details
4. localStorage for token presence
