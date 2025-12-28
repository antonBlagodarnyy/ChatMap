import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { BehaviorSubject, EMPTY, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../Components/loading/loading.component';
import { HttpClient } from '@angular/common/http';
import { SavedMessage } from '../Interfaces/SavedMessage';
import { Message } from '../Interfaces/Mesage';
import { ChatPreview } from '../Interfaces/ChatPreview';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messages = new BehaviorSubject<SavedMessage[]>([]);
  messagesSubject$ = this.messages.asObservable();

  private receiverSubject = new BehaviorSubject<{
    id: number;
    username: string;
  } | null>(this.loadFromSession());
  receiver$ = this.receiverSubject.asObservable();

  setReceiver(id: number, username: string) {
    const receiver = { id, username };
    sessionStorage.setItem('receiver', JSON.stringify(receiver));
    this.receiverSubject.next(receiver);
  }

  getReceiver() {
    return this.receiverSubject.value;
  }

  clearRecipient() {
    sessionStorage.removeItem('receiver');
    this.receiverSubject.next(null);
  }

  private loadFromSession() {
    const raw = sessionStorage.getItem('receiver');
    return raw ? JSON.parse(raw) : null;
  }

  spinnerRef: any;
  spinnerTimeout: ReturnType<typeof setTimeout> | undefined;

  private wsSubject?: WebSocketSubject<Message>;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialog,
    private http: HttpClient
  ) {}

  openLoader() {
    this.spinnerTimeout = setTimeout(() => {
      this.spinnerRef = this.dialogRef.open(LoadingComponent, {
        disableClose: true,
      });
    }, 300);
  }
  connect$() {
    //Combines this recipient and current authenticated user
    return this.authService.getUser$().pipe(
      //Switches to the ws
      switchMap((user) => {
        //If a user is authenticated
        if (user && this.getReceiver()) {
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

  disconnect(){
    if(this.wsSubject)
      this.wsSubject.complete();
  }

  sendMsg(text: string) {
    const receiverId = this.getReceiver()?.id;
    if (this.wsSubject && receiverId)
      this.wsSubject.next({
        type: 'UNSAVED',
        receiver: receiverId,
        text: text,
      });
  }

  receiveMsg(msg: SavedMessage) {
    this.messages.next([...this.messages.value, msg]);
  }

  retrieveMessages$() {
    const receiverId = this.getReceiver()?.id;
    return receiverId
      ? this.http
          .get<{ messages: SavedMessage[] }>(
            environment.apiUrl + 'message/retrieveMessages',
            { params: { receiver: receiverId.toString() } }
          )
          .pipe(tap((r) => this.messages.next(r.messages)))
      : EMPTY;
  }

  chatHistory$() {
    return this.http.get<ChatPreview[]>(
      environment.apiUrl + 'message/retrieveChats'
    );
  }
}
