import { inject, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { BehaviorSubject, EMPTY, map, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../Components/loading/loading.component';
import { HttpClient } from '@angular/common/http';
import { SavedMessage } from '../Interfaces/SavedMessage';
import { Message } from '../Interfaces/Mesage';
import { ChatHistoryService } from './chat-history.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatHistoryService = inject(ChatHistoryService);

  currentUserId: number | undefined;

  private messages = new BehaviorSubject<SavedMessage[]>([]);
  messagesSubject$ = this.messages.asObservable();

  private partnerSubject = new BehaviorSubject<{
    id: number;
    username: string;
  } | null>(this.loadFromSession());
  partner$ = this.partnerSubject.asObservable();

  spinnerRef: any;
  spinnerTimeout: ReturnType<typeof setTimeout> | undefined;

  private wsSubject?: WebSocketSubject<Message>;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialog,
    private http: HttpClient
  ) {}

  setPartner(id: number, username: string) {
    const receiver = { id, username };
    sessionStorage.setItem('partner', JSON.stringify(receiver));
    this.partnerSubject.next(receiver);
  }

  getPartner() {
    return this.partnerSubject.value;
  }

  clearParnter() {
    sessionStorage.removeItem('partner');
    this.partnerSubject.next(null);
  }

  private loadFromSession() {
    const raw = sessionStorage.getItem('partner');
    return raw ? JSON.parse(raw) : null;
  }

  openLoader() {
    this.spinnerTimeout = setTimeout(() => {
      this.spinnerRef = this.dialogRef.open(LoadingComponent, {
        disableClose: true,
      });
    }, 300);
  }
  connect$() {
    return this.authService.getUser$().pipe(
      //Switches to the ws
      switchMap((user) => {
        //If a user is authenticated
        if (user) {
          this.wsSubject = webSocket({
            //Gets the ws url
            url: environment.wsUrl + 'messages',

            //What to do once the connection is opened
            openObserver: {
              next: () => {
                if (this.spinnerRef) this.spinnerRef.close();
                clearTimeout(this.spinnerTimeout);
                if (this.wsSubject)
                  this.wsSubject.next({
                    type: 'CONNECTION',
                    token: user.token,
                  });
              },
            },
          });
          return this.wsSubject;
        } else return EMPTY;
      })
    );
  }

  disconnect() {
    if (this.wsSubject) this.wsSubject.complete();
  }

  sendMsg(text: string) {
    const receiverId = this.getPartner()?.id;
    if (this.wsSubject && receiverId)
      this.wsSubject.next({
        type: 'UNSAVED',
        receiver: receiverId,
        text: text,
      });
  }

  receiveMsg$(msg: SavedMessage) {
    const belongsToConver =
      msg.message.senderId == this.getPartner()?.id ||
      msg.message.receiverId == this.getPartner()?.id;

    if (belongsToConver)
      this.messages.next([
        ...this.messages.value,
        {
          ...msg,
          message: {
            ...msg.message,
            isSentByCurrentUser: this.currentUserId === msg.message.senderId,
          },
        },
      ]);
  }

  retrieveMessages$() {
    const partnerId = this.getPartner()?.id;
    return partnerId
      ? this.http
          .get<{ messages: SavedMessage[] }>(
            environment.apiUrl + 'message/retrieveMessages',
            { params: { receiver: partnerId.toString() } }
          )
          .pipe(
            map((r) =>
              r.messages.map((m) => {
                return {
                  ...m,
                  message: {
                    ...m.message,
                    isSentByCurrentUser:
                      this.currentUserId === m.message.senderId,
                  },
                };
              })
            ),
            tap((messages) => {
              this.messages.next(messages);
            })
          )
      : EMPTY;
  }

  readMessages$() {
    const partnerId = this.getPartner()?.id;
    return partnerId
      ? this.http
          .post(environment.apiUrl + 'message/read', partnerId)
          .pipe(
            tap(() => this.chatHistoryService.readChat(this.getPartner()?.id))
          )
      : EMPTY;
  }
  clearChat(){
    this.messages.next([]);
  }
}
