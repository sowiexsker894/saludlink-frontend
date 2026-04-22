// HU10: Validación de credenciales médicas
export interface DoctorCredentials {
  id: number;
  doctorId: number;
  licenseNumber: string;
  specialties: string[];
  university: string;
  graduationYear: number;
  isVerified: boolean;
  verificationDate?: Date;
  expiryDate?: Date;
  document?: string; // URL or path
}

export interface DoctorCredentialsRequest {
  licenseNumber: string;
  specialties: string[];
  university: string;
  graduationYear: number;
}

export interface DoctorProfile {
  id: number;
  name: string;
  specialty: string;
  credentials: DoctorCredentials;
  rating: number;
  reviewCount: number;
  availableHours: AvailableHour[];
}

export interface AvailableHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}
