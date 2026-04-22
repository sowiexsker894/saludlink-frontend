import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostConsultationChat, ChatMessage, ChatMessageRequest } from '../models/post-consultation-chat.model';

const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class PostConsultationChatService {
  private readonly http = inject(HttpClient);

  getChatByAppointment(appointmentId: number): Observable<PostConsultationChat> {
    return this.http.get<PostConsultationChat>(`${API_BASE_URL}/chat/appointment/${appointmentId}`);
  }

  getChats(): Observable<PostConsultationChat[]> {
    return this.http.get<PostConsultationChat[]>(`${API_BASE_URL}/chat`);
  }

  sendMessage(request: ChatMessageRequest): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${API_BASE_URL}/chat/message`, request);
  }

  getMessages(chatId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${API_BASE_URL}/chat/${chatId}/messages`);
  }

  markAsRead(messageId: number): Observable<ChatMessage> {
    return this.http.patch<ChatMessage>(`${API_BASE_URL}/chat/message/${messageId}/read`, {});
  }

  closeChat(chatId: number): Observable<PostConsultationChat> {
    return this.http.patch<PostConsultationChat>(`${API_BASE_URL}/chat/${chatId}/close`, {});
  }

  getUnreadMessageCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${API_BASE_URL}/chat/unread-count`);
  }
}
