# API Flow Diagrams

Visual representations of the API integration flows for frontend developers.

## Table of Contents

1. [Podcast Reservation Flow](#podcast-reservation-flow)
2. [Service Reservation Flow](#service-reservation-flow)
3. [Confirmation Retrieval Flow](#confirmation-retrieval-flow)
4. [Question Rendering Logic](#question-rendering-logic)
5. [Error Handling Flow](#error-handling-flow)

---

## Podcast Reservation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PODCAST RESERVATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐
│ Frontend │
└────┬─────┘
     │
     │ 1. GET /client/forms/podcast/questions
     ├────────────────────────────────────────────────────────────►
     │                                                    ┌─────────┐
     │                                                    │ Backend │
     │                                                    └─────────┘
     │ 2. Response: { success: true, data: [questions] }
     ◄────────────────────────────────────────────────────────────┤
     │
     │ 3. Render form based on questions
     │    - Sort by 'order' field
     │    - Render inputs based on 'question_type'
     │    - Mark required fields
     │
     │ 4. User fills out form
     │
     │ 5. Validate on client side
     │    - Check required fields
     │    - Validate formats (email, phone, etc.)
     │    - Apply validation_rules
     │
     │ 6. POST /client/reservations/podcast
     │    Body: { answers: [...] }
     ├────────────────────────────────────────────────────────────►
     │
     │ 7. Response: { success: true, data: { confirmationId, ... } }
     ◄────────────────────────────────────────────────────────────┤
     │
     │ 8. Display confirmation
     │    - Show confirmationId
     │    - Show success message
     │    - Optionally save confirmationId
     │
     ▼
```

### Detailed Steps

**Step 1-2: Fetch Questions**
```javascript
GET /client/forms/podcast/questions
→ Returns array of questions with metadata
```

**Step 3: Render Form**
```javascript
questions.sort((a, b) => a.order - b.order)
questions.forEach(q => renderInput(q.question_type))
```

**Step 4-5: User Input & Validation**
```javascript
// Check required
if (question.required && !answer) { error }

// Check validation rules
if (question.validation_rules?.minLength) { validate }
```

**Step 6-7: Submit**
```javascript
POST /client/reservations/podcast
Body: {
  answers: [
    { questionId, value, answerId }
  ]
}
```

**Step 8: Confirmation**
```javascript
// Save for later reference
localStorage.setItem('confirmationId', data.confirmationId)
```

---

## Service Reservation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE RESERVATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐
│ Frontend │
└────┬─────┘
     │
     │ 1. GET /client/services
     ├────────────────────────────────────────────────────────────►
     │                                                    ┌─────────┐
     │                                                    │ Backend │
     │                                                    └─────────┘
     │ 2. Response: { success: true, data: [services] }
     ◄────────────────────────────────────────────────────────────┤
     │
     │ 3. Display services for selection
     │
     │ 4. GET /client/forms/services/questions
     ├────────────────────────────────────────────────────────────►
     │
     │ 5. Response: { success: true, data: { general, services } }
     ◄────────────────────────────────────────────────────────────┤
     │
     │ 6. Render form
     │    - Always show general questions
     │    - Show service-specific questions based on selection
     │
     │ 7. User selects services and fills form
     │
     │ 8. Dynamically update form
     │    - Add/remove service-specific questions
     │    - Based on selected services
     │
     │ 9. Validate
     │    - Check required fields
     │    - Validate general questions
     │    - Validate service-specific questions
     │
     │ 10. POST /client/reservations/services
     │     Body: { serviceIds: [...], answers: [...] }
     ├────────────────────────────────────────────────────────────►
     │
     │ 11. Response: { success: true, data: { confirmationId, services, ... } }
     ◄────────────────────────────────────────────────────────────┤
     │
     │ 12. Display confirmation
     │     - Show confirmationId
     │     - Show selected services
     │     - Show success message
     │
     ▼
```

### Service-Specific Questions Logic

```
┌─────────────────────────────────────────────────────────────────┐
│              SERVICE-SPECIFIC QUESTIONS RENDERING                │
└─────────────────────────────────────────────────────────────────┘

User selects services: [Service A, Service B]
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  Filter service-specific questions  │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  data.services.filter(s =>          │
        │    selectedIds.includes(s.service_id))│
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  Render questions for each service  │
        │  - Service A questions              │
        │  - Service B questions              │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  Collect answers for all questions  │
        │  - General answers                  │
        │  - Service A answers                │
        │  - Service B answers                │
        └─────────────────────────────────────┘
```

---

## Confirmation Retrieval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  CONFIRMATION RETRIEVAL FLOW                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐
│ Frontend │
└────┬─────┘
     │
     │ User has confirmationId (from email, saved, or URL)
     │
     │ 1. GET /client/reservations/:confirmationId/confirmation
     ├────────────────────────────────────────────────────────────►
     │                                                    ┌─────────┐
     │                                                    │ Backend │
     │                                                    └─────────┘
     │ 2. Response: {
     │      success: true,
     │      data: {
     │        confirmationId,
     │        type: 'podcast' | 'service',
     │        status,
     │        submittedAt,
     │        clientAnswers: [...],
     │        serviceIds: [...] // if type === 'service'
     │      }
     │    }
     ◄────────────────────────────────────────────────────────────┤
     │
     │ 3. Display confirmation details
     │    - Show reservation type
     │    - Show status
     │    - Show all submitted answers
     │    - If service: show selected services
     │
     ▼
```

---

## Question Rendering Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUESTION RENDERING LOGIC                      │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   Question   │
                    └──────┬───────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Check question_type   │
              └────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌────────┐        ┌─────────┐       ┌──────────┐
   │  text  │        │ select  │       │ checkbox │
   │  email │        │  radio  │       │          │
   │  phone │        └────┬────┘       └────┬─────┘
   │  url   │             │                 │
   │ number │             │                 │
   │  date  │             │                 │
   └───┬────┘             │                 │
       │                  │                 │
       ▼                  ▼                 ▼
   ┌────────┐      ┌──────────────┐  ┌──────────────┐
   │ <input>│      │ Use answers  │  │ Use answers  │
   │        │      │ array for    │  │ array for    │
   │        │      │ options      │  │ options      │
   └────────┘      └──────────────┘  └──────────────┘
       │                  │                 │
       │                  │                 │
       ▼                  ▼                 ▼
   ┌────────────────────────────────────────────┐
   │  Capture value and answerId (if applicable)│
   └────────────────────────────────────────────┘
```

### Question Type Decision Tree

```javascript
function renderQuestion(question) {
  switch (question.question_type) {
    // Simple inputs - no predefined answers
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
    case 'number':
    case 'date':
      return <input type={question.question_type} />
      // answerId = null
    
    case 'textarea':
      return <textarea />
      // answerId = null
    
    // Selection inputs - use answers array
    case 'select':
      return (
        <select>
          {question.answers.map(answer => (
            <option value={answer.answer_text}>
              {answer.answer_text}
            </option>
          ))}
        </select>
      )
      // answerId = selected answer.id
    
    case 'radio':
      return question.answers.map(answer => (
        <input 
          type="radio" 
          value={answer.answer_text}
        />
      ))
      // answerId = selected answer.id
    
    case 'checkbox':
      return question.answers.map(answer => (
        <input 
          type="checkbox" 
          value={answer.answer_text}
        />
      ))
      // answerId = selected answer.id(s)
      // value = concatenated or multiple entries
  }
}
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  API Request │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Response   │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │ success:true│          │success:false│
       └──────┬──────┘          └──────┬──────┘
              │                        │
              ▼                        ▼
       ┌─────────────┐          ┌─────────────┐
       │ Process data│          │ Check status│
       └─────────────┘          └──────┬──────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
              ┌──────────┐       ┌──────────┐      ┌──────────┐
              │   400    │       │   404    │      │   500    │
              │ Bad Req  │       │Not Found │      │  Server  │
              └────┬─────┘       └────┬─────┘      └────┬─────┘
                   │                  │                  │
                   ▼                  ▼                  ▼
         ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
         │ Show validation  │ │ Show "not    │ │ Show generic │
         │ error to user    │ │ found" msg   │ │ error msg    │
         └──────────────────┘ └──────────────┘ └──────────────┘
```

### Error Handling Code Pattern

```javascript
try {
  const response = await apiCall();
  
  if (response.success) {
    // Handle success
    processData(response.data);
  } else {
    // This shouldn't happen with proper API
    handleError(response.error);
  }
  
} catch (error) {
  // Network error or HTTP error status
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.error?.message;
    
    switch (status) {
      case 400:
        showValidationError(message);
        break;
      case 404:
        showNotFoundError();
        break;
      case 500:
        showServerError();
        break;
      default:
        showGenericError(message);
    }
  } else if (error.request) {
    // Request made but no response
    showNetworkError();
  } else {
    // Something else went wrong
    showGenericError(error.message);
  }
}
```

---

## Complete Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  COMPLETE INTEGRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         INITIALIZATION                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ User visits page │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Podcast Form     │          │ Service Form     │
    └────────┬─────────┘          └────────┬─────────┘
             │                              │
             │                              ▼
             │                    ┌──────────────────┐
             │                    │ Fetch services   │
             │                    │ GET /client/     │
             │                    │     services     │
             │                    └────────┬─────────┘
             │                             │
             │                             ▼
             │                    ┌──────────────────┐
             │                    │ Display services │
             │                    │ for selection    │
             │                    └────────┬─────────┘
             │                             │
             ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Fetch questions  │          │ Fetch questions  │
    │ GET /client/     │          │ GET /client/     │
    │ forms/podcast/   │          │ forms/services/  │
    │ questions        │          │ questions        │
    └────────┬─────────┘          └────────┬─────────┘
             │                             │
             ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Render form      │          │ Render form      │
    │ - Sort by order  │          │ - General Qs     │
    │ - Dynamic inputs │          │ - Service Qs     │
    └────────┬─────────┘          └────────┬─────────┘
             │                             │
             ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ User fills form  │          │ User fills form  │
    └────────┬─────────┘          └────────┬─────────┘
             │                             │
             ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Validate         │          │ Validate         │
    └────────┬─────────┘          └────────┬─────────┘
             │                             │
             ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Submit           │          │ Submit           │
    │ POST /client/    │          │ POST /client/    │
    │ reservations/    │          │ reservations/    │
    │ podcast          │          │ services         │
    └────────┬─────────┘          └────────┬─────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ Show confirmation│
                  │ - confirmationId │
                  │ - Success message│
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ (Optional)       │
                  │ Fetch full       │
                  │ confirmation     │
                  │ details          │
                  └──────────────────┘
```

---

## Data Flow Summary

### Request Flow
```
Frontend → API Endpoint → Backend Processing → Database → Response
```

### Response Flow
```
Database → Backend Processing → JSON Response → Frontend → UI Update
```

### Answer Submission Flow
```
User Input → Form State → Validation → Format Answers → API Request → Confirmation
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                            │
└─────────────────────────────────────────────────────────────────┘

Initial State:
{
  loading: true,
  questions: [],
  answers: {},
  submitting: false,
  confirmationId: null,
  error: null
}
                │
                ▼
        Fetch Questions
                │
                ▼
{
  loading: false,
  questions: [...],
  answers: {},
  ...
}
                │
                ▼
        User Input
                │
                ▼
{
  ...
  answers: {
    questionId1: { value: '...', answerId: null },
    questionId2: { value: '...', answerId: '...' }
  }
}
                │
                ▼
        Submit
                │
                ▼
{
  ...
  submitting: true
}
                │
                ▼
        Success
                │
                ▼
{
  ...
  submitting: false,
  confirmationId: '...'
}
```

---

For implementation details, see:
- [CLIENT_API_DOCUMENTATION.md](./CLIENT_API_DOCUMENTATION.md) - Complete API reference
- [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) - Code examples
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick lookup guide

