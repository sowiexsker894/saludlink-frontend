import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DependentProfile, DependentProfileRequest } from '../models/dependent-profile.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class DependentProfileService {
  private readonly http = inject(HttpClient);

  createDependent(dependent: DependentProfileRequest): Observable<DependentProfile> {
    return this.http.post<DependentProfile>(`${API_BASE_URL}/dependents`, dependent);
  }

  getDependents(): Observable<DependentProfile[]> {
    return this.http.get<DependentProfile[]>(`${API_BASE_URL}/dependents`);
  }

  getDependent(id: number): Observable<DependentProfile> {
    return this.http.get<DependentProfile>(`${API_BASE_URL}/dependents/${id}`);
  }

  updateDependent(id: number, dependent: DependentProfileRequest): Observable<DependentProfile> {
    return this.http.put<DependentProfile>(`${API_BASE_URL}/dependents/${id}`, dependent);
  }

  deleteDependent(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/dependents/${id}`);
  }

  manageDependentAppointments(dependentId: number): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/dependents/${dependentId}/appointments`);
  }

  manageDependentMedications(dependentId: number): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL}/dependents/${dependentId}/medications`);
  }
}
