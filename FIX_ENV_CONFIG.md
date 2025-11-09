# Fix Environment Configuration

## Issue
Your backend API is running on `http://0.0.0.0:8000`, but the Next.js proxy needs to use `localhost` instead of `0.0.0.0`.

## Solution

Update your `.env.local` file:

### ❌ Current (Incorrect)
```bash
API_BASE_URL=http://0.0.0.0:8000
```

### ✅ Correct
```bash
API_BASE_URL=http://localhost:8000
```

## Complete `.env.local` File

```bash
# Environment
NODE_ENV=development

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=mindak studio

# Backend API URL (used by Next.js API proxy)
API_BASE_URL=http://localhost:8000
```

## Why This Change?

- `0.0.0.0` is a special IP that means "all interfaces" - it's used for **binding servers**, not for **connecting to them**
- When your backend binds to `0.0.0.0:8000`, it listens on all network interfaces
- But to **connect** to it, you should use `localhost:8000` or `127.0.0.1:8000`

## After Making Changes

1. **Save** the `.env.local` file
2. **Restart** the Next.js development server:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```
3. **Refresh** the browser and check the console logs

## Verify Backend is Running

Test your backend API directly:

```bash
curl http://localhost:8000/client/services
```

You should see a JSON response with your services.

## Check Proxy Logs

After restarting, check your terminal for proxy logs:
```
[Proxy GET] Forwarding to: http://localhost:8000/client/services
[Proxy GET] Response status: 200
```

If you see errors, they will now be more descriptive.
