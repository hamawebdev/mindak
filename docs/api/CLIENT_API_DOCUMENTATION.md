# Client API Documentation - Frontend Integration Guide

## Overview

This document provides comprehensive API documentation for all user-facing (client) endpoints. These endpoints are **public** and do not require authentication.

**Base URL:** `http://localhost:8080` (development)

**Content-Type:** `application/json` for all requests and responses

---

## Table of Contents

1. [Services API](#services-api)
2. [Forms API](#forms-api)
   - [Podcast Form Questions](#podcast-form-questions)
   - [Services Form Questions](#services-form-questions)
3. [Reservations API](#reservations-api)
   - [Submit Podcast Reservation](#submit-podcast-reservation)
   - [Submit Service Reservation](#submit-service-reservation)
   - [Get Reservation Confirmation](#get-reservation-confirmation)

---

## Services API

### Get Active Services

Retrieve all active services available for reservation.

**Endpoint:** `GET /client/services`

**Authentication:** None (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Response Status:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "Service Name",
      "description": "Service description text or null"
    }
  ]
}
```

**Response Fields:**
- `success` (boolean): Indicates if the request was successful
- `data` (array): List of active services
  - `id` (string): Unique service identifier (UUID)
  - `name` (string): Service name
  - `description` (string | null): Service description

**Example Request:**
```bash
curl -X GET http://localhost:8080/client/services \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Web Development",
      "description": "Custom web application development services"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "name": "Mobile App Development",
      "description": "iOS and Android application development"
    }
  ]
}
```

**Notes:**
- Only returns services where `is_active = true`
- Services are returned in their display order
- Use the service `id` when submitting service reservations

---

## Forms API

### Podcast Form Questions

Retrieve all active questions for the podcast reservation form.

**Endpoint:** `GET /client/forms/podcast/questions`

**Authentication:** None (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Response Status:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "question_text": "Question text",
      "question_type": "text",
      "required": true,
      "order": 1,
      "placeholder": "Placeholder text or null",
      "help_text": "Help text or null",
      "validation_rules": {
        "minLength": 5,
        "maxLength": 100
      },
      "answers": [
        {
          "id": "uuid-string",
          "answer_text": "Answer option text",
          "answer_value": "answer_value or null",
          "answer_metadata": {},
          "order": 1
        }
      ]
    }
  ]
}
```

**Response Fields:**
- `success` (boolean): Indicates if the request was successful
- `data` (array): List of questions ordered by `order` field
  - `id` (string): Unique question identifier (UUID)
  - `question_text` (string): The question text to display
  - `question_type` (string): Type of input field - one of:
    - `text`: Single-line text input
    - `email`: Email input with validation
    - `phone`: Phone number input
    - `textarea`: Multi-line text input
    - `select`: Dropdown selection
    - `radio`: Radio button group
    - `checkbox`: Checkbox group
    - `date`: Date picker
    - `file`: File upload
    - `number`: Numeric input
    - `url`: URL input with validation
  - `required` (boolean): Whether the question must be answered
  - `order` (number): Display order (ascending)
  - `placeholder` (string | null): Placeholder text for input fields
  - `help_text` (string | null): Additional help text to display
  - `validation_rules` (object | null): Custom validation rules (e.g., min/max length, pattern)
  - `answers` (array): Predefined answer options (for select, radio, checkbox types)
    - `id` (string): Answer identifier (UUID)
    - `answer_text` (string): Display text for the answer
    - `answer_value` (string | null): Value to submit (if different from text)
    - `answer_metadata` (object | null): Additional metadata
    - `order` (number): Display order within the question

**Example Request:**
```bash
curl -X GET http://localhost:8080/client/forms/podcast/questions \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "question_text": "What is your full name?",
      "question_type": "text",
      "required": true,
      "order": 1,
      "placeholder": "Enter your full name",
      "help_text": null,
      "validation_rules": {
        "minLength": 2,
        "maxLength": 100
      },
      "answers": []
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "question_text": "What is your email address?",
      "question_type": "email",
      "required": true,
      "order": 2,
      "placeholder": "your.email@example.com",
      "help_text": "We'll send confirmation to this email",
      "validation_rules": null,
      "answers": []
    },
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "question_text": "What topics interest you?",
      "question_type": "checkbox",
      "required": false,
      "order": 3,
      "placeholder": null,
      "help_text": "Select all that apply",
      "validation_rules": null,
      "answers": [
        {
          "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
          "answer_text": "Technology",
          "answer_value": "tech",
          "answer_metadata": {
            "image": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg",
            "description": "Tech topics"
          },
          "order": 1
        },
        {
          "id": "e5f6a7b8-c9d0-1234-ef12-345678901234",
          "answer_text": "Business",
          "answer_value": "business",
          "answer_metadata": {
            "image": "/uploads/question-answers/1699876543210-x9y8z7w6v5u4t3s2.png"
          },
          "order": 2
        }
      ]
    }
  ]
}
```

**Notes:**
- Questions are returned in ascending order by the `order` field
- Only active questions (`is_active = true`) are returned
- For questions with predefined answers (select, radio, checkbox), use the `answers` array
- The `answers` array will be empty for free-form input types (text, email, textarea, etc.)
- Store question IDs to submit with answers in the reservation request
- **Answer images**: The `answer_metadata.image` field contains the URL path to the answer's image (if uploaded)
  - Image URLs are in the format: `/uploads/question-answers/{filename}`
  - Access images via: `http://your-domain/uploads/question-answers/{filename}`
  - Not all answers have images - the `image` field may be absent or null

---

### Services Form Questions

Retrieve all active questions for the services reservation form, organized by general and service-specific sections.

**Endpoint:** `GET /client/forms/services/questions`

**Authentication:** None (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Response Status:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "general": [
      {
        "id": "uuid-string",
        "question_text": "Question text",
        "question_type": "text",
        "required": true,
        "order": 1,
        "placeholder": "Placeholder text or null",
        "help_text": "Help text or null",
        "validation_rules": {},
        "answers": []
      }
    ],
    "services": [
      {
        "service_id": "uuid-string",
        "service_name": "Service Name or null",
        "questions": [
          {
            "id": "uuid-string",
            "question_text": "Service-specific question",
            "question_type": "textarea",
            "required": false,
            "order": 1,
            "placeholder": null,
            "help_text": null,
            "validation_rules": null,
            "answers": []
          }
        ]
      }
    ]
  }
}
```

**Response Fields:**
- `success` (boolean): Indicates if the request was successful
- `data` (object): Questions organized by section
  - `general` (array): General questions shown for all service reservations
    - Same structure as podcast questions (see above)
  - `services` (array): Service-specific questions grouped by service
    - `service_id` (string): Service identifier (UUID)
    - `service_name` (string | null): Service name for display
    - `questions` (array): Questions specific to this service
      - Same structure as podcast questions (see above)

**Example Request:**
```bash
curl -X GET http://localhost:8080/client/forms/services/questions \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "general": [
      {
        "id": "f6a7b8c9-d0e1-2345-f123-456789012345",
        "question_text": "What is your company name?",
        "question_type": "text",
        "required": true,
        "order": 1,
        "placeholder": "Enter company name",
        "help_text": null,
        "validation_rules": null,
        "answers": []
      },
      {
        "id": "a7b8c9d0-e1f2-3456-1234-567890123456",
        "question_text": "Contact email",
        "question_type": "email",
        "required": true,
        "order": 2,
        "placeholder": "contact@company.com",
        "help_text": null,
        "validation_rules": null,
        "answers": []
      }
    ],
    "services": [
      {
        "service_id": "123e4567-e89b-12d3-a456-426614174000",
        "service_name": "Web Development",
        "questions": [
          {
            "id": "b8c9d0e1-f2a3-4567-2345-678901234567",
            "question_text": "What type of website do you need?",
            "question_type": "select",
            "required": true,
            "order": 1,
            "placeholder": null,
            "help_text": null,
            "validation_rules": null,
            "answers": [
              {
                "id": "c9d0e1f2-a3b4-5678-3456-789012345678",
                "answer_text": "E-commerce",
                "answer_value": "ecommerce",
                "answer_metadata": {
                  "image": "/uploads/question-answers/1699876543210-ecommerce-icon.png",
                  "description": "Online store solution"
                },
                "order": 1
              },
              {
                "id": "d0e1f2a3-b4c5-6789-4567-890123456789",
                "answer_text": "Corporate Website",
                "answer_value": "corporate",
                "answer_metadata": {
                  "image": "/uploads/question-answers/1699876543210-corporate-icon.png"
                },
                "order": 2
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Notes:**
- General questions are always shown regardless of selected services
- Service-specific questions should only be shown when the corresponding service is selected
- Questions within each section are ordered by the `order` field
- Only active questions and services are returned
- When submitting a service reservation, include answers to both general and relevant service-specific questions
- **Answer images**: The `answer_metadata.image` field contains the URL path to the answer's image (if uploaded)
  - Image URLs are in the format: `/uploads/question-answers/{filename}`
  - Access images via: `http://your-domain/uploads/question-answers/{filename}`
  - Not all answers have images - the `image` field may be absent or null
  - Use images to enhance the UI with visual answer options

---

## Reservations API

### Submit Podcast Reservation

Submit a new podcast reservation with answers to the podcast form questions.

**Endpoint:** `POST /client/reservations/podcast`

**Authentication:** None (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "uuid-string",
      "value": "answer text",
      "answerId": "uuid-string or null"
    }
  ]
}
```

**Request Body Fields:**
- `answers` (array, required): Array of question answers
  - `questionId` (string, required): The question ID from the form
  - `value` (string, required): The answer value/text
  - `answerId` (string | null, optional): The selected answer ID (for select/radio/checkbox questions)

**Response Status:** `201 Created`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "confirmationId": "uuid-string",
    "status": "pending",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "message": "Your podcast reservation has been submitted successfully. You will receive a confirmation email shortly."
  }
}
```

**Response Fields:**
- `success` (boolean): Indicates if the submission was successful
- `data` (object): Reservation confirmation details
  - `confirmationId` (string): Unique confirmation ID (UUID) - save this for tracking
  - `status` (string): Initial status (typically "pending")
  - `submittedAt` (string): ISO 8601 timestamp of submission
  - `message` (string): Confirmation message for the user

**Example Request:**
```bash
curl -X POST http://localhost:8080/client/reservations/podcast \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {
        "questionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "value": "John Doe",
        "answerId": null
      },
      {
        "questionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "value": "john.doe@example.com",
        "answerId": null
      },
      {
        "questionId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "value": "Technology, Business",
        "answerId": "d4e5f6a7-b8c9-0123-def1-234567890123"
      }
    ]
  }'
```

**Validation Rules:**
- `answers` array must not be empty
- Each answer must have a valid `questionId` (UUID format)
- Each answer must have a non-empty `value` string
- `answerId` is optional but should be provided for questions with predefined answers

**Error Responses:**

**400 Bad Request** - Invalid request body
```json
{
  "success": false,
  "error": {
    "message": "Invalid request body",
    "statusCode": 400
  }
}
```

**400 Bad Request** - Validation failed
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400
  }
}
```

**Notes:**
- The system automatically captures client IP and user agent for tracking
- Required questions must have answers provided
- For checkbox questions with multiple selections, concatenate values or submit multiple times
- Save the `confirmationId` to allow users to view their reservation later

---

### Submit Service Reservation

Submit a new service reservation with selected services and answers to the services form questions.

**Endpoint:** `POST /client/reservations/services`

**Authentication:** None (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "serviceIds": ["uuid-string"],
  "answers": [
    {
      "questionId": "uuid-string",
      "value": "answer text",
      "answerId": "uuid-string or null"
    }
  ]
}
```

**Request Body Fields:**
- `serviceIds` (array, required): Array of service IDs to reserve (minimum 1)
  - Each element is a string (UUID) from the active services list
- `answers` (array, required): Array of question answers
  - `questionId` (string, required): The question ID from the form
  - `value` (string, required): The answer value/text
  - `answerId` (string | null, optional): The selected answer ID (for select/radio/checkbox questions)

**Response Status:** `201 Created`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "confirmationId": "uuid-string",
    "status": "pending",
    "services": [
      {
        "id": "uuid-string",
        "name": "Service Name"
      }
    ],
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "message": "Your service reservation has been submitted successfully. You will receive a confirmation email shortly."
  }
}
```

**Response Fields:**
- `success` (boolean): Indicates if the submission was successful
- `data` (object): Reservation confirmation details
  - `confirmationId` (string): Unique confirmation ID (UUID) - save this for tracking
  - `status` (string): Initial status (typically "pending")
  - `services` (array): List of reserved services
    - `id` (string): Service ID
    - `name` (string): Service name
  - `submittedAt` (string): ISO 8601 timestamp of submission
  - `message` (string): Confirmation message for the user

**Example Request:**
```bash
curl -X POST http://localhost:8080/client/reservations/services \
  -H "Content-Type: application/json" \
  -d '{
    "serviceIds": [
      "123e4567-e89b-12d3-a456-426614174000",
      "223e4567-e89b-12d3-a456-426614174001"
    ],
    "answers": [
      {
        "questionId": "f6a7b8c9-d0e1-2345-f123-456789012345",
        "value": "Acme Corporation",
        "answerId": null
      },
      {
        "questionId": "a7b8c9d0-e1f2-3456-1234-567890123456",
        "value": "contact@acme.com",
        "answerId": null
      },
      {
        "questionId": "b8c9d0e1-f2a3-4567-2345-678901234567",
        "value": "E-commerce",
        "answerId": "c9d0e1f2-a3b4-5678-3456-789012345678"
      }
    ]
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "confirmationId": "e1f2a3b4-c5d6-7890-1234-567890abcdef",
    "status": "pending",
    "services": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Web Development"
      },
      {
        "id": "223e4567-e89b-12d3-a456-426614174001",
        "name": "Mobile App Development"
      }
    ],
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "message": "Your service reservation has been submitted successfully. You will receive a confirmation email shortly."
  }
}
```

**Validation Rules:**
- `serviceIds` array must contain at least one service ID
- All service IDs must be valid UUIDs and exist in the system
- `answers` array must not be empty
- Each answer must have a valid `questionId` (UUID format)
- Each answer must have a non-empty `value` string
- Must include answers to general questions and service-specific questions for selected services

**Error Responses:**

**400 Bad Request** - Invalid request body
```json
{
  "success": false,
  "error": {
    "message": "Invalid request body",
    "statusCode": 400
  }
}
```

**400 Bad Request** - Validation failed (missing services or invalid data)
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400
  }
}
```

