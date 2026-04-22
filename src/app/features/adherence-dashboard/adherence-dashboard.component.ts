import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MedicationService } from '../../core/services/medication.service';
import { Medication } from '../../core/models/medication.model';

@Component({
  selector: 'app-adherence-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
  ],
  template: `
    <div class="adherence-dashboard">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Tablero de Adherencia (HU12)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="overall-adherence">
            <div class="metric">
              <h3>Adherencia General</h3>
              <mat-progress-bar mode="determinate" [value]="overallAdherence"></mat-progress-bar>
              <p>{{ overallAdherence }}%</p>
            </div>
          </div>

          <div class="medication-adherence">
            <h3>Por Medicamento</h3>
            <mat-list>
              <mat-list-item *ngFor="let med of medications">
                <div class="medication-item">
                  <strong>{{ med.name }}</strong>
                  <mat-progress-bar mode="determinate" [value]="med.adherenceRate || 0"></mat-progress-bar>
                  <span>{{ med.adherenceRate || 0 }}%</span>
                </div>
              </mat-list-item>
            </mat-list>
          </div>

          <div class="insights">
            <h3>Análisis</h3>
            <ul>
              <li *ngFor="let insight of adherenceInsights">{{ insight }}</li>
            </ul>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .adherence-dashboard { padding: 20px; }
    .overall-adherence { margin-bottom: 30px; text-align: center; }
    .metric h3 { margin-bottom: 10px; }
    mat-progress-bar { margin: 10px 0; }
    .medication-item { width: 100%; margin: 15px 0; }
    .medication-item strong { display: block; margin-bottom: 5px; }
    .medication-item span { display: block; text-align: right; color: #14a895; }
    .insights { margin-top: 20px; }
    .insights ul { list-style: none; padding: 0; }
    .insights li { padding: 8px; background: #f5f5f5; margin: 5px 0; border-radius: 4px; }
  `],
})
export class AdherenceDashboardComponent implements OnInit {
  private medicationService = inject(MedicationService);

  medications: any[] = [];
  overallAdherence = 75;
  adherenceInsights = [
    'Excelente adherencia a medicamentos matutinos',
    'Necesitas mejorar en medicamentos nocturnos',
    'Has mantenido 15 días de adherencia perfecta',
  ];

  ngOnInit(): void {
    this.loadMedications();
  }

  private loadMedications(): void {
    this.medicationService.getMedicationsByPatient().subscribe({
      next: (medications: Medication[]) => {
        this.medications = medications.map((m: Medication) => ({
          ...m,
          adherenceRate: Math.floor(Math.random() * 100),
        }));
        this.calculateOverallAdherence();
      },
    });
  }

  private calculateOverallAdherence(): void {
    if (this.medications.length > 0) {
      const total = this.medications.reduce((sum, m) => sum + (m.adherenceRate || 0), 0);
      this.overallAdherence = Math.round(total / this.medications.length);
    }
  }
}
