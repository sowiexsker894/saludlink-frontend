import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { DoctorCredentialsService } from '../../core/services/doctor-credentials.service';
import { DoctorProfile } from '../../core/models/doctor-credentials.model';

@Component({
  selector: 'app-doctor-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  template: `
    <div class="doctor-profile-view">
      <mat-card *ngIf="doctor; else loading">
        <mat-card-header>
          <mat-card-title>{{ doctor.name }} (HU10 - Credenciales Validadas)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="doctor-info">
            <div class="info-section">
              <h3>Información Profesional</h3>
              <p><strong>Especialidad:</strong> {{ doctor.specialty }}</p>
              <p><strong>Calificación:</strong> {{ doctor.rating }}/5 ({{ doctor.reviewCount }} reseñas)</p>
            </div>

            <div class="info-section" *ngIf="doctor.credentials">
              <h3>Credenciales Verificadas ✓</h3>
              <p><strong>Licencia:</strong> {{ doctor.credentials.licenseNumber }}</p>
              <p><strong>Universidad:</strong> {{ doctor.credentials.university }}</p>
              <p><strong>Año de Graduación:</strong> {{ doctor.credentials.graduationYear }}</p>
              <p><strong>Estado:</strong> <span class="verified">Verificado</span></p>
              <p *ngIf="doctor.credentials.expiryDate">
                <strong>Vencimiento:</strong> {{ doctor.credentials.expiryDate | date }}
              </p>
            </div>

            <div class="info-section" *ngIf="doctor.availableHours">
              <h3>Horarios Disponibles (HU11)</h3>
              <mat-list>
                <mat-list-item *ngFor="let hour of doctor.availableHours">
                  <strong>{{ hour.day }}</strong>: {{ hour.startTime }} - {{ hour.endTime }}
                </mat-list-item>
              </mat-list>
            </div>
          </div>

          <button mat-raised-button color="primary" (click)="bookAppointment()">
            Agendar Cita
          </button>
        </mat-card-content>
      </mat-card>

      <ng-template #loading>
        <mat-spinner></mat-spinner>
      </ng-template>
    </div>
  `,
  styles: [`
    .doctor-profile-view { padding: 20px; }
    .doctor-info { margin: 20px 0; }
    .info-section { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
    .info-section h3 { color: #14a895; margin-bottom: 10px; }
    .info-section p { margin: 5px 0; }
    .verified { color: green; font-weight: bold; }
    mat-list { max-height: 300px; overflow-y: auto; }
  `],
})
export class DoctorProfileViewComponent implements OnInit {
  private doctorService = inject(DoctorCredentialsService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  doctor: DoctorProfile | null = null;
  loading = true;

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.loadDoctorProfile(parseInt(doctorId));
    }
  }

  private loadDoctorProfile(id: number): void {
    this.doctorService.getDoctorProfile(id).subscribe({
      next: (profile) => {
        this.doctor = profile;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al cargar perfil del médico', 'Cerrar', { duration: 3000 });
      },
    });
  }

  bookAppointment(): void {
    this.snackBar.open('Redirigiendo a agendar cita...', 'Cerrar', { duration: 3000 });
  }
}
