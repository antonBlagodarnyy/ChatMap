import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { IUser } from '../Interfaces/IUser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  EMPTY,
  filter,
  map,
  mergeMap,
  pairwise,
  switchMap,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../Components/loading/loading.component';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

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

  private wsSubject?: WebSocketSubject<any>;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialog,
    private userService: UserService,
    private http: HttpClient
  ) {}

  updateRecipient(recipientId: number) {
    if (recipientId)
      this.userService
        .getUserDataById$(+recipientId)
        .subscribe((u) => this.setRecipient(+recipientId, u.username));
  }
  setRecipient(id: number, username: string) {
    this.recipient.next({ id, username });
  }

  getRecipient$() {
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
    //Combines this recipient and current authenticated user
    return combineLatest([
      this.getRecipient$(),
      this.authService.getUser$(),
    ]).pipe(
      //Switches to the ws
      switchMap(([recipient, user]) => {
        //If a user is authenticated
        if (user) {
          this.wsSubject = webSocket({
            //Gets the ws url
            url: environment.wsUrl + '?token=' + user.token,
            //How to process outgoing messages
            serializer: (res) => {
              return JSON.stringify({ to: recipient?.id, msg: res });
            },

            //What to do once the connection is opened
            openObserver: {
              next: () => {
                if (this.spinnerRef) this.spinnerRef.close();
                clearTimeout(this.spinnerTimeout);
              },
            },
          });
          return this.wsSubject;
        } else return EMPTY;
      })
    );
  }

  sendMsg(msg: string) {
    if (this.wsSubject) this.wsSubject.next(msg);
  }

  retrieveMessages$() {
    return this.getRecipient$().pipe(
      filter(Boolean),
      switchMap((r) => {
        console.log(r);
        return this.http.get<{messages:[]}>(environment.apiUrl + 'message/retrieve/' + r?.id);
      })
    );
  }
}
