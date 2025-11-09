# API Documentation - Frontend Integration

Welcome to the comprehensive API documentation for frontend integration. This documentation covers all user-facing (client) endpoints for services, forms, and reservations.

## 📚 Documentation Files

### 1. [CLIENT_API_DOCUMENTATION.md](./CLIENT_API_DOCUMENTATION.md)
**Complete API Reference**

The main documentation file containing detailed information about all client endpoints:
- Full endpoint specifications
- Request/response schemas with examples
- Validation rules and error handling
- Data types reference
- Integration guidelines and best practices

**Use this when:** You need detailed information about a specific endpoint, request/response structure, or validation rules.

---

### 2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**Quick Reference Guide**

A condensed cheat sheet for quick lookups:
- All endpoints at a glance
- Request/response formats
- Question types table
- HTTP status codes
- Integration checklist
- Example cURL commands

**Use this when:** You need a quick reminder of endpoint URLs, response structures, or common patterns.

---

### 3. [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)
**Code Examples**

Practical implementation examples for various frontend technologies:
- JavaScript (Fetch API)
- React with Axios
- Vue.js
- TypeScript type definitions
- Complete form rendering examples

**Use this when:** You're implementing the API integration and need working code examples.

---

## 🚀 Quick Start

### Step 1: Choose Your Documentation

- **New to the API?** Start with [CLIENT_API_DOCUMENTATION.md](./CLIENT_API_DOCUMENTATION.md)
- **Need a quick lookup?** Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Ready to code?** Check [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)

### Step 2: Set Up Your Environment

**Base URL (Development):**
```
http://localhost:8080
```

**Required Headers:**
```
Content-Type: application/json
```

### Step 3: Test the API

Try a simple request to verify connectivity:

```bash
curl -X GET http://localhost:8080/client/services \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "data": [...]
}
```

---

## 📋 Available Endpoints

### Services
- `GET /client/services` - Get all active services

### Forms
- `GET /client/forms/podcast/questions` - Get podcast form questions
- `GET /client/forms/services/questions` - Get services form questions

### Reservations
- `POST /client/reservations/podcast` - Submit podcast reservation
- `POST /client/reservations/services` - Submit service reservation
- `GET /client/reservations/:confirmationId/confirmation` - Get reservation details

**Note:** All endpoints are public and do not require authentication.

---

## 🎯 Common Use Cases

### Use Case 1: Podcast Reservation Flow

1. **Fetch Questions**
   ```
   GET /client/forms/podcast/questions
   ```

2. **Display Form**
   - Render questions based on `question_type`
   - Respect `order` field
   - Mark `required` fields

3. **Submit Reservation**
   ```
   POST /client/reservations/podcast
   Body: { "answers": [...] }
   ```

4. **Show Confirmation**
   - Display `confirmationId`
   - Show success message

