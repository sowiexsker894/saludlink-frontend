export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  modality: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface AppointmentRequest {
  doctorId: number;
  appointmentDate: string;
  modality: string;
  notes?: string;
}
