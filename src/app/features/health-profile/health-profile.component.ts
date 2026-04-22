import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HealthProfileService } from '../../core/services/health-profile.service';
import { HealthProfile } from '../../core/models/health-profile.model';

@Component({
  selector: 'app-health-profile',
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
  ],
  template: `
    <div class="health-profile">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Mi Perfil de Salud (HU02)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="form-grid">
              <mat-form-field>
                <mat-label>Tipo de Sangre</mat-label>
                <mat-select formControlName="bloodType">
                  <mat-option value="O+">O+</mat-option>
                  <mat-option value="O-">O-</mat-option>
                  <mat-option value="A+">A+</mat-option>
                  <mat-option value="A-">A-</mat-option>
                  <mat-option value="B+">B+</mat-option>
                  <mat-option value="B-">B-</mat-option>
                  <mat-option value="AB+">AB+</mat-option>
                  <mat-option value="AB-">AB-</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Altura (cm)</mat-label>
                <input matInput formControlName="height" type="number" />
              </mat-form-field>

              <mat-form-field>
                <mat-label>Peso (kg)</mat-label>
                <input matInput formControlName="weight" type="number" />
              </mat-form-field>

              <mat-form-field>
                <mat-label>Alergias</mat-label>
                <input matInput formControlName="allergies" />
              </mat-form-field>

              <mat-form-field>
                <mat-label>Enfermedades Crónicas</mat-label>
                <input matInput formControlName="chronicDiseases" />
              </mat-form-field>

              <mat-form-field>
                <mat-label>Historial Quirúrgico</mat-label>
                <input matInput formControlName="surgicalHistory" />
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Contacto de Emergencia - Nombre</mat-label>
              <input matInput formControlName="emergencyContactName" />
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Contacto de Emergencia - Teléfono</mat-label>
              <input matInput formControlName="emergencyContactPhone" />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="saving">
              {{ saving ? 'Guardando...' : 'Guardar Perfil' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .health-profile { padding: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .full-width { width: 100%; margin-bottom: 20px; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  `],
})
export class HealthProfileComponent implements OnInit {
  private profileService = inject(HealthProfileService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  profileForm!: FormGroup;
  saving = false;

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      bloodType: ['', [Validators.required]],
      height: [null, [Validators.required, Validators.min(1), Validators.max(300)]],
      weight: [null, [Validators.required, Validators.min(1), Validators.max(500)]],
      allergies: [''],
      chronicDiseases: [''],
      surgicalHistory: [''],
      emergencyContactName: ['', [Validators.required]],
      emergencyContactPhone: ['', [Validators.required]],
    });
  }

  private loadProfile(): void {
    this.profileService.getHealthProfile().subscribe({
      next: (profile) => this.populateForm(profile),
      error: () => this.snackBar.open('Error al cargar perfil', 'Cerrar', { duration: 3000 }),
    });
  }

  private populateForm(profile: HealthProfile): void {
    this.profileForm.patchValue({
      bloodType: profile.bloodType,
      height: profile.height,
      weight: profile.weight,
      allergies: profile.allergies.join(', '),
      chronicDiseases: profile.chronicDiseases.join(', '),
      surgicalHistory: profile.surgicalHistory.join(', '),
      emergencyContactName: profile.emergencyContact.name,
      emergencyContactPhone: profile.emergencyContact.phone,
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.saving = true;
    const value = this.profileForm.value;
    const request = {
      bloodType: value.bloodType,
      height: value.height,
      weight: value.weight,
      allergies: value.allergies ? value.allergies.split(',').map((s: string) => s.trim()) : [],
      chronicDiseases: value.chronicDiseases ? value.chronicDiseases.split(',').map((s: string) => s.trim()) : [],
      surgicalHistory: value.surgicalHistory ? value.surgicalHistory.split(',').map((s: string) => s.trim()) : [],
      emergencyContact: {
        name: value.emergencyContactName,
        phone: value.emergencyContactPhone,
        relationship: 'contacto de emergencia',
      },
      medicalHistory: '',
    };

    this.profileService.updateHealthProfile(request).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Perfil guardado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Error al guardar perfil', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
