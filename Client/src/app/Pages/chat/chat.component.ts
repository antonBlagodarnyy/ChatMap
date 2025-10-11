import { Component, OnInit, signal } from '@angular/core';
import { ChatService } from '../../Services/chat.service';

import { IMessage } from '../../Interfaces/IMessage';
/* import { Message } from '@stomp/stompjs'; */
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { MessagesComponent } from '../../Components/chat/messages/messages.component';
import { InputBoxComponent } from '../../Components/chat/messages/input-box/input-box.component';
import { HeaderComponent } from "../../Components/map/header/header.component";

@Component({
  selector: 'app-chat',
  imports: [MessagesComponent, InputBoxComponent, HeaderComponent],
  template: `
  <app-header/>
    <div class="container">
      <app-messages [messages]="messages.getValue()" /><app-input-box />
    </div>
  `,
  styles: `.container{
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  
  }
  app-messages{
    width:80%;
  }
  app-input-box{
    width:90%;
  }`,
})
export class ChatComponent /* implements OnInit */ {
  messages = new BehaviorSubject<IMessage[] | undefined>(undefined);

  constructor(private chatService: ChatService, private dialogRef: MatDialog) {}

/*   ngOnInit(): void {
    let spinnerRef: any;
    let spinnerTimeout: ReturnType<typeof setTimeout>;

    // wait 300ms before showing spinner
    spinnerTimeout = setTimeout(() => {
      spinnerRef = this.dialogRef.open(LoadingComponent, {
        disableClose: true,
      });
    }, 300);

    this.chatService.getNickname();

    //Tries to connect to the ws and gets the connection
    const ws = this.chatService.connect();

    //Combine the messages and the ws connection in to one
    const serverConnected = combineLatest({
      ws: ws.connected$,
      msg: this.messages,
    });

    //Once both are established, close spinner
    serverConnected.subscribe((value) => {
      if (value.ws && value.msg) {
        clearTimeout(spinnerTimeout);
        if (spinnerRef) spinnerRef.close();
      }
    });

    //Subscribe to new msgs
    ws?.watch('/topic/messages').subscribe((message: Message) => {
      const msg = JSON.parse(message.body);
      if (this.messages)
        this.messages.next([...(this.messages.getValue() ?? []), msg]);
    });

    //Get previous msgs
    this.chatService
      .getMsgs()
      .pipe(
        retry({ delay: 3000 }) // retry up to 3 times before failing
      )
      .subscribe((messages) => {
        this.messages.next(messages);
      });
  } */
}
