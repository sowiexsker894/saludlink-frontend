// HU20: Chat de seguimiento post-consulta
export interface PostConsultationChat {
  id: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  messages: ChatMessage[];
  status: 'active' | 'closed';
  createdAt: Date;
  closedAt?: Date;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  senderId: number;
  senderType: 'doctor' | 'patient';
  content: string;
  attachments?: string[]; // URLs or file paths
  timestamp: Date;
  isRead: boolean;
}

export interface ChatMessageRequest {
  appointmentId: number;
  content: string;
  attachments?: File[];
}

export interface ChatNotification {
  id: number;
  chatId: number;
  recipientId: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
