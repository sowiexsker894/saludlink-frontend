import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AlertSettingsService } from '../../core/services/alert-settings.service';
import { AlertSettings } from '../../core/models/alert-settings.model';

@Component({
  selector: 'app-alert-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
  ],
  template: `
    <div class="alert-settings">
      <mat-card class="sos-button">
        <mat-card-header>
          <mat-card-title>Botón de Emergencia SOS (HU18)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>En caso de emergencia, presiona el botón rojo para alertar a tus contactos de emergencia</p>
          <button mat-fab color="warn" (click)="triggerSOS()" class="sos-btn">
            🚨 SOS
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card class="alert-preferences">
        <mat-card-header>
          <mat-card-title>Personalización de Alertas (HU19)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="alertForm" (ngSubmit)="updateSettings()">
            <div class="alert-toggles">
              <label>
                <input type="checkbox" formControlName="medicationReminders" />
                Recordatorios de Medicamentos
              </label>

              <label>
                <input type="checkbox" formControlName="appointmentReminders" />
                Recordatorios de Citas
              </label>

              <label>
                <input type="checkbox" formControlName="healthAlerts" />
                Alertas de Salud
              </label>

              <label>
                <input type="checkbox" formControlName="soundEnabled" />
                Sonido Habilitado
              </label>

              <label>
                <input type="checkbox" formControlName="vibrationEnabled" />
                Vibración Habilitada
              </label>
            </div>

            <mat-form-field>
              <mat-label>Frecuencia de Alertas</mat-label>
              <mat-select formControlName="alertFrequency">
                <mat-option value="immediate">Inmediata</mat-option>
                <mat-option value="1-hour">Cada 1 hora</mat-option>
                <mat-option value="1-day">Cada 1 día</mat-option>
                <mat-option value="1-week">Cada 1 semana</mat-option>
              </mat-select>
            </mat-form-field>

            <h3>Contactos de Emergencia</h3>
            <mat-list>
              <mat-list-item *ngFor="let contact of emergencyContacts">
                {{ contact.name }} - {{ contact.phone }}
                <button matListItemMeta mat-icon-button (click)="removeContact(contact.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>

            <div class="add-contact">
              <mat-form-field>
                <mat-label>Agregar Contacto</mat-label>
                <input matInput formControlName="newContactName" placeholder="Nombre" />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="newContactPhone" />
              </mat-form-field>
              <button mat-raised-button type="button" (click)="addContact()">Agregar</button>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="saving">
              {{ saving ? 'Guardando...' : 'Guardar Preferencias' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .alert-settings { padding: 20px; }
    mat-card { margin-bottom: 20px; }
    .sos-btn { width: 100px; height: 100px; font-size: 30px; margin: 20px auto; display: block; }
    .alert-toggles { margin-bottom: 20px; }
    .alert-toggles label { display: block; margin: 10px 0; cursor: pointer; }
    .alert-toggles input { margin-right: 10px; }
    mat-form-field { width: 100%; display: block; margin-bottom: 20px; }
    .add-contact { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; margin-bottom: 20px; align-items: end; }
    @media (max-width: 768px) { .add-contact { grid-template-columns: 1fr; } }
  `],
})
export class AlertSettingsComponent implements OnInit {
  private alertService = inject(AlertSettingsService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  alertForm!: FormGroup;
  emergencyContacts: any[] = [];
  saving = false;

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  private initForm(): void {
    this.alertForm = this.fb.group({
      medicationReminders: [true],
      appointmentReminders: [true],
      healthAlerts: [true],
      soundEnabled: [true],
      vibrationEnabled: [true],
      alertFrequency: ['immediate'],
      newContactName: [''],
      newContactPhone: [''],
    });
  }

  private loadSettings(): void {
    this.alertService.getAlertSettings().subscribe({
      next: (settings) => {
        this.populateForm(settings);
        this.emergencyContacts = settings.emergencyContacts;
      },
      error: () => this.snackBar.open('Error al cargar preferencias', 'Cerrar', { duration: 3000 }),
    });
  }

  private populateForm(settings: AlertSettings): void {
    this.alertForm.patchValue({
      medicationReminders: settings.medicationReminders,
      appointmentReminders: settings.appointmentReminders,
      healthAlerts: settings.healthAlerts,
      soundEnabled: settings.soundEnabled,
      vibrationEnabled: settings.vibrationEnabled,
      alertFrequency: settings.alertFrequency,
    });
  }

  addContact(): void {
    const name = this.alertForm.get('newContactName')?.value;
    const phone = this.alertForm.get('newContactPhone')?.value;

    if (!name || !phone) {
      this.snackBar.open('Por favor completa los campos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.emergencyContacts.push({ id: Date.now(), name, phone, relationship: 'contacto', notifyOn: 'emergency' });
    this.alertForm.patchValue({ newContactName: '', newContactPhone: '' });
    this.snackBar.open('Contacto agregado', 'Cerrar', { duration: 3000 });
  }

  removeContact(id: number): void {
    this.emergencyContacts = this.emergencyContacts.filter((c) => c.id !== id);
    this.snackBar.open('Contacto eliminado', 'Cerrar', { duration: 3000 });
  }

  triggerSOS(): void {
    if (confirm('¿Confirmas enviar alerta de emergencia SOS?')) {
      this.alertService.triggerEmergencySOS().subscribe({
        next: () => this.snackBar.open('SOS activado - Contactos notificados', 'Cerrar', { duration: 5000 }),
        error: () => this.snackBar.open('Error al activar SOS', 'Cerrar', { duration: 3000 }),
      });
    }
  }

  updateSettings(): void {
    this.saving = true;
    const value = this.alertForm.value;
    const request = {
      medicationReminders: value.medicationReminders,
      appointmentReminders: value.appointmentReminders,
      healthAlerts: value.healthAlerts,
      emergencyContacts: this.emergencyContacts,
      alertFrequency: value.alertFrequency,
      soundEnabled: value.soundEnabled,
      vibrationEnabled: value.vibrationEnabled,
    };

    this.alertService.updateAlertSettings(request).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Preferencias guardadas exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Error al guardar preferencias', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
