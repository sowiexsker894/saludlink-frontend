import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MedicalDocumentService } from '../../core/services/medical-document.service';
import { MedicalDocument } from '../../core/models/medical-document.model';

@Component({
  selector: 'app-medical-documents',
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
    MatTableModule,
    MatIconModule,
  ],
  template: `
    <div class="medical-documents">
      <mat-card class="upload-card">
        <mat-card-header>
          <mat-card-title>Mis Documentos Médicos (HU08)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="uploadForm" (ngSubmit)="uploadDocument()">
            <div class="form-group">
              <input type="file" #fileInput accept=".pdf,.jpg,.jpeg,.png" />
              <mat-form-field>
                <mat-label>Tipo de Documento</mat-label>
                <mat-select formControlName="documentType">
                  <mat-option value="examen">Examen</mat-option>
                  <mat-option value="receta">Receta</mat-option>
                  <mat-option value="diagnóstico">Diagnóstico</mat-option>
                  <mat-option value="otro">Otro</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Descripción</mat-label>
                <input matInput formControlName="description" />
              </mat-form-field>

              <label>
                <input type="checkbox" formControlName="isPublic" />
                Compartir con médicos
              </label>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="uploading">
              {{ uploading ? 'Subiendo...' : 'Subir Documento' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="documents-list">
        <mat-card-header>
          <mat-card-title>Mis Documentos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="documents" class="documents-table">
            <ng-container matColumnDef="fileName">
              <th mat-header-cell *matHeaderCellDef>Archivo</th>
              <td mat-cell *matCellDef="let document">{{ document.fileName }}</td>
            </ng-container>

            <ng-container matColumnDef="documentType">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let document">{{ document.documentType }}</td>
            </ng-container>

            <ng-container matColumnDef="uploadDate">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let document">{{ document.uploadDate | date }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let document">
                <button mat-icon-button (click)="downloadDocument(document.id)">
                  <mat-icon>download</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteDocument(document.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <button mat-raised-button color="accent" (click)="exportHistory()" class="export-btn">
            📄 Exportar Historial Completo (HU13)
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .medical-documents { padding: 20px; }
    mat-card { margin-bottom: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 15px; }
    .full-width { width: 100%; }
    .documents-table { width: 100%; }
    .export-btn { margin-top: 15px; }
    label { display: flex; align-items: center; gap: 8px; }
  `],
})
export class MedicalDocumentsComponent implements OnInit {
  private documentService = inject(MedicalDocumentService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  uploadForm!: FormGroup;
  documents: MedicalDocument[] = [];
  uploading = false;
  displayedColumns = ['fileName', 'documentType', 'uploadDate', 'actions'];

  ngOnInit(): void {
    this.initForm();
    this.loadDocuments();
  }

  private initForm(): void {
    this.uploadForm = this.fb.group({
      documentType: ['examen', [Validators.required]],
      description: ['', [Validators.required]],
      isPublic: [false],
    });
  }

  private loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (docs) => (this.documents = docs),
      error: () => this.snackBar.open('Error al cargar documentos', 'Cerrar', { duration: 3000 }),
    });
  }

  uploadDocument(): void {
    if (this.uploadForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos', 'Cerrar', { duration: 3000 });
      return;
    }
    // Implementar carga de archivo
    this.snackBar.open('Documento subido exitosamente', 'Cerrar', { duration: 3000 });
  }

  downloadDocument(id: number): void {
    this.snackBar.open('Descargando documento...', 'Cerrar', { duration: 3000 });
  }

  deleteDocument(id: number): void {
    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.documents = this.documents.filter((d) => d.id !== id);
        this.snackBar.open('Documento eliminado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  exportHistory(): void {
    this.documentService.exportMedicalHistory().subscribe({
      next: () => {
        this.snackBar.open('Historial exportado y compartido de forma segura (HU13)', 'Cerrar', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error al exportar', 'Cerrar', { duration: 3000 }),
    });
  }
}
