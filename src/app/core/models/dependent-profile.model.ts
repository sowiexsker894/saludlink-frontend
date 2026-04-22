// HU15: Gestión de perfiles dependientes
export interface DependentProfile {
  id: number;
  parentId: number;
  name: string;
  dateOfBirth: Date;
  relationship: 'hijo' | 'hija' | 'padre' | 'madre' | 'otro';
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  appointments?: number[]; // appointment IDs
  medications?: number[]; // medication IDs
}

export interface DependentProfileRequest {
  name: string;
  dateOfBirth: Date;
  relationship: 'hijo' | 'hija' | 'padre' | 'madre' | 'otro';
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
}
