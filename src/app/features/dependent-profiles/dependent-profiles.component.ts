import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DependentProfileService } from '../../core/services/dependent-profile.service';
import { DependentProfile } from '../../core/models/dependent-profile.model';

@Component({
  selector: 'app-dependent-profiles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
  ],
  template: `
    <div class="dependent-profiles">
      <mat-card class="add-dependent">
        <mat-card-header>
          <mat-card-title>Gestión de Perfiles Dependientes (HU15)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="dependentForm" (ngSubmit)="addDependent()">
            <div class="form-grid">
              <mat-form-field>
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="name" />
              </mat-form-field>

              <mat-form-field>
                <mat-label>Fecha de Nacimiento</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dateOfBirth" />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Relación</mat-label>
                <mat-select formControlName="relationship">
                  <mat-option value="hijo">Hijo</mat-option>
                  <mat-option value="hija">Hija</mat-option>
                  <mat-option value="padre">Padre</mat-option>
                  <mat-option value="madre">Madre</mat-option>
                  <mat-option value="otro">Otro</mat-option>
                </mat-select>
              </mat-form-field>

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
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="saving">
              {{ saving ? 'Agregando...' : 'Agregar Dependiente' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="dependents-list">
        <mat-card-header>
          <mat-card-title>Mis Dependientes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="dependents" class="dependents-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let dependent">{{ dependent.name }}</td>
            </ng-container>

            <ng-container matColumnDef="relationship">
              <th mat-header-cell *matHeaderCellDef>Relación</th>
              <td mat-cell *matCellDef="let dependent">{{ dependent.relationship }}</td>
            </ng-container>

            <ng-container matColumnDef="bloodType">
              <th mat-header-cell *matHeaderCellDef>Tipo de Sangre</th>
              <td mat-cell *matCellDef="let dependent">{{ dependent.bloodType || 'N/A' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let dependent">
                <button mat-icon-button (click)="viewDependentAppointments(dependent.id)">
                  <mat-icon>calendar_today</mat-icon>
                </button>
                <button mat-icon-button (click)="viewDependentMedications(dependent.id)">
                  <mat-icon>local_pharmacy</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteDependent(dependent.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dependent-profiles { padding: 20px; }
    mat-card { margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .dependents-table { width: 100%; }
  `],
})
export class DependentProfilesComponent implements OnInit {
  private dependentService = inject(DependentProfileService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  dependentForm!: FormGroup;
  dependents: DependentProfile[] = [];
  saving = false;
  displayedColumns = ['name', 'relationship', 'bloodType', 'actions'];

  ngOnInit(): void {
    this.initForm();
    this.loadDependents();
  }

  private initForm(): void {
    this.dependentForm = this.fb.group({
      name: ['', [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      relationship: ['', [Validators.required]],
      bloodType: [''],
    });
  }

  private loadDependents(): void {
    this.dependentService.getDependents().subscribe({
      next: (deps) => (this.dependents = deps),
      error: () => this.snackBar.open('Error al cargar dependientes', 'Cerrar', { duration: 3000 }),
    });
  }

  addDependent(): void {
    if (this.dependentForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.saving = true;
    this.dependentService.createDependent(this.dependentForm.value).subscribe({
      next: (dependent) => {
        this.dependents.push(dependent);
        this.dependentForm.reset();
        this.saving = false;
        this.snackBar.open('Dependiente agregado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Error al agregar dependiente', 'Cerrar', { duration: 3000 });
      },
    });
  }

  deleteDependent(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este dependiente?')) {
      this.dependentService.deleteDependent(id).subscribe({
        next: () => {
          this.dependents = this.dependents.filter((d) => d.id !== id);
          this.snackBar.open('Dependiente eliminado', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  viewDependentAppointments(dependentId: number): void {
    this.snackBar.open('Citas del dependiente cargadas', 'Cerrar', { duration: 3000 });
  }

  viewDependentMedications(dependentId: number): void {
    this.snackBar.open('Medicamentos del dependiente cargados', 'Cerrar', { duration: 3000 });
  }
}
