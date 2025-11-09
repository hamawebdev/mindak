# Services API Documentation

## Overview
The Services module provides CRUD operations for managing services in the Mindak backend. Services are the core offerings that clients can book through the platform.

## Architecture

### Domain Layer
- **Models**: `/src/domain/models/service.ts`
- **Repository Interface**: `/src/domain/repositories/service-repository.interface.ts`
- **Use Cases**: `/src/domain/use-cases/service/`

### Infrastructure Layer
- **Schema**: `/src/infra/database/schemas/service.ts`
- **Repository Implementation**: `/src/infra/database/repositories/service-repository.ts`

### Application Layer
- **Admin Router**: `/src/app/routers/admin-services-router.ts`
- **Client Router**: `/src/app/routers/client-services-router.ts`
- **Request Handlers**: `/src/app/request-handlers/services/`

---

## Admin API Endpoints

All admin endpoints require authentication and admin privileges.

### Create Service
**POST** `/api/v1/admin/services`

Creates a new service.

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "name": "Service Name",
  "description": "Service description",
  "price": 100,
  "duration": 60,
  "isActive": true
}
```

**Response**: `201 Created`
```json
{
  "id": "service_id",
  "name": "Service Name",
  "description": "Service description",
  "price": 100,
  "duration": 60,
  "isActive": true,
  "createdAt": "2025-11-09T00:00:00.000Z",
  "updatedAt": "2025-11-09T00:00:00.000Z"
}
```

**Use Case**: `create-service-use-case.ts`

---

### Get All Services
**GET** `/api/v1/admin/services`

Retrieves all services (active and inactive).

**Authentication**: Required (Admin)

**Query Parameters**:
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `search` (optional): Search term to filter services

**Response**: `200 OK`
```json
{
  "services": [
    {
      "id": "service_id",
      "name": "Service Name",
      "description": "Service description",
      "price": 100,
      "duration": 60,
      "isActive": true,
      "createdAt": "2025-11-09T00:00:00.000Z",
      "updatedAt": "2025-11-09T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

**Use Case**: `get-all-services-use-case.ts`

---

### Get Service By ID
**GET** `/api/v1/admin/services/:id`

Retrieves a specific service by its ID.

**Authentication**: Required (Admin)

**Path Parameters**:
- `id`: Service ID

**Response**: `200 OK`
```json
{
  "id": "service_id",
  "name": "Service Name",
  "description": "Service description",
  "price": 100,
  "duration": 60,
  "isActive": true,
  "createdAt": "2025-11-09T00:00:00.000Z",
  "updatedAt": "2025-11-09T00:00:00.000Z"
}
```

**Use Case**: `get-service-by-id-use-case.ts`

---

### Update Service
**PUT** `/api/v1/admin/services/:id`

Updates an existing service.

**Authentication**: Required (Admin)

**Path Parameters**:
- `id`: Service ID

**Request Body**:
```json
{
  "name": "Updated Service Name",
  "description": "Updated description",
  "price": 150,
  "duration": 90,
  "isActive": true
}
```

**Response**: `200 OK`
```json
{
  "id": "service_id",
  "name": "Updated Service Name",
  "description": "Updated description",
  "price": 150,
  "duration": 90,
  "isActive": true,
  "createdAt": "2025-11-09T00:00:00.000Z",
  "updatedAt": "2025-11-09T00:00:00.000Z"
}
```

**Use Case**: `update-service-use-case.ts`

---

### Delete Service
**DELETE** `/api/v1/admin/services/:id`

Deletes a service.

**Authentication**: Required (Admin)

**Path Parameters**:
- `id`: Service ID

**Response**: `204 No Content`

**Use Case**: `delete-service-use-case.ts`

---

### Toggle Service Status
**PATCH** `/api/v1/admin/services/:id/toggle-status`

Toggles the active status of a service (active ↔ inactive).

**Authentication**: Required (Admin)

**Path Parameters**:
- `id`: Service ID

**Response**: `200 OK`
```json
{
  "id": "service_id",
  "name": "Service Name",
  "isActive": false
}
```

**Use Case**: `toggle-service-status-use-case.ts`

---

### Bulk Update Service Status
**PATCH** `/api/v1/admin/services/bulk-status`

Updates the active status of multiple services at once.

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "serviceIds": ["service_id_1", "service_id_2"],
  "isActive": true
}
```

**Response**: `200 OK`
```json
{
  "updatedCount": 2,
  "services": [
    {
      "id": "service_id_1",
      "isActive": true
    },
    {
      "id": "service_id_2",
      "isActive": true
    }
  ]
}
```

**Use Case**: `bulk-update-service-status-use-case.ts`

---

## Client API Endpoints

### Get Active Services
**GET** `/api/v1/client/services`

Retrieves all active services available for booking.

**Authentication**: Not required (Public)

**Response**: `200 OK`
```json
{
  "services": [
    {
      "id": "service_id",
      "name": "Service Name",
      "description": "Service description",
      "price": 100,
      "duration": 60
    }
  ]
}
```

**Use Case**: `get-active-services-use-case.ts`

---

## CRUD Operations Summary

| Operation | Method | Endpoint | Admin Only | Status |
|-----------|--------|----------|------------|--------|
| **Create** | POST | `/api/v1/admin/services` | ✅ | ✅ Implemented |
| **Read (All)** | GET | `/api/v1/admin/services` | ✅ | ✅ Implemented |
| **Read (Single)** | GET | `/api/v1/admin/services/:id` | ✅ | ✅ Implemented |
| **Update** | PUT | `/api/v1/admin/services/:id` | ✅ | ✅ Implemented |
| **Delete** | DELETE | `/api/v1/admin/services/:id` | ✅ | ✅ Implemented |

**Additional Operations:**
- Toggle Status: ✅ Implemented
- Bulk Update Status: ✅ Implemented
- Get Active Services (Client): ✅ Implemented

---

## Related Documentation

### Service Reservations
See `docs/SERVICE_RESERVATIONS_API.md` for booking and reservation management.

### Service Questions
See `docs/SERVICE_QUESTIONS_API.md` for custom form questions associated with services.

### Analytics
- Get Top Services: `/api/v1/admin/analytics/services/top`
- Get Service Analytics: `/api/v1/admin/analytics/services/:id`

---

## Error Handling

All endpoints follow standard HTTP error codes:

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Service not found
- `500 Internal Server Error`: Server error

**Error Response Format**:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## Database Schema

The service schema includes:

- `id`: Unique identifier
- `name`: Service name
- `description`: Service description
- `price`: Service price (numeric)
- `duration`: Service duration in minutes
- `isActive`: Whether the service is active
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

For detailed schema information, see `/src/infra/database/schemas/service.ts`
