import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { IUser } from '../Interfaces/IUser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, EMPTY, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../Components/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private recipient = new BehaviorSubject<
    { id: number; username: string } | undefined
  >(undefined);
  recipient$ = this.recipient.asObservable();

  spinnerRef: any;
  spinnerTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(private authService: AuthService, private dialogRef: MatDialog) {}

  setRecipient(id: number, username: string) {
    this.recipient.next({ id, username });
  }

  getReceiver$() {
    return this.recipient$;
  }

  openLoader() {
    this.spinnerTimeout = setTimeout(() => {
      this.spinnerRef = this.dialogRef.open(LoadingComponent, {
        disableClose: true,
      });
    }, 300);
  }
  connect$() {
    return combineLatest([this.recipient$, this.authService.user$]).pipe(
      switchMap(([recipient, user]) => {
        if (user) {
          const subject = webSocket({
            url: environment.wsUrl + '?token=' + user.token,
            serializer: (msg) =>
              JSON.stringify({ to: recipient?.id, msg: msg }),
            openObserver: {
              next: () => {
                if(this.spinnerRef)
                this.spinnerRef.close();
                clearTimeout(this.spinnerTimeout);
              },
            },
          });
          return subject;
        } else return EMPTY;
      })
    );
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