**Notes:**
- At least one service must be selected
- Include answers to both general questions and service-specific questions for all selected services
- The system automatically captures client IP and user agent for tracking
- Save the `confirmationId` to allow users to view their reservation later
- Services must be active and available at the time of submission

---

### Get Reservation Confirmation

Retrieve confirmation details for a previously submitted reservation (podcast or service).

**Endpoint:** `GET /client/reservations/:confirmationId/confirmation`

**Authentication:** None (Public)

**URL Parameters:**
- `confirmationId` (string, required): The confirmation ID received when submitting the reservation

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Response Status:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "confirmationId": "uuid-string",
    "type": "podcast",
    "status": "pending",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "clientAnswers": [
      {
        "questionText": "Question text",
        "questionType": "text",
        "value": "Answer value",
        "answerText": "Selected answer text or null"
      }
    ],
    "serviceIds": ["uuid-string"]
  }
}
```

**Response Fields:**
- `success` (boolean): Indicates if the request was successful
- `data` (object): Reservation details
  - `confirmationId` (string): The confirmation ID
  - `type` (string): Reservation type - either "podcast" or "service"
  - `status` (string): Current reservation status (e.g., "pending", "confirmed", "cancelled")
  - `submittedAt` (string): ISO 8601 timestamp of submission
  - `clientAnswers` (array): All submitted answers
    - `questionText` (string): The question that was answered
    - `questionType` (string): Type of question (text, email, select, etc.)
    - `value` (string): The submitted answer value
    - `answerText` (string | null): Text of selected answer (for select/radio/checkbox)
  - `serviceIds` (array, optional): Array of service IDs (only present for service reservations)

**Example Request:**
```bash
curl -X GET http://localhost:8080/client/reservations/e1f2a3b4-c5d6-7890-1234-567890abcdef/confirmation \
  -H "Content-Type: application/json"
