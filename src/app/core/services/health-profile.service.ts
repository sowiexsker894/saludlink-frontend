import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HealthProfile, HealthProfileRequest } from '../models/health-profile.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class HealthProfileService {
  private readonly http = inject(HttpClient);

  getHealthProfile(): Observable<HealthProfile> {
    return this.http.get<HealthProfile>(`${API_BASE_URL}/health-profile`);
  }

  updateHealthProfile(profile: HealthProfileRequest): Observable<HealthProfile> {
    return this.http.put<HealthProfile>(`${API_BASE_URL}/health-profile`, profile);
  }

  createHealthProfile(profile: HealthProfileRequest): Observable<HealthProfile> {
    return this.http.post<HealthProfile>(`${API_BASE_URL}/health-profile`, profile);
  }
}
