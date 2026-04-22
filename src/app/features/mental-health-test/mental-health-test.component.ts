import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MentalHealthService } from '../../core/services/mental-health.service';
import { MentalHealthTest, MentalHealthTestQuestion } from '../../core/models/mental-health.model';

@Component({
  selector: 'app-mental-health-test',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="mental-health-test">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Test de Salud Mental (HU09)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="!testStarted; else testContent" class="test-start">
            <p>Realizar un test de bienestar emocional rápido para identificar si necesitas derivación profesional.</p>
            <button mat-raised-button color="primary" (click)="startTest()">
              Iniciar Test
            </button>
          </div>

          <ng-template #testContent>
            <div *ngIf="testHistory.length > 0" class="test-history">
              <h3>Historial de Tests</h3>
              <mat-list>
                <mat-list-item *ngFor="let test of testHistory">
                  <strong>{{ test.testType }}</strong> - Resultado: {{ test.result }} 
                  <span class="date">{{ test.completedAt | date }}</span>
                </mat-list-item>
              </mat-list>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mental-health-test { padding: 20px; }
    .test-start { text-align: center; }
    .test-history { margin-top: 20px; }
    .date { float: right; color: #999; }
  `],
})
export class MentalHealthTestComponent implements OnInit {
  private mentalHealthService = inject(MentalHealthService);
  private snackBar = inject(MatSnackBar);

  testStarted = false;
  testHistory: MentalHealthTest[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadTestHistory();
  }

  private loadTestHistory(): void {
    this.mentalHealthService.getTestHistory().subscribe({
      next: (tests) => (this.testHistory = tests),
      error: () => this.snackBar.open('Error al cargar historial', 'Cerrar', { duration: 3000 }),
    });
  }

  startTest(): void {
    this.testStarted = true;
    // Aquí se iniciaría el flujo del test
    this.snackBar.open('Test iniciado. Responde las preguntas honestamente.', 'OK', { duration: 3000 });
  }
}
