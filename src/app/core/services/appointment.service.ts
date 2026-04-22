import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import {
  Appointment,
  AppointmentRequest,
  Doctor,
} from '../models/appointment.model';

const APPOINTMENTS_BASE_URL = 'http://localhost:8080/api/appointments';
const SPECIALTIES_BASE_URL = 'http://localhost:8080/api/specialties';
const DOCTORS_BASE_URL = 'http://localhost:8080/api/doctors';

const FALLBACK_SPECIALTIES: string[] = [
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Ginecología',
  'Traumatología',
];

const FALLBACK_DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Ana López', specialty: 'Cardiología' },
  { id: 2, name: 'Dr. Carlos Ruiz', specialty: 'Cardiología' },
  { id: 3, name: 'Dr. Martín Soto', specialty: 'Medicina General' },
  { id: 4, name: 'Dra. Laura Fernández', specialty: 'Medicina General' },
  { id: 5, name: 'Dra. Inés Pardo', specialty: 'Dermatología' },
  { id: 6, name: 'Dr. Hugo Mena', specialty: 'Dermatología' },
  { id: 7, name: 'Dra. Mónica Díaz', specialty: 'Pediatría' },
  { id: 8, name: 'Dr. Pablo Rivas', specialty: 'Pediatría' },
  { id: 9, name: 'Dra. Silvia Mora', specialty: 'Ginecología' },
  { id: 10, name: 'Dr. Andrés Cuevas', specialty: 'Traumatología' },
];

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);

  getAppointmentsByPatient(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(APPOINTMENTS_BASE_URL);
  }

  getSpecialties(): Observable<string[]> {
    return this.http.get<string[]>(SPECIALTIES_BASE_URL).pipe(
      catchError(() => of([...FALLBACK_SPECIALTIES])),
    );
  }

  getDoctorsBySpecialty(specialty: string): Observable<Doctor[]> {
    if (!specialty) {
      return of([]);
    }
    return this.http
      .get<Doctor[]>(`${DOCTORS_BASE_URL}`, { params: { specialty } })
      .pipe(
        map((list) =>
          list.filter(
            (d) => d.specialty.toLowerCase() === specialty.toLowerCase(),
          ),
        ),
        catchError(
          () =>
            of(
              FALLBACK_DOCTORS.filter(
                (d) => d.specialty.toLowerCase() === specialty.toLowerCase(),
              ),
            ),
        ),
      );
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
