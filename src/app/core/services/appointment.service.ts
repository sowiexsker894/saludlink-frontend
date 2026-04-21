import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Appointment,
  AppointmentRequest,
} from '../models/appointment.model';

const APPOINTMENTS_BASE_URL = 'http://localhost:8080/api/appointments';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);

  getAppointmentsByPatient(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(APPOINTMENTS_BASE_URL);
  }

  createAppointment(body: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(APPOINTMENTS_BASE_URL, body);
  }

  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${APPOINTMENTS_BASE_URL}/${id}/cancel`,
      {},
    );
  }
}
