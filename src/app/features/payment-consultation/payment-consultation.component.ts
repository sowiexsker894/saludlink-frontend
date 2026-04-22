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
import { PaymentService } from '../../core/services/payment.service';
import { Payment } from '../../core/models/payment.model';

@Component({
  selector: 'app-payment-consultation',
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
  templateUrl: './payment-consultation.html',
  styleUrl: './payment-consultation.scss',
})
export class PaymentConsultationComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  paymentForm!: FormGroup;
  payments: Payment[] = [];
  processing = false;
  displayedColumns = ['appointmentId', 'amount', 'status', 'actions'];

  ngOnInit(): void {
    this.initForm();
    this.loadPaymentHistory();
  }

  private initForm(): void {
    this.paymentForm = this.fb.group({
      paymentMethod: ['tarjeta', [Validators.required]],
      cardNumber: [''],
      cardholderName: [''],
      expiryDate: [''],
      cvv: [''],
    });
  }

  private loadPaymentHistory(): void {
    this.paymentService.getPaymentHistory().subscribe({
      next: (payments) => (this.payments = payments),
      error: () => this.snackBar.open('Error al cargar pagos', 'Cerrar', { duration: 3000 }),
    });
  }

  processPayment(): void {
    if (this.paymentForm.invalid) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.processing = true;
    const request = {
      appointmentId: 1,
      amount: 99,
      paymentMethod: this.paymentForm.get('paymentMethod')?.value,
      cardDetails: {
        cardNumber: this.paymentForm.get('cardNumber')?.value,
        cardholderName: this.paymentForm.get('cardholderName')?.value,
        expiryDate: this.paymentForm.get('expiryDate')?.value,
        cvv: this.paymentForm.get('cvv')?.value,
      },
    };

    this.paymentService.processPayment(request).subscribe({
      next: () => {
        this.processing = false;
        this.paymentForm.reset();
        this.loadPaymentHistory();
        this.snackBar.open('Pago procesado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.processing = false;
        this.snackBar.open('Error al procesar pago', 'Cerrar', { duration: 3000 });
      },
    });
  }

  downloadReceipt(paymentId: number): void {
    this.paymentService.downloadReceipt(paymentId).subscribe({
      next: () => this.snackBar.open('Recibó descargado', 'Cerrar', { duration: 3000 }),
      error: () => this.snackBar.open('Error al descargar recibó', 'Cerrar', { duration: 3000 }),
    });
  }
}

