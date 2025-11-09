# API Quick Reference Guide

## Base URL
```
http://localhost:8080
```

## All Client Endpoints (Public - No Authentication Required)

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/client/services` | Get all active services |

### Forms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/client/forms/podcast/questions` | Get podcast form questions |
| GET | `/client/forms/services/questions` | Get services form questions (general + service-specific) |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/client/reservations/podcast` | Submit podcast reservation |
| POST | `/client/reservations/services` | Submit service reservation |
| GET | `/client/reservations/:confirmationId/confirmation` | Get reservation confirmation details |

---

## Request/Response Cheat Sheet

### GET /client/services
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string | null"
    }
  ]
}
```

---

### GET /client/forms/podcast/questions
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question_text": "string",
      "question_type": "text|email|phone|textarea|select|radio|checkbox|date|file|number|url",
      "required": boolean,
      "order": number,
      "placeholder": "string | null",
      "help_text": "string | null",
      "validation_rules": object | null,
      "answers": [
        {
          "id": "uuid",
          "answer_text": "string",
          "answer_value": "string | null",
          "answer_metadata": object | null,
          "order": number
        }
      ]
    }
  ]
}
```

---

### GET /client/forms/services/questions
**Response:**
```json
{
  "success": true,
  "data": {
    "general": [ /* same structure as podcast questions */ ],
    "services": [
      {
        "service_id": "uuid",
        "service_name": "string | null",
        "questions": [ /* same structure as podcast questions */ ]
      }
    ]
  }
}
```

---

### POST /client/reservations/podcast
**Request:**
```json
{
  "answers": [
    {
      "questionId": "uuid",
      "value": "string",
      "answerId": "uuid | null"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "confirmationId": "uuid",
    "status": "string",
    "submittedAt": "ISO 8601 timestamp",
    "message": "string"
  }
}
```

---

### POST /client/reservations/services
**Request:**
```json
{
  "serviceIds": ["uuid"],
  "answers": [
    {
      "questionId": "uuid",
      "value": "string",
      "answerId": "uuid | null"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "confirmationId": "uuid",
    "status": "string",
    "services": [
      {
        "id": "uuid",
        "name": "string"
      }
    ],
    "submittedAt": "ISO 8601 timestamp",
    "message": "string"
  }
}
```

---

### GET /client/reservations/:confirmationId/confirmation
**Response:**
```json
{
  "success": true,
  "data": {
    "confirmationId": "uuid",
    "type": "podcast | service",
    "status": "string",
    "submittedAt": "ISO 8601 timestamp",
    "clientAnswers": [
      {
        "questionText": "string",
        "questionType": "string",
        "value": "string",
        "answerText": "string | null"
      }
    ],
    "serviceIds": ["uuid"] // only for service reservations
  }
}
```

---

## Question Types

| Type | Description | Has Answers Array |
|------|-------------|-------------------|
| `text` | Single-line text | No |
| `email` | Email input | No |
| `phone` | Phone number | No |
| `textarea` | Multi-line text | No |
| `select` | Dropdown | Yes |
| `radio` | Radio buttons | Yes |
| `checkbox` | Checkboxes | Yes |
| `date` | Date picker | No |
| `file` | File upload | No |
| `number` | Number input | No |
| `url` | URL input | No |

---

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful GET |
| 201 | Created - Successful POST |
| 400 | Bad Request - Invalid data |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Error Response Format

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

---

## Validation Rules

Common validation rule keys in `validation_rules` object:
- `minLength`: Minimum string length
- `maxLength`: Maximum string length
- `pattern`: Regex pattern
- `min`: Minimum number value
- `max`: Maximum number value

---

## Integration Checklist

### For Podcast Reservation:
- [ ] Fetch questions: `GET /client/forms/podcast/questions`
- [ ] Render form based on question types and order
- [ ] Validate required fields
- [ ] Submit: `POST /client/reservations/podcast`
- [ ] Display confirmation ID
- [ ] (Optional) Fetch confirmation: `GET /client/reservations/:confirmationId/confirmation`

### For Service Reservation:
- [ ] Fetch services: `GET /client/services`
- [ ] Display services for selection
- [ ] Fetch questions: `GET /client/forms/services/questions`
- [ ] Render general questions
- [ ] Render service-specific questions based on selection
- [ ] Validate required fields
- [ ] Submit: `POST /client/reservations/services`
- [ ] Display confirmation ID
- [ ] (Optional) Fetch confirmation: `GET /client/reservations/:confirmationId/confirmation`

---

## Tips

1. **Always set Content-Type header:** `Content-Type: application/json`
2. **Check `success` field** in all responses
3. **Respect question `order`** when rendering forms
4. **Mark required fields** visually in the UI
5. **For select/radio/checkbox:** Include both `value` and `answerId`
6. **Save confirmation IDs** for user reference
7. **Handle errors gracefully** with user-friendly messages

---

## Example cURL Commands

```bash
# Get services
curl -X GET http://localhost:8080/client/services \
  -H "Content-Type: application/json"

# Get podcast questions
curl -X GET http://localhost:8080/client/forms/podcast/questions \
  -H "Content-Type: application/json"

# Submit podcast reservation
curl -X POST http://localhost:8080/client/reservations/podcast \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {
        "questionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "value": "John Doe",
        "answerId": null
      }
    ]
  }'

# Get confirmation
curl -X GET http://localhost:8080/client/reservations/e1f2a3b4-c5d6-7890-1234-567890abcdef/confirmation \
  -H "Content-Type: application/json"
```

---

**For detailed documentation, see:** [CLIENT_API_DOCUMENTATION.md](./CLIENT_API_DOCUMENTATION.md)

