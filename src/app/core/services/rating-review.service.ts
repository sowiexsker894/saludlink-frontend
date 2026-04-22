import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RatingReview, RatingReviewRequest, DoctorRatingStats } from '../models/rating-review.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class RatingReviewService {
  private readonly http = inject(HttpClient);

  submitRating(request: RatingReviewRequest): Observable<RatingReview> {
    return this.http.post<RatingReview>(`${API_BASE_URL}/ratings`, request);
  }

  getRatingForAppointment(appointmentId: number): Observable<RatingReview | null> {
    return this.http.get<RatingReview | null>(`${API_BASE_URL}/ratings/appointment/${appointmentId}`);
  }

  updateRating(ratingId: number, request: RatingReviewRequest): Observable<RatingReview> {
    return this.http.put<RatingReview>(`${API_BASE_URL}/ratings/${ratingId}`, request);
  }

  getDoctorRatings(doctorId: number): Observable<DoctorRatingStats> {
    return this.http.get<DoctorRatingStats>(`${API_BASE_URL}/ratings/doctor/${doctorId}`);
  }

  getPatientRatings(): Observable<RatingReview[]> {
    return this.http.get<RatingReview[]>(`${API_BASE_URL}/ratings/my-ratings`);
  }

  deleteRating(ratingId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/ratings/${ratingId}`);
  }
}
