# Admin API Documentation

This document provides comprehensive API documentation for the Admin side endpoints of the Mindak Backend system.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Services Form Management](#services-form-management)
   - [Podcast Form Questions](#podcast-form-questions)
   - [Podcast Question Answers](#podcast-question-answers)
   - [Services Form Questions](#services-form-questions)
   - [Services Question Answers](#services-question-answers)
3. [Orders (Reservations) Management](#orders-reservations-management)
   - [Podcast Reservations](#podcast-reservations)
     - List Podcast Reservations
     - Get Podcast Client Data (New)
     - Get Podcast Reservation Details
     - Update Podcast Reservation Status
     - Add Note to Podcast Reservation
     - Delete Podcast Reservation
   - [Service Reservations](#service-reservations)
     - List Service Reservations
     - Get Service Client Data (New)
     - Get Service Reservation Details
     - Update Service Reservation Status
     - Add Note to Service Reservation
     - Delete Service Reservation

---

## Authentication & Authorization

All admin endpoints require authentication and admin role authorization.

### Required Headers

```
Authorization: Bearer <access_token>
```

### Authorization Flow

1. **Current User Middleware**: Extracts and validates the JWT token from the Authorization header
2. **Authenticated Middleware**: Ensures the user is authenticated
3. **Admin Middleware**: Verifies the user has the `admin` role

### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "User must be an admin"
}
```

---

## Services Form Management

### Podcast Form Questions

#### 1. Get All Podcast Questions

Retrieves all podcast form questions including inactive ones (admin view).

**Endpoint:** `GET /api/v1/admin/forms/podcast/questions`

**Authentication:** Required (Admin only)

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "form_type": "podcast",
      "question_text": "What is your podcast topic?",
      "question_type": "text",
      "required": true,
      "order": 1,
      "placeholder": "Enter your topic",
      "help_text": "Brief description of your podcast topic",
      "validation_rules": {
        "minLength": 10,
        "maxLength": 200
      },
      "is_active": true,
      "answers": [
        {
          "id": "uuid",
          "answer_text": "Technology",
          "answer_value": "tech",
          "answer_metadata": null,
          "order": 1,
          "is_active": true
        }
      ],
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Question Types:**
- `text` - Single line text input
- `email` - Email input with validation
- `phone` - Phone number input
- `textarea` - Multi-line text input
- `select` - Dropdown selection
- `radio` - Radio button selection
- `checkbox` - Checkbox selection
- `date` - Date picker
- `file` - File upload
- `number` - Numeric input
- `url` - URL input with validation

---

#### 2. Create Podcast Question

Creates a new question for the podcast form.

**Endpoint:** `POST /api/v1/admin/forms/podcast/questions`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "question_text": "What is your podcast topic?",
  "question_type": "text",
  "required": true,
  "order": 1,
  "placeholder": "Enter your topic",
  "help_text": "Brief description of your podcast topic",
  "validation_rules": {
    "minLength": 10,
    "maxLength": 200
  },
  "is_active": true
}
```

**Field Descriptions:**
- `question_text` (string, required): The question text displayed to users
- `question_type` (enum, required): Type of input field (see Question Types above)
- `required` (boolean, required): Whether the question is mandatory
- `order` (integer, required): Display order of the question
- `placeholder` (string, optional): Placeholder text for the input field
- `help_text` (string, optional): Additional help text displayed below the question
- `validation_rules` (object, optional): Custom validation rules as key-value pairs
- `is_active` (boolean, required): Whether the question is active and visible

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "form_type": "podcast",
    "question_text": "What is your podcast topic?",
    "question_type": "text",
    "required": true,
    "order": 1,
    "placeholder": "Enter your topic",
    "help_text": "Brief description of your podcast topic",
    "validation_rules": {
      "minLength": 10,
      "maxLength": 200
    },
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation error message"
}
```

---

#### 3. Update Podcast Question

Updates an existing podcast form question.

**Endpoint:** `PUT /api/v1/admin/forms/podcast/questions/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Question UUID

**Request Body:**
All fields are optional. Only provided fields will be updated.

```json
{
  "question_text": "Updated question text",
  "question_type": "textarea",
  "required": false,
  "order": 2,
  "placeholder": "Updated placeholder",
  "help_text": "Updated help text",
  "validation_rules": {
    "minLength": 20
  },
  "is_active": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "form_type": "podcast",
    "question_text": "Updated question text",
    "question_type": "textarea",
    "required": false,
    "order": 2,
    "placeholder": "Updated placeholder",
    "help_text": "Updated help text",
    "validation_rules": {
      "minLength": 20
    },
    "is_active": false,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Question not found"
}
```

---

#### 4. Delete Podcast Question

Deletes a podcast form question.

**Endpoint:** `DELETE /api/v1/admin/forms/podcast/questions/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Question UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Question not found"
}
```

**Notes:**
- Deleting a question will also delete all associated answers
- Consider deactivating questions instead of deleting to preserve historical data

---

#### 5. Bulk Reorder Podcast Questions

Updates the display order of multiple podcast questions in a single request.

**Endpoint:** `PATCH /api/v1/admin/forms/podcast/questions/bulk-reorder`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "questions": [
    {
      "id": "uuid-1",
      "order": 1
    },
    {
      "id": "uuid-2",
      "order": 2
    },
    {
      "id": "uuid-3",
      "order": 3
    }
  ]
}
```

**Field Descriptions:**
- `questions` (array, required): Array of question objects with id and new order
  - `id` (string, required): Question UUID
  - `order` (integer, required): New display order

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Questions reordered successfully"
}
```

**Notes:**
- All questions in the array will be updated atomically
- Order values should be unique and sequential for best results

---

### Podcast Question Answers

#### 1. Get Question Answers

Retrieves all answers for a specific podcast question.

**Endpoint:** `GET /api/v1/admin/forms/podcast/questions/:questionId/answers`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question_id": "question-uuid",
      "answer_text": "Technology",
      "answer_value": "tech",
      "answer_metadata": {
        "icon": "tech-icon.svg",
        "color": "#0066cc"
      },
      "order": 1,
      "is_active": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Field Descriptions:**
- `answer_text` (string): Display text shown to users
- `answer_value` (string, optional): Internal value used for processing (useful for select/radio/checkbox types)
- `answer_metadata` (object, optional): Additional metadata for the answer (e.g., icons, colors, descriptions)
- `order` (integer): Display order of the answer
- `is_active` (boolean): Whether the answer is active and selectable

---

#### 2. Create Question Answer

Creates a new answer option for a podcast question.

**Endpoint:** `POST /api/v1/admin/forms/podcast/questions/:questionId/answers`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID

**Request Body:**
```json
{
  "answer_text": "Technology",
  "answer_value": "tech",
  "answer_metadata": {
    "icon": "tech-icon.svg",
    "color": "#0066cc"
  },
  "order": 1,
  "is_active": true
}
```

**Field Descriptions:**
- `answer_text` (string, required): Display text for the answer
- `answer_value` (string, optional): Internal value for processing
- `answer_metadata` (object, optional): Additional metadata as key-value pairs
- `order` (integer, required): Display order
- `is_active` (boolean, required): Active status

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "question_id": "question-uuid",
    "answer_text": "Technology",
    "answer_value": "tech",
    "answer_metadata": {
      "icon": "tech-icon.svg",
      "color": "#0066cc"
    },
    "order": 1,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

#### 3. Update Question Answer

Updates an existing answer for a podcast question.

**Endpoint:** `PUT /api/v1/admin/forms/podcast/questions/:questionId/answers/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID
- `id` (string, required): Answer UUID

**Request Body:**
All fields are optional. Only provided fields will be updated.

```json
{
  "answer_text": "Updated Technology",
  "answer_value": "tech-updated",
  "answer_metadata": {
    "icon": "new-icon.svg"
  },
  "order": 2,
  "is_active": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "question_id": "question-uuid",
    "answer_text": "Updated Technology",
    "answer_value": "tech-updated",
    "answer_metadata": {
      "icon": "new-icon.svg"
    },
    "order": 2,
    "is_active": false,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Answer not found"
}
```

---

#### 4. Delete Question Answer

Deletes an answer option from a podcast question.

**Endpoint:** `DELETE /api/v1/admin/forms/podcast/questions/:questionId/answers/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID
- `id` (string, required): Answer UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Answer deleted successfully"
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Answer not found"
}
```

---

#### 5. Bulk Reorder Question Answers

Updates the display order of multiple answers for a podcast question.

**Endpoint:** `PATCH /api/v1/admin/forms/podcast/questions/:questionId/answers/bulk-reorder`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID

**Request Body:**
```json
{
  "answers": [
    {
      "id": "uuid-1",
      "order": 1
    },
    {
      "id": "uuid-2",
      "order": 2
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Answers reordered successfully"
}
```

---

### Services Form Questions

Services form questions are divided into two sections:
- **General Questions**: Apply to all service reservations
- **Service-Specific Questions**: Apply only to specific services

#### 1. Get Services Questions

Retrieves services form questions with optional filtering.

**Endpoint:** `GET /api/v1/admin/forms/services/questions`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `section` (string, optional): Filter by section type (`general` or `service_specific`)
- `serviceId` (string, optional): Filter by specific service (only applicable when `section=service_specific`)

**Examples:**

Get all general questions:
```
GET /api/v1/admin/forms/services/questions?section=general
```

Get service-specific questions for a service:
```
GET /api/v1/admin/forms/services/questions?section=service_specific&serviceId=service-uuid
```

Get all questions (no filter):
```
GET /api/v1/admin/forms/services/questions
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "form_type": "services",
      "section_type": "general",
      "service_id": null,
      "question_text": "What is your company name?",
      "question_type": "text",
      "required": true,
      "order": 1,
      "placeholder": "Enter company name",
      "help_text": "Legal name of your company",
      "validation_rules": {
        "minLength": 2,
        "maxLength": 100
      },
      "is_active": true,
      "answers": [],
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "form_type": "services",
      "section_type": "service_specific",
      "service_id": "service-uuid",
      "question_text": "What is your budget range?",
      "question_type": "select",
      "required": true,
      "order": 1,
      "placeholder": "Select budget range",
      "help_text": null,
      "validation_rules": null,
      "is_active": true,
      "answers": [
        {
          "id": "answer-uuid",
          "answer_text": "$1,000 - $5,000",
          "answer_value": "1000-5000",
          "answer_metadata": null,
          "order": 1,
          "is_active": true
        }
      ],
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Field Descriptions:**
- `section_type` (enum): Either `general` or `service_specific`
- `service_id` (string, nullable): UUID of the service (only for service-specific questions)

**Notes:**
- General questions appear for all service reservations
- Service-specific questions only appear when the associated service is selected
- Admin view includes inactive questions

---

#### 2. Create Services Question

Creates a new question for the services form.

**Endpoint:** `POST /api/v1/admin/forms/services/questions`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "section_type": "service_specific",
  "service_id": "service-uuid",
  "question_text": "What is your budget range?",
  "question_type": "select",
  "required": true,
  "order": 1,
  "placeholder": "Select budget range",
  "help_text": "Choose the budget that best fits your needs",
  "validation_rules": null,
  "is_active": true
}
```

**Field Descriptions:**
- `section_type` (enum, required): Either `general` or `service_specific`
- `service_id` (string, optional): Required when `section_type` is `service_specific`, must be null for `general`
- `question_text` (string, required): The question text
- `question_type` (enum, required): Type of input field
- `required` (boolean, required): Whether the question is mandatory
- `order` (integer, required): Display order within the section
- `placeholder` (string, optional): Placeholder text
- `help_text` (string, optional): Help text
- `validation_rules` (object, optional): Custom validation rules
- `is_active` (boolean, required): Active status

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "form_type": "services",
    "section_type": "service_specific",
    "service_id": "service-uuid",
    "question_text": "What is your budget range?",
    "question_type": "select",
    "required": true,
    "order": 1,
    "placeholder": "Select budget range",
    "help_text": "Choose the budget that best fits your needs",
    "validation_rules": null,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Validation Rules:**
- If `section_type` is `service_specific`, `service_id` must be provided
- If `section_type` is `general`, `service_id` must be null or omitted
- The specified `service_id` must exist in the database

---

#### 3. Update Services Question

Updates an existing services form question.

**Endpoint:** `PUT /api/v1/admin/forms/services/questions/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Question UUID

**Request Body:**
All fields are optional. Only provided fields will be updated.

```json
{
  "question_text": "Updated question text",
  "question_type": "radio",
  "required": false,
  "order": 2,
  "placeholder": "Updated placeholder",
  "help_text": "Updated help text",
  "validation_rules": {
    "custom": "rule"
  },
  "is_active": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "form_type": "services",
    "section_type": "service_specific",
    "service_id": "service-uuid",
    "question_text": "Updated question text",
    "question_type": "radio",
    "required": false,
    "order": 2,
    "placeholder": "Updated placeholder",
    "help_text": "Updated help text",
    "validation_rules": {
      "custom": "rule"
    },
    "is_active": false,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Question not found"
}
```

**Notes:**
- Cannot change `section_type` or `service_id` after creation
- To move a question to a different section or service, delete and recreate it

---

#### 4. Delete Services Question

Deletes a services form question.

**Endpoint:** `DELETE /api/v1/admin/forms/services/questions/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Question UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Question not found"
}
```

---

#### 5. Bulk Reorder Services Questions

Updates the display order of multiple services questions.

**Endpoint:** `PATCH /api/v1/admin/forms/services/questions/bulk-reorder`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "questions": [
    {
      "id": "uuid-1",
      "order": 1
    },
    {
      "id": "uuid-2",
      "order": 2
    },
    {
      "id": "uuid-3",
      "order": 3
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Questions reordered successfully"
}
```

**Notes:**
- Questions are ordered within their section (general or service-specific)
- When reordering service-specific questions, only questions for the same service should be included

---

### Services Question Answers

Services question answers work the same way as podcast question answers but are associated with services form questions.

#### 1. Get Services Question Answers

Retrieves all answers for a specific services question.

**Endpoint:** `GET /api/v1/admin/forms/services/questions/:questionId/answers`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question_id": "question-uuid",
      "answer_text": "$1,000 - $5,000",
      "answer_value": "1000-5000",
      "answer_metadata": null,
      "order": 1,
      "is_active": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 2. Create Services Question Answer

Creates a new answer option for a services question.

**Endpoint:** `POST /api/v1/admin/forms/services/questions/:questionId/answers`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID

**Request Body:**
```json
{
  "answer_text": "$1,000 - $5,000",
  "answer_value": "1000-5000",
  "answer_metadata": null,
  "order": 1,
  "is_active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "question_id": "question-uuid",
    "answer_text": "$1,000 - $5,000",
    "answer_value": "1000-5000",
    "answer_metadata": null,
    "order": 1,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

#### 3. Update Services Question Answer

Updates an existing answer for a services question.

**Endpoint:** `PUT /api/v1/admin/forms/services/questions/:questionId/answers/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID
- `id` (string, required): Answer UUID

**Request Body:**
All fields are optional.

```json
{
  "answer_text": "$5,000 - $10,000",
  "answer_value": "5000-10000",
  "order": 2,
  "is_active": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "question_id": "question-uuid",
    "answer_text": "$5,000 - $10,000",
    "answer_value": "5000-10000",
    "answer_metadata": null,
    "order": 2,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Answer not found"
}
```

---

#### 4. Delete Services Question Answer

Deletes an answer option from a services question.

**Endpoint:** `DELETE /api/v1/admin/forms/services/questions/:questionId/answers/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID
- `id` (string, required): Answer UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Answer deleted successfully"
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Answer not found"
}
```

---

#### 5. Bulk Reorder Services Question Answers

Updates the display order of multiple answers for a services question.

**Endpoint:** `PATCH /api/v1/admin/forms/services/questions/:questionId/answers/bulk-reorder`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `questionId` (string, required): Question UUID

**Request Body:**
```json
{
  "answers": [
    {
      "id": "uuid-1",
      "order": 1
    },
    {
      "id": "uuid-2",
      "order": 2
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Answers reordered successfully"
}
```

---

## Orders (Reservations) Management

The system manages two types of reservations:
1. **Podcast Reservations**: Bookings for podcast appearances
2. **Service Reservations**: Bookings for one or more services

Both reservation types share common features:
- Status management (pending, confirmed, completed, cancelled)
- Status history tracking
- Internal notes system
- Client answer storage

### Podcast Reservations

#### 1. List Podcast Reservations

Retrieves a paginated list of podcast reservations with filtering and sorting options.

**Endpoint:** `GET /api/v1/admin/reservations/podcast`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `page` (integer, optional, default: 1): Page number for pagination
- `limit` (integer, optional, default: 10): Number of items per page
- `status` (string, optional): Filter by status (`pending`, `confirmed`, `completed`, `cancelled`)
- `search` (string, optional): Search in client answers (searches across all answer values)
- `dateFrom` (string, optional): Filter reservations from this date (ISO 8601 format)
- `dateTo` (string, optional): Filter reservations until this date (ISO 8601 format)
- `sortBy` (string, optional): Field to sort by (e.g., `submittedAt`, `status`)
- `order` (string, optional, default: `desc`): Sort order (`asc` or `desc`)

**Example Requests:**

Get first page with default settings:
```
GET /api/v1/admin/reservations/podcast
```

Get pending reservations:
```
GET /api/v1/admin/reservations/podcast?status=pending&page=1&limit=20
```

Search and filter by date range:
```
GET /api/v1/admin/reservations/podcast?search=john&dateFrom=2025-01-01&dateTo=2025-12-31
```

Sort by submission date ascending:
```
GET /api/v1/admin/reservations/podcast?sortBy=submittedAt&order=asc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "uuid",
        "clientId": "client-uuid",
        "confirmationId": "CONF-12345",
        "status": "pending",
        "submittedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15
    }
  }
}
```

**Field Descriptions:**
- `id` (string): Unique reservation UUID
- `clientId` (string): Unique client identifier for this reservation
- `confirmationId` (string): Unique human-readable confirmation code
- `status` (enum): Current status of the reservation
- `submittedAt` (string): ISO 8601 timestamp when the reservation was submitted

**Notes:**
- This endpoint returns minimal reservation data without client form answers
- Use the "Get Podcast Client Data" endpoint to retrieve full form data for a specific client
- The `search` parameter searches across all client answer values
- Date filters use the `submittedAt` timestamp
- Pagination starts at page 1

---

#### 2. Get Podcast Client Data

Retrieves all reservations and complete form data for a specific client by their client ID.

**Endpoint:** `GET /api/v1/admin/reservations/podcast/client/:clientId`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `clientId` (string, required): Client UUID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "client": {
      "id": "client-uuid",
      "reservations": [
        {
          "reservationId": "reservation-uuid",
          "confirmationId": "CONF-12345",
          "status": "confirmed",
          "submittedAt": "2025-01-15T10:30:00.000Z",
          "clientAnswers": [
            {
              "questionId": "q-uuid-1",
              "questionText": "What is your podcast topic?",
              "questionType": "text",
              "value": "Technology and Innovation",
              "answerId": null,
              "answerText": null,
              "answerMetadata": null
            },
            {
              "questionId": "q-uuid-2",
              "questionText": "Preferred recording format",
              "questionType": "select",
              "value": "remote",
              "answerId": "a-uuid-1",
              "answerText": "Remote (Video Call)",
              "answerMetadata": {
                "icon": "video-icon.svg"
              }
            }
          ]
        }
      ]
    }
  }
}
```

**Field Descriptions:**
- `client.id` (string): The client's unique identifier
- `client.reservations` (array): All reservations associated with this client
  - `reservationId` (string): Unique reservation UUID
  - `confirmationId` (string): Human-readable confirmation code
  - `status` (enum): Current reservation status
  - `submittedAt` (string): Submission timestamp
  - `clientAnswers` (array): Complete form data submitted by the client
    - For text-based questions: `value` contains the user's input, `answerId` is null
    - For selection-based questions: `value` contains the selected value, `answerId` and `answerText` contain the selected answer details

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Client not found"
}
```

**Notes:**
- This endpoint returns all reservations for a specific client with complete form data
- Use this endpoint when you need to view all information submitted by a client
- The `clientId` is obtained from the list endpoint

---

#### 3. Get Podcast Reservation Details

Retrieves detailed information about a specific podcast reservation including status history and notes.

**Endpoint:** `GET /api/v1/admin/reservations/podcast/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reservation": {
      "id": "uuid",
      "confirmationId": "CONF-12345",
      "status": "confirmed",
      "clientAnswers": [
        {
          "questionId": "q-uuid-1",
          "questionText": "What is your podcast topic?",
          "questionType": "text",
          "value": "Technology and Innovation",
          "answerId": null,
          "answerText": null,
          "answerMetadata": null
        }
      ],
      "clientIp": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "submittedAt": "2025-01-15T10:30:00.000Z",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-16T14:20:00.000Z"
    },
    "statusHistory": [
      {
        "id": "history-uuid-1",
        "oldStatus": null,
        "newStatus": "pending",
        "notes": null,
        "changedBy": null,
        "changedAt": "2025-01-15T10:30:00.000Z"
      },
      {
        "id": "history-uuid-2",
        "oldStatus": "pending",
        "newStatus": "confirmed",
        "notes": "Confirmed via email",
        "changedBy": "admin-user-uuid",
        "changedAt": "2025-01-16T14:20:00.000Z"
      }
    ],
    "notes": [
      {
        "id": "note-uuid-1",
        "noteText": "Client prefers morning slots",
        "createdBy": "admin-user-uuid",
        "createdAt": "2025-01-16T14:25:00.000Z"
      }
    ]
  }
}
```

**Field Descriptions:**
- `clientIp` (string, nullable): IP address of the client who submitted the reservation
- `userAgent` (string, nullable): Browser user agent string
- `statusHistory` (array): Complete history of status changes
  - First entry has `oldStatus: null` (initial creation)
  - `changedBy` is null for system-generated changes, contains admin user UUID for manual changes
- `notes` (array): Internal notes added by admin users

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

---

#### 4. Update Podcast Reservation Status

Updates the status of a podcast reservation and records the change in status history.

**Endpoint:** `PATCH /api/v1/admin/reservations/podcast/:id/status`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Confirmed via email with client"
}
```

**Field Descriptions:**
- `status` (enum, required): New status value
  - `pending`: Initial status, awaiting review
  - `confirmed`: Reservation confirmed by admin
  - `completed`: Service/podcast recording completed
  - `cancelled`: Reservation cancelled
- `notes` (string, optional): Optional notes about the status change (stored in status history)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reservation": {
      "id": "uuid",
      "confirmationId": "CONF-12345",
      "status": "confirmed",
      "updatedAt": "2025-01-16T14:20:00.000Z"
    }
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid status value"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

