# Image Upload Implementation Summary

## Overview

This document summarizes the implementation of image upload functionality for question answers in both **Podcast Form Questions** and **Services Form Questions** modules.

## What Was Implemented

### 1. Dependencies
- **multer** (v2.0.2): Middleware for handling multipart/form-data file uploads
- **@types/multer** (v2.0.0): TypeScript definitions for multer

### 2. Core Infrastructure

#### File Upload Service
- **Location**: `src/core/file-upload/`
- **Files**:
  - `file-upload.interface.ts`: Interface defining file upload operations
  - `file-upload.ts`: Implementation with methods for saving, deleting, and generating unique filenames

#### Upload Middleware
- **Location**: `src/app/middlewares/upload-middleware.ts`
- **Features**:
  - Memory storage configuration
  - File type validation (JPEG, PNG, GIF, WebP, SVG)
  - File size limit (5MB)
  - Multer integration

### 3. API Endpoints

#### Podcast Question Answers
```
POST /api/v1/admin/forms/podcast/answers/upload-image
```
- Accepts multipart/form-data with `image` field
- Returns image URL path
- Admin authentication required

#### Services Question Answers
```
POST /api/v1/admin/forms/services/answers/upload-image
```
- Accepts multipart/form-data with `image` field
- Returns image URL path
- Admin authentication required

### 4. Request Handlers

#### Podcast
- **File**: `src/app/request-handlers/forms/admin/podcast/answers/commands/upload-answer-image-request-handler.ts`
- **Class**: `UploadAnswerImageRequestHandler`

#### Services
- **File**: `src/app/request-handlers/forms/admin/services/answers/commands/upload-answer-image-request-handler.ts`
- **Class**: `UploadServicesAnswerImageRequestHandler`

### 5. Database Schema

The existing `form_question_answer` table already supports image metadata through the `answer_metadata` JSONB column:

```typescript
{
  image?: string;        // URL path to the uploaded image
  description?: string;  // Optional description
  price?: number;        // Optional price
  icon?: string;         // Optional icon
  color?: string;        // Optional color
}
```

### 6. Static File Serving

- **Directory**: `/uploads` at project root
- **Subdirectory**: `/uploads/question-answers/` for answer images
- **Access URL**: `http://your-domain/uploads/question-answers/{filename}`
- **Configuration**: Added in `src/app/server.ts`

### 7. Dependency Injection

Updated the following DI containers:
- **Core Container**: Registered `FileUpload` service
- **Middlewares Container**: Registered `UploadMiddleware`
- **Request Handlers Container**: Registered both upload request handlers
- **DI Types**: Added symbols for all new services

### 8. Router Configuration

Updated `src/app/routers/admin-forms-router.ts` to include:
- Image upload routes for podcast answers
- Image upload routes for services answers
- Middleware integration for file handling

## File Structure

```
mindak backend/
├── docs/
│   ├── IMAGE_UPLOAD_API.md                    # Frontend developer documentation
│   └── IMAGE_UPLOAD_IMPLEMENTATION.md         # This file
├── src/
│   ├── app/
│   │   ├── middlewares/
│   │   │   └── upload-middleware.ts           # Multer configuration
│   │   ├── request-handlers/
│   │   │   └── forms/
│   │   │       └── admin/
│   │   │           ├── podcast/
│   │   │           │   └── answers/
│   │   │           │       └── commands/
│   │   │           │           └── upload-answer-image-request-handler.ts
│   │   │           └── services/
│   │   │               └── answers/
│   │   │                   └── commands/
│   │   │                       └── upload-answer-image-request-handler.ts
│   │   ├── routers/
│   │   │   └── admin-forms-router.ts          # Updated with upload routes
│   │   └── server.ts                          # Updated with static file serving
│   ├── container/
│   │   ├── core/
│   │   │   ├── container.ts                   # Registered FileUpload
│   │   │   └── di-types.ts                    # Added FileUpload symbol
│   │   ├── middlewares/
│   │   │   ├── container.ts                   # Registered UploadMiddleware
│   │   │   └── di-types.ts                    # Added UploadMiddleware symbol
│   │   └── request-handlers/
│   │       ├── container.ts                   # Registered upload handlers
│   │       └── di-types.ts                    # Added upload handler symbols
│   └── core/
│       └── file-upload/
│           ├── file-upload.interface.ts       # File upload interface
│           └── file-upload.ts                 # File upload implementation
└── uploads/                                   # Created automatically
    └── question-answers/                      # Answer images storage
```

## How It Works

### Upload Flow

1. **Client uploads image**:
   - Sends POST request to upload endpoint
   - File sent as multipart/form-data with field name `image`

2. **Middleware validates file**:
   - Checks file type (must be image)
   - Checks file size (max 5MB)
   - Stores file in memory

3. **Request handler processes upload**:
   - Generates unique filename (timestamp + random string)
   - Saves file to `/uploads/question-answers/`
   - Returns URL path

