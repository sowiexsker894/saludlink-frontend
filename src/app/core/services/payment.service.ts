import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment, PaymentRequest, PaymentReceipt } from '../models/payment.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  processPayment(request: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${API_BASE_URL}/payments/process`, request);
  }

  getPaymentsByAppointment(appointmentId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${API_BASE_URL}/payments/appointment/${appointmentId}`);
  }

  getPaymentHistory(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${API_BASE_URL}/payments/history`);
  }

  getPaymentReceipt(paymentId: number): Observable<PaymentReceipt> {
    return this.http.get<PaymentReceipt>(`${API_BASE_URL}/payments/${paymentId}/receipt`);
  }

  refundPayment(paymentId: number): Observable<Payment> {
    return this.http.post<Payment>(`${API_BASE_URL}/payments/${paymentId}/refund`, {});
  }

  downloadReceipt(paymentId: number): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}/payments/${paymentId}/receipt/download`, { responseType: 'blob' }) as Observable<Blob>;
  }

  validateCard(cardNumber: string): Observable<{ isValid: boolean }> {
    return this.http.post<{ isValid: boolean }>(`${API_BASE_URL}/payments/validate-card`, { cardNumber });
  }
}
