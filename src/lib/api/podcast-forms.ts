// Podcast Forms API endpoints (Client-facing)

import { apiClient } from "./client";
import type { ApiResponse, Question } from "@/types/api";

/**
 * Fetch podcast form questions (client endpoint)
 * Based on CLIENT_API_DOCUMENTATION.md
 */
export async function getPodcastFormQuestions(): Promise<Question[]> {
  const response = await apiClient.get<ApiResponse<Question[]>>(
    "/api/v1/client/forms/podcast/questions"
  );
  return response.data;
}

/**
 * Submit a podcast reservation
 */
export interface PodcastReservationRequest {
  answers: Array<{
    questionId: string;
    value: string;
    answerId?: string | null;
  }>;
}

export interface PodcastReservationResponse {
  confirmationId: string;
  status: string;
  submittedAt: string;
  message: string;
}

export async function submitPodcastReservation(
  data: PodcastReservationRequest
): Promise<PodcastReservationResponse> {
  const response = await apiClient.post<ApiResponse<PodcastReservationResponse>>(
    "/api/v1/client/reservations/podcast",
    data
  );
  return response.data;
}
