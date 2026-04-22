import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalDocument, MedicalDocumentRequest, MedicalHistory } from '../models/medical-document.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class MedicalDocumentService {
  private readonly http = inject(HttpClient);

  uploadDocument(file: File, documentType: string, description: string, isPublic: boolean): Observable<MedicalDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('description', description);
    formData.append('isPublic', isPublic.toString());

    return this.http.post<MedicalDocument>(`${API_BASE_URL}/documents/upload`, formData);
  }

  getDocuments(): Observable<MedicalDocument[]> {
    return this.http.get<MedicalDocument[]>(`${API_BASE_URL}/documents`);
  }

  getDocument(id: number): Observable<MedicalDocument> {
    return this.http.get<MedicalDocument>(`${API_BASE_URL}/documents/${id}`);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/documents/${id}`);
  }

  exportMedicalHistory(dateRange?: { from: Date; to: Date }): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(`${API_BASE_URL}/documents/export`, dateRange);
  }

  shareMedicalHistory(accessCode?: string): Observable<{ accessCode: string; expiryDate: Date }> {
    return this.http.post<{ accessCode: string; expiryDate: Date }>(`${API_BASE_URL}/documents/share`, { accessCode });
  }

  generatePDF(documentIds: number[]): Observable<Blob> {
    return this.http.post(`${API_BASE_URL}/documents/generate-pdf`, { documentIds }, { responseType: 'blob' }) as Observable<Blob>;
  }
}
