import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorCredentials, DoctorCredentialsRequest, DoctorProfile } from '../models/doctor-credentials.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class DoctorCredentialsService {
  private readonly http = inject(HttpClient);

  // Para médicos: subir y gestionar credenciales
  submitCredentials(credentials: DoctorCredentialsRequest): Observable<DoctorCredentials> {
    return this.http.post<DoctorCredentials>(`${API_BASE_URL}/doctors/credentials`, credentials);
  }

  getMyCredentials(): Observable<DoctorCredentials> {
    return this.http.get<DoctorCredentials>(`${API_BASE_URL}/doctors/credentials/me`);
  }

  updateCredentials(credentials: DoctorCredentialsRequest): Observable<DoctorCredentials> {
    return this.http.put<DoctorCredentials>(`${API_BASE_URL}/doctors/credentials`, credentials);
  }

  // Para pacientes: ver credenciales de médicos
  getDoctorProfile(doctorId: number): Observable<DoctorProfile> {
    return this.http.get<DoctorProfile>(`${API_BASE_URL}/doctors/${doctorId}/profile`);
  }

  getDoctorCredentials(doctorId: number): Observable<DoctorCredentials> {
    return this.http.get<DoctorCredentials>(`${API_BASE_URL}/doctors/${doctorId}/credentials`);
  }

  verifyDoctorLicense(licenseNumber: string): Observable<{ isValid: boolean }> {
    return this.http.get<{ isValid: boolean }>(`${API_BASE_URL}/doctors/verify-license/${licenseNumber}`);
  }

  getAvailableHours(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE_URL}/doctors/${doctorId}/available-hours`);
  }
}
