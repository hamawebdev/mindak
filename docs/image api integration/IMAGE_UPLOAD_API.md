# Image Upload API Documentation for Question Answers

This document provides comprehensive guidance for frontend developers on implementing image upload functionality for question answers in both **Podcast Form Questions** and **Services Form Questions** modules.

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Request/Response Formats](#requestresponse-formats)
4. [Implementation Guide](#implementation-guide)
5. [Example Integration](#example-integration)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## Overview

The image upload functionality allows admins to upload and associate images with answer options for both Podcast and Services form questions. Images are stored locally in the `/uploads/question-answers` directory and served via accessible URLs.

### Key Features

- **File Upload**: Upload images for answer options
- **Supported Formats**: JPEG, JPG, PNG, GIF, WebP, SVG
- **File Size Limit**: 5MB maximum
- **Storage**: Local filesystem at `/uploads/question-answers/`
- **Access**: Images served via `/uploads/question-answers/{filename}`

---

## API Endpoints

### Podcast Question Answers

#### Upload Image for Podcast Answer
```
POST /api/v1/admin/forms/podcast/answers/upload-image
```

**Authentication**: Required (Admin only)

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body** (Form Data):
- `image` (File, required): The image file to upload

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "image_url": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg"
  }
}
```

---

### Services Question Answers

#### Upload Image for Services Answer
```
POST /api/v1/admin/forms/services/answers/upload-image
```

**Authentication**: Required (Admin only)

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body** (Form Data):
- `image` (File, required): The image file to upload

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "image_url": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.png"
  }
}
```

---

## Request/Response Formats

### Creating an Answer with Image

When creating a new answer, include the image URL in the `answer_metadata` field:

**POST** `/api/v1/admin/forms/podcast/questions/{questionId}/answers`

```json
{
  "answer_text": "Option A",
  "answer_value": "option_a",
  "answer_metadata": {
    "image": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg",
    "description": "Optional description",
    "color": "#FF5733",
    "icon": "star"
  },
  "order": 1,
  "is_active": true
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "question_id": "660e8400-e29b-41d4-a716-446655440000",
    "answer_text": "Option A",
    "answer_value": "option_a",
    "answer_metadata": {
      "image": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg",
      "description": "Optional description",
      "color": "#FF5733",
      "icon": "star"
    },
    "order": 1,
    "is_active": true,
    "created_at": "2024-11-09T12:00:00.000Z",
    "updated_at": "2024-11-09T12:00:00.000Z"
  }
}
```

### Updating an Answer with Image

**PUT** `/api/v1/admin/forms/podcast/questions/{questionId}/answers/{answerId}`

```json
{
  "answer_metadata": {
    "image": "/uploads/question-answers/1699876543210-newimage.jpg",
    "description": "Updated description"
  }
}
```

### Getting Answers with Images

**GET** `/api/v1/admin/forms/podcast/questions/{questionId}/answers`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "question_id": "660e8400-e29b-41d4-a716-446655440000",
      "answer_text": "Option A",
      "answer_value": "option_a",
      "answer_metadata": {
        "image": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg",
        "description": "Optional description"
      },
      "order": 1,
      "is_active": true,
      "created_at": "2024-11-09T12:00:00.000Z",
      "updated_at": "2024-11-09T12:00:00.000Z"
    }
  ]
}
```

---

## Implementation Guide

### Step 1: Upload Image

First, upload the image file to get the image URL:

```javascript
async function uploadAnswerImage(imageFile, formType = 'podcast') {
  const formData = new FormData();
  formData.append('image', imageFile);

  const endpoint = formType === 'podcast' 
    ? '/api/v1/admin/forms/podcast/answers/upload-image'
    : '/api/v1/admin/forms/services/answers/upload-image';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: formData
  });

  const data = await response.json();
  return data.data.image_url;
}
```

### Step 2: Create Answer with Image

After uploading, use the returned image URL when creating the answer:

```javascript
async function createAnswerWithImage(questionId, answerData, imageFile, formType = 'podcast') {
  // Upload image first
  const imageUrl = await uploadAnswerImage(imageFile, formType);

  // Create answer with image URL
  const endpoint = formType === 'podcast'
    ? `/api/v1/admin/forms/podcast/questions/${questionId}/answers`
    : `/api/v1/admin/forms/services/questions/${questionId}/answers`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer_text: answerData.text,
      answer_value: answerData.value,
      answer_metadata: {
        image: imageUrl,
        description: answerData.description,
        ...answerData.metadata
      },
      order: answerData.order,
      is_active: answerData.isActive
    })
  });

  return await response.json();
}
```

### Step 3: Display Image

To display the uploaded image:

```javascript
function getImageUrl(imagePath) {
  // The backend serves images from the root
  // imagePath is already in format: /uploads/question-answers/filename.jpg
  return `${API_BASE_URL}${imagePath}`;
}