4. **Client receives image URL**:
   - URL format: `/uploads/question-answers/{unique-filename}.{ext}`
   - Client stores this URL in answer metadata

5. **Creating/Updating answer**:
   - Client includes image URL in `answer_metadata.image` field
   - Backend stores metadata in database

6. **Displaying image**:
   - Client accesses image via returned URL
   - Backend serves static file from uploads directory

### Example Workflow

```javascript
// 1. Upload image
const formData = new FormData();
formData.append('image', imageFile);

const uploadResponse = await fetch('/api/v1/admin/forms/podcast/answers/upload-image', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { data } = await uploadResponse.json();
const imageUrl = data.image_url; // "/uploads/question-answers/1699876543210-a1b2c3d4.jpg"

// 2. Create answer with image
await fetch(`/api/v1/admin/forms/podcast/questions/${questionId}/answers`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    answer_text: "Option A",
    answer_metadata: {
      image: imageUrl
    },
    order: 1,
    is_active: true
  })
});

// 3. Display image
<img src={`${API_BASE_URL}${imageUrl}`} alt="Answer option" />
```

## Security Considerations

### Implemented Security Measures

1. **Authentication**: All upload endpoints require admin authentication
2. **File Type Validation**: Only image files are accepted
3. **File Size Limit**: Maximum 5MB per file
4. **Unique Filenames**: Prevents file overwrites and conflicts
5. **Memory Storage**: Files processed in memory before saving

### Recommendations

1. **Add virus scanning**: Consider integrating antivirus scanning for uploaded files
2. **Image processing**: Consider using libraries like `sharp` to:
   - Resize images to standard dimensions
   - Strip EXIF data for privacy
   - Convert to optimized formats
3. **Rate limiting**: Implement rate limiting on upload endpoints
4. **Disk space monitoring**: Monitor uploads directory size
5. **Backup strategy**: Include uploads directory in backup procedures

## Environment Variables

No additional environment variables are required. The implementation uses:
- Project root directory for uploads storage
- Existing authentication/authorization system

## Testing

### Manual Testing

1. **Test image upload**:
```bash
curl -X POST http://localhost:8080/api/v1/admin/forms/podcast/answers/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

2. **Test image access**:
```bash
curl http://localhost:8080/uploads/question-answers/RETURNED_FILENAME.jpg
```

3. **Test file validation**:
   - Try uploading non-image file (should fail)
   - Try uploading file > 5MB (should fail)
   - Try uploading without authentication (should fail)

### Integration Testing

Consider adding tests for:
- File upload success scenarios
- File validation failures
- Authentication/authorization
- Answer creation with images
- Image URL retrieval

## Deployment Considerations

### Production Checklist

- [ ] Ensure `/uploads` directory exists and has write permissions
- [ ] Configure web server (nginx/apache) to serve static files efficiently
- [ ] Set up CDN for image delivery (optional but recommended)
- [ ] Implement backup strategy for uploads directory
- [ ] Monitor disk space usage
- [ ] Configure CORS if frontend is on different domain
- [ ] Set up image optimization pipeline (optional)
- [ ] Configure cache headers for uploaded images

### Docker Deployment

If using Docker, update `docker-compose.yml` to persist uploads:

```yaml
services:
  backend:
    volumes:
      - ./uploads:/app/uploads
```

### Cloud Storage (Future Enhancement)

Consider migrating to cloud storage (AWS S3, Google Cloud Storage, etc.) for:
- Better scalability
- Automatic backups
- CDN integration
- Reduced server load

## Maintenance

### Regular Tasks

1. **Monitor disk space**: Check uploads directory size regularly
2. **Clean orphaned files**: Remove images not referenced in database
3. **Backup uploads**: Include uploads directory in backup routine
4. **Update dependencies**: Keep multer and related packages updated

### Troubleshooting

**Issue**: Upload fails with "No file uploaded"
- **Solution**: Ensure field name is `image` in form data

**Issue**: Upload fails with "Invalid file type"
- **Solution**: Check file MIME type is in allowed list

**Issue**: Images not accessible
- **Solution**: Verify static file serving is configured correctly

**Issue**: Permission denied when saving files
- **Solution**: Check uploads directory permissions

## Future Enhancements

1. **Image optimization**: Automatic resizing and compression
2. **Multiple images**: Support multiple images per answer
3. **Image cropping**: Allow admins to crop images before upload
4. **Cloud storage**: Migrate to S3 or similar service
5. **Image gallery**: Admin interface to browse uploaded images
6. **Bulk upload**: Support uploading multiple images at once
7. **Image metadata**: Extract and store image dimensions, format, etc.
8. **Thumbnail generation**: Auto-generate thumbnails for previews

## Support

For questions or issues:
- Review the [Frontend API Documentation](./IMAGE_UPLOAD_API.md)
- Check the implementation files listed above
- Contact the backend development team

---

**Implementation Date**: November 9, 2024  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready for Use
