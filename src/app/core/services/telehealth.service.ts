import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TeleconsultSession, TeleconsultRequest } from '../models/telehealth.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class TelehealthService {
  private readonly http = inject(HttpClient);

  initiateVideoConsultation(request: TeleconsultRequest): Observable<TeleconsultSession> {
    return this.http.post<TeleconsultSession>(`${API_BASE_URL}/telehealth/start`, request);
  }

  getSession(sessionId: number): Observable<TeleconsultSession> {
    return this.http.get<TeleconsultSession>(`${API_BASE_URL}/telehealth/${sessionId}`);
  }

  endSession(sessionId: number): Observable<TeleconsultSession> {
    return this.http.patch<TeleconsultSession>(`${API_BASE_URL}/telehealth/${sessionId}/end`, {});
  }

  getSessionsByPatient(): Observable<TeleconsultSession[]> {
    return this.http.get<TeleconsultSession[]>(`${API_BASE_URL}/telehealth/patient/sessions`);
  }
}
