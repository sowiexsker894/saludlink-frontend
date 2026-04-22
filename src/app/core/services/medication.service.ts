import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Medication, MedicationRequest } from '../models/medication.model';

const MEDICATIONS_BASE_URL = 'http://localhost:8080/api/medications';

const FALLBACK_MEDICATIONS: Medication[] = [
  {
    id: 1,
    name: 'Ibuprofeno',
    dosage: '400mg',
    frequency: 'Cada 8 horas',
    startDate: '2026-04-20T08:00:00.000Z',
    endDate: '2026-04-27T08:00:00.000Z',
    active: true,
  },
  {
    id: 2,
    name: 'Vitamina D',
    dosage: '1000 IU',
    frequency: 'Una vez al día',
    startDate: '2026-04-10T08:00:00.000Z',
    endDate: '2026-05-10T08:00:00.000Z',
    active: true,
  },
  {
    id: 3,
    name: 'Paracetamol',
    dosage: '500mg',
    frequency: 'Cada 6 horas',
    startDate: '2026-04-18T08:00:00.000Z',
    endDate: '2026-04-25T08:00:00.000Z',
    active: false,
  },
];

@Injectable({ providedIn: 'root' })
export class MedicationService {
  private readonly http = inject(HttpClient);

  getMedicationsByPatient(): Observable<Medication[]> {
    return this.http.get<Medication[]>(MEDICATIONS_BASE_URL).pipe(
      catchError(() => of(FALLBACK_MEDICATIONS)),
    );
  }

  addMedication(body: MedicationRequest): Observable<Medication> {
    return this.http.post<Medication>(MEDICATIONS_BASE_URL, body).pipe(
      catchError(() => {
        const medication: Medication = {
          id: Date.now(),
          name: body.name,
          dosage: body.dosage,
          frequency: body.frequency,
          startDate: body.startDate,
          endDate: body.endDate,
          active: true,
        };
        return of(medication);
      }),
    );
  }

  deactivateMedication(id: number): Observable<Medication> {
    return this.http.patch<Medication>(
      `${MEDICATIONS_BASE_URL}/${id}/deactivate`,
      {},
    ).pipe(
      catchError(() =>
        of({
          id,
          name: 'Medicamento desactivado',
          dosage: '',
          frequency: '',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          active: false,
        }),
      ),
    );
  }
}
