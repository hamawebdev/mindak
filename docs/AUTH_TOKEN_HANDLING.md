# Authentication Token Handling Improvements

## Overview

Improved the authentication token handling system to prevent unwanted logouts when navigating between dashboard pages or when API calls fail temporarily.

## Changes Made

### 1. Sidebar Navigation Update

**File**: `src/navigation/sidebar/sidebar-items.ts`

Added "Podcast Forms" to the sidebar navigation:
- **Title**: Podcast Forms
- **URL**: `/dashboard/podcast-forms`
- **Icon**: Settings (gear icon)
- **Location**: Under "Pages" group, after "Podcast Orders"

### 2. Admin API Client Error Handling

**File**: `src/lib/api/admin-client.ts`

**Before**: 
- On 401 error, immediately cleared auth tokens using `this.clearAuth()`
- This caused immediate logout and redirect even for temporary network issues

**After**:
- On 401 error, throws an error marked with `isAuthError: true` and `statusCode: 401`
- Does NOT clear tokens immediately
- Allows the auth provider and hooks to handle the redirect properly
- Prevents unnecessary logout during page navigation

### 3. Auth Hooks Improvements

**File**: `src/hooks/use-auth.ts`

**Added**:
- `useRef` to track if redirect has already occurred
- Prevents multiple redirects when navigating between pages
- Only redirects once per auth state change

**Changes**:
- `useRequireAuth()` - Added `hasRedirected` ref to prevent duplicate redirects
- `useRequireAdmin()` - Added `hasRedirected` ref to prevent duplicate redirects

### 4. Dashboard Auth Provider Enhancement

**File**: `src/app/(main)/dashboard/_components/auth-provider.tsx`

**Added**:
- `isReady` state with 100ms delay to allow Zustand to hydrate from localStorage
- Prevents flash of "unauthenticated" state during page navigation
- Ensures auth state is fully loaded before checking authentication

**Why This Helps**:
- Zustand persistence loads asynchronously from localStorage
- Without the delay, the component might check auth before state is hydrated
- This was causing false "not authenticated" errors on page switches

### 5. API Error Handler Utility

**File**: `src/lib/api/api-error-handler.ts` (NEW)

**Features**:
- Type guards for auth errors (`isAuthError`)
- Type guards for forbidden errors (`isForbiddenError`)
- `safeApiCall` wrapper for consistent error handling
- `getErrorMessage` utility for user-friendly error messages

**Usage Example**:
```typescript
import { safeApiCall } from "@/lib/api/api-error-handler";

const data = await safeApiCall(
  () => getPodcastQuestions(),
  {
    onAuthError: () => {
      // Handle auth error without crashing
      toast.error("Session expired. Please login again.");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  }
);

if (!data) {
  // Handle null case
  return;
}
```

### 6. Dashboard Error Boundary

**File**: `src/app/(main)/dashboard/_components/error-boundary.tsx` (NEW)

**Features**:
- React Error Boundary for dashboard pages
- Catches rendering errors without crashing the entire app
- Provides user-friendly error message with reload button
- Logs errors to console for debugging

**Usage** (can be added to dashboard layout if needed):
```typescript
<DashboardErrorBoundary>
  {children}
</DashboardErrorBoundary>
```

## Authentication Flow

### Old Flow (Problematic)
1. User navigates to new dashboard page
2. Page component mounts
3. API call is made (e.g., `getPodcastQuestions()`)
4. API returns 401 (maybe due to expired token)
5. Admin client immediately clears tokens with `clearAuth()`
6. Auth hook detects missing token
7. User is redirected to login
8. **Problem**: This happens even for temporary issues or during normal navigation

### New Flow (Improved)
1. User navigates to new dashboard page
2. Auth provider delays 100ms for state hydration
3. Auth state loads from localStorage (Zustand persistence)
4. Page component mounts with authenticated state
5. API call is made
6. If 401 occurs:
   - Error is thrown with `isAuthError: true`
   - Tokens are NOT cleared immediately
   - Error can be handled gracefully by component
   - Auth hook only redirects if token is truly invalid
