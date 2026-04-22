import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertSettings, AlertSettingsRequest, EmergencySOS } from '../models/alert-settings.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class AlertSettingsService {
  private readonly http = inject(HttpClient);

  getAlertSettings(): Observable<AlertSettings> {
    return this.http.get<AlertSettings>(`${API_BASE_URL}/alerts/settings`);
  }

  updateAlertSettings(settings: AlertSettingsRequest): Observable<AlertSettings> {
    return this.http.put<AlertSettings>(`${API_BASE_URL}/alerts/settings`, settings);
  }

  triggerEmergencySOS(): Observable<EmergencySOS> {
    return this.http.post<EmergencySOS>(`${API_BASE_URL}/emergency/sos`, {});
  }

  getEmergencyHistory(): Observable<EmergencySOS[]> {
    return this.http.get<EmergencySOS[]>(`${API_BASE_URL}/emergency/history`);
  }

  cancelEmergencySOS(sosId: number): Observable<EmergencySOS> {
    return this.http.patch<EmergencySOS>(`${API_BASE_URL}/emergency/${sosId}/cancel`, {});
  }

  addEmergencyContact(contact: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/alerts/emergency-contact`, contact);
  }

  removeEmergencyContact(contactId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/alerts/emergency-contact/${contactId}`);
  }
}
