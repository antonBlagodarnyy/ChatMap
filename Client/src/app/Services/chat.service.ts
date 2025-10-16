import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { IUser } from '../Interfaces/IUser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  subject: WebSocketSubject<{ to: number; text: string }> | undefined;
  private recipient = new BehaviorSubject<
    { id: number; username: string } | undefined
  >(undefined);
  recipient$ = this.recipient.asObservable();

  constructor(private authService: AuthService) {}

  setRecipient(id: number, username: string) {
    this.recipient.next({ id, username });
  }

  getReceiver$() {
    return this.recipient$;
  }

  connect() {
    const token = this.authService.user$.value?.token;

    if (token) {
      this.subject = webSocket('ws://localhost:8081?token=' + token);
      return this.subject;
    }
    return undefined;
  }

  sendMsg(msg: string) {
    //TODO make a pipeline that combines the current User, the msg and the ws
    /*  if (this.subject) {
      if (recipientId) {
        this.subject.subscribe();
        this.subject.next({
          to: recipientId,
          text: msg,
        });
        this.subject.complete();
        this.subject.error({ code: 4000, reason: 'Smth broke' });
      } */
  }
}
