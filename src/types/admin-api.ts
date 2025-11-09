// Admin API Types based on ADMIN_API_DOCUMENTATION.md

export interface AdminApiResponse<T> {
  success: boolean;
  data: T;
}

export interface AdminApiError {
  success: false;
  error: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Form Question Types
export type QuestionType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file"
  | "number"
  | "url";

export interface QuestionAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  answer_value: string | null;
  answer_metadata: Record<string, any> | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormQuestion {
  id: string;
  form_type: "podcast" | "services";
  question_text: string;
  question_type: QuestionType;
  required: boolean;
  order: number;
  placeholder: string | null;
  help_text: string | null;
  validation_rules: Record<string, any> | null;
  is_active: boolean;
  answers: QuestionAnswer[];
  created_at: string;
  updated_at: string;
}

export interface ServicesFormQuestion extends FormQuestion {
  section_type: "general" | "service_specific";
  service_id: string | null;
}

// Question Create/Update Types
export interface CreateQuestionRequest {
  question_text: string;
  question_type: QuestionType;
  required: boolean;
  order: number;
  placeholder?: string | null;
  help_text?: string | null;
  validation_rules?: Record<string, any> | null;
  is_active: boolean;
}

export interface CreateServicesQuestionRequest extends CreateQuestionRequest {
  section_type: "general" | "service_specific";
  service_id?: string | null;
}

export interface UpdateQuestionRequest {
  question_text?: string;
  question_type?: QuestionType;
  required?: boolean;
  order?: number;
  placeholder?: string | null;
  help_text?: string | null;
  validation_rules?: Record<string, any> | null;
  is_active?: boolean;
}

export interface BulkReorderRequest {
  questions: Array<{
    id: string;
    order: number;
  }>;
}

// Answer Create/Update Types
export interface CreateAnswerRequest {
  answer_text: string;
  answer_value?: string | null;
  answer_metadata?: Record<string, any> | null;
  order: number;
  is_active: boolean;
}

export interface UpdateAnswerRequest {
  answer_text?: string;
  answer_value?: string | null;
  answer_metadata?: Record<string, any> | null;
  order?: number;
  is_active?: boolean;
}

export interface BulkReorderAnswersRequest {
  answers: Array<{
    id: string;
    order: number;
  }>;
}

// Reservation Types
export type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface ClientAnswer {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  value: string;
  answerId: string | null;
  answerText: string | null;
  answerMetadata: Record<string, any> | null;
}

export interface ServiceClientAnswer extends ClientAnswer {
  sectionType: "general" | "service_specific";
  serviceId: string | null;
  serviceName: string | null;
}

export interface PodcastReservationListItem {
  id: string;
  clientId: string;
  confirmationId: string;
  status: ReservationStatus;
  submittedAt: string;
}

export interface ServiceReservationListItem {
  id: string;
  clientId: string;
  confirmationId: string;
  serviceIds: string[];
  status: ReservationStatus;
  submittedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PodcastReservationsListResponse {
  reservations: PodcastReservationListItem[];
  pagination: PaginationMeta;
}

export interface ServiceReservationsListResponse {
  reservations: ServiceReservationListItem[];
  pagination: PaginationMeta;
}

// Reservation Details Types
export interface StatusHistoryItem {
  id: string;
  oldStatus: ReservationStatus | null;
  newStatus: ReservationStatus;
  notes: string | null;
  changedBy: string | null;
  changedAt: string;
}

export interface ReservationNote {
  id: string;
  noteText: string;
  createdBy: string;
  createdAt: string;
}

export interface PodcastReservationDetails {
  id: string;
  confirmationId: string;
  status: ReservationStatus;
  clientAnswers: ClientAnswer[];
  clientIp: string | null;
  userAgent: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceReservationDetails {
  id: string;
  confirmationId: string;
  serviceIds: string[];
  status: ReservationStatus;
  clientAnswers: ServiceClientAnswer[];
  clientIp: string | null;
  userAgent: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PodcastReservationDetailsResponse {
  reservation: PodcastReservationDetails;
  statusHistory: StatusHistoryItem[];
  notes: ReservationNote[];
}

export interface ServiceReservationDetailsResponse {
  reservation: ServiceReservationDetails;
  statusHistory: StatusHistoryItem[];
  notes: ReservationNote[];
}

// Client Data Types
export interface PodcastClientReservation {
  reservationId: string;
  confirmationId: string;
  status: ReservationStatus;
  submittedAt: string;
  clientAnswers: ClientAnswer[];
}

export interface ServiceClientReservation {
  reservationId: string;
  confirmationId: string;
  serviceIds: string[];
  status: ReservationStatus;
  submittedAt: string;
  clientAnswers: ServiceClientAnswer[];
}

export interface PodcastClientDataResponse {
  client: {
    id: string;
    reservations: PodcastClientReservation[];
  };
}

export interface ServiceClientDataResponse {
  client: {
    id: string;
    reservations: ServiceClientReservation[];
  };
}

// Update Status Types
export interface UpdateReservationStatusRequest {
  status: ReservationStatus;
  notes?: string;
}

export interface UpdateReservationStatusResponse {
  reservation: {
    id: string;
    confirmationId: string;
    status: ReservationStatus;
    updatedAt: string;
  };
}

// Add Note Types
export interface AddReservationNoteRequest {
  noteText: string;
}

export interface AddReservationNoteResponse {
  note: ReservationNote;
}

// Query Parameters
export interface ReservationListQueryParams {
  page?: number;
  limit?: number;
  status?: ReservationStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ServiceReservationListQueryParams extends ReservationListQueryParams {
  serviceId?: string;
}

export interface ServicesQuestionsQueryParams {
  section?: "general" | "service_specific";
  serviceId?: string;
}

// Image Upload Types
export interface UploadImageResponse {
  image_url: string;
}
