// HU08: Carga de documentos médicos
// HU13: Exportación segura de historial clínico
export interface MedicalDocument {
  id: number;
  userId: number;
  fileName: string;
  fileType: string; // PDF, JPG, etc
  documentType: 'examen' | 'receta' | 'diagnóstico' | 'otro';
  uploadDate: Date;
  description: string;
  isPublic: boolean;
  accessCode?: string; // para compartir de forma segura
}

export interface MedicalDocumentRequest {
  file: File;
  documentType: 'examen' | 'receta' | 'diagnóstico' | 'otro';
  description: string;
  isPublic: boolean;
}

export interface MedicalHistory {
  id: number;
  userId: number;
  documents: MedicalDocument[];
  generatedAt: Date;
  accessCode: string;
}
