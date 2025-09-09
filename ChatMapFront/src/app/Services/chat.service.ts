import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { IUser } from '../Interfaces/IUser';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  recipient: IUser | undefined;
  subject: WebSocketSubject<unknown> | undefined;

  constructor(private authService: AuthService) {}

  connect() {
    const token = this.authService.user.value?.token;

    if (token) {
      this.subject = webSocket('ws://localhost:8081?token=' + token);
      this.subject.subscribe({
        next: (value) => console.log('message received: ' + value), // Called whenever there is a message from the server.
        error: (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
        complete: () => console.log('complete'), // Called when connection is closed (for whatever reason).
      });
    }
  }

  sendMsg(msg: string) {
    this.retrieveRecipient();
    if (this.subject) {
      this.subject.subscribe();
      this.subject.next({
        type: 'message',
        message: msg,
        recipient: {username:this.recipient?.username,id:this.recipient?.id},
      });
      this.subject.complete();
      this.subject.error({ code: 4000, reason: 'Smth broke' });
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