**Notes:**
- Status changes are automatically tracked in the status history
- The admin user ID is extracted from the authentication token and recorded as `changedBy`
- Status transitions are not restricted (any status can change to any other status)

---

#### 5. Add Note to Podcast Reservation

Adds an internal note to a podcast reservation for admin reference.

**Endpoint:** `POST /api/v1/admin/reservations/podcast/:id/notes`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Request Body:**
```json
{
  "noteText": "Client prefers morning time slots for recording"
}
```

**Field Descriptions:**
- `noteText` (string, required): The note content (minimum 1 character)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "note": {
      "id": "note-uuid",
      "noteText": "Client prefers morning time slots for recording",
      "createdBy": "admin-user-uuid",
      "createdAt": "2025-01-16T15:30:00.000Z"
    }
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request body"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

**Notes:**
- Notes are internal and not visible to clients
- The admin user ID is automatically extracted from the authentication token
- Notes cannot be edited or deleted once created (by design for audit trail)

---

#### 6. Delete Podcast Reservation

Permanently deletes a podcast reservation and all associated data.

**Endpoint:** `DELETE /api/v1/admin/reservations/podcast/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation deleted successfully"
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

**Notes:**
- This action is permanent and cannot be undone
- All associated status history and notes are also deleted
- Consider using the `cancelled` status instead of deletion for record-keeping

---

### Service Reservations

Service reservations work similarly to podcast reservations but support multiple services per reservation.

#### 1. List Service Reservations

Retrieves a paginated list of service reservations with filtering and sorting options.

**Endpoint:** `GET /api/v1/admin/reservations/services`

**Authentication:** Required (Admin only)

**Query Parameters:**
- `page` (integer, optional, default: 1): Page number for pagination
- `limit` (integer, optional, default: 10): Number of items per page
- `status` (string, optional): Filter by status (`pending`, `confirmed`, `completed`, `cancelled`)
- `search` (string, optional): Search in client answers
- `serviceId` (string, optional): Filter by specific service UUID
- `dateFrom` (string, optional): Filter reservations from this date (ISO 8601 format)
- `dateTo` (string, optional): Filter reservations until this date (ISO 8601 format)
- `sortBy` (string, optional): Field to sort by
- `order` (string, optional, default: `desc`): Sort order (`asc` or `desc`)

**Example Requests:**

Get all service reservations:
```
GET /api/v1/admin/reservations/services
```

Filter by specific service:
```
GET /api/v1/admin/reservations/services?serviceId=service-uuid
```

Get confirmed reservations for a date range:
```
GET /api/v1/admin/reservations/services?status=confirmed&dateFrom=2025-01-01&dateTo=2025-01-31
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "uuid",
        "clientId": "client-uuid",
        "confirmationId": "SERV-67890",
        "serviceIds": ["service-uuid-1", "service-uuid-2"],
        "status": "pending",
        "submittedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 200,
      "page": 1,
      "limit": 10,
      "totalPages": 20
    }
  }
}
```

**Field Descriptions:**
- `id` (string): Unique reservation UUID
- `clientId` (string): Unique client identifier for this reservation
- `confirmationId` (string): Unique human-readable confirmation code
- `serviceIds` (array): Array of service UUIDs included in this reservation
- `status` (enum): Current status of the reservation
- `submittedAt` (string): ISO 8601 timestamp when the reservation was submitted

**Notes:**
- This endpoint returns minimal reservation data without client form answers
- Use the "Get Service Client Data" endpoint to retrieve full form data for a specific client
- A single service reservation can include multiple services
- The `serviceId` query parameter filters reservations that include the specified service

---

#### 2. Get Service Client Data

Retrieves all reservations and complete form data for a specific client by their client ID.

**Endpoint:** `GET /api/v1/admin/reservations/services/client/:clientId`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `clientId` (string, required): Client UUID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "client": {
      "id": "client-uuid",
      "reservations": [
        {
          "reservationId": "reservation-uuid",
          "confirmationId": "SERV-67890",
          "serviceIds": ["service-uuid-1", "service-uuid-2"],
          "status": "confirmed",
          "submittedAt": "2025-01-15T10:30:00.000Z",
          "clientAnswers": [
            {
              "questionId": "q-uuid-1",
              "questionText": "Company name",
              "questionType": "text",
              "sectionType": "general",
              "serviceId": null,
              "serviceName": null,
              "value": "Acme Corporation",
              "answerId": null,
              "answerText": null,
              "answerMetadata": null
            },
            {
              "questionId": "q-uuid-2",
              "questionText": "Budget range",
              "questionType": "select",
              "sectionType": "service_specific",
              "serviceId": "service-uuid-1",
              "serviceName": "Web Development",
              "value": "5000-10000",
              "answerId": "a-uuid-1",
              "answerText": "$5,000 - $10,000",
              "answerMetadata": null
            }
          ]
        }
      ]
    }
  }
}
```