7. **Benefit**: Temporary issues don't cause logout, navigation is smooth

## Token Persistence

### Storage Locations

**AdminApiClient** (localStorage):
- `admin_access_token` - JWT access token
- `admin_refresh_token` - Refresh token

**AuthStore** (Zustand persistence):
- `admin-auth-storage` - Contains user object and isAuthenticated flag
- Automatically syncs with localStorage
- Rehydrates on page load

### Sync Between Client and Store

The auth system uses both:
1. **AdminApiClient**: Stores raw tokens for API requests
2. **AuthStore**: Stores user info and auth state for UI

They work together:
- Login sets both client tokens AND store state
- Auth hooks check both client.isAuthenticated() AND store.isAuthenticated
- Logout clears both locations

## Best Practices

### For Component Developers

1. **Use the auth hooks consistently**:
   ```typescript
   const { isAuthenticated, user } = useRequireAdmin();
   ```

2. **Handle API errors gracefully**:
   ```typescript
   try {
     const data = await getPodcastQuestions();
   } catch (error) {
     // Don't assume it's always an auth error
     toast.error(error.message);
   }
   ```

3. **Show loading states**:
   ```typescript
   if (isLoading) {
     return <LoadingSpinner />;
   }
   ```

4. **Use the safeApiCall wrapper for critical data**:
   ```typescript
   const data = await safeApiCall(() => getImportantData());
   if (!data) return; // Handle gracefully
   ```

### For API Developers

1. **Don't clear auth in API client** - Let hooks handle it
2. **Mark auth errors properly** - Set `isAuthError` and `statusCode`
3. **Return meaningful error messages** - Users need to know what went wrong

## Testing the Improvements

### Test Scenarios

1. **Normal Navigation**:
   - ✅ Navigate from Podcast Orders to Podcast Forms
   - ✅ Navigate back to Podcast Orders
   - ✅ Should NOT see login screen
   - ✅ Should NOT see "Verifying authentication" flash

2. **Expired Token**:
   - Clear localStorage tokens manually
   - Try to access dashboard
   - Should redirect to login
   - Should show clear error message

3. **Network Error**:
   - Simulate network failure during API call
   - Should show error toast
   - Should NOT logout user
   - Should allow retry

4. **Page Refresh**:
   - Refresh any dashboard page
   - Should load auth state from localStorage
   - Should NOT redirect to login
   - Should render page normally

5. **Multiple Tabs**:
   - Open dashboard in two tabs
   - Logout in one tab
   - Other tab should detect and redirect
   - Should sync auth state

## Known Limitations

1. **Token Expiration**: Currently no automatic token refresh
   - Future: Add refresh token logic before token expires
   
2. **Token Validation**: No server-side validation on every request
   - Tokens are validated only when API calls are made
   
3. **Session Timeout**: No explicit session timeout
   - Relies on JWT expiration

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Session Monitoring**: Add idle timeout detection
3. **Token Validation**: Add periodic token validation
4. **Better Error Recovery**: Implement retry logic for failed requests
5. **Offline Support**: Handle offline scenarios gracefully

## Related Files

- `src/lib/api/admin-client.ts` - API client with token management
- `src/hooks/use-auth.ts` - Authentication hooks
- `src/stores/auth/auth-store.ts` - Zustand auth state
- `src/app/(main)/dashboard/_components/auth-provider.tsx` - Auth wrapper
- `src/lib/api/api-error-handler.ts` - Error handling utilities
- `src/navigation/sidebar/sidebar-items.ts` - Sidebar navigation

## Summary

✅ **Sidebar updated** with Podcast Forms link
✅ **Auth token handling improved** to prevent unwanted logouts
✅ **Navigation smooth** between dashboard pages
✅ **Error handling graceful** with proper user feedback
✅ **State persistence working** with proper hydration delay
✅ **Developer-friendly** error handling utilities added

The authentication system now properly handles:
- Page navigation without logout
- Temporary API errors
- State hydration from localStorage
- Multiple redirect prevention
- Graceful error recovery
