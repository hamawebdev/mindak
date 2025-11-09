# Quick Start Guide - Image Upload for Question Answers

## For Frontend Developers

### 1. Upload an Image

**Endpoint**: 
- Podcast: `POST /api/v1/admin/forms/podcast/answers/upload-image`
- Services: `POST /api/v1/admin/forms/services/answers/upload-image`

**Request**:
```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('/api/v1/admin/forms/podcast/answers/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const { data } = await response.json();
const imageUrl = data.image_url; // e.g., "/uploads/question-answers/123456-abc.jpg"
```

### 2. Create Answer with Image

**Endpoint**: 
- Podcast: `POST /api/v1/admin/forms/podcast/questions/{questionId}/answers`
- Services: `POST /api/v1/admin/forms/services/questions/{questionId}/answers`

**Request**:
```javascript
await fetch(`/api/v1/admin/forms/podcast/questions/${questionId}/answers`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    answer_text: "Option A",
    answer_value: "option_a",
    answer_metadata: {
      image: imageUrl  // Use the URL from step 1
    },
    order: 1,
    is_active: true
  })
});
```

### 3. Display Image

```jsx
<img 
  src={`${API_BASE_URL}${answer.answer_metadata?.image}`}
  alt={answer.answer_text}
/>
```

## Validation Rules

- **Allowed formats**: JPEG, JPG, PNG, GIF, WebP, SVG
- **Max file size**: 5MB
- **Authentication**: Admin access required

## Complete Example (React)

```jsx
import React, { useState } from 'react';

function AnswerImageUpload({ questionId, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append('image', imageFile);

      const uploadRes = await fetch('/api/v1/admin/forms/podcast/answers/upload-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const { data } = await uploadRes.json();

      // 2. Create answer with image
      const createRes = await fetch(`/api/v1/admin/forms/podcast/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answer_text: "My Answer",
          answer_metadata: { image: data.image_url },
          order: 1,
          is_active: true
        })
      });

      const result = await createRes.json();
      onSuccess(result.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        required
      />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload & Create'}
      </button>
    </form>
  );
}
```

## Error Handling

```javascript
try {
  const response = await fetch(endpoint, { method: 'POST', body: formData });
  
  if (!response.ok) {
    const error = await response.json();
    
    if (response.status === 400) {
      alert('Invalid file. Please upload a valid image under 5MB.');
    } else if (response.status === 401) {
      alert('Please log in to continue.');
    } else if (response.status === 403) {
      alert('You do not have permission to upload images.');
    }
    
    return;
  }
  
  const data = await response.json();
  // Success - use data.data.image_url
} catch (error) {
  console.error('Upload failed:', error);
}
```

## API Response Format

### Upload Success
```json
{
  "success": true,
  "data": {
    "image_url": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg"
  }
}
```

### Create Answer Success
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "question_id": "660e8400-e29b-41d4-a716-446655440000",
    "answer_text": "Option A",
    "answer_metadata": {
      "image": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg"
    },
    "order": 1,
    "is_active": true,
    "created_at": "2024-11-09T12:00:00.000Z",
    "updated_at": "2024-11-09T12:00:00.000Z"
  }
}
```

## Need More Details?

See the complete [Image Upload API Documentation](./IMAGE_UPLOAD_API.md) for:
- Detailed API specifications
- Vue.js examples
- Advanced error handling
- Best practices
- Image optimization techniques
