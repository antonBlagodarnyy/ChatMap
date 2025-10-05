import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { IUser } from '../Interfaces/IUser';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  recipient: IUser | undefined;
  subject:
    | WebSocketSubject<{ from: number; to: number; text: string }>
    | undefined;

  constructor(private authService: AuthService) {}

  connect() {
    const token = this.authService.user$.value?.token;

    if (token) {
      this.subject = webSocket('ws://localhost:8081?token=' + token);
      return this.subject;
    }
    return undefined;
  }

  sendMsg(msg: string) {
    this.retrieveRecipient();
    if (this.subject) {
      const currentUserId = this.authService.user$.getValue()?.userId;
      if (currentUserId && this.recipient?.id) {
        this.subject.subscribe();
        this.subject.next({
          from: currentUserId,
          to: this.recipient.id,
          text: msg,
        });
        this.subject.complete();
        this.subject.error({ code: 4000, reason: 'Smth broke' });
      }
    }
  }

  saveRecipient() {
    localStorage.setItem('recipient', JSON.stringify(this.recipient));
  }
  retrieveRecipient() {
    const recipientRaw = localStorage.getItem('recipient');
    if (recipientRaw) this.recipient = JSON.parse(recipientRaw);
  }
}
