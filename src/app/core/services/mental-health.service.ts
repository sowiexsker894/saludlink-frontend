import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MentalHealthTest, MentalHealthTestRequest, MentalHealthTestQuestion } from '../models/mental-health.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class MentalHealthService {
  private readonly http = inject(HttpClient);

  getAvailableTests(): Observable<MentalHealthTestQuestion[]> {
    return this.http.get<MentalHealthTestQuestion[]>(`${API_BASE_URL}/mental-health/tests`);
  }

  submitTest(request: MentalHealthTestRequest): Observable<MentalHealthTest> {
    return this.http.post<MentalHealthTest>(`${API_BASE_URL}/mental-health/submit`, request);
  }

  getTestHistory(): Observable<MentalHealthTest[]> {
    return this.http.get<MentalHealthTest[]>(`${API_BASE_URL}/mental-health/history`);
  }

  getTestResult(testId: number): Observable<MentalHealthTest> {
    return this.http.get<MentalHealthTest>(`${API_BASE_URL}/mental-health/${testId}`);
  }

  getRecommendations(testId: number): Observable<{ recommendations: string[] }> {
    return this.http.get<{ recommendations: string[] }>(`${API_BASE_URL}/mental-health/${testId}/recommendations`);
  }
}
