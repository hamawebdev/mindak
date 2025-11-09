# Authentication Documentation

## Overview

The authentication system provides secure user authentication and authorization using JWT (JSON Web Tokens) with refresh tokens. The system supports role-based access control (RBAC) with admin and user roles, password management, and token refresh mechanisms.

## Table of Contents

- [Architecture](#architecture)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Token Management](#token-management)
- [Middleware](#middleware)
- [Security Features](#security-features)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Architecture

### Components

1. **JWT Authenticator** (`JwtAuthenticator`)
   - Handles user authentication via email/password
   - Generates and validates JWT access tokens
   - Retrieves authenticated user from token

2. **Use Cases**
   - `LoginUseCase`: Authenticates users and generates tokens
   - `RefreshTokenUseCase`: Refreshes access tokens using refresh tokens
   - `GetCurrentUserUseCase`: Retrieves current authenticated user
   - `ForgotPasswordUseCase`: Generates password reset tokens
   - `ResetPasswordUseCase`: Resets password using reset token
   - `ChangePasswordUseCase`: Changes password for authenticated users
   - `LogoutUseCase`: Revokes refresh tokens

3. **Middleware**
   - `CurrentUserMiddleware`: Extracts and validates JWT token, sets `req.user`
   - `AuthenticatedMiddleware`: Ensures user is authenticated
   - `AdminMiddleware`: Ensures user has admin role

4. **Repositories**
   - `UserRepository`: User data access
   - `RefreshTokenRepository`: Refresh token storage and management
   - `PasswordResetTokenRepository`: Password reset token management

## Authentication Flow

### Login Flow

```
1. Client sends POST /api/v1/auth/login with email and password
2. Server validates credentials
3. Server generates:
   - Access token (JWT, short-lived, default: 1 day)
   - Refresh token (JWT, long-lived, default: 30 days)
4. Refresh token is stored in database
5. Server returns both tokens and user information
```

### Token Refresh Flow

```
1. Client sends POST /api/v1/auth/refresh with refresh token
2. Server validates refresh token:
   - Checks if token exists in database
   - Verifies token is not revoked
   - Verifies token is not expired
   - Validates JWT signature
3. Server generates new access and refresh tokens
4. Old refresh token is revoked
5. New refresh token is stored in database
6. Server returns new tokens
```

### Password Reset Flow

```
1. Client sends POST /api/v1/auth/forgot-password with email
2. Server generates secure reset token (if user exists)
3. Reset token is stored in database with expiration
4. Server sends success response (email sending is TODO)
5. Client sends POST /api/v1/auth/reset-password with token and new password
6. Server validates token and resets password
7. Reset token is marked as used
```

## API Endpoints

### Public Endpoints

#### POST `/api/v1/auth/login`

Authenticates a user and returns access and refresh tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "username",
      "email": "user@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials

---

#### POST `/api/v1/auth/refresh`

Refreshes access and refresh tokens.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid, expired, or revoked refresh token
- `404 Not Found`: User not found

---

#### POST `/api/v1/auth/forgot-password`

Initiates password reset process by generating a reset token.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent"
}
```

**Note:** Always returns success to prevent email enumeration attacks.

---

#### POST `/api/v1/auth/reset-password`

Resets password using a reset token.

**Request Body:**
```json
{
  "token": "reset-token-string",
  "newPassword": "newSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid, expired, or already used reset token
- `404 Not Found`: User not found

---

### Protected Endpoints

All protected endpoints require authentication via Bearer token in the Authorization header.

**Authorization Header:**
```
Authorization: Bearer <access_token>
```

---

#### POST `/api/v1/auth/logout`

Logs out the current user by revoking all refresh tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** Access tokens are stateless JWTs and cannot be invalidated. For production, consider implementing a token blacklist using Redis.

---

#### GET `/api/v1/auth/me`

Retrieves the current authenticated user's information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "username",
    "email": "user@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `403 Forbidden`: User not authenticated

---

#### PUT `/api/v1/auth/change-password`

Changes the password for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password has been changed successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Current password is incorrect
- `403 Forbidden`: User not authenticated
- `404 Not Found`: User not found

**Validation:**
- `newPassword` must be at least 8 characters long

---

#### GET `/api/v1/auth/authenticated`

Checks if the current request is authenticated (does not require authentication).

**Headers (optional):**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "authenticated": true
}
```

Returns `false` if no valid token is provided.

---

## Token Management

### Access Tokens

- **Type:** JWT (JSON Web Token)
- **Lifetime:** Configurable (default: 1 day / 86400 seconds)
- **Storage:** Client-side (localStorage, sessionStorage, or memory)
- **Usage:** Included in `Authorization: Bearer <token>` header for protected endpoints
- **Validation:** Stateless - validated using JWT signature
- **Revocation:** Not supported (stateless tokens). For production, consider implementing a blacklist.

### Refresh Tokens

- **Type:** JWT (JSON Web Token)
- **Lifetime:** Configurable (default: 30 days)
- **Storage:** Database (with revocation support)
- **Usage:** Used to obtain new access tokens when current token expires
- **Validation:** 
  - JWT signature verification
  - Database lookup to check if revoked
  - Expiration check
- **Revocation:** Supported - tokens can be revoked and are stored in database
- **Rotation:** New refresh token is issued on each refresh, old token is revoked

### Password Reset Tokens

- **Type:** Cryptographically secure random token (64 hex characters)
- **Lifetime:** Configurable (default: 24 hours)
- **Storage:** Database
- **Usage:** Single-use token for password reset
- **Validation:**
  - Database lookup
  - Expiration check
  - Usage check (one-time use)
- **Revocation:** Automatically marked as used after successful password reset

## Middleware

### CurrentUserMiddleware

Extracts and validates JWT token from the `Authorization` header and sets `req.user` if valid.

**Behavior:**
- Extracts token from `Authorization: Bearer <token>` header
- Validates token and retrieves user
- Sets `req.user` if token is valid, otherwise `req.user = null`
- Always calls `next()` (does not block request)

**Usage:**
Applied to routes that need optional authentication (e.g., `/authenticated` endpoint).

### AuthenticatedMiddleware

Ensures that a user is authenticated before proceeding.

**Behavior:**
- Checks if `req.user` exists
- Throws `403 Forbidden` if user is not authenticated
- Calls `next()` if user is authenticated

**Usage:**
Applied to protected routes that require authentication.

### AdminMiddleware

Ensures that the authenticated user has admin role.

**Behavior:**
- Checks if `req.user` exists (throws `403 Forbidden` if not)
- Checks if `req.user.role === 'admin'`
- Throws `403 Forbidden` if user is not an admin
- Calls `next()` if user is admin

**Usage:**
Applied to admin-only routes.

## Security Features

### Password Security

- Passwords are hashed using secure hashing algorithms (handled by repository layer)
- Password validation requires minimum 8 characters
- Current password verification required for password changes

### Token Security

- **JWT Signing:** Tokens are signed using HMAC SHA-256
- **Token Expiration:** Both access and refresh tokens have expiration times
- **Refresh Token Rotation:** New refresh token issued on each refresh, old token revoked
- **Token Storage:** Refresh tokens stored in database with revocation support
- **Reset Token Security:** Cryptographically secure random tokens (32 bytes)

### Security Best Practices

1. **Email Enumeration Prevention:** Forgot password endpoint always returns success
2. **Token Revocation:** Refresh tokens can be revoked on logout
3. **Single-Use Reset Tokens:** Password reset tokens are one-time use
4. **Token Expiration:** All tokens have expiration times
5. **Secure Token Generation:** Reset tokens use `crypto.randomBytes()`

### Known Limitations

1. **Access Token Revocation:** Access tokens are stateless and cannot be revoked until expiration
   - **Recommendation:** Implement token blacklist using Redis for production
2. **Email Service:** Password reset emails are not yet implemented
   - **Recommendation:** Integrate email service (SendGrid, AWS SES, etc.)
3. **Rate Limiting:** No rate limiting on authentication endpoints
   - **Recommendation:** Implement rate limiting to prevent brute force attacks

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for signing JWT tokens | - | Yes |
| `JWT_EXPIRES_IN_SECONDS` | Access token expiration time in seconds | `86400` (1 day) | No |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh tokens | `JWT_SECRET` | No |
| `REFRESH_TOKEN_EXPIRES_IN_DAYS` | Refresh token expiration time in days | `30` | No |
| `RESET_TOKEN_EXPIRES_IN_HOURS` | Password reset token expiration time in hours | `24` | No |

### Example `.env` Configuration

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN_SECONDS=86400
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN_DAYS=30
RESET_TOKEN_EXPIRES_IN_HOURS=24
```

## Error Handling

### HTTP Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request data or validation error
- `401 Unauthorized`: Authentication failed or invalid token
- `403 Forbidden`: User not authenticated or insufficient permissions
- `404 Not Found`: Resource not found (e.g., user not found)
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 401
}
```

### Common Error Scenarios

1. **Invalid Credentials**
   - Status: `401 Unauthorized`
   - Message: "Incorrect credentials"

2. **Invalid Token**
   - Status: `401 Unauthorized`
   - Message: "Invalid refresh token" or "Invalid or expired reset token"

3. **Expired Token**
   - Status: `401 Unauthorized`
   - Message: "Refresh token has expired" or "Reset token has expired"

4. **Revoked Token**
   - Status: `401 Unauthorized`
   - Message: "Refresh token has been revoked"

5. **Unauthenticated Request**
   - Status: `403 Forbidden`
   - Message: "User must be authenticated"

6. **Insufficient Permissions**
   - Status: `403 Forbidden`
   - Message: "User must be an admin"

7. **Validation Error**
   - Status: `400 Bad Request`
   - Message: Validation error details

## Best Practices

### Client-Side Implementation

1. **Token Storage:**
   - Store access tokens in memory (most secure) or httpOnly cookies
   - Avoid localStorage for access tokens (XSS vulnerability)
   - Store refresh tokens securely (httpOnly cookies recommended)

2. **Token Refresh:**
   - Implement automatic token refresh before expiration
   - Handle token refresh failures gracefully
   - Retry failed requests after token refresh

3. **Error Handling:**
   - Handle 401 errors by attempting token refresh
   - Redirect to login on authentication failure
   - Display user-friendly error messages

4. **Security:**
   - Never expose tokens in URLs or logs
   - Use HTTPS in production
   - Implement CSRF protection for state-changing operations

### Server-Side Recommendations

1. **Production Enhancements:**
   - Implement token blacklist for access tokens (Redis)
   - Add rate limiting to authentication endpoints
   - Integrate email service for password reset
   - Add logging and monitoring for authentication events
   - Implement account lockout after failed login attempts

2. **Security:**
   - Use strong, unique JWT secrets
   - Rotate secrets periodically
   - Monitor for suspicious authentication patterns
   - Implement IP-based rate limiting

3. **Performance:**
   - Cache user lookups when possible
   - Optimize database queries for token validation
   - Consider using Redis for token storage

## Example Usage

### Login Flow

```javascript
// 1. Login
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const { token, refreshToken } = data;

// Store tokens securely
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
```

### Making Authenticated Requests

```javascript
// 2. Use access token for authenticated requests
const response = await fetch('/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

const userData = await response.json();
```

### Token Refresh

```javascript
// 3. Refresh tokens when access token expires
const refreshResponse = await fetch('/api/v1/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refreshToken: localStorage.getItem('refreshToken')
  })
});

const { data } = await refreshResponse.json();
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

### Password Reset

```javascript
// 4. Request password reset
await fetch('/api/v1/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});

// 5. Reset password with token (received via email)
await fetch('/api/v1/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'reset-token-from-email',
    newPassword: 'newSecurePassword123'
  })
});
```

## Related Documentation

- [API Quick Reference](./QUICK_REFERENCE.md)
- [Admin API Documentation](./ADMIN_API_DOCUMENTATION.md)
- [Client API Documentation](./CLIENT_API_DOCUMENTATION.md)
- [Database Schema](../implementation%20docs/DATABASE_SCHEMA.md)