**Field Descriptions:**
- `client.id` (string): The client's unique identifier
- `client.reservations` (array): All reservations associated with this client
  - `reservationId` (string): Unique reservation UUID
  - `confirmationId` (string): Human-readable confirmation code
  - `serviceIds` (array): Array of service UUIDs included in this reservation
  - `status` (enum): Current reservation status
  - `submittedAt` (string): Submission timestamp
  - `clientAnswers` (array): Complete form data submitted by the client
    - `sectionType` (string): Either `general` or `service_specific`
    - `serviceId` (string, nullable): Service UUID for service-specific questions
    - `serviceName` (string, nullable): Service name for service-specific questions
    - For text-based questions: `value` contains the user's input, `answerId` is null
    - For selection-based questions: `value` contains the selected value, `answerId` and `answerText` contain the selected answer details

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Client not found"
}
```

**Notes:**
- This endpoint returns all reservations for a specific client with complete form data
- Use this endpoint when you need to view all information submitted by a client
- The `clientId` is obtained from the list endpoint
- Client answers include both general questions and service-specific questions for each selected service

---

#### 3. Get Service Reservation Details

Retrieves detailed information about a specific service reservation.

**Endpoint:** `GET /api/v1/admin/reservations/services/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reservation": {
      "id": "uuid",
      "confirmationId": "SERV-67890",
      "serviceIds": ["service-uuid-1", "service-uuid-2"],
      "status": "confirmed",
      "clientAnswers": [
        {
          "questionId": "q-uuid-1",
          "questionText": "Company name",
          "questionType": "text",
          "sectionType": "general",
          "serviceId": null,
          "serviceName": null,
          "value": "Acme Corporation",
          "answerId": null,
          "answerText": null,
          "answerMetadata": null
        }
      ],
      "clientIp": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "submittedAt": "2025-01-15T10:30:00.000Z",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-16T14:20:00.000Z"
    },
    "statusHistory": [
      {
        "id": "history-uuid-1",
        "oldStatus": null,
        "newStatus": "pending",
        "notes": null,
        "changedBy": null,
        "changedAt": "2025-01-15T10:30:00.000Z"
      },
      {
        "id": "history-uuid-2",
        "oldStatus": "pending",
        "newStatus": "confirmed",
        "notes": "Confirmed after initial consultation",
        "changedBy": "admin-user-uuid",
        "changedAt": "2025-01-16T14:20:00.000Z"
      }
    ],
    "notes": [
      {
        "id": "note-uuid-1",
        "noteText": "Client needs expedited timeline",
        "createdBy": "admin-user-uuid",
        "createdAt": "2025-01-16T14:25:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

---

#### 4. Update Service Reservation Status

Updates the status of a service reservation.

**Endpoint:** `PATCH /api/v1/admin/reservations/services/:id/status`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Confirmed after initial consultation"
}
```

**Field Descriptions:**
- `status` (enum, required): New status (`pending`, `confirmed`, `completed`, `cancelled`)
- `notes` (string, optional): Optional notes about the status change

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reservation": {
      "id": "uuid",
      "confirmationId": "SERV-67890",
      "status": "confirmed",
      "updatedAt": "2025-01-16T14:20:00.000Z"
    }
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid status value"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

---

#### 5. Add Note to Service Reservation

Adds an internal note to a service reservation.

**Endpoint:** `POST /api/v1/admin/reservations/services/:id/notes`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Request Body:**
```json
{
  "noteText": "Client needs expedited timeline - discussed 2-week delivery"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "note": {
      "id": "note-uuid",
      "noteText": "Client needs expedited timeline - discussed 2-week delivery",
      "createdBy": "admin-user-uuid",
      "createdAt": "2025-01-16T15:30:00.000Z"
    }
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request body"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

---

#### 6. Delete Service Reservation

Permanently deletes a service reservation and all associated data.

**Endpoint:** `DELETE /api/v1/admin/reservations/services/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (string, required): Reservation UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation deleted successfully"
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": "Reservation not found"
}
```

**Notes:**
- This action is permanent and cannot be undone
- All associated status history and notes are also deleted
- Consider using the `cancelled` status instead of deletion

---

## Common Patterns and Best Practices

### Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200 OK`: Successful GET, PUT, PATCH, DELETE operations
- `201 Created`: Successful POST operations
- `400 Bad Request`: Invalid request body or parameters
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User lacks required permissions (not an admin)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server error

### Pagination

List endpoints return paginated results with the following structure:

```json
{
  "success": true,
  "data": {
    "reservations": [...],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15
    }
  }
}
```

### Data Relationships

**Form Questions and Answers:**
- Questions can have multiple answers (for select, radio, checkbox types)
- Answers are optional for text-based question types
- Service-specific questions are linked to specific services via `service_id`

**Reservations and Status:**
- Each reservation has one current status
- All status changes are tracked in `statusHistory`
- Status history includes the admin user who made the change

**Reservations and Notes:**
- Multiple notes can be added to a reservation
- Notes are append-only (cannot be edited or deleted)
- Each note records the admin user who created it

### Validation Rules

**Question Types and Answers:**
- Text-based types (`text`, `email`, `phone`, `textarea`, `number`, `url`, `date`, `file`): Answers are optional
- Selection types (`select`, `radio`, `checkbox`): Answers should be created for available options

**Service-Specific Questions:**
- Must have `section_type` set to `service_specific`
- Must have a valid `service_id`
- Only appear when the associated service is selected in a reservation

**General Questions:**
- Must have `section_type` set to `general`
- Must have `service_id` as null
- Appear for all service reservations

---

## Appendix

### Base URL

All endpoints are prefixed with the base URL:
```
https://api.mindak.com/api/v1
```

### Date Format

All dates are in ISO 8601 format:
```
2025-01-15T10:30:00.000Z
```

### UUID Format

All IDs use UUID v4 format:
```
550e8400-e29b-41d4-a716-446655440000
```

### Confirmation ID Format

**Podcast Reservations:**
```
CONF-12345
```

**Service Reservations:**
```
SERV-67890
```

---

## Support

For questions or issues with the API, please contact the development team or refer to the main project documentation.

**Last Updated:** 2025-11-08

---

## Changelog

### 2025-11-08
- **Breaking Change**: List endpoints now return minimal reservation data without `clientAnswers`
- Added `clientId` field to all reservations for client identification
- Added new endpoints:
  - `GET /api/v1/admin/reservations/podcast/client/:clientId` - Get all podcast reservations and form data for a specific client
  - `GET /api/v1/admin/reservations/services/client/:clientId` - Get all service reservations and form data for a specific client
- List endpoints now include `clientId` in the response for fetching detailed client data
- Improved data structure consistency and separation of concerns between list and detail views