// Usage in React component
<img 
  src={getImageUrl(answer.answer_metadata?.image)} 
  alt={answer.answer_text}
  className="answer-image"
/>
```

---

## Example Integration

### React Component Example

```jsx
import React, { useState } from 'react';

function AnswerFormWithImage({ questionId, formType = 'podcast' }) {
  const [answerText, setAnswerText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload an image.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadEndpoint = formType === 'podcast'
          ? '/api/v1/admin/forms/podcast/answers/upload-image'
          : '/api/v1/admin/forms/services/answers/upload-image';

        const uploadResponse = await fetch(uploadEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        });

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.data.image_url;
      }

      // Create answer
      const createEndpoint = formType === 'podcast'
        ? `/api/v1/admin/forms/podcast/questions/${questionId}/answers`
        : `/api/v1/admin/forms/services/questions/${questionId}/answers`;

      const response = await fetch(createEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answer_text: answerText,
          answer_value: answerText.toLowerCase().replace(/\s+/g, '_'),
          answer_metadata: imageUrl ? { image: imageUrl } : null,
          order: 1,
          is_active: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Answer created successfully!');
        // Reset form
        setAnswerText('');
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error creating answer:', error);
      alert('Failed to create answer');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Answer Text:</label>
        <input
          type="text"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Answer Image (optional):</label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px' }} />
          </div>
        )}
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Creating...' : 'Create Answer'}
      </button>
    </form>
  );
}

