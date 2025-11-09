# Briefing Form Setup Guide

## Overview
The briefing form has been updated to use live API data instead of mock data. It dynamically fetches services and questions from the backend API.

## Prerequisites

1. **Backend API Server**: Ensure your backend API is running on `http://localhost:8080` (or configure a different URL)
2. **Node.js**: Version 18+ recommended

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env.local` file in the project root (if it doesn't exist):

```bash
# Backend API URL (used by Next.js API proxy)
API_BASE_URL=http://localhost:8080
```

**Note**: If your backend runs on a different port or URL, update `API_BASE_URL` accordingly.

### 2. Start the Backend API

Make sure your backend API server is running and accessible at the configured URL. The API should have the following endpoints available:

- `GET /client/services` - Fetch active services
- `GET /client/forms/services/questions` - Fetch form questions
- `POST /client/reservations/services` - Submit service reservation

### 3. Start the Next.js Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 4. Access the Briefing Form

Navigate to: `http://localhost:3000/briefing`

## Architecture

### API Proxy
To avoid CORS issues, requests are routed through a Next.js API proxy:

```
Frontend → /api/proxy/* → Backend API (localhost:8080)
```

**Files**:
- `src/app/api/proxy/[...path]/route.ts` - Next.js API route that proxies requests
- `src/lib/api/client.ts` - API client that uses the proxy
- `src/lib/api/services.ts` - Service-specific API functions

### Type Safety
All API responses are typed using TypeScript interfaces defined in:
- `src/types/api.ts`

## How It Works

### 1. Data Fetching
On component mount, the form:
1. Fetches all active services from `GET /client/services`
2. Fetches general form questions from `GET /client/forms/services/questions`
3. Displays general questions first

### 2. Dynamic Question Loading
When users select services:
1. Service-specific questions are fetched and appended
2. Questions are sorted by their `order` field
3. Form updates dynamically without page reload

### 3. Form Submission
When the user completes all questions:
1. All answers (general + service-specific) are collected
2. Data is submitted to `POST /client/reservations/services`
3. Confirmation screen displays with the confirmation ID

## API Response Format

### Services Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Service Name",
      "description": "Description or null"
    }
  ]
}
```

### Form Questions Response
```json
{
  "success": true,
  "data": {
    "general": [
      {
        "id": "uuid",
        "question_text": "Question text",
        "question_type": "text|email|checkbox|etc",
        "required": true,
        "order": 1,
        "placeholder": "Placeholder or null",
        "help_text": "Help text or null",
        "validation_rules": {},
        "answers": []
      }
    ],
    "services": [
      {
        "service_id": "uuid",
        "service_name": "Service Name",
        "questions": [...]
      }
    ]
  }
}
```

### Submission Request
```json
{
  "serviceIds": ["uuid1", "uuid2"],
  "answers": [
    {
      "questionId": "uuid",
      "value": "answer text",
      "answerId": "uuid or null"
    }
  ]
}
```

### Submission Response
```json
{
  "success": true,
  "data": {
    "confirmationId": "uuid",
    "status": "pending",
    "services": [...],
    "submittedAt": "ISO timestamp",
    "message": "Success message"
  }
}
```

## Troubleshooting

### "Failed to fetch" Error

**Cause**: Backend API is not running or not accessible

**Solution**:
1. Verify backend API is running: `curl http://localhost:8080/client/services`
2. Check `API_BASE_URL` in `.env.local`
3. Ensure no firewall is blocking the connection
4. Check backend logs for errors

### CORS Errors

**Cause**: Direct browser requests to backend API

**Solution**: The Next.js API proxy should handle this automatically. If you still see CORS errors:
1. Verify requests are going through `/api/proxy/*`
2. Check `src/lib/api/client.ts` is using `API_BASE_URL = "/api/proxy"`

### Questions Not Loading

**Cause**: API response format doesn't match expected structure

**Solution**:
1. Check backend API response format matches documentation
2. Verify question objects have all required fields: `id`, `question_text`, `question_type`, `order`, etc.
3. Check browser console for detailed error messages

### Form Submission Fails

**Cause**: Invalid request format or backend validation error

**Solution**:
1. Check browser network tab for the actual request/response
2. Verify all required questions have answers
3. Ensure `serviceIds` array is not empty
4. Check backend logs for validation errors

## Development Notes

- The form uses GSAP for smooth animations between questions
- All state is managed with React hooks
- Form supports multiple question types: text, email, textarea, select, radio, checkbox, date, file, number, url
- Progress is tracked with a visual progress bar at the bottom
- Users can navigate back to previous questions

## Testing Checklist

- [ ] Backend API is running
- [ ] Services load correctly
- [ ] General questions display
- [ ] Service selection works
- [ ] Service-specific questions appear when services selected
- [ ] All question types render correctly
- [ ] Form validation works
- [ ] Submission succeeds
- [ ] Confirmation screen displays
- [ ] Error states display properly
