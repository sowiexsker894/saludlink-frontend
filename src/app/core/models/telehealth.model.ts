// HU05: Realizar teleconsulta por video
export interface TeleconsultSession {
  id: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  videoUrl: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

export interface TeleconsultRequest {
  appointmentId: number;
}