export default AnswerFormWithImage;
```

### Vue.js Component Example

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Answer Text:</label>
      <input v-model="answerText" type="text" required />
    </div>

    <div>
      <label>Answer Image (optional):</label>
      <input 
        type="file" 
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
        @change="handleImageChange"
      />
      <img v-if="imagePreview" :src="imagePreview" alt="Preview" style="max-width: 200px" />
    </div>

    <button type="submit" :disabled="uploading">
      {{ uploading ? 'Creating...' : 'Create Answer' }}
    </button>
  </form>
</template>

<script>
export default {
  props: {
    questionId: String,
    formType: {
      type: String,
      default: 'podcast'
    }
  },
  data() {
    return {
      answerText: '',
      imageFile: null,
      imagePreview: null,
      uploading: false
    };
  },
  methods: {
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
          alert('Invalid file type. Please upload an image.');
          return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5MB limit.');
          return;
        }

        this.imageFile = file;
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async handleSubmit() {
      this.uploading = true;

      try {
        let imageUrl = null;

        // Upload image if selected
        if (this.imageFile) {
          const formData = new FormData();
          formData.append('image', this.imageFile);

          const uploadEndpoint = this.formType === 'podcast'
            ? '/api/v1/admin/forms/podcast/answers/upload-image'
            : '/api/v1/admin/forms/services/answers/upload-image';

          const uploadResponse = await fetch(uploadEndpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.$store.state.accessToken}`
            },
            body: formData
          });

          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.data.image_url;
        }

        // Create answer
        const createEndpoint = this.formType === 'podcast'
          ? `/api/v1/admin/forms/podcast/questions/${this.questionId}/answers`
          : `/api/v1/admin/forms/services/questions/${this.questionId}/answers`;

        const response = await fetch(createEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.$store.state.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answer_text: this.answerText,
            answer_value: this.answerText.toLowerCase().replace(/\s+/g, '_'),
            answer_metadata: imageUrl ? { image: imageUrl } : null,
            order: 1,
            is_active: true
          })
        });

        const data = await response.json();
        
        if (data.success) {
          this.$emit('answer-created', data.data);
          // Reset form
          this.answerText = '';
          this.imageFile = null;
          this.imagePreview = null;
        }
      } catch (error) {
        console.error('Error creating answer:', error);
        alert('Failed to create answer');
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request - No File Uploaded
```json
{
  "success": false,
  "error": {
    "message": "No file uploaded",
    "code": "BAD_REQUEST"
  }
}
```

#### 400 Bad Request - Invalid File Type
```json
{
  "success": false,
  "error": {
    "message": "Invalid file type. Only image files are allowed.",
    "code": "BAD_REQUEST"
  }
}
```

#### 413 Payload Too Large - File Size Exceeded
```json
{
  "success": false,
  "error": {
    "message": "File size exceeds the maximum limit of 5MB",
    "code": "PAYLOAD_TOO_LARGE"
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

#### 403 Forbidden - Not Admin
```json
{
  "success": false,
  "error": {
    "message": "Forbidden. Admin access required.",
    "code": "FORBIDDEN"
  }
}
```

### Error Handling Example

```javascript
async function uploadAnswerImageWithErrorHandling(imageFile, formType = 'podcast') {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const endpoint = formType === 'podcast' 
      ? '/api/v1/admin/forms/podcast/answers/upload-image'
      : '/api/v1/admin/forms/services/answers/upload-image';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      switch (response.status) {
        case 400:
          throw new Error(errorData.error.message || 'Invalid request');
        case 401:
          throw new Error('Please log in to continue');
        case 403:
          throw new Error('You do not have permission to upload images');
        case 413:
          throw new Error('File size is too large. Maximum size is 5MB');
        default:
          throw new Error('Failed to upload image');
      }
    }

    const data = await response.json();
    return data.data.image_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
```

---

## Best Practices

### 1. Client-Side Validation

Always validate files on the client side before uploading:

```javascript
function validateImageFile(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload a valid image.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit.' };
  }

  return { valid: true };
}
```

### 2. Image Preview

Show users a preview before uploading:

```javascript
function createImagePreview(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}
```

### 3. Progress Indication

Show upload progress for better UX:

```javascript
async function uploadWithProgress(imageFile, formType, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.data.image_url);
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    const endpoint = formType === 'podcast'
      ? '/api/v1/admin/forms/podcast/answers/upload-image'
      : '/api/v1/admin/forms/services/answers/upload-image';

    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.send(formData);
  });
}
```

### 4. Image Optimization

Consider optimizing images before upload:

```javascript
async function optimizeImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
```

### 5. Cleanup Old Images

When updating an answer with a new image, consider implementing cleanup:

```javascript
async function updateAnswerImage(questionId, answerId, newImageFile, oldImageUrl, formType) {
  // Upload new image
  const newImageUrl = await uploadAnswerImage(newImageFile, formType);

  // Update answer with new image
  const endpoint = formType === 'podcast'
    ? `/api/v1/admin/forms/podcast/questions/${questionId}/answers/${answerId}`
    : `/api/v1/admin/forms/services/questions/${questionId}/answers/${answerId}`;

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer_metadata: {
        image: newImageUrl
      }
    })
  });

  // Note: Backend should handle cleanup of old images
  // This is just for reference
  return await response.json();
}
```

### 6. Lazy Loading Images

Implement lazy loading for better performance:

```jsx
<img 
  src={getImageUrl(answer.answer_metadata?.image)} 
  alt={answer.answer_text}
  loading="lazy"
  className="answer-image"
/>
```

---

## Summary

This API provides a complete solution for managing images in question answers:

1. **Upload images** using the dedicated upload endpoints
2. **Store image URLs** in the `answer_metadata.image` field
3. **Display images** using the returned URL paths
4. **Update images** by uploading new files and updating the metadata
5. **Handle errors** gracefully with proper validation and error messages

For any questions or issues, please contact the backend development team.
