import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RatingReviewService } from '../../core/services/rating-review.service';
import { RatingReview } from '../../core/models/rating-review.model';

@Component({
  selector: 'app-rating-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="rating-review">
      <mat-card class="rating-form">
        <mat-card-header>
          <mat-card-title>Calificación y Reseña (HU17)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="ratingForm" (ngSubmit)="submitRating()">
            <div class="rating-section">
              <h3>Calificación General</h3>
              <mat-form-field>
                <mat-label>Rating (1-5 estrellas)</mat-label>
                <input matInput type="number" min="1" max="5" formControlName="rating" />
              </mat-form-field>
              <div class="stars" *ngFor="let i of [1,2,3,4,5]">
                <button type="button" (click)="setRating(i)" [class.active]="i <= ratingForm.get('rating')?.value">
                  ⭐
                </button>
              </div>
            </div>

            <div class="category-ratings">
              <h3>Evaluación por Categoría</h3>
              
              <div class="category">
                <label>Profesionalismo (1-5)</label>
                <input type="range" min="1" max="5" formControlName="professionalism" />
                <span>{{ ratingForm.get('professionalism')?.value }}/5</span>
              </div>

              <div class="category">
                <label>Comunicación (1-5)</label>
                <input type="range" min="1" max="5" formControlName="communication" />
                <span>{{ ratingForm.get('communication')?.value }}/5</span>
              </div>

              <div class="category">
                <label>Atención (1-5)</label>
                <input type="range" min="1" max="5" formControlName="attentiveness" />
                <span>{{ ratingForm.get('attentiveness')?.value }}/5</span>
              </div>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Comentario</mat-label>
              <textarea matInput formControlName="comment" rows="5" placeholder="Comparte tu experiencia..."></textarea>
            </mat-form-field>

            <label>
              <input type="checkbox" formControlName="isPublic" />
              Hacer visible en el perfil del médico
            </label>

            <button mat-raised-button color="primary" type="submit" [disabled]="submitting">
              {{ submitting ? 'Guardando...' : 'Enviar Reseña' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .rating-review { padding: 20px; }
    mat-card { margin-bottom: 20px; }
    .rating-section, .category-ratings { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .rating-section h3, .category-ratings h3 { color: #14a895; }
    .stars { display: flex; gap: 10px; }
    button { background: none; border: none; font-size: 30px; cursor: pointer; opacity: 0.3; transition: opacity 0.2s; }
    button.active, button:hover { opacity: 1; }
    .category { margin-bottom: 15px; }
    .category label { display: block; margin-bottom: 5px; font-weight: 500; }
    .category input[type="range"] { width: 100%; }
    .category span { float: right; color: #14a895; font-weight: bold; }
    .full-width { width: 100%; display: block; margin-bottom: 20px; }
    label { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
  `],
})
export class RatingReviewComponent implements OnInit {
  private ratingService = inject(RatingReviewService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  ratingForm!: FormGroup;
  submitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.ratingForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      professionalism: [3, [Validators.required]],
      communication: [3, [Validators.required]],
      attentiveness: [3, [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      isPublic: [true],
    });
  }

  setRating(stars: number): void {
    this.ratingForm.patchValue({ rating: stars });
  }

  submitRating(): void {
    if (this.ratingForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos correctamente', 'Cerrar', { duration: 3000 });
      return;
    }

    this.submitting = true;
    const value = this.ratingForm.value;
    const request = {
      appointmentId: 1,
      rating: value.rating,
      comment: value.comment,
      categories: {
        professionalism: value.professionalism,
        communication: value.communication,
        attentiveness: value.attentiveness,
      },
      isPublic: value.isPublic,
    };

    this.ratingService.submitRating(request).subscribe({
      next: () => {
        this.submitting = false;
        this.ratingForm.reset();
        this.snackBar.open('Reseña enviada exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.submitting = false;
        this.snackBar.open('Error al enviar reseña', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