```

**Example Response (Podcast Reservation):**
```json
{
  "success": true,
  "data": {
    "confirmationId": "e1f2a3b4-c5d6-7890-1234-567890abcdef",
    "type": "podcast",
    "status": "pending",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "clientAnswers": [
      {
        "questionText": "What is your full name?",
        "questionType": "text",
        "value": "John Doe",
        "answerText": null
      },
      {
        "questionText": "What is your email address?",
        "questionType": "email",
        "value": "john.doe@example.com",
        "answerText": null
      },
      {
        "questionText": "What topics interest you?",
        "questionType": "checkbox",
        "value": "Technology, Business",
        "answerText": "Technology"
      }
    ]
  }
}
```

**Example Response (Service Reservation):**
```json
{
  "success": true,
  "data": {
    "confirmationId": "f2a3b4c5-d6e7-8901-2345-678901bcdef0",
    "type": "service",
    "status": "confirmed",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "clientAnswers": [
      {
        "questionText": "What is your company name?",
        "questionType": "text",
        "value": "Acme Corporation",
        "answerText": null
      },
      {
        "questionText": "Contact email",
        "questionType": "email",
        "value": "contact@acme.com",
        "answerText": null
      },
      {
        "questionText": "What type of website do you need?",
        "questionType": "select",
        "value": "E-commerce",
        "answerText": "E-commerce"
      }
    ],
    "serviceIds": [
      "123e4567-e89b-12d3-a456-426614174000",
      "223e4567-e89b-12d3-a456-426614174001"
    ]
  }
}
```

**Error Responses:**

**400 Bad Request** - Missing confirmation ID
```json
{
  "success": false,
  "error": {
    "message": "Confirmation ID is required",
    "statusCode": 400
  }
}
```

**404 Not Found** - Reservation not found
```json
{
  "success": false,
  "error": {
    "message": "Reservation not found",
    "statusCode": 404
  }
}
```

**Notes:**
- This endpoint can be used to display a confirmation page after submission
- The `type` field indicates whether it's a podcast or service reservation
- For service reservations, the `serviceIds` field will be present
- Status values may include: "pending", "confirmed", "cancelled", "completed"
- This is a public endpoint - anyone with the confirmation ID can view the details

---

## Common Response Patterns

### Success Response Structure

All successful responses follow this pattern:
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

### Error Response Structure

All error responses follow this pattern:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Common HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request (resource created)
- `400 Bad Request` - Invalid request data or validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Data Types Reference

### Question Types

The following question types are supported:

| Type | Description | Has Predefined Answers |
|------|-------------|----------------------|
| `text` | Single-line text input | No |
| `email` | Email input with validation | No |
| `phone` | Phone number input | No |
| `textarea` | Multi-line text input | No |
| `select` | Dropdown selection | Yes |
| `radio` | Radio button group (single selection) | Yes |
| `checkbox` | Checkbox group (multiple selections) | Yes |
| `date` | Date picker | No |
| `file` | File upload | No |
| `number` | Numeric input | No |
| `url` | URL input with validation | No |

### Validation Rules

The `validation_rules` object may contain various validation constraints:

```json
{
  "minLength": 5,
  "maxLength": 100,
  "pattern": "^[A-Za-z]+$",
  "min": 0,
  "max": 100
}
```

Common validation rule keys:
- `minLength` (number): Minimum string length
- `maxLength` (number): Maximum string length
- `pattern` (string): Regular expression pattern
- `min` (number): Minimum numeric value
- `max` (number): Maximum numeric value

---

## Integration Guidelines

### Recommended Flow

1. **Load Services** (if needed)
   - Call `GET /client/services` to get available services
   - Display services for user selection

2. **Load Form Questions**
   - For podcast: Call `GET /client/forms/podcast/questions`
   - For services: Call `GET /client/forms/services/questions`
   - Render form based on question types and order

3. **Handle Form Submission**
   - Validate required fields on the client side
   - Format answers according to the API schema
   - For services: Include both general and service-specific answers
   - Submit to appropriate endpoint

4. **Display Confirmation**
   - Show the confirmation ID to the user
   - Optionally call `GET /client/reservations/:confirmationId/confirmation` to display full details
   - Store confirmation ID for future reference

### Best Practices

1. **Question Rendering**
   - Always respect the `order` field when displaying questions
   - Show `help_text` near the input field if present
   - Use `placeholder` for input fields
   - Mark required fields visually

2. **Answer Handling**
   - For questions with predefined answers (select, radio, checkbox), use the `answers` array
   - Submit the `answerId` along with the `value` for these question types
   - For checkbox questions with multiple selections, you may need to submit multiple answer entries or concatenate values

3. **Validation**
   - Implement client-side validation based on `validation_rules`
   - Check `required` field before submission
   - Validate email, phone, and URL formats for respective types

4. **Error Handling**
   - Always check the `success` field in responses
   - Display user-friendly error messages
   - Handle network errors gracefully

5. **Service-Specific Questions**
   - Only show service-specific questions when the corresponding service is selected
   - Update the form dynamically as users select/deselect services
   - Ensure all relevant service-specific questions are answered before submission

---

## Testing Endpoints

You can test these endpoints using tools like:
- **cURL** (command line)
- **Postman** (GUI)
- **Insomnia** (GUI)
- **HTTPie** (command line)

Example using HTTPie:
```bash
# Get active services
http GET localhost:8080/client/services

# Get podcast questions
http GET localhost:8080/client/forms/podcast/questions

# Submit podcast reservation
http POST localhost:8080/client/reservations/podcast \
  answers:='[{"questionId":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","value":"John Doe","answerId":null}]'
```

---

## Support and Questions

For technical support or questions about the API:
- Check the error message in the response for specific issues
- Ensure all required fields are provided
- Verify that UUIDs are in the correct format
- Confirm that the Content-Type header is set to `application/json`

---

**Document Version:** 1.0
**Last Updated:** 2024-01-15
**API Base URL:** `http://localhost:8080` (development)

