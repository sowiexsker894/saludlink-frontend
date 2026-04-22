import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TelehealthService } from '../../core/services/telehealth.service';
import { TeleconsultSession } from '../../core/models/telehealth.model';

@Component({
  selector: 'app-telehealth-video',
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
    <div class="telehealth-video">
      <mat-card class="active-session" *ngIf="activeSession">
        <mat-card-header>
          <mat-card-title>Consulta por Video en Vivo (HU05)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="video-container">
            <div class="video-placeholder">
              🎥 Área de Video
            </div>
          </div>
          <div class="session-info">
            <p><strong>Estado:</strong> {{ activeSession.status }}</p>
            <p><strong>Inicio:</strong> {{ activeSession.startTime | date: 'short' }}</p>
          </div>
          <button mat-raised-button color="warn" (click)="endSession()">
            Finalizar Consulta
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card class="sessions-history">
        <mat-card-header>
          <mat-card-title>Historial de Consultas por Video</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let session of sessions">
              <mat-icon matListItemIcon>{{ getSessionIcon(session.status) }}</mat-icon>
              <div matListItemTitle>Médico #{{ session.doctorId }}</div>
              <div matListItemLine>{{ session.status }}</div>
              <div matListItemLine>{{ session.startTime | date: 'short' }}</div>
              <button matListItemMeta mat-icon-button *ngIf="session.status === 'completed'" (click)="viewNotes(session.id)">
                <mat-icon>description</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .telehealth-video { padding: 20px; }
    mat-card { margin-bottom: 20px; }
    .video-container { margin: 20px 0; }
    .video-placeholder { background: #000; color: #fff; height: 400px; display: flex; align-items: center; justify-content: center; font-size: 24px; border-radius: 8px; }
    .session-info { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 4px; }
    .session-info p { margin: 5px 0; }
  `],
})
export class TelehealthVideoComponent implements OnInit {
  private telehealthService = inject(TelehealthService);
  private snackBar = inject(MatSnackBar);

  activeSession: TeleconsultSession | null = null;
  sessions: TeleconsultSession[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadSessions();
  }

  private loadSessions(): void {
    this.telehealthService.getSessionsByPatient().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.activeSession = sessions.find((s) => s.status === 'active') || null;
      },
      error: () => this.snackBar.open('Error al cargar sesiones', 'Cerrar', { duration: 3000 }),
    });
  }

  endSession(): void {
    if (!this.activeSession) return;

    this.telehealthService.endSession(this.activeSession.id).subscribe({
      next: () => {
        this.snackBar.open('Consulta finalizada', 'Cerrar', { duration: 3000 });
        this.activeSession = null;
        this.loadSessions();
      },
      error: () => this.snackBar.open('Error al finalizar consulta', 'Cerrar', { duration: 3000 }),
    });
  }

  viewNotes(sessionId: number): void {
    this.snackBar.open('Notas de la consulta cargadas', 'Cerrar', { duration: 3000 });
  }

  getSessionIcon(status: string): string {
    switch (status) {
      case 'active':
        return 'videocam';
      case 'completed':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'hourglass_top';
    }
  }
}
