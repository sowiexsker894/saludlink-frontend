import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { PostConsultationChatService } from '../../core/services/post-consultation-chat.service';
import { PostConsultationChat, ChatMessage } from '../../core/models/post-consultation-chat.model';

@Component({
  selector: 'app-post-consultation-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="post-consultation-chat">
      <mat-card class="chat-container">
        <mat-card-header>
          <mat-card-title>Chat de Seguimiento Post-Consulta (HU20)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="chat-messages">
            <div *ngFor="let message of messages" [ngClass]="'message ' + message.senderType">
              <div class="message-content">
                <strong>{{ message.senderType === 'doctor' ? 'Médico' : 'Tú' }}</strong>
                <p>{{ message.content }}</p>
                <span class="timestamp">{{ message.timestamp | date: 'short' }}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <form [formGroup]="messageForm" (ngSubmit)="sendMessage()">
            <div class="message-input">
              <mat-form-field>
                <mat-label>Mensaje</mat-label>
                <input matInput formControlName="content" placeholder="Escribe tu duda..." />
              </mat-form-field>
              <button mat-icon-button color="primary" type="submit" [disabled]="sending">
                <mat-icon>{{ sending ? 'hourglass_top' : 'send' }}</mat-icon>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .post-consultation-chat { padding: 20px; }
    .chat-container { height: 600px; display: flex; flex-direction: column; }
    mat-card-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .chat-messages { flex: 1; overflow-y: auto; margin-bottom: 20px; padding: 10px; }
    .message { margin-bottom: 15px; display: flex; }
    .message.doctor { justify-content: flex-start; }
    .message.patient { justify-content: flex-end; }
    .message-content { max-width: 70%; padding: 10px 15px; border-radius: 8px; }
    .message.doctor .message-content { background: #f0f0f0; }
    .message.patient .message-content { background: #14a895; color: white; }
    .timestamp { font-size: 0.8em; opacity: 0.7; display: block; margin-top: 5px; }
    .message-input { display: flex; gap: 10px; align-items: flex-end; }
    .message-input mat-form-field { flex: 1; }
  `],
})
export class PostConsultationChatComponent implements OnInit {
  private chatService = inject(PostConsultationChatService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  messageForm!: FormGroup;
  messages: ChatMessage[] = [];
  sending = false;

  ngOnInit(): void {
    this.initForm();
    this.loadChat();
  }

  private initForm(): void {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  private loadChat(): void {
    // Cargar chat del último appointment
    this.chatService.getChats().subscribe({
      next: (chats) => {
        if (chats.length > 0) {
          const lastChat = chats[chats.length - 1];
          this.messages = lastChat.messages;
        }
      },
      error: () => this.snackBar.open('Error al cargar chat', 'Cerrar', { duration: 3000 }),
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }

    this.sending = true;
    const request = {
      appointmentId: 1,
      content: this.messageForm.get('content')?.value,
    };

    this.chatService.sendMessage(request).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.messageForm.reset();
        this.sending = false;
      },
      error: () => {
        this.sending = false;
        this.snackBar.open('Error al enviar mensaje', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