**See:** [CLIENT_API_DOCUMENTATION.md - Podcast Reservation](./CLIENT_API_DOCUMENTATION.md#submit-podcast-reservation)

---

### Use Case 2: Service Reservation Flow

1. **Fetch Services**
   ```
   GET /client/services
   ```

2. **Fetch Questions**
   ```
   GET /client/forms/services/questions
   ```

3. **Display Form**
   - Show general questions
   - Show service-specific questions based on selection

4. **Submit Reservation**
   ```
   POST /client/reservations/services
   Body: { "serviceIds": [...], "answers": [...] }
   ```

5. **Show Confirmation**
   - Display `confirmationId`
   - Show selected services

**See:** [CLIENT_API_DOCUMENTATION.md - Service Reservation](./CLIENT_API_DOCUMENTATION.md#submit-service-reservation)

---

### Use Case 3: View Reservation Confirmation

1. **Get Confirmation Details**
   ```
   GET /client/reservations/:confirmationId/confirmation
   ```

2. **Display Details**
   - Show reservation type (podcast/service)
   - Display all submitted answers
   - Show status

**See:** [CLIENT_API_DOCUMENTATION.md - Get Confirmation](./CLIENT_API_DOCUMENTATION.md#get-reservation-confirmation)

---

## 🔧 Integration Patterns

### Pattern 1: Dynamic Form Rendering

Questions are returned with a `question_type` field that determines how to render them:

```javascript
function renderQuestion(question) {
  switch (question.question_type) {
    case 'text':
    case 'email':
      return <input type={question.question_type} />;
    case 'select':
      return <select>{question.answers.map(...)}</select>;
    case 'radio':
      return <RadioGroup options={question.answers} />;
    // ... etc
  }
}
```

**See:** [INTEGRATION_EXAMPLES.md - Form Rendering](./INTEGRATION_EXAMPLES.md#form-rendering-examples)

---

### Pattern 2: Answer Formatting

When submitting, format answers according to the schema:

```javascript
const formattedAnswers = Object.entries(formData).map(([questionId, data]) => ({
  questionId,
  value: data.value,
  answerId: data.answerId || null, // For select/radio/checkbox
}));
```

---

### Pattern 3: Service-Specific Questions

Only show service-specific questions when the service is selected:

```javascript
const relevantQuestions = [
  ...data.general,
  ...data.services
    .filter(s => selectedServiceIds.includes(s.service_id))
    .flatMap(s => s.questions)
];
```

---

## ✅ Validation Guidelines

### Client-Side Validation

Before submitting, validate:

1. **Required Fields**
   ```javascript
   const missingRequired = questions
     .filter(q => q.required && !answers[q.id])
     .map(q => q.question_text);
   ```

2. **Email Format** (for `question_type: 'email'`)
   ```javascript
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   ```

3. **Custom Validation Rules**
   ```javascript
   if (question.validation_rules?.minLength) {
     if (value.length < question.validation_rules.minLength) {
       // Show error
     }
   }
   ```

**See:** [CLIENT_API_DOCUMENTATION.md - Validation Rules](./CLIENT_API_DOCUMENTATION.md#validation-rules)

---

## 🐛 Error Handling

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Common Errors

| Status | Reason | Solution |
|--------|--------|----------|
| 400 | Invalid request body | Check request format |
| 400 | Validation failed | Verify required fields |
| 404 | Resource not found | Check IDs and URLs |
| 500 | Server error | Contact support |

### Error Handling Example

```javascript
try {
  const response = await submitReservation(data);
  // Handle success
} catch (error) {
  if (error.response?.status === 400) {
    // Show validation error to user
  } else if (error.response?.status === 404) {
    // Show not found message
  } else {
    // Show generic error
  }
}
```

---

## 📊 Response Patterns

### Success Response

All successful responses include:
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

Always check the `success` field:
```javascript
if (response.success) {
  // Process response.data
}
```

---

## 🔍 Question Types Reference

| Type | Input Element | Has Predefined Answers |
|------|---------------|------------------------|
| `text` | `<input type="text">` | No |
| `email` | `<input type="email">` | No |
| `phone` | `<input type="tel">` | No |
| `textarea` | `<textarea>` | No |
| `select` | `<select>` | Yes |
| `radio` | `<input type="radio">` | Yes |
| `checkbox` | `<input type="checkbox">` | Yes |
| `date` | `<input type="date">` | No |
| `file` | `<input type="file">` | No |
| `number` | `<input type="number">` | No |
| `url` | `<input type="url">` | No |

**See:** [QUICK_REFERENCE.md - Question Types](./QUICK_REFERENCE.md#question-types)

---

## 💡 Best Practices

### 1. Always Set Content-Type Header
```javascript
headers: {
  'Content-Type': 'application/json'
}
```

### 2. Check Success Field
```javascript
if (response.success) {
  // Process data
} else {
  // Handle error
}
```

### 3. Respect Question Order
```javascript
questions.sort((a, b) => a.order - b.order);
```

### 4. Mark Required Fields
```jsx
{question.required && <span className="required">*</span>}
```

### 5. Save Confirmation IDs
```javascript
localStorage.setItem('confirmationId', response.data.confirmationId);
```

### 6. Handle Errors Gracefully
```javascript
catch (error) {
  showUserFriendlyMessage(error.message);
}
```

---

## 🧪 Testing

### Manual Testing Tools

- **cURL** - Command line
- **Postman** - GUI application
- **Insomnia** - GUI application
- **HTTPie** - Command line (user-friendly)

### Example Test Commands

```bash
# Test services endpoint
curl http://localhost:8080/client/services

# Test podcast questions
curl http://localhost:8080/client/forms/podcast/questions

# Test submission (replace with actual data)
curl -X POST http://localhost:8080/client/reservations/podcast \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":"...","value":"...","answerId":null}]}'
```

---

## 📞 Support

### Common Issues

**Issue:** CORS errors
- **Solution:** Ensure backend CORS is configured for your frontend origin

**Issue:** 400 Bad Request
- **Solution:** Verify request body format matches schema

**Issue:** Empty responses
- **Solution:** Check that Content-Type header is set

**Issue:** Validation errors
- **Solution:** Ensure all required fields are provided

### Getting Help

1. Check the error message in the response
2. Verify request format against documentation
3. Test with cURL to isolate frontend issues
4. Review code examples for similar implementations

---

## 📝 Document Information

**Version:** 1.0  
**Last Updated:** 2024-01-15  
**Base URL:** `http://localhost:8080`

---

## 🗂️ Document Index

1. **[CLIENT_API_DOCUMENTATION.md](./CLIENT_API_DOCUMENTATION.md)** - Complete API reference
2. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick lookup guide
3. **[INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)** - Code examples
4. **[README.md](./README.md)** - This file (overview and index)

---

**Ready to start?** Begin with [CLIENT_API_DOCUMENTATION.md](./CLIENT_API_DOCUMENTATION.md) for the complete API reference.

