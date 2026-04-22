// HU02: Configuración de perfil de salud
export interface HealthProfile {
  id: number;
  userId: number;
  bloodType: string;
  height: number; // en cm
  weight: number; // en kg
  chronicDiseases: string[];
  allergies: string[];
  medications: string[];
  surgicalHistory: string[];
  emergencyContact: EmergencyContact;
  medicalHistory: string;
  lastCheckup: Date;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface HealthProfileRequest {
  bloodType: string;
  height: number;
  weight: number;
  chronicDiseases: string[];
  allergies: string[];
  surgicalHistory: string[];
  emergencyContact: EmergencyContact;
  medicalHistory: string;
}
