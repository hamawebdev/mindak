# Database Migration Notes - Image Upload Feature

## Overview

**Good News**: No database migrations are required for the image upload feature! 

The existing database schema already supports storing image URLs through the `answer_metadata` JSONB column in the `form_question_answer` table.

## Existing Schema

### Table: `form_question_answer`

```sql
CREATE TABLE form_question_answer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES form_question(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  answer_value VARCHAR(255),
  answer_metadata JSONB,  -- ✅ Already supports image URLs
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### JSONB Structure: `answer_metadata`

The `answer_metadata` column is a flexible JSONB field that can store various metadata, including image URLs:

```typescript
{
  image?: string;        // URL path to uploaded image (NEW USAGE)
  description?: string;  // Optional description
  price?: number;        // Optional price
  icon?: string;         // Optional icon
  color?: string;        // Optional color
  // ... any other custom fields
}
```

## Example Data

### Before (Answer without image)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "question_id": "660e8400-e29b-41d4-a716-446655440000",
  "answer_text": "Option A",
  "answer_value": "option_a",
  "answer_metadata": {
    "description": "First option",
    "color": "#FF5733"
  },
  "order": 1,
  "is_active": true
}
```

### After (Answer with image)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "question_id": "660e8400-e29b-41d4-a716-446655440000",
  "answer_text": "Option A",
  "answer_value": "option_a",
  "answer_metadata": {
    "image": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg",
    "description": "First option",
    "color": "#FF5733"
  },
  "order": 1,
  "is_active": true
}
```

## Data Model

The TypeScript model already supports the image field:

```typescript
// src/domain/models/form-question-answer.ts

export interface AnswerMetadata extends Record<string, unknown> {
  image?: string;        // ✅ Already defined
  description?: string;
  price?: number;
  icon?: string;
  color?: string;
}

export class FormQuestionAnswer {
  id: FormQuestionAnswerId;
  questionId: FormQuestionId;
  answerText: string;
  answerValue: string | null;
  answerMetadata: AnswerMetadata | null;  // ✅ Supports image field
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Operations

### Inserting Answer with Image

```sql
INSERT INTO form_question_answer (
  id,
  question_id,
  answer_text,
  answer_value,
  answer_metadata,
  "order",
  is_active
) VALUES (
  gen_random_uuid(),
  '660e8400-e29b-41d4-a716-446655440000',
  'Option A',
  'option_a',
  '{"image": "/uploads/question-answers/1699876543210-abc.jpg", "description": "First option"}',
  1,
  true
);
```

### Updating Answer with Image

```sql
UPDATE form_question_answer
SET 
  answer_metadata = jsonb_set(
    COALESCE(answer_metadata, '{}'::jsonb),
    '{image}',
    '"/uploads/question-answers/1699876543210-xyz.jpg"'
  ),
  updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

### Querying Answers with Images

```sql
-- Get all answers with images
SELECT *
FROM form_question_answer
WHERE answer_metadata->>'image' IS NOT NULL;

-- Get answers for a specific question with images
SELECT *
FROM form_question_answer
WHERE question_id = '660e8400-e29b-41d4-a716-446655440000'
  AND answer_metadata->>'image' IS NOT NULL;

-- Get image URL from answer
SELECT 
  id,
  answer_text,
  answer_metadata->>'image' as image_url
FROM form_question_answer
WHERE answer_metadata->>'image' IS NOT NULL;
```

### Removing Image from Answer

```sql
UPDATE form_question_answer
SET 
  answer_metadata = answer_metadata - 'image',
  updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

## Indexing Considerations

If you frequently query answers by image presence, consider adding a GIN index:

```sql
-- Optional: Create index for faster queries on answer_metadata
CREATE INDEX idx_form_question_answer_metadata 
ON form_question_answer USING GIN (answer_metadata);
```

This index will improve performance for queries like:
- Finding all answers with images
- Searching within metadata fields
- Filtering by metadata properties

## Backward Compatibility

✅ **Fully backward compatible**

- Existing answers without images continue to work normally
- The `answer_metadata` field is nullable and optional
- No changes to existing data required
- Old API responses remain unchanged
- New image field is additive, not breaking

## Data Validation

The database schema doesn't enforce image URL format, but the application layer validates:

1. **File Upload**: Multer middleware validates file type and size
2. **URL Storage**: Application stores the returned URL path
3. **URL Format**: Always starts with `/uploads/question-answers/`

### Example Validation Query

```sql
-- Check for potentially invalid image URLs
SELECT 
  id,
  answer_text,
  answer_metadata->>'image' as image_url
FROM form_question_answer
WHERE answer_metadata->>'image' IS NOT NULL
  AND answer_metadata->>'image' NOT LIKE '/uploads/question-answers/%';
```

## Cleanup Queries

### Find Orphaned Images

To find images in the database that may not exist on disk:

```sql
-- Get all unique image URLs
SELECT DISTINCT answer_metadata->>'image' as image_url
FROM form_question_answer
WHERE answer_metadata->>'image' IS NOT NULL
ORDER BY image_url;
```

Then verify these files exist in the `/uploads/question-answers/` directory.

### Find Unused Images

To find images on disk that are not referenced in the database, you'll need to:

1. List all files in `/uploads/question-answers/`
2. Query all image URLs from the database
3. Compare the two lists

## Backup Recommendations

### Database Backup
```bash
# Regular PostgreSQL backup (includes all answer metadata)
pg_dump -U postgres -d mindak_db > backup.sql
```

### File System Backup
```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

### Restore Process
```bash
# Restore database
psql -U postgres -d mindak_db < backup.sql

# Restore uploads
tar -xzf uploads-backup-YYYYMMDD.tar.gz
```

## Monitoring Queries

### Count Answers with Images

```sql
SELECT 
  COUNT(*) as total_answers,
  COUNT(CASE WHEN answer_metadata->>'image' IS NOT NULL THEN 1 END) as answers_with_images,
  ROUND(
    100.0 * COUNT(CASE WHEN answer_metadata->>'image' IS NOT NULL THEN 1 END) / COUNT(*),
    2
  ) as percentage_with_images
FROM form_question_answer;
```

### Images by Form Type

```sql
SELECT 
  fq.form_type,
  COUNT(DISTINCT fqa.id) as total_answers,
  COUNT(CASE WHEN fqa.answer_metadata->>'image' IS NOT NULL THEN 1 END) as answers_with_images
FROM form_question_answer fqa
JOIN form_question fq ON fqa.question_id = fq.id
GROUP BY fq.form_type;
```

### Recent Image Uploads

```sql
SELECT 
  fqa.id,
  fqa.answer_text,
  fqa.answer_metadata->>'image' as image_url,
  fqa.created_at,
  fq.form_type
FROM form_question_answer fqa
JOIN form_question fq ON fqa.question_id = fq.id
WHERE fqa.answer_metadata->>'image' IS NOT NULL
ORDER BY fqa.created_at DESC
LIMIT 10;
```

## Summary

✅ **No migration required**  
✅ **Fully backward compatible**  
✅ **Existing schema supports the feature**  
✅ **No data changes needed**  

The image upload feature leverages the existing flexible JSONB structure, making it a zero-migration implementation!

---

**Last Updated**: November 9, 2024  
**Schema Version**: No change required  
**Migration Status**: ✅ Not applicable - existing schema sufficient
