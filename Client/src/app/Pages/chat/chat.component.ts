import { Component, OnInit, signal } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { IMessage } from '../../Interfaces/IMessage';
import { MessagesComponent } from '../../Components/chat/messages/messages.component';
import { InputBoxComponent } from '../../Components/chat/messages/input-box/input-box.component';
import { HeaderComponent } from '../../Components/map/header/header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [MessagesComponent, InputBoxComponent, HeaderComponent],
  template: `
    <app-header (currentUsername)="setCurrentUsername($event)" />
    <div class="container">
      <app-messages
        [recipientName]="this.recipientUsername"
        [messages]="messages()"
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
  recipientUsername!: string;
  senderUsername!: string;
  messages = signal<IMessage[] | undefined>(undefined);

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const recipientId = Number(params.get('userId'));
      if (recipientId) this.chatService.updateRecipient(recipientId);
    });

    this.chatService.openLoader();

    this.chatService.getRecipient$().subscribe((r) => {
      if (r) {
        this.recipientUsername = r.username;
      }
    });

    this.chatService.retrieveMessages$().subscribe((res) =>
      this.messages.set(
        //Map of the date received from the bd since its format is different in ts
        res.messages.map((m) => {
          return {
            ...m,
            ts: new Date(m.ts).toLocaleString(),
          };
        })
      )
    );

    this.chatService.connect$().subscribe((msg) => {
      //On message received update the messages
      this.messages.update((oldMessages) => {
        const now = new Date().toLocaleString();
        return oldMessages
          ? [
              ...oldMessages,
              { sender: this.recipientUsername, text: msg.msg, ts: now },
            ]
          : [{ sender: this.recipientUsername, text: msg.msg, ts: now }];
      });
    });
  }

  sendMsg(msg: string) {
    //Update the messages container and send it to the ws
    this.messages.update((oldMessages) => {
      const now = new Date().toLocaleString();
      return oldMessages
        ? [...oldMessages, { sender: this.senderUsername, text: msg, ts: now }]
        : [{ sender: this.senderUsername, text: msg, ts: now }];
    });
    this.chatService.sendMsg(msg);
  }
  setCurrentUsername(username: string) {
    this.senderUsername = username;
  }
}
