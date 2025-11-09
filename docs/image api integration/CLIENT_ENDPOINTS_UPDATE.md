# Client Endpoints Update - Image Support

## Summary

The client endpoints for retrieving form questions now include image URLs in the response for answer options.

## Updated Endpoints

### 1. Podcast Form Questions
**Endpoint**: `GET /api/v1/client/forms/podcast/questions`

**What Changed**: 
- ✅ Response now includes `answer_metadata.image` field with image URLs
- ✅ No breaking changes - fully backward compatible
- ✅ Images are optional - field may be null or absent

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question_text": "What topics interest you?",
      "question_type": "checkbox",
      "required": false,
      "order": 1,
      "placeholder": null,
      "help_text": "Select all that apply",
      "validation_rules": null,
      "answers": [
        {
          "id": "uuid",
          "answer_text": "Technology",
          "answer_value": "tech",
          "answer_metadata": {
            "image": "/uploads/question-answers/1699876543210-abc.jpg",
            "description": "Tech topics"
          },
          "order": 1
        },
        {
          "id": "uuid",
          "answer_text": "Business",
          "answer_value": "business",
          "answer_metadata": {
            "image": "/uploads/question-answers/1699876543210-xyz.png"
          },
          "order": 2
        }
      ]
    }
  ]
}
```

---

### 2. Services Form Questions
**Endpoint**: `GET /api/v1/client/forms/services/questions`

**What Changed**: 
- ✅ Response now includes `answer_metadata.image` field with image URLs
- ✅ No breaking changes - fully backward compatible
- ✅ Images are optional - field may be null or absent

**Example Response**:
```json
{
  "success": true,
  "data": {
    "general": [
      {
        "id": "uuid",
        "question_text": "Question text",
        "question_type": "text",
        "required": true,
        "order": 1,
        "placeholder": null,
        "help_text": null,
        "validation_rules": null,
        "answers": []
      }
    ],
    "services": [
      {
        "service_id": "uuid",
        "service_name": "Web Development",
        "questions": [
          {
            "id": "uuid",
            "question_text": "What type of website do you need?",
            "question_type": "select",
            "required": true,
            "order": 1,
            "placeholder": null,
            "help_text": null,
            "validation_rules": null,
            "answers": [
              {
                "id": "uuid",
                "answer_text": "E-commerce",
                "answer_value": "ecommerce",
                "answer_metadata": {
                  "image": "/uploads/question-answers/1699876543210-ecommerce.png",
                  "description": "Online store solution"
                },
                "order": 1
              },
              {
                "id": "uuid",
                "answer_text": "Corporate Website",
                "answer_value": "corporate",
                "answer_metadata": {
                  "image": "/uploads/question-answers/1699876543210-corporate.png"
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

---

## Image URL Format

All image URLs follow this pattern:
```
/uploads/question-answers/{timestamp}-{random-hash}.{extension}
```

**Examples**:
- `/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg`
- `/uploads/question-answers/1699876543210-x9y8z7w6v5u4t3s2.png`

**Full URL Construction**:
```javascript
const API_BASE_URL = 'http://your-domain.com';
const imagePath = answer.answer_metadata?.image;
const fullUrl = imagePath ? `${API_BASE_URL}${imagePath}` : null;
```

---

## Frontend Integration

### Quick Example

```javascript
// Fetch questions
const response = await fetch('/api/v1/client/forms/podcast/questions');
const { data } = await response.json();

// Display answers with images
data.forEach(question => {
  question.answers.forEach(answer => {
    const imageUrl = answer.answer_metadata?.image;
    
    if (imageUrl) {
      // Display image
      console.log(`Image URL: ${API_BASE_URL}${imageUrl}`);
    }
  });
});
```

### React Component

```jsx
function AnswerOption({ answer, questionId }) {
  const imageUrl = answer.answer_metadata?.image 
    ? `${process.env.REACT_APP_API_URL}${answer.answer_metadata.image}`
    : null;

  return (
    <label>
      <input type="radio" name={questionId} value={answer.answer_value} />
      
      {imageUrl && (
        <img src={imageUrl} alt={answer.answer_text} loading="lazy" />
      )}
      
      <span>{answer.answer_text}</span>
    </label>
  );
}
```

---

## Important Notes

### ✅ Backward Compatibility
- **No breaking changes**: Existing clients will continue to work
- **Optional field**: Images may be null or absent
- **Graceful degradation**: Handle missing images in your UI

### 🔍 Image Availability
- Not all answers have images
- Check for `answer_metadata?.image` before displaying
- Provide fallback UI for answers without images

### 🎨 UI Recommendations
- Use images to enhance visual appeal
- Implement lazy loading for better performance
- Add loading states and error handling
- Make images responsive for different screen sizes

### 🔒 Security
- Images are publicly accessible (no authentication required)
- Images are served from `/uploads/question-answers/` directory
- All images are validated on upload (type, size)

---

## Testing

### Test Image Display

1. **Fetch questions**:
```bash
curl http://localhost:8080/api/v1/client/forms/podcast/questions
```

2. **Check for images in response**:
```bash
curl http://localhost:8080/api/v1/client/forms/podcast/questions | jq '.data[].answers[].answer_metadata.image'
```

3. **Access image directly**:
```bash
curl http://localhost:8080/uploads/question-answers/FILENAME.jpg --output test-image.jpg
```

---

## Migration Guide

### No Changes Required! ✅

Your existing frontend code will continue to work without modifications. To add image support:

**Before** (still works):
```jsx
<label>
  <input type="radio" value={answer.answer_value} />
  <span>{answer.answer_text}</span>
</label>
```

**After** (enhanced with images):
```jsx
<label>
  <input type="radio" value={answer.answer_value} />
  
  {answer.answer_metadata?.image && (
    <img 
      src={`${API_URL}${answer.answer_metadata.image}`}
      alt={answer.answer_text}
    />
  )}
  
  <span>{answer.answer_text}</span>
</label>
```

---

## Additional Resources

- **[Client Integration Guide](./CLIENT_IMAGE_INTEGRATION.md)** - Detailed examples and best practices
- **[API Documentation](./api/CLIENT_API_DOCUMENTATION.md)** - Complete API reference
- **[Admin Image Upload Guide](./IMAGE_UPLOAD_API.md)** - For admin users uploading images

---

## Support

For questions or issues:
- Check the [Client Integration Guide](./CLIENT_IMAGE_INTEGRATION.md)
- Review the [API Documentation](./api/CLIENT_API_DOCUMENTATION.md)
- Contact the development team

---

**Update Date**: November 9, 2024  
**Version**: 1.0.0  
**Status**: ✅ Live and Available
