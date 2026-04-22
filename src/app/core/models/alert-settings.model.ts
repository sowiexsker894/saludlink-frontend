// HU18: Botón de redirección de emergencia
// HU19: Personalización de alertas de salud
export interface AlertSettings {
  id: number;
  userId: number;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  healthAlerts: boolean;
  emergencyContacts: EmergencyContactAlert[];
  alertFrequency: 'immediate' | '1-hour' | '1-day' | '1-week';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface EmergencyContactAlert {
  id: number;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  notifyOn: 'emergency' | 'all-alerts' | 'custom';
}

export interface AlertSettingsRequest {
  medicationReminders: boolean;
  appointmentReminders: boolean;
  healthAlerts: boolean;
  emergencyContacts: EmergencyContactAlert[];
  alertFrequency: 'immediate' | '1-hour' | '1-day' | '1-week';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface EmergencySOS {
  id: number;
  userId: number;
  timestamp: Date;
  location?: string;
  emergencyType: string;
  contactsNotified: string[];
  status: 'active' | 'responded' | 'resolved' | 'cancelled';
}
