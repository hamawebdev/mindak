# Frontend Integration Examples

This document provides practical code examples for integrating with the API using various frontend technologies.

## Table of Contents

1. [JavaScript (Fetch API)](#javascript-fetch-api)
2. [React with Axios](#react-with-axios)
3. [Vue.js](#vuejs)
4. [TypeScript Types](#typescript-types)
5. [Form Rendering Examples](#form-rendering-examples)

---

## JavaScript (Fetch API)

### Get Active Services

```javascript
async function getActiveServices() {
  try {
    const response = await fetch('http://localhost:8080/client/services', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data; // Array of services
    } else {
      throw new Error('Failed to fetch services');
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

// Usage
getActiveServices()
  .then(services => {
    console.log('Services:', services);
    // Render services in UI
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Get Podcast Questions

```javascript
async function getPodcastQuestions() {
  try {
    const response = await fetch('http://localhost:8080/client/forms/podcast/questions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data; // Array of questions
    } else {
      throw new Error('Failed to fetch questions');
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}
```

### Submit Podcast Reservation

```javascript
async function submitPodcastReservation(answers) {
  try {
    const response = await fetch('http://localhost:8080/client/reservations/podcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data; // Contains confirmationId, status, etc.
    } else {
      throw new Error(data.error?.message || 'Failed to submit reservation');
    }
  } catch (error) {
    console.error('Error submitting reservation:', error);
    throw error;
  }
}

// Usage
const answers = [
  {
    questionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    value: 'John Doe',
    answerId: null,
  },
  {
    questionId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    value: 'john.doe@example.com',
    answerId: null,
  },
];

submitPodcastReservation(answers)
  .then(result => {
    console.log('Confirmation ID:', result.confirmationId);
    // Show success message and confirmation
  })
  .catch(error => {
    console.error('Submission failed:', error);
  });
```

### Submit Service Reservation

```javascript
async function submitServiceReservation(serviceIds, answers) {
  try {
    const response = await fetch('http://localhost:8080/client/reservations/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceIds, answers }),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error?.message || 'Failed to submit reservation');
    }
  } catch (error) {
    console.error('Error submitting reservation:', error);
    throw error;
  }
}

// Usage
const serviceIds = [
  '123e4567-e89b-12d3-a456-426614174000',
  '223e4567-e89b-12d3-a456-426614174001',
];

const answers = [
  {
    questionId: 'f6a7b8c9-d0e1-2345-f123-456789012345',
    value: 'Acme Corporation',
    answerId: null,
  },
];

submitServiceReservation(serviceIds, answers)
  .then(result => {
    console.log('Confirmation:', result);
  });
```

---

## React with Axios

### Setup

```bash
npm install axios
```

### API Service Module

```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export const servicesApi = {
  getActiveServices: () => api.get('/client/services'),
};

export const formsApi = {
  getPodcastQuestions: () => api.get('/client/forms/podcast/questions'),
  getServicesQuestions: () => api.get('/client/forms/services/questions'),
};

export const reservationsApi = {
  submitPodcast: (answers) => 
    api.post('/client/reservations/podcast', { answers }),
  
  submitService: (serviceIds, answers) => 
    api.post('/client/reservations/services', { serviceIds, answers }),
  
  getConfirmation: (confirmationId) => 
    api.get(`/client/reservations/${confirmationId}/confirmation`),
};

export default api;
```

### React Component Example

```jsx
// components/PodcastReservationForm.jsx
import React, { useState, useEffect } from 'react';
import { formsApi, reservationsApi } from '../services/api';

function PodcastReservationForm() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await formsApi.getPodcastQuestions();
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId, value, answerId = null) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, answerId },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const missingRequired = questions
      .filter(q => q.required && !answers[q.id]?.value)
      .map(q => q.question_text);
    
    if (missingRequired.length > 0) {
      setError(`Please answer: ${missingRequired.join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const formattedAnswers = Object.entries(answers).map(([questionId, data]) => ({
        questionId,
        value: data.value,
        answerId: data.answerId,
      }));

      const response = await reservationsApi.submitPodcast(formattedAnswers);
      
      if (response.success) {
        setConfirmationId(response.data.confirmationId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading questions...</div>;
  if (confirmationId) {
    return (
      <div className="success-message">
        <h2>Reservation Submitted!</h2>
        <p>Your confirmation ID: <strong>{confirmationId}</strong></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Podcast Reservation</h2>
      
      {error && <div className="error">{error}</div>}
      
      {questions.map(question => (
        <div key={question.id} className="form-field">
          <label>
            {question.question_text}
            {question.required && <span className="required">*</span>}
          </label>
          
          {question.help_text && (
            <small className="help-text">{question.help_text}</small>
          )}
          
          {renderQuestionInput(question, answers[question.id]?.value, handleInputChange)}
        </div>
      ))}
      
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Reservation'}
      </button>
    </form>
  );
}

function renderQuestionInput(question, value, onChange) {
  const { id, question_type, placeholder, answers: options } = question;
  
  switch (question_type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <input
          type={question_type}
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    
    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    
    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
        />
      );
    
    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => {
            const selectedOption = options.find(opt => opt.answer_text === e.target.value);
            onChange(id, e.target.value, selectedOption?.id);
          }}
        >
          <option value="">Select an option</option>
          {options.map(option => (
            <option key={option.id} value={option.answer_text}>
              {option.answer_text}
            </option>
          ))}
        </select>
      );
    
    case 'radio':
      return (
        <div className="radio-group">
          {options.map(option => (
            <label key={option.id}>
              <input
                type="radio"
                name={id}
                value={option.answer_text}
                checked={value === option.answer_text}
                onChange={(e) => onChange(id, e.target.value, option.id)}
              />
              {option.answer_text}
            </label>
          ))}
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="checkbox-group">
          {options.map(option => (
            <label key={option.id}>
              <input
                type="checkbox"
                value={option.answer_text}
                checked={(value || '').includes(option.answer_text)}
                onChange={(e) => {
                  const currentValues = value ? value.split(', ') : [];
                  const newValues = e.target.checked
                    ? [...currentValues, option.answer_text]
                    : currentValues.filter(v => v !== option.answer_text);
                  onChange(id, newValues.join(', '), option.id);
                }}
              />
              {option.answer_text}
            </label>
          ))}
        </div>
      );
    
    default:
      return <input type="text" value={value || ''} onChange={(e) => onChange(id, e.target.value)} />;
  }
}

export default PodcastReservationForm;
```

---

## Vue.js

### API Service

```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Services
  async getActiveServices() {
    const response = await api.get('/client/services');
    return response.data;
  },

  // Forms
  async getPodcastQuestions() {
    const response = await api.get('/client/forms/podcast/questions');
    return response.data;
  },

  async getServicesQuestions() {
    const response = await api.get('/client/forms/services/questions');
    return response.data;
  },

  // Reservations
  async submitPodcastReservation(answers) {
    const response = await api.post('/client/reservations/podcast', { answers });
    return response.data;
  },

  async submitServiceReservation(serviceIds, answers) {
    const response = await api.post('/client/reservations/services', { 
      serviceIds, 
      answers 
    });
    return response.data;
  },

  async getReservationConfirmation(confirmationId) {
    const response = await api.get(`/client/reservations/${confirmationId}/confirmation`);
    return response.data;
  },
};
```

### Vue Component

```vue
<!-- components/PodcastReservationForm.vue -->
<template>
  <div class="podcast-reservation-form">
    <div v-if="loading">Loading questions...</div>
    
    <div v-else-if="confirmationId" class="success-message">
      <h2>Reservation Submitted!</h2>
      <p>Your confirmation ID: <strong>{{ confirmationId }}</strong></p>
    </div>
    
    <form v-else @submit.prevent="handleSubmit">
      <h2>Podcast Reservation</h2>
      
      <div v-if="error" class="error">{{ error }}</div>
      
      <div
        v-for="question in questions"
        :key="question.id"
        class="form-field"
      >
        <label>
          {{ question.question_text }}
          <span v-if="question.required" class="required">*</span>
        </label>
        
        <small v-if="question.help_text" class="help-text">
          {{ question.help_text }}
        </small>
        
        <!-- Text inputs -->
        <input
          v-if="['text', 'email', 'phone', 'url', 'number'].includes(question.question_type)"
          :type="question.question_type"
          v-model="answers[question.id].value"
          :placeholder="question.placeholder"
        />
        
        <!-- Textarea -->
        <textarea
          v-else-if="question.question_type === 'textarea'"
          v-model="answers[question.id].value"
          :placeholder="question.placeholder"
        />
        
        <!-- Select -->
        <select
          v-else-if="question.question_type === 'select'"
          v-model="answers[question.id].value"
          @change="handleSelectChange(question.id, $event)"
        >
          <option value="">Select an option</option>
          <option
            v-for="option in question.answers"
            :key="option.id"
            :value="option.answer_text"
          >
            {{ option.answer_text }}
          </option>
        </select>
        
        <!-- Radio -->
        <div v-else-if="question.question_type === 'radio'" class="radio-group">
          <label
            v-for="option in question.answers"
            :key="option.id"
          >
            <input
              type="radio"
              :name="question.id"
              :value="option.answer_text"
              v-model="answers[question.id].value"
              @change="answers[question.id].answerId = option.id"
            />
            {{ option.answer_text }}
          </label>
        </div>
      </div>
      
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Submitting...' : 'Submit Reservation' }}
      </button>
    </form>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'PodcastReservationForm',
  
  data() {
    return {
      questions: [],
      answers: {},
      loading: true,
      submitting: false,
      confirmationId: null,
      error: null,
    };
  },
  
  async mounted() {
    await this.loadQuestions();
  },
  
  methods: {
    async loadQuestions() {
      try {
        this.loading = true;
        const response = await api.getPodcastQuestions();
        
        if (response.success) {
          this.questions = response.data;
          
          // Initialize answers object
          this.questions.forEach(q => {
            this.$set(this.answers, q.id, { value: '', answerId: null });
          });
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    handleSelectChange(questionId, event) {
      const question = this.questions.find(q => q.id === questionId);
      const selectedOption = question.answers.find(
        opt => opt.answer_text === event.target.value
      );
      
      if (selectedOption) {
        this.answers[questionId].answerId = selectedOption.id;
      }
    },
    
    async handleSubmit() {
      // Validate required fields
      const missingRequired = this.questions
        .filter(q => q.required && !this.answers[q.id]?.value)
        .map(q => q.question_text);
      
      if (missingRequired.length > 0) {
        this.error = `Please answer: ${missingRequired.join(', ')}`;
        return;
      }
      
      try {
        this.submitting = true;
        this.error = null;
        
        const formattedAnswers = Object.entries(this.answers).map(([questionId, data]) => ({
          questionId,
          value: data.value,
          answerId: data.answerId,
        }));
        
        const response = await api.submitPodcastReservation(formattedAnswers);
        
        if (response.success) {
          this.confirmationId = response.data.confirmationId;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

.required {
  color: red;
}

.error {
  color: red;
  padding: 1rem;
  background: #fee;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.success-message {
  padding: 2rem;
  background: #efe;
  border-radius: 4px;
}
</style>
```

---

## TypeScript Types

```typescript
// types/api.ts

export interface Service {
  id: string;
  name: string;
  description: string | null;
}

export interface Answer {
  id: string;
  answer_text: string;
  answer_value: string | null;
  answer_metadata: Record<string, unknown> | null;
  order: number;
}

export type QuestionType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'file' 
  | 'number' 
  | 'url';

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  required: boolean;
  order: number;
  placeholder: string | null;
  help_text: string | null;
  validation_rules: Record<string, unknown> | null;
  answers: Answer[];
}

export interface ServicesQuestionsData {
  general: Question[];
  services: Array<{
    service_id: string;
    service_name: string | null;
    questions: Question[];
  }>;
}

export interface SubmitAnswer {
  questionId: string;
  value: string;
  answerId?: string | null;
}

export interface PodcastReservationResponse {
  confirmationId: string;
  status: string;
  submittedAt: string;
  message: string;
}

export interface ServiceReservationResponse {
  confirmationId: string;
  status: string;
  services: Array<{
    id: string;
    name: string;
  }>;
  submittedAt: string;
  message: string;
}

export interface ReservationConfirmation {
  confirmationId: string;
  type: 'podcast' | 'service';
  status: string;
  submittedAt: string;
  clientAnswers: Array<{
    questionText: string;
    questionType: string;
    value: string;
    answerText?: string | null;
  }>;
  serviceIds?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    statusCode: number;
  };
}
```

---

For more detailed API documentation, see [CLIENT_API_DOCUMENTATION.md](./CLIENT_API_DOCUMENTATION.md).

