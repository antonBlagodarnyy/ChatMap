import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { MessagesComponent } from '../../Components/messages/messages.component';
import { InputBoxComponent } from '../../Components/messages/input-box/input-box.component';
import { HeaderComponent } from '../../Components/header/header.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat',
  imports: [MessagesComponent, InputBoxComponent, HeaderComponent],
  template: `
    <app-header />
    <div class="container">
      <app-messages
        [recipientName]="this.chatService.receiver?.username"
        [messages]="messages"
      /><app-input-box (sendMsgEvent)="sendMsg($event)" />
    </div>
  `,
  styles: `.container{
    height:80%;
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
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  messages = toSignal(this.chatService.messagesSubject$, { initialValue: [] });
  noRecipient = signal(false);

  constructor() {}

  ngOnInit(): void {
    const rId = sessionStorage.getItem('recipientId');
    const rUsername = sessionStorage.getItem('recipientUsername');
    if (rId && rUsername) {
      this.chatService.receiver = { id: Number(rId), username: rUsername };
      this.chatService.openLoader();

      this.chatService.retrieveMessages$().subscribe();

      this.chatService.connect$().subscribe((msg) => {
        if (msg.type == 'SAVED') {
          this.chatService.receiveMsg(msg);
        }
      });
    } else this.noRecipient.set(true);
  }

  sendMsg(msg: string) {
    this.chatService.sendMsg(msg);
  }
}
