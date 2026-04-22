import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Sesión iniciada', 'Cerrar', { duration: 2500 });
          this.navigateAfterAuth('/dashboard');
        },
        error: () => {
          this.snackBar.open(
            'No se pudo iniciar sesión. Comprueba el servidor o usa modo demo.',
            'Cerrar',
            { duration: 6000 },
          );
        },
      });
  }

  protected onDemo(): void {
    this.auth.enterDemoSession();
    this.snackBar.open('Modo demo activado', 'Cerrar', { duration: 2500 });
    this.navigateAfterAuth('/appointments');
  }

  private navigateAfterAuth(fallback: string): void {
    let url = this.route.snapshot.queryParamMap.get('returnUrl') ?? fallback;
    if (!url.startsWith('/') || url.startsWith('//')) {
      url = fallback;
    }
    void this.router.navigateByUrl(url);
  }
}
