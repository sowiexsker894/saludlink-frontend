// HU16: Pago de consultas en línea
export interface Payment {
  id: number;
  appointmentId: number;
  amount: number;
  currency: string;
  paymentMethod: 'tarjeta' | 'billetera' | 'transferencia';
  status: 'pendiente' | 'procesando' | 'completado' | 'fallido' | 'reembolsado';
  transactionId: string;
  processedAt?: Date;
  receiptUrl?: string;
}

export interface PaymentRequest {
  appointmentId: number;
  amount: number;
  paymentMethod: 'tarjeta' | 'billetera' | 'transferencia';
  cardDetails?: CardDetails;
}

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string; // MM/YY
  cvv: string;
}

export interface PaymentReceipt {
  id: number;
  paymentId: number;
  appointmentDetails: string;
  amount: number;
  processedAt: Date;
  receiptUrl: string;
}
